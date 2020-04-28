//睿帆科技 登录页面
// import login from '@modules/Baymax/login.vue'
import login from '@page/login/login.vue'
import changePassword from '@page/login/changePassword.vue'
//北软 数据中心 登录页面
//import login from '@views/login.vue'

import NotFound from '@views/404.vue'
import home from '@views/home.vue'
import license from '@views/license.vue'
import resourceMan from '@views/cheetah/resourceMan/resourceMan.vue'
import synchronization from '@views/cheetah/synchronization/synchronization.vue'
import collector from '@views/cheetah/collector/collector.vue'
import qualityAnalysis from '@views/zebra/qualityAnalysis.vue'
import design from '@views/rhinos/flowManage/design.vue'
import configuration from '@views/rhinos/processConfig/processConfig.vue'
import dataConfiguration from '@views/rhinos/processConfig/manage.vue'

import definesteps from '@views/rhinos/processConfig/definesteps.vue'
import user from '@views/griffin/user.vue'
import permission from '@views/griffin/permission.vue'
import auditlogs from '@views/griffin/auditlogs.vue'
import tenantHome from '@views/griffin/tenant/tenant-home.vue'
import tenantAdd from '@views/griffin/tenant/add.vue'

// 引入数据集成内路由页面
// resourceMan
import DBSource from '@views/cheetah/resourceMan/datasource/DBsource.vue'
import httpSource from '@views/cheetah/resourceMan/datasource/httpsource.vue'
import localfsSource from '@views/cheetah/resourceMan/datasource/localfssource.vue'
import ftpSource from '@views/cheetah/resourceMan/datasource/ftpsource.vue'
import socketSource from '@views/cheetah/resourceMan/datasource/socketsource.vue'
import mongoDBSource from '@views/cheetah/resourceMan/datasource/mongoDBsource.vue'
import esSource from '@views/cheetah/resourceMan/datasource/essource.vue'
import DBdataset from '@views/cheetah/resourceMan/dataset/DBdataset.vue'
import dataset from '@views/cheetah/resourceMan/dataset/dataset.vue'
import schema from '@views/cheetah/resourceMan/schema/schema.vue'
import standard from '@views/cheetah/resourceMan/standard/standard.vue'
import analysis from '@views/cheetah/resourceMan/analysis/analysis.vue'
import relation from '@views/cheetah/resourceMan/relation/relation.vue'
// collector
import importDatas from '@views/cheetah/collector/importDatas.vue'
import collectorTemplate from '@views/cheetah/collector/collectorTemplate.vue'
import collectorDetailRoute from '@views/cheetah/collector/collectorDetailRoute.vue'
import collectorDetailView from '@views/cheetah/collector/collectorDetailView.vue'
import collectorDetailDir from '@views/cheetah/collector/collectorDetailDir.vue'
import collectorDetailTaskList from '@views/cheetah/collector/collectorDetailTaskList.vue'
import step1 from '@views/cheetah/collector/taskWizard/step1.vue'
import step2 from '@views/cheetah/collector/taskWizard/step2.vue'
import step3 from '@views/cheetah/collector/taskWizard/step3.vue'
import step4 from '@views/cheetah/collector/taskWizard/step4.vue'
import step5 from '@views/cheetah/collector/taskWizard/step5.vue'
//文件管理
import fileManRoute from '@views/cheetah/fileManage/route.vue'
import fileManFileList from '@views/cheetah/fileManage/list.vue'
import fileManFileUpload from '@views/cheetah/fileManage/upload.vue'

// synchronization
import synchronizationAdd from '@views/cheetah/collector/taskWizard/index.vue'
import synchronizationExecuteList from '@views/cheetah/synchronization/synchronizationExecuteList.vue'
import importExecuteList from '@views/cheetah/synchronization/synchronizationExecuteList.vue'
import collectorExecuteList from '@views/cheetah/synchronization/synchronizationExecuteList.vue'
import synchronizationPreviewData from '@views/cheetah/synchronization/synchronizationPreviewData.vue'

// fileSynchronization
import fileSynchronization from '@views/cheetah/fileSynchronization/fileSynchronization.vue'
import fileSynchronizationAdd from '@views/cheetah/fileSynchronization/taskWizard/index.vue'
import fileStep1 from '@views/cheetah/fileSynchronization/taskWizard/step1.vue'
import fileStep2 from '@views/cheetah/fileSynchronization/taskWizard/step2.vue'
import fileStep4 from '@views/cheetah/fileSynchronization/taskWizard/step4.vue'
import fileStep5 from '@views/cheetah/fileSynchronization/taskWizard/step5.vue'
// objectSynchronization
import objectSynchronization from '@views/cheetah/objectSynchronization/objectSynchronization.vue'
import objectSynchronizationAdd from '@views/cheetah/objectSynchronization/taskWizard/index.vue'
import objectStep1 from '@views/cheetah/objectSynchronization/taskWizard/step1.vue'
import objectStep2 from '@views/cheetah/objectSynchronization/taskWizard/step2.vue'
import objectStep4 from '@views/cheetah/objectSynchronization/taskWizard/step4.vue'
import objectStep5 from '@views/cheetah/objectSynchronization/taskWizard/step5.vue'
import dataList from '@views/zebra/dataList.vue'

//引入质量分析内路由页面
import analysisTemplate from '@views/zebra/analysisTemplate.vue'
import templateAdd from '@views/zebra/template/add.vue'
import templateRules from '@views/zebra/template/rules.vue'
import templateRulesNew from '@views/zebra/template/rules/new.vue'

//规则绑定
import templateRulesBind from '@views/zebra/template/rules/ruleBind'

