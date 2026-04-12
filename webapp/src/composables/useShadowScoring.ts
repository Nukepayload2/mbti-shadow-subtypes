import { computed } from 'vue'
import type { ShadowAnswers, ShadowComputeResult, ShadowConfidence, ShadowFunctionStack } from '../types'
import { mbtiTypes, positionNames, SHADOW_GROUP_OPTIONS, shadowQuestions, TYPE_SHADOW_NICKNAMES } from '../data/shadow-data'

// ═══ 常量 ═══

const ALL_FUNCTIONS = ['Ne', 'Ni', 'Se', 'Si', 'Te', 'Ti', 'Fe', 'Fi'] as const

/** 功能 → 所属分组 */
const FN_TO_GROUPS: Record<string, string[]> = {
  Ni: ['A', 'C'], Ne: ['A', 'D'],
  Si: ['A', 'C'], Se: ['A', 'D'],
  Ti: ['B', 'C'], Te: ['B', 'D'],
  Fi: ['B', 'C'], Fe: ['B', 'D'],
}

/** 功能 → 轴 (N/S/T/F) */
const FN_AXIS: Record<string, string> = {
  Ne: 'N', Ni: 'N', Se: 'S', Si: 'S',
  Te: 'T', Ti: 'T', Fe: 'F', Fi: 'F',
}

/** 16 种 MBTI 类型的阴影功能栈 [pos5, pos6, pos7, pos8] */
const TYPE_SHADOW_MAP: Record<string, string[]> = {
  INTJ: ['Ne', 'Ti', 'Fe', 'Si'],
  INTP: ['Te', 'Ni', 'Se', 'Fi'],
  INFJ: ['Ne', 'Fi', 'Te', 'Si'],
  INFP: ['Fe', 'Ni', 'Se', 'Ti'],
  ISTJ: ['Se', 'Ti', 'Fe', 'Ni'],
  ISTP: ['Te', 'Si', 'Ne', 'Fi'],
  ISFJ: ['Se', 'Fi', 'Te', 'Ni'],
  ISFP: ['Fe', 'Si', 'Ne', 'Ti'],
  ENTJ: ['Ti', 'Ne', 'Si', 'Fe'],
  ENTP: ['Ni', 'Te', 'Fi', 'Se'],
  ENFJ: ['Fi', 'Ne', 'Si', 'Te'],
  ENFP: ['Ni', 'Fe', 'Ti', 'Se'],
  ESTJ: ['Ti', 'Se', 'Ni', 'Fe'],
  ESTP: ['Si', 'Te', 'Fi', 'Ne'],
  ESFJ: ['Fi', 'Se', 'Ni', 'Te'],
  ESFP: ['Si', 'Fe', 'Ti', 'Ne'],
}

// ═══ 内部类型 ═══

interface TypeMatch {
  typeCode: string
  matchScore: number       // 精确匹配的位置数 (0-4)
  axisScore: number        // 轴兼容得分 (0-8)
  similarity: number       // 加权相似度 (0-100)
}

// ═══ 工具函数 ═══

function emptyScores(): Record<string, number> {
  const s: Record<string, number> = {}
  for (const fn of ALL_FUNCTIONS) s[fn] = 0
  return s
}

// ═══ 算法 ═══

/** 阶段 1：按组分统计，多选分数均分 */
function tallyByGroup(answers: ShadowAnswers): Record<string, Record<string, number>> {
  // group -> fn -> weighted count
  const tallies: Record<string, Record<string, number>> = {}
  for (const g of Object.keys(SHADOW_GROUP_OPTIONS)) {
    tallies[g] = emptyScores()
  }

  for (const q of shadowQuestions) {
    const selected = answers[q.id]
    if (!selected || selected.length === 0) continue

    // 过滤掉 "none"
    const fns = selected.filter(fn => fn !== 'none')
    if (fns.length === 0) continue

    const weight = 1 / fns.length
    for (const fn of fns) {
      tallies[q.group][fn] += weight
    }
  }

  return tallies
}

/** 阶段 2：合并每功能在两组的得分，排名得到阴影位置 5-8 */
function computeFunctionScores(tallies: Record<string, Record<string, number>>): {
  scores: Record<string, number>
  ranked: string[]           // 从高到低
  groupVariance: Record<string, number>  // 每功能跨组方差（用于平局打破）
} {
  const scores = emptyScores()
  const groupValues: Record<string, number[]> = {}

  for (const fn of ALL_FUNCTIONS) {
    const groups = FN_TO_GROUPS[fn]
    let total = 0
    const vals: number[] = []
    for (const g of groups) {
      const v = tallies[g]?.[fn] ?? 0
      total += v
      vals.push(v)
    }
    scores[fn] = total
    groupValues[fn] = vals
  }

  // 计算跨组方差（越小越一致）
  const groupVariance: Record<string, number> = {}
  for (const fn of ALL_FUNCTIONS) {
    const vals = groupValues[fn]
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    groupVariance[fn] = vals.reduce((s, v) => s + (v - avg) ** 2, 0) / vals.length
  }

  // 排名：得分高在前；平局时方差小的在前（更一致）；再平局按字母序
  const ranked = [...ALL_FUNCTIONS].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a]
    if (groupVariance[a] !== groupVariance[b]) return groupVariance[a] - groupVariance[b]
    return a.localeCompare(b)
  })

  return { scores, ranked, groupVariance }
}

