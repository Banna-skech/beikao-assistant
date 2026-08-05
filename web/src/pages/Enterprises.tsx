import { useState, useMemo } from 'react'
import { enterprises, categories } from '../data/enterprises'
import type { Enterprise } from '../types'
import { Search, ExternalLink, Star, Filter, X, Building2 } from 'lucide-react'

const priorityConfig = {
  'S': { label: '重点推荐', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  'A': { label: '优质选择', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  'B': { label: '值得关注', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
}

const categoryIcons: Record<string, string> = {
  '电网电力': '⚡', '石油石化': '🛢️', '通信电子': '📡', '军工航天': '🚀',
  '建筑基建': '🏗️', '汽车机械': '🏭', '金融银行': '🏦', '综合贸易': '🌐',
  '烟草铁路': '🚂', '农林医药': '🌾', '全部': '📋',
}

function EnterpriseCard({ e, onSelect }: { e: Enterprise; onSelect: (e: Enterprise) => void }) {
  const p = priorityConfig[e.priority]
  return (
    <div
      onClick={() => onSelect(e)}
      className={`bg-white rounded-xl border-2 border-slate-100 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-indigo-200 group ${e.priority === 'S' ? 'ring-1 ring-amber-200' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-lg">
            {categoryIcons[e.category] || '🏢'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
              {e.name}
              {e.priority === 'S' && <Star className="inline w-3.5 h-3.5 text-amber-500 ml-1 -mt-0.5" />}
            </h3>
            <p className="text-[11px] text-slate-400">{e.category} · {e.headquarters}</p>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.bg} ${p.text}`}>{p.label}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">{e.description}</p>
      <div className="flex flex-wrap gap-1">
        {e.tags.slice(0, 3).map((t, i) => (
          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500 font-medium">{t}</span>
        ))}
        {e.recruitSite && (
          <a href={`https://${e.recruitSite}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-medium flex items-center gap-0.5 hover:bg-indigo-100">
            <ExternalLink className="w-2.5 h-2.5" />招聘官网
          </a>
        )}
      </div>
    </div>
  )
}

function EnterpriseDetail({ e, onClose }: { e: Enterprise; onClose: () => void }) {
  const p = priorityConfig[e.priority]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{categoryIcons[e.category] || '🏢'}</span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{e.name}</h2>
              <p className="text-xs text-slate-400">{e.category} · {e.headquarters}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${p.bg} ${p.text} border ${p.border}`}>{p.label}</span>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">企业简介</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{e.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 mb-0.5">官网</p>
              <a href={`https://${e.website}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1">
                {e.website} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 mb-0.5">招聘官网</p>
              {e.recruitSite ? (
                <a href={`https://${e.recruitSite}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1">
                  进入招聘页 <ExternalLink className="w-3 h-3" />
                </a>
              ) : <span className="text-xs text-slate-400">见官网"人才招聘"栏目</span>}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">适合专业</h4>
            <div className="flex flex-wrap gap-1.5">
              {e.majors.map((m, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">{m}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">企业标签</h4>
            <div className="flex flex-wrap gap-1.5">
              {e.tags.map((t, i) => (
                <span key={i} className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 text-slate-600">{t}</span>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs text-amber-800">
              💡 <strong>投递建议：</strong>
              {e.priority === 'S' ? '重点准备！建议预留充足时间打磨针对性的简历，关注企业官网第一时间获取招聘公告。'
                : e.priority === 'A' ? '稳定发挥！该企业每年都大量校招，认真准备笔试面试，成功率较高。'
                : '可作为保底选择！竞争压力相对较小，适合作为备选方案。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Enterprises() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = enterprises
    if (activeCategory !== '全部') result = result.filter(e => e.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.majors.some(m => m.toLowerCase().includes(q)) ||
        e.tags.some(t => t.toLowerCase().includes(q)) ||
        e.description.toLowerCase().includes(q)
      )
    }
    return result
  }, [searchQuery, activeCategory])

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="animate-slide-up">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800">🏢 企业名录</h2>
        <p className="text-sm text-slate-500 mt-1">覆盖99家国资委监管央企及重点地方国企，按行业分类检索</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 animate-slide-up">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索企业名、专业、标签…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-slate-400" /></button>}
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
            ${showFilters ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <Filter className="w-4 h-4" /> 筛选
        </button>
      </div>

      {/* Category filters */}
      <div className={`flex flex-wrap gap-2 animate-slide-down ${!showFilters ? 'hidden' : ''}`}>
        {categories.map((cat) => (
          <button key={cat.label} onClick={() => setActiveCategory(cat.label)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${activeCategory === cat.label
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            {categoryIcons[cat.label]} {cat.label}
            <span className="ml-1 opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-xs text-slate-500 animate-fade-in">
        <Building2 className="w-3.5 h-3.5" />
        共 <span className="font-semibold text-slate-700">{filtered.length}</span> 家企业
        {activeCategory !== '全部' && (
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-medium">{activeCategory}</span>
        )}
      </div>

      {/* Enterprise cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 animate-fade-in">
        {filtered.map((e) => (
          <EnterpriseCard key={e.id} e={e} onSelect={setSelectedEnterprise} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <Search className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm">没有找到匹配的企业</p>
            <p className="text-xs mt-1">试试更换搜索关键词或筛选条件</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedEnterprise && (
        <EnterpriseDetail e={selectedEnterprise} onClose={() => setSelectedEnterprise(null)} />
      )}
    </div>
  )
}