import templateEdit from '@views/zebra/template/edit.vue'
import analysisRules from '@views/zebra/analysisRules.vue'
import rulesAdd from '@views/zebra/Rules/add.vue'
import ruleEdit from '@views/zebra/Rules/edit.vue'
import teInformation from '@views/zebra/teInformation.vue'

import taskCarry from '@views/zebra/Tasks/taskCarry.vue'
import taskResult from '@views/zebra/Tasks/taskResult.vue'
import seeResult from '@views/zebra/Tasks/seeResult.vue'
import taskTempEdit from '@views/zebra/Tasks/taskTempEdit.vue'

import erStatistics from '@views/zebra/erStatistics.vue'

//引入权限管理所需的路由页面
import userAdd from '@views/griffin/user/add.vue'
import tenants from '@views/griffin/tenant/list.vue'

//引入数据分析所需的页面
import processConfigAdd from '@views/rhinos/processConfig/add/add.vue'
import designContainer from '@views/rhinos/design/container.vue'
import designDrawing from '@views/rhinos/design/designDrawing.vue'
import designPlan from '@views/rhinos/design/plan.vue'
import designPlanAdd from '@views/rhinos/design/plan/add.vue'
import executingHistory from '@views/rhinos/design/executingHistory.vue'
import executingDetail from '@views/rhinos/design/executingDetail.vue'
import executingDetailInfo from '@views/rhinos/design/detail/detail.vue'
import executingLogInfo from '@views/rhinos/design/detail/logInfo.vue'
import executingOutPuts from '@views/rhinos/design/detail/outputs.vue'

//new designer
import steamdesigner from '@views/rhinos/newdesigner/stream/editor/index.vue'
import datadesigner from '@views/rhinos/newdesigner/dataflow/editor/index.vue'
import workdesigner from '@views/rhinos/newdesigner/workflow/editor/index.vue'

//引入实时监控所需页面
import jobManage from '@views/stream/jobManage/jobManage.vue'
// 交互式查询
import InteractiveQuery from '@views/stream/interactiveQuery/index.vue'
import jobOperation from '@views/stream/jobOperation/jobOperation.vue'
import streamMonitor from '@views/stream/jobOperation/monitor/detail.vue'
import streamBoard from '@views/stream/jobOperation/monitor/board.vue'
import streamExecuterSchedule from '@views/stream/jobOperation/monitor/executerSchedule.vue'
import streamJobDetail from '@views/stream/jobOperation/monitor/jobDetail.vue'
import streamLog from '@views/stream/jobOperation/monitor/log.vue'
import streamOutput from '@views/stream/jobOperation/monitor/output.vue'
import jobDetail from '@views/stream/jobManage/job/jobDetail.vue'
import jobDescription from '@views/stream/jobManage/job/jobDescription.vue'
// import newjobDescription from '@views/stream/jobManage/job/newjobDescription.vue'
import jobCepDesc from '@views/stream/jobManage/job/jobCepDesc.vue'  //新增cep作业描述
import jobConfigure from '@views/stream/jobManage/job/jobConfigure.vue'
import jobTemplate from '@views/stream/jobTemplate/jobTemplate.vue'
import addTemplate from '@views/stream/jobTemplate/addTemplate.vue'
import realtimeDesignList from '@views/realtime/list/index.vue'
import realtimeTaskList from '@views/realtime/list/tasklist.vue'
import realtimeControl from '@views/realtime/list/control/index.vue'

//引入数据监控所需页面
import hippoIndex from '@views/hippo/index.vue'
import kinship from '@views/zebra/kinship.vue'
import schemaAnalysis from '@views/zebra/schemaAnalysis.vue'
import hiippoStatistics from '@views/hippo/statistics.vue'
import visit from '@views/hippo/visit.vue'
import taskControl from '@views/hippo/taskControl.vue'
import hippoScheduleContainer from '@views/hippo/schedule/container.vue'
import hippoScheduleList from '@views/hippo/schedule/list.vue'
import hippoScheduleIndex from '@views/hippo/schedule/index.vue'
import hippoExecuteIndex from '@views/hippo/schedule/execute.vue'
import hippoExecuteList from '@views/hippo/execute/list.vue'
import hippoScheduleAdd from '@views/hippo/schedule/add.vue'
import hippoAnalyzeList from '@views/hippo/analyze/list.vue'
import hippoMonitorRunning from '@views/hippo/monitor/running.vue'
import hippoMonitorFailed from '@views/hippo/monitor/failed.vue'
import hippoMonitorKilled from '@views/hippo/monitor/killed.vue'
import hippoMonitorReady from '@views/hippo/monitor/ready.vue'
import hippoMonitorSucceeded from '@views/hippo/monitor/succeeded.vue'
import hippoMonitorUnknown from '@views/hippo/monitor/unknown.vue'
import hippoMonitorTimeout from '@views/hippo/monitor/timeout.vue'
import hippoMonitorContainer from '@views/hippo/monitor/container.vue'
import hippoData from '@views/hippo/data/container.vue'
import hippoDatastatusDraw from '@views/hippo/data/status/draw.vue'
import hippoDatastatusList from '@views/hippo/data/status/statuslist.vue'
import hippoAlarm from '@views/hippo/alarm/container.vue'
import hippoAlarmList from '@views/hippo/alarm/alarm.vue'
import hippoAlarmRuleList from '@views/hippo/alarm/rule.vue'
import hippoAlarmRuleAdd from '@views/hippo/alarm/addrule.vue'
import hippoTasks from '@views/hippo/tasks/tasks.vue'
import hippoTasksProbability from '@views/hippo/tasks/probability/probability.vue'
import hippoTasksHistory from '@views/hippo/tasks/history/history.vue'
import hippoTasksJobanalysis from '@views/hippo/tasks/jobanalysis/jobanalysis.vue'
import hippoNodeMonitor from '@views/hippo/nodeMonitor/index.vue'
import linkiframe from '@views/realtime/iframe/flink/index.vue'
import flink_row_check from '@views/realtime/iframe/shareplatform/flink_row_check/index.vue'
import flink_row_check_baobiao from '@views/realtime/iframe/shareplatform/flink_row_check_baobiao/index.vue'
import sink_row_check_null from '@views/realtime/iframe/shareplatform/sink_row_check_null/index.vue'
import sink_row_check_null_baobiao from '@views/realtime/iframe/shareplatform/sink_row_check_null_baobiao/index.vue'
import sink_row_check_acc_baobiao from '@views/realtime/iframe/shareplatform/sink_row_check_acc_baobiao/index.vue'

