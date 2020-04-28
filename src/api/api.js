import axios from 'axios';
import congfigData from '@config/data/index.json'
let base = '/api';
let baseWoven = '/api/woven';
let oss = '/api/oss'
import _ from "lodash";
import {encrypt, decrypt, addBase64} from '@components/encryption/aes.js'
import {addValidateBase, filterBaseStepsOutput, filterBaseFlow} from '@components/encryption/filterstep.js'

/**
 * ------------------------------------------------------------------
 * 接口（All）
 * ------------------------------------------------------------------
 */
//登录
export const requestLogin = params => {
    return axios.post(`${base}/auth/login`, params).then(res => res);
};
export const refresh = params => {
    return axios.get(`${base}/auth/refresh?token=${params}`).then(res => res);
};
export const revoke = () => {
    return axios.post(`${base}/auth/revoke`).then(res => res);
};

/**
 * 数据治理
 * ------------------------------------------------------------------
 */

// nav1 质量分析

//nav1-1 分析模板
//list
export const atgetDate = params => {
    return axios.post(`${baseWoven}/zmod/query`, params).then(res => res.data);
};
//del
export const atdelTbaleDate = params => {
    return axios.post(`${baseWoven}/zmod/removeList`, params).then(res => res.data);
};
//add
export const addTbaleDate = params => {
    return axios.post(`${baseWoven}/zmod`, params).then(res => res.data);
};

// export const addflowTbaleDate = params => { return axios.post(`${baseWoven}/zmod/createFlow`, params).then(res => res.data); };
export const addflowTbaleDate = params => {
    return axios.post(`${baseWoven}` + params.url, params.data).then(res => res.data);
};
//runRow
export const runtimeProperties = params => {
    return axios.get(`${base}/flows/${params}/runtime-properties`).then(res => res.data);
};

// 根据 结果路径 返回  datasetId
export const getPathParams = (name) => {
    return axios.get(`${base}/datasets/${name}/path`,).then(res => res.data);
};

//获取模板相详情
export const tempDetail = (modelId) => {
    return axios.get(`${baseWoven}/zmod/${modelId}`).then(res => res.data)
}


//编辑模板(新)
export const editTmp = (id, data) => {
    return axios.put(`${baseWoven}/zmod/${id}`, data).then(res => res.data)
}
//保存编辑规则(新)
export const saveNewRule = (id, data) => {
    return axios.post(`${baseWoven}/zmodrules/${id}`, data).then(res => res.data)
}

export const saveEditRule = (modeID, ruleID, data) => {
    return axios.put(`${baseWoven}/zmodrules/${modeID}/${ruleID}`, data).then(res => res.data);
}

//分析模板---》点击表格中编辑规则---》规则列表---》点击某条规则---》进入查看模板--规则绑定页面
export const ruleBind = (modeID, ruleID) => {
    return axios.get(`${baseWoven}/zmodrules/${modeID}/${ruleID}`,).then(res => res.data);
}

//分析模板--》编辑规则--》规则列表---》规则删除
export const ruleDelete = (modelID, data) => {
    return axios.post(`${baseWoven}/zmodrules/${modelID}/detailslist/removeList`, data).then(res => res.data)
}

//分析模板--》编辑规则--》规则列表---》规则启用
export const ruleEnable = (modelID, data) => {
    return axios.post(`${baseWoven}/zmodrules/${modelID}/detailslist/enable`, data).then(res => res.data)
}

//分析模板--》编辑规则--》规则列表---》规则停止
export const ruleStop = (modelID, data) => {
    return axios.post(`${baseWoven}/zmodrules/${modelID}/detailslist/disable`, data).then(res => res.data)
}


//获取选择字段列表(新)
export const fieldsList = (name) => {
    return axios.get(`${baseWoven}/zmod/schema/${name}`).then(res => res.data)
}

//nav1-2 分析规则
//add
export const addRule = params => {
    return axios.post(`${baseWoven}/rule`, params).then(res => res.data)
}
//update
export const updateRule = (id, data) => {
    return axios.put(`${baseWoven}/rule/${id}`, data).then(res => res.data)
}
//list
export const argetDate = params => {
    return axios.post(`${baseWoven}/rule/query`, params).then(res => res.data);
};
//del
export const ardelTbaleDate = params => {
    return axios.post(`${baseWoven}/rule/removeList`, params).then(res => res.data);
};

//编辑规则（点击表格中名称）
export const ruleForm = (id) => {
    return axios.get(`${baseWoven}/rule/${id}`).then(res => res.data)
}


//从结果页面进入内建规则编辑页
export const ruleFormBuilt = (id) => {
    return axios.get(`${baseWoven}/rule/builtin/${id}`).then(res => res.data)
}


//nav1-3 任务执行信息
//list(修改)
export const zdafgetDate = params => {
    return axios.post(`${baseWoven}/zdaf/query`, params).then(res => res.data);
};
//del
export const zdafdelTbaleDate = params => {
    return axios.post(`${baseWoven}/zdaf/all/removeList`, params).then(res => res.data);
};

//查询任务执行信息(新)
export const taskCarry = (modelId, id) => {
    return axios.get(`${baseWoven}/zdaf/${modelId}/${id}`).then(res => res.data)
}

//结果中的查看
export const seeData = (id) => {
    return axios.get(`${base}/datasets/${id}/check`).then(res => res.data)
}

export const formHeadr = (id) => {
    return axios.get(`${base}/datasets/${id}/schema`).then(res => res.data)
}
//下载
//export const downloadData=(id)=>{return axios.get(`${base}/datasets/${id}/download`).then(res=>res.data)}

export const downloadData = (id, params) => {
    var iframe;
    iframe = document.getElementById("hiddenDownloader");
    if (iframe == null) {
        iframe = document.createElement('iframe');
        iframe.id = "hiddenDownloader";
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
    }
    // console.log('params', params)
    //console.log('params', $.param(params))
    var srcPath = `${base}/datasets/${id}/download?X-AUTH-TOKEN=${sessionStorage["x-auth-token"]}` + params
    iframe.src = srcPath
};


//nav1-4 评估结果统计
//list
export const erallgetDate = params => {
    return axios.get(`${baseWoven}/zdaf/stats/qualityRank,badRatio/Total`, {params: params}).then(res => res.data);
};

//新增统计方式(新)
export const dataSta = (selVal, data) => {
    return axios.post(`${baseWoven}/zdaf/stats/qualityRank,badRatio/${selVal}`, data).then(res => res.data);
};

//nav1-5 规则模板
//list
export const rulesgetDate = (rulesid, params) => {
    return axios.post(`${baseWoven}/zmodrules/${rulesid}/detailslist`, params).then(res => res.data);
};

//nav3 数据目录
//settings
export const settings = params => {
    return axios.get(`${baseWoven}/statistics/settings`, {params: params}).then(res => res.data);
};
export const resourceChildren = params => {
    return axios.get(`${baseWoven}/resource/children`, {params: params}).then(res => res.data);
};

