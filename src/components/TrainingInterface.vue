<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-2 sm:p-4">
    <div class="card bg-base-100 shadow-xl max-w-2xl w-full mx-auto">
      <div class="card-body p-3 sm:p-6">
        <h1 class="card-title text-lg sm:text-2xl text-center justify-center mb-3 sm:mb-4">
          M-nback 训练
        </h1>
        
        <!-- Timer Display -->
        <div class="text-center mb-3 sm:mb-4">
          <div class="badge badge-primary badge-lg text-sm sm:text-base font-mono">
            ⏱️ {{ formatTime(elapsedTime) }}
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="mb-3 sm:mb-4">
          <div class="flex justify-between text-xs sm:text-sm mb-1">
            <span>进度</span>
            <span>{{ gameStore.currentQuestionIndex + 1 }} / {{ gameStore.totalQuestions }}</span>
          </div>
          <progress class="progress progress-primary w-full" 
                   :value="gameStore.currentQuestionIndex + 1" 
                   :max="gameStore.totalQuestions"></progress>
        </div>

        <!-- Current Question -->
        <div v-if="currentQuestion" class="text-center mb-4 sm:mb-6">
          <div class="text-2xl sm:text-4xl font-bold mb-2">
            {{ currentQuestion.a }} + {{ currentQuestion.b }} = ?
          </div>
          <div class="text-xs sm:text-sm text-base-content/70">
            第 {{ gameStore.currentQuestionIndex + 1 }} 题
          </div>
        </div>

        <!-- N-back Info -->
        <div v-if="showNBackInfo" class="alert alert-info mb-3 sm:mb-4 p-3">
          <span class="text-xs sm:text-sm">
            请选择 {{ gameStore.nValue }} 道题前的答案
          </span>
        </div>

        <!-- Answer Buttons -->
        <div class="grid grid-cols-5 gap-1 sm:gap-2 mb-4 sm:mb-6">
          <button 
            v-for="num in 10" 
            :key="num"
            class="btn btn-sm sm:btn-lg btn-outline min-h-10 sm:min-h-16 text-sm sm:text-lg"
            @click="submitAnswer(num)"
          >
            {{ num }}
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center mb-3 sm:mb-4">
          <button 
            class="btn btn-secondary btn-sm sm:btn-md" 
            @click="gameStore.finishTraining('abandoned')"
          >
            放弃训练
          </button>
        </div>

        <!-- Stats -->
        <div class="text-center text-xs sm:text-sm text-base-content/70">
          <div class="flex flex-col sm:flex-row sm:justify-center sm:gap-4">
            <span>已答题: {{ answeredCount }}</span>
            <span>正确: {{ gameStore.correctCount }}</span>
            <span>准确率: {{ gameStore.accuracy.toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, ref, onMounted, onUnmounted } from 'vue'

const gameStore = useGameStore()

// Timer functionality
const elapsedTime = ref(0)
let animationId: number | null = null

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const updateTimer = () => {
  if (gameStore.startTime) {
    elapsedTime.value = Math.floor((Date.now() - gameStore.startTime) / 1000)
    animationId = requestAnimationFrame(updateTimer)
  }
}

onMounted(() => {
  updateTimer()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

const currentQuestion = computed(() => gameStore.currentQuestion)
const showNBackInfo = computed(() => gameStore.currentQuestionIndex >= gameStore.nValue)

// 计算已作答题目数量
const answeredCount = computed(() => {
  let count = 0
  for (let i = gameStore.nValue; i < gameStore.answers.length; i++) {
    if (gameStore.answers[i] !== undefined) {
      count++
    }
  }
  return count
})

const submitAnswer = (answer: number) => {
  if (currentQuestion.value) {
    gameStore.submitAnswer(answer)
    
    // 检查是否完成训练（在提交答案后立即检查）
    if (gameStore.isTrainingComplete) {
      gameStore.finishTraining('completed')
    } else {
      gameStore.nextQuestion()
    }
  }
}
</script>
