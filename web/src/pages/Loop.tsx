import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle, BarChart3, CalendarCheck, CheckCircle2, Circle, ClipboardCheck, Clock, Flame, RotateCcw, Target,
} from 'lucide-react'
import { beginnerMilestones, dailyLoopBlocks, weeklyFocus } from '../data/studyLoop'
import type { DailyLoopRecord } from '../types'

const LOOP_KEY = 'beikao-daily-loop-records-v1'
const weekDayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const reasons = ['知识点不会', '方法不熟', '审题粗心', '时间不够', '心态走神']

const emptyRecord = (date: string): DailyLoopRecord => ({
  date,
  completedBlockIds: [],
  minutesByBlock: {},
  proofByBlock: {},
  wrongCount: 0,
  weakReason: '方法不熟',
  fixAction: '',
  shenlunOutput: '',
  tomorrowStart: '19:30',
  tomorrowFirstBlock: dailyLoopBlocks[0].title,
  commitment: '',
  updatedAt: '',
})

function todayKey() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function loadRecords() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(LOOP_KEY)
    return raw ? JSON.parse(raw) as Record<string, DailyLoopRecord> : {}
  } catch {
    return {}
  }
}

function getStreak(records: Record<string, DailyLoopRecord>) {
  let streak = 0
  const cursor = new Date()
  for (;;) {
    const yyyy = cursor.getFullYear()
    const mm = String(cursor.getMonth() + 1).padStart(2, '0')
    const dd = String(cursor.getDate()).padStart(2, '0')
    const key = `${yyyy}-${mm}-${dd}`
    const record = records[key]
    if (!record || record.completedBlockIds.length < 4) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date(`${date}T12:00:00`))
}