//nav3 共享权限
//list
export const spgetDate = params => {
    return axios.post(`${baseWoven}/open/users`, params).then(res => res.data);
};
//del
export const spdelTbaleDate = params => {
    return axios.post(`${baseWoven}/open/user/remove`, params).then(res => res.data);
};

//nav4 共享接口
//list
export const sdgetDate = params => {
    return axios.post(`${baseWoven}/open/endpoints`, params).then(res => res.data);
};
//del
export const sddelTbaleDate = params => {
    return axios.post(`${baseWoven}/open/endpoint/remove`, params).then(res => res.data);
};


/**
 * 数据集成
 * ------------------------------------------------------------------
 */

// nav1 资源目录
// 查询tree 全部数据
export const resDirTree = (params) => {
    return axios.get(`${baseWoven}/resource/resDirTree`, {params: params}).then(res => res.data);
};
export const getRoots = params => {
    return axios.get(`${baseWoven}/resource/roots`, {params: params}).then(res => res.data);
};
// get resource
// export const getResource = id => { return axios.get(`${baseWoven}/resource/${id}`, ).then(res => res.data); };
// put resource
export const putResource = (data) => {
    return axios.put(`${baseWoven}/resource`, data).then(res => res.data);
};
// post resource
export const postResource = (data) => {
    return axios.post(`${baseWoven}/resource`, data).then(res => res.data);
};
//usedContent schema
export const usedContentSchema = (id, limit, offset) => {
    return axios.get(`${baseWoven}/resource/usedcontent/${id}?limit=${limit}&offset=${offset}`,).then(res => res.data);
};
// delete resource
export const deleteResource = (id) => {
    return axios.delete(`${baseWoven}/resource/${id}`, id).then(res => res.data);
};
// move Dir
export const moveResource = (dirId, type, ids) => {
    return axios.post(`${baseWoven}/resource/move?dirId=${dirId}&type=${type}`, ids).then(res => res.data);
};
// sort Dir
export const sortTree = (children) => {
    return axios.post(`${baseWoven}/resource/sort`, children).then(res => res.data);
};
//根据目录id获取目录层级结构
export const getResourcePath = (id) => {
    return axios.get(`${baseWoven}/resource/path/${id}`).then(res => res.data);
};

// get datasource
export const getDatasource = id => {
    return axios.get(`${baseWoven}/datasource/${id}`,).then(res => res.data);
};
// get schema
export const getSchema = id => {
    return axios.get(`${base}/schemas/${id}`,).then(res => res.data);
};
// get version schema
export const getVersionSchema = (oid, version) => {
    return axios.get(`${base}/schemas/${oid}/${version}`,).then(res => res.data);
};
// get version schema history
export const getHistorySchema = (oid) => {
    return axios.get(`${base}/schemas/history/${oid}`,).then(res => res.data);
};
// get dataset
export const getDataset = (id, tenantId) => {
    return axios.get(`${base}/datasets/${id}?tenant=${tenantId}`,).then(res => {
        if (res.data.storageConfigurations.password) {
            res.data.storageConfigurations.password = decrypt(res.data.storageConfigurations.password)
        }
        return res.data
    });
};
// get schema version
export const getSchemaVersion = (oid,version) => { return axios.get(`${base}/schemas/${oid}/${version}`, ).then(res => res.data); };
//get schema version number
export const getSchemalength = (oid) => { return axios.get(`${base}/schemas/history/${oid}`, ).then(res => res.data); };


//post Preview Dataset
// export const postPreviewDataset = (id, data) => { return axios.post(`${base}/datasets/${id}/preview?rows=50`, data ).then(res => res.data); };
export const postPreviewDataset = (id, data, rows) => {
    if (data.storageConfigurations.password && data.storageConfigurations.password != 'undefined') {
        data.storageConfigurations.password = encrypt(data.storageConfigurations.password)
    }
    if (data.storageConfigurations.sql) {
        data.storageConfigurations.sql = addBase64(data.storageConfigurations.sql)
    }
    let row = congfigData[process.env.BASE_PROJECT].systemName === 'BeiRuan' ?  3 : (rows ? rows :  50)
    return axios.post(`${base}/datasets/${id}/previewinit?rows=${row}`, data).then(res => res.data);
};
// 预览Dataset(datasetId不存在)
export const previewinit = (id, tenantId, rows) => {
    let row = congfigData[process.env.BASE_PROJECT].systemName === 'BeiRuan' ?  3 : (rows ? rows :  50)
    return axios.get(`${base}/datasets/${id}/previewinit?tenant=${tenantId}&rows=${row}`,).then(res => res.data);
};

export const previewresult = (id, tenantId, statementId,clusterId) => {
    return axios.get(`${base}/datasets/${id}/previewresult?tenant=${tenantId}&statementId=${statementId}&clusterId=${clusterId}`,).then(res => res.data);
};

// dataset execute Data Analysis
export const executeDataAnalysis = (datasetId, data) => {
    return axios.post(`${base}/datasets/${datasetId}/analyze`, data).then(res => res.data);
};

// dataset get Data Analysis
export const getDataAnalysis = (datasetId, statementId, clusterId) => {
    return axios.get(`${base}/datasets/${datasetId}/analyzeResult?statementId=${statementId}&clusterId=${clusterId}`,).then(res => res.data);
};

// get standards
export const getStandard = (id, tenantId) => {
    return axios.get(`${baseWoven}/standardbd/${id}?tenant=${tenantId}`,).then(res => res.data);
};
// get standards arr
export const getStandards = (parameter) => {
    return axios.post(`${baseWoven}/standards/query`, parameter).then(res => res.data);
};

//post datasource
export const postDatasource = data => {
    if (data.attributes.password) {
        data.attributes.password = encrypt(data.attributes.password)
    }
    return axios.post(`${baseWoven}/datasource`, data).then(res => res.data);
};
//post schema
export const postSchema = data => {
    return axios.post(`${base}/schemas`, data).then(res => res.data);
};
//post schema import
export const importSchema = data => {
    return axios.post(`${base}/schemas/import`, data).then(res => res.data);
};
// post dataset
export const postDataset = data => {
    if (data.storageConfigurations.password) {
        data.storageConfigurations.password = encrypt(data.storageConfigurations.password)
    }
    if (data.storageConfigurations.sql) {
        data.storageConfigurations.sql = addBase64(data.storageConfigurations.sql)
    }
    return axios.post(`${base}/datasets`, data).then(res => {
        res.data
    })
}
//post standard
export const postStandard = data => {
    return axios.post(`${baseWoven}/standardbd`, data).then(res => res.data);
};

