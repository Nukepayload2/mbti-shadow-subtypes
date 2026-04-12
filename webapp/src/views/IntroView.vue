<script setup lang="ts">
const emit = defineEmits<{
  start: []
}>()
</script>

<template>
  <section class="hero card">
    <h1>阴影人格测试</h1>
    <p class="hero-desc">基于约翰·毕比八功能模型，测出你在压力下的阴影人格类型</p>
    <div class="hero-actions">
      <button class="btn-primary" @click="emit('start')">开始测试</button>
    </div>
    <div class="hero-footer">
      <span>参考《类型与原型》、<a href="https://www.bilibili.com/video/BV1DW4y1k7AH/" target="_blank">MBTI/16人格的功能位置+解析 阴影功能篇</a></span>
      <span>隐私声明：你的测试结果将不会被服务端存储</span>
    </div>
  </section>
</template>

<style scoped>
.hero-desc {
  color: #888;
  font-size: 14px;
  margin: 8px 0 16px;
}
</style>
