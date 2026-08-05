import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileQuestion,
  Filter,
  RotateCcw,
  Search,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react'
import { examPapers } from '../data/papers'
import type { ExamPaper, PaperAuthenticity, PaperCategory, PaperProgress, PaperQuestion } from '../types'

const STORAGE_KEY = 'beikao-paper-progress-v1'
const categories: Array<'全部' | PaperCategory> = ['全部', '央国企', '国考', '省考']

const authenticityStyles: Record<PaperAuthenticity, string> = {
  官方样题: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  公开真题: 'bg-blue-50 text-blue-700 border-blue-200',
  回忆考情精编: 'bg-amber-50 text-amber-700 border-amber-200',
  考纲模拟: 'bg-slate-100 text-slate-700 border-slate-200',
}

const categoryStyles: Record<PaperCategory, string> = {
  央国企: 'bg-indigo-50 text-indigo-700',
  国考: 'bg-rose-50 text-rose-700',
  省考: 'bg-teal-50 text-teal-700',
}

type ViewState = 'library' | 'exam' | 'result'
type AnswerMap = Record<string, number[]>

function readProgress(): Record<string, PaperProgress> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function isCorrect(question: PaperQuestion, selected: number[] = []) {
  return selected.length === question.answer.length
    && question.answer.every(answer => selected.includes(answer))
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainder = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}

