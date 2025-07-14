export interface TrainingRecord {
  username: string
  mode: '12' | 'unlimited'
  n: number
  question_count: number
  correct_count: number
  total_time_sec: number
  accuracy: number
  score: number
  timestamp: string
  exit_reason: 'completed' | 'abandoned'
  first_error_position?: number // 首次出错的题号，如果没有出错则为undefined
}

export interface Question {
  id: number
  a: number
  b: number
  answer: number
  userAnswer?: number
  timestamp: number
}

export interface GameState {
  username: string
  nValue: number
  mode: '12' | 'unlimited'
  currentQuestionIndex: number
  questions: Question[]
  answers: (number | undefined)[]
  startTime: number | null
  endTime: number | null
  gamePhase: 'config' | 'preview' | 'training' | 'results' | 'statistics'
}

export interface QuestionGeneratorResult {
  a: number
  b: number
  answer: number
}

export interface StatisticsData {
  records: TrainingRecord[]
  firstErrorDistribution: Record<number, number[]>
  averageAccuracy: number
  averageScore: number
  totalTrainings: number
}

export interface FilterOptions {
  mode?: '12' | 'unlimited' | 'all'
  nValue?: number | 'all'
  dateRange?: {
    start: string
    end: string
  }
}

export interface AggregatedStats {
  challengeCount: number
  averageAccuracy: number
  averageTime: number
  averageScore: number
  maxQuestions?: number
  averageQuestions?: number
  exitReasonRatio?: {
    manual: number
    error: number
  }
  firstErrorDistribution: number[]
}

export interface StatsByN {
  [key: number]: AggregatedStats
}

export interface StatsByMode {
  '12': StatsByN
  'unlimited': StatsByN
}
