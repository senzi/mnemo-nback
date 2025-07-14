<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <!-- Help Button - Fixed Position -->
    <div class="fixed top-4 right-4 z-50">
      <button 
        class="btn btn-circle btn-sm btn-ghost bg-base-100/80 backdrop-blur-sm shadow-lg"
        @click="showRulesModal = true"
        title="查看游戏规则"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex items-center justify-center p-4">
    <!-- Config Screen -->
    <template v-if="gameStore.gamePhase === 'config'">
      <div class="card bg-base-100 shadow-xl max-w-md w-full mx-auto">
        <div class="card-body p-4 sm:p-6">
          <h1 class="card-title text-xl sm:text-2xl text-center justify-center mb-4">
            M-nback 记忆训练
          </h1>
          
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-sm sm:text-base">N值选择</span>
            </label>
            <div class="grid grid-cols-3 gap-1 sm:gap-2">
              <button 
                v-for="n in 9" 
                :key="n"
                class="btn btn-xs sm:btn-sm min-h-8 sm:min-h-12"
                :class="gameStore.nValue === n ? 'btn-primary' : 'btn-outline'"
                @click="gameStore.setNValue(n)"
              >
                N{{ n }}
              </button>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-sm sm:text-base">训练模式</span>
            </label>
            <div class="flex gap-2">
              <button 
                class="btn btn-xs sm:btn-sm flex-1 min-h-8 sm:min-h-12"
                :class="gameStore.mode === '12' ? 'btn-primary' : 'btn-outline'"
                @click="gameStore.setMode('12')"
              >
                12题模式
              </button>
              <button 
                class="btn btn-xs sm:btn-sm flex-1 min-h-8 sm:min-h-12"
                :class="gameStore.mode === 'unlimited' ? 'btn-primary' : 'btn-outline'"
                @click="gameStore.setMode('unlimited')"
              >
                无限模式
              </button>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 mt-6">
            <button class="btn btn-primary flex-1 btn-sm sm:btn-md" @click="startTraining" :disabled="!canStart">
              开始训练
            </button>
            <button class="btn btn-secondary btn-sm sm:btn-md" @click="gameStore.goToStatistics">
              统计
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Memory Preview -->
    <MemoryPreview v-else-if="gameStore.gamePhase === 'preview'" @start-training="gameStore.startTraining" />

    <!-- Training Interface -->
    <TrainingInterface v-else-if="gameStore.gamePhase === 'training'" />

    <!-- Results Display -->
    <ResultsDisplay v-else-if="gameStore.gamePhase === 'results'" />

    <!-- Statistics -->
    <StatisticsView v-else-if="gameStore.gamePhase === 'statistics'" />
    </div>

    <!-- Site Footer -->
    <SiteFooter />

    <!-- Game Rules Modal -->
    <GameRulesModal :is-open="showRulesModal" @close="showRulesModal = false" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import MemoryPreview from '@/components/MemoryPreview.vue'
import TrainingInterface from '@/components/TrainingInterface.vue'
import ResultsDisplay from '@/components/ResultsDisplay.vue'
import StatisticsView from '@/components/StatisticsView.vue'
import GameRulesModal from '@/components/GameRulesModal.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { computed, ref } from 'vue'

const gameStore = useGameStore()

// Modal state
const showRulesModal = ref(false)

const canStart = computed(() => {
  return gameStore.nValue > 0
})

const startTraining = () => {
  if (canStart.value) {
    // 先生成题目，然后进入预览阶段
    gameStore.generateQuestions()
    gameStore.startPreview()
  }
}
</script>
