//nodeSet.js   节点配置

/**
 * steps参数 dataFlow
 * ------------------------------------------------------------------
 */

/* IO */
import source from '@components/design/typeParameter/dataflow/IO/source'
import sqlsource from '@components/design/typeParameter/dataflow/IO/sqlSource'
import sink from '@components/design/typeParameter/dataflow/IO/sink'
import backend from '@components/design/typeParameter/dataflow/IO/backend'

/* Join */
import join from '@components/design/typeParameter/dataflow/Join/join'
import starjoin from '@components/design/typeParameter/dataflow/Join/starjoin'
import lookup from '@components/design/typeParameter/dataflow/Join/lookup'

/* Set */
import union from '@components/design/typeParameter/dataflow/Set/union'
import split from '@components/design/typeParameter/dataflow/Set/split'

/* Transform */
import sample from '@components/design/typeParameter/dataflow/Transform/sample'
import filter from '@components/design/typeParameter/dataflow/Transform/filter'
import sql from '@components/design/typeParameter/dataflow/Transform/sql'
import transform from '@components/design/typeParameter/dataflow/Transform/transform'

/* mapping */
import cache from '@components/design/typeParameter/dataflow/Mapping/lookupTable'

/* Group */
import aggregate from '@components/design/typeParameter/dataflow/Group/aggregate'
import top from '@components/design/typeParameter/dataflow/Group/top'

/* Gateway */
import decision from '@components/design/typeParameter/dataflow/Gateway/decision'
import validate from '@components/design/typeParameter/dataflow/Gateway/validate'
import supplement from '@components/design/typeParameter/dataflow/Gateway/supplement'

/* sink_analysis_qa */
import sink_analysis_qa from '@components/design/typeParameter/dataflow/Analysis/sink_analysis_qa'

/*Datamining*/
import regression_linearleastsquares_predict from '@components/design/typeParameter/dataflow/Datamining/linearleastsquares_predict'
import regression_linearleastsquares_train from '@components/design/typeParameter/dataflow/Datamining/linearleastsquares_train'
import classification_randomforest_predict from '@components/design/typeParameter/dataflow/Datamining/RandomForestPredictStep.vue'
import classification_randomforest_train from '@components/design/typeParameter/dataflow/Datamining/RandomForestTrainStep.vue'
import frequentpattern_fpgrowth from '@components/design/typeParameter/dataflow/Datamining/fpgrowth.vue'
import classification_naivebayes_train from '@components/design/typeParameter/dataflow/Datamining/naivebayes_train.vue'
import classification_naivebayes_predict from '@components/design/typeParameter/dataflow/Datamining/naivebayes_predict.vue'
import classification_logisticregression_train from '@components/design/typeParameter/dataflow/Datamining/LogisticRegressionTrain.vue'
import classification_logisticregression_predict from '@components/design/typeParameter/dataflow/Datamining/LogisticRegressionPredict.vue'
import clustering_kmeans_predict from '@components/design/typeParameter/dataflow/Datamining/clusteringkmeans_predict.vue'
import clustering_kmeans_train from '@components/design/typeParameter/dataflow/Datamining/clusteringkmeans_train.vue'
import classification_decisiontree_predict from '@components/design/typeParameter/dataflow/Datamining/decisiontree_predict.vue'
import classification_decisiontree_train from '@components/design/typeParameter/dataflow/Datamining/decisiontree_train.vue'
import classification_gradientboostedtrees_predict from '@components/design/typeParameter/dataflow/Datamining/gradientboostedtrees_predict.vue'
import classification_gradientboostedtrees_train from '@components/design/typeParameter/dataflow/Datamining/gradientboostedtrees_train.vue'

/*definesteps*/
import customize from '@components/design/typeParameter/dataflow/definesteps/customize.vue'

/**
 * steps参数 workFlow
 * ------------------------------------------------------------------
 */

/* Gateway */
import exclusive from '@components/design/typeParameter/workflow/Gateway/exclusive'
import parallel from '@components/design/typeParameter/workflow/Gateway/parallel'
import event from '@components/design/typeParameter/workflow/Gateway/event'

/* Process */
import dataflow from '@components/design/typeParameter/workflow/Process/dataflow'
import shell from '@components/design/typeParameter/workflow/Process/shell'
import spark from '@components/design/typeParameter/workflow/Process/spark'
import hive from '@components/design/typeParameter/workflow/Process/hive'
import hawq from '@components/design/typeParameter/workflow/Process/hawq'
import mapreduce from '@components/design/typeParameter/workflow/Process/mapreduce'
// import backend from '@components/design/typeParameter/workflow/Process/backend'

//组件对象(需和导入链接生成的变量同步)
var nodeCom = {
    source,
    sqlsource,
    sink,
    join,
    starjoin,
    lookup,
    union,
    split,
    sample,
    filter,
    sql,
    transform,
    cache,
    aggregate,
    top,
    decision,
    validate,
    supplement,
    sink_analysis_qa,
    exclusive,
    parallel,
    event,
    dataflow,
    shell,
    spark,
    hive,
    hawq,
    mapreduce,
    backend,
    regression_linearleastsquares_predict,
    regression_linearleastsquares_train,
    classification_randomforest_predict,
    classification_randomforest_train,
    frequentpattern_fpgrowth,
    classification_naivebayes_train,
    classification_naivebayes_predict,
    classification_logisticregression_train,
    classification_logisticregression_predict,
    clustering_kmeans_predict,
    clustering_kmeans_train,
    classification_decisiontree_predict,
    classification_decisiontree_train,
    classification_gradientboostedtrees_predict,
    classification_gradientboostedtrees_train,
    customize
}
let customizeArr = [
    'intersect',
    'source',
    'sqlsource',
    'sink',
    'join',
    'starjoin',
    'lookup',
    'union',
    'split',
    'sample',
    'filter',
    'sql',
    'transform',
    'cache',
    'aggregate',
    'top',
    'decision',
    'validate',
    'supplement',
    'sink_analysis_qa',
    'exclusive',
    'parallel',
    'event',
    'dataflow',
    'shell',
    'spark',
    'hive',
    'hawq',
    'mapreduce',
    'backend',
    'minus',
    'productjoin',
    'regression_linearleastsquares_predict',
    'regression_linearleastsquares_train',
    'classification_randomforest_predict',
    'classification_randomforest_train',
    'frequentpattern_fpgrowth',
    'classification_naivebayes_train',
    'classification_naivebayes_predict',
    'classification_logisticregression_train',
    'classification_logisticregression_predict',
    'clustering_kmeans_predict',
    'clustering_kmeans_train',
    'classification_decisiontree_predict',
    'classification_decisiontree_train',
    'classification_gradientboostedtrees_predict',
    'classification_gradientboostedtrees_train']
