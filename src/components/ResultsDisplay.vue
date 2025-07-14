<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card bg-base-100 shadow-xl max-w-2xl w-full">
      <div class="card-body">
        <h1 class="card-title text-2xl text-center justify-center mb-6">
          训练结果
        </h1>
        
        <!-- Results Summary -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">总分</div>
            <div class="stat-value text-primary">{{ gameStore.score }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">准确率</div>
            <div class="stat-value text-success">{{ gameStore.accuracy.toFixed(1) }}%</div>
          </div>
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">正确数</div>
            <div class="stat-value">{{ gameStore.correctCount }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">用时</div>
            <div class="stat-value">{{ gameStore.totalTime }}s</div>
          </div>
        </div>

        <!-- Detailed Questions -->
        <div class="overflow-x-auto mb-6">
          <h3 class="text-lg font-semibold mb-3">详细答题情况</h3>
          <table class="table table-zebra table-sm">
            <thead>
              <tr>
                <th>题号</th>
                <th>题目</th>
                <th>正确答案</th>
                <th>你的答案</th>
                <th>N步前</th>
                <th>是否正确</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(question, index) in validQuestions" :key="index">
                <td>{{ question.id + 1 }}</td>
                <td>{{ question.a }} + {{ question.b }} = ?</td>
                <td>{{ question.answer }}</td>
                <td>{{ gameStore.answers[index] }}</td>
                <td v-if="index >= gameStore.nValue">
                  {{ gameStore.questions[index - gameStore.nValue].answer }}
                </td>
                <td v-else>-</td>
                <td>
                  <span v-if="index >= gameStore.nValue" 
                        :class="getResultClass(index)"
                        class="badge">
                    {{ getResultText(index) }}
                  </span>
                  <span v-else class="badge badge-ghost">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button class="btn btn-primary flex-1" @click="gameStore.resetGame">
            开始新训练
          </button>
          <button class="btn btn-secondary flex-1" @click="exportResults">
            导出结果
          </button>
          <button class="btn btn-accent flex-1" @click="gameStore.goToStatistics">
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

const validQuestions = computed(() => {
  return gameStore.questions.slice(gameStore.nValue)
})

const getResultClass = (index: number): string => {
  const correctAnswer = gameStore.questions[index - gameStore.nValue].answer
  const userAnswer = gameStore.answers[index]
  return userAnswer === correctAnswer ? 'badge-success' : 'badge-error'
}

const getResultText = (index: number): string => {
  const correctAnswer = gameStore.questions[index - gameStore.nValue].answer
  const userAnswer = gameStore.answers[index]
  return userAnswer === correctAnswer ? '正确' : '错误'
}

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