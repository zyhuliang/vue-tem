
export default [
  {
    path: '/qiang_qualityAnalysis/analysisTemplate',
    name: 'analysisTemplate',
    component: () => import('@views/qualityAnalysis/analysisTemplate/analysisTemplate'),
    mate: {
    }
  },
  {
    path: '/template/:id',
    name: 'template',
    component: () => import('@views/qualityAnalysis/analysisTemplate/template'),
    mate: {
    }
  }
]
