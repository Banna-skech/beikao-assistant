import { useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Brain, MessageSquare, BookOpen, AlertTriangle, Library, Menu, X, ChevronRight, GraduationCap, Video, ClipboardCheck,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '学习看板', desc: 'Dashboard' },
  { to: '/loop', icon: ClipboardCheck, label: '闭环执行', desc: 'Daily Loop' },
  { to: '/enterprises', icon: Building2, label: '企业名录', desc: 'Enterprises' },
  { to: '/quiz', icon: Brain, label: '笔试刷题', desc: 'Practice' },
  { to: '/interview', icon: MessageSquare, label: '模拟面试', desc: 'Mock Interview' },
  { to: '/planner', icon: BookOpen, label: '备考规划', desc: 'Study Plan' },
  { to: '/courses', icon: Video, label: '课程学习', desc: 'Courses' },
  { to: '/pitfalls', icon: AlertTriangle, label: '避坑指南', desc: 'Pitfalls' },
  { to: '/resources', icon: Library, label: '资源汇总', desc: 'Resources' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7fa]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 flex w-[260px] flex-col
        bg-white border-r border-slate-200
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-100">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">央国企备考助手</h1>
            <p className="text-[11px] text-slate-400">秋招上岸利器</p>
          </div>
          <button className="lg:hidden ml-auto text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Navigation</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="flex-1">{item.label}</span>
                <span className="text-[10px] text-slate-300 font-normal hidden xl:inline">{item.desc}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 ml-auto" />}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4 border border-indigo-100/50">
            <p className="text-xs font-semibold text-indigo-800 mb-1">💡 备考提醒</p>
            <p className="text-[11px] text-indigo-600/80 leading-relaxed">
              2027届秋招提前批已启动！军工、通信、能源类央企正在招人。
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center h-16 px-4 lg:px-6 bg-white border-b border-slate-200 shrink-0">
          <button className="lg:hidden mr-3 text-slate-500" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">2026年7月5日 · 距秋招正式批还有55天</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-medium text-amber-700">提前批进行中</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
