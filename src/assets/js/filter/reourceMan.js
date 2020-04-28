/**
 * ------------------------------------------------------------------
 * resourceMan 中文转义
 * ------------------------------------------------------------------
 */
var obj = {}
/* var obj = {
    /!*
        source
    *!/
    //DBsource
    id:'主键',
    name:'名称',
    type:'类型',
    url:'路径',
    URL:'路径',
    driver:'驱动',
    table:'表',
    object:'对象',
    readerName:'readerName-',
    description:'描述',
    owner:'拥有者',
    DBType:'数据库类型',
    host:'主机',
    port:'端口',
    database:'数据库',
    user:'用户名',
    password:'密码',
    properties:'其他参数',
    chineseName:'中文名',
    dateToTimestamp:'时间转时间戳',
    catalog:"目录",
    schema:'元数据',
    Schema:'元数据',
    tree:'树',
    tableExt:'扩展表',
    selectSQL:'数据过滤',
    //ESsource
    clusterName:'集群名称',
    ipAddresses:'集群地址',
    index:'索引',
    indexType:'索引类型',
    version:'版本',
    filter:'数据过滤',
    //FTPsource
    secure:'使用安全协议',
    username:'用户名',
    dir:'路径',
    fieldsSeparator:'字段分隔符',
    filename:'文件名',
    schemaId:'元数据主键',
    schemaName:'元数据名称',
    选择schema:'选择元数据',
    //HTTPsource
    method:'方式',
    rootPath:'根路径',
    parameters:'参数',
    //MONGOsource
    address:'地址',
    collection:'集合名称',
    query:'数据过滤',
    //SOCKETsource
    charset:'字符集',
    ipAddress:'网络协议地址',
    protocol:'协议',
    bind:'bind-',
    operateType:'操作类型',
    regex:'正则表达式',
    /!*
        dataset
    *!/
    creator:'创建',
    createTime:'创建时间',
    lastModifier:'lastModifier-',
    lastModifiedTime:'修改时间',
    moduleVersion:'moduleVersion-',
    enabled:'enabled-',
    tableName:'tableName-',
    source:'source-',
    recordNumber:'recordNumber-',
    byteSize:'byteSize-',
    analysisTime:'analysisTime-',

    //HDFS
    storage:'正则表达式',
    expiredPeriod:'过期时间',
    sliceTime:'时间分片',
    sliceType:'分片类型',
    format:'格式',
    path:'路径',
    relativePath:'相对路径',
    recursive:'递归',
    exact: "准确-",
    glob: "匹配-",
    pathMode:'路径模式',
    header:'是否包含首行',
    separator:'分隔符',
    quoteChar:'引号符',
    escapeChar:'转义符',
    fields:'字段',
    mode:'写入模式',
    sliceFormat:'切片格式',
    //HIVE
    sql:'查询语句',
    partitionColumns:'分隔行',
    //KAFKA
    zookeeper:'zookeeper-',
    brokers:'brokers-',
    topic:'主题',
    groupId:'组主键',
    reader:'reader-',
    //REDIS
    key:'key-',
    keySchema:'keySchema-',
    valueSchema:'valueSchema-',
    //IGNITE
    cacheName:'cacheName-',
    //filesynch

    true:'是',
    false:'否',

    /!*resourceMan*!/
    //datset
    dataType:'dataType-',
    length:'length-',
    DB:"数据库" ,
    JDBC:"JDBC-" ,
    HTTP:"HTTP-" ,
    FTP:"FTP-" ,
    SOCKET:"SOCKET-" ,
    MONGODB:"MONGODB-" ,
    ES:"ES-" ,
    HDFS:"HDFS-",
    KAFKA:"KAFKA-",
    HBASE:"HBASE-",
    ElasticSearch:"ElasticSearch-",
    SearchOne:"SearchOne-",
    csv: 'csv-',
    parquet: 'parquet-',
    xml: 'xml-',
    json: 'json-',
    //datasource

    GET:'GET-',
    POST:'POST-',
    TCP:'TCP-',
    UDP:'UDP-',
    Mysql:'Mysql-',
    Teradata:'Teradata-',
    'JDBC-ODBC Bridge':'JDBC-ODBC Bridge-',
    'Oracle Thin':'Oracle Thin-',
    'Microsoft SQL Server (Microsoft Driver)':'Microsoft SQL Server (Microsoft Driver)-',
    'Microsoft SQL Server(JTDS)':'Microsoft SQL Server(JTDS)-',
    Sybase:'Sybase-',
    PostgreSQL:'PostgreSQL-',
    HSQLDB:'HSQLDB-',
    Greenplum:'Greenplum-',
    GBase:'GBase-',
    'Generic DB':'Generic DB-',
    DB2:'DB2-',
    DBONE:'DBONE-',
    SnowBall:'SnowBall-',
    HIVE:'HIVE-',
} */

let res = value => {
  for (var i in obj) {
    if (value == i) {
      return obj[i]
    }
  }
  return value
}
export { res }
