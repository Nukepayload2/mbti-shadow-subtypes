import { ref } from 'vue'
import type { ScreenName } from '../types'

export function useScreen() {
  const currentScreen = ref<ScreenName>('intro')

  function showScreen(name: ScreenName) {
    currentScreen.value = name
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { currentScreen, showScreen }
}
