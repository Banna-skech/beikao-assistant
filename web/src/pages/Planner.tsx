import { useState } from 'react'
import type { StudyTask } from '../types'
import { CheckCircle2, Circle, Clock, Target, Calendar, Flame, Plus, Trash2 } from 'lucide-react'

const phases = [
  {
    phase: 'Phase 1', title: '基础攻坚', weeks: '第1-4周', color: 'blue',
    desc: '行测五大模块基础学习 + 时政积累 + 简历打磨',
    tasks: [
      { id: '1-1', title: '行测基础课 — 言语理解与表达', category: '行测', duration: '2h/天 × 7天', completed: false, priority: 'high' as const },
      { id: '1-2', title: '行测基础课 — 判断推理', category: '行测', duration: '2h/天 × 5天', completed: false, priority: 'high' as const },
      { id: '1-3', title: '行测基础课 — 资料分析', category: '行测', duration: '2h/天 × 5天', completed: false, priority: 'high' as const },
      { id: '1-4', title: '行测基础课 — 数量关系', category: '行测', duration: '1.5h/天 × 5天', completed: false, priority: 'medium' as const },
      { id: '1-5', title: '每天30分钟学习强国/人民日报', category: '时政', duration: '30分钟/天', completed: false, priority: 'medium' as const },
      { id: '1-6', title: '完成简历初稿（2-3个版本）', category: '准备', duration: '集中1-2天', completed: false, priority: 'high' as const },
      { id: '1-7', title: '拍蓝底证件照 + 扫描证书材料', category: '准备', duration: '半天', completed: false, priority: 'high' as const },
    ]
  },
  {
    phase: 'Phase 2', title: '刷题强化', weeks: '第5-8周', color: 'amber',
    desc: '行测每天50题 + 专业课题库 + 申论写作 + 错题整理',
    tasks: [
      { id: '2-1', title: '行测每天刷50-100题（计时）', category: '行测', duration: '2-3h/天', completed: false, priority: 'high' as const },
      { id: '2-2', title: '错题整理与分析（每周回顾）', category: '行测', duration: '30分钟/天', completed: false, priority: 'high' as const },
      { id: '2-3', title: '专业知识题库每天30题', category: '专业课', duration: '1h/天', completed: false, priority: 'high' as const },
      { id: '2-4', title: '申论每周2篇（归纳概括+大作文）', category: '申论', duration: '2h/篇', completed: false, priority: 'medium' as const },
      { id: '2-5', title: '关注目标企业招聘动态', category: '投递', duration: '30分钟/天', completed: false, priority: 'high' as const },
      { id: '2-6', title: '每天投递2-3家企业', category: '投递', duration: '1h/天', completed: false, priority: 'high' as const },
      { id: '2-7', title: '建立投递台账Excel', category: '投递', duration: '集中1次', completed: false, priority: 'medium' as const },
    ]
  },
  {
    phase: 'Phase 3', title: '模拟冲刺', weeks: '第9-12周', color: 'emerald',
    desc: '每天1套完整真题 + 面试准备 + 企业文化突击 + 国家电网备考',
    tasks: [
      { id: '3-1', title: '每天1套完整行测真题（严格计时）', category: '行测', duration: '2-3h/天', completed: false, priority: 'high' as const },
      { id: '3-2', title: '真题解析与错题复盘', category: '行测', duration: '1h/天', completed: false, priority: 'high' as const },
      { id: '3-3', title: '面试20个高频问题逐个打磨', category: '面试', duration: '每天2-3题', completed: false, priority: 'high' as const },
      { id: '3-4', title: '群面模拟练习至少3次', category: '面试', duration: '每周1次', completed: false, priority: 'medium' as const },
      { id: '3-5', title: '目标企业文化考前突击', category: '笔试', duration: '考前3天集中', completed: false, priority: 'high' as const },
      { id: '3-6', title: '国家电网一批考试（12月初）', category: '国网', duration: '12月第1个周日', completed: false, priority: 'high' as const },
      { id: '3-7', title: '申论热点话题过一遍', category: '申论', duration: '集中1-2天', completed: false, priority: 'medium' as const },
      { id: '3-8', title: '考前心态调整 + 考试用品准备', category: '心态', duration: '考前1天', completed: false, priority: 'medium' as const },
    ]
  },
]

const phaseColors: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
}