/** 阶段 3：将函数排名匹配到 MBTI 类型（可限定候选范围） */
function matchAllTypes(
  ranked: string[],
  scores: Record<string, number>,
  allowedTypes?: string[],
): TypeMatch[] {
  // ranked[0] = 位置5（最高频阴影功能），ranked[3] = 位置8
  const userShadow = [ranked[0], ranked[1], ranked[2], ranked[3]]

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1
  // 每个位置对应的置信度（该函数得分占总分的比例）
  const posConfidences = userShadow.map(fn => (scores[fn] ?? 0) / totalScore)

  const results: TypeMatch[] = []

  for (const [typeCode, typeShadow] of Object.entries(TYPE_SHADOW_MAP)) {
    if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(typeCode)) continue
    let matchCount = 0
    let axisScore = 0
    let weightedMatch = 0

    for (let i = 0; i < 4; i++) {
      const userFn = userShadow[i]
      const typeFn = typeShadow[i]
      const posConf = posConfidences[i]

      if (userFn === typeFn) {
        matchCount++
        axisScore += 2
        weightedMatch += posConf
      } else if (FN_AXIS[userFn] === FN_AXIS[typeFn]) {
        axisScore += 1
        weightedMatch += posConf * 0.4
      }
    }

    results.push({
      typeCode,
      matchScore: matchCount,
      axisScore,
      similarity: Math.round((weightedMatch / 4) * 100),
    })
  }

  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
    if (b.axisScore !== a.axisScore) return b.axisScore - a.axisScore
    return b.similarity - a.similarity
  })

  return results
}

/** 构建阴影功能强度 */
function buildConfidence(
  typeCode: string,
  _ranked: string[],
  scores: Record<string, number>,
): ShadowConfidence[] {
  const typeShadowFns = TYPE_SHADOW_MAP[typeCode]
  if (!typeShadowFns || typeShadowFns.length === 0) {
    return ['Ne', 'Ti', 'Fe', 'Si'].map(fn => ({ letter: fn, percentage: 25 }))
  }

  const total = typeShadowFns.reduce((sum, fn) => sum + (scores[fn] ?? 0), 0) || 1
  return typeShadowFns.map(fn => ({
    letter: fn,
    percentage: Math.round(((scores[fn] ?? 0) / total) * 100),
  }))
}

/** 构建完整功能栈 */
function buildFunctionStack(typeCode: string): ShadowFunctionStack {
  const t = mbtiTypes[typeCode]
  if (!t) {
    return { pos1: '', pos2: '', pos3: '', pos4: '', pos5: '', pos6: '', pos7: '', pos8: '' }
  }
  return {
    pos1: t.functions[0], pos2: t.functions[1],
    pos3: t.functions[2], pos4: t.functions[3],
    pos5: t.functions[4], pos6: t.functions[5],
    pos7: t.functions[6], pos8: t.functions[7],
  }
}

// ═══ 导出的 composable ═══

export function useShadowScoring(
  answers: { value: ShadowAnswers },
  options?: { allowedTypes?: string[] },
) {
  const allowed = options?.allowedTypes
  const tallies = computed(() => tallyByGroup(answers.value))

  const functionResults = computed(() => computeFunctionScores(tallies.value))

  const typeMatches = computed(() =>
    matchAllTypes(functionResults.value.ranked, functionResults.value.scores, allowed)
  )

  const result = computed((): ShadowComputeResult => {
    const matches = typeMatches.value
    const best = matches[0]
    if (!best) {
      return {
        typeCode: '????',
        typeName: '未知类型',
        nickname: '未知生物',
        topShadowFn: '??',
        parentGuidance: '',
        allowedTypes: allowed ?? Object.keys(TYPE_SHADOW_MAP),
        functions: { pos1: '', pos2: '', pos3: '', pos4: '', pos5: '', pos6: '', pos7: '', pos8: '' },
        confidence: [
          { letter: '?', percentage: 50 },
          { letter: '?', percentage: 50 },
          { letter: '?', percentage: 50 },
          { letter: '?', percentage: 50 },
        ],
        positionDescriptions: {},
        desc: '无法确定类型，请重新测试。',
      }
    }

    const typeCode = best.typeCode
    const t = mbtiTypes[typeCode]
    const ranked = functionResults.value.ranked
    const typeShadowFns = TYPE_SHADOW_MAP[typeCode] ?? []
    const fnScores = functionResults.value.scores
    const topShadowFn = typeShadowFns.reduce((a, b) => (fnScores[b] ?? 0) > (fnScores[a] ?? 0) ? b : a, typeShadowFns[0])
    const subtype = TYPE_SHADOW_NICKNAMES[typeCode]?.[topShadowFn]
    const nickname = subtype?.name ?? typeCode

    return {
      typeCode,
      typeName: subtype?.name ?? typeCode,
      nickname,
      topShadowFn,
      parentGuidance: t?.parentGuidance ?? '',
      allowedTypes: allowed ?? Object.keys(TYPE_SHADOW_MAP),
      functions: buildFunctionStack(typeCode),
      confidence: buildConfidence(typeCode, ranked, functionResults.value.scores),
      positionDescriptions: t
        ? {
            [positionNames[5]]: t.pos5Desc,
            [positionNames[6]]: t.pos6Desc,
            [positionNames[7]]: t.pos7Desc,
            [positionNames[8]]: t.pos8Desc,
          }
        : {},
      desc: subtype?.desc ?? '',
    }
  })

  return { typeMatches, result }
}
