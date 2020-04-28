export const messages = {
  /*
        通用
    */
  true: 'true',
  false: 'false',
  ID: 'ID',
  description: 'description',
  sql: 'sql',
  SQL: 'SQL',
  driver: 'driver',
  schema: 'schema',
  dataset: 'dataset',
  catalog: 'catalog',
  expiredPeriod: 'expiredPeriod',
  user: 'user',
  type: 'type',
  path: 'path',
  URL: 'URL',
  format: 'format',
  recursive: 'recursive',
  header: 'header',
  separator: 'separator',
  quoteChar: 'quoteChar',
  escapeChar: 'escapeChar',
  sliceTime: 'sliceTime',
  dir: 'dir',
  Hostname: 'Hostname',
  EID: 'EID',
  Outputs: 'Outputs',
  table: 'table',
  partitionColumns: 'partitionColumns',
  zookeeper: 'zookeeper',
  topic: 'topic',
  brokers: 'brokers',
  groupId: 'groupId',
  version: 'version',
  namespace: 'namespace',
  columns配置: 'columns配置',
  columns: 'columns',
  password: 'password',
  clusterName: 'clusterName',
  ipAddresses: 'ipAddresses',
  index: 'index',
  indexType: 'indexType',
  dateToTimestamp: 'dateToTimestamp',
  url: 'url',
  选择schema: '选择schema',
  outputSize: 'outputSize',
  outputRecords: 'outputRecords',
  action: 'action',
  processId: 'processId',
  stepPath: 'stepPath',
  '预处理 Flow': '预处理 Flow',
  OWNER: 'OWNER',
  Transform: 'Transform',
  Group: 'Group',
  mapping: 'mapping',
  Gateway: 'Gateway',
  Set: 'Set',
  Join: 'Join',
  IO: 'IO',
  Process: 'Process',
  Datamining: 'Datamining',
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
  application: 'application',
  dataflow_0: 'dataflow_0',
  monitor: 'monitor',
  workflow: 'workflow',
  /*
        数据治理-任务执行信息
    */
  FAILED: 'FAILED',
  SUCCEEDED: 'SUCCEEDED',
  /*
        数据治理-分析规则
    */
  Extend: 'Extend',
  EL: 'EL',
  Custom: 'Custom',
  Builtin: 'Builtin',
  /*
        数据集成-文件导入
    */
  overwrite: 'overwrite',
  /*
        实时计算，作业管理，作业配置
    */
  schemaFields: 'schemaFields',
  /*
        nodeset
        数据分析-step-高级
    */
  interceptor: 'interceptor',
  sessionCache: 'sessionCache',
  nullValue: 'nullValue',
  maxFileSize: 'maxFileSize',
  maxFileNumber: 'maxFileNumber',
  expiredTime: 'expiredTime',
  sliceTimeColumn: 'sliceTimeColumn',
  sliceType: 'sliceType',
  singleRowCache: 'singleRowCache',
  countWrittenRecord: 'countWrittenRecord',
  /*
        designSubmit.vue
    */
  debug: 'debug',
  master: 'master',
  'deploy-mode': 'deploy-mode',
  'local-external-jarfile': 'ocal-external-jarfile',
  /*
        计划 schedule-add.vue
    */
  'dataset-nullable': 'dataset-nullable',
  'lineage.enable': 'lineage.enable',
  'debug-rows': 'debug-rows',
  'sink.concat-files': 'sink.concat-files',
  /*
        质量分析
    */
  Schedule名称: 'Schedule名称',
  Flow名称: 'Flow名称',
  'notify-output': 'notify-output',
  queue: 'queue',
  'num-executors': 'num-executors',
  'driver-memory': 'driver-memory',
  'executor-memory': 'executor-memory',
  'executor-cores': 'executor-cores',
  verbose: 'verbose',
  'local-dirs': 'local-dirs',
  'concat-files': 'concat-files',
  all: 'all',
  /*
        资源目录 source
    */
  // GET:'GET',
  // POST:'POST',
  // TCP:'TCP',
  // UDP:'UDP',
  // Mysql:'Mysql',
  // Teradata:'Teradata',
  // 'JDBC-ODBC Bridge':'JDBC-ODBC Bridge',
  // 'Oracle Thin':'Oracle Thin',
  // 'Microsoft SQL Server (Microsoft Driver)':'Microsoft SQL Server (Microsoft Driver)',
  // 'Microsoft SQL Server(JTDS)':'Microsoft SQL Server(JTDS)',
  // Sybase:'Sybase',
  // PostgreSQL:'PostgreSQL',
  // HSQLDB:'HSQLDB',
  // Greenplum:'Greenplum',
  // GBase:'GBase',
  // 'Generic DB':'Generic DB',
  // DB2:'DB2',
  // DBONE:'DBONE',
  // SnowBall:'SnowBall',
  /*
        DBsource
    */
  'Resource tree': 'Resource tree',
  id: 'id',
  name: 'name',
  object: 'object',
  readerName: 'readerName',
  owner: 'owner',
  DBType: 'DBType',
  host: 'host',
  port: 'port',
  database: 'database',
  properties: 'properties',
  chineseName: 'chineseName',
  Schema: 'Schema',
  tree: 'tree',
  tableExt: 'tableExt',
  selectSQL: 'selectSQL',
  /*
        ESsource
    */
  filter: 'filter',
  /*
        FTPsource
    */
  secure: 'secure',
  username: 'username',
  fieldsSeparator: 'fieldsSeparator',
  filename: 'filename',
  schemaId: 'schemaId',
  schemaName: 'schemaName',
  'schema tree': 'schema tree',
  /*
        HTTPsource
    */
  method: 'method',
  rootPath: 'rootPath',
  parameters: 'parameters',
  /*
        MONGOsource
    */
  address: 'address',
  collection: 'collection',
  query: 'query',
  /*
        SOCKETsource
    */
  charset: 'charset',
  ipAddress: 'ipAddress',
  protocol: 'protocol',
  bind: 'bind',
  operateType: 'operateType',
  regex: 'regex',
  /*
        资源目录 dataset
    */
  dataType: 'dataType',
  length: 'length',
  DB: 'DB',
  JDBC: 'JDBC',
  HTTP: 'HTTP',
  FTP: 'FTP',
  SOCKET: 'SOCKET',
  MONGODB: 'MONGODB',
  ES: 'ES',
  HDFS: 'HDFS',
  KAFKA: 'KAFKA',
  HBASE: 'HBASE',
  HIVE: 'HIVE',
  SPARK: 'SPARK',
  YARN: 'YARN',
  FLINK: 'FLINK',
  ElasticSearch: 'ElasticSearch',
  // SearchOne:"SearchOne",
  // csv: 'csv',
  // parquet: 'parquet',
  // xml: 'xml',
  // json: ' json',
  /*
        list
    */
  creator: 'creator',
  createTime: 'createTime',
  lastModifier: 'lastModifier',
  lastModifiedTime: 'lastModifiedTime',
  moduleVersion: 'moduleVersion',
  enabled: 'enabled',
  tableName: 'tableName',
  source: 'source',
  recordNumber: 'recordNumber',
  byteSize: 'byteSize',
  analysisTime: 'analysisTime',
  /*
        HDFS
    */
  storage: 'storage',
  relativePath: 'relativePath',
  exact: 'exact',
  glob: '匹配',
  pathMode: 'pathMode',
  fields: 'fields',
  mode: 'mode',
  sliceFormat: 'sliceFormat',
  reader: 'reader',
  /*
        REDIS
    */
  key: 'key',
  keySchema: 'keySchema',
  valueSchema: 'valueSchema',
  /*
        IGNITE
    */
  cacheName: 'cacheName',
  columnsKey: 'columnsKey'
}
