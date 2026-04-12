<script setup lang="ts">
import { ref } from 'vue'
import type { ShadowComputeResult } from '../types'
import { TYPE_SHADOW_NICKNAMES } from '../data/shadow-data'

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

const props = defineProps<{
  result: ShadowComputeResult
}>()

const emit = defineEmits<{
  restart: []
  home: []
}>()

// ─── 探索其他类型 ────────────────────────────────
const ALL_TYPE_CODES = Object.keys(TYPE_SHADOW_NICKNAMES)
const exploreType = ref('')
const exploreSubFn = ref('')

function getTypeDesc(code: string, fn: string) { return TYPE_SHADOW_NICKNAMES[code]?.[fn]?.desc ?? '' }
function getShadowFns(code: string) { return TYPE_SHADOW_MAP[code] ?? [] }
function getNickname(code: string, fn: string) {
  return TYPE_SHADOW_NICKNAMES[code]?.[fn]?.name ?? ''
}
</script>

<template>
  <section class="result-wrap card">
    <div class="result-layout">
      <!-- 头部 -->
      <div class="result-top shadow-top">
        <div class="type-box">
          <div class="type-kicker">你的阴影人格</div>
          <div class="type-name shadow-nickname">{{ result.nickname }}</div>
          <div class="type-sub">{{ result.typeCode }}</div>
          <div class="top-shadow-tag">最强阴影功能：{{ result.topShadowFn }}</div>
        </div>
      </div>

      <!-- 意识 + 阴影功能栈 -->
      <div class="stack-box">
        <h3>认知功能栈</h3>
        <div class="stack-row">
          <span class="stack-label">意识 (1-4)</span>
          <div class="stack-chips">
            <span class="chip conscious" v-for="n in [1,2,3,4]" :key="n">
              <span class="chip-pos">{{ n }}</span>{{ (result.functions as any)['pos'+n] }}
            </span>
          </div>
        </div>
        <div class="stack-row">
          <span class="stack-label">阴影 (5-8)</span>
          <div class="stack-chips">
            <span class="chip shadow" v-for="n in [5,6,7,8]" :key="n">
              <span class="chip-pos">{{ n }}</span>{{ (result.functions as any)['pos'+n] }}
            </span>
          </div>
        </div>
      </div>

      <!-- 阴影功能强度 -->
      <div class="confidence-box">
        <h3>阴影功能偏好概率权重</h3>
        <div class="conf-item" v-for="c in result.confidence" :key="c.letter">
          <span class="conf-fn">{{ c.letter }}</span>
          <div class="conf-bar">
            <div class="conf-fill" :style="{ width: c.percentage + '%' }"></div>
          </div>
          <span class="conf-pct">{{ c.percentage }}%</span>
        </div>
      </div>

      <!-- 阴影描述 -->
      <div class="analysis-box">
        <h3>你的阴影画像</h3>
        <p>{{ result.desc }}</p>
      </div>

      <!-- 如何从阴影中回来 -->
      <div class="guidance-box">
        <h3>如何从阴影中回来</h3>
        <p>{{ result.parentGuidance }}</p>
      </div>

      <!-- 各位置详细解读 -->
      <div class="positions-box">
        <div class="pos-item" v-for="(desc, label) in result.positionDescriptions" :key="label">
          <h4>{{ label }}</h4>
          <p>{{ desc }}</p>
        </div>
      </div>

      <!-- 提示 -->
      <div class="note-box">
        <h3>友情提示</h3>
        <p>本测试的题目和解读 99.7% 由 AI 根据参考资料生成，并非专业评估。你可以用它提醒自己是否陷入了阴影，或者偷偷嘲笑别人的测试结果有多滑稽。但是不要用它限制自己，即使是阴影功能也有潜力锻炼出较强的能力，来守护对应的阳面功能。</p>
      </div>

      <!-- 更多信息（折叠） -->
      <details class="explore-section">
        <summary class="explore-summary">更多信息</summary>
        <div class="explore-content">
          <h4>看看其他类型的阴影人格</h4>
          <div class="explore-type-grid">
            <button
              v-for="code in ALL_TYPE_CODES"
              :key="code"
              class="explore-type-btn"
              :class="{ active: exploreType === code }"
              @click="exploreType = exploreType === code ? '' : code; exploreSubFn = ''"
            >
              {{ code }}
            </button>
          </div>
          <div v-if="exploreType" class="explore-subtypes">
            <div class="explore-sub-grid">
              <button
                v-for="fn in getShadowFns(exploreType)"
                :key="fn"
                class="explore-sub-btn"
                :class="{ active: exploreSubFn === fn }"
                @click="exploreSubFn = exploreSubFn === fn ? '' : fn"
              >
                {{ fn }} · {{ getNickname(exploreType, fn) }}
              </button>
            </div>
            <div v-if="exploreSubFn" class="explore-portrait">
              {{ getTypeDesc(exploreType, exploreSubFn) }}
            </div>
          </div>
        </div>
      </details>
    </div>

    <div class="result-actions">
      <button class="btn-secondary" @click="emit('restart')">重新测试</button>
      <button class="btn-primary" @click="emit('home')">回到首页</button>
    </div>
  </section>
