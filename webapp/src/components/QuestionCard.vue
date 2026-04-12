<script setup lang="ts">
import type { ShadowQuestion } from '../types'

const props = defineProps<{
  question: ShadowQuestion
  index: number
  modelValue: string[] | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const optionCodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

function isSelected(opt: any): boolean {
  const fn = opt.fn
  return Array.isArray(props.modelValue) && props.modelValue.includes(fn)
}

function handleSelect(opt: any) {
  const fnVal = opt.fn
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []

  if (fnVal === 'none') {
    // 选中"都不是"时清除所有函数选项
    emit('update:modelValue', current.includes('none') ? [] : ['none'])
  } else {
    // 选中函数选项时清除"都不是"
    const filtered = current.filter(v => v !== 'none')
    const idx = filtered.indexOf(fnVal)
    if (idx >= 0) {
      filtered.splice(idx, 1)
    } else {
      filtered.push(fnVal)
    }
    emit('update:modelValue', filtered)
  }
}
</script>

<template>
  <article class="question">
    <div class="question-meta">
      <span class="badge">第 {{ index + 1 }} 题</span>
      <span class="dim-tag">组 {{ question.group }}</span>
      <span class="multi-hint">可多选</span>
    </div>
    <div class="question-title">{{ question.text }}</div>
    <div v-if="question.context" class="question-context">
      {{ question.context }}
    </div>
    <div class="options">
      <label
        v-for="(opt, i) in question.options"
        :key="i"
        class="option"
        :class="{ selected: isSelected(opt) }"
        @click="handleSelect(opt)"
      >
        <span class="option-code">{{ optionCodes[i] }}</span>
        <span>{{ opt.label }}</span>
      </label>
    </div>
  </article>
</template>
