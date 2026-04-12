<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScreen } from './composables/useScreen'
import { useShadowScoring } from './composables/useShadowScoring'
import IntroView from './views/IntroView.vue'
import TestView from './views/TestView.vue'
import ShadowResultView from './views/ShadowResultView.vue'
import ShadowTypeSelect from './views/ShadowTypeSelect.vue'
import type { ShadowAnswers, ShadowComputeResult } from './types'
import { shadowQuestions } from './data/shadow-questions'

const { currentScreen, showScreen } = useScreen()

// ─── 阴影模式状态 ─────────────────────────────────
const shadowAnswers = ref<ShadowAnswers>({})
const shuffledShadowQuestions = ref<any[]>([])

const shadowAnsweredCount = computed(() =>
  shuffledShadowQuestions.value.filter(q => shadowAnswers.value[q.id] !== undefined).length
)
const shadowTotalCount = computed(() => shuffledShadowQuestions.value.length)
const shadowProgressPercent = computed(() =>
  shadowTotalCount.value ? Math.round((shadowAnsweredCount.value / shadowTotalCount.value) * 100) : 0
)
const shadowIsComplete = computed(() =>
  shuffledShadowQuestions.value.every(q => shadowAnswers.value[q.id] !== undefined)
)
const shadowResult = ref<ShadowComputeResult | null>(null)
const shadowSelectedTypes = ref<string[]>([])

// ─── Fisher-Yates 洗牌 ─────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ─── 事件处理 ─────────────────────────────────────
function handleStart() {
  shadowAnswers.value = {}
  shadowResult.value = null
  shadowSelectedTypes.value = []
  showScreen('shadowSelect')
}

function handleTypeSelectConfirm(types: string[]) {
  shadowSelectedTypes.value = types

  if (types.length === 0) {
    shadowResult.value = buildAntiLabelResult()
    showScreen('result')
    return
  }

  shuffledShadowQuestions.value = shuffleArray(shadowQuestions as any[])
  showScreen('test')
}

function buildAntiLabelResult(): ShadowComputeResult {
  return {
    typeCode: 'NONE',
    typeName: '反标签者',
    nickname: '反标签者',
    topShadowFn: '-',
    parentGuidance: '未知',
    allowedTypes: [],
    functions: { pos1: '', pos2: '', pos3: '', pos4: '', pos5: '', pos6: '', pos7: '', pos8: '' },
    confidence: [],
    positionDescriptions: {},
    desc: '你反对被标签化，我们尊重你的决定。你的类型不属于其它任何分类，这是你自己的选择。',
  }
}

function handleAnswer(questionId: string, value: string[]) {
  shadowAnswers.value[questionId] = value
}

function handleSubmit() {
  const { result } = useShadowScoring(
    { value: { ...shadowAnswers.value } },
    { allowedTypes: shadowSelectedTypes.value },
  )
  shadowResult.value = result.value
  showScreen('result')
}

function handleRestart() {
  shadowAnswers.value = {}
  shadowResult.value = null
  shadowSelectedTypes.value = []
  showScreen('shadowSelect')
}

function handleHome() {
  shadowResult.value = null
  showScreen('intro')
}
</script>

<template>
  <van-config-provider :theme-vars="{
    primaryColor: '#4d6a53',
    primaryColorLight: '#6c8d71',
    buttonPrimaryBackgroundColor: '#4d6a53',
    buttonPrimaryBorderColor: '#4d6a53',
    buttonBorderRadiusMax: '14px',
    radioCheckedIconColor: '#4d6a53',
    progressColor: '#5b7a62',
    progressTrackColor: '#edf3ee',
    collapseItemContentPadding: '0 18px 18px',
  }">
    <div class="shell">
      <IntroView
        v-if="currentScreen === 'intro'"
        @start="handleStart"
      />
      <ShadowTypeSelect
        v-else-if="currentScreen === 'shadowSelect'"
        @confirm="handleTypeSelectConfirm"
        @back="showScreen('intro')"
      />
      <TestView
        v-else-if="currentScreen === 'test'"
        :questions="shuffledShadowQuestions"
        :answers="shadowAnswers"
        :answered-count="shadowAnsweredCount"
        :total-count="shadowTotalCount"
        :progress-percent="shadowProgressPercent"
        :is-complete="shadowIsComplete"
        @answer="handleAnswer"
        @submit="handleSubmit"
        @back="showScreen('intro')"
      />
      <ShadowResultView
        v-else-if="currentScreen === 'result' && shadowResult"
        :result="shadowResult"
        @restart="handleRestart"
        @home="handleHome"
      />
    </div>
  </van-config-provider>
</template>
