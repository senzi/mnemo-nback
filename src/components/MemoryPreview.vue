<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card bg-base-100 shadow-xl max-w-2xl w-full">
      <div class="card-body">
        <h1 class="card-title text-2xl text-center justify-center mb-6">
          记忆预览
        </h1>
        
        <div class="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>请仔细记住前 {{ gameStore.nValue }} 题的题目，训练时需要比较当前答案与 N 步前的答案是否相同</span>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>题号</th>
                <th>题目</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="question in previewQuestions" :key="question.id" 
                  :class="{ 'bg-primary/20': question.id < gameStore.nValue }">
                <th>{{ question.id + 1 }}</th>
                <td class="text-lg font-bold">{{ question.a }} + {{ question.b }} = ?</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card-actions justify-end mt-6">
          <button class="btn btn-secondary" @click="gameStore.goToConfig">
            返回
          </button>
          <button class="btn btn-primary" @click="$emit('start-training')">
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
