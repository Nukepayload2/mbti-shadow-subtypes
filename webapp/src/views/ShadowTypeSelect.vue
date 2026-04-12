<script setup lang="ts">
import { ref, computed } from 'vue'

const ALL_TYPES = [
  'INTJ', 'INTP', 'INFJ', 'INFP',
  'ISTJ', 'ISTP', 'ISFJ', 'ISFP',
  'ENTJ', 'ENTP', 'ENFJ', 'ENFP',
  'ESTJ', 'ESTP', 'ESFJ', 'ESFP',
]

const selected = ref<string[]>([])
const rejectAll = ref(false)

const isValid = computed(() => selected.value.length > 0 || rejectAll.value)

function toggleType(code: string) {
  if (rejectAll.value) {
    rejectAll.value = false
  }
  const idx = selected.value.indexOf(code)
  if (idx >= 0) {
    selected.value.splice(idx, 1)
  } else if (selected.value.length < 4) {
    selected.value.push(code)
  }
}

function toggleRejectAll() {
  rejectAll.value = !rejectAll.value
  if (rejectAll.value) {
    selected.value = []
  }
}

const emit = defineEmits<{
  confirm: [selectedTypes: string[]]
  back: []
}>()

function handleConfirm() {
  if (!isValid.value) return
  emit('confirm', rejectAll.value ? [] : [...selected.value])
}
</script>

<template>
  <section class="type-select-wrap card">
    <h2 class="type-select-title">你认同自己属于哪些 MBTI 类型？</h2>
    <p class="type-select-sub">至少选一项，建议只选一项。如果不知道请先去测试 MBTI 类型。如果实在不确定，可以多选。</p>

    <div class="type-grid">
      <button
        v-for="code in ALL_TYPES"
        :key="code"
        class="type-btn"
        :class="{ active: selected.includes(code) }"
        :disabled="!selected.includes(code) && selected.length >= 4 && !rejectAll"
        @click="toggleType(code)"
      >
        {{ code }}
      </button>
    </div>

    <div class="reject-row">
      <button
        class="reject-btn"
        :class="{ active: rejectAll }"
        @click="toggleRejectAll"
      >
        都不认同
      </button>
    </div>

    <div class="type-select-hint" v-if="selected.length > 0">
      已选 {{ selected.length }}{{ selected.length >= 4 ? ' 项（上限）' : ' 项' }}：{{ selected.join('、') }}
    </div>
    <div class="type-select-hint" v-else-if="rejectAll">
      你选择了"都不认同"
    </div>

    <div class="type-select-actions">
      <button class="btn-secondary" @click="emit('back')">返回</button>
      <button class="btn-primary" :disabled="!isValid" @click="handleConfirm">确定</button>
    </div>
  </section>
</template>

<style scoped>
.type-select-wrap {
  padding: 24px;
}
.type-select-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
  text-align: center;
}
.type-select-sub {
  font-size: 13px;
  color: #888;
  text-align: center;
  margin-bottom: 20px;
}
.type-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
}
.type-btn {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: 0.03em;
}
.type-btn:hover:not(:disabled) {
  border-color: #7a6a9a;
  color: #7a6a9a;
}
.type-btn.active {
  background: #7a6a9a;
  border-color: #7a6a9a;
  color: #fff;
}
.type-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.reject-row {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.reject-btn {
  padding: 6px 20px;
  border: 1px dashed #bbb;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  color: #888;
  cursor: pointer;
  transition: all 0.15s ease;
}
.reject-btn:hover {
  border-color: #999;
  color: #666;
}
.reject-btn.active {
  background: #f5f5f5;
  border-style: solid;
  border-color: #999;
  color: #555;
}
.type-select-hint {
  font-size: 12px;
  color: #888;
  text-align: center;
  margin-bottom: 16px;
}
.type-select-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