export const postPreviewresult = (id, statementId,clusterId, data) => {
    if (data.storageConfigurations.sql) {
        data.storageConfigurations.sql = addBase64(data.storageConfigurations.sql)
    }
    return axios.post(`${base}/datasets/${id}/previewresult?statementId=${statementId}&clusterId=${clusterId}`, data).then(res => res.data);
};
//put datasource
export const putDatasource = (id, data) => {
    if (data.attributes.password) {
        data.attributes.password = encrypt(data.attributes.password)
    }
    return axios.put(`${baseWoven}/datasource/${id}`, data).then(res => res.data);
};
//put schema
export const putSchema = (id, data) => {
    return axios.put(`${base}/schemas/${id}`, data).then(res => res.data);
};
// put dataset
export const putDataset = (id, data) => {
    if (data.storageConfigurations.password) {
        data.storageConfigurations.password = encrypt(data.storageConfigurations.password)
    }
    if (data.storageConfigurations.sql) {
        data.storageConfigurations.sql = addBase64(data.storageConfigurations.sql)
    }
    return axios.put(`${base}/datasets/${id}`, data).then(res => res.data)
}
//put standard
export const putStandard = (id, data) => {
    return axios.put(`${baseWoven}/standardbd/${id}`, data).then(res => res.data);
};
//delete standard 
export const deleteStandardId=(id)=>{return axios.delete(`${baseWoven}/standards/${id}`).then(res=>res.data)}
//editor standard
export const editorStandard = (id,data)=>{return axios.put(`${baseWoven}/standards/${id}`,data).then(res=>res.data)}
//creat standard
export const creatStandard =(data)=>{return axios.post(`${baseWoven}/standards/create`,data).then(res=>res.data)}

//delete datasource
export const deleteDatasource = data => {
    return axios.post(`${baseWoven}/datasource/removeList`, data).then(res => res.data);
};
//delete schema
export const deleteSchema = data => {
    return axios.post(`${base}/schemas/removeList`, data).then(res => res.data);
};
//delete dataset
export const deleteDataset = (flag, ids) => {
    flag = flag == undefined ? false : flag
    return axios.post(`${base}/datasets/removeList/${flag}`, ids ).then(res => res.data);
};
//delete standard
export const deleteStandard = data => {
    return axios.post(`${baseWoven}/standardbd/removeList`, data).then(res => res.data);
};
//datasource DB Connection
export const DBConnection = data => {
    if (data.attributes.password) {
        data.attributes.password = encrypt(data.attributes.password)
    }
    return axios.post(`${baseWoven}/datasource/jdbc/try`, data).then(res => res.data);
};

// schemal 连线
export const analysisPost = data => {
    return axios.post(`${baseWoven}/qaassist/schemalink`, data).then(res => res.data);
};
export const qaassist = data => {
    return axios.post(`${baseWoven}/qaassist`, data).then(res => res.data);
};
//查找关系
export const relation = data => {
    return axios.get(`${base}/lineage/${data}/datasetName`).then(res => res.data);
};
export const relationField = (name, data) => {
    return axios.post(`${base}/lineage/${name}/fieldslineagedatasetname`, data).then(res => res.data);
};

//nav2  数据导入

// get tasks
export const getSynchronizationTaskList = params => {
    return axios.post(`${baseWoven}/synchronizations/dataSyncJobs/query`, params).then(res => res.data);
};
// task execute
export const getSynchronizationTaskExecuteList = (synchronizationId, params) => {
    return axios.post(`${baseWoven}/collectors/${synchronizationId}/tasks`, params).then(res => res.data);
};
// task add test regex_check
export const taskRegexCheck = (type, params) => {
    return axios.post(`${baseWoven}/tasks/regex_check?operateType=${type}`, params).then(res => res.data);
};
// previewData
export const taskPreviewData = (id, sql, params) => {
    sql = addBase64(sql)
    return axios.get(`${baseWoven}/datasource/table/select?id=${id}&sql=${sql}&params=${params}`).then(res => res.data);
};
// step1 get tables
export const getTables = (params) => {
    return axios.get(`${baseWoven}/datasource/table/page`, {params: params}).then(res => res.data);
};
//step1 get collector tables
export const getCollectorTable = (collectorID, id, para) => {
    return axios.get(`${baseWoven}/collectors/${collectorID}/resource/${id}/tables`, {params: para}).then(res => res.data);
};
// step1 get columns
export const getColumns = (id, table) => {
    return axios.get(`${baseWoven}/datasource/table/columns?id=${id}&table=${table}`).then(res => res.data);
};
// step1 get Collector columns
export const getCollectorColumns = (id, collectorId, table) => {
    return axios.get(`${baseWoven}/collectors/${collectorId}/resource/${id}/${table}/columns`).then(res => res.data);
};
//step4 get partitionKey text
export const getPartitionKeyText = (format) => {
    return axios.get(`${baseWoven}/tasks/date_format?pattern=${format}`).then(res => res.data);
};
// 文件导入
// get tasks
export const getFileSynchronizationTaskList = params => {
    return axios.post(`${baseWoven}/synchronizations/fileSyncJobs/query`, params).then(res => res.data);
};
// 对象导入
// get object task
export const getObjectSynchronizationTaskList = params => {
    return axios.post(`${baseWoven}/synchronizations/objectSyncJobs/query`, params).then(res => res.data);
};
// post backend/create
export const backendCreate = params => {
    return axios.post(`${base}/backend/create`, params).then(res => res.data);
};
export const backendList = params =>{
    return axios.post(`${base}/backend/query`,params).then(res=>res.data)
}
export const startbackendService = params=>{
    return axios.post(`${base}/backend/enable`,params).then(res=>res.data)
}
export const stopbackendService = params=>{
    return axios.post(`${base}/backend/disable`,params).then(res=>res.data)
}
export const delbackendService = params=>{
    return axios.post(`${base}/backend/removeList`,params).then(res=>res.data)
}
//backend_result
export const backendQuery =(params,name)=>{
    return axios.post(`${base}/logs/backend_result/content/${name}`,params).then(res=>res.data)
}
//nav3  采集器

//nav3-1 采集器
// list
export const getCollectorList = params => {
    return axios.post(`${baseWoven}/collectors/query`, params).then(res => res.data);
};
// create
export const createCollector = params => {
    params.secretKey = encrypt(params.secretKey)
    return axios.post(`${baseWoven}/collectors/submit`, params).then(res => res.data)
};
// delete
export const deleteCollectors = params => {
    return axios.post(`${baseWoven}/collectors/removeList`, params).then(res => res.data);
};
// updata
export const updataCollector = (id, params) => {
    return axios.post(`${baseWoven}/collectors/` + id + `/upload`, params).then(res => res.data);
};
//nav3-1-1  采集器详细信息
// get
export const getCollectorDetialView = params => {
    return axios.get(`${baseWoven}/collectors/${params}`).then(res => res.data);
};
// log
export const getCollectorDetialLog = id => {
    return axios.get(`${baseWoven}/collectors/${id}/logs`).then(res => res.data);
};
// get meta data synchronization log
export const getMateDataSynLog = id => {
    return axios.get(`${baseWoven}/tasks/pull/${id}/logs`).then(res => res.data);
};
// get meta data synchronization Progress
export const getMateDataSynProgress = id => {
    return axios.get(`${baseWoven}/tasks/${id}/progress`).then(res => res.data);
};
//nav3-1-3 采集器资源目录
// get
export const getCollectorDirList = (params) => {
    return axios.post(`${baseWoven}/datasource/query`, params).then(res => res.data);
};
//progress
export const getTaskProgress = (taskId) => {
    return axios.get(`${baseWoven}/tasks/${taskId}/progress`).then(res => res.data);
};
// DB link meta
export const DBLinkTest = (collectorId, params) => {
    if (params.password) {
        params.password = encrypt(params.password)
        params.selectSQL = addBase64(params.selectSQL)
    }
    return axios.post(`${baseWoven}/collectors/${collectorId}/datasource/test`, params).then(res => res.data);
};
// meta fetch
export const metaFeth = (collectorId, params) => {
    if (params.dataStore.password) {
        params.dataSource.password = encrypt(params.dataSource.password)
    }
    if (params.dataStore.selectSQL) {
        params.dataStore.selectSQL = addBase64(form.dataStore.selectSQL)
    }
    return axios.post(`${baseWoven}/collectors/${collectorId}/schema/fetch`, params).then(res => res.data);
};
// colletcor taskList filter for datasource getDatasourcenameList
export const datasourceList = (collectorId) => {
    return axios.get(`${baseWoven}/collectors/${collectorId}/datasourceList`).then(res => res.data);
};

