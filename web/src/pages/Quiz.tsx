import { useState, useMemo, useCallback } from 'react'
import { quizQuestions } from '../data/quizQuestions'
import type { QuizQuestion } from '../types'
import { Check, X, ChevronRight, RotateCcw, Trophy, Clock, Target, ArrowRight } from 'lucide-react'

const modules = ['全部', '言语理解', '数量关系', '判断推理', '资料分析', '常识判断'] as const
const moduleIcons: Record<string, string> = { '言语理解': '📖', '数量关系': '🔢', '判断推理': '🧩', '资料分析': '📊', '常识判断': '💡' }
const moduleColors: Record<string, string> = { '言语理解': 'text-blue-600 bg-blue-50', '数量关系': 'text-amber-600 bg-amber-50', '判断推理': 'text-purple-600 bg-purple-50', '资料分析': 'text-emerald-600 bg-emerald-50', '常识判断': 'text-rose-600 bg-rose-50' }

type QuizState = 'idle' | 'active' | 'finished'

export default function Quiz() {
  const [activeModule, setActiveModule] = useState<string>('全部')
  const [difficulty, setDifficulty] = useState<'全部' | 'easy' | 'medium' | 'hard'>('全部')
  const [questionCount, setQuestionCount] = useState(10)
  const [quizState, setQuizState] = useState<QuizState>('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  // Filter questions
  const filteredPool = useMemo(() => {
    let pool = quizQuestions
    if (activeModule !== '全部') pool = pool.filter(q => q.module === activeModule)
    if (difficulty !== '全部') pool = pool.filter(q => q.difficulty === difficulty)
    return pool
  }, [activeModule, difficulty])

  // Start quiz
  const startQuiz = useCallback(() => {
    const shuffled = [...filteredPool].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, Math.min(questionCount, shuffled.length)))
    setCurrentIndex(0)
    setSelectedAnswers({})
    setSubmitted(false)
    setQuizState('active')
  }, [filteredPool, questionCount])

  // Handle answer selection
  const toggleAnswer = (qId: number, optIdx: number, multi: boolean) => {
    if (submitted) return
    setSelectedAnswers(prev => {
      const current = prev[qId] || []
      if (multi) {
        if (current.includes(optIdx)) return { ...prev, [qId]: current.filter(i => i !== optIdx) }
        return { ...prev, [qId]: [...current, optIdx] }
      }
      return { ...prev, [qId]: [optIdx] }
    })
  }

  const checkAnswer = (q: QuizQuestion, selected: number[]): boolean => {
    if (!selected || selected.length === 0 || selected.length !== q.answer.length) return false
    return q.answer.every(a => selected.includes(a)) && selected.every(s => q.answer.includes(s))
  }

  // Calculate score
  const score = useMemo(() => {
    if (quizState !== 'finished') return null
    let correct = 0
    questions.forEach(q => {
      if (checkAnswer(q, selectedAnswers[q.id] || [])) correct++
    })
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) }
  }, [quizState, questions, selectedAnswers])

  const currentQ = questions[currentIndex]

  // Idle state - quiz setup
  if (quizState === 'idle') {
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="animate-slide-up">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800">🧠 笔试刷题</h2>
          <p className="text-sm text-slate-500 mt-1">覆盖行测五大模块，含详细解析，支持错题回顾</p>
        </div>

        {/* Module selection */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-sm animate-slide-up">
          <h3 className="text-sm font-bold text-slate-800 mb-4">选择练习模块</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {modules.map((m) => (
              <button key={m} onClick={() => setActiveModule(m)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${activeModule === m
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
              >
                {m === '全部' ? '📋' : (moduleIcons[m] || '')} {m}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-bold text-slate-800 mb-3">难度与题量</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="flex gap-2">
                {(['全部', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${difficulty === d
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    {d === '全部' ? '不限' : d === 'easy' ? '🟢 基础' : d === 'medium' ? '🟡 进阶' : '🔴 冲刺'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">题量</span>
              {[5, 10, 15, 20].map((n) => (
                <button key={n} onClick={() => setQuestionCount(n)}
                  className={`w-10 h-8 rounded-lg text-xs font-semibold transition-all
                    ${questionCount === n ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                >{n}</button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">题库统计</p>
                <p className="text-xs text-slate-500">当前筛选条件下可用题目</p>
              </div>
              <span className="text-2xl font-bold text-indigo-600">{filteredPool.length}<span className="text-sm font-normal text-slate-400">题</span></span>
            </div>
          </div>

          <button onClick={startQuiz} disabled={filteredPool.length === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            开始答题 <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tips */}
        <div className="grid sm:grid-cols-3 gap-3 animate-slide-up">
          {[
            { icon: Clock, title: '计时答题', desc: '每道题控制在1-1.5分钟内完成' },
            { icon: Target, title: '先做会做的', desc: '遇到难题先标记跳过，回头再做' },
            { icon: RotateCcw, title: '错题复盘', desc: '做完后逐题查看解析，整理错题本' },
          ].map((tip, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-4">
              <tip.icon className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-sm font-semibold text-slate-800">{tip.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Active state
  if (quizState === 'active' && currentQ) {
    return (
      <div className="p-4 lg:p-6 space-y-4 max-w-3xl mx-auto animate-fade-in">
        {/* Progress bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">
              第 {currentIndex + 1}/{questions.length} 题
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${moduleColors[currentQ.module]}`}>
              {moduleIcons[currentQ.module]} {currentQ.module}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentQ.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' : currentQ.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
              {currentQ.difficulty === 'easy' ? '🟢 基础' : currentQ.difficulty === 'medium' ? '🟡 进阶' : '🔴 冲刺'}
            </span>
            <span className="text-[10px] text-slate-400">{currentQ.type === 'single' ? '单选' : '多选'}</span>
          </div>

          <p className="text-sm lg:text-base text-slate-800 leading-relaxed font-medium mb-6 whitespace-pre-wrap">{currentQ.question}</p>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, i) => {
              const selected = (selectedAnswers[currentQ.id] || []).includes(i)
              let style = 'border-slate-200 bg-white hover:bg-slate-50'
              if (submitted) {
                if (currentQ.answer.includes(i)) {
                  style = 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200'
                } else if (selected && !currentQ.answer.includes(i)) {
                  style = 'border-rose-300 bg-rose-50 ring-1 ring-rose-200'
                }
              } else if (selected) {
                style = 'border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200'
              }
              return (
                <button key={i} onClick={() => toggleAnswer(currentQ.id, i, currentQ.type === 'multi')}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-200 ${style} flex items-start gap-3`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${selected && !submitted ? 'border-indigo-600 bg-indigo-600 text-white' : submitted && currentQ.answer.includes(i) ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'}`}>
                    {submitted && currentQ.answer.includes(i) && <Check className="w-3 h-3 text-white" />}
                    {submitted && selected && !currentQ.answer.includes(i) && <X className="w-3 h-3 text-white" />}
                    {!submitted && selected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="flex-1">{opt}</span>
                  {submitted && currentQ.answer.includes(i) && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                  {submitted && selected && !currentQ.answer.includes(i) && <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation after submit */}
        {submitted && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              {checkAnswer(currentQ, selectedAnswers[currentQ.id] || []) ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" /> 回答正确
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-xs font-semibold">
                  <X className="w-3.5 h-3.5" /> 回答错误
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">解析</p>
            <p className="text-sm text-slate-700 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => { setCurrentIndex(i => Math.max(0, i - 1)); setSubmitted(false) }}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all"
          >上一题</button>

          {!submitted ? (
            <button onClick={() => setSubmitted(true)}
              disabled={(selectedAnswers[currentQ.id] || []).length === 0}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-md shadow-indigo-200"
            >提交答案</button>
          ) : currentIndex < questions.length - 1 ? (
            <button onClick={() => { setCurrentIndex(i => i + 1); setSubmitted(false) }}
              className="flex items-center gap-1 px-5 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-200"
            >下一题 <ChevronRight className="w-4 h-4" /></button>
          ) : (
            <button onClick={() => setQuizState('finished')}
              className="flex items-center gap-1 px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-200"
            >查看成绩 <Trophy className="w-4 h-4" /></button>
          )}
        </div>
      </div>
    )
  }

  // Finished state
  if (quizState === 'finished' && score) {
    const emoji = score.percentage >= 80 ? '🎉' : score.percentage >= 60 ? '👍' : '💪'
    const message = score.percentage >= 80 ? '非常棒！你已经具备冲击目标企业的笔试水平！' : score.percentage >= 60 ? '基础不错！继续针对性练习，提升空间很大！' : '继续加油！分析错题找到薄弱点，下次一定更好！'
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-2xl mx-auto animate-scale-in">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-sm text-center">
          <div className="text-5xl mb-4">{emoji}</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">练习完成！</h2>
          <p className="text-sm text-slate-500 mb-6">{message}</p>

          {/* Score circle */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg className="w-32 h-32 -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle cx="64" cy="64" r="56" fill="none"
                stroke={score.percentage >= 80 ? '#10b981' : score.percentage >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${score.percentage * 3.52} ${352 - score.percentage * 3.52}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-slate-800">{score.percentage}</span>
              <span className="text-sm text-slate-400">%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-lg font-bold text-emerald-700">{score.correct}</p>
              <p className="text-[10px] text-emerald-600">正确</p>
            </div>
            <div className="bg-rose-50 rounded-xl p-3">
              <p className="text-lg font-bold text-rose-700">{score.total - score.correct}</p>
              <p className="text-[10px] text-rose-600">错误</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3">
              <p className="text-lg font-bold text-indigo-700">{score.total}</p>
              <p className="text-[10px] text-indigo-600">总题数</p>
            </div>
          </div>

          {/* Review answers */}
          <div className="space-y-2 mb-6">
            <h3 className="text-sm font-bold text-slate-800 text-left">答题详情</h3>
            {questions.map((q, i) => {
              const correct = checkAnswer(q, selectedAnswers[q.id] || [])
              return (
                <div key={q.id} className={`flex items-center justify-between p-3 rounded-xl text-left ${correct ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    {correct ? <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <X className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                    <span className="text-xs text-slate-700 truncate">第{i + 1}题 · {q.question.slice(0, 30)}…</span>
                  </div>
                  <span className={`text-[10px] font-medium flex-shrink-0 ${moduleColors[q.module]}`}>{q.module}</span>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setQuizState('idle'); setCurrentIndex(0); setSelectedAnswers({}); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
            ><RotateCcw className="w-4 h-4" /> 重新选题</button>
            <button onClick={startQuiz}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-200"
            >再练一组 <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
