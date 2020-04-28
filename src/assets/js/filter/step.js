/**
 * ------------------------------------------------------------------
 * step 中文转义
 * ------------------------------------------------------------------
 */
var obj = {}
/* var obj = {
    all: '全部-',
    dataflow:'批处理-',
    streamflow:'流处理-',
    workflow:'工作流-',
    /!*dataflow 工作流 *!/
    //- IO  输入输出
    sink: '输出',
    source: '输入',
    sqlsource: '查询输入',
    //- Gateway 网关
    decision: '决策',
    supplement: '补充',
    validate:'validate-',
    //- Transform  转换
    sample: '采样',
    filter: '过滤',
    sql: '查询语句',
    transform: '转换',
    //- Group 分组
    aggregate: '聚合',
    top: '前取',
    //- Mapping 映射
    lookupTable: "表查找",
    //- Set 集合
    intersect: '交集',
    minus: '差集',
    split: '分割',
    union: '并集',
    //- Join 连接
    join: '连接',
    lookup: '查找',
    productjoin: '乘积连接',
    starjoin: 'starjoin-',
    //- Datamining
    'linearleastsquares_predict':'linearleastsquares_predict-',
    'linearleastsquares_train':'linearleastsquares_train-',
    'RandomForestPredictStep':'RandomForestPredictStep-',
    'RandomForestTrainStep':'RandomForestTrainStep-',

    /!*workflow 工作流*!/
    //- Gateway 网关
    "event": '事件网关',
    "exclusive": '排他网关',
    "parallel": '并行网关',

    //- Process
    hawq:'hawq-',
    hive:'hive-',
    mapreduce:'mapreduce-',
    shell:'shell-',
    spark:'spark-',
    //dataflow 弹框参数页面
    //-Analysis
    //-sink_analysis_qa.vue
    storage:'storage-',

    //-Gateway
    //-decision.vue
    condition:'condition-',
    //-supplement.vue
    supplementSchema:'supplementSchema-',
    //-validate.vue
    validationRules:'验证规则',
    action:'action-',
    showDetails:'showDetails-',

    //-Group
    //-aggregate.vue
    groupBy:'groupBy-',
    aggregations:'aggregations-',

    //-top.vue
    limitType:'limitType-',
    limit:'limit-',
    orderBy:'orderBy-',

    //-IO
    //-sink.vue
    'dataset存放位置':'数据集存放位置',
    schema:'元数据',
    'schema存放位置':'元数据存放位置',
    specifiedStringColumnTypes:'specifiedStringColumnTypes-',
    //-source.vue
    //-sqlSource.vue

    //-Join
    //-join.vue
    joinType:'joinType-',
    joinConditions:'joinConditions-',
    //-lookup.vue
    mode:'mode-',
    inputKeyColumn:'inputKeyColumn-',
    valueColumns:'valueColumns-',
    alias:'别名',
    defaultNoMatch:'defaultNoMatch-',
    defaultNullKey:'defaultNullKey-',
    //-starjoin.vue
    factTable:'factTable-',

    //-Mapping
    //-lookupTable.vue
    keyColumn:'keyColumn-',
    engine:'engine-',

    //-Set
    //-split.vue
    //-union.vue
    distinct:'distinct-',

    //-Transform
    //-filter.vue
    //-sample.vue
    withReplacement:'withReplacement-',
    fraction:'fraction-',
    //-sql.vue
    //-transform.vue
    expressions:'expressions-',

    //-workflow
    //-Gateway
    //-event.vue
    filterClass:'filterClass-',
    //-exclusive.vue
    conditions:'conditions-',
    //-parallel.vue

    //-Process
    //-dataflow.vue

    //-hawq.vue
    workingDiretory:'workingDiretory-',
    'hawq_cmd':'hawq_cmd-',
    logFile:'logFile-',
    //-hive.vue
    'hive_cmd':'hive_cmd-',
    //-mapreduce.vue
    'hadoop_cmd':'hadoop_cmd-',
    jarFile:'jarFile-',
    program:'program-',
    arguments:'arguments-',
    //-shell.vue
    command:'command-',
    logPattern:'logPattern-',
    //-spark.vue
    sparkHome:'sparkHome-',
    master:'master-',
    deploymode:'deploymode-',
    applicationJar:'applicationJar-',
    applicationClass:'applicationClass-',
    applicationArgs:'applicationArgs-',
} */

let step = value => {
  for (var i in obj) {
    if (value == i) {
      return obj[i]
    }
  }
  return value
}
let stepjs = value => {
  for (var i in obj) {
    if (value == i) {
      return obj[i]
    }
  }
  return value
}
export { step, stepjs }
