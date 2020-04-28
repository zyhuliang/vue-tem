/**
 * 权限菜单数据
 * @url /nav
 * Here you can write a detailed description
 * of the parameters of the information.
 */

let navData = [
    {
        path: '/login',
        name: '',
        hidden: true
    },
    {
        path: '/404',
        name: '',
        hidden: true
    },
    //新增表格查询
    {
        path: '/',
        children: [{
            path: '/search', name: '全局搜索',
            children: [
                {
                    path: '/dataImport',
                    name: 'dataImport'
                },
                {
                    path: '/fileImport',
                    name: 'fileImport'
                },
                {
                    path: '/globalCollector',
                    name: 'collector'
                },
                {
                    path: '/importTask',
                    name: 'importTask'
                },
                {
                    path: '/datasets',
                    name: 'Datasets',
                },
                {
                    path: '/flows',
                    name: 'Flows',
                },
               {
                    path: '/configure',
                    name: 'Configure'
                },
                {
                    path: '/datasource',
                    name: 'Datasource'
                },
                {
                    path: '/schemas',
                    name: 'Schemas'
                },
                {
                    path: '/globalTemp',
                    name: 'globalTemp'
                },
                {
                    path: '/globalRule',
                    name: 'globalRule'
                },
                {
                    path: '/globalTaskCarry',
                    name: 'globalTaskCarry'
                }
            ]
        }
        ]
    },
    {
        path: '/',
        name: '数据集成',
        iconCls: 'icon iconfont icon-ir-integration nav',//图标样式class
        children: [
            { path: '/main', name: '主页', hidden: true },
            {
                path: '/resourceMan',
                name: '资源目录',
                iconCls: 'fa fa-server nav',
                children: [
                    { path: '/DBsource/:parentId/:id', name: "DBSource", hidden: true },
                    { path: '/httpsource/:parentId/:id', name: "httpSource", hidden: true },
                    { path: '/ftpsource/:parentId/:id', name: "ftpSource", hidden: true },
                    { path: '/socketsource/:parentId/:id', name: "socketSource", hidden: true },
                    { path: '/mongoDBSource/:parentId/:id', name: "mongoDBSource", hidden: true },
                    { path: '/esSource/:parentId/:id', name: "esSource", hidden: true },
                    { path: '/DBdataset/:parentId/:id', name: "DBdataset", hidden: true },
                    { path: '/dataset/:parentId/:id', name: "dataset", hidden: true },
                    { path: '/schema/:parentId/:id', name: "schema", hidden: true },
                    { path: '/standard/:parentId/:id', name: "standard", hidden: true },
                    { path: '/analysis/:id', name: "analysis", hidden: true }

                ]
            },
            {
                path: '/dataMan',
                name: '文件管理',
                iconCls: 'fa fa-file-zip-o nav',
            },
            {
                path: '/synchronization',
                name: '数据导入',
                iconCls: 'fa fa-cloud-download nav',
                children: [
                    {
                        path: '/task/add/:collectorId/:id', name: "创建导入任务", children: [
                            // 路径为'/synchronization/add',默认使用组件step1
                            { path: '/taskWizard/step1/:collectorId/:id', name: "数据来源" },
                            { path: '/taskWizard/step2/:collectorId/:id', name: "数据目的" },
                            { path: '/taskWizard/step3/:collectorId/:id', name: "字段映射" },
                            { path: '/taskWizard/step4/:collectorId/:id', name: "任务设置" },
                            { path: '/taskWizard/step5/:collectorId/:id', name: "预览保存" }
                        ]
                    },
                    { path: '/synchronization/executeList/:taskId', name: "执行列表" },
                    { path: '/synchronization/previewData', name: "预览数据" },
                ]
            },
            {
                path: '/fileSynchronization',
                name: '文件导入',
                iconCls: 'fa fa-download nav',
                children: [
                    {
                        path: '/fileTask/add', name: "导入任务的创建", children: [
                            // 路径为'/synchronization/add',默认使用组件step1
                            { path: '/fileTaskWizard/step1', name: "来源数据" },
                            { path: '/fileTaskWizard/step2', name: "目的数据" },
                            /*{ path: '/fileTaskWizard/step3', component: fileStep3, name:"字段映射"  },*/
                            { path: '/fileTaskWizard/step3', name: "设置任务" },
                            { path: '/fileTaskWizard/step4', name: "保存预览" }
                        ]
                    },
                    {
                        path: '/fileSynchronization/executeList/:taskId',
                        name: "文件导入执行列表"
                    },
                ]
            },
            {
                path: '/collector', name: '采集器', iconCls: 'fa fa-shopping-basket nav',
                children: [
                    { path: '/collector/collectorTemplate', name: '采集器 ' },
                    {
                        path: '/collector/importData', name: '导入任务', children: [
                            { path: '/import/executeList/:taskId', name: "导入任务执行列表" },
                        ]
                    },

                ], redirect: '/collector/collectorTemplate'
            },
            {
                path: '/collector/collectorTemplate',
                name: '采集器详情',
                hidden: true,
                children: [
                    {
                        path: '/collector/:id/view/:resourceId',
                        name: '采集器详细信息',
                        hidden: true,
                    },
                    {
                        path: '/collector/:id/taskList/:resourceId',
                        name: '采集器任务列表',
                        hidden: true,
                        children: [
                            { path: '/collector/executeList/:taskId', name: "采集器执行列表" },
                        ]
                    },
                    {
                        path: '/collector/:id/dir/:resourceId',
                        name: '采集器资源目录',
                        hidden: true
                    },
                ]
            },
        ], redirect: '/resourceMan'
    },
    {
        path: '/',
        name: '数据治理',
        iconCls: 'icon iconfont icon-ir-govern nav',
        children: [
            {
                path: '/qualityAnalysis/analysisTemplate',
                name: '质量分析',
                iconCls: 'fa fa-balance-scale nav',
                children: [
                    {
                        path: '', name: '分析模板',
                        children: [
                            { path: '/qualityAnalysis/analysisTemplate/add', name: '创建分析模板' },
                            { path: '/qualityAnalysis/analysisTemplate/edit', name: '查看分析模板' },
                            {
                                path: '/qualityAnalysis/analysisTemplate/rules', name: '规则模板',
                                children: [
                                    {
                                        path: '/qualityAnalysis/analysisTemplate/rules/new',
                                        name: '创建规则模板'
                                    },
                                    {
                                        path: '/qualityAnalysis/analysisTemplate/rules/ruleBind',
                                        name: '规则绑定'
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        path: '/qualityAnalysis/analysisRules', name: '分析规则',
                        children: [
                            { path: '/qualityAnalysis/analysisRules/add', name: '创建分析规则' },
                            { path: '/qualityAnalysis/analysisRules/edit', name: '查看规则模板' },
                        ]
                    },
                    {
                        path: '/qualityAnalysis/teInformation', name: '任务执行信息',
                        children: [
                            { path: '/qualityAnalysis/teInformation/taskTempEdit', name: '查看分析模板2' },
                            { path: '/qualityAnalysis/teInformation/taskcarry', name: '查看任务执行信息' },
                            {
                                path: '/qualityAnalysis/teInformation/taskresult', name: '分析结果',
                                children: [
                                    {
                                        path: '/qualityAnalysis/teInformation/taskresult/seeResult',
                                        name: '查看分析结果'
                                    },
                                    {
                                        path: '/qualityAnalysis/analysisTemplate/rules/ruleBind',
                                        name: '规则绑定2'
                                    },
                                    { path: '/qualityAnalysis/analysisRules/edit', name: '查看规则模板2' },
                                ]
                            }
                        ]
                    },
                    { path: '/qualityAnalysis/erStatistics', name: '评估结果统计' }
                ],
                redirect: '/qualityAnalysis/analysisTemplate'
            },
            { path: '/kinship/:id/', name: '血缘分析', iconCls: 'fa fa-flask nav' },
            { path: '/schemaAnalysis/:id/', name: '元数据分析', iconCls: 'fa fa-flask nav' },
            {
                path: '/dataList',
                name: '数据目录',
                iconCls: 'icon iconfont icon-ir-nav-close nav',
                hidden: true
            }
        ]
    },
    {
        path: '/',
        name: '数据分析',
        iconCls: 'icon iconfont icon-ir-analyze nav',
        // leaf: true,//只有一个节点
        children: [
            {
                path: '/design', name: '流程管理', iconCls: 'fa fa-sitemap nav',
                children: [
                    {
                        path: '/design/designDrawing/:id', name: '流程设计', children: [
                            { path: '', name: '设计' },
                            {
                                path: '/design/plan/:id', name: '计划 ', children: [
                                    { path: '/design/plan/:id/add', name: '创建流程执行计划' }
                                ]
                            },
                            { path: '/design/executingHistory/:id', name: '执行历史' },
                            {
                                path: '/design/executingDetail/:id', name: '执行详细',
                                children: [
                                    {
                                        path: '/design/executingDetail/:id/exection/:jobId/info',
                                        name: '详细信息'
                                    },
                                    {
                                        path: '/design/executingDetail/:id/exection/:jobId/outputs',
                                        name: '输出'
                                    },
                                    {
                                        path: '/design/executingDetail/:id/exection/:jobId/logInfo',
                                        name: '日志信息'
                                    },
                                    {
                                        path: '/design/executingDetail/:id/info',
                                        name: '详细信息 '
                                    },
                                    {
                                        path: '/design/executingDetail/:id/outputs',
                                        name: '输出 '
                                    },
                                    {
                                        path: '/design/executingDetail/:id/logInfo',
                                        name: '日志信息 '
                                    },
                                ], redirect: '/design/executingDetail/:id/info'
                            }
                        ], redirect: '/design/designDrawing/:id'

                    },
                ]
            },
            {
                path: '/interactiveQuery', name: '交互式查询', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/resourceManProject',
                name: '项目目录',
                iconCls: 'fa fa-tasks nav',
                children: [
                    { path: '/project/DBdataset/:projectId/:id', name: "DBdatasetProject" },
                    { path: '/project/dataset/:projectId/:id', name: "datasetProject" },
                    {
                        path: '/project/schema/:projectId/:id',
                        name: "schemaProject",
                        props: true
                    },
                    {
                        path: '/project/design/designDrawing/:id',
                        name: '项目流程设计',
                        children: [
                            { path: '', name: ' 设计' },
                            {
                                path: '/project/design/plan/:id', name: ' 计划', children: [
                                    {
                                        path: '/project/design/plan/:id/add',
                                        name: '项目创建流程执行计划'
                                    }
                                ]
                            },
                            {
                                path: '/project/design/executingHistory/:id',
                                name: ' 执行历史'
                            },
                            {
                                path: '/project/design/executingDetail/:id',
                                name: ' 执行详细',
                                children: [
                                    {
                                        path: '/project/design/executingDetail/:id/exection/:jobId/info',
                                        name: '项目详细信息'
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/exection/:jobId/outputs',
                                        name: '项目Outputs'
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/exection/:jobId/logInfo',
                                        name: '项目日志信息'
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/info',
                                        name: '项目详细信息 '
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/outputs',
                                        name: '项目Outputs '
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/logInfo',
                                        name: '项目日志信息 '
                                    },
                                ],
                                redirect: '/project/design/executingDetail/:id/info'
                            }
                        ],
                        redirect: '/project/design/designDrawing/:id'
                    },
                ]
            },
            {
                path: '/processconfig',
                name: '配置',
                iconCls: 'fa fa-gears nav',
                children: [
                    { path: '/processconfig/workflow-selector', name: ' 工作流选择器' },
                    { path: '/processconfig/dataflow-selector', name: ' 批处理选择器' },
                    { path: '/processconfig/dataflow-udf', name: ' 自定义函数' },
                    { path: '/processconfig/filter-class', name: ' 过滤器' },
                    { path: '/processconfig/jdbc-driver', name: ' 数据库驱动' },
                ],
                redirect: '/processconfig',
            },
        ]
    },
    {
        path: '/',
        name: '实时计算',
        // hidden: true,
        iconCls: 'icon iconfont icon-ir-analyze nav',
        children: [
            {
                path: '/jobManage', name: '作业管理', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/jobOperation', name: '作业运维', iconCls: 'fa fa-leaf nav'
            },
            {
                path: '/jobTemplate', name: '作业模板', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/interactiveQuery', name: '交互式查询', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/add/:id', name: '添加模板', iconCls: 'fa fa-calendar-o nav', hidden: true
            },
            {
                path: '/jobOperation/monitor', name: 'stream任务监控', hidden: true,
                children: [
                    { path: '/jobOperation/streamMonitor/board', name: '概览' },
                    { path: '/jobOperation/streamMonitor/log', name: '日志' },
                    { path: '/jobOperation/streamMonitor/output', name: '输出结果' },
                ]
            },
            {
                path: '/jobManage/jobDetail', name: '详情', hidden: true,
                children: [
                    { path: '/jobManage/jobDetail/datasource', name: 'stream数据源' },
                    { path: '/jobManage/jobDetail/description', name: '作业描述' },
                    { path: '/jobManage/jobDetail/cepDesc', name: '作业描述2' },
                    { path: '/jobManage/jobDetail/output', name: '输 出' },
                    { path: '/jobManage/jobDetail/configure', name: '作业配置' },
                ]
            }
        ]
    },
    {
        path: '/',
        name: '数据监控',
        iconCls: 'icon iconfont icon-ir-monitoring nav',
        children: [
            {
                path: '/hippo/index',
                name: '运维管控',
                iconCls: 'fa fa-life-buoy nav',
                children: [
                    {
                        path: '/hippo/data',
                        name: '数据源',
                        iconCls: 'icon iconfont icon-ir-nav-close nav',
                        hidden: true,
                        children: [
                            { path: '/hippo/data/status', name: '状态统计图' },
                            { path: '/hippo/data/statuslist', name: '状态列表' },
                        ]
                    },

                    {
                        path: '/hippo/tasks',
                        name: '任务完成情况监控',
                        iconCls: 'icon iconfont icon-ir-nav-close nav',
                        hidden: true,
                        children: [
                            { path: '/hippo/tasks/jobanalysis', name: '趋势分析' },
                            { path: '/hippo/tasks/history', name: '归类分析' },
                            { path: '/hippo/tasks/probability', name: '概率分析' }
                        ],
                        redirect: '/hippo/tasks/jobanalysis'
                    },
                    {
                        path: '/hippo/nodeMonitor',
                        name: '集群服务组件详情',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                ]
            },
            { path: '/hippo/visit/', name: '访问监控', iconCls: 'fa fa-line-chart nav' },
            {
                path: '/hippo/taskControl',
                name: '任务监控',
                iconCls: 'fa fa-area-chart nav',
                children: [
                    {
                        path: '/hippo/taskControl',
                        name: ' 任务监控',
                        iconCls: 'fa fa-area-chart nav'
                    },
                    {
                        path: '/hippo/monitor',
                        name: '监控',
                        iconCls: 'icon iconfont icon-ir-nav-close nav',
                        hidden: true,
                        children: [
                            { path: '/hippo/monitor/RUNNING', name: '运行中' },
                            { path: '/hippo/monitor/READY', name: '就绪' },
                            { path: '/hippo/monitor/SUCCEEDED', name: '成功' },
                            { path: '/hippo/monitor/FAILED', name: '失败' },
                            { path: '/hippo/monitor/KILLED', name: '杀死' },
                            { path: '/hippo/monitor/TIMEOUT', name: '超时' },
                            { path: '/hippo/monitor/UNKNOWN', name: '未知' },
                        ],
                    },
                    {
                        path: '/hippo/schedule',
                        name: '任务调度',
                        iconCls: 'icon iconfont icon-ir-nav-close nav',
                        children: [
                            {
                                path: '', name: '计划',
                                children: [
                                    { path: '/hippo/schedule/add', name: '创建计划' },
                                    { path: '/hippo/schedule/detail/:id', name: '查看计划' }
                                ]
                            },
                            { path: '/hippo/execute', name: '执行' },
                            { path: '/hippo/analyze', name: '分析' }
                        ],
                        redirect: '/hippo/schedule',
                    },
                    {
                        path: '/hippo/alarm',
                        name: '监控告警',
                        iconCls: 'icon iconfont icon-ir-nav-close nav',
                        hidden: true,
                        children: [
                            { path: '/hippo/alarm/list', name: '告警列表' },
                            {
                                path: '/hippo/alarm/rule', name: '规则列表',
                                children: [
                                    { path: '/hippo/alarm/rule/add', name: '创建告警规则' },
                                    { path: '/hippo/alarm/rule/:id', name: '查看告警规则' },
                                ]
                            },
                        ],
                        redirect: '/hippo/alarm/list',
                        hidden: true
                    },

                ],
                redirect: '/hippo/taskControl',
            },
        ]
    },
    {
        path: '/',
        name: '系统配置',
        iconCls: 'icon iconfont icon-ir-attestation nav',
        children: [
            { path: '/user', name: '用户', iconCls: 'fa fa-user-circle nav' },
            { path: '/user/add', name: '创建用户', iconCls: 'fa fa-user-o', hidden: true },
            { path: '/user/:id', name: '查看用户', iconCls: 'fa fa-user-o', hidden: true },
            {
                path: '/permission',
                name: '权限',
                iconCls: 'fa fa-key nav',
            },
            {
                path: '/processconfig/new/:type',
                name: '配置新建',
                iconCls: 'icon iconfont icon-ir-nav-close nav',
                hidden: true
            },
            {
                path: '/processconfig/:id',
                name: '配置查看',
                iconCls: 'icon iconfont icon-ir-nav-close nav',
                hidden: true
            }
        ],
    },
    {
        path: '/',
        name: '租户',
        iconCls: 'icon iconfont icon-ir-integration nav',//图标样式class
        children: [
            {
                path: '/tenants',
                name: '列表', iconCls: 'icon iconfont icon-ir-nav-close nav'
            },
            { path: '/tenants/add', name: '创建租户', iconCls: 'fa fa-user-o', hidden: true },
            { path: '/tenants/:id', name: '查看租户', iconCls: 'fa fa-user-o', hidden: true },
        ],
        hidden: true

    },
    {
        path: '/license/activate',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/',
        name: '权限管理',
        iconCls: 'icon iconfont icon-ir-attestation nav',
        children: [
            {
                path: '/roleManagement',
                name: 'roleManagement',
                mate: {
                }
            },
            {
                path: '/role',
                name: 'role',
                mate: {
                }
            },
            {
                path: '/userManagement',
                name: 'userManagement',
                mate: {
                }
            },
            {
                path: '/users',
                name: 'users',
                mate: {
                }
            }
        ]
    }
]

module.exports = {
    "code": function () { // simulation error code, 1/10 probability of error code 1.
        return Math.random() < 0.1 ? 1 : 0;
    },
    "data":navData
};
