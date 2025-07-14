import { defineStore } from 'pinia'
import type { GameState, Question, TrainingRecord, QuestionGeneratorResult } from '@/types/game'

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    username: '',
    nValue: 1,
    mode: '12',
    currentQuestionIndex: 0,
    questions: [],
    answers: [],
    startTime: null,
    endTime: null,
    gamePhase: 'config'
  }),

  getters: {
    totalQuestions(): number {
      return this.questions.length
    },
    currentQuestion(): Question | undefined {
      return this.questions[this.currentQuestionIndex]
    },
    isTrainingComplete(): boolean {
      if (this.mode === '12') {
        return this.currentQuestionIndex >= 12
      }
      return false // unlimited mode needs manual stop
    },
    correctCount(): number {
      let count = 0
      for (let i = this.nValue; i < this.answers.length; i++) {
        const currentAnswer = this.answers[i]
        const nBackAnswer = this.questions[i - this.nValue].answer
        if (currentAnswer === nBackAnswer) {
          count++
        }
      }
      return count
    },
    accuracy(): number {
      const validQuestions = Math.max(0, this.answers.length - this.nValue)
      if (validQuestions === 0) return 0
      return (this.correctCount / validQuestions) * 100
    },
    score(): number {
      const totalTime = this.totalTime
      if (totalTime === 0) return 0
      
      const t = this.answers.length - this.nValue
      const c = this.correctCount
      const r = t / (totalTime / 60) // questions per minute
      
      if (t === 0) return 0
      
      const baseScore = 100 * Math.pow(c / t, 0.8) * Math.pow(r, 2)
      const nBonus = 1 + (this.nValue - 1) / 5
      
      return Math.round(baseScore * nBonus)
    },
    totalTime(): number {
      if (!this.startTime || !this.endTime) return 0
      return Math.round((this.endTime - this.startTime) / 1000)
    }
  },

  actions: {
    setUsername(username: string) {
      this.username = username
    },

    setNValue(n: number) {
      this.nValue = n
    },

    setMode(mode: '12' | 'unlimited') {
      this.mode = mode
    },

    generateQuestions(count: number) {
      this.questions = []
      for (let i = 0; i < count; i++) {
        this.questions.push({
          id: i,
          ...this.generateQuestion(),
          timestamp: Date.now()
        })
      }
      this.answers = new Array(count).fill(undefined)
    },

    generateQuestion(): QuestionGeneratorResult {
      const a = Math.floor(Math.random() * 10) // 0-9
      const maxB = 10 - a
      const b = Math.floor(Math.random() * maxB) + 1 // 1 to (10-a)
      const answer = a + b
      
      return { a, b, answer }
    },

    startTraining() {
      this.currentQuestionIndex = 0
      this.startTime = Date.now()
      this.gamePhase = 'training'
      
      if (this.mode === '12') {
        this.generateQuestions(12)
      } else {
        this.generateQuestions(100) // Start with 100, can generate more as needed
      }
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
      
      const record: TrainingRecord = {
        username: this.username,
        mode: this.mode,
        n: this.nValue,
        question_count: this.answers.length - this.nValue,
        correct_count: this.correctCount,
        total_time_sec: this.totalTime,
        accuracy: this.accuracy,
        score: this.score,
        timestamp: new Date().toISOString(),
        exit_reason: exitReason
      }

      this.saveRecord(record)
      this.gamePhase = 'results'
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
    }
  }
})