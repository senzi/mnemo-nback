<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card bg-base-100 shadow-xl max-w-6xl w-full">
      <div class="card-body">
        <h1 class="card-title text-2xl text-center justify-center mb-6">
          训练统计
        </h1>
        
        <!-- Stats Overview -->
        <div v-if="records.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">总训练次数</div>
            <div class="stat-value text-primary">{{ totalTrainings }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">平均准确率</div>
            <div class="stat-value text-success">{{ averageAccuracy.toFixed(1) }}%</div>
          </div>
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">平均分数</div>
            <div class="stat-value">{{ averageScore.toFixed(0) }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">总用时</div>
            <div class="stat-value">{{ totalTime.toFixed(0) }}s</div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="text-6xl mb-4">📊</div>
          <p class="text-xl mb-4">暂无训练记录</p>
          <button class="btn btn-primary" @click="gameStore.goToConfig">
            开始第一次训练
          </button>
        </div>

        <!-- Charts -->
        <div v-if="records.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Score Trend -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-lg">分数趋势</h3>
              <v-chart :option="scoreChartOption" class="h-64" />
            </div>
          </div>

          <!-- Accuracy Trend -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-lg">准确率趋势</h3>
              <v-chart :option="accuracyChartOption" class="h-64" />
            </div>
          </div>

          <!-- N-value Performance -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-lg">N值表现</h3>
              <v-chart :option="nValueChartOption" class="h-64" />
            </div>
          </div>

          <!-- Mode Comparison -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-lg">模式对比</h3>
              <v-chart :option="modeChartOption" class="h-64" />
            </div>
          </div>
        </div>

        <!-- Records Table -->
        <div v-if="records.length > 0" class="mt-6">
          <h3 class="text-lg font-semibold mb-3">历史记录</h3>
          <div class="overflow-x-auto">
            <table class="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>用户名</th>
                  <th>N值</th>
                  <th>模式</th>
                  <th>分数</th>
                  <th>准确率</th>
                  <th>用时</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in records.slice().reverse()" :key="record.timestamp">
                  <td>{{ formatDate(record.timestamp) }}</td>
                  <td>{{ record.username }}</td>
                  <td>N{{ record.n }}</td>
                  <td>{{ record.mode === '12' ? '12题' : '无限' }}</td>
                  <td>{{ record.score }}</td>
                  <td>{{ record.accuracy.toFixed(1) }}%</td>
                  <td>{{ record.total_time_sec }}s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mt-6">
          <button class="btn btn-primary" @click="gameStore.goToConfig">
            返回训练
          </button>
          <button class="btn btn-secondary" @click="exportAllData">
            导出所有数据
          </button>
          <button class="btn btn-error" @click="clearAllData">
            清除数据
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'
import type { TrainingRecord } from '@/types/game'

use([LineChart, BarChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, CanvasRenderer])

const gameStore = useGameStore()

const records = computed(() => gameStore.getStoredRecords())

const totalTrainings = computed(() => records.value.length)
const averageAccuracy = computed(() => records.value.reduce((sum, r) => sum + r.accuracy, 0) / records.value.length || 0)
const averageScore = computed(() => records.value.reduce((sum, r) => sum + r.score, 0) / records.value.length || 0)
const totalTime = computed(() => records.value.reduce((sum, r) => sum + r.total_time_sec, 0))

const scoreChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: records.value.map((_, index) => `#${index + 1}`)
  },
  yAxis: {
    type: 'value',
    name: '分数'
  },
  series: [{
    data: records.value.map(r => r.score),
    type: 'line',
    smooth: true,
    itemStyle: { color: '#3b82f6' }
  }]
}))

const accuracyChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: records.value.map((_, index) => `#${index + 1}`)
  },
  yAxis: {
    type: 'value',
    name: '准确率(%)',
    max: 100
  },
  series: [{
    data: records.value.map(r => r.accuracy),
    type: 'line',
    smooth: true,
    itemStyle: { color: '#10b981' }
  }]
}))

const nValueChartOption = computed(() => {
  const nValueStats = records.value.reduce((acc, record) => {
    const n = record.n
    if (!acc[n]) {
      acc[n] = { totalScore: 0, count: 0, totalAccuracy: 0 }
    }
    acc[n].totalScore += record.score
    acc[n].totalAccuracy += record.accuracy
    acc[n].count++
    return acc
  }, {} as Record<number, { totalScore: number, count: number, totalAccuracy: number }>)

  const categories = Object.keys(nValueStats).map(Number).sort((a, b) => a - b)
  const scores = categories.map(n => Math.round(nValueStats[n].totalScore / nValueStats[n].count))
  const accuracies = categories.map(n => Math.round(nValueStats[n].totalAccuracy / nValueStats[n].count))

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['平均分数', '平均准确率']
    },
    xAxis: {
      type: 'category',
      data: categories.map(n => `N${n}`)
    },
    yAxis: [
      {
        type: 'value',
        name: '分数',
        position: 'left'
      },
      {
        type: 'value',
        name: '准确率(%)',
        position: 'right',
        max: 100
      }
    ],
    series: [
      {
        name: '平均分数',
        type: 'bar',
        data: scores,
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: '平均准确率',
        type: 'bar',
        yAxisIndex: 1,
        data: accuracies,
        itemStyle: { color: '#10b981' }
      }
    ]
  }
})

const modeChartOption = computed(() => {
  const modeStats = records.value.reduce((acc, record) => {
    const mode = record.mode
    if (!acc[mode]) {
      acc[mode] = { totalScore: 0, count: 0, totalAccuracy: 0 }
    }
    acc[mode].totalScore += record.score
    acc[mode].totalAccuracy += record.accuracy
    acc[mode].count++
    return acc
  }, {} as Record<string, { totalScore: number, count: number, totalAccuracy: number }>)

  const categories = Object.keys(modeStats)
  const scores = categories.map(mode => Math.round(modeStats[mode].totalScore / modeStats[mode].count))
  const counts = categories.map(mode => modeStats[mode].count)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['平均分数', '训练次数']
    },
    xAxis: {
      type: 'category',
      data: categories.map(mode => mode === '12' ? '12题模式' : '无限模式')
    },
    yAxis: [
      {
        type: 'value',
        name: '分数',
        position: 'left'
      },
      {
        type: 'value',
        name: '次数',
        position: 'right'
      }
    ],
    series: [
      {
        name: '平均分数',
        type: 'bar',
        data: scores,
        itemStyle: { color: '#8b5cf6' }
      },
      {
        name: '训练次数',
        type: 'bar',
        yAxisIndex: 1,
        data: counts,
        itemStyle: { color: '#f59e0b' }
      }
    ]
  }
})

const formatDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const exportAllData = () => {
  const data = {
    records: records.value,
    summary: {
      totalTrainings: totalTrainings.value,
      averageAccuracy: averageAccuracy.value,
      averageScore: averageScore.value,
      totalTime: totalTime.value
    },
    exportTimestamp: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mnemo-nback-all-data-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const clearAllData = () => {
  if (confirm('确定要清除所有训练记录吗？此操作不可恢复。')) {
    localStorage.removeItem('mnemo-nback-records')
    location.reload()
  }
}
</script>