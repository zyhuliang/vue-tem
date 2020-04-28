import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex);

// 定义采集任务的entity字段 taskEntity
const entity = {
    id:"",
    name:"",
    dataSource:{
        id:"",
        name:"",
        url : "",
        dbType:"",
        tableExt:""
    },
    dataStore:{
        id:"",
        type:"",
        name:""
    },
    fieldMapping:[{sourceField:"",sourceType:"",targetField:"",targetType:"",encrypt:""}],
    parallelism:"1",
    trigger:"",
    cursorCol:"",
    errorNumber:"0",
    partitionKey:"",
    stopOnSchemaChanged:false,
    partitionPattern:"",
}

//定义不同类型的数据集合数据源所需的字段 dataSourceTypes dataStoreTypes
const dist = {
    "HDFS": {
        storage: "HDFS",
        dataSource: {format: "csv", path: "", pathMode:"exact", header: "false", separator: ",", quoteChar: "\"", escapeChar: "\\"},
        dataStore: {format: "csv", path: "", pathMode:"exact", header: "false", separator: ",", quoteChar: "\"", escapeChar: "\\",mode:"true"},
        expiredPeriod : 0
    },
    "HIVE": {
        storage: "HIVE",
        dataSource: { sql: "", table: "", partitionColumns: ""},
        dataStore: { sql: "", table: "", partitionColumns: ""},
        expiredPeriod : 0
    },
    "JDBC": {
        storage: "JDBC",
        dataSource: { DBType: "",chineseName: "", driver: "", url: "", sql: "", table: "", username: "", password: "",host: "",port: 3306,database: "",type:""},
        dataStore: { driver: "", url: "", sql: "", table: "", user: "", password: ""},
        expiredPeriod : 0
    },
    "KAFKA": {
        storage: "KAFKA",
        dataSource: {format : "csv", zookeeper:"", brokers: "", topic: "", groupId: "",version:"", header:"false",quoteChar :"\"", escapeChar :"\\", reader:"", separator: ","},
        dataStore: {format : "csv", zookeeper:"", brokers: "", topic: "", groupId: "",version:"", header:"false",quoteChar:"\"",escapeChar:"\\",reader:"", separator: ","},
        expiredPeriod : 0
    },
    "HBASE": {
        storage: "HBASE",
        dataSource: { table: "", namespace: "", columns: []},
        dataStore: { table: "", namespace: "", columns: []},
        expiredPeriod : 0
    },
    "FTP": {
        storage: "FTP",
        dataSource: { host: "", port: "",fieldsSeparator: "", dir: "", username: "", password: "",recursive:'true',secure:'false',},
        dataStore: { host: "", port: "",fieldsSeparator: "", dir: "", username: "", password: "",recursive:'true',secure:'false',},
        expiredPeriod : 0
    },
    "SOCKET" :{
        storage: "SOCKET",
        dataSource: {bind: "", port: "", protocol: "TCP", schemaName:"", schemaId:"", regex:"" ,operateType:"0", charset:"utf-8", type:"", },
        dataStore: {bind: "", port: "", protocol: "TCP", schemaName:"", schemaId:"", regex:"" ,operateType:"0", charset:"utf-8"},
        expiredPeriod : 0
    },
    "HTTP":{
        storage: "HTTP",
        dataSource:{parameters:"",properties:[{name:"",value:""}],rootPath :"", method :"GET",schemaId:"",schemaName:"", type:"", },
        dataStore: {parameters:"",properties:[{name:"",value:""}],rootPath :"", method :"GET",schemaId:"",schemaName:""},
        expiredPeriod : 0
    },
    storeMap: {
        "HTTP":"HTTP",
        "HDFS": "HDFS",
        "KV":"HBASE",
        "FTP":"FTP",
        "MQ":"KAFKA",
        "DB":"JDBC",
        "HIVE":"HIVE",
        "SOCKET":"SOCKET"
    }
}

//创建store
var collectorStore =  new Vuex.Store({
    state:{
        //存放组件之间共享的数据
        entity,
        dist,
    },
    mutations:{
        //显式的更改state里的数据
        setStep1:function (state, data) {
            Object.assign(state.entity, data);
        }
    },
    getters:{
        //获取数据的方法
    },
    actions:{
        //
    }
});

export default new Vue({
    store:collectorStore,
    mounted:function(){
       
    }
});
