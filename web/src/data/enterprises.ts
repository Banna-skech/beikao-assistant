import type { Enterprise } from '../types'

export const enterprises: Enterprise[] = [
  // --- 电网电力 ---
  { id: 1, name: '国家电网有限公司', category: '电网电力', description: '全球最大的公用事业企业，供电人口超11亿，每年校招2万+人', website: 'sgcc.com.cn', recruitSite: 'zhaopin.sgcc.com.cn', headquarters: '北京', priority: 'S', majors: ['电气工程', '计算机', '通信', '财会', '管理'], tags: ['校招第一大雇主', '全国统考', '待遇顶级', '二批补招'] },
  { id: 2, name: '中国南方电网有限责任公司', category: '电网电力', description: '覆盖广东、广西、云南、贵州、海南五省，待遇与国网相当', website: 'csg.cn', recruitSite: 'zhaopin.csg.cn', headquarters: '广州', priority: 'S', majors: ['电气工程', '计算机', '通信', '自动化'], tags: ['华南地区', '竞争略小于国网'] },
  { id: 3, name: '国家能源投资集团有限责任公司', category: '电网电力', description: '煤炭+电力+新能源综合集团，新能源方向增长快', website: 'chnenergy.com.cn', recruitSite: 'zhaopin.chnenergy.com.cn', headquarters: '北京', priority: 'A', majors: ['电气', '能源', '机械', '矿业', '计算机'], tags: ['新能源', '基层岗多', '本科生友好'] },
  { id: 4, name: '中国华能集团有限公司', category: '电网电力', description: '五大发电集团之一，发电装机容量全国第一', website: 'chng.com.cn', recruitSite: 'zhaopin.chng.com.cn', headquarters: '北京', priority: 'A', majors: ['电气', '热能', '自动化', '新能源'], tags: ['发电龙头', '新能源转型'] },
  { id: 5, name: '中国长江三峡集团有限公司', category: '电网电力', description: '全球最大水电企业，三峡工程运营主体，待遇业界顶级', website: 'ctg.com.cn', recruitSite: '', headquarters: '武汉/北京', priority: 'S', majors: ['水利', '电气', '环保', '工程管理'], tags: ['待遇顶级', '项目地点偏'] },
  { id: 6, name: '中国广核集团有限公司', category: '电网电力', description: '中国最大核电运营商之一，核电+新能源双驱动', website: 'cgnpc.com.cn', recruitSite: 'zhaopin.cgnpc.com.cn', headquarters: '深圳', priority: 'A', majors: ['核工程', '电气', '热能', '机械'], tags: ['核电', '深圳/广东', '专业壁垒高'] },

  // --- 石油石化 ---
  { id: 7, name: '中国石油天然气集团有限公司', category: '石油石化', description: '中国最大油气生产商，全球50家大石油公司排名前列', website: 'cnpc.com.cn', recruitSite: 'zhaopin.cnpc.com.cn', headquarters: '北京', priority: 'S', majors: ['石油工程', '地质', '化工', '机械', '计算机'], tags: ['待遇优厚', '项目分布广', '提前批多'] },
  { id: 8, name: '中国石油化工集团有限公司', category: '石油石化', description: '中国最大炼化企业，加油站遍布全国', website: 'sinopec.com', recruitSite: 'job.sinopec.com', headquarters: '北京', priority: 'S', majors: ['化工', '石油', '机械', '材料'], tags: ['炼化方向', '研究院多'] },
  { id: 9, name: '中国海洋石油集团有限公司', category: '石油石化', description: '海上油气开发主力，利润率高，人均薪酬领先', website: 'cnooc.com.cn', recruitSite: 'zhaopin.cnooc.com.cn', headquarters: '北京', priority: 'A', majors: ['石油', '海洋工程', '地质', '机械'], tags: ['海上作业', '待遇最高', '要求较高'] },

  // --- 通信电子 ---
  { id: 10, name: '中国移动通信集团有限公司', category: '通信电子', description: '全球最大移动通信运营商，用户超9.9亿', website: '10086.cn', recruitSite: 'job.10086.cn', headquarters: '北京', priority: 'S', majors: ['通信', '计算机', '软件', '电子', '管理'], tags: ['运营商之首', '待遇好', '科技岗多'] },
  { id: 11, name: '中国电信集团有限公司', category: '通信电子', description: '全球最大固网运营商，云业务增长迅速', website: 'chinatelecom.com.cn', recruitSite: 'zhaopin.chinatelecom.com.cn', headquarters: '北京', priority: 'A', majors: ['通信', '计算机', '云计算', '软件'], tags: ['云计算', '天翼云'] },
  { id: 12, name: '中国联合网络通信集团有限公司', category: '通信电子', description: '混改先锋，数字化转型力度大', website: 'chinaunicom.com', recruitSite: 'zhaopin.chinaunicom.com', headquarters: '北京', priority: 'A', majors: ['通信', '计算机', '软件', '大数据'], tags: ['混改', '数字化', '竞争较小'] },
  { id: 13, name: '中国电子科技集团有限公司', category: '通信电子', description: '军事电子、网络安全、集成电路国家队', website: 'cetc.com.cn', recruitSite: '', headquarters: '北京', priority: 'A', majors: ['电子', '通信', '计算机', '网络安全'], tags: ['军工电子', '研究所多', '硕博为主'] },

  // --- 军工航天 ---
  { id: 14, name: '中国航天科技集团有限公司', category: '军工航天', description: '长征火箭、神舟飞船、嫦娥探月研制方', website: 'spacechina.com', recruitSite: '', headquarters: '北京', priority: 'S', majors: ['航空航天', '力学', '控制', '电子', '计算机'], tags: ['国家重点', '985/211为主', '提前批'] },
  { id: 15, name: '中国航空工业集团有限公司', category: '军工航天', description: '歼-20、运-20等军机研制方，中国航空工业主力', website: 'avic.com', recruitSite: '', headquarters: '北京', priority: 'A', majors: ['飞行器设计', '机械', '材料', '电子'], tags: ['军机', '研究所多', '多地有岗'] },
  { id: 16, name: '中国核工业集团有限公司', category: '军工航天', description: '中国核工业国家队，核电+核军工全产业链', website: 'cnnc.com.cn', recruitSite: '', headquarters: '北京', priority: 'A', majors: ['核工程', '物理', '热能', '电气'], tags: ['核工业', '专业壁垒', '提前批'] },

  // --- 建筑基建 ---
  { id: 17, name: '中国建筑集团有限公司', category: '建筑基建', description: '全球最大建筑企业，校招基建类第一大雇主', website: 'cscec.com', recruitSite: 'cscec.zhiye.com', headquarters: '北京', priority: 'A', majors: ['土木', '建筑', '工程管理', '财务', '法学'], tags: ['基建龙头', '项目遍布全球', '招人多'] },
  { id: 18, name: '中国中铁股份有限公司', category: '建筑基建', description: '全球最大铁路工程企业之一', website: 'crecg.com', recruitSite: '', headquarters: '北京', priority: 'A', majors: ['土木', '交通', '地质', '工程管理'], tags: ['铁路工程', '项目遍布全国'] },
  { id: 19, name: '中国交通建设集团有限公司', category: '建筑基建', description: '全球最大港口/公路/桥梁建设企业', website: 'ccccltd.cn', recruitSite: '', headquarters: '北京', priority: 'A', majors: ['土木', '港口', '路桥', '工程管理'], tags: ['交通基建', '海外项目多'] },

  // --- 汽车机械 ---
  { id: 20, name: '中国第一汽车集团有限公司', category: '汽车机械', description: '中国汽车工业长子，红旗、解放品牌母公司', website: 'faw.com.cn', recruitSite: '', headquarters: '长春', priority: 'A', majors: ['车辆工程', '机械', '自动化', '计算机'], tags: ['长春总部', '新能源转型'] },
  { id: 21, name: '中国中车集团有限公司', category: '汽车机械', description: '全球最大轨道交通装备制造企业，高铁制造主力', website: 'crrcgc.cc', recruitSite: '', headquarters: '北京', priority: 'A', majors: ['机械', '电气', '材料', '车辆工程'], tags: ['高铁', '制造', '全国多地'] },

  // --- 金融银行 ---
  { id: 22, name: '中国工商银行', category: '金融银行', description: '全球最大商业银行，总行+各省分行+科技中心', website: 'icbc.com.cn', recruitSite: 'job.icbc.com.cn', headquarters: '北京', priority: 'S', majors: ['经济', '金融', '会计', '计算机', '法律'], tags: ['银行之首', '科技岗多', '全国有岗'] },
  { id: 23, name: '中国银行', category: '金融银行', description: '国际化程度最高国有银行，外汇业务领先', website: 'boc.cn', recruitSite: 'campus.chinahr.com', headquarters: '北京', priority: 'S', majors: ['金融', '经济', '外语', '计算机'], tags: ['国际化', '外语加分'] },

  // --- 综合贸易 ---
  { id: 24, name: '中粮集团有限公司', category: '综合贸易', description: '中国最大粮油食品企业，旗下有蒙牛、福临门等品牌', website: 'cofco.com', recruitSite: '', headquarters: '北京', priority: 'A', majors: ['食品', '农业', '贸易', '管理', '财务'], tags: ['食品龙头', '品牌多', '管培生项目好'] },
  { id: 25, name: '华润（集团）有限公司', category: '综合贸易', description: '多元化央企，覆盖大消费/大健康/城市建设/科技金融', website: 'crc.com.cn', recruitSite: 'crc.wintalent.cn', headquarters: '深圳/香港', priority: 'A', majors: ['管理', '医药', '地产', '零售'], tags: ['多元业务', '管培生', '深圳总部'] },

  // --- 烟草铁路 ---
  { id: 26, name: '中国烟草总公司', category: '烟草铁路', description: '中国最赚钱国企，利税超万亿，待遇最顶级', website: 'tobacco.gov.cn', recruitSite: '', headquarters: '北京', priority: 'S', majors: ['不限专业'], tags: ['待遇天花板', '竞争最激烈', '各省分别招聘'] },
  { id: 27, name: '中国国家铁路集团', category: '烟草铁路', description: '全国18家铁路局，校招规模大，稳定性极高', website: 'china-railway.com.cn', recruitSite: 'rczp.china-railway.com.cn', headquarters: '北京', priority: 'A', majors: ['交通', '土木', '机械', '电气', '计算机'], tags: ['铁路局', '全国各地', '稳定'] },

  // --- 更多企业 ---
  { id: 28, name: '招商局集团有限公司', category: '综合贸易', description: '百年央企，业务覆盖港口、金融、地产、物流', website: 'cmhk.com', recruitSite: '', headquarters: '深圳/香港', priority: 'A', majors: ['金融', '管理', '物流', '地产'], tags: ['百年央企', '综合业务', '待遇好'] },
  { id: 29, name: '中国邮政集团有限公司', category: '烟草铁路', description: '全球最大邮政企业，邮政+储蓄+快递+电商全覆盖', website: 'chinapost.com.cn', recruitSite: 'zhaopin.chinapost.com.cn', headquarters: '北京', priority: 'B', majors: ['不限专业', '金融', '物流', '计算机'], tags: ['网点全国', '门槛较低', '待遇中等'] },
  { id: 30, name: '中国储备粮管理集团有限公司', category: '农林医药', description: '中央储备粮管理主体，关系国家粮食安全，稳定性极高', website: 'sinograin.com.cn', recruitSite: '', headquarters: '北京', priority: 'B', majors: ['食品', '农业', '管理', '财务'], tags: ['极稳定', '春招为主'] },
]

export const categories = [
  { key: '全部', label: '全部', count: enterprises.length },
  { key: '电网电力', label: '电网电力', count: enterprises.filter(e => e.category === '电网电力').length },
  { key: '石油石化', label: '石油石化', count: enterprises.filter(e => e.category === '石油石化').length },
  { key: '通信电子', label: '通信电子', count: enterprises.filter(e => e.category === '通信电子').length },
  { key: '军工航天', label: '军工航天', count: enterprises.filter(e => e.category === '军工航天').length },
  { key: '建筑基建', label: '建筑基建', count: enterprises.filter(e => e.category === '建筑基建').length },
  { key: '汽车机械', label: '汽车机械', count: enterprises.filter(e => e.category === '汽车机械').length },
  { key: '金融银行', label: '金融银行', count: enterprises.filter(e => e.category === '金融银行').length },
  { key: '综合贸易', label: '综合贸易', count: enterprises.filter(e => e.category === '综合贸易').length },
  { key: '烟草铁路', label: '烟草铁路', count: enterprises.filter(e => e.category === '烟草铁路').length },
  { key: '农林医药', label: '农林医药', count: enterprises.filter(e => e.category === '农林医药').length },
]
