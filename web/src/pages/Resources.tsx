import { useState } from 'react'
import { ExternalLink, BookOpen, Globe, Smartphone, MessageCircle, Search, Building2, Zap } from 'lucide-react'

const resourceSections = [
  {
    title: '📚 推荐书籍', icon: BookOpen,
    items: [
      { name: '《央国企校招一本通》', desc: '清华大学出版社 2025年6月出版，最全面的央国企备考综合指南', link: '#', tag: '必读' },
      { name: '中公/华图《行政职业能力测验》', desc: '行测系统学习教材，覆盖五大模块基础知识和解题方法', link: '#', tag: '教材' },
      { name: '中公/华图《行测5000题》', desc: '刷题必备，题量大覆盖全，适合强化阶段每天练习', link: '#', tag: '题库' },
      { name: '《公共基础知识》', desc: '公基学习用书，涵盖政治、法律、经济、人文等', link: '#', tag: '参考' },
      { name: '《申论范文宝典》', desc: '申论写作素材库，含近年热点话题和优秀范文', link: '#', tag: '素材' },
      { name: '《半月谈》期刊', desc: '时政热点解读，申论写作的绝佳素材来源', link: '#', tag: '期刊' },
    ]
  },
  {
    title: '🌐 核心招聘平台', icon: Globe,
    items: [
      { name: '国聘网 (iguopin.com)', desc: '国资委指导，覆盖99家央企+2000余家地方国企，最权威的央国企招聘平台', link: 'https://www.iguopin.com', tag: '⭐ 首选' },
      { name: '国家大学生就业服务平台 (ncss.cn)', desc: '教育部直属，应届生专属央企招聘专区', link: 'https://www.ncss.cn', tag: '官方' },
      { name: '国务院国资委官网 (sasac.gov.cn)', desc: '央企总部/研究院招聘公告的首发源头', link: 'http://www.sasac.gov.cn', tag: '源头' },
      { name: '中国公共招聘网 (job.mohrss.gov.cn)', desc: '人社部主办，侧重地方国企和事业单位岗位', link: 'http://job.mohrss.gov.cn', tag: '综合' },
    ]
  },
  {
    title: '📱 刷题与学习APP', icon: Smartphone,
    items: [
      { name: '粉笔APP', desc: '行测刷题最强工具，有错题本、免费模考、智能组卷', link: '#', tag: '必装' },
      { name: '华图在线', desc: '题库全，有免费模考和系统课程', link: '#', tag: '题库' },
      { name: '学习强国APP', desc: '时政积累必装，每日答题+专项答题+挑战答题', link: '#', tag: '必装' },
      { name: '牛客网 (nowcoder.com)', desc: 'IT/技术岗笔面试题库，含编程题和企业真题', link: 'https://www.nowcoder.com', tag: '技术岗' },
      { name: '人民日报APP', desc: '官方新闻和评论文章，申论素材最佳来源', link: '#', tag: '资讯' },
    ]
  },
  {
    title: '💬 微信公众号', icon: MessageCircle,
    items: [
      { name: '国资小新', desc: '国资委官方认证公众号，每日汇总央企招聘动态和行业新闻', link: '#', tag: '必关' },
      { name: '央企国企招聘信息', desc: '各企业招聘信息汇总推送', link: '#', tag: '招聘' },
      { name: '国企招聘考试网', desc: '备考资料分享、真题解析、经验干货', link: '#', tag: '备考' },
      { name: '粉笔公考', desc: '行测/申论学习干货推送', link: '#', tag: '学习' },
      { name: '半月谈', desc: '时政深度解读，政策分析文章', link: '#', tag: '时政' },
    ]
  },
  {
    title: '🏢 重点企业招聘官网', icon: Building2,
    items: [
      { name: '国家电网招聘平台', desc: 'zhaopin.sgcc.com.cn — 全国统考，一批12月初笔试', link: 'https://zhaopin.sgcc.com.cn', tag: '国网' },
      { name: '中国石化人才招聘', desc: 'job.sinopec.com — 三桶油之一', link: 'http://job.sinopec.com', tag: '能源' },
      { name: '中国石油招聘平台', desc: 'zhaopin.cnpc.com.cn — 三桶油之首', link: 'https://zhaopin.cnpc.com.cn', tag: '能源' },
      { name: '中国移动招聘', desc: 'job.10086.cn — 运营商之首', link: 'https://job.10086.cn', tag: '通信' },
      { name: '中国建筑校园招聘', desc: 'cscec.zhiye.com — 基建校招第一大户', link: 'https://cscec.zhiye.com', tag: '基建' },
      { name: '中国烟草人才招聘平台', desc: 'tobacco.gov.cn — 各省分别招聘，竞争最激烈', link: 'http://www.tobacco.gov.cn', tag: '烟草' },
      { name: '中国铁路人才招聘网', desc: 'rczp.china-railway.com.cn — 18家铁路局集中招聘', link: 'https://rczp.china-railway.com.cn', tag: '铁路' },
      { name: '中国工商银行人才招聘', desc: 'job.icbc.com.cn — 银行之首', link: 'https://job.icbc.com.cn', tag: '银行' },
    ]
  },
]

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = resourceSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="animate-slide-up">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800">📦 资源汇总</h2>
        <p className="text-sm text-slate-500 mt-1">精心筛选的书籍、平台、APP、公众号和企业招聘官网</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md animate-slide-up">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索资源名称或关键词…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
        />
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {filtered.map((section, si) => (
          <div key={si} className="animate-slide-up" style={{ animationDelay: `${si * 0.08}s` }}>
            <div className="flex items-center gap-2 mb-3">
              <section.icon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-800">{section.title}</h3>
              <span className="text-xs text-slate-400">({section.items.length})</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.items.map((item, ii) => (
                <a key={ii} href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="bg-white rounded-xl border border-slate-100 p-4 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors flex-1">{item.name}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-medium flex-shrink-0">{item.tag}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed flex-1">{item.desc}</p>
                  {item.link.startsWith('http') && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-indigo-500 font-medium">
                      <ExternalLink className="w-3 h-3" /> 访问网站
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-slate-400">
            <Search className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm">没有匹配的资源</p>
          </div>
        )}
      </div>

      {/* Quick checklist */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5 lg:p-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800">备考前必须准备好的5样东西</h3>
        </div>
        <div className="grid sm:grid-cols-5 gap-3">
          {[
            { emoji: '📸', title: '蓝底证件照', desc: '去专业照相馆拍' },
            { emoji: '📄', title: '学籍验证报告', desc: '学信网下载' },
            { emoji: '📊', title: '成绩单(盖章)', desc: '教务处打印' },
            { emoji: '🎓', title: '就业推荐表', desc: '学校就业中心' },
            { emoji: '📋', title: '证书扫描件', desc: '分类整理归档' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <p className="text-xs font-semibold text-slate-800">{item.title}</p>
              <p className="text-[10px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