export default function Loop() {
  const [records, setRecords] = useState<Record<string, DailyLoopRecord>>(() => loadRecords())
  const [activeDate, setActiveDate] = useState(todayKey())
  const record = records[activeDate] ?? emptyRecord(activeDate)

  useEffect(() => {
    window.localStorage.setItem(LOOP_KEY, JSON.stringify(records))
  }, [records])

  const todayFocus = weeklyFocus.find(item => item.day === weekDayLabels[new Date(`${activeDate}T12:00:00`).getDay()]) ?? weeklyFocus[0]

  const totalMinutes = dailyLoopBlocks.reduce((sum, block) => sum + (record.minutesByBlock[block.id] || 0), 0)
  const plannedMinutes = dailyLoopBlocks.reduce((sum, block) => sum + block.minutes, 0)
  const completion = Math.round((record.completedBlockIds.length / dailyLoopBlocks.length) * 100)
  const streak = useMemo(() => getStreak(records), [records])
  const recordedDays = Object.keys(records).filter(date => records[date].completedBlockIds.length > 0).length
  const isClosed = record.completedBlockIds.length >= 4 && record.fixAction.trim() && record.shenlunOutput.trim() && record.commitment.trim()

  const updateRecord = (patch: Partial<DailyLoopRecord>) => {
    setRecords(prev => {
      const current = prev[activeDate] ?? emptyRecord(activeDate)
      return {
        ...prev,
        [activeDate]: {
          ...current,
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      }
    })
  }

  const toggleBlock = (blockId: string) => {
    const completed = record.completedBlockIds.includes(blockId)
    updateRecord({
      completedBlockIds: completed
        ? record.completedBlockIds.filter(id => id !== blockId)
        : [...record.completedBlockIds, blockId],
    })
  }

  const updateBlockMinutes = (blockId: string, minutes: number) => {
    updateRecord({
      minutesByBlock: {
        ...record.minutesByBlock,
        [blockId]: Math.max(0, Math.round(minutes || 0)),
      },
    })
  }

  const updateBlockProof = (blockId: string, value: string) => {
    updateRecord({
      proofByBlock: {
        ...record.proofByBlock,
        [blockId]: value,
      },
    })
  }

  const resetToday = () => {
    setRecords(prev => {
      const next = { ...prev }
      delete next[activeDate]
      return next
    })
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between animate-slide-up">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800">✅ 闭环执行</h2>
          <p className="text-sm text-slate-500 mt-1">零基础按天推进：学一点、做一组、改错题、写输出、定明天</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={activeDate}
            onChange={event => setActiveDate(event.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            onClick={resetToday}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center transition-all"
            title="重置当天记录"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        {[
          { icon: Target, label: '今日闭环', value: `${completion}%`, color: 'text-indigo-600 bg-indigo-50' },
          { icon: Clock, label: '实际投入', value: `${totalMinutes}/${plannedMinutes}分`, color: 'text-amber-600 bg-amber-50' },
          { icon: Flame, label: '连续达标', value: `${streak}天`, color: 'text-rose-600 bg-rose-50' },
          { icon: CalendarCheck, label: '有记录天数', value: `${recordedDays}天`, color: 'text-emerald-600 bg-emerald-50' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">{item.label}</p>
                <p className="text-lg font-bold text-slate-800">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">{formatDateLabel(activeDate)}</h3>
                <p className="text-xs text-slate-500 mt-1">今日主攻：{todayFocus.module} · {todayFocus.rule}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isClosed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {isClosed ? '闭环完成' : '执行中'}
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${isClosed ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${completion}%` }} />
            </div>
          </div>

          {dailyLoopBlocks.map((block, index) => {
            const completed = record.completedBlockIds.includes(block.id)
            return (
              <div
                key={block.id}
                className={`rounded-2xl border p-5 shadow-sm animate-slide-up transition-all ${
                  completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200/80'
                }`}
                style={{ animationDelay: `${0.08 + index * 0.04}s` }}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <button onClick={() => toggleBlock(block.id)} className="flex items-start gap-3 text-left group">
                    {completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 font-semibold">{block.type}</span>
                        <span className="text-[10px] text-slate-400">{block.module} · 计划{block.minutes}分钟</span>
                      </div>
                      <h4 className={`text-sm font-bold ${completed ? 'text-emerald-800' : 'text-slate-800'}`}>{block.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{block.output}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 lg:w-36">
                    <input
                      type="number"
                      min="0"
                      value={record.minutesByBlock[block.id] || ''}
                      onChange={event => updateBlockMinutes(block.id, Number(event.target.value))}
                      placeholder="分钟"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <span className="text-xs text-slate-400">分</span>
                  </div>
                </div>
                <textarea
                  value={record.proofByBlock[block.id] || ''}
                  onChange={event => updateBlockProof(block.id, event.target.value)}
                  placeholder="留下完成证据：课程名、题号范围、正确率、错题编号或一句总结"
                  className="mt-4 w-full min-h-20 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
                />
              </div>
            )
          })}

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-800">错题复盘</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <label>
                  <span className="text-[11px] font-semibold text-slate-500">今日错题数</span>
                  <input
                    type="number"
                    min="0"
                    value={record.wrongCount || ''}
                    onChange={event => updateRecord({ wrongCount: Math.max(0, Number(event.target.value) || 0) })}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </label>
                <label>
                  <span className="text-[11px] font-semibold text-slate-500">主要原因</span>
                  <select
                    value={record.weakReason}
                    onChange={event => updateRecord({ weakReason: event.target.value })}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {reasons.map(reason => <option key={reason}>{reason}</option>)}
                  </select>
                </label>
              </div>
              <textarea
                value={record.fixAction}
                onChange={event => updateRecord({ fixAction: event.target.value })}
                placeholder="明天针对错因做什么：例如资料分析增长率再看1节课+做15题"
                className="w-full min-h-28 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-800">申论输出</h3>
              </div>
              <textarea
                value={record.shenlunOutput}
                onChange={event => updateRecord({ shenlunOutput: event.target.value })}
                placeholder="今天必须写一点：一个标题、一个分论点、一个对策段或一条素材改写"
                className="w-full min-h-44 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl border border-indigo-100 p-5 shadow-sm animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800">明日锁定</h3>
            </div>
            <div className="grid lg:grid-cols-3 gap-3 mb-3">
              <label>
                <span className="text-[11px] font-semibold text-slate-500">开始时间</span>
                <input
                  type="time"
                  value={record.tomorrowStart}
                  onChange={event => updateRecord({ tomorrowStart: event.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label>
                <span className="text-[11px] font-semibold text-slate-500">第一步</span>
                <select
                  value={record.tomorrowFirstBlock}
                  onChange={event => updateRecord({ tomorrowFirstBlock: event.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {dailyLoopBlocks.map(block => <option key={block.id}>{block.title}</option>)}
                </select>
              </label>
              <label>
                <span className="text-[11px] font-semibold text-slate-500">一句承诺</span>
                <input
                  value={record.commitment}
                  onChange={event => updateRecord({ commitment: event.target.value })}
                  placeholder="到点就坐下，不等状态"
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
            </div>
            <p className="text-xs text-slate-500">达标标准：5个学习块完成至少4个，并写下错题修正、申论输出和明日承诺。</p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800">备考闭环</h3>
            </div>
            <div className="space-y-3">
              {['输入课程', '当场做题', '错题归因', '申论输出', '锁定明天'].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">{index + 1}</span>
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up">
            <h3 className="text-sm font-bold text-slate-800 mb-4">新手里程碑</h3>
            <div className="space-y-3">
              {beginnerMilestones.map(item => (
                <div key={item.stage} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-indigo-600">{item.stage}</span>
                    <span className="text-xs font-semibold text-slate-800">{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.target}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up">
            <h3 className="text-sm font-bold text-slate-800 mb-4">一周主线</h3>
            <div className="space-y-2">
              {weeklyFocus.map(item => (
                <div
                  key={item.day}
                  className={`p-3 rounded-xl border ${
                    item.day === todayFocus.day ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700">{item.day}</span>
                    <span className="text-xs font-semibold text-indigo-600">{item.module}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.rule}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
