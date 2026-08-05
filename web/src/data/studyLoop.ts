import type { DailyLoopBlock } from '../types'

export const dailyLoopBlocks: DailyLoopBlock[] = [
  {
    id: 'course-input',
    title: '听一节基础课',
    module: '行测入门',
    minutes: 40,
    output: '写下3条老师讲的方法',
    type: '输入',
  },
  {
    id: 'drill-output',
    title: '做一组专项题',
    module: '行测练习',
    minutes: 45,
    output: '完成25题并记录正确率',
    type: '练习',
  },
  {
    id: 'wrong-review',
    title: '复盘错题',
    module: '反馈纠偏',
    minutes: 25,
    output: '挑3道错题写明错因',
    type: '复盘',
  },
  {
    id: 'essay-output',
    title: '写一个申论小输出',
    module: '申论入门',
    minutes: 30,
    output: '完成1段归纳概括或对策',
    type: '输出',
  },
  {
    id: 'current-material',
    title: '积累一条时政素材',
    module: '素材积累',
    minutes: 15,
    output: '摘一句观点并改写成自己的话',
    type: '输入',
  },
]

export const weeklyFocus = [
  { day: '周一', module: '言语理解', rule: '先学中心理解，做题时只问“作者想强调什么”。' },
  { day: '周二', module: '判断推理', rule: '图推和逻辑各做一半，错题只归因到一个规则。' },
  { day: '周三', module: '资料分析', rule: '练增长率、比重和平均数，优先掌握估算。' },
  { day: '周四', module: '数量关系', rule: '只做基础题和常见模型，不恋战难题。' },
  { day: '周五', module: '常识/公基', rule: '用错题反推知识点，时政材料同步摘录。' },
  { day: '周六', module: '混合限时', rule: '做一套小卷，记录每个模块用时和正确率。' },
  { day: '周日', module: '复盘补漏', rule: '补齐未完成项，决定下周优先突破的1个模块。' },
]

export const beginnerMilestones = [
  { stage: '第1周', title: '建立动作', target: '每天完成闭环，不追求快，只追求不断。' },
  { stage: '第2周', title: '固定方法', target: '每个模块形成自己的解题步骤，错题必须归因。' },
  { stage: '第3-4周', title: '提高正确率', target: '言语、判断、资料三项优先提到70%以上。' },
  { stage: '第5周后', title: '限时套卷', target: '进入真题和模考，靠复盘决定第二天训练。' },
]
