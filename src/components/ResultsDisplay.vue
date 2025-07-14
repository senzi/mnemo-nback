<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-2 sm:p-4">
    <div class="card bg-base-100 shadow-xl max-w-4xl w-full mx-auto">
      <div class="card-body p-3 sm:p-6">
        <h1 class="card-title text-lg sm:text-2xl text-center justify-center mb-4 sm:mb-6">
          训练结果 (N={{ gameStore.nValue }})
        </h1>
        
        <!-- Results Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div class="stat bg-base-200 rounded-lg p-2 sm:p-4">
            <div class="stat-title text-xs sm:text-sm">总分</div>
            <div class="stat-value text-sm sm:text-2xl text-primary">{{ gameStore.score }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg p-2 sm:p-4">
            <div class="stat-title text-xs sm:text-sm">准确率</div>
            <div class="stat-value text-sm sm:text-2xl text-success">{{ gameStore.accuracy.toFixed(1) }}%</div>
          </div>
          <div class="stat bg-base-200 rounded-lg p-2 sm:p-4">
            <div class="stat-title text-xs sm:text-sm">正确数</div>
            <div class="stat-value text-sm sm:text-2xl">{{ gameStore.correctCount }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg p-2 sm:p-4">
            <div class="stat-title text-xs sm:text-sm">用时</div>
            <div class="stat-value text-sm sm:text-2xl">{{ gameStore.totalTime }}s</div>
          </div>
        </div>

        <!-- Detailed Questions -->
        <div class="mb-4 sm:mb-6">
          <h3 class="text-sm sm:text-lg font-semibold mb-2 sm:mb-3">详细答题情况</h3>
          <div class="overflow-x-auto">
            <table class="table table-zebra table-xs sm:table-sm">
              <thead>
                <tr>
                  <th class="text-xs">题号</th>
                  <th class="text-xs">题目</th>
                  <th class="text-xs hidden sm:table-cell">正确答案</th>
                  <th class="text-xs">你的答案</th>
                  <th class="text-xs hidden sm:table-cell">N步前答案</th>
                  <th class="text-xs">结果</th>
                </tr>
              </thead>
              <tbody>
                <!-- 前N题：只显示题目和答案，不显示序号 -->
                <tr v-for="(question, index) in memoryQuestions" :key="'memory-' + index" class="bg-base-300">
                  <td class="text-gray-500 text-xs">-</td>
                  <td class="text-xs">{{ question.a }} + {{ question.b }} = ?</td>
                  <td class="text-xs hidden sm:table-cell">{{ question.answer }}</td>
                  <td class="text-gray-500 text-xs">-</td>
                  <td class="text-gray-500 text-xs hidden sm:table-cell">-</td>
                  <td>
                    <span class="badge badge-ghost badge-xs">记忆题</span>
                  </td>
                </tr>
                <!-- 作答题：显示完整信息 -->
                <tr v-for="(question, index) in answeredQuestions" :key="'answer-' + index">
                  <td class="text-xs">{{ index + 1 }}</td>
                  <td class="text-xs">{{ question.a }} + {{ question.b }} = ?</td>
                  <td class="text-xs hidden sm:table-cell">{{ question.answer }}</td>
                  <td class="text-xs">{{ question.userAnswer }}</td>
                  <td class="text-xs hidden sm:table-cell">{{ question.nBackAnswer }}</td>
                  <td>
                    <span :class="question.isCorrect ? 'badge-success' : 'badge-error'" class="badge badge-xs">
                      {{ question.isCorrect ? '✓' : '✗' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-2">
          <button class="btn btn-primary flex-1 btn-sm sm:btn-md" @click="gameStore.resetGame">
            开始新训练
          </button>
          <button class="btn btn-secondary flex-1 btn-sm sm:btn-md" @click="exportResults">
            导出结果
          </button>
          <button class="btn btn-accent flex-1 btn-sm sm:btn-md" @click="gameStore.goToStatistics">
            查看统计
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

// 前N题：用于记忆的题目
const memoryQuestions = computed(() => {
  return gameStore.questions.slice(0, gameStore.nValue)
})

// 作答题：需要作答的题目（从第N+1题开始）
const answeredQuestions = computed(() => {
  const questions = []
  for (let i = gameStore.nValue; i < gameStore.questions.length; i++) {
    const userAnswer = gameStore.answers[i]
    if (userAnswer !== undefined) {
      const currentQuestion = gameStore.questions[i]
      const nBackAnswer = gameStore.questions[i - gameStore.nValue].answer
      questions.push({
        ...currentQuestion,
        userAnswer,
        nBackAnswer,
        isCorrect: userAnswer === nBackAnswer
      })
    }
  }
  return questions
})

const exportResults = () => {
  const data = {
    username: gameStore.username,
    nValue: gameStore.nValue,
    mode: gameStore.mode,
    score: gameStore.score,
    accuracy: gameStore.accuracy,
    correctCount: gameStore.correctCount,
    totalTime: gameStore.totalTime,
    questions: gameStore.questions.map((q, index) => ({
      ...q,
      userAnswer: gameStore.answers[index],
      isCorrect: index >= gameStore.nValue 
        ? gameStore.answers[index] === gameStore.questions[index - gameStore.nValue].answer
        : null
    })),
    timestamp: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mnemo-nback-results-${gameStore.username}-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
