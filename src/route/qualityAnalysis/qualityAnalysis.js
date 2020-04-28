// 质量分析 路由汇总入口

// 分析模板
import analysisTemplate from './analysisTemplate/analysisTemplate'
// 分析规则
import analysisRule from './analysisRule/analysisRule'
// 任务执行信息
import executiveInformation from './executiveInformation/executiveInformation'
// 评估结果统计
import statisticalResults from './statisticalResults/statisticalResults'

export default [
  {
    path: '/qiang_qualityAnalysis',
    name: 'qiang_qualityAnalysis',
    component: () => import('@views/qualityAnalysis/qualityAnalysis'),
    children: [
      ...analysisTemplate,
      ...analysisRule,
      ...executiveInformation,
      ...statisticalResults
    ],
    redirect: '/qiang_qualityAnalysis/analysisTemplate',
    mate: {
    }
  }
]
