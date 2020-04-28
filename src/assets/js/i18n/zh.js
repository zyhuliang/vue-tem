export const messages = {
  /*
        通用
    */
  true: '是',
  false: '否',
  ID: '主键',
  description: '描述',
  sql: '查询语句',
  SQL: '查询语句',
  driver: '驱动',
  schema: '元数据',
  dataset: '数据集',
  catalog: '目录',
  expiredPeriod: '过期时间',
  user: '用户名',
  type: '类型',
  path: '路径',
  URL: '路径',
  format: '格式',
  recursive: '递归',
  header: '是否包含首行',
  separator: '分隔符',
  quoteChar: '引号符',
  escapeChar: '转义符',
  sliceTime: '时间分片',
  dir: '路径',
  Hostname: '主机名',
  EID: '执行主键',
  Outputs: '输出',
  table: '表名',
  partitionColumns: '分隔行',
  zookeeper: '分布式应用协调服务',
  topic: '主题',
  brokers: '链接地址',
  groupId: '组主键',
  version: '版本',
  namespace: '命名空间',
  columns配置: '列配置',
  columns: '列',
  password: '密码',
  clusterName: '集群名称',
  ipAddresses: '集群地址',
  index: '索引',
  indexType: '索引类型',
  dateToTimestamp: '时间转时间戳',
  url: '路径',
  选择schema: '选择元数据',
  outputSize: '输出大小',
  outputRecords: '输出记录',
  action: '行为',
  processId: '流程主键',
  stepPath: '流程路径',
  '预处理 Flow': '预处理流程',
  OWNER: '所有者',
  Transform: '转换',
  Group: '分组',
  mapping: '映射',
  Gateway: '网关',
  Set: '集合',
  Join: '连接',
  IO: '输入输出',
  Process: '处理节点',
  Datamining: '数据挖掘',
  // "pipeline-server":"",
  // "platform-server":"",
  // "df-executor":"",
  // "dataflow interceptor":"",
  // "workflow interceptor":"",
  // "workflow selector":"",
  // "dataflow selector":"",
  // "dataflow udf":"",
  // "filter class":"",
  /*
        数分析-执行详情
    */
  application: '应用日志',
  dataflow_0: '批处理日志_0',
  monitor: '监控日志',
  workflow: '工作流日志',
  /*
        数据治理-任务执行信息
    */
  FAILED: '失败',
  SUCCEEDED: '成功',
  /*
        数据治理-分析规则
    */
  Extend: '扩展',
  EL: '表达式',
  Custom: '自定义',
  Builtin: '内建',
  /*
        数据集成-文件导入
    */
  overwrite: '覆盖',
  /*
        实时计算，作业管理，作业配置
    */
  schemaFields: '元数据字段',
  /*
        nodeset
        数据分析-step-高级
    */
  interceptor: '拦截器',
  sessionCache: '会话缓存',
  nullValue: '无值',
  maxFileSize: '最大文件',
  maxFileNumber: '最大文件数量',
  expiredTime: '有效时间',
  sliceTimeColumn: '分片时间字段',
  sliceType: '分片类型',
  singleRowCache: '单行缓存',
  countWrittenRecord: '计算写入记录数',
  /*
        designSubmit.vue
    */
  debug: '调试',
  master: '主服务',
  'deploy-mode': '部署模式',
  'local-external-jarfile': '本地扩展执行包路径',
  /*
        计划 schedule-add.vue
    */
  'dataset-nullable': '数据集是否可为空',
  'lineage.enable': '开启血缘关系',
  'debug-rows': '单行调试',
  'sink.concat-files': '输出文件合并',
  /*
        质量分析
    */
  Schedule名称: '计划名称',
  Flow名称: '流程名称',
  'notify-output': '通知输出',
  queue: '队列',
  'num-executors': '执行器数量',
  'driver-memory': '驱动内存',
  'executor-memory': '执行器内存',
  'executor-cores': '执行器处理器',
  verbose: '冗余',
  'local-dirs': '本地目录',
  'concat-files': '合并文件',
  all: '所有',
  /*
        资源目录 source
    */
  // GET:'获取',
  // POST:'提交',
  // TCP:'传输控制协议',
  // UDP:'用户数据报协议',
  // Mysql:'Mysql-',
  // Teradata:'Teradata-',
  // 'JDBC-ODBC Bridge':'JDBC-ODBC Bridge-',
  // 'Oracle Thin':'Oracle Thin-',
  // 'Microsoft SQL Server (Microsoft Driver)':'Microsoft SQL Server (Microsoft Driver)-',
  // 'Microsoft SQL Server(JTDS)':'Microsoft SQL Server(JTDS)-',
  // Sybase:'Sybase-',
  // PostgreSQL:'PostgreSQL-',
  // HSQLDB:'HSQLDB-',
  // Greenplum:'Greenplum-',
  // GBase:'GBase-',
  // 'Generic DB':'Generic DB-',
  // DB2:'DB2-',
  // DBONE:'DBONE-',
  // SnowBall:'雪球数据库',
  /*
        DBsource
    */
  'Resource tree': '资源树',
  id: '主键',
  name: '名称',
  object: '对象',
  readerName: '读取器',
  owner: '拥有者',
  DBType: '数据库类型',
  host: '主机',
  port: '端口',
  database: '数据库',
  properties: '其他参数',
  chineseName: '中文名',
  Schema: '元数据',
  tree: '树',
  tableExt: '扩展表',
  selectSQL: '数据过滤',
  /*
        ESsource
    */
  filter: '数据过滤',
  /*
        FTPsource
    */
  secure: '使用安全协议',
  username: '用户名',
  fieldsSeparator: '字段分隔符',
  filename: '文件名',
  schemaId: '元数据主键',
  schemaName: '元数据名称',
  'schema tree': '元数据树',
  /*
        HTTPsource
    */
  method: '方式',
  rootPath: '根路径',
  parameters: '参数',
  /*
        MONGOsource
    */
  address: '地址',
  collection: '集合名称',
  query: '数据过滤',
  /*
        SOCKETsource
    */
  charset: '字符集',
  ipAddress: '网络协议地址',
  protocol: '协议',
  bind: '绑定',
  operateType: '操作类型',
  regex: '正则表达式',
  /*
        资源目录 dataset
    */
  dataType: '数据类型',
  length: '长读',
  DB: '数据库',
  JDBC: '数据库连接',
  HTTP: '超文本传输协议',
  FTP: '文件传输协议',
  SOCKET: '套接字服务',
  MONGODB: '文档数据库',
  ES: '全文搜索引擎',
  HDFS: '分布式文件存储',
  KAFKA: '分布式消息服务',
  HBASE: '分布式数据库',
  HIVE: '分布式数据仓库',
  SPARK: '分布式内存计算平台',
  YARN: '分布式资源调度服务',
  FLINK: '分布式流式计算平台',
  ElasticSearch: '全文搜索引擎',
  // SearchOne:"SearchOne-",
  // csv: '字符分隔文件',
  // parquet: '列式存储文件',
  // xml: '可扩展标记语言',
  // json: ' 数据交换格式',
  /*
        list
    */
  creator: '创建',
  createTime: '创建时间',
  lastModifier: '最后更新时间',
  lastModifiedTime: '修改时间',
  moduleVersion: '模块版本',
  enabled: '是否可用',
  tableName: '表名',
  source: '来源',
  recordNumber: '记录数',
  byteSize: '字节大小',
  analysisTime: '分析时间',
  /*
        HDFS
    */
  storage: '正则表达式',
  relativePath: '相对路径',
  exact: '准确',
  glob: '匹配',
  pathMode: '路径模式',
  fields: '字段',
  mode: '写入模式',
  sliceFormat: '切片格式',
  reader: '读取器',
  /*
        REDIS
    */
  key: '主键',
  keySchema: '主键列',
  valueSchema: '值列',
  /*
        IGNITE
    */
  cacheName: '缓存名称',
  columnsKey: '列配置'
}
