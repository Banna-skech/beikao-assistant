import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  BarChart3, CheckCircle2, Circle, Clock, ExternalLink, Link as LinkIcon, Plus, Search, Trash2, Video,
} from 'lucide-react'
import { courseCatalog } from '../data/courses'
import type { CourseItem, CourseProgress } from '../types'

const PROGRESS_KEY = 'beikao-course-progress-v1'
const CUSTOM_COURSES_KEY = 'beikao-custom-courses-v1'

const categories = ['全部', '行测', '申论', '面试', '时政', '央国企', '自定义']
const levelStyle: Record<CourseItem['level'], string> = {
  基础: 'bg-blue-50 text-blue-700 border-blue-100',
  强化: 'bg-amber-50 text-amber-700 border-amber-100',
  冲刺: 'bg-rose-50 text-rose-700 border-rose-100',
  综合: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  自定义: 'bg-slate-50 text-slate-600 border-slate-100',
}

const emptyProgress: CourseProgress = {
  percent: 0,
  currentLesson: '',
  completedLessonIds: [],
  updatedAt: '',
}

const initialCourseDraft = {
  title: '',
  teacher: '',
  category: '自定义',
  platform: '',
  url: '',
  duration: '',
}

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

function formatUpdatedAt(value: string) {
  if (!value) return '尚未记录'
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
  const [progressByCourse, setProgressByCourse] = useState<Record<string, CourseProgress>>(() => loadJson(PROGRESS_KEY, {}))
  const [customCourses, setCustomCourses] = useState<CourseItem[]>(() => loadJson(CUSTOM_COURSES_KEY, []))
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [courseDraft, setCourseDraft] = useState(initialCourseDraft)

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressByCourse))
  }, [progressByCourse])

  useEffect(() => {
    window.localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(customCourses))
  }, [customCourses])

  const courses = useMemo(() => [...courseCatalog, ...customCourses], [customCourses])

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return courses.filter(course => {
      const matchesCategory = activeCategory === '全部' || course.category === activeCategory
      const matchesQuery = !query || [
        course.title,
        course.teacher,
        course.category,
        course.platform,
        ...course.tags,
      ].some(text => text.toLowerCase().includes(query))
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, courses, searchQuery])

  const stats = useMemo(() => {
    const progresses = courses.map(course => progressByCourse[course.id]?.percent ?? 0)
    const totalPercent = progresses.reduce((sum, pct) => sum + pct, 0)
    return {
      total: courses.length,
      active: progresses.filter(pct => pct > 0 && pct < 100).length,
      done: progresses.filter(pct => pct >= 100).length,
      average: courses.length ? Math.round(totalPercent / courses.length) : 0,
    }
  }, [courses, progressByCourse])

  const updateProgress = (courseId: string, patch: Partial<CourseProgress>) => {
    setProgressByCourse(prev => {
      const current = prev[courseId] ?? emptyProgress
      return {
        ...prev,
        [courseId]: {
          ...current,
          ...patch,
          percent: patch.percent === undefined ? current.percent : clampPercent(patch.percent),
          updatedAt: new Date().toISOString(),
        },
      }
    })
  }

  const toggleLesson = (course: CourseItem, lessonId: string) => {
    const progress = progressByCourse[course.id] ?? emptyProgress
    const completedLessonIds = progress.completedLessonIds.includes(lessonId)
      ? progress.completedLessonIds.filter(id => id !== lessonId)
      : [...progress.completedLessonIds, lessonId]
    const percent = course.lessons.length ? Math.round((completedLessonIds.length / course.lessons.length) * 100) : progress.percent
    const currentLesson = course.lessons.find(lesson => lesson.id === lessonId)?.title ?? progress.currentLesson
    updateProgress(course.id, { completedLessonIds, percent, currentLesson })
  }

  const markCourseDone = (course: CourseItem) => {
    updateProgress(course.id, {
      percent: 100,
      completedLessonIds: course.lessons.map(lesson => lesson.id),
      currentLesson: course.lessons.at(-1)?.title ?? '已完成',
    })
  }

  const resetCourse = (courseId: string) => {
    setProgressByCourse(prev => {
      const next = { ...prev }
      delete next[courseId]
      return next
    })
  }

  const addCourse = (event: FormEvent) => {
    event.preventDefault()
    const title = courseDraft.title.trim()
    const url = courseDraft.url.trim()
    if (!title || !url) return

    const newCourse: CourseItem = {
      id: `custom-${Date.now()}`,
      title,
      teacher: courseDraft.teacher.trim() || '自定义老师',
      category: courseDraft.category,
      platform: courseDraft.platform.trim() || '自定义链接',
      url,
      duration: courseDraft.duration.trim() || '按课程安排',
      level: '自定义',
      tags: ['自定义'],
      lessons: [
        { id: 'lesson-1', title: '开始学习' },
        { id: 'lesson-2', title: '继续观看' },
        { id: 'lesson-3', title: '完成复盘' },
      ],
    }

    setCustomCourses(prev => [newCourse, ...prev])
    setCourseDraft(initialCourseDraft)
    setShowAddCourse(false)
  }

  const removeCustomCourse = (courseId: string) => {
    setCustomCourses(prev => prev.filter(course => course.id !== courseId))
    resetCourse(courseId)
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between animate-slide-up">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800">🎓 课程学习</h2>
          <p className="text-sm text-slate-500 mt-1">整理不同老师与平台课程链接，记录每门课的观看进度</p>
        </div>
        <button
          onClick={() => setShowAddCourse(value => !value)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-500 transition-all"
        >
          <Plus className="w-4 h-4" /> 添加课程
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        {[
          { icon: Video, label: '课程链接', value: `${stats.total}门`, color: 'text-indigo-600 bg-indigo-50' },
          { icon: Clock, label: '正在观看', value: `${stats.active}门`, color: 'text-amber-600 bg-amber-50' },
          { icon: CheckCircle2, label: '已完成', value: `${stats.done}门`, color: 'text-emerald-600 bg-emerald-50' },
          { icon: BarChart3, label: '平均进度', value: `${stats.average}%`, color: 'text-rose-600 bg-rose-50' },
        ].map((item) => (
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

      {showAddCourse && (
        <form onSubmit={addCourse} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-down">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <input
              value={courseDraft.title}
              onChange={event => setCourseDraft(prev => ({ ...prev, title: event.target.value }))}
              placeholder="课程名称"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <input
              value={courseDraft.teacher}
              onChange={event => setCourseDraft(prev => ({ ...prev, teacher: event.target.value }))}
              placeholder="老师/机构"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <input
              value={courseDraft.url}
              onChange={event => setCourseDraft(prev => ({ ...prev, url: event.target.value }))}
              placeholder="课程链接"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <select
              value={courseDraft.category}
              onChange={event => setCourseDraft(prev => ({ ...prev, category: event.target.value }))}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {categories.filter(category => category !== '全部').map(category => <option key={category}>{category}</option>)}
            </select>
            <input
              value={courseDraft.platform}
              onChange={event => setCourseDraft(prev => ({ ...prev, platform: event.target.value }))}
              placeholder="平台"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <input
              value={courseDraft.duration}
              onChange={event => setCourseDraft(prev => ({ ...prev, duration: event.target.value }))}
              placeholder="总时长/课时"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setShowAddCourse(false)} className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition-all">取消</button>
            <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all">保存课程</button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            placeholder="搜索课程、老师或平台…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {filteredCourses.map((course, index) => {
          const progress = progressByCourse[course.id] ?? emptyProgress
          const completedCount = progress.completedLessonIds.length
          const isCustom = course.id.startsWith('custom-')
          return (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-slide-up" style={{ animationDelay: `${Math.min(index * 0.04, 0.24)}s` }}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-semibold ${levelStyle[course.level]}`}>{course.level}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 font-medium">{course.category}</span>
                    <span className="text-[10px] text-slate-400">{course.duration}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 truncate">{course.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{course.teacher} · {course.platform}</p>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-all"
                    title="打开课程链接"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {isCustom && (
                    <button
                      onClick={() => removeCustomCourse(course.id)}
                      className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all"
                      title="删除自定义课程"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">观看进度</span>
                  <span className="text-sm font-black text-slate-800">{progress.percent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress.percent}
                  onChange={event => updateProgress(course.id, { percent: Number(event.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progress.percent >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-4">
                <label className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={progress.currentLesson}
                    onChange={event => updateProgress(course.id, { currentLesson: event.target.value })}
                    placeholder="当前看到的课时/时间点"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </label>
                <button
                  onClick={() => markCourseDone(course)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
                >
                  标记完成
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                {course.lessons.map(lesson => {
                  const completed = progress.completedLessonIds.includes(lesson.id)
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => toggleLesson(course, lesson.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all ${
                        completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {completed ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <Circle className="w-4 h-4 flex-shrink-0 text-slate-300" />}
                      <span className="min-w-0 truncate">{lesson.title}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {course.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500">{tag}</span>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400">
                  已看 {completedCount}/{course.lessons.length} · {formatUpdatedAt(progress.updatedAt)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <Search className="w-10 h-10 mb-3 opacity-50" />
          <p className="text-sm">没有匹配的课程</p>
        </div>
      )}
    </div>
  )
}
