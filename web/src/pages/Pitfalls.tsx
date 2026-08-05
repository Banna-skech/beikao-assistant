import { useState } from 'react'
import { pitfalls } from '../data/pitfalls'
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, Search, ChevronDown, ChevronUp, Lightbulb, CheckCircle2 } from 'lucide-react'

const phases = ['全部', '网申', '笔试', '面试', '签约', '心态'] as const
const phaseIcons: Record<string, string> = { '网申': '📝', '笔试': '📚', '面试': '🎤', '签约': '📋', '心态': '💪' }

const severityConfig = {
  high: { icon: ShieldAlert, label: '高危', bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300', cardBg: 'bg-rose-50/50' },
  medium: { icon: Shield, label: '注意', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', cardBg: 'bg-amber-50/50' },
  low: { icon: ShieldCheck, label: '提醒', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', cardBg: 'bg-blue-50/50' },
}

export default function Pitfalls() {
  const [activePhase, setActivePhase] = useState<string>('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const filtered = pitfalls.filter(p => {
    if (activePhase !== '全部' && p.phase !== activePhase) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="animate-slide-up">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800">⚠️ 避坑指南</h2>
        <p className="text-sm text-slate-500 mt-1">汇总历年考生踩过的坑和血泪教训，提前避雷不走弯路</p>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-3 animate-slide-up">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索坑点关键词…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all"
          />
        </div>
        <div className="flex gap-1.5 bg-white rounded-xl border border-slate-200 p-1">
          {phases.map((p) => (
            <button key={p} onClick={() => setActivePhase(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activePhase === p ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >{p === '全部' ? '📋 全部' : `${phaseIcons[p] || ''} ${p}`}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 animate-slide-up">
        {[
          { icon: ShieldAlert, label: '高危陷阱', value: pitfalls.filter(p => p.severity === 'high').length, color: 'text-rose-600', bg: 'bg-rose-50' },
          { icon: Shield, label: '需要注意', value: pitfalls.filter(p => p.severity === 'medium').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: ShieldCheck, label: '温馨提示', value: pitfalls.filter(p => p.severity === 'low').length, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-3 flex items-center gap-3`}>
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <div>
              <p className="text-lg font-bold text-slate-800">{s.value}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pitfall cards */}
      <div className="space-y-3">
        {filtered.map((p) => {
          const s = severityConfig[p.severity]
          const isExpanded = expandedIds.has(p.id)
          const Icon = s.icon
          return (
            <div key={p.id}
              className={`bg-white rounded-2xl border-2 transition-all duration-200 hover:shadow-lg animate-slide-up cursor-pointer
                ${isExpanded ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-100'}`}
              onClick={() => toggleExpand(p.id)}
            >
              <div className="p-4 lg:p-5">
                <div className="flex items-start gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${s.bg} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${s.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${s.bg} ${s.text}`}>{s.label}</span>
                      <span className="text-[10px] text-slate-400">{phaseIcons[p.phase]} {p.phase}阶段</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">{p.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded solution */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-slide-down">
                    <div className="flex items-start gap-2.5">
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-100 flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">正确做法</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{p.solution}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-start gap-2.5">
                      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 flex-shrink-0 mt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <p className="text-xs text-amber-800">
                        <strong>过来人说：</strong>
                        {p.severity === 'high' ? '这是最常见的致命错误，一旦踩中前功尽弃！务必牢记。'
                          : p.severity === 'medium' ? '很多人在这里吃亏，提前注意就能轻松避开。'
                          : '不是大事，但提前知道会让你更从容。'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-slate-400">
            <AlertTriangle className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm">没有匹配的陷阱记录</p>
          </div>
        )}
      </div>
    </div>
  )
}