export function customizeSteps(val){
    if(customizeArr.indexOf(val)=='-1'){
        return 'customize'
    }else{
        return val
    }
}

//组件函数
export function nodeComp() {
    return nodeCom;
}

//字体图标的变量（需跟iconFont字体包同步）
var nodeIconFont =  {
    "source" : "source",
    "sqlsource" : "sqlsource",
    "sink" : "sink",
    "decision" : "decision",
    "validate" : "validate",
    "supplement" : "supplement",
    "sql" : "sql",
    "transform" : "transform",
    "filter" : "filter",
    "sample" : "sample",
    "lookup" : "lookup",
    "join" : "join",
    "starjoin" : "starjoin",
    "productjoin" : "productjoin",
    "aggregate" : "aggregate",
    "top" : "top",
    "union" : "union",
    "intersect" : "intersect",
    "minus" : "minus",
    "split" : "split",
    "Correlation" : "Correlation",
    "Summary" : "Summary",
    "gradientboogradientbostedtrees_predict" : "gradientboogradientbostedtrees_predict",
    "MultilayerPerceptronPredict" : "MultilayerPerceptronPredict",
    "MultilayerPerceptronTrain" : "MultilayerPerceptronTrain",
    "kmeans_predict" : "kmeans_predict",
    "kmeans_train" : "kmeans_train"
}

//classification_decisiontree_train
export function datamining(steps){
    if(steps == "classification_decisiontree_predict" ||
        steps == "classification_decisiontree_train" ||
        steps == "classification_gradientboostedtrees_predict" ||
        steps == "classification_gradientboostedtrees_train" ||
        steps == "clustering_kmeans_predict" ||
        steps == "clustering_kmeans_train" ||
        steps == "frequentpattern_fpgrowth" ||
        steps == "regression_linearleastsquares_predict" ||
        steps == "regression_linearleastsquares_train" ||
        steps == "classification_logisticregression_predict" ||
        steps == "classification_naivebayes_predict" ||
        steps == "classification_naivebayes_train" ||
        steps == "classification_randomforest_predict" ||
        steps == "classification_randomforest_train"
        ){
        return "datamining"
    }
}
//节点图标函数
export function nodeIcon(type) {
    if (type in nodeIconFont) {
        return "iconTrue";
    } else {
        return false;
    }
}

//节点类型
export function nodeClass(type) {
    switch(type){
        //dataflow 端点左1，右-1
        case "source":
        case "sqlsource":
        case "backend":
        case "streaming_source":
            return "classD_A"
            break
        //dataflow 端点左1
        case "sink":
        case "show":
            return "classD_B"
            break
        //dataflow 端点左-1，右-1
        case "union":
        case "intersect":
        case "starjoin":
            return "classD_C"
            break
        //dataflow 端点左1，右2 -1
        case "decision":
        case "split":
        case "validate":
            return "classD_D"
            break
        //dataflow 端点左2 1，右1
        case "join":
        case "productjoin":
        case "minus":
            return "classD_E"
            break
        //workflow 端点左-1，右-1
        case "dataflow":
        case "hawq":
        case "hive":
        case "mapreduce":
        case "shell":
        case "spark":
        case "event":
        case "exclusive":
        case "parallel":
        
            return "classW_C"
            break
        //other 端点左1，右1
        default:
            return "classO"
            break
    }
}
export function specialNodeClass(type) {
    switch (type){
        //dataflow 左1 右2 yse -1 no -1
        case "decision":
        case "split":
            return "classD_D1"
            break
        //dataflow 左1 右2 ok -1 error -1
        case "validate":
            return "classD_D2"
            break
        //dataflow 左2 left 1 right 1 右-1
        case "join":
        case "productjoin":
            return "classD_E1"
            break
        //dataflow 左2 input1 1 input2 1 right 1 右-1
        case "minus":
            return "classD_E2"
            break
        //worflow 特殊节点 左-1 右-1
        case "dataflow":
            return "classW_A"
            break
    }
}
export function noParme(type) {
    switch (type){
        //dataflow 无参类别
        case "intersect":
        case "minus":
        case "productjoin":
        case "analysis_qa":
            return "classN_P"
            break
    }
}
//参数声明 引用读取
export function nodeQuote(type) {
    if (type == "source") {return "quoteA"}
    if (type == "sink") {return "quoteB"}
}

//特殊节点 lookupTable cache
export function nodeCache(type) {
    return "nodeCache"
}

//端点类别
export function nodeLinks(name) {
    switch (name){
        case "input":
            return "pointA"
            break
        case "output":
            return "pointB"
            break
        case "left":
        case "right":
        case "input1":
        case "input2":
            return "pointC"
            break
        case "yes":
        case "no":
        case "ok":
        case "error":
            return "pointD"
            break
    }
}
