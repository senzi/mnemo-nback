<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <!-- Config Screen -->
    <template v-if="gameStore.gamePhase === 'config'">
      <div class="card bg-base-100 shadow-xl max-w-md w-full">
        <div class="card-body">
          <h1 class="card-title text-2xl text-center justify-center mb-4">
            M-nback 记忆训练
          </h1>
          
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">用户名</span>
            </label>
            <input 
              type="text" 
              placeholder="请输入用户名" 
              class="input input-bordered w-full"
              :value="gameStore.username"
              @input="gameStore.setUsername(($event.target as HTMLInputElement).value)"
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">N值选择</span>
            </label>
            <select class="select select-bordered w-full" :value="gameStore.nValue" @change="gameStore.setNValue(Number(($event.target as HTMLSelectElement).value))">
              <option disabled value="">请选择N值</option>
              <option v-for="n in 9" :key="n" :value="n">N{{ n }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">训练模式</span>
            </label>
            <select class="select select-bordered w-full" :value="gameStore.mode" @change="gameStore.setMode(($event.target as HTMLSelectElement).value as '12' | 'unlimited')">
              <option value="12">12题模式</option>
              <option value="unlimited">无限模式</option>
            </select>
          </div>

          <div class="flex gap-2 mt-6">
            <button class="btn btn-primary flex-1" @click="startTraining" :disabled="!canStart">
              开始训练
            </button>
            <button class="btn btn-secondary" @click="gameStore.goToStatistics">
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
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import MemoryPreview from '@/components/MemoryPreview.vue'
import TrainingInterface from '@/components/TrainingInterface.vue'
import ResultsDisplay from '@/components/ResultsDisplay.vue'
import StatisticsView from '@/components/StatisticsView.vue'
import { computed } from 'vue'

const gameStore = useGameStore()

const canStart = computed(() => {
  return gameStore.username.trim() !== '' && gameStore.nValue > 0
})

const startTraining = () => {
  if (canStart.value) {
    // 先生成题目，然后进入预览阶段
    gameStore.generateQuestions()
    gameStore.startPreview()
  }
}
</script>