export default function PaperBank() {
  const [view, setView] = useState<ViewState>('library')
  const [category, setCategory] = useState<'全部' | PaperCategory>('全部')
  const [query, setQuery] = useState('')
  const [activePaper, setActivePaper] = useState<ExamPaper | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [progress, setProgress] = useState<Record<string, PaperProgress>>(readProgress)
  const [resultScore, setResultScore] = useState(0)

  const filteredPapers = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return examPapers.filter(paper => {
      const matchesCategory = category === '全部' || paper.category === category
      const matchesQuery = !keyword || `${paper.title}${paper.organization}${paper.sections.join('')}`.toLowerCase().includes(keyword)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const completedCount = Object.values(progress).filter(item => item.attempts > 0).length
  const bestAverage = completedCount
    ? Math.round(Object.values(progress).reduce((sum, item) => sum + item.bestScore, 0) / completedCount)
    : 0

  const finishPaper = useCallback(() => {
    if (!activePaper) return
    const correctCount = activePaper.questions.filter(question => isCorrect(question, answers[question.id])).length
    const score = Math.round((correctCount / activePaper.questions.length) * 100)
    const wrongQuestionIds = activePaper.questions
      .filter(question => !isCorrect(question, answers[question.id]))
      .map(question => question.id)
    const previous = progress[activePaper.id]
    const nextItem: PaperProgress = {
      attempts: (previous?.attempts || 0) + 1,
      bestScore: Math.max(previous?.bestScore || 0, score),
      lastScore: score,
      wrongQuestionIds,
      lastPracticedAt: new Date().toISOString(),
    }
    const nextProgress = { ...progress, [activePaper.id]: nextItem }
    setProgress(nextProgress)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress))
    setResultScore(score)
    setView('result')
  }, [activePaper, answers, progress])

  useEffect(() => {
    if (view !== 'exam') return
    const timer = window.setInterval(() => {
      setRemainingSeconds(current => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [view])

  useEffect(() => {
    if (view === 'exam' && activePaper && remainingSeconds === 0) finishPaper()
  }, [activePaper, finishPaper, remainingSeconds, view])

  const startPaper = (paper: ExamPaper) => {
    setActivePaper(paper)
    setAnswers({})
    setCurrentIndex(0)
    setRemainingSeconds(paper.durationMinutes * 60)
    setResultScore(0)
    setView('exam')
  }

  const returnToLibrary = () => {
    setView('library')
    setActivePaper(null)
    setCurrentIndex(0)
    setAnswers({})
  }

  const toggleAnswer = (question: PaperQuestion, optionIndex: number) => {
    setAnswers(current => {
      const selected = current[question.id] || []
      if (question.type === 'single') return { ...current, [question.id]: [optionIndex] }
      return {
        ...current,
        [question.id]: selected.includes(optionIndex)
          ? selected.filter(item => item !== optionIndex)
          : [...selected, optionIndex],
      }
    })
  }

  if (view === 'library') {
    return (
      <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <FileQuestion className="w-5 h-5" />
              <span className="text-xs font-bold">成套训练</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">真题套卷</h2>
            <p className="text-sm text-slate-500 mt-1">按单位和年份整套作答，来源与真实性逐卷标注</p>
          </div>
          <div className="grid grid-cols-3 gap-2 min-w-full lg:min-w-[390px]">
            {[
              { label: '已收录套卷', value: examPapers.length, suffix: '套' },
              { label: '已完成', value: completedCount, suffix: '套' },
              { label: '平均最佳', value: bestAverage, suffix: '%' },
            ].map(item => (
              <div key={item.label} className="bg-white border border-slate-200 rounded-lg px-3 py-3 text-center">
                <p className="text-lg font-bold text-slate-900">{item.value}<span className="text-xs font-normal text-slate-400 ml-0.5">{item.suffix}</span></p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">先看真实性标签</p>
            <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed">
              “公开真题”与“官方样题”可追溯原始页面；国企“回忆考情精编”只按公开笔经还原题型，卷内题目为原创训练，不冒充泄露原卷。
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="搜索单位、年份或题型"
              className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 overflow-x-auto">
            <Filter className="w-4 h-4 text-slate-400 mx-2 shrink-0" />
            {categories.map(item => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`h-8 px-3 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${category === item ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filteredPapers.map(paper => {
            const paperProgress = progress[paper.id]
            return (
              <article key={paper.id} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col min-h-[285px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-semibold ${categoryStyles[paper.category]}`}>{paper.category}</span>
                      <span className={`px-2 py-1 rounded-md border text-[11px] font-semibold ${authenticityStyles[paper.authenticity]}`}>{paper.authenticity}</span>
                      <span className="text-[11px] text-slate-400">{paper.year}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{paper.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{paper.description}</p>
                  </div>
                  {paperProgress && (
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-indigo-600">{paperProgress.bestScore}%</p>
                      <p className="text-[10px] text-slate-400">最佳成绩</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><BookOpenCheck className="w-3.5 h-3.5" />{paper.questions.length}题</span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" />{paper.durationMinutes}分钟</span>
                  <span className="inline-flex items-center gap-1"><Target className="w-3.5 h-3.5" />{paper.sections.length}模块</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {paper.sections.map(section => (
                    <span key={section} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] text-slate-600">{section}</span>
                  ))}
                </div>

                <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                  <a href={paper.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 min-w-0">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">查看来源</span>
                  </a>
                  <button
                    onClick={() => startPaper(paper)}
                    className="h-9 px-4 inline-flex items-center gap-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition-colors shrink-0"
                  >
                    {paperProgress ? '再刷一次' : '开始套卷'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {filteredPapers.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-500">没有匹配的套卷</div>
        )}

        <section className="border-t border-slate-200 pt-5 pb-2">
          <h3 className="text-sm font-bold text-slate-900">收录规则</h3>
          <div className="grid sm:grid-cols-3 gap-4 mt-3 text-xs text-slate-600 leading-relaxed">
            <p><strong className="text-emerald-700">官方样题</strong><br />官方考试大纲明确发布的示例题，可直接核验题目与答案。</p>
            <p><strong className="text-blue-700">公开真题</strong><br />权威媒体或公开历史资料中的正式考试题，仅精选收录并保留原链接。</p>
            <p><strong className="text-amber-700">考情精编</strong><br />依据公开笔经还原模块、题量和难度，使用原创题目训练，不能视作原卷。</p>
          </div>
        </section>
      </div>
    )
  }

  if (!activePaper) return null
  const currentQuestion = activePaper.questions[currentIndex]
  const answeredCount = activePaper.questions.filter(question => (answers[question.id] || []).length > 0).length

  if (view === 'exam') {
    return (
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button onClick={returnToLibrary} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />退出套卷
          </button>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border font-mono text-sm font-bold ${remainingSeconds < 60 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-800'}`}>
            <Clock3 className="w-4 h-4" />{formatTime(remainingSeconds)}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg px-4 py-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-[11px] text-indigo-600 font-semibold">{activePaper.organization} · {activePaper.year}</p>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{activePaper.title}</h2>
            </div>
            <p className="text-xs text-slate-500">已答 {answeredCount}/{activePaper.questions.length}</p>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all" style={{ width: `${(answeredCount / activePaper.questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-4 items-start">
          <section className="bg-white border border-slate-200 rounded-lg p-5 lg:p-7">
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="text-sm font-bold text-slate-900">第 {currentIndex + 1} 题</span>
              <span className="px-2 py-1 rounded-md bg-slate-100 text-[11px] text-slate-600">{currentQuestion.section} · {currentQuestion.type === 'single' ? '单选' : '多选'}</span>
            </div>
            <p className="text-[15px] text-slate-800 leading-7 whitespace-pre-wrap font-medium">{currentQuestion.question}</p>
            <div className="space-y-2.5 mt-6">
              {currentQuestion.options.map((option, optionIndex) => {
                const selected = (answers[currentQuestion.id] || []).includes(optionIndex)
                return (
                  <button
                    key={option}
                    onClick={() => toggleAnswer(currentQuestion, optionIndex)}
                    className={`w-full min-h-12 text-left px-4 py-3 border rounded-lg text-sm leading-6 flex items-start gap-3 transition-colors ${selected ? 'border-indigo-400 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <span className={`w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${selected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 text-slate-500'}`}>
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span>{option.replace(/^[A-D]\.\s*/, '')}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between gap-3 mt-7 pt-5 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex(index => Math.max(0, index - 1))}
                disabled={currentIndex === 0}
                className="h-10 px-4 inline-flex items-center gap-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4" />上一题
              </button>
              {currentIndex < activePaper.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(index => index + 1)}
                  className="h-10 px-4 inline-flex items-center gap-1.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500"
                >
                  下一题<ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={finishPaper} className="h-10 px-5 inline-flex items-center gap-1.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />交卷
                </button>
              )}
            </div>
          </section>

          <aside className="bg-white border border-slate-200 rounded-lg p-4 lg:sticky lg:top-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">答题卡</h3>
              <span className="text-[11px] text-slate-400">点击跳题</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {activePaper.questions.map((question, index) => {
                const answered = (answers[question.id] || []).length > 0
                return (
                  <button
                    key={question.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`aspect-square rounded-md text-xs font-semibold border transition-colors ${index === currentIndex ? 'border-indigo-600 ring-2 ring-indigo-100 text-indigo-700' : answered ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-4">
              <span className="inline-flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-sm bg-indigo-100 border border-indigo-200" />已答</span>
              <span className="inline-flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-sm bg-white border border-slate-200" />未答</span>
            </div>
            <button onClick={finishPaper} className="w-full h-10 mt-5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">
              交卷并查看解析
            </button>
          </aside>
        </div>
      </div>
    )
  }

  const correctCount = activePaper.questions.filter(question => isCorrect(question, answers[question.id])).length
  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-5">
      <section className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <span className={`inline-flex px-2 py-1 rounded-md border text-[11px] font-semibold ${authenticityStyles[activePaper.authenticity]}`}>{activePaper.authenticity}</span>
            <h2 className="text-xl font-bold text-slate-900 mt-3">{activePaper.title}</h2>
            <p className="text-sm text-slate-500 mt-1">本次答对 {correctCount}/{activePaper.questions.length} 题</p>
          </div>
          <div className={`w-24 h-24 rounded-full border-[8px] flex items-center justify-center ${resultScore >= 80 ? 'border-emerald-200 text-emerald-700' : resultScore >= 60 ? 'border-amber-200 text-amber-700' : 'border-rose-200 text-rose-700'}`}>
            <span className="text-2xl font-black">{resultScore}<small className="text-xs font-medium">%</small></span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div><p className="text-lg font-bold text-emerald-700">{correctCount}</p><p className="text-[11px] text-slate-500">正确</p></div>
          <div><p className="text-lg font-bold text-rose-700">{activePaper.questions.length - correctCount}</p><p className="text-[11px] text-slate-500">错误/未答</p></div>
          <div><p className="text-lg font-bold text-indigo-700">{progress[activePaper.id]?.bestScore || resultScore}%</p><p className="text-[11px] text-slate-500">历史最佳</p></div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={() => startPaper(activePaper)} className="h-10 px-4 inline-flex items-center gap-1.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-500">
            <RotateCcw className="w-4 h-4" />再刷一次
          </button>
          <button onClick={returnToLibrary} className="h-10 px-4 inline-flex items-center gap-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />返回套卷库
          </button>
          <a href={activePaper.sourceUrl} target="_blank" rel="noreferrer" className="h-10 px-4 inline-flex items-center gap-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
            <ExternalLink className="w-4 h-4" />核验来源
          </a>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-base font-bold text-slate-900">逐题解析</h3>
          <p className="text-xs text-slate-500">{activePaper.sourceNote}</p>
        </div>
        <div className="space-y-3">
          {activePaper.questions.map((question, index) => {
            const correct = isCorrect(question, answers[question.id])
            const selected = answers[question.id] || []
            return (
              <article key={question.id} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 leading-6 whitespace-pre-wrap">{index + 1}. {question.question}</p>
                    <p className="text-xs text-slate-500 mt-3">
                      你的答案：{selected.length ? selected.map(item => String.fromCharCode(65 + item)).join('、') : '未作答'}
                      <span className="mx-2">·</span>
                      正确答案：{question.answer.map(item => String.fromCharCode(65 + item)).join('、')}
                    </p>
                    <div className="mt-3 bg-slate-50 rounded-md px-3 py-3">
                      <p className="text-xs text-slate-700 leading-5"><strong>解析：</strong>{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
