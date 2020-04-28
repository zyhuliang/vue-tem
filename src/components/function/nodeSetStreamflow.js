﻿/**
 * ------------------------------------------------------------------
 * nodeSet.js   节点配置
 * ------------------------------------------------------------------
 */
/**
 * steps参数 streamflow
 * ------------------------------------------------------------------
 */

/* IO */
import streaming_source from '@components/design/typeParameter/streamflow/IO/streamingSource'
import source from '@components/design/typeParameter/streamflow/IO/source'
import sqlsource from '@components/design/typeParameter/streamflow/IO/sqlSource'
import sink from '@components/design/typeParameter/streamflow/IO/sink'

/* Join */
import join from '@components/design/typeParameter/streamflow/Join/join'
import starjoin from '@components/design/typeParameter/streamflow/Join/starjoin'
import lookup from '@components/design/typeParameter/streamflow/Join/lookup'

/* Set */
import union from '@components/design/typeParameter/streamflow/Set/union'
import split from '@components/design/typeParameter/streamflow/Set/split'
import deduplication from '@components/design/typeParameter/streamflow/Set/deduplication'

/* Transform */
import sample from '@components/design/typeParameter/streamflow/Transform/sample'
import filter from '@components/design/typeParameter/streamflow/Transform/filter'
import sql from '@components/design/typeParameter/streamflow/Transform/sql'
import transform from '@components/design/typeParameter/streamflow/Transform/transform'

/* mapping */
import cache from '@components/design/typeParameter/streamflow/Mapping/lookupTable'

/* Group */
import aggregate from '@components/design/typeParameter/streamflow/Group/aggregate'
import top from '@components/design/typeParameter/streamflow/Group/top'

/* Gateway */
import decision from '@components/design/typeParameter/streamflow/Gateway/decision'
import validate from '@components/design/typeParameter/streamflow/Gateway/validate'
import supplement from '@components/design/typeParameter/streamflow/Gateway/supplement'

/*Datamining*/
import regression_linearleastsquares_predict from '@components/design/typeParameter/streamflow/Datamining/linearleastsquares_predict'
import regression_linearleastsquares_train from '@components/design/typeParameter/streamflow/Datamining/linearleastsquares_train'
import classification_randomforest_predict from '@components/design/typeParameter/streamflow/Datamining/RandomForestPredictStep.vue'
import classification_randomforest_train from '@components/design/typeParameter/streamflow/Datamining/RandomForestTrainStep.vue'

//组件对象(需和导入链接生成的变量同步)
var nodeCom = {
    source,
    streaming_source,
    sqlsource,
    sink,
    join,
    starjoin,
    lookup,
    union,
    split,
    sample,
    deduplication,
    filter,
    sql,
    transform,
    cache,
    aggregate,
    top,
    decision,
    validate,
    supplement,
    regression_linearleastsquares_predict,
    regression_linearleastsquares_train,
    classification_randomforest_predict,
    classification_randomforest_train
}

//组件函数
export function nodeComp() {
    return nodeCom;
}

//字体图标的变量（需跟iconFont字体包同步）
var nodeIconFont =  {
    "source" : "source",
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
    "fpgrowth" : "fpgrowth",
    "decisiontree_predict" : "decisiontree_predict",
    "decisiontree_train" : "decisiontree_train",
    "gradientboogradientbostedtrees_predict" : "gradientboogradientbostedtrees_predict",
    "MultilayerPerceptronPredict" : "MultilayerPerceptronPredict",
    "MultilayerPerceptronTrain" : "MultilayerPerceptronTrain",
    "LogisticRegressionPredict" : "LogisticRegressionPredict",
    "LogisticRegressionTrain" : "LogisticRegressionTrain",
    "naivebayes_predict" : "naivebayes_predict",
    "naivebayes_train" : "naivebayes_train",
    "kmeans_predict" : "kmeans_predict",
    "kmeans_train" : "kmeans_train"
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
    //左侧无，右侧一个起点
    if (type == "source"  || type == 'streaming_source') {
        return "classD_A" // 右（一个 多输出） dataflow
    } else if (type == "sink" || type == "show" ) {
        return "classD_B" //左（一个 单输入) dataflow
    } else if (type == "union" || type == "intersect" || type == "starjoin") {
        return "classD_C" //左（一个 多输入） 右（一个 多输出） dataflow
    } else if (type == "decision" || type == "split" || type == "validate") {
        return "classD_D" //左（一个 单输入） 右（两个 多输出） dataflow
    } else if (type == "join" || type == "productjoin" || type == "minus") {
        return "classD_E" //左（两个 单输入） 右（一个 多输出） dataflow
    } else if (type == "dataflow" || type == "hawq" || type == "hive" || type == "mapreduce" || type == "shell" || type ==
        "spark" || type == "event" || type == "exclusive" || type == "parallel") {
        return "classW_C" //左（一个 多输入） 右（一个 多输出） workflow
    } else {
        return "classO" //其他 左（一个 单输入） 右（一个 多输出）
    }
}
export function specialNodeClass(type) {

    if (type == "decision" || type == "split") {
        return "classD_D1" //左（一个 单输入） 右（两个（yse、no） 多输出） dataflow
    } else if (type == "validate") {
        return "classD_D2" //左（一个 单输入） 右（两个（ok、error） 多输出）dataflow
    } else if (type == "join" || type == "productjoin") {
        return "classD_E1" //左（两个（left、right） 单输入） 右（一个 多输出） dataflow
    } else if (type == "minus") {
        return "classD_E2" //左（两个（input1、input2） 单输入） 右（一个 多输出） dataflow
    } else if (type == "dataflow") {
        return "classW_A" //左（一个 多输入） 右（一个 多输出）   workflow 特殊节点
    }

}
export function noParme(type) {
    if (type == "intersect" || type == "minus" || type == "analysis_qa") {
        return "classN_P" //无参类型 dataflow
    }
}
//参数声明 引用读取
export function nodeQuote(type) {
    if (type == "source") {
        return "quoteA"
    }
    if (type == "sink") {
        return "quoteB"
    }
}

//特殊节点 lookupTable cache
export function nodeCache(type) {
    return "nodeCache"
}

//端点类别
export function nodeLinks(name) {
    if (name == "input") {
        return "pointA"
    } else if (name == "output") {
        return "pointB"
    } else if (name == "left" || name == "right" || name == "input1" || name == "input2") {
        return "pointC"
    } else if (name == "yes" || name == "no" || name == "ok" || name == "error") {
        return "pointD"
    }
}
