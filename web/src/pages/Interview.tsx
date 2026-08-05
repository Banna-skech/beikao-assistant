import { useState, useCallback } from 'react'
import { interviewQuestions } from '../data/interviewQuestions'
import type { InterviewQuestion } from '../types'
import { MessageSquare, ArrowRight, RotateCcw, Eye, EyeOff, Lightbulb, Sparkles, CheckCircle2, Send, Users, User, Play } from 'lucide-react'

const categoryIcons: Record<string, string> = {
  '自我认知': '🪞', '岗位匹配': '🎯', '行为经历': '📋', '情景应变': '⚡', '企业认知': '🏢', '职业规划': '🗺️',
}

type Mode = 'select' | 'quick' | 'standard' | 'group'

interface PracticeItem {
  question: InterviewQuestion
  answered: boolean
  userAnswer: string
  showTips: boolean
  showSample: boolean
  selfScore: number
}

export default function Interview() {
  const [mode, setMode] = useState<Mode>('select')
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [sessionComplete, setSessionComplete] = useState(false)

  // Start practice
  const startPractice = useCallback((mode: 'quick' | 'standard') => {
    const count = mode === 'quick' ? 5 : 10
    const shuffled = [...interviewQuestions].sort(() => Math.random() - 0.5)
    // Ensure variety - pick from different categories
    const selected: InterviewQuestion[] = []
    const usedCats = new Set<string>()
    for (const q of shuffled) {
      if (selected.length >= count) break
      if (!usedCats.has(q.category) || selected.length >= count - 2) {
        selected.push(q)
        usedCats.add(q.category)
      }
    }
    setPracticeItems(selected.map(q => ({ question: q, answered: false, userAnswer: '', showTips: false, showSample: false, selfScore: 0 })))
    setCurrentIdx(0)
    setUserInput('')
    setSessionComplete(false)
    setMode(mode)
  }, [])

  // Start group discussion simulation
  const startGroupDiscussion = useCallback(() => {
    const groupPrompt: InterviewQuestion = {
      id: 0, category: '情景应变',
      question: `【无领导小组讨论模拟】

🎯 题目：某国有企业计划投入1000万元用于员工福利改善，现有以下四个方案：

A. 建立员工学习发展中心（300万）— 提供培训课程、认证考试补贴
B. 完善健康管理体系（250万）— 年度体检升级、心理咨询、健身房
C. 优化办公环境（250万）— 升级办公设备、增加休息区、改善食堂
D. 增设员工关怀基金（200万）— 困难员工帮扶、子女教育补贴

请你们小组讨论，按优先级对以上方案排序，并给出资金分配建议。

⏱ 讨论时间：20分钟 | 📋 最后需要3分钟的总结汇报`,
      tips: `作为"领导者"，你需要引导讨论：①先确定评选标准 ②逐一讨论各方案优劣 ③整合意见形成结论 ④确保有清晰的总结。注意平衡各成员发言机会。`,
      sampleAnswer: "总结发言模板：经过小组讨论，我们确定了'必要性+可行性'的评判框架。四个方案按优先级排序为B-A-D-C。健康管理直接关系员工生命安全，列第一位，建议投入250万；学习发展中心助力员工成长与企业竞争力，列第二位，建议投入280万；员工关怀基金体现代际关怀，列第三位，建议投入220万；办公环境优化作为锦上添花，列第四位，建议投入250万。"
    }
    setPracticeItems([{ question: groupPrompt, answered: false, userAnswer: '', showTips: false, showSample: false, selfScore: 0 }])
    setCurrentIdx(0)
    setUserInput('')
    setSessionComplete(false)
    setMode('group')
  }, [])

  const currentItem = practiceItems[currentIdx]

  const submitAnswer = () => {
    if (!userInput.trim() || !currentItem) return
    setPracticeItems(prev => prev.map((item, i) =>
      i === currentIdx ? { ...item, answered: true, userAnswer: userInput } : item
    ))
  }

  const nextQuestion = () => {
    if (currentIdx < practiceItems.length - 1) {
      setCurrentIdx(i => i + 1)
      setUserInput('')
    } else {
      setSessionComplete(true)
    }
  }

  // Mode selection screen
  if (mode === 'select') {
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="animate-slide-up">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800">🎤 模拟面试</h2>
          <p className="text-sm text-slate-500 mt-1">半结构化面试 + 无领导小组讨论，真实场景模拟</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 animate-slide-up">
          {/* Quick mode */}
          <button onClick={() => startPractice('quick')}
            className="bg-white rounded-2xl border-2 border-slate-200 p-6 text-left hover:border-indigo-300 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 mb-4 group-hover:bg-indigo-100 transition-colors">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">快速模式</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">5道高频面试题，约10分钟。适合碎片时间快速练习</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-2 transition-all">
              <Play className="w-3.5 h-3.5" /> 开始练习
            </span>
          </button>

          {/* Standard mode */}
          <button onClick={() => startPractice('standard')}
            className="bg-white rounded-2xl border-2 border-violet-200 p-6 text-left hover:border-violet-400 hover:shadow-lg transition-all duration-200 group ring-1 ring-violet-100"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 mb-4 group-hover:bg-violet-100 transition-colors">
              <MessageSquare className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">标准模式 ⭐</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">10道题覆盖六大题型，约20分钟。还原真实面试全流程</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 group-hover:gap-2 transition-all">
              <Play className="w-3.5 h-3.5" /> 开始练习
            </span>
          </button>

          {/* Group discussion */}
          <button onClick={startGroupDiscussion}
            className="bg-white rounded-2xl border-2 border-slate-200 p-6 text-left hover:border-amber-300 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 mb-4 group-hover:bg-amber-100 transition-colors">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">群面模拟</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">无领导小组讨论，含完整的题目、角色分配和总结点评</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
              <Play className="w-3.5 h-3.5" /> 开始模拟
            </span>
          </button>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800">面试备考建议</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { title: '对着镜子练', desc: '自我介绍流畅度和表情管理，录视频回看效果更好' },
              { title: 'STAR法则', desc: '所有经历类问题用"情境-任务-行动-结果"框架回答' },
              { title: '先写后说', desc: '先把每个高频问题的答案写下来打磨，再出声练习' },
            ].map((t, i) => (
              <div key={i} className="bg-white/80 rounded-xl p-3">
                <p className="text-xs font-semibold text-slate-800">{t.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Session complete
  if (sessionComplete) {
    const answered = practiceItems.filter(i => i.answered).length
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6 animate-scale-in">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-sm text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">面试模拟完成！</h2>
          <p className="text-sm text-slate-500 mb-6">
            你完成了 {answered}/{practiceItems.length} 道题的练习。
            {answered === practiceItems.length ? '全勤完成，非常棒！' : '下次继续加油！'}
          </p>

          {/* Review all answers */}
          <div className="space-y-3 mb-6">
            {practiceItems.map((item, i) => (
              <div key={i} className={`text-left p-4 rounded-xl ${item.answered ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 border border-slate-100'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs font-semibold text-slate-800">Q{i + 1}. {item.question.question.slice(0, 50)}…</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-500">{item.question.category}</span>
                </div>
                {item.answered ? (
                  <p className="text-xs text-slate-600 italic bg-white rounded-lg p-2 border border-indigo-100">✍️ {item.userAnswer}</p>
                ) : (
                  <p className="text-xs text-amber-600">⚠️ 未回答，建议回顾此题</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setMode('select')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all"
            ><RotateCcw className="w-4 h-4" /> 返回首页</button>
            <button onClick={() => startPractice(mode === 'group' ? 'standard' : mode)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-200"
            >再来一轮 <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    )
  }

  // Active practice
  if (!currentItem) return null

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-3xl mx-auto animate-fade-in">
      {/* Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700">
            {mode === 'group' ? '无领导小组讨论' : `第 ${currentIdx + 1}/${practiceItems.length} 题`}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
            {categoryIcons[currentItem.question.category]} {currentItem.question.category}
          </span>
        </div>
        {mode !== 'group' && (
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / practiceItems.length) * 100}%` }} />
          </div>
        )}
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex-shrink-0">
            <span className="text-sm font-bold">{currentIdx + 1}</span>
          </div>
          <div>
            <p className="text-sm lg:text-base text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{currentItem.question.question}</p>
          </div>
        </div>

        {/* Tips (toggle) */}
        {currentItem.question.tips && (
          <div className="mb-4">
            <button onClick={() => setPracticeItems(prev => prev.map((item, i) =>
              i === currentIdx ? { ...item, showTips: !item.showTips } : item
            ))}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              {currentItem.showTips ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {currentItem.showTips ? '隐藏' : '查看'}答题提示
            </button>
            {currentItem.showTips && (
              <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-100 animate-slide-down">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] font-semibold text-amber-700">答题技巧</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">{currentItem.question.tips}</p>
              </div>
            )}
          </div>
        )}

        {/* Answer input */}
        {!currentItem.answered ? (
          <div className="space-y-3">
            <textarea
              value={userInput} onChange={e => setUserInput(e.target.value)}
              placeholder="在此输入你的回答…（练习时先思考30秒再动笔，模拟真实面试状态）"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all resize-none"
            />
            <button onClick={submitAnswer} disabled={!userInput.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-md shadow-indigo-200"
            ><Send className="w-4 h-4" /> 提交回答</button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User's answer */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">你的回答</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{currentItem.userAnswer}</p>
            </div>

            {/* Self score */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400">自评打分：</span>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setPracticeItems(prev => prev.map((item, i) =>
                  i === currentIdx ? { ...item, selfScore: s } : item
                ))}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentItem.selfScore >= s
                    ? 'bg-amber-400 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >{s}</button>
              ))}
            </div>

            {/* Sample answer */}
            <div>
              <button onClick={() => setPracticeItems(prev => prev.map((item, i) =>
                i === currentIdx ? { ...item, showSample: !item.showSample } : item
              ))}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {currentItem.showSample ? <EyeOff className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                {currentItem.showSample ? '隐藏' : '查看'}高分回答参考
              </button>
              {currentItem.showSample && (
                <div className="mt-2 p-4 rounded-xl bg-indigo-50 border border-indigo-100 animate-slide-down">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-semibold text-indigo-700">参考回答</span>
                  </div>
                  <p className="text-xs text-indigo-900 leading-relaxed whitespace-pre-wrap">{currentItem.question.sampleAnswer}</p>
                </div>
              )}
            </div>

            <button onClick={nextQuestion}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-200"
            >
              {currentIdx < practiceItems.length - 1 ? <>下一题 <ArrowRight className="w-4 h-4" /></> : <>查看总结 <CheckCircle2 className="w-4 h-4" /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
