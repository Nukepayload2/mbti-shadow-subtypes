<script setup lang="ts">
import QuestionCard from '../components/QuestionCard.vue'
import type { ShadowAnswers } from '../types'

const props = defineProps<{
  questions: any[]
  answers: ShadowAnswers
  answeredCount: number
  totalCount: number
  progressPercent: number
  isComplete: boolean
}>()

const emit = defineEmits<{
  answer: [questionId: string, value: string[]]
  submit: []
  back: []
}>()

function handleAnswer(questionId: string, value: string[]) {
  emit('answer', questionId, value)
}

function getAnswer(qId: string): string[] | undefined {
  return props.answers[qId]
}
</script>

<template>
  <section class="test-wrap card">
    <div class="topbar">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <span class="progress-text">{{ answeredCount }} / {{ totalCount }}</span>
    </div>

    <div class="question-list">
      <!-- 规则卡片 -->
      <div v-if="answeredCount === 0" class="rules-card">
        <h3>规则说明</h3>
        <ul>
          <li>每道题描述一个场景中某人正在面临的压力</li>
          <li>灰色小字是 ta 此刻的环境——每个 NPC 都在压力之下</li>
          <li>请选择 ta 脑子里真正在想什么</li>
          <li>可以多选——多选代表"这几个差不多 equally close"</li>
          <li>"都不是" = 以上选项都不合适</li>
        </ul>
      </div>

      <QuestionCard
        v-for="(q, i) in questions"
        :key="q.id"
        :question="q"
        :index="i"
        :model-value="getAnswer(q.id)"
        @update:model-value="(v: string[]) => handleAnswer(q.id, v)"
      />
    </div>

    <div class="actions-bottom">
      <span class="hint" v-if="!isComplete">全选完才会放行。世界已经够乱的，起码把题做完整。</span>
      <div class="btn-row">
        <button class="btn-secondary" @click="emit('back')">返回首页</button>
        <button class="btn-primary" :disabled="!isComplete" @click="emit('submit')">
          提交并查看结果
        </button>
      </div>
    </div>
  </section>
</template>
