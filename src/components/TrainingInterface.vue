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
            class="btn btn-lg"
            :class="{ 'btn-primary': selectedAnswer === num, 'btn-outline': selectedAnswer !== num }"
            @click="selectAnswer(num)"
          >
            {{ num }}
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button 
            class="btn btn-secondary flex-1" 
            @click="gameStore.finishTraining('abandoned')"
          >
            放弃训练
          </button>
          <button 
            class="btn btn-primary flex-1" 
            :disabled="selectedAnswer === null"
            @click="submitAnswer"
          >
            提交答案
          </button>
        </div>

        <!-- Stats -->
        <div class="mt-4 text-center text-sm text-base-content/70">
          已答题: {{ gameStore.currentQuestionIndex }} | 
          正确: {{ gameStore.correctCount }} | 
          准确率: {{ gameStore.accuracy.toFixed(1) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, ref } from 'vue'

const gameStore = useGameStore()
const selectedAnswer = ref<number | null>(null)

const currentQuestion = computed(() => gameStore.currentQuestion)
const showNBackInfo = computed(() => gameStore.currentQuestionIndex >= gameStore.nValue)

const selectAnswer = (answer: number) => {
  selectedAnswer.value = answer
}

const submitAnswer = () => {
  if (selectedAnswer.value !== null && currentQuestion.value) {
    gameStore.submitAnswer(selectedAnswer.value)
    
    if (gameStore.isTrainingComplete) {
      gameStore.finishTraining()
    } else {
      gameStore.nextQuestion()
      selectedAnswer.value = null
    }
  }
}
</script>