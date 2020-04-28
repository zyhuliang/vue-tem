const development = process.env.NODE_ENV !== "production";
export default [
    {
        'menuName': '数据集成',
        'menuIcon': 'icon iconfont icon-ir-integration nav',
        'id': '/dataIntegration',
        'reg': '/api/woven/dataintegration/',
        'submenus': [
            {
                'submenuName': '数据资源管理',
                'submenuIcon': 'fa fa-server nav',
                'id': '/resourceMan',
                'reg': '/api/woven/resource/roots/',
            },
            {
                'submenuName': '结构数据采集',
                'submenuIcon': 'fa fa-shopping-basket nav',
                'id': '/collector',
                'reg': '/api/woven/collectors/query/',
            },
            {
                'submenuName': '文件管理',
                'submenuIcon': 'fa fa-file-zip-o nav',
                'id': '/dataMan',
                'reg': '/api/oss/file/',
            },
            {
                'submenuName': '文件数据采集',
                'submenuIcon': 'fa fa-cloud-download nav',
                'id': '/synchronization',
                'reg': '/api/woven/synchronizations/dataSyncJobs/query/',
            },
            {
                'submenuName': '非结构化采集',
                'submenuIcon': 'fa fa-download nav',
                'id': '/fileSynchronization',
                'reg': '/api/woven/synchronizations/fileSyncJobs/query/',
            },
            {
                'submenuName': '对象采集',
                'submenuIcon': 'fa fa-download nav',
                'id': '/objectSynchronization',
                'reg': '/api/woven/synchronizations/objectSyncJobs/query/',
            }
        ]
    },
    {
        'menuName': '数据治理',
        'menuIcon': 'icon iconfont icon-ir-govern nav',
        'id': '/dataGovernance',
        'reg': '/api/woven/datagovernance/',
        'submenus': [
            {
                'submenuName': '质量分析',
                'submenuIcon': 'fa fa-balance-scale nav',
                'id': '/qualityAnalysis/analysisTemplate',
                'reg': '/api/woven/zmod/query/',
            },
            {
                'submenuName': '元数据分析',
                'submenuIcon': 'fa fa-flask nav',
                'id': '/schemaAnalysis/:id/',
                'reg': '/api/woven/metadataAnalysis/',
            },
            {
                'submenuName': '血缘分析',
                'submenuIcon': 'fa fa-flask nav',
                'id': '/kinship/:id/',
                'reg': '/api/woven/consanguinityAnalysis/',
            }
        ]
    },
    {
        'menuName': '数据分析',
        'menuIcon': 'icon iconfont icon-ir-analyze nav',
        'id': '/dataAnalysis',
        'reg': '/api/woven/dataAnalysis/',
        'submenus': [
            {
                'submenuName': '流程管理',
                'submenuIcon': 'fa fa-sitemap nav',
                'id': '/design',
                'reg': '/api/woven/resource/roots/',
            },
            {
                'submenuName': '交互式查询',
                'submenuIcon': 'icon iconfont icon-ir-integration nav',
                'id': '/interactiveQuery',
                'reg': '/api/woven/interactiveQuery/',
            },
            {
                'submenuName': '项目目录',
                'submenuIcon': 'fa fa-tasks nav',
                'id': '/resourceManProject',
                'reg': '/api/woven/project/projects/',
            },
            {
                'submenuName': '配置',
                'submenuIcon': 'fa fa-gears nav',
                'id': '',
                'reg': '/api/woven/configuration/',
                'submenus': [
                    // {
                    //     'submenuName': '工作流选择器',
                    //     'submenuIcon': 'fa fa-tasks nav',
                    //     'id': '/processconfig/workflow-selector',
                    //     'reg': '/api/processconfigs/query/',
                    // },
                    // {
                    //     'submenuName': '批处理选择器',
                    //     'submenuIcon': 'fa fa-tasks nav',
                    //     'id': '/processconfig/dataflow-selector',
                    //     'reg': '/api/processconfigs/query/',
                    // },
                    // {
                    //     'submenuName': '自定义函数',
                    //     'submenuIcon': 'icon iconfont icon-ir-integration nav',
                    //     'id': '/processconfig/dataflow-udf',
                    //     'reg': '/api/processconfigs/query/',
                    // },
                    // {
                    //     'submenuName': '过滤器',
                    //     'submenuIcon': 'fa fa-tasks nav',
                    //     'id': '/processconfig/filter-class',
                    //     'reg': '/api/processconfigs/query/',
                    // },
                    {
                        'submenuName': '数据库驱动',
                        'submenuIcon': 'fa fa-sitemap nav',
                        'id': '/processconfig/jdbc-driver',
                        'reg': '/api/processconfigs/query/',
                    }
                ]
            }
        ]
    },
    {
        'menuName': '实时计算',
        'menuIcon': 'icon iconfont icon-ir-attestation nav',
        'id': '/realTimeComputing',
        'reg': '/api/woven/realtimeComputation/',
        'submenus': [
            {
                'submenuName': '作业管理',
                'submenuIcon': 'fa fa-calendar-o nav',
                'id': '/jobManage',
                'reg': '/api/streaming/job/list/',
            },
            {
                'submenuName': '作业运维',
                'submenuIcon': 'fa fa-leaf nav',
                'id': '/jobOperation',
                'reg': '/api/streaming/job/progress/list/',
            },
            {
                'submenuName': '作业模板',
                'submenuIcon': 'fa fa-calendar-o nav',
                'id': '/jobTemplate',
                'reg': '/api/streaming/job/template/list/',
            },
            {
                'submenuName': '交互式查询',
                'submenuIcon': 'fa fa-calendar-o nav',
                'id': '/interactiveQuery',
                'reg': '/api/woven/interactiveQuery/',
            },
            {
                'submenuName': '实时计算流程设计',
                'submenuIcon': 'fa fa-calendar-o nav',
                'id': '/realtime/list/index',
                'reg': '/api/streaming/job/realtime/list/'
            },
            {
                'submenuName': '实时计算任务监控',
                'submenuIcon': 'fa fa-calendar-o nav',
                'id': '/realtime/list/tasklist',
                'reg': '/api/streaming/job/realtime/task/',
            }
        ]
    },
    {
        'menuName': '数据监控',
        'menuIcon': 'icon iconfont icon-ir-monitoring nav',
        'id': '/dataMonitoring',
        'reg': '/api/woven/dataMonitoring/',
        'submenus': [
            {
                'submenuName': '运维管控',
                'submenuIcon': 'fa fa-life-buoy nav',
                'id': '/hippo/index',
                'reg': '/api/woven/mochaitom/',
            },
            {
                'submenuName': '监控可视化',
                'submenuIcon': 'fa fa-line-chart nav',
                'id': '/hippo/visualization',
                'reg': '/hippo/visualization/',
            },
            {
                'submenuName': '访问监控',
                'submenuIcon': 'fa fa-line-chart nav',
                'id': '/hippo/visit',
                'reg': '/api/woven/accessMonitoring/',
            },
            {
                'submenuName': '任务监控',
                'submenuIcon': 'fa fa-area-chart nav',
                'id': '/hippo/taskControl',
                'reg': '/api/woven/taskMonitoring/',
                'submenus': [
                    {
                        'submenuName': '任务调度',
                        'submenuIcon': 'fa fa-server nav',
                        'id': '/hippo/schedule',
                        'reg': '/api/woven/taskScheduling/',
                    },
                ]
            },
            {
                'submenuName': '数据统计',
                'submenuIcon': 'fa fa-line-chart nav',
                'id': '/hippo/statistics',
                'reg': '/api/woven/dataStatistics/',
            },
        ]
    },
    {
        'menuName': '权限管理',
        'menuIcon': 'icon iconfont icon-ir-attestation nav',
        'id': '/systemConfig',
        'reg': '/api/woven/privilegeManagement/',
        'submenus': development ? [
            {
                'submenuName': '资源管理',
                'submenuIcon': 'fa fa-key nav',
                'id': '/rolePermission',
                'reg': '/api/woven/resourceManagement/',
            },
            {
                'submenuName': '角色管理',
                'submenuIcon': 'icon iconfont icon-ir-integration nav',
                'id': '/roleManagement',
                'reg': '/api/woven/roleManagement/',
            },
            {
                'submenuName': '用户管理',
                'submenuIcon': 'fa fa-user-circle nav',
                'id': '/userManagement',
                'reg': '/api/woven/userManagement/',
            },
            {
                'submenuName': '日志审计',
                'submenuIcon': 'fa fa-user-circle nav',
                'id': '/logAudit',
                'reg': '/api/logs/metrics/request/page/',
            }

        ]:[
            {
                'submenuName': '角色管理',
                'submenuIcon': 'icon iconfont icon-ir-integration nav',
                'id': '/roleManagement',
                'reg': '/api/woven/roleManagement/',
            },
            {
                'submenuName': '用户管理',
                'submenuIcon': 'fa fa-user-circle nav',
                'id': '/userManagement',
                'reg': '/api/woven/userManagement/',
            },
            {
                'submenuName': '日志审计',
                'submenuIcon': 'fa fa-user-circle nav',
                'id': '/logAudit',
                'reg': '/api/logs/metrics/request/page/',
            }
        ]
    }
]
