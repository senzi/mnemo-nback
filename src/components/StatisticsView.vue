<template>
  <div class="min-h-screen bg-base-200 p-4">
    <div class="max-w-7xl mx-auto">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h1 class="card-title text-3xl text-center justify-center mb-8">
            🧠 训练统计报告
          </h1>
          
          <!-- 筛选控制面板 -->
          <div class="bg-base-200 rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">筛选条件</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- 训练模式筛选 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">训练模式</span>
                </label>
                <select v-model="filters.mode" class="select select-bordered">
                  <option value="all">全部模式</option>
                  <option value="12">12题模式</option>
                  <option value="unlimited">无限模式</option>
                </select>
              </div>
              
              <!-- N值筛选 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">N-back 难度</span>
                </label>
                <select v-model="filters.nValue" class="select select-bordered">
                  <option value="all">全部难度</option>
                  <option v-for="n in availableNValues" :key="n" :value="n">
                    N{{ n }}
                  </option>
                </select>
              </div>
              
              <!-- 时间范围筛选 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">时间范围</span>
                </label>
                <div class="flex gap-2">
                  <input 
                    v-model="dateRangeStart" 
                    type="date" 
                    class="input input-bordered input-sm flex-1"
                    @change="updateDateRange"
                  >
                  <input 
                    v-model="dateRangeEnd" 
                    type="date" 
                    class="input input-bordered input-sm flex-1"
                    @change="updateDateRange"
                  >
                </div>
              </div>
            </div>
            
            <div class="flex gap-2 mt-4">
              <button class="btn btn-primary btn-sm" @click="applyFilters">
                应用筛选
              </button>
              <button class="btn btn-ghost btn-sm" @click="resetFilters">
                重置筛选
              </button>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredRecords.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📊</div>
            <p class="text-xl mb-4">{{ records.length === 0 ? '暂无训练记录' : '当前筛选条件下无数据' }}</p>
            <button v-if="records.length === 0" class="btn btn-primary" @click="gameStore.goToConfig">
              开始第一次训练
            </button>
            <button v-else class="btn btn-secondary" @click="resetFilters">
              重置筛选条件
            </button>
          </div>

          <!-- 统计内容 -->
          <div v-else>
            <!-- 概览统计卡片 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div class="stat bg-gradient-to-r from-primary to-primary-focus text-primary-content rounded-lg">
                <div class="stat-title text-primary-content/80">总训练次数</div>
                <div class="stat-value">{{ overviewStats.totalTrainings }}</div>
              </div>
              <div class="stat bg-gradient-to-r from-success to-success-focus text-success-content rounded-lg">
                <div class="stat-title text-success-content/80">平均准确率</div>
                <div class="stat-value">{{ overviewStats.averageAccuracy.toFixed(1) }}%</div>
              </div>
              <div class="stat bg-gradient-to-r from-info to-info-focus text-info-content rounded-lg">
                <div class="stat-title text-info-content/80">平均分数</div>
                <div class="stat-value">{{ overviewStats.averageScore.toFixed(0) }}</div>
              </div>
              <div class="stat bg-gradient-to-r from-warning to-warning-focus text-warning-content rounded-lg">
                <div class="stat-title text-warning-content/80">平均用时</div>
                <div class="stat-value">{{ overviewStats.averageTime.toFixed(0) }}s</div>
              </div>
            </div>

            <!-- 详细统计表格 -->
            <div class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">详细统计数据</h2>
              <div class="tabs tabs-boxed mb-4">
                <a 
                  class="tab" 
                  :class="{ 'tab-active': activeStatsTab === '12' }"
                  @click="activeStatsTab = '12'"
                >
                  12题模式
                </a>
                <a 
                  class="tab" 
                  :class="{ 'tab-active': activeStatsTab === 'unlimited' }"
                  @click="activeStatsTab = 'unlimited'"
                >
                  无限模式
                </a>
              </div>
              
              <div class="overflow-x-auto">
                <table class="table table-zebra">
                  <thead>
                    <tr>
                      <th>N值</th>
                      <th>挑战次数</th>
                      <th v-if="activeStatsTab === '12'">综合成功率</th>
                      <th v-else>综合正确率</th>
                      <th>平均耗时</th>
                      <th>平均分数</th>
                      <th v-if="activeStatsTab === 'unlimited'">最高答题数</th>
                      <th v-if="activeStatsTab === 'unlimited'">平均答题数</th>
                      <th v-if="activeStatsTab === 'unlimited'">主动退出率</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(stats, n) in statsByMode[activeStatsTab]" :key="n">
                      <td class="font-semibold">N{{ n }}</td>
                      <td>{{ stats.challengeCount }}</td>
                      <td>{{ stats.averageAccuracy.toFixed(1) }}%</td>
                      <td>{{ stats.averageTime.toFixed(0) }}s</td>
                      <td>{{ stats.averageScore.toFixed(0) }}</td>
                      <td v-if="activeStatsTab === 'unlimited'">{{ stats.maxQuestions || 0 }}</td>
                      <td v-if="activeStatsTab === 'unlimited'">{{ (stats.averageQuestions || 0).toFixed(1) }}</td>
                      <td v-if="activeStatsTab === 'unlimited'">
                        {{ ((stats.exitReasonRatio?.manual || 0) * 100).toFixed(1) }}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 首错位置分布 -->
            <div class="mb-8">
              <h2 class="text-2xl font-semibold mb-4">首错位置分布</h2>
              <div class="card bg-base-200">
                <div class="card-body">
                  <div class="grid grid-cols-12 gap-2 mb-4">
                    <div 
                      v-for="(item, index) in firstErrorDistributionWithPercentage.slice(0, 12)" 
                      :key="index"
                      class="aspect-square bg-base-100 rounded-lg flex flex-col items-center justify-center p-1 border-2"
                      :class="item.count > 0 ? 'border-error bg-error/10' : 'border-base-300'"
                    >
                      <div class="text-xs font-semibold text-base-content/60">第{{ index + 1 }}题</div>
                      <div class="text-sm font-bold" :class="item.count > 0 ? 'text-error' : 'text-base-content/40'">
                        {{ item.count }}
                      </div>
                      <div class="text-xs" :class="item.count > 0 ? 'text-error/70' : 'text-base-content/30'">
                        {{ item.percentage.toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-center">
                    <div 
                      class="bg-base-100 rounded-lg flex flex-col items-center justify-center p-4 border-2 min-w-24"
                      :class="firstErrorDistributionWithPercentage[12]?.count > 0 ? 'border-success bg-success/10' : 'border-base-300'"
                    >
                      <div class="text-sm font-semibold text-base-content/60">无错误</div>
                      <div class="text-xl font-bold" :class="firstErrorDistributionWithPercentage[12]?.count > 0 ? 'text-success' : 'text-base-content/40'">
                        {{ firstErrorDistributionWithPercentage[12]?.count || 0 }}
                      </div>
                      <div class="text-sm" :class="firstErrorDistributionWithPercentage[12]?.count > 0 ? 'text-success/70' : 'text-base-content/30'">
                        {{ (firstErrorDistributionWithPercentage[12]?.percentage || 0).toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  <div class="text-center text-sm text-base-content/60 mt-4">
                    显示每个题目位置首次出错的次数统计
                  </div>
                </div>
              </div>
            </div>

            <!-- 历史记录表格 -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-4">历史记录</h3>
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
                      <th>题目数</th>
                      <th>首错位置</th>
                      <th>退出原因</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in paginatedRecords" :key="record.timestamp">
                      <td>{{ formatDate(record.timestamp) }}</td>
                      <td>{{ record.username }}</td>
                      <td>N{{ record.n }}</td>
                      <td>{{ record.mode === '12' ? '12题' : '无限' }}</td>
                      <td>{{ record.score }}</td>
                      <td>{{ record.accuracy.toFixed(1) }}%</td>
                      <td>{{ record.total_time_sec }}s</td>
                      <td>{{ record.question_count }}</td>
                      <td>{{ record.first_error_position ? `第${record.first_error_position}题` : '无错误' }}</td>
                      <td>
                        <span class="badge" :class="record.exit_reason === 'completed' ? 'badge-success' : 'badge-warning'">
                          {{ record.exit_reason === 'completed' ? '完成' : '主动退出' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- 分页控制 -->
              <div class="flex justify-center mt-4" v-if="totalPages > 1">
                <div class="btn-group">
                  <button 
                    class="btn btn-sm" 
                    :class="{ 'btn-disabled': currentPage === 1 }"
                    @click="currentPage = Math.max(1, currentPage - 1)"
                  >
                    «
                  </button>
                  <button class="btn btn-sm btn-active">{{ currentPage }}</button>
                  <button 
                    class="btn btn-sm" 
                    :class="{ 'btn-disabled': currentPage === totalPages }"
                    @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-2">
              <button class="btn btn-primary" @click="gameStore.goToConfig">
                返回训练
              </button>
              <button class="btn btn-secondary" @click="exportFilteredData">
                导出当前数据
              </button>
              <button class="btn btn-error" @click="clearAllData">
                清除所有数据
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, ref, reactive, onMounted } from 'vue'
import type { TrainingRecord, FilterOptions } from '@/types/game'

const gameStore = useGameStore()

// 响应式数据
const records = computed(() => gameStore.getStoredRecords())
const activeStatsTab = ref<'12' | 'unlimited'>('12')
const currentPage = ref(1)
const pageSize = 10
const dateRangeStart = ref('')
const dateRangeEnd = ref('')

// 筛选条件
const filters = reactive<FilterOptions>({
  mode: 'all',
  nValue: 'all'
})

// 计算属性
const availableNValues = computed(() => {
  const nValues = new Set(records.value.map(r => r.n))
  return Array.from(nValues).sort((a, b) => a - b)
})

const filteredRecords = computed(() => {
  return gameStore.filterRecords(records.value, filters)
})

const statsByMode = computed(() => {
  return gameStore.getStatsByMode(filters)
})

const overviewStats = computed(() => {
  const filtered = filteredRecords.value
  if (filtered.length === 0) {
    return {
      totalTrainings: 0,
      averageAccuracy: 0,
      averageScore: 0,
      averageTime: 0
    }
  }
  
  return {
    totalTrainings: filtered.length,
    averageAccuracy: filtered.reduce((sum, r) => sum + r.accuracy, 0) / filtered.length,
    averageScore: filtered.reduce((sum, r) => sum + r.score, 0) / filtered.length,
    averageTime: filtered.reduce((sum, r) => sum + r.total_time_sec, 0) / filtered.length
  }
})

const paginatedRecords = computed(() => {
  const sorted = filteredRecords.value.slice().reverse()
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sorted.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRecords.value.length / pageSize)
})

const firstErrorDistribution = computed(() => {
  return gameStore.getFirstErrorDistribution(filters)
})

const firstErrorDistributionWithPercentage = computed(() => {
  const distribution = firstErrorDistribution.value
  const total = distribution.reduce((sum, count) => sum + count, 0)
  
  return distribution.map(count => ({
    count,
    percentage: total > 0 ? (count / total * 100) : 0
  }))
})

// 方法
const updateDateRange = () => {
  if (dateRangeStart.value && dateRangeEnd.value) {
    filters.dateRange = {
      start: dateRangeStart.value,
      end: dateRangeEnd.value
    }
  } else {
    delete filters.dateRange
  }
}

const applyFilters = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  filters.mode = 'all'
  filters.nValue = 'all'
  delete filters.dateRange
  dateRangeStart.value = ''
  dateRangeEnd.value = ''
  currentPage.value = 1
}

const formatDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const exportFilteredData = () => {
  const data = {
    filters,
    records: filteredRecords.value,
    statistics: statsByMode.value,
    summary: overviewStats.value,
    exportTimestamp: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mnemo-nback-filtered-data-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const clearAllData = () => {
  if (confirm('确定要清除所有训练记录吗？此操作不可恢复。')) {
    localStorage.removeItem('mnemo-nback-records')
    location.reload()
  }
}

onMounted(() => {
  // 初始化日期范围为最近30天
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  dateRangeEnd.value = now.toISOString().split('T')[0]
  dateRangeStart.value = thirtyDaysAgo.toISOString().split('T')[0]
})
</script>
