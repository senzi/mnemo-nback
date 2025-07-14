<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-2 sm:p-4">
    <div class="card bg-base-100 shadow-xl max-w-2xl w-full mx-auto">
      <div class="card-body p-3 sm:p-6">
        <h1 class="card-title text-lg sm:text-2xl text-center justify-center mb-4 sm:mb-6">
          记忆预览
        </h1>
        
        <div class="alert alert-info mb-3 sm:mb-4 p-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4 sm:w-6 sm:h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-xs sm:text-sm">请仔细记住前 {{ gameStore.nValue }} 题的题目，训练时需要比较当前答案与 N 步前的答案是否相同</span>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-zebra table-sm sm:table-md">
            <thead>
              <tr>
                <th class="text-xs sm:text-sm">题号</th>
                <th class="text-xs sm:text-sm">题目</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in previewQuestions" :key="question.id" 
                  :class="{ 'bg-primary/20': question.id < gameStore.nValue }">
                <th class="text-xs sm:text-sm">{{ question.id + 1 }}</th>
                <td class="text-sm sm:text-lg font-bold">{{ question.a }} + {{ question.b }} = ?</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:justify-end mt-4 sm:mt-6">
          <button class="btn btn-secondary btn-sm sm:btn-md order-2 sm:order-1" @click="gameStore.goToConfig">
            返回
          </button>
          <button class="btn btn-primary btn-sm sm:btn-md order-1 sm:order-2" @click="$emit('start-training')">
            开始训练
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

const gameStore = useGameStore()

defineEmits(['start-training'])

const previewQuestions = computed(() => {
  return gameStore.questions.slice(0, gameStore.nValue)
})
</script>
