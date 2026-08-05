import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { TimelineEvent } from '../types'
import { timeline } from '../data/timeline'
import {
  Target, Clock, BookOpen, TrendingUp, ArrowRight, Calendar, Zap, AlertCircle,
  ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Building2, Brain, MessageSquare, AlertTriangle, Video, ClipboardCheck,
} from 'lucide-react'

const stats = [
  { icon: Building2, label: '国资委央企', value: '99家', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
  { icon: Clock, label: '距秋招正式批', value: '55天', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600' },
  { icon: Target, label: '网申淘汰率', value: '~70%', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', text: 'text-rose-600' },
  { icon: TrendingUp, label: '系统备考通过率', value: '提升3倍', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
]

const quickActions = [
  { icon: ClipboardCheck, label: '闭环执行', desc: '今天照单完成', to: '/loop', color: 'rose' },
  { icon: Brain, label: '开始刷题', desc: '行测五大模块练习', to: '/quiz', color: 'indigo' },
  { icon: MessageSquare, label: '模拟面试', desc: '半结构化+群面训练', to: '/interview', color: 'violet' },
  { icon: BookOpen, label: '制定规划', desc: '个性化备考时间表', to: '/planner', color: 'emerald' },
  { icon: Video, label: '课程学习', desc: '老师课程+进度记录', to: '/courses', color: 'blue' },
  { icon: AlertTriangle, label: '避坑指南', desc: '过来人血泪教训', to: '/pitfalls', color: 'amber' },
]

const colorMap: Record<TimelineEvent['color'], { bg: string; border: string; dot: string; badge: string }> = {
  blue:   { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
  amber:  { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
  emerald:{ bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700' },
  rose:   { bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500', badge: 'bg-rose-100 text-rose-700' },
  slate:  { bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-500', badge: 'bg-slate-100 text-slate-600' },
}

function TimelineCard({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const c = colorMap[event.color]

  return (
    <div className="relative flex gap-4 pb-1">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${c.dot} ring-4 ring-offset-2 ${c.bg}`} />
        {!isLast && <div className="w-0.5 flex-1 bg-slate-200 mt-1" />}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
        <div className={`rounded-xl border ${c.border} ${c.bg} p-4 transition-all duration-200 hover:shadow-md`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold ${c.badge}`}>{event.phase}</span>
              <span className="ml-2 text-xs font-medium text-slate-500">{event.month}</span>
            </div>
            <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600 transition-colors">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">{event.title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>

          {/* Expanded actions */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 animate-slide-down">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">本月行动清单</p>
              <div className="space-y-1.5">
                {event.actions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800">🎯 学习看板</h2>
        <p className="text-sm text-slate-500 mt-1">系统化备战央国企秋招，每一步都走在正确的路上</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.text}`} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
                <p className={`text-lg font-bold ${s.text}`}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Timeline - takes 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick actions */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {quickActions.map((a, i) => (
              <Link key={i} to={a.to}
                className="group bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-${a.color}-50 mb-2`}>
                  <a.icon className={`w-4 h-4 text-${a.color}-600`} />
                </div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{a.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{a.desc}</p>
              </Link>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 lg:p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-800">秋招时间线</h3>
              </div>
              <span className="text-[11px] text-slate-400">2027届 · 12个月规划</span>
            </div>
            <div className="pl-1">
              {timeline.map((event, i) => (
                <TimelineCard key={i} event={event} isLast={i === timeline.length - 1} />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Urgent reminder */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-800">🔥 紧急提醒</h3>
            </div>
            <ul className="space-y-2.5">
              {[
                { label: '提前批', desc: '军工/通信/能源央企已启动，免笔试直通面试', done: false },
                { label: '拍证件照', desc: '蓝底专业照，网申通过率提升30%', done: false },
                { label: '准备材料', desc: '扫描成绩单、证书、学籍验证报告', done: false },
                { label: '简历初稿', desc: '至少准备2-3个行业版本', done: false },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Top picks */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3">🏆 热门投递企业</h3>
            <div className="space-y-2">
              {[
                { name: '国家电网', tag: '校招第一大雇主', deadline: '一批11月网申' },
                { name: '中国移动', tag: '运营商之首', deadline: '8月底起网申' },
                { name: '中石油/中石化', tag: '待遇优厚', deadline: '9月中旬起网申' },
                { name: '国有六大行', tag: '全国有岗', deadline: '8月底起网申' },
                { name: '中国烟草', tag: '待遇天花板', deadline: '各省11月起' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.deadline}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{item.tag}</span>
                </div>
              ))}
            </div>
            <Link to="/enterprises" className="flex items-center justify-center gap-1 mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700">
              查看全部99家央企 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Resource quick links */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3">🔗 关键平台直达</h3>
            <div className="space-y-1.5">
              {[
                { label: '国聘网', url: 'https://www.iguopin.com', desc: '国资委指导·最权威' },
                { label: '国家电网招聘平台', url: 'https://zhaopin.sgcc.com.cn', desc: '一批12月统考' },
                { label: '国资小新', url: '#', desc: '关注微信公众号' },
              ].map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700">{link.label}</p>
                    <p className="text-[10px] text-slate-400">{link.desc}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