export default function Planner() {
  const [planTasks, setPlanTasks] = useState<StudyTask[][]>(phases.map(p => p.tasks))
  const [newTaskText, setNewTaskText] = useState<Record<number, string>>({})
  const [showAddTask, setShowAddTask] = useState<Record<number, boolean>>({})

  const toggleTask = (phaseIdx: number, taskIdx: number) => {
    setPlanTasks(prev => prev.map((tasks, pi) =>
      pi === phaseIdx ? tasks.map((t, ti) => ti === taskIdx ? { ...t, completed: !t.completed } : t) : tasks
    ))
  }

  const addTask = (phaseIdx: number) => {
    const text = newTaskText[phaseIdx]?.trim()
    if (!text) return
    setPlanTasks(prev => prev.map((tasks, pi) =>
      pi === phaseIdx ? [...tasks, { id: `custom-${Date.now()}`, title: text, category: '自定义', duration: '', completed: false, priority: 'medium' as const }] : tasks
    ))
    setNewTaskText(prev => ({ ...prev, [phaseIdx]: '' }))
    setShowAddTask(prev => ({ ...prev, [phaseIdx]: false }))
  }

  const removeTask = (phaseIdx: number, taskIdx: number) => {
    setPlanTasks(prev => prev.map((tasks, pi) =>
      pi === phaseIdx ? tasks.filter((_, ti) => ti !== taskIdx) : tasks
    ))
  }

  const getProgress = (tasks: StudyTask[]) => {
    const done = tasks.filter(t => t.completed).length
    return { done, total: tasks.length, pct: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0 }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="animate-slide-up">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800">📅 备考规划</h2>
        <p className="text-sm text-slate-500 mt-1">三阶段12周系统备考计划，可自定义增加或调整任务</p>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">总体进度</h3>
          </div>
          <span className="text-xs text-slate-400">
            {planTasks.reduce((sum, t) => sum + t.filter(x => x.completed).length, 0)}/
            {planTasks.reduce((sum, t) => sum + t.length, 0)} 项完成
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.round(planTasks.reduce((sum, t) => sum + t.filter(x => x.completed).length, 0) / Math.max(1, planTasks.reduce((sum, t) => sum + t.length, 0)) * 100)}%` }} />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-5">
        {phases.map((phase, pi) => {
          const tasks = planTasks[pi]
          const progress = getProgress(tasks)
          const c = phaseColors[phase.color]
          return (
            <div key={pi} className={`rounded-2xl border ${c.border} ${c.bg} p-5 lg:p-6 shadow-sm animate-slide-up`} style={{ animationDelay: `${pi * 0.1}s` }}>
              {/* Phase header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${c.badge}`}>{phase.phase}</span>
                    <span className="text-xs text-slate-500">{phase.weeks}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{phase.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{phase.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-700">{progress.pct}%</span>
                  <p className="text-[10px] text-slate-400">{progress.done}/{progress.total}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all duration-500 ${progress.pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${progress.pct}%` }} />
              </div>

              {/* Tasks */}
              <div className="space-y-1.5">
                {tasks.map((task, ti) => (
                  <div key={task.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group
                      ${task.completed ? 'bg-white/60' : 'bg-white hover:shadow-sm'}`}
                  >
                    <button onClick={() => toggleTask(pi, ti)} className="flex-shrink-0">
                      {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-400" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${task.priority === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                          {task.priority === 'high' ? '★ 优先' : '· 常规'}
                        </span>
                        <span className="text-[10px] text-slate-400">{task.duration}</span>
                      </div>
                    </div>
                    <button onClick={() => removeTask(pi, ti)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-100 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add task */}
              {showAddTask[pi] ? (
                <div className="flex items-center gap-2 mt-3 animate-slide-down">
                  <input
                    type="text" value={newTaskText[pi] || ''} onChange={e => setNewTaskText(prev => ({ ...prev, [pi]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addTask(pi)}
                    placeholder="输入新任务…" autoFocus
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  />
                  <button onClick={() => addTask(pi)} className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all">添加</button>
                  <button onClick={() => setShowAddTask(prev => ({ ...prev, [pi]: false }))} className="px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-white/50 transition-all">取消</button>
                </div>
              ) : (
                <button onClick={() => setShowAddTask(prev => ({ ...prev, [pi]: true }))}
                  className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                ><Plus className="w-3.5 h-3.5" /> 添加自定义任务</button>
              )}
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up">
        <div className="flex items-center gap-2 mb-4"><Flame className="w-5 h-5 text-amber-500" /><h3 className="text-sm font-bold text-slate-800">备考建议</h3></div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: Clock, title: '每天3-5小时', desc: '暑期集中备考，开学后利用晚上+周末。保持节奏，贵在坚持。' },
            { icon: Target, title: '行测优先练3个模块', desc: '言语+判断+资料分析是正确率最高、提分最快的三项。' },
            { icon: Calendar, title: '提前2周准备面试', desc: '笔试通过后再准备面试就来不及了，面试技巧需要提前积累。' },
          ].map((t, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4">
              <t.icon className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-sm font-semibold text-slate-800">{t.title}</p>
              <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