//接入监控
import WJInputServiceSize_H from '@views/realtime/iframe/shareplatform/sec/WJInputServiceSize_H/index.vue'
//计算过程监控
import WJHandleServiceSize_H from '@views/realtime/iframe/shareplatform/thir/WJHandleServiceSize_H/index.vue'
import WJOutputServiceSize_H from '@views/realtime/iframe/shareplatform/thir/WJOutputServiceSize_H/index.vue'

//全流程监控
import WJServicewaveSize_H from '@views/realtime/iframe/shareplatform/four/WJServicewaveSize_H/index.vue'
import WJServicewaveRow_H from '@views/realtime/iframe/shareplatform/four/WJServicewaveRow_H/index.vue'

// 数据监控可视化
import visualization from '@views/hippo/monitor/visualization/index.vue'

// 任务警告
import taskWarnings from '@views/hippo/taskWarnings/index.vue'

//后台服务
import service from '@views/hippo/tasks/service/service.vue'

// project
import DBdatasetProject from '@views/cheetah/resourceMan/dataset/DBdataset.vue'
import datasetProject from '@views/cheetah/resourceMan/dataset/dataset.vue'
import schemaProject from '@views/cheetah/resourceMan/schema/schema.vue'
import resourceManProject from '@views/rhinos/projectDir/resourceMan.vue'
//引入数据分析项目所需的页面
import designContainerProject from '@views/rhinos/design/container.vue'
import designDrawingProject from '@views/rhinos/design/designDrawing.vue'
import designPlanProject from '@views/rhinos/design/plan.vue'
import designPlanAddProject from '@views/rhinos/design/plan/add.vue'
import executingHistoryProject from '@views/rhinos/design/executingHistory.vue'
import executingDetailProject from '@views/rhinos/design/executingDetail.vue'
import executingDetailInfoProject from '@views/rhinos/design/detail/detail.vue'
import executingLogInfoProject from '@views/rhinos/design/detail/logInfo.vue'
import executingOutPutsProject from '@views/rhinos/design/detail/outputs.vue'
// 权限管理
import roleManagement from '@route/rightsManagement/roleManagement/roleManagement'
import userManagement from '@route/rightsManagement/userManagement/userManagement'
import rolePermission from '@route/rightsManagement/permission/permission'
import logAudit from '@route/rightsManagement/logAudit/logAudit'
import cluster from "@route/rightsManagement/cluster/index";
// 质量分析
import qiang_qualityAnalysis from '@route/qualityAnalysis/qualityAnalysis'

// 关于我们
import aboutUs from '@route/aboutUs/index'

if (sessionStorage.getItem("user") && sessionStorage.getItem("permission")) {
    var currentUser = sessionStorage.getItem("user");
    var currentPermission = sessionStorage.getItem("permission")
    var showGriffin = false
    if (currentPermission.indexOf("woven.admin") == "-1") {
        showGriffin = true
    }
    var showPermisssinItem = false
    if (currentUser != "root" && currentUser != "admin") {
        showPermisssinItem = true
    }
}

