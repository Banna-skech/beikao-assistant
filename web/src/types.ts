export interface Enterprise {
  id: number
  name: string
  category: '军工航天' | '石油石化' | '电网电力' | '通信电子' | '汽车机械' | '钢铁矿产' | '交通运输' | '建筑基建' | '金融银行' | '农林医药' | '综合贸易' | '烟草铁路'
  description: string
  website: string
  recruitSite: string
  headquarters: string
  priority: 'S' | 'A' | 'B'
  majors: string[]
  tags: string[]
}

export interface QuizQuestion {
  id: number
  module: '言语理解' | '数量关系' | '判断推理' | '资料分析' | '常识判断'
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'single' | 'multi'
  question: string
  options: string[]
  answer: number[]
  explanation: string
}

export interface InterviewQuestion {
  id: number
  category: '自我认知' | '岗位匹配' | '行为经历' | '情景应变' | '企业认知' | '职业规划'
  question: string
  tips: string
  sampleAnswer: string
}

export interface TimelineEvent {
  month: string
  phase: string
  title: string
  description: string
  color: 'blue' | 'amber' | 'emerald' | 'purple' | 'rose' | 'slate'
  actions: string[]
}

export interface Pitfall {
  id: number
  phase: '网申' | '笔试' | '面试' | '签约' | '心态'
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
  solution: string
}

export interface StudyTask {
  id: string
  title: string
  category: string
  duration: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

export interface CourseLesson {
  id: string
  title: string
  duration?: string
}

export interface CourseItem {
  id: string
  title: string
  teacher: string
  category: string
  platform: string
  url: string
  duration: string
  level: '基础' | '强化' | '冲刺' | '综合' | '自定义'
  tags: string[]
  lessons: CourseLesson[]
}

export interface CourseProgress {
  percent: number
  currentLesson: string
  completedLessonIds: string[]
  updatedAt: string
}

export interface DailyLoopBlock {
  id: string
  title: string
  module: string
  minutes: number
  output: string
  type: '输入' | '练习' | '复盘' | '输出'
}

export interface DailyLoopRecord {
  date: string
  completedBlockIds: string[]
  minutesByBlock: Record<string, number>
  proofByBlock: Record<string, string>
  wrongCount: number
  weakReason: string
  fixAction: string
  shenlunOutput: string
  tomorrowStart: string
  tomorrowFirstBlock: string
  commitment: string
  updatedAt: string
}

export type PaperCategory = '央国企' | '国考' | '省考'
export type PaperAuthenticity = '官方样题' | '公开真题' | '回忆考情精编' | '考纲模拟'

export interface PaperQuestion {
  id: string
  section: string
  type: 'single' | 'multi'
  question: string
  options: string[]
  answer: number[]
  explanation: string
}

export interface ExamPaper {
  id: string
  title: string
  organization: string
  category: PaperCategory
  year: number
  authenticity: PaperAuthenticity
  durationMinutes: number
  description: string
  sections: string[]
  sourceLabel: string
  sourceUrl: string
  sourceNote: string
  questions: PaperQuestion[]
}

export interface PaperProgress {
  attempts: number
  bestScore: number
  lastScore: number
  wrongQuestionIds: string[]
  lastPracticedAt: string
}
