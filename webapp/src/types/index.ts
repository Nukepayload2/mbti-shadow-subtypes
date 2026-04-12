/** 屏幕名称 */
export type ScreenName = 'intro' | 'shadowSelect' | 'test' | 'result'

/** 阴影题目分组 */
export type ShadowGroup = 'A' | 'B' | 'C' | 'D'

/** 阴影题目选项（映射到认知功能或"都不是"） */
export interface ShadowOption {
  label: string
  fn: string  // 'Ne'|'Ni'|'Se'|'Si'|'Te'|'Ti'|'Fe'|'Fi'|'none'
  pos?: number // 5-8，阴影功能位置，仅当 fn !== 'none' 时存在
}

/** 阴影模式题目 */
export interface ShadowQuestion {
  id: string
  group: ShadowGroup
  text: string
  context?: string
  options: ShadowOption[]
}

/** 阴影模式多选答案 */
export type ShadowAnswers = Record<string, string[]>

/** 阴影模式二分维度置信度 */
export interface ShadowConfidence {
  letter: string
  percentage: number
}

/** 阴影功能栈 */
export interface ShadowFunctionStack {
  pos1: string; pos2: string; pos3: string; pos4: string
  pos5: string; pos6: string; pos7: string; pos8: string
}

/** 阴影模式结果 */
export interface ShadowComputeResult {
  typeCode: string
  typeName: string
  nickname: string
  topShadowFn: string
  parentGuidance: string
  allowedTypes: string[]
  functions: ShadowFunctionStack
  confidence: ShadowConfidence[]
  positionDescriptions: Record<string, string>
  desc: string
}

/** 阴影昵称子类型 */
export interface ShadowSubtype {
  name: string
  desc: string
}

/** MBTI 类型数据 */
export interface MbtiTypeData {
  code: string
  functions: string[]
  pos5Desc: string
  pos6Desc: string
  pos7Desc: string
  pos8Desc: string
  parentGuidance: string
}