// nav3-2  导入任务
export const getCollectorIds = () => {
    return axios.get(`${baseWoven}/collectors/names`).then(res => res.data);
};

// task for (synchronization,import and collector)

// List
export const getCollectorTaskList = (id, params) => {
    return axios.post(`${baseWoven}/collectors/${id}/jobs`, params).then(res => res.data);
};
// get
export const getTaskJson = id => {
    return axios.get(`${baseWoven}/collectors/${id}/taskJson`).then(res => res.data);
};
// name 重复校验
export const taskNameRule = (collecterId, taskName, taskId) => {
    return axios.get(`${baseWoven}/tasks/name_check?collecterId=${collecterId}&taskName=${taskName}&taskId=${taskId}`).then(res => res.data);
};
// post synchronization Task
export const postSynchronizationTask = (data) => {
    data.dataSource.selectSQL ? data.dataSource.selectSQL = addBase64(data.dataSource.selectSQL):''
    return axios.post(`${baseWoven}/synchronizations/submit`, data, {headers: {'Content-Type': 'application/json'}}).then(res => res.data);
};
//post Collector Task
export const postCollectorTask = (collectorId, data) => {
    return axios.post(`${baseWoven}/synchronizations/submit?sourceId=${collectorId}`, data).then(res => res.data);
};
//edit Collector Task
export const editSynchronizationTask = (jobId, data) => {
    data.dataSource.selectSQL ? data.dataSource.selectSQL = addBase64(data.dataSource.selectSQL):''
    return axios.post(`${baseWoven}/synchronizations/edit?jobId=${jobId}`, data).then(res => res.data);
};
//json提交数据导入任务
export const postCollectorTaskJson = (collectorId, data) => {
    return axios.post(`${baseWoven}/synchronizations/submit?sourceId=${collectorId}`, data, {headers: {'Content-Type': 'application/json'}}).then(res => res.data);
};
//采集器验证字段是否变化
export const postCollectorCheck = (collectorId, data) => {
    return axios.post(`${baseWoven}/collectors/${collectorId}/datasource/columns/check`, data, {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(res => res.data);
};
// delete
export const deleteTasks = params => {
    return axios.post(`${baseWoven}/synchronizations/removeList`, params).then(res => res.data);
};
// start Tasks
export const startTasks = params => {
    return axios.post(`${baseWoven}/synchronizations/executes`, params).then(res => res.data);
};
// stop
export const stopTasks = params => {
    return axios.post(`${baseWoven}/collectors/stopList`, params).then(res => res.data);
};
// execute stop
export const stopTaskExecute = (collectorId, params) => {
    return axios.post(`${baseWoven}/collectors/${collectorId}/stopTaskList`, params).then(res => res.data);
};
// previewObject
export const previewObject = (id, sql, params) => {
    sql = addBase64(sql)
    return axios.get(`${baseWoven}/resource/table/select?id=${id}&sql=${sql}&params=${params}`,).then(res => res.data);
};
// previewObjectCollector
export const previewObjectCollector = (collectorId, id, sql, params) => {
    sql = addBase64(sql)
    return axios.get(`${baseWoven}/collectors/table/select?collecterId=${collectorId}&id=${id}&sql=${sql}&params=${params}`,).then(res => res.data);
};
// previewDataset
export const previewDataset = (id, params) => {
    return axios.get(`${base}/datasets/${id}/preview`, {params: params}).then(res => res.data);
};
// job log
export const getTaskExecuteJobLog = (id, type, start, limit, desc) => {
    return axios.get(`${base}/logs/sync_task_log/${id}/${type}?start=${start}&limit=${limit}&desc=${desc}`).then(res => res.data);
};

export const getTaskExecuteMeterLog = (params) => {
    return axios.post(`${base}/logs/sync_task_log/meter/${'20703d55-4180-465f-9dd6-920809483391'}?start=${params.start}&limit=${params.limit}&desc=${params.desc}&end=${params.end}`).then(res => res.data);
};

// 查询任务的状态
export const getTasksStatus = (id, end) => {
    return axios.get(`${baseWoven}/tasks/${'20703d55-4180-465f-9dd6-920809483391'}?tenant=${'db31d4a1-9a22-4b7e-9d73-22b5137ceb69'}`).then(res => res.data);
};

// 获取数据监控 趋势分析数据
export const getTaskJobanalysis = params => {
    return axios.post(`${base}/jobs/execution/stats`, params).then(res => res.data);
};

// 文件管理
export const getFileList = params => {
    return axios.get(`${oss}/file?path=` + params).then(res => res.data);
};
// make dir
export const makeDir = params => {
    return axios.get(`${oss}/file/mkdir?parentPath=` + params.parentPath + '&name=' + params.name).then(res => res.data);
};
// del file
export const delDir = params => {
    return axios.post(`${oss}/file/remove`, params).then(res => res.data)
};
//setup
export const setUpOss = params => {
    return axios.get(`${baseWoven}/setup/oss`).then(res => res.data);
};
//has permission
export const hasPermission = params => {
    return axios.get(`${oss}/file/permission?path=` + params).then(res => res.data)
}
//download
export const fileDownload = params => {
    return axios.post(`${oss}/file/_download`, params).then(res => res.data)
}

/*
 * 权限管理
 * ------------------------------------------------------------------
 */
//权限管理接口
export const permissionsList = params => {
    return axios.post(`${baseWoven}/permissions/query`, params).then(res => res.data);
};
export const auditlogsList = params => {
    return axios.get(`${baseWoven}/auditlogs`, {params: params}).then(res => res.data);
};
export const userList = params => {
    return axios.post(`${baseWoven}/users/query`, params).then(res => res.data);
};
export const userDetail = params => {
    return axios.get(`${baseWoven}/users/${params}`, params).then(res => res.data);
};
export const addUser = params => {
    return axios.post(`${baseWoven}/users`, params).then(res => res.data);
};
export const updateUser = params => {
    return axios.put(`${baseWoven}/users/${params.id}`, params).then(res => res.data);
};
export const updateUserPassword = (id, params) => {
    return axios.post(`${base}/user/changePwd`, params).then(res => res.data);
};

export const delUser = params => {
    return axios.post(`${baseWoven}/users/removeList`, params).then(res => res.data)
};
export const enableUser = params => {
    return axios.post(`${baseWoven}/users/enable`, params).then(res => res.data)
};
export const disableUser = params => {
    return axios.post(`${baseWoven}/users/disable`, params).then(res => res.data)
};
// 获取最大cpu   // 获取最大资源队列
export const tntQueuesInfo = params => {
    return axios.get(`${baseWoven}/yarnrs/queuesInfo`, params).then(res => res.data)
};
// 获取当前租户所有的队列列表
export const tntQueuesInfoCurrent = params => {
    return axios.get(`${baseWoven}/yarnrs/tntQueuesInfo`, params).then(res => res.data)
};
// 租户
export const addTenant = params => {
    return axios.post(`${base}/tenant/save`, params).then(res => res.data);
};
export const delTenant = params => {
    return axios.post(`${baseWoven}/tenants/removeList`, params).then(res => res.data)
};
export const tenantList = params => {
    return axios.post(`${base}/tenant/query`, params).then(res => res.data);
};
export const tenantDetail = params => {
    return axios.post(`${base}/tenant/${params}`).then(res => res.data);
};
export const updateTenant = params => {
    return axios.put(`${base}/tenant/${params.id}`, params).then(res => res.data);
};
export const enableTenant = params => {
    return axios.post(`${base}/tenant/enable`, params).then(res => res.data)
};
export const disableTenant = params => {
    return axios.post(`${base}/tenant/disable`, params).then(res => res.data)
};
/**
 * 数据分析
 * ------------------------------------------------------------------
 */
//流程测试
export const testFlow = (boolean, params) => {
    params = filterBaseFlow(params)
    return axios.post(`${base}/flows/try/init?execution=` + boolean, params).then(res => res.data);
};
export const testFlowStatementid = (statementId,clusterId) => {
    return axios.get(`${base}/flows/try/result?statementId=${statementId}&clusterId=${clusterId}`).then(res => res.data)
};
// nav1 流程管理
//list
export const designTableList = params => {
    return axios.post(`${base}/flows/query`, params).then(res => res.data);
};
//add
export const addFlow = params => {
    params = filterBaseFlow(params)
    return axios.post(`${base}/flows/create`, params).then(res => res.data);
};
//delete
export const delFlow = ids => {
    return axios.post(`${base}/flows/removeList`, ids).then(res => res.data)
};
//export
// export const exportFlow = (withDependencies,params) => {return axios.post(`${base}/flows/export?withDependencies=${withDependencies}&X-AUTH-TOKEN=${sessionStorage["x-auth-token"]}`, params,{headers: {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'}}).then(res => res.data); };
export const exportFlow = (withDependencies, params) => {
    var iframe;
    iframe = document.getElementById("hiddenDownloader");
    if (iframe == null) {
        iframe = document.createElement('iframe');
        iframe.id = "hiddenDownloader";
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
    }
    var srcPath = `${base}/flows/export?withDependencies=${withDependencies}&X-AUTH-TOKEN=${sessionStorage["x-auth-token"]}` + params
    iframe.src = srcPath
};
export const exportDefine = (exportStatus, params, fileTypes) => {
    var iframe;
    iframe = document.getElementById("hiddenDownloader");
    if (iframe == null) {
        iframe = document.createElement('iframe');
        iframe.id = "hiddenDownloader";
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
    }
    var srcPath = `${base}/processconfigs/export?exportAll=${exportStatus}&X-AUTH-TOKEN=${sessionStorage["x-auth-token"]}&ids = ${params}&fileTypes=${fileTypes}`
    iframe.src = srcPath
};
// upload
export const uploadFlow = (params) => {
    return axios.post(`${base}/mis/upload`, params).then(res => res.data);
};
// import project flow
export const importFlowPro = (projectId, params) => {
    return axios.post(`${base}/mis/import?project=${projectId}`, params).then(res => res.data);
};
// import flow
export const importFlow = (params) => {
    return axios.post(`${base}/mis/import`, params).then(res => res.data);
};
// nodeSet output
export const outputDataFlow = (type, params) => {
    return axios.post(`${base}/steps/output/fields/${type}`, params).then(res => res.data);
};
// nodeSet outputInit
export const outputInit = (params) => {
    params = filterBaseStepsOutput(params)
    return axios.post(`${base}/steps/output/fields/init`, params).then(res => res.data);
};
// nodeSet outputresult
export const outputresult = (statementId, clusterId) => {
    return axios.get(`${base}/steps/output/fields/result/?statementId=${statementId}&clusterId=${clusterId}`).then(res => res.data);
};
// nodeSet output === error
export const errorOutputDataFlow = (id, params) => {
    if(params.otherConfigurations.validationRules){
        params.otherConfigurations.validationRules = addValidateBase(JSON.parse(JSON.stringify(params.otherConfigurations.validationRules)))
    }
    
    return axios.post(`${base}/steps/output/fields/init/?branch=${id}`, params).then(res => res.data);
};
// nodeSet submit
export const submitDesign = (flowtype, params) => {
    return axios.post(`${base}/steps/validate/${flowtype}`, params).then(res => res.data);
};
//step validateinit
export const validateinit = (flowtype, params) => {
    params = filterBaseStepsOutput(params)
    return axios.post(`${base}/steps/validateinit/${flowtype}`, params).then(res => res.data)
};
// step 轮询Id
export const validateresult = (flowtype, statementId, clusterId) => {
    return axios.get(`${base}/steps/validateresult/${flowtype}?statementId=${statementId}&clusterId=${clusterId}`).then(res => res.data);
};
//sqlsource  输出字段
export const parseinit = (flowtype, params) => {
    params = filterBaseStepsOutput(params)
    return axios.post(`${base}/steps/sql/parseinit/${flowtype}`, params).then(res => res.data)
}
export const parseresult = (statementId,clusterId) => {
    return axios.get(`${base}/steps/sql/parseresult?statementId=${statementId}&clusterId=${clusterId}`).then(res => res.data)
}
export const analyzeinitSql = (flowtype, params) => {
    params = filterBaseStepsOutput(params)
    return axios.post(`${base}/steps/sql/analyzeinit/${flowtype}`, params).then(res => res.data)
}
export const analyzeresultSql = (statementId, clusterId) => {
    return axios.get(`${base}/steps/sql/analyzeresult?statementId=${statementId}&clusterId=${clusterId}`).then(res => res.data)
}

//nav1-1
//设计
//childNav
export const designChildList = (parentNavid, params) => {
    return axios.get(`${base}/flows/${parentNavid}`, {params: params}).then(res => res.data);
};
//drawing
export const drawFlowData = params => {
    return axios.get(`${base}/flows/${params}/findFlow`, params).then(res => {
        if (res.data.steps.length > 0) {
            res.data.steps.map(item => {
                if (item.type == 'sink') {
                    if (item.otherConfigurations.password) {
                        item.otherConfigurations.password = decrypt(item.otherConfigurations.password) ? decrypt(item.otherConfigurations.password) : item.otherConfigurations.password
                    }
                }
            })
        }
        return res.data
    });
};
export const drawGquery = () => {
    return axios.get(`${base}/steps/gquery`).then(res => res.data);
};
//history
export const drawHistoryData = params => {
    return axios.get(`${base}/flows/history/list/${params}`, params).then(res => res.data);
};
export const drawHistoryVersion = params => {
    return axios.get(`${base}/flows/history/${params}`, params).then(res => res.data);
};
//save
export const drawSaveData = (drawId, params) => {
    params = filterBaseFlow(params)
    return axios.put(`${base}/flows/${drawId}`, params).then(res => res.data);
};
//node sink DataSet
export const nodeDataSet = params => {
    return axios.post(`${base}/datasets/query`, params).then(res => res.data);
};

//nav1-1-2
//计划
//list
export const scheduleAnalysis = params => {
    return axios.post(`${base}/jobs/schedulers/stats`, params).then(res => res.data);
};

//nav1-1-3
//执行历史
//list
export const listExecutingHistory = params => {
    return axios.post(`${base}/executions/query`, params).then(res => res.data);
};

//nav1-1-4
//执行详情
//execute list
export const getExecuteList = flowId => {
    return axios.get(`${base}/executions/${flowId}`).then(res => res.data);
};
//execute logTypes
export const getExecuteLogTypes = (executionId, offset, limit) => {
    return axios.get(`${base}/logs/flow_execution_log/${executionId}/${offset}/${limit}`).then(res => res.data);
};
//execute type log
export const getExecuteTypeLog = (executionId, logType, offset, limit, desc, level) => {
    return axios.get(`${base}/logs/flow_execution_log/${executionId}/${logType}/${offset}/${limit}?desc=${desc}&level=${level}`).then(res => res.data);
};
//get execution Outputs all list
export const getExecutionOutputs = (executionId) => {
    return axios.get(`${base}/executionOutputs/executionId/${executionId}`).then(res => res.data);
};
//get execution Outputs filter list
export const getExecutionOutputsList = (data) => {
    return axios.post(`${base}/executionOutputs/query`, data).then(res => res.data);
};

// nav2 配置
// list
export const confList = params => {
    return axios.post(`${base}/processconfigs/query`, params).then(res => res.data);
};
// dele
export const delConf = params => {
    return axios.post(`${base}/processconfigs/removeList`, params).then(res => res.data)
};
// progressConf detail
export const progressConfDetail = params => {
    return axios.get(`${base}/processconfigs/${params}`, params).then(res => res.data);
};
// add
export const addProgressConf = params => {
    return axios.post(`${base}/processconfigs`, params).then(res => res.data);
};
// register
export const registerFlowConfig = params => {
    return axios.post(`${base}/processconfigs/registerFlowConfig/${params.fileType}/${params.fileName}`, params.params).then(res => res.data);
};
//集群管理
export const externalQuery = params => {
    return axios.post(`${base}/external/query`, params).then(res => res.data);
};
//解析集群包
export const getJar = (fileType,id) => {
    return axios.get(`${base}/external/parsing/${fileType}/${id}`).then(res => res.data);
};
//删除集群列表项
export const removeexternal = params => {
    return axios.post(`${base}/external/removeList`, params).then(res => res.data)
};
//注册集群管理
export const registerExternal = (clusterId,ids) => {
    return axios.post(`${base}/external/upload/${clusterId} `, ids).then(res => res.data)
};
//删除集群管理
export const DelregisterExternal = (clusterId,ids) => {
    return axios.post(`${base}/external/delete/${clusterId} `, ids).then(res => res.data)
};

export const defineConfig = params => {
    return axios.post(`${base}/customizestep/registerStep/${params.fileName}`, params.params).then(res => res.data);
};
export const defineConfDetail = params => {
    return axios.get(`${base}/customizestep/${params}`, params).then(res => res.data);
};
export const defineList = params => {
    return axios.post(`${base}/customizestep/query`, params).then(res => res.data);
};
export const defineListAll = params => {
    return axios.get(`${base}/customizestep/all`, params).then(res => res.data);
};
export const delDefine = params => {
    return axios.post(`${base}/customizestep/removeList`, params).then(res => res.data)
};
export const updateDefine = params => {
    return axios.put(`${base}/customizestep/${params.id}`, params).then(res => res.data);
};
export const cancelDefine = params => {
    return axios.get(`${base}/customizestep/cancel?fileName=${params}`, params).then(res => res.data);
};
//数据导入
export const importDefine = params => {
    return axios.post(`${base}/processconfigs/import`, params).then(res => res.data)
};
// 查看jar包详细信息
export const jarInfo = fname => {
    return axios.get(`${base}/processconfigs/query/jarInfo?fname=${fname}`).then(res => res.data)
}

/**
 * 实时计算
 * ------------------------------------------------------------------
 */
// nav1作业管理
var stream = 'streaming/job'
// list
export const getJobList = (start, limit) => {
    return axios.get(`${base}/${stream}/list?start=${start}&limit=${limit}`).then(res => res.data);
};

// get job
export const getJob = (id) => {
    return axios.get(`${base}/${stream}/${id}`).then(res => res.data);
};

// delete job
export const deleteJob = (id) => {
    return axios.get(`${base}/${stream}/${id}/remove`).then(res => res.data);
};

// post job
export const postJob = params => {
    return axios.post(`${base}/${stream}/save`, params).then(res => res.data);
};

// stop job
export const stopJob = (id) => {
    return axios.get(`${base}/${stream}/${id}/stop`).then(res => res.data);
};

// deploy job
export const deployJob = (id, map) => {
    return axios.post(`${base}/${stream}/${id}/deploy`, map).then(res => res.data);
};

// deploy job get params
export const getClusterInfo = (id) => {
    return axios.get(`${base}/${stream}/cluster/info`).then(res => res.data);
};

// sql select fields
export const sqlSelectFields = (sql) => {
    return axios.post(`${base}/${stream}/sql/selectFields`, sql).then(res => res.data);
};

// debug Job
export const debugJob = (entity) => {
    return axios.post(`${base}/${stream}/debug`, entity).then(res => res.data);
};

// debug stop job
export const debugStopJob = (id) => {
    return axios.get(`${base}/${stream}/debug/${id}/stop`).then(res => res.data);
};

// debug job log
export const debugJobLog = (id) => {
    return axios.get(`${base}/${stream}/debug/${id}/logs`).then(res => res.data);
};
// get snapshot
export const getSnapshot = (jobId) => { return axios.get(`${base}/${stream}/progress/${jobId}/savepoint`).then(res => res.data) }

// get application yarn params
export const getAllocate = (appId) => { return axios.get(`${baseWoven}/application/allocate/${appId}`).then(res => res.data) }

// get executions index
export const getExecutionsIndex = () => { return axios.get(`${base}/rtc/executions/index`).then(res => res.data) }

// 交互式查询
export const analyzeinit = (data) => {
    return axios.post(`${base}/datasets/sql/analyzeinit`, data).then(res => res.data);
};
export const analyzeresult = (statementId, clusterId) => {
    return axios.get(`${base}/datasets/sql/analyzeresult?statementId=${statementId}&clusterId=${clusterId}`).then(res => res.data);
};
export const executeinit = (data) => {
    return axios.post(`${base}/datasets/sql/executeinit`, data).then(res => res.data);
};
export const executeresult = (statementId,clusterId, data) => {
    return axios.post(`${base}/datasets/sql/executeresult?statementId=${statementId}&clusterId=${clusterId}`, data).then(res => res.data);
};
// 终止查询
export const analyzeCancel = (statementId, clusterId) => {
    return axios.get(`${base}/datasets/statement/cancel?statementId=${statementId}&clusterId=${clusterId}`).then(res => res.data);
};

// nav2作业运维
var progressUrl = 'streaming/job/progress';
//prorogress get list
export const getProgressList = (start, limit) => {
    return axios.get(`${base}/${progressUrl}/list?start=${start}&limit=${limit}`).then(res => res.data);
};

// remove Progress
export const deleteProgress = (id) => {
    return axios.get(`${base}/${progressUrl}/${id}/remove`).then(res => res.data);
};

// start Progress
export const startProgress = (id) => {
    return axios.get(`${base}/${progressUrl}/${id}/start`).then(res => res.data);
};

// stop Progress
export const stopProgress = (id, entity) => {
    return axios.post(`${base}/${progressUrl}/${id}/stop`, entity).then(res => res.data);
};

// log Progress
export const logProgress = (id, logTag, start, limit) => {
    return axios.get(`${base}/${progressUrl}/${id}/logs?logTag=${logTag}&start=${start}&limit=${limit}`).then(res => res.data);
};

// nav3作业模板
var template = 'streaming/job/template'
// list
export const getTemplateList = (start, limit) => {
    return axios.get(`${base}/${template}/list?start=${start}&limit=${limit}`).then(res => res.data);
};

// get template
export const getTemplate = (id) => {
    return axios.get(`${base}/${template}/${id}`).then(res => res.data);
};

// delete template
export const deleteTemplate = (id) => {
    return axios.get(`${base}/${template}/${id}/remove`).then(res => res.data);
};

// post template
export const postTemplate = params => {
    return axios.post(`${base}/${template}/save`, params).then(res => res.data);
};
// get Checkpoints
export const getCheckpoints = (appId, jobId) => { return axios.get(`/proxy/${appId}/jobs/${jobId}/checkpoints`).then(res => res.data) }

// get Checkpoints Details
export const getCheckpointsDetails = (appId, jobId, checkpointsId) => { return axios.get(`/proxy/${appId}/jobs/${jobId}/checkpoints/details/${checkpointsId}`).then(res => res.data) }

// get Checkpoints Details
export const getCheckpointsDetailssubtasks = (appId, jobId, checkpointsId, subtasksId) => { return axios.get(`/proxy/${appId}/jobs/${jobId}/checkpoints/details/${checkpointsId}/subtasks/${subtasksId}`).then(res => res.data) }

// get Job Manager Fields
export const getJobManagerFields = (appId) => { return axios.get(`proxy/${appId}/jobmanager/config`).then(res => res.data) }

// get Job Manager log
export const getJobManagerLog = (appId) => { return axios.get(`proxy/${appId}/jobmanager/log`).then(res => res.data) }
// get Task Manager
export const getTaskManager = (appId) => { return axios.get(`proxy/${appId}/taskmanagers`).then(res => res.data) }

// get Task Manager log
export const getTaskManagerLog = (appId, taskId) => { return axios.get(`proxy/${appId}/taskmanagers/${taskId}/log`).then(res => res.data) }

// get Task Manager Fields
export const getTaskManagerFields = (appId) => { return axios.get(`proxy/${appId}/taskmanager/config`).then(res => res.data) }

// get Task Manager Fields detail
export const getTaskManagerFieldsDetail = (appId, taskId) => { return axios.get(`proxy/${appId}/taskmanagers/${taskId}`).then(res => res.data) }

/**
 * 任务监控
 * ------------------------------------------------------------------
 */
export const urlVisitNumber = params => {
    return axios.get(`${base}/logs/metrics/request/count`, {params: params}).then(res => res.data);
}

export const urlVisitSuccess = params => {
    return axios.get(`${base}/logs/metrics/request/success_count`, {params: params}).then(res => res.data);
}

export const urlVisitTop = params => {
    return axios.get(`${base}/logs/metrics/request/top`, {params: params}).then(res => res.data);
}

export const timeVisitTop = params => {
    return axios.get(`${base}/logs/metrics/request/toptimmer`, {params: params}).then(res => res.data);
}
// nav1运维管理
// index所有数据
export const indexData = params => {
    return axios.get(`${baseWoven}/index`).then(res => res.data);
}
// 获取节点状态监控
export const collectors = params => {
    return axios.post(`${baseWoven}/collectors/query`, params).then(res => res.data);
}
// nav2血缘分析
// 数据集选项
export const bloodAnalysisDataset = params => {
    return axios.get(`${base}/lineage/${params}?datasetId=${params}`, params).then(res => res.data);
}
// 字段级 库级 流程集
export const bloodAnalysisFields = params => {
    return axios.post(`${base}/lineage/fields`, params).then(res => res.data);
}
// 获取指定字段的内容
export const bloodAnalysisFieldsDetail = params => {
    return axios.post(`${base}/lineage/${params[1]}/fieldslineage`, params[0]).then(res => res.data);
}
// nav2 计划
// list
export const scheduleList = params => {
    return axios.post(`${base}/schedulers/query`, params).then(res => res.data);
}
// 启用
export const enablePlan = params => {
    return axios.post(`${base}/schedulers/enable`, params).then(res => res.data);
};
//停止
export const disablePlan = params => {
    return axios.post(`${base}/schedulers/disable`, params).then(res => res.data);
};
//删除
export const delePlan = params => {
    return axios.post(`${base}/schedulers/removeList`, params).then(res => res.data);
};
//创建计划
export const createSchedule = params => {
    return axios.post(`${base}/schedulers`, params).then(res => res.data);
}
// 周期运行（前5次）
export const cronRun = params => {
    return axios.get(`${base}/schedulers/cron-validate`, {params: params}).then(res => res.data);
}
// 获取flow相关参数
export const flowParam = params => {
    return axios.get(`${base}/flows/${params}/runtime-properties`, params).then(res => res.data);
}
// 更新流程执行计划
export const updateSchedule = params => {
    return axios.put(`${base}/schedulers/${params.id}`, params).then(res => res.data);
}
//计划详情
export const scheduleDetail = params => {
    return axios.get(`${base}/schedulers/${params}`, params).then(res => res.data);
}
//流程详情
export const flowsDetail = params => {
    return axios.get(`${base}/flows/${params}/findFlow`, params).then(res => res.data);
}
//执行列表
export const executeList = params => {
    return axios.post(`${base}/executions/groupQuery`, params).then(res => res.data);
}
// 执行列表统计
export const executeStatistics = params => {
    return axios.get(`${base}/schedulers/cron-check?end=${params.startDate}&start=${params.endDate}&flowType=${params.flowType}`).then(res => res.data);
}

// 执行停止
export const stopExecute = (params, isChecked) => {
    return axios.post(`${base}/executions/kill?storeState=${isChecked}`, params).then(res => res.data);
};
// 执行删除
export const delExecute = params => {
    return axios.post(`${base}/executions/removeList`, params).then(res => res.data);
};
// 执行重启
export const rerunExecute = params => {
    return axios.post(`${base}/executions/rerun`, params).then(res => res.data);
};
//数据源状态监控分析图数据
export const getDataStatusDraw = params => {
    return axios.post(`${baseWoven}/data/status`, params).then(res => res.data);
}
export const getDataStatusList = params => {
    return axios.post(`${baseWoven}/data/statuslist`, params).then(res => res.data);
}
export const delDataStatusList = params => {
    return axios.post(`${baseWoven}/data/statuslist/removeList`, params).then(res => res.data);
}
//监控告警相关数据
//数据源状态监控分析图数据
export const getAlarmList = params => {
    return axios.post(`${baseWoven}/alarm/query`, params).then(res => res.data);
}
export const delAlarmList = params => {
    return axios.post(`${baseWoven}/alarm/removeList`, params).then(res => res.data);
}
export const ingoreAlarmList = params => {
    return axios.post(`${baseWoven}/alarm/ingoreList`, params).then(res => res.data);
}
export const getAlarmRuleList = params => {
    return axios.post(`${baseWoven}/alarmrules/query`, params).then(res => res.data);
}
export const delAlarmRuleList = params => {
    return axios.post(`${baseWoven}/alarmrules/removeList`, params).then(res => res.data);
}
export const getAlarmRule = id => {
    return axios.get(`${baseWoven}/alarmrules/${id}`,).then(res => res.data);
};
export const createAlarmRule = params => {
    return axios.post(`${baseWoven}/alarmrules`, params).then(res => res.data);
}
export const updateAlarmRule = params => {
    return axios.put(`${baseWoven}/alarmrules/${params.id}`, params).then(res => res.data);
}

// project
export const getRootsProject = () => {
    return axios.get(`${baseWoven}/project/projects`).then(res => res.data);
};
export const getProject = id => {
    return axios.get(`${baseWoven}/project/${id}`,).then(res => res.data);
};
export const putProject = (data) => {
    return axios.put(`${baseWoven}/project`, data).then(res => res.data);
};
export const postProject = (data) => {
    return axios.post(`${baseWoven}/project`, data).then(res => res.data);
};
export const deleteProject = (id) => {
    return axios.delete(`${baseWoven}/project/${id}`, id).then(res => res.data);
};
//delete schema
export const deleteSchemaProject = (projectId, data) => {
    return axios.post(`${base}/schemas/removeListProject/${projectId}`, data).then(res => res.data);
};
//delete dataset
export const deleteDatasetProject = (projectId, data) => {
    return axios.post(`${base}/datasets/removeListProject/${projectId}`, data).then(res => res.data);
};
//delete
export const delFlowProject = (projectId, ids) => {
    return axios.post(`${base}/flows/removeListProject/${projectId}`, ids).then(res => res.data)
};
//ambari
export const ambariInfo = params => {
    return axios.get(`${baseWoven}/cluster/ambari`, {params: params}).then(res => res.data);
};


// 监控可视化
export const logsCluster = () => {
    return axios.get(`${base}/logs/cluster/apps`).then(res => res.data);
};
export const logsClusterRequest = (params) => {
    return axios.get(`${base}/logs/cluster/app/request?startDate=${params.startDate}&endDate=${params.endDate}&group=${params.group}&dateFormat=${params.dateFormat}&uri=${params.uri}`).then(res => res.data);
};

export const logsClusterSpot = (params) => {
    return axios.get(`${base}/logs/cluster/app/${params.interface}/jobs?startDate=${params.startDate}&endDate=${params.endDate}&uri=${params.uri}&dateFormat=dd/HH:mm&limit=10000`).then(res => res.data);
};

// 请求 sql
export const actuatorHealth = () => {
    return axios.get(`/actuator/health/db`).then(res => res.data);
};


//数据统计（科协）
// export const getStatistics = date => { return axios.get(`${base}/tongji/test?${date}`, ).then(res => res.data); };2019-02-12 today_record desc
export const getStatistics = (date, rank, updown) => {
    return axios.get(`http://192.168.1.189:9978/api/tongji/test?date=${date}&rank=${rank}&updown=${updown}`,).then(res => res.data);
};

/**
 * 通用接口
 * ------------------------------------------------------------------
 */

//license
export const getLicenseSid = () => {
    return axios.get(`${base}/license/sid`).then(res => res.data);
};
export const activateLicense = (params) => {
    return axios.post(`${base}/license/activate`, params).then(res => res.data);
};
// export const getLicenseInfo = () => {
//     return axios.get(`${base}/license/info`).then(res => res.data);
// };

// get type = datasource，standardbd
export const listData = (params, type) => {
    return axios.post(`${baseWoven}/${type}/query`, params).then(res => res.data);
};
//get type = schemas,datasets
export const listData2 = (params, type) => {
    if (type == 'datasets' && congfigData[process.env.BASE_PROJECT].systemName === 'Cab') {
        params.fieldList.push({
            "fieldName": "storage",
            "fieldValue": "REDIS",
            "comparatorOperator": "NOT_EQUAL",
            "logicalOperator": "AND"
        })
    }
    return axios.post(`${base}/${type}/query`, params).then(res => res.data);
};
export const querySchema = (params) => {
    return axios.get(`${base}/schemas/${params}`).then(res => res.data);
};

// table 搜索
export const tableSearch = (catalog, params) => {
    return axios.get(`${catalog}/filed/info`, {params: params}).then(res => res.data);
};

//mockStep

//export const mockStep = () => { return axios.get('getStepData').then( res => res.data)}
export const savestep = (params) => {
    return axios.post(`${base}/definestep/saveOrUpdate`, params).then(res => res.data)
}
export const queryDefinStep = (params, type) => {
    return axios.post(`${base}/definestep/query/${type}`, params).then(res => res.data)
}
export const deleteDefinStep = (params) => {
    return axios.post(`${base}/definestep/deleteByIds`, params).then(res => res.data)
}

export const definestep = (params) => {
    return axios.get(`${base}/definestep/${params}`, params).then(res => res.data)
}
 //元数据上传
export const uploadStandardbd =(clusterName,params)=>{
    return axios.post(`${base}/woven/standardbd/upload/${clusterName}`,params).then(res=>res)
}
 //元数据卸载
 export const uninstallStandardbd =(clusterName,params)=>{
    return axios.post(`${base}/woven/standardbd/uninstall/${clusterName}`,params).then(res=>res)
}
