import { defineStore } from 'pinia'
import type { GameState, Question, TrainingRecord, QuestionGeneratorResult, FilterOptions, AggregatedStats, StatsByN, StatsByMode } from '@/types/game'

export const useGameStore = defineStore('game', {
  state: (): GameState => {
    // 从localStorage加载缓存的配置
    const savedConfig = localStorage.getItem('mnemo-nback-config')
    const config = savedConfig ? JSON.parse(savedConfig) : {}
    
    return {
      username: config.username || '',
      nValue: config.nValue || 1,
      mode: config.mode || '12',
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      startTime: null,
      endTime: null,
      gamePhase: 'config'
    }
  },

  getters: {
    totalQuestions(): number {
      return this.questions.length
    },
    currentQuestion(): Question | undefined {
      return this.questions[this.currentQuestionIndex]
    },
    isTrainingComplete(): boolean {
      if (this.mode === '12') {
        // 检查是否已经作答了12题
        let answeredCount = 0
        for (let i = this.nValue; i < this.answers.length; i++) {
          if (this.answers[i] !== undefined) {
            answeredCount++
          }
        }
        return answeredCount >= 12
      }
      return false // unlimited mode needs manual stop
    },
    correctCount(): number {
      let count = 0
      // 从第N+1题开始计算，只计算已作答的题目
      for (let i = this.nValue; i < this.answers.length; i++) {
        const currentAnswer = this.answers[i]
        if (currentAnswer !== undefined) {
          const nBackAnswer = this.questions[i - this.nValue].answer
          if (currentAnswer === nBackAnswer) {
            count++
          }
        }
      }
      return count
    },
    accuracy(): number {
      // 计算已作答的题目数量
      let answeredCount = 0
      for (let i = this.nValue; i < this.answers.length; i++) {
        if (this.answers[i] !== undefined) {
          answeredCount++
        }
      }
      if (answeredCount === 0) return 0
      return (this.correctCount / answeredCount) * 100
    },
    score(): number {
      if (!this.startTime || !this.endTime) return 0

      const elapsedSec = (this.endTime - this.startTime) / 1000
      if (elapsedSec === 0) return 0

      const answered = this.answers.length - this.nValue  // 作答题数 t
      if (answered <= 0) return 0

      const c = this.correctCount                       // 正确题数 c
      const speedFactor = Math.pow(c / elapsedSec, 0.8) // (c / t_sec)^α, α = 0.8
      const accuracy = c / answered                     // r = 正确率
      const accuracyFactor = Math.pow(accuracy, 2)      // r^β, β = 2

      const base = 100 * speedFactor * accuracyFactor
      const nBonus = 1 + (this.nValue - 1) / 5          // N 加权

      return Math.round(base * nBonus)
    },
    totalTime(): number {
      if (!this.startTime || !this.endTime) return 0
      return Math.round((this.endTime - this.startTime) / 1000)
    }
  },

  actions: {
    setUsername(username: string) {
      this.username = username
      this.saveConfig()
    },

    setNValue(n: number) {
      this.nValue = n
      this.saveConfig()
    },

    setMode(mode: '12' | 'unlimited') {
      this.mode = mode
      this.saveConfig()
    },

    saveConfig() {
      const config = {
        username: this.username,
        nValue: this.nValue,
        mode: this.mode
      }
      localStorage.setItem('mnemo-nback-config', JSON.stringify(config))
    },

    generateQuestions() {
      this.questions = []
      let totalQuestions = this.nValue // 前N题用于记忆
      
      if (this.mode === '12') {
        totalQuestions += 12 // 加上12题用于作答
      } else {
        totalQuestions += 100 // 无限模式先生成100题
      }
      
      for (let i = 0; i < totalQuestions; i++) {
        this.questions.push({
          id: i,
          ...this.generateQuestion(),
          timestamp: Date.now()
        })
      }
      this.answers = new Array(totalQuestions).fill(undefined)
    },

    generateQuestion(): QuestionGeneratorResult {
      const a = Math.floor(Math.random() * 10) // 0-9
      const maxB = 10 - a
      const b = Math.floor(Math.random() * maxB) + 1 // 1 to (10-a)
      const answer = a + b
      
      return { a, b, answer }
    },

    startTraining() {
      this.currentQuestionIndex = this.nValue // 从第N+1题开始作答
      this.startTime = Date.now()
      this.gamePhase = 'training'
    },

    startPreview() {
      this.gamePhase = 'preview'
    },

    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++
      } else if (this.mode === 'unlimited') {
        // Generate more questions for unlimited mode
        const newQuestions = []
        for (let i = 0; i < 20; i++) {
          newQuestions.push({
            id: this.questions.length + i,
            ...this.generateQuestion(),
            timestamp: Date.now()
          })
        }
        this.questions.push(...newQuestions)
        this.answers.push(...new Array(20).fill(undefined))
        this.currentQuestionIndex++
      }
    },

    submitAnswer(answer: number) {
      if (this.currentQuestionIndex < this.answers.length) {
        this.answers[this.currentQuestionIndex] = answer
      }
    },

    finishTraining(exitReason: 'completed' | 'abandoned' = 'completed') {
      this.endTime = Date.now()
      
      // 计算实际作答的题目数量
      let answeredCount = 0
      for (let i = this.nValue; i < this.answers.length; i++) {
        if (this.answers[i] !== undefined) {
          answeredCount++
        }
      }
      
      // 计算首错位置
      const firstErrorPosition = this.calculateFirstErrorPosition()
      
      const record: TrainingRecord = {
        username: this.username,
        mode: this.mode,
        n: this.nValue,
        question_count: answeredCount,
        correct_count: this.correctCount,
        total_time_sec: this.totalTime,
        accuracy: this.accuracy,
        score: this.score,
        timestamp: new Date().toISOString(),
        exit_reason: exitReason,
        first_error_position: firstErrorPosition
      }

      this.saveRecord(record)
      this.gamePhase = 'results'
    },

    calculateFirstErrorPosition(): number | undefined {
      // 从第N+1题开始检查，找到第一个错误的题目位置
      for (let i = this.nValue; i < this.answers.length; i++) {
        const currentAnswer = this.answers[i]
        if (currentAnswer !== undefined) {
          const nBackAnswer = this.questions[i - this.nValue].answer
          if (currentAnswer !== nBackAnswer) {
            return i - this.nValue + 1 // 返回相对于作答题目的位置（1-12）
          }
        }
      }
      return undefined // 没有错误
    },

    saveRecord(record: TrainingRecord) {
      const records = this.getStoredRecords()
      records.push(record)
      localStorage.setItem('mnemo-nback-records', JSON.stringify(records))
    },

    getStoredRecords(): TrainingRecord[] {
      const stored = localStorage.getItem('mnemo-nback-records')
      return stored ? JSON.parse(stored) : []
    },

    resetGame() {
      this.$reset()
    },

    goToConfig() {
      this.gamePhase = 'config'
    },

    goToStatistics() {
      this.gamePhase = 'statistics'
    },

    // 统计分析方法
    filterRecords(records: TrainingRecord[], filters: FilterOptions): TrainingRecord[] {
      return records.filter(record => {
        // 模式筛选
        if (filters.mode && filters.mode !== 'all' && record.mode !== filters.mode) {
          return false
        }
        
        // N值筛选
        if (filters.nValue && filters.nValue !== 'all' && record.n !== filters.nValue) {
          return false
        }
        
        // 时间范围筛选
        if (filters.dateRange) {
          const recordDate = new Date(record.timestamp)
          const startDate = new Date(filters.dateRange.start)
          const endDate = new Date(filters.dateRange.end)
          if (recordDate < startDate || recordDate > endDate) {
            return false
          }
        }
        
        return true
      })
    },

    calculateAggregatedStats(records: TrainingRecord[]): AggregatedStats {
      if (records.length === 0) {
        return {
          challengeCount: 0,
          averageAccuracy: 0,
          averageTime: 0,
          averageScore: 0,
          firstErrorDistribution: new Array(13).fill(0)
        }
      }

      const mode = records[0].mode
      const challengeCount = records.length
      const averageAccuracy = records.reduce((sum, r) => sum + r.accuracy, 0) / challengeCount
      const averageTime = records.reduce((sum, r) => sum + r.total_time_sec, 0) / challengeCount
      const averageScore = records.reduce((sum, r) => sum + r.score, 0) / challengeCount

      // 计算首错位置分布
      const firstErrorDistribution = new Array(13).fill(0) // 1-12题 + 未出错
      records.forEach(record => {
        if (record.first_error_position !== undefined) {
          firstErrorDistribution[record.first_error_position - 1]++
        } else {
          firstErrorDistribution[12]++ // 未出错
        }
      })

      const stats: AggregatedStats = {
        challengeCount,
        averageAccuracy,
        averageTime,
        averageScore,
        firstErrorDistribution
      }

      // 无限模式特有统计
      if (mode === 'unlimited') {
        const maxQuestions = Math.max(...records.map(r => r.question_count))
        const averageQuestions = records.reduce((sum, r) => sum + r.question_count, 0) / challengeCount
        const manualExits = records.filter(r => r.exit_reason === 'abandoned').length
        const errorExits = records.filter(r => r.exit_reason === 'completed').length
        
        stats.maxQuestions = maxQuestions
        stats.averageQuestions = averageQuestions
        stats.exitReasonRatio = {
          manual: manualExits / challengeCount,
          error: errorExits / challengeCount
        }
      }

      return stats
    },

    getStatsByMode(filters: FilterOptions = {}): StatsByMode {
      const allRecords = this.getStoredRecords()
      const filteredRecords = this.filterRecords(allRecords, filters)
      
      const result: StatsByMode = {
        '12': {},
        'unlimited': {}
      }

      // 按模式和N值分组
      const groupedRecords = filteredRecords.reduce((acc, record) => {
        const mode = record.mode
        const n = record.n
        
        if (!acc[mode]) acc[mode] = {}
        if (!acc[mode][n]) acc[mode][n] = []
        
        acc[mode][n].push(record)
        return acc
      }, {} as Record<string, Record<number, TrainingRecord[]>>)

      // 计算每个组的统计数据
      Object.keys(groupedRecords).forEach(mode => {
        Object.keys(groupedRecords[mode]).forEach(nStr => {
          const n = parseInt(nStr)
          const records = groupedRecords[mode][n]
          result[mode as '12' | 'unlimited'][n] = this.calculateAggregatedStats(records)
        })
      })

      return result
    },

    getTimeSeriesData(filters: FilterOptions = {}) {
      const allRecords = this.getStoredRecords()
      const filteredRecords = this.filterRecords(allRecords, filters)
      
      return filteredRecords
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((record, index) => ({
          index: index + 1,
          timestamp: record.timestamp,
          accuracy: record.accuracy,
          score: record.score,
          totalTime: record.total_time_sec,
          n: record.n,
          mode: record.mode
        }))
    },

    getFirstErrorDistribution(filters: FilterOptions = {}) {
      const allRecords = this.getStoredRecords()
      const filteredRecords = this.filterRecords(allRecords, filters)
      
      const distribution = new Array(13).fill(0) // 1-12题 + 未出错
      filteredRecords.forEach(record => {
        if (record.first_error_position !== undefined) {
          distribution[record.first_error_position - 1]++
        } else {
          distribution[12]++ // 未出错
        }
      })
      
      return distribution
    }
  }
})
