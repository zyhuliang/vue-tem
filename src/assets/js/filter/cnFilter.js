/**
 * ------------------------------------------------------------------
 * label 中文转义
 * ------------------------------------------------------------------
 */
var obj = {}
/* var obj = {
    ID:"主键",
    description:"描述",
    sql:"查询语句",
    SQL:'查询语句',
    driver:"驱动",
    schema:"元数据",
    dataset:"数据集",
    catalog:"目录",
    expiredPeriod:"过期时间",
    user:"用户名",
    type:"类型",
    path:"路径",
    URL:"路径",
    format:"格式",
    recursive:"递归",
    header:"是否包含首行",
    separator:"分隔符",
    quoteChar:"引号符",
    escapeChar:"转义符",
    sliceType:"分片类型",
    sliceTime:"时间分片",
    dir:"路径",
    Hostname:"主机名",
    EID:"执行主键",
    Outputs:"输出",
    table:"表",
    partitionColumns:"分隔行",
    zookeeper:"zookeeper",
    topic:"主题",
    brokers:"brokers",
    groupId:"组主键",
    version:"版本",
    namespace:"命名空间",
    columns配置:"列配置",
    columns:"列",
    password:"密码",
    clusterName:"集群名称",
    ipAddresses:"集群地址",
    index:"索引",
    indexType:"索引类型",
    dateToTimestamp:"时间转时间戳",
    url:"路径",
    选择schema:"选择元数据",
    outputSize:"输出大小",
    outputRecords:"输出记录",
    action:"行为",
    processId:"流程主键",
    stepPath:"step路径",
    "预处理 Flow":"预处理流程",
    OWNER:"所有者",
    Transform:"转换",
    Group:"分组",
    mapping:"映射",
    Gateway:"网关",
    Set:"集合",
    Join:"连接",
    IO:"输入输出",
    Process:"处理节点",
    Datamining:"Datamining-",
    false:"否",
/!*    pipeline-server:"",
    platform-server:"",
    df-executor:"",
    dataflow interceptor:"",
    workflow interceptor:"",
    workflow selector:"",
    dataflow selector:"",
    dataflow udf:"",
    filter class:"",*!/

    //数分析-执行详情
    application:'应用日志',
    dataflow_0:'批处理日志_0',
    monitor:'监控日志',
    workflow:'工作流日志',

    //数据治理-任务执行信息
    "FAILED":'失败',
    "SUCCEEDED":'成功',

    //数据治理-分析规则
    Extend:'扩展',
    EL:'表达式',
    Custom:'自定义',
    Builtin:'内建',
    //数据集成-文件导入
    overwrite:'overwrite-',
    //实时计算，作业管理，作业配置
    schemaFields:'元数据字段',
} */

let cn = value => {
  for (var i in obj) {
    if (value == i) {
      return obj[i]
    }
  }
  return value
}
export { cn }
