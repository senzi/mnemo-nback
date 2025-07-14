<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card bg-base-100 shadow-xl max-w-2xl w-full">
      <div class="card-body">
        <h1 class="card-title text-2xl text-center justify-center mb-4">
          M-nback 训练
        </h1>
        
        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-sm mb-1">
            <span>进度</span>
            <span>{{ gameStore.currentQuestionIndex + 1 }} / {{ gameStore.totalQuestions }}</span>
          </div>
          <progress class="progress progress-primary w-full" 
                   :value="gameStore.currentQuestionIndex + 1" 
                   :max="gameStore.totalQuestions"></progress>
        </div>

        <!-- Current Question -->
        <div v-if="currentQuestion" class="text-center mb-6">
          <div class="text-4xl font-bold mb-2">
            {{ currentQuestion.a }} + {{ currentQuestion.b }} = ?
          </div>
          <div class="text-sm text-base-content/70">
            第 {{ gameStore.currentQuestionIndex + 1 }} 题
          </div>
        </div>

        <!-- N-back Info -->
        <div v-if="showNBackInfo" class="alert alert-info mb-4">
          <span>
            请判断当前答案是否与 {{ gameStore.nValue }} 步前的答案相同
          </span>
        </div>

        <!-- Answer Buttons -->
        <div class="grid grid-cols-5 gap-2 mb-6">
          <button 
            v-for="num in 10" 
            :key="num"
            class="btn btn-lg btn-outline"
            @click="submitAnswer(num)"
          >
            {{ num }}
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center">
          <button 
            class="btn btn-secondary" 
            @click="gameStore.finishTraining('abandoned')"
          >
            放弃训练
          </button>
        </div>

        <!-- Stats -->
        <div class="mt-4 text-center text-sm text-base-content/70">
          已答题: {{ answeredCount }} | 
          正确: {{ gameStore.correctCount }} | 
          准确率: {{ gameStore.accuracy.toFixed(1) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

const gameStore = useGameStore()

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