</template>

<style scoped>
.shadow-top {
  text-align: center;
  padding: 24px 0;
}
.mbti-code {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #4d6a53;
  margin: 8px 0;
}
.type-sub {
  font-size: 1.1rem;
  color: #888;
}
.shadow-nickname {
  font-size: 2.6rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #7a6a9a;
  margin: 8px 0;
}
.top-shadow-tag {
  display: inline-block;
  margin-top: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: #7a6a9a;
  background: #f0eef3;
}
.guidance-box {
  margin: 16px 0;
  padding: 16px 18px;
  background: #f3f8f4;
  border-radius: 10px;
  border-left: 3px solid #4d6a53;
}
.guidance-box h3 {
  font-size: 15px;
  color: #4d6a53;
  margin-bottom: 8px;
}
.guidance-box p {
  font-size: 14px;
  line-height: 1.85;
  color: #555;
}
.stack-box {
  margin: 16px 0;
}
.stack-box h3 {
  margin-bottom: 12px;
}
.stack-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.stack-label {
  flex-shrink: 0;
  width: 80px;
  font-size: 0.85rem;
  color: #888;
}
.stack-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}
.chip.conscious {
  background: #edf3ee;
  color: #4d6a53;
}
.chip.shadow {
  background: #f0eef3;
  color: #7a6a9a;
}
.chip-pos {
  font-size: 0.7rem;
  opacity: 0.6;
}
.confidence-box {
  margin: 16px 0;
}
.confidence-box h3 {
  margin-bottom: 12px;
}
.conf-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.conf-fn {
  flex-shrink: 0;
  width: 26px;
  font-weight: 700;
  font-size: 0.9rem;
  color: #7a6a9a;
}
.conf-bar {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}
.conf-fill {
  height: 100%;
  background: #4d6a53;
  border-radius: 4px;
  transition: width 0.3s ease;
}
.conf-pct {
  width: 40px;
  text-align: right;
  font-size: 0.85rem;
  color: #888;
}
.positions-box {
  margin: 16px 0;
}
.pos-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #f9f8fc;
  border-radius: 10px;
  border-left: 3px solid #7a6a9a;
}
.pos-item h4 {
  font-size: 0.95rem;
  color: #7a6a9a;
  margin-bottom: 6px;
}
.pos-item p {
  font-size: 0.9rem;
  line-height: 1.6;
}
.explore-section {
  margin: 16px 0;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
}
.explore-summary {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  user-select: none;
  background: #fafafa;
  list-style: none;
}
.explore-summary::-webkit-details-marker { display: none; }
.explore-content {
  padding: 16px;
}
.explore-content h4 {
  font-size: 14px;
  margin-bottom: 12px;
  color: #7a6a9a;
}
.explore-type-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.explore-type-btn {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.15s ease;
}
.explore-type-btn:hover {
  border-color: #7a6a9a;
  color: #7a6a9a;
}
.explore-type-btn.active {
  background: #7a6a9a;
  border-color: #7a6a9a;
  color: #fff;
}
.explore-subtypes {
  padding-top: 8px;
  border-top: 1px solid #eee;
}
.explore-sub-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}
.explore-sub-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  color: #999;
  cursor: pointer;
  transition: all 0.15s ease;
}
.explore-sub-btn:hover {
  border-color: #7a6a9a;
  color: #7a6a9a;
}
.explore-sub-btn.active {
  background: #7a6a9a;
  border-color: #7a6a9a;
  color: #fff;
}
.explore-portrait {
  padding: 12px;
  background: #f9f8fc;
  border-radius: 8px;
  border-left: 3px solid #7a6a9a;
  font-size: 13px;
  line-height: 1.8;
  color: #666;
}
</style>