let routes = [
    {
        path: '/login',
        component: login,
    },
    {
        path: '/changePassword',
        component: changePassword
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //新增表格查询
    {
        path: '/',
        //      	name:'search',
        component: home,
        hidden: true,
        children: [{
            path: '/search', name: '全局搜索', component: resolve => require(['@components/globalSearch/Search'], resolve),
            children: [
                {
                    path: '/dataImport',
                    name: 'dataImport',
                    component: resolve => require(['@components/globalSearch/tables/dataImport'], resolve)
                },
                {
                    path: '/fileImport',
                    name: 'fileImport',
                    component: resolve => require(['@components/globalSearch/tables/fileImport'], resolve)
                },
                {
                    path: '/globalCollector',
                    name: 'collector',
                    component: resolve => require(['@components/globalSearch/tables/collector'], resolve)
                },
                {
                    path: '/importTask',
                    name: 'importTask',
                    component: resolve => require(['@components/globalSearch/tables/importTask'], resolve)
                },
                {
                    path: '/datasets',
                    name: 'Datasets',
                    component: resolve => require(['@components/globalSearch/tables/datasets'], resolve)
                },
                {
                    path: '/flows',
                    name: 'Flows',
                    component: resolve => require(['@components/globalSearch/tables/flows'], resolve)
                },
                {
                    path: '/configure',
                    name: 'Configure',
                    component: resolve => require(['@components/globalSearch/tables/configure'], resolve)
                },
                {
                    path: '/datasource',
                    name: 'Datasource',
                    component: resolve => require(['@components/globalSearch/tables/datasource'], resolve)
                },
                {
                    path: '/schemas',
                    name: 'Schemas',
                    component: resolve => require(['@components/globalSearch/tables/schemas'], resolve)
                },
                {
                    path: '/globalTemp',
                    name: 'globalTemp',
                    component: resolve => require(['@components/globalSearch/tables/globalTemp'], resolve)
                },
                {
                    path: '/globalRule',
                    name: 'globalRule',
                    component: resolve => require(['@components/globalSearch/tables/globalRule'], resolve)
                },
                {
                    path: '/globalTaskCarry',
                    name: 'globalTaskCarry',
                    component: resolve => require(['@components/globalSearch/tables/globalTaskCarry'], resolve)
                }
            ]
        }
        ]
    },
    {
        path: '/sjjc',
        component: home,
        name: '数据集成',
        iconCls: 'icon iconfont icon-ir-integration nav',//图标样式class
        children: [
            {
                path: '/resourceMan',
                component: resourceMan,
                name: '资源目录',
                iconCls: 'fa fa-server nav',
                children: [
                    { path: '/DBsource/:parentId/:id', component: DBSource, name: "DBSource", hidden: true },
                    { path: '/httpsource/:parentId/:id', component: httpSource, name: "httpSource", hidden: true },
                    { path: '/localfsSource/:parentId/:id', component: localfsSource, name: "localfsSource", hidden: true },
                    { path: '/ftpsource/:parentId/:id', component: ftpSource, name: "ftpSource", hidden: true },
                    { path: '/socketsource/:parentId/:id', component: socketSource, name: "socketSource", hidden: true },
                    { path: '/mongoDBSource/:parentId/:id', component: mongoDBSource, name: "mongoDBSource", hidden: true },
                    { path: '/esSource/:parentId/:id', component: esSource, name: "esSource", hidden: true },
                    { path: '/DBdataset/:parentId/:id', component: DBdataset, name: "DBdataset", hidden: true },
                    { path: '/dataset/:parentId/:id', component: dataset, name: "dataset", hidden: true },
                    { path: '/schema/:parentId/:id', component: schema, name: "schema", hidden: true },
                    { path: '/standard/:parentId/:id', component: standard, name: "standard", hidden: true },
                    { path: '/analysis/:id', component: analysis, name: "analysis", hidden: true }

                ]
            },
            {
                path: '/dataMan',
                component: fileManRoute,
                name: '文件管理',
                iconCls: 'fa fa-file-zip-o nav',
                children: [
                    {
                        path: '/dataMan/fileList',
                        component: fileManFileList,
                        name: '文件列表',
                        iconCls: 'fa fa-file-zip-o nav',
                    },
                    {
                        path: '/dataMan/fileUpload',
                        component: fileManFileUpload,
                        name: '文件上传',
                        iconCls: 'fa fa-file-zip-o nav',
                    },
                ], redirect: '/dataMan/fileList'
            },
            {
                path: '/synchronization',
                component: synchronization,
                name: '数据导入',
                iconCls: 'fa fa-cloud-download nav',
                children: [
                    {
                        path: '/task/add/:collectorId/:id', component: synchronizationAdd, name: "创建导入任务", children: [
                            // 路径为'/synchronization/add',默认使用组件step1
                            { path: '/taskWizard/step1/:collectorId/:id', component: step1, name: "数据来源" },
                            { path: '/taskWizard/step2/:collectorId/:id', component: step2, name: "数据目的" },
                            { path: '/taskWizard/step3/:collectorId/:id', component: step3, name: "字段映射" },
                            { path: '/taskWizard/step4/:collectorId/:id', component: step4, name: "任务设置" },
                            { path: '/taskWizard/step5/:collectorId/:id', component: step5, name: "预览保存" }
                        ]
                    },
                    { path: '/synchronization/executeList/:taskId', component: synchronizationExecuteList, name: "执行列表" },
                    { path: '/synchronization/previewData', component: synchronizationPreviewData, name: "预览数据" },
                ]
            },
            {
                path: '/fileSynchronization',
                component: fileSynchronization,
                name: '文件导入',
                iconCls: 'fa fa-download nav',
                children: [
                    {
                        path: '/fileTask/add', component: fileSynchronizationAdd, name: "导入任务的创建", children: [
                            // 路径为'/synchronization/add',默认使用组件step1
                            { path: '/fileTaskWizard/step1', component: fileStep1, name: "来源数据" },
                            { path: '/fileTaskWizard/step2', component: fileStep2, name: "目的数据" },
                            /*{ path: '/fileTaskWizard/step3', component: fileStep3, name:"字段映射"  },*/
                            { path: '/fileTaskWizard/step3', component: fileStep4, name: "设置任务" },
                            { path: '/fileTaskWizard/step4', component: fileStep5, name: "保存预览" }
                        ]
                    },
                    {
                        path: '/fileSynchronization/executeList/:taskId',
                        component: synchronizationExecuteList,
                        name: "文件导入执行列表"
                    },
                ]
            },
            {
                path: '/collector', component: collector, name: '采集器', iconCls: 'fa fa-shopping-basket nav',
                children: [
                    { path: '/collector/collectorTemplate', component: collectorTemplate, name: '采集器 ' },
                    {
                        path: '/collector/importData', component: importDatas, name: '导入任务', children: [
                            { path: '/import/executeList/:taskId', component: importExecuteList, name: "导入任务执行列表" },
                        ]
                    },

                ], redirect: '/collector/collectorTemplate'
            },
            {
                path: '/collector/collectorTemplate',
                component: collectorDetailRoute,
                name: '采集器详情',
                hidden: true,
                children: [
                    {
                        path: '/collector/:id/view/:resourceId',
                        component: collectorDetailView,
                        name: '采集器详细信息',
                        hidden: true,
                    },
                    {
                        path: '/collector/:id/taskList/:resourceId',
                        component: collectorDetailTaskList,
                        name: '采集器任务列表',
                        hidden: true,
                        children: [
                            { path: '/collector/executeList/:taskId', component: collectorExecuteList, name: "采集器执行列表" },
                        ]
                    },
                    {
                        path: '/collector/:id/dir/:resourceId',
                        component: collectorDetailDir,
                        name: '采集器资源目录',
                        hidden: true
                    },
                ]
            },
            {
                path: '/objectSynchronization',
                component: objectSynchronization,
                name: '对象数据采集',
                hidden: true,
                iconCls: 'icon iconfont icon-ir-nav-close nav',
                children: [{
                    path: '/objectTask/add',
                    component: objectSynchronizationAdd,
                    name: "导入任务的创建",
                    children: [
                        // 路径为'/synchronization/add',默认使用组件step1
                        {
                            path: '/objectTaskWizard/step1',
                            component: objectStep1,
                            name: "数据来源"
                        },
                        {
                            path: '/objectTaskWizard/step2',
                            component: objectStep2,
                            name: "字段设置"
                        },
                        {
                            path: '/objectTaskWizard/step3',
                            component: objectStep4,
                            name: "任务设置"
                        },
                        {
                            path: '/objectTaskWizard/step4',
                            component: objectStep5,
                            name: "预览保存"
                        }
                    ]
                },
                {
                    path: '/objectSynchronization/executeList/:taskId',
                    component: synchronizationExecuteList,
                    name: "对象导入执行列表"
                },
                ]
            },
        ], redirect: '/resourceMan'
    },
    {
        path: '/sjzl',
        component: home,
        name: '数据治理',
        iconCls: 'icon iconfont icon-ir-govern nav',
        children: [
            {
                path: '/qualityAnalysis/analysisTemplate',
                component: qualityAnalysis,
                name: '质量分析',
                iconCls: 'fa fa-balance-scale nav',
                children: [
                    {
                        path: '', component: analysisTemplate, name: '分析模板',
                        children: [
                            { path: '/qualityAnalysis/analysisTemplate/add', component: templateAdd, name: '创建分析模板' },
                            { path: '/qualityAnalysis/analysisTemplate/edit', component: templateEdit, name: '查看分析模板' },
                            {
                                path: '/qualityAnalysis/analysisTemplate/rules', component: templateRules, name: '规则模板',
                                children: [
                                    {
                                        path: '/qualityAnalysis/analysisTemplate/rules/new',
                                        component: templateRulesNew,
                                        name: '创建规则模板'
                                    },
                                    {
                                        path: '/qualityAnalysis/analysisTemplate/rules/ruleBind',
                                        component: templateRulesBind,
                                        name: '规则绑定'
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        path: '/qualityAnalysis/analysisRules', component: analysisRules, name: '分析规则',
                        children: [
                            { path: '/qualityAnalysis/analysisRules/add', component: rulesAdd, name: '创建分析规则' },
                            { path: '/qualityAnalysis/analysisRules/edit', component: ruleEdit, name: '查看规则模板' },
                        ]
                    },
                    {
                        path: '/qualityAnalysis/teInformation', component: teInformation, name: '任务执行信息',
                        children: [
                            { path: '/qualityAnalysis/teInformation/taskTempEdit', component: taskTempEdit, name: '查看分析模板2' },
                            { path: '/qualityAnalysis/teInformation/taskcarry', component: taskCarry, name: '查看任务执行信息' },
                            {
                                path: '/qualityAnalysis/teInformation/taskresult', component: taskResult, name: '分析结果',
                                children: [
                                    {
                                        path: '/qualityAnalysis/teInformation/taskresult/seeResult',
                                        component: seeResult,
                                        name: '查看分析结果'
                                    },
                                    {
                                        path: '/qualityAnalysis/analysisTemplate/rules/ruleBind',
                                        component: templateRulesBind,
                                        name: '规则绑定2'
                                    },
                                    { path: '/qualityAnalysis/analysisRules/edit', component: ruleEdit, name: '查看规则模板2' },
                                ]
                            }
                        ]
                    },
                    { path: '/qualityAnalysis/erStatistics', component: erStatistics, name: '评估结果统计' }
                ],
                redirect: '/qualityAnalysis/analysisTemplate'
            },
            { path: '/kinship/:id/', component: kinship, name: '血缘分析', iconCls: 'fa fa-flask nav' },
            { path: '/schemaAnalysis/:id/', component: schemaAnalysis, name: '元数据分析', iconCls: 'fa fa-flask nav' },
            {
                path: '/dataList',
                component: dataList,
                name: '数据目录',
                iconCls: 'icon iconfont icon-ir-nav-close nav',
                hidden: true
            }
        ]
    },
    {
        path: '/sjfx',
        component: home,
        name: '数据分析',
        iconCls: 'icon iconfont icon-ir-analyze nav',
        // leaf: true,//只有一个节点
        children: [
            {
                path: '/design', component: design, name: '流程管理', iconCls: 'fa fa-sitemap nav',
                children: [
                    {
                        path: '/design/designDrawing/:id', component: designContainer, name: '流程设计', children: [
                            { path: '', component: designDrawing, name: '设计' },
                            {
                                path: "/streamflow",
                                component: steamdesigner,
                                name: "streamflow",
                            },
                            {
                                path: "/dataflow",
                                component: datadesigner,
                                name: "dataflow",
                            },
                            {
                                path: "/workflow",
                                component: workdesigner,
                                name: "workflow"
                            },
                            {
                                path: '/design/plan/:id', component: designPlan, name: '计划 ', children: [
                                    { path: '/design/plan/:id/add', component: designPlanAdd, name: '创建流程执行计划' }
                                ]
                            },
                            { path: '/design/executingHistory/:id', component: executingHistory, name: '执行历史' },
                            {
                                path: '/design/executingDetail/:id', component: executingDetail, name: '执行详细',
                                children: [
                                    {
                                        path: '/design/executingDetail/:id/exection/:jobId/info',
                                        component: executingDetailInfo,
                                        name: '详细信息'
                                    },
                                    {
                                        path: '/design/executingDetail/:id/exection/:jobId/outputs',
                                        component: executingOutPuts,
                                        name: '输出'
                                    },
                                    {
                                        path: '/design/executingDetail/:id/exection/:jobId/logInfo',
                                        component: executingLogInfo,
                                        name: '日志信息'
                                    },
                                    {
                                        path: '/design/executingDetail/:id/info',
                                        component: executingDetailInfo,
                                        name: '详细信息 '
                                    },
                                    {
                                        path: '/design/executingDetail/:id/outputs',
                                        component: executingOutPuts,
                                        name: '输出 '
                                    },
                                    {
                                        path: '/design/executingDetail/:id/logInfo',
                                        component: executingLogInfo,
                                        name: '日志信息 '
                                    },
                                ], redirect: '/design/executingDetail/:id/info'
                            }
                        ], redirect: '/design/designDrawing/:id'
                    },
                ]
            },
            {
                path: '/resourceManProject',
                component: resourceManProject,
                name: '项目目录',
                iconCls: 'fa fa-tasks nav',
                children: [
                    { path: '/project/DBdataset/:projectId/:id', component: DBdatasetProject, name: "DBdatasetProject" },
                    { path: '/project/dataset/:projectId/:id', component: datasetProject, name: "datasetProject" },
                    {
                        path: '/project/schema/:projectId/:id',
                        component: schemaProject,
                        name: "schemaProject",
                        props: true
                    },
                    {
                        path: '/project/design/designDrawing/:id',
                        component: designContainerProject,
                        name: '项目流程设计',
                        children: [
                            { path: '', component: designDrawingProject, name: ' 设计' },
                            {
                                path: '/project/design/plan/:id', component: designPlanProject, name: ' 计划', children: [
                                    {
                                        path: '/project/design/plan/:id/add',
                                        component: designPlanAddProject,
                                        name: '项目创建流程执行计划'
                                    }
                                ]
                            },
                            {
                                path: '/project/design/executingHistory/:id',
                                component: executingHistoryProject,
                                name: ' 执行历史'
                            },
                            {
                                path: '/project/design/executingDetail/:id',
                                component: executingDetailProject,
                                name: ' 执行详细',
                                children: [
                                    {
                                        path: '/project/design/executingDetail/:id/exection/:jobId/info',
                                        component: executingDetailInfoProject,
                                        name: '项目详细信息'
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/exection/:jobId/outputs',
                                        component: executingOutPutsProject,
                                        name: '项目Outputs'
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/exection/:jobId/logInfo',
                                        component: executingLogInfoProject,
                                        name: '项目日志信息'
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/info',
                                        component: executingDetailInfoProject,
                                        name: '项目详细信息 '
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/outputs',
                                        component: executingOutPutsProject,
                                        name: '项目Outputs '
                                    },
                                    {
                                        path: '/project/design/executingDetail/:id/logInfo',
                                        component: executingLogInfoProject,
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
            { path: '/processconfig/manage', component: dataConfiguration, name: ' 配置管理' },
            {
                path: '/processconfig',
                component: configuration,
                name: '配置',
                iconCls: 'fa fa-gears nav',
                children: [
                    { path: '/processconfig/workflow-selector', component: configuration, name: ' 工作流选择器' },
                    { path: '/processconfig/dataflow-selector', component: configuration, name: ' 批处理选择器' },
                    { path: '/processconfig/dataflow-udf', component: configuration, name: ' 自定义函数' },
                    { path: '/processconfig/filter-class', component: configuration, name: ' 过滤器' },
                    { path: '/processconfig/jdbc-driver', component: configuration, name: ' 数据库驱动' },
                    { path: '/processconfig/step-define', component: configuration, name: ' 自定义节点' },
                ],
                redirect: '/processconfig',
            },
        ]
    },
    {
        path: '/ssjs',
        component: home,
        name: '实时计算',
        // hidden: true,
        iconCls: 'icon iconfont icon-ir-analyze nav',
        children: [
            {
                path: '/jobManage', component: jobManage, name: '作业管理', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/jobOperation', component: jobOperation, name: '作业运维', iconCls: 'fa fa-leaf nav'
            },
            {
                path: '/jobTemplate', component: jobTemplate, name: '作业模板', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/interactiveQuery', component: InteractiveQuery, name: '交互式查询', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/realtime/list/index', component: realtimeDesignList, name: '实时计算流程设计', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/realtime/list/tasklist', component: realtimeTaskList, name: '实时计算任务监控', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/realtime/list/control', component: realtimeControl, name: '实时计算数据监控', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/add/:id', component: addTemplate, name: '添加模板', iconCls: 'fa fa-calendar-o nav', hidden: true
            },
            {
                path: '/jobOperation/monitor', component: streamMonitor, name: 'stream任务监控', hidden: true,
                children: [
                    { path: '/jobOperation/streamMonitor/board', component: streamBoard, name: '概览' },
                    { path: '/jobOperation/streamMonitor/executerSchedule', component: streamExecuterSchedule, name: 'stream执行计划' },
                    { path: '/jobOperation/streamMonitor/jobDetail', component: streamJobDetail, name: 'stream任务详情' },
                    { path: '/jobOperation/streamMonitor/log', component: streamLog, name: '日志' },
                    { path: '/jobOperation/streamMonitor/output', component: streamOutput, name: '输出结果' },
                ]
            },
            // { path: '/jobManage/newjobDetail', component: newjobDescription, name: '详情',},
            {
                path: '/jobManage/jobDetail', component: jobDetail, name: '详情', hidden: true,
                children: [
                    { path: '/jobManage/jobDetail/description', component: jobDescription, name: '作业描述' },
                    // {path: '/jobManage/jobDetail/newdescription', component: newjobDescription, name: '作业描述'},
                    { path: '/jobManage/jobDetail/cepDesc', component: jobCepDesc, name: 'cep作业描述' },
                    { path: '/jobManage/jobDetail/configure', component: jobConfigure, name: '作业配置' },
                ]
            }
        ]
    },
    {
        path: '/ssjsnew',
        component: home,
        name: '实时计算 new',
        // hidden: true,
        iconCls: 'icon iconfont icon-ir-analyze nav',
        children: [
            {
                path: '/realtime/list', component: () => import('@views/realtime/list/index'), name: 'list', iconCls: 'fa fa-calendar-o nav'
            },
            {
                path: '/realtime/editor', component: () => import('@views/realtime/editor/index'), name: 'editor', iconCls: 'fa fa-calendar-o nav'
            },
        ]
    },
    {
        path: '/sjjk',
        component: home,
        name: '数据监控',
        iconCls: 'icon iconfont icon-ir-monitoring nav',
        children: [
            {
                path: '/hippo/index',
                component: hippoIndex,
                name: '运维管控',
                iconCls: 'fa fa-life-buoy nav',
                children: [
                    {
                        path: '/hippo/data',
                        component: hippoData,
                        name: '数据源',
                        iconCls: 'icon iconfont icon-ir-nav-close nav',
                        hidden: true,
                        children: [
                            { path: '/hippo/data/status', component: hippoDatastatusDraw, name: '状态统计图' },
                            { path: '/hippo/data/statuslist', component: hippoDatastatusList, name: '状态列表' },
                        ]
                    },

                    {
                        path: '/hippo/tasks',
                        component: hippoTasks,
                        name: '任务完成情况监控',
                        iconCls: 'icon iconfont icon-ir-nav-close nav',
                        hidden: true,
                        children: [
                            { path: '/hippo/tasks/jobanalysis', component: hippoTasksJobanalysis, name: '趋势分析' },
                            { path: '/hippo/tasks/history', component: hippoTasksHistory, name: '归类分析' },
                            { path: '/hippo/tasks/probability', component: hippoTasksProbability, name: '概率分析' }
                        ],
                        redirect: '/hippo/tasks/jobanalysis'
                    },
                    {
                        path: '/hippo/nodeMonitor',
                        component: hippoNodeMonitor,
                        name: '集群服务组件详情',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                    {
                        path: '/hippo/flink',
                        component: linkiframe,
                        name: 'flink',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                    {
                        path: '/hippo/flink_row_check',
                        component: flink_row_check,
                        name: 'flink_row_check',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                    {
                        path: '/hippo/flink_row_check_baobiao',
                        component: flink_row_check_baobiao,
                        name: 'flink_row_check_baobiao',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                    {
                        path: '/hippo/sink_row_check_null',
                        component: sink_row_check_null,
                        name: 'sink_row_check_null',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                    {
                        path: '/hippo/sink_row_check_null_baobiao',
                        component: sink_row_check_null_baobiao,
                        name: 'sink_row_check_null_baobiao',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                    {
                        path: '/hippo/sink_row_check_acc_baobiao',
                        component: sink_row_check_acc_baobiao,
                        name: 'sink_row_check_acc_baobiao',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },

                    //接入监控
                    {
                        path: '/hippo/WJInputServiceSize_H',
                        component: WJInputServiceSize_H,
                        name: 'WJInputServiceSize_H',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                    //计算过程监控
                    {
                        path: '/hippo/WJHandleServiceSize_H',
                        component: WJHandleServiceSize_H,
                        name: 'WJHandleServiceSize_H',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                    {
                        path: '/hippo/WJOutputServiceSize_H',
                        component: WJOutputServiceSize_H,
                        name: 'WJOutputServiceSize_H',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },

                    //全流程监控
                    {
                        path: '/hippo/WJServicewaveSize_H',
                        component: WJServicewaveSize_H,
                        name: 'WJServicewaveSize_H',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                    {
                        path: '/hippo/WJServicewaveRow_H',
                        component: WJServicewaveRow_H,
                        name: 'WJServicewaveRow_H',
                        iconCls: 'icon iconfont icon-ir-nav-close nav'
                    },
                ]
            },

            { path: '/hippo/taskWarnings', component: taskWarnings, name: '任务警告', iconCls: 'fa fa-line-chart nav' },
            { path: '/hippo/visualization', component: visualization, name: '监控可视化', iconCls: 'fa fa-line-chart nav' },
            { path: '/hippo/visit/', component: visit, name: '访问监控', iconCls: 'fa fa-line-chart nav' },
            {
                path: '/hippo/taskControl',
                component: taskControl,
                name: '任务监控',
                iconCls: 'fa fa-area-chart nav',
                children: [
                    {
                        path: '/hippo/taskControl',
                        component: taskControl,
                        name: ' 任务监控',
                        iconCls: 'fa fa-area-chart nav'
                    },
                    {
                        path: '/hippo/monitor',
                        component: hippoMonitorContainer,
                        name: '监控',
                        iconCls: 'icon iconfont icon-ir-nav-close nav',
                        hidden: true,
                        children: [
                            { path: '/hippo/monitor/RUNNING', component: hippoMonitorRunning, name: '运行中' },
                            { path: '/hippo/monitor/READY', component: hippoMonitorReady, name: '就绪' },
                            { path: '/hippo/monitor/SUCCEEDED', component: hippoMonitorSucceeded, name: '成功' },
                            { path: '/hippo/monitor/FAILED', component: hippoMonitorFailed, name: '失败' },
                            { path: '/hippo/monitor/KILLED', component: hippoMonitorKilled, name: '杀死' },
                            { path: '/hippo/monitor/TIMEOUT', component: hippoMonitorTimeout, name: '超时' },
                            { path: '/hippo/monitor/UNKNOWN', component: hippoMonitorUnknown, name: '未知' },
                        ],
                    },
                    // {
                    //     path: '/hippo/schedule',
                    //     component: hippoScheduleContainer,
                    //     name: '任务调度',
                    //     iconCls: 'icon iconfont icon-ir-nav-close nav',
                    //     children: [
                    //         {
                    //             path: '', component: hippoScheduleList, name: '计划',
                    //             children: [
                    //                 {path: '/hippo/schedule/add', component: hippoScheduleAdd, name: '创建计划'},
                    //                 {path: '/hippo/schedule/detail/:id', component: hippoScheduleAdd, name: '查看计划'}
                    //             ]
                    //         },
                    //         {path: '/hippo/execute', component: hippoExecuteList, name: '执行'},
                    //         {path: '/hippo/analyze', component: hippoAnalyzeList, name: '分析'}
                    //     ],
                    //     redirect: '/hippo/schedule',
                    // },
                    {
                        path: '/hippo/alarm',
                        component: hippoAlarm,
                        name: '监控告警',
                        iconCls: 'icon iconfont icon-ir-nav-close nav',
                        hidden: true,
                        children: [
                            { path: '/hippo/alarm/list', component: hippoAlarmList, name: '告警列表' },
                            {
                                path: '/hippo/alarm/rule', component: hippoAlarmRuleList, name: '规则列表',
                                children: [
                                    { path: '/hippo/alarm/rule/add', component: hippoAlarmRuleAdd, name: '创建告警规则' },
                                    { path: '/hippo/alarm/rule/:id', component: hippoAlarmRuleAdd, name: '查看告警规则' },
                                ]
                            },
                        ],
                        redirect: '/hippo/alarm/list',
                    },

                ],
                redirect: '/hippo/taskControl',
            },
            {
                path: '/hippo/statistics',
                component: hiippoStatistics,
                name: '数据统计',
                iconCls: 'icon iconfont icon-ir-nav-close nav'
            },
            {
                path: '/hippo/schedule',
                component: hippoScheduleContainer,
                name: '任务调度',
                iconCls: 'icon iconfont icon-ir-nav-close nav',
                children: [
                    { path: '/hippo/analyze', component: hippoAnalyzeList, name: '分析' },
                    { path: '/hippo/hippoScheduleIndex', component: hippoScheduleIndex, name: '计划' },
                    { path: '/hippo/hippoExecuteIndex', component: hippoExecuteIndex, name: '执行' }
                ],
                redirect: '/hippo/analyze',
            },
            {path: '/hippo/service', component: service, name: '后台服务'},
            {path: '/hippo/execute', component: hippoExecuteList, name: '执行'},
            {
                path: '/hippoScheduleList', component: hippoScheduleList, name: 'hippoScheduleList',
                children: [
                    { path: '/hippo/schedule/add', component: hippoScheduleAdd, name: '创建计划' },
                    { path: '/hippo/schedule/detail/:id', component: hippoScheduleAdd, name: '查看计划' }
                ]
            },
        ]
    },
    {
        path: '/xtpz',
        component: home,
        name: '系统配置',
        iconCls: 'icon iconfont icon-ir-attestation nav',
        children: [
            { path: '/user', component: user, name: '用户', iconCls: 'fa fa-user-circle nav' },
            { path: '/user/add', component: userAdd, name: '创建用户', iconCls: 'fa fa-user-o', hidden: true },
            { path: '/user/:id', component: userAdd, name: '查看用户', iconCls: 'fa fa-user-o', hidden: true },
            {
                path: '/permission',
                component: permission,
                name: '权限',
                iconCls: 'fa fa-key nav',
                hidden: showPermisssinItem
            },
            {
                path: '/processconfig/new/:type',
                component: processConfigAdd,
                name: '配置新建',
                iconCls: 'icon iconfont icon-ir-nav-close nav',
                hidden: true
            },
            {
                path: '/processconfig/:id',
                component: processConfigAdd,
                name: '配置查看',
                iconCls: 'icon iconfont icon-ir-nav-close nav',
                hidden: true
            }
        ],
        hidden: showGriffin
    },
    {
        path: '/',
        component: home,
        name: '权限管理',
        iconCls: 'icon iconfont icon-ir-attestation nav',
        children: [
            ...roleManagement,
            ...userManagement,
            ...rolePermission,
            ...logAudit,
            ...cluster
        ]
    },
    {
        path: '/',
        component: home,
        name: '关于我们',
        iconCls: 'icon iconfont icon-ir-attestation nav',
        children: [
            ...aboutUs
        ]
    },
    {
        path: '/',
        component: home,
        name: '质量分析',
        iconCls: 'icon iconfont icon-ir-attestation nav',
        children: [
            ...qiang_qualityAnalysis
        ]
    },
    {
        path: '/',
        component: tenantHome,
        name: '租户',
        iconCls: 'icon iconfont icon-ir-integration nav',//图标样式class
        children: [
            {
                path: '/tenants',
                component: tenants,
                name: '列表', iconCls: 'icon iconfont icon-ir-nav-close nav'
            },
            { path: '/tenants/add', component: tenantAdd, name: '创建租户', iconCls: 'fa fa-user-o', hidden: true },
            { path: '/tenants/:id', component: tenantAdd, name: '查看租户', iconCls: 'fa fa-user-o', hidden: true },
        ],
        hidden: true

    },
    {
        path: '/license/activate',
        component: license,
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
