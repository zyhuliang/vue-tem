<template>
    <div class="step1" id='bm-ch-filesys-step1-tmp'>
        <!-- element表单组件 -->
        <el-form id="bm-ch-file-step1-form" :model="step1Form" status-icon ref="step1Form" :rules="rules"
                 class="demo-step1 demo-step1Form" label-position="top">
            <!-- 表单项，prop属性表示要进行表单验证，验证规则对应为rules的属性name -->
            <el-form-item label="任务名称" :label-width="formLabelWidth" prop="name">
                <el-input name="bm-ch-file-step1Form-name-input" type="text" v-model="step1Form.name"
                          auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="数据源" :label-width="formLabelWidth" prop="dataSource.name">
                <el-input name="bm-ch-file-step1Form-dataSource-name-input" placeholder="请选择内容"
                          v-model="step1Form.dataSource.name" class="input-with-select" @input="dataSourceInquire"
                          :readonly=true>
                    <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSourceInquire"></el-button>
                </el-input>
            </el-form-item>

            <el-form-item label="文件名表达式" :label-width="formLabelWidth" prop="dataSource.filename"
                          v-if="textShow =='FTP'">
                <el-input name="bm-ch-file-step1Form-dataSource-filename-input" type="textarea"
                          v-model="step1Form.dataSource.filename" auto-complete="off" placeholder="填写文件名表达式"></el-input>
            </el-form-item>

        </el-form>

        <!-- DataSource dialog-->
        <el-dialog v-dialog-drag title="数据源查询" :visible.sync="dialogDataSourceVisible" :close-on-click-modal="false"
                   :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass">
            <el-form>
                <data-source-inquire ref="dataSourceInquire" @thisSelectDateSourceVal="getSelectDateSourceVal"
                                     rootName="datasource_dir"></data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataSource" name='bm-ch-filesys-step1-ok-button'>确定</el-button>
                <el-button @click="cancelDatasetDialog" name='bm-ch-filesys-step1-cancel-button'>取消
                </el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
    import task from '@jsTask/taskStep.js';
    import schemaInquire from '@schemaInq/schemaInquire.vue';
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import {
        addTbaleDate,
        getSchema,
        taskRegexCheck,
        previewObject,
        previewObjectCollector,
        taskPreviewData,
        getTables,
        getColumns,
        taskNameRule
    } from '@api';

    //dataSourceTypes dataStoreTypes
    const dist = {
        "HDFS": {
            storage: "HDFS",
            dataSource: {
                format: "csv",
                path: "",
                pathMode: "recursive",
                header: "false",
                separator: ",",
                quoteChar: "\"",
                escapeChar: "\\"
            },
            dataStore: {
                format: "csv",
                path: "",
                pathMode: "recursive",
                header: "false",
                separator: ",",
                quoteChar: "\"",
                escapeChar: "\\",
                mode: "true"
            },
            expiredPeriod: 0
        },
        "HIVE": {
            storage: "HIVE",
            dataSource: {sql: "", table: "", partitionColumns: ""},
            dataStore: {sql: "", table: "", partitionColumns: ""},
            expiredPeriod: 0
        },
        "JDBC": {
            storage: "JDBC",
            dataSource: {
                DBType: "",
                chineseName: "",
                driver: "",
                url: "",
                sql: "",
                table: "",
                username: "",
                password: "",
                host: "",
                port: 3306,
                database: "",
                type: ""
            },
            dataStore: {driver: "", url: "", sql: "", table: "", user: "", password: ""},
            expiredPeriod: 0
        },
        "KAFKA": {
            storage: "KAFKA",
            dataSource: {
                format: "csv",
                zookeeper: "",
                brokers: "",
                topic: "",
                groupId: "",
                version: "",
                header: "false",
                quoteChar: "\"",
                escapeChar: "\\",
                reader: "",
                separator: ","
            },
            dataStore: {
                format: "csv",
                zookeeper: "",
                brokers: "",
                topic: "",
                groupId: "",
                version: "",
                header: "false",
                quoteChar: "\"",
                escapeChar: "\\",
                reader: "",
                separator: ","
            },
            expiredPeriod: 0
        },
        "HBASE": {
            storage: "HBASE",
            dataSource: {table: "", namespace: "", columns: []},
            dataStore: {table: "", namespace: "", columns: []},
            expiredPeriod: 0
        },
        "FTP": {
            storage: "FTP",
            dataSource: {
                host: "",
                port: "",
                fieldsSeparator: "",
                dir: "",
                username: "",
                password: "",
                type: "",
                recursive: 'true',
                secure: 'false',
            },
            dataStore: {
                host: "",
                port: "",
                fieldsSeparator: "",
                dir: "",
                username: "",
                password: "",
                recursive: 'true',
                secure: 'false',
            },
            expiredPeriod: 0
        },
        "SOCKET": {
            storage: "SOCKET",
            dataSource: {
                bind: "",
                port: "",
                protocol: "TCP",
                schemaName: "",
                schemaId: "",
                regex: "",
                operateType: "0",
                charset: "utf-8",
                type: "",
            },
            dataStore: {
                bind: "",
                port: "",
                protocol: "TCP",
                schemaName: "",
                schemaId: "",
                regex: "",
                operateType: "0",
                charset: "utf-8"
            },
            expiredPeriod: 0
        },
        "HTTP": {
            storage: "HTTP",
            dataSource: {
                parameters: "",
                properties: [{name: "", value: ""}],
                rootPath: "",
                method: "GET",
                schemaId: "",
                schemaName: "",
                type: "",
            },
            dataStore: {
                parameters: "",
                properties: [{name: "", value: ""}],
                rootPath: "",
                method: "GET",
                schemaId: "",
                schemaName: ""
            },
            expiredPeriod: 0
        },
        storeMap: {
            "HTTP": "HTTP",
            "HDFS": "HDFS",
            "KV": "HBASE",
            "FTP": "FTP",
            "MQ": "KAFKA",
            "DB": "JDBC",
            "HIVE": "HIVE",
            "SOCKET": "SOCKET"
        }
    }
    //taskEntity
    const entity = {
        id: "",
        name: "",
        dataSource: {
            id: "",
            name: "",
            url: "",
            dbType: "",
            tableExt: ""
        },
        dataStore: {
            id: "",
            type: "",
            name: ""
        },
        fieldMapping: [{sourceField: "", sourceType: "", targetField: "", targetType: "", encrypt: ""}],
        parallelism: "1",
        trigger: "",
        cursorCol: "",
        errorNumber: "0",
        partitionKey: "",
        stopOnSchemaChanged: false,
        partitionPattern: "",
    }

    export default {
        components: {
            schemaInquire,
            dataSourceInquire,
        },
        name: 'step1',
        data: function () {
            var validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入内容...'));
                } else {
                    task.$emit('fileTaskNameNextStep')
                    //获取job的id
                    var jobId = this.step1Form.jobId
                    taskNameRule('WOVEN-SERVER', value, jobId).then(res => {
                        if (!res.success) {
                            callback(new Error('此名字已存在'));
                        } else {
                            callback();
                        }
                    })
                }
            };
            return {
//			    select tables 分页
                tablePage: 0,
                tablePageSize: 50,
                lastTableKeyword: "",
                isLastPage: false,
                tables: [],
                tableList: [],
                value: '',
                loading: false,
                formLabelWidth: "200px",
                selectedNode: "",
                textShow: "DB",
                operateType: 0,
                sf: [],
                isTest: true,
                json: {},
                testText: "",
                selectedSource: {},
//                数据预览的table数值
                rowCollection: [],
                cols: [],
                dialogDataSourceVisible: false,
                dialogDataSchemaVisible: false,
                dialogDataVisible: false,
                getSelValDataSource: {},
                getSelvalDataId: '',
                getSelvalDataName: '',
//                step1Form
                step1Form: {
                    mappingSource: [],
                    dataSource: {}
                },
                rules: {
                    name: [
                        {required: true, validator: validateName, trigger: 'blur'}
                    ],
                    'dataSource.name': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'dataSource.filename': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                }
            };
        },
        watch: {
            step1: {
                handler: function (val, oldVal) {
                    //collectorStore.commit('setStep1',this.step1Form);
                }
            }
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog(){
                //关闭dialog
                this.dialogDataSourceVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            //获取子组件的dataSource entity
            getSelectDateSourceVal(data) {
                this.getSelValDataSource = data;
                if (data.type != "FTP") {
                    this.$message({
                        message: '目前只支持FTP类型,请重新选择',
                        type: 'warning'
                    });
                }
            },
            //获取子组件的DateSchema  entity
            getSelectDateSchemaVal(data) {
                this.getSelValDataSchema = data;
            },

            //弹出"dataSource查询"层
            dataSourceInquire: function () {
                this.dialogDataSourceVisible = true;
            },
            //弹出"dataSchema查询"层
            dataSchemaInquire: function () {
                this.dialogDataSchemaVisible = true;
            },

            //dataSource查询数据提交
            submitDataSource: function () {
                if (this.getSelValDataSource === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
//				    清空datasaource
                    this.step1Form.dataSource = Object.assign({}, entity.dataSource)

//					根据不同的restype更新datasource的结构
                    this.textShow = this.getSelValDataSource.type
                    this.textShow = this.textShow.toUpperCase()
                    var resType = this.textShow
                    dist[resType ? dist.storeMap[resType] : "HDFS"]
                    this.step1Form.dataSource = Object.assign(this.step1Form.dataSource, dist[resType ? dist.storeMap[resType] : "HDFS"].dataSource)

//                  根据特定类型系进行所需字段转换
                    if (resType == "DB") {
                        this.selectedSource = this.getSelValDataSource;
                        this.getSelValDataSource.attributes.selectSQL = this.getSelValDataSource.attributes.sql;
                        this.getSelValDataSource.attributes.username = this.getSelValDataSource.attributes.user;
                        this.getSelValDataSource.attributes.resType = resType;
                        this.tablePage = 0;
                        this.tablePageSize = 50;
                        this.lastTableKeyword = "";
                        this.value = '';
                        this.isLastPage = false;
                        this.fetchTable()
                    } else if (resType == "SOCKET") {
                        this.getSelValDataSource.type = 'SOCKET';
                        this.getSelValDataSource.bind = this.getSelValDataSource.attributes.ipAddress;
                    } else if (resType == "HTTP") {
                        this.getSelValDataSource.type = 'HTTP';
                    } else if (resType == "FTP") {
                        this.getSelValDataSource.type = 'FTP';
                    }

//					根据所选数据源更新step1Form的数据
                    this.copyObject(this.step1Form.dataSource, this.getSelValDataSource);
                    this.copyObject(this.step1Form.dataSource, this.getSelValDataSource.attributes);
                    this.cancelDatasetDialog();
                    this.selectDataSource(resType);
                }


            },
            //Schema查询数据提交
            /*submitSchemaData:function () {
                var that = this;
                if(that.getSelValDataSchema === ''){
                    that.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                }else {
                    that.step1Form.dataSource.schemaId = that.getSelValDataSchema.id;
                    that.step1Form.dataSource.schemaName = that.getSelValDataSchema.name;
                    that.sf.length = 0;
                    that.sf[0] = "";
                    getSchema(that.step1Form.dataSource.schemaId).then(res => {
                        that.step1Form.mappingSource.length = 0
                        res.fields.forEach(function(field){
                            that.sf.push(field.name)
                            that.step1Form.mappingSource.push({sourceField:field.name,sourceType:field.type});
                        })
                    },error =>{
                        this.$confirm(error.response.data.err,"错误", {
                            type: "error"
                        })
                    })
                    that.dialogDataSchemaVisible = false;
                }
            },*/

            //根据数据源类型判断有哪些参数需要显示配置
            selectDataSource: function (resType) {
                if (resType == "DB") {

                } else if (resType == "FTP") {

                } else if (resType == "SOCKET") {

                } else if (resType == "HTTP") {
                    var m = {};
                    this.getSelValDataSource.attributes.properties.forEach(function (e) {
                        var key = e.name;
                        var value = e.value;
                        m[key] = value;
                    })
                    this.step1Form.dataSource.properties = m;
                }
            },

            //选择source的table时获取字段信息
            getColumns: function () {
                var that = this;
                that.sf = [""];
                var sourceJson = {};
                if (that.selectedSource) {
                    sourceJson = {
                        id: that.selectedSource.id,
                        name: that.selectedSource.name,
                        type: "JDBC",
                        driver: that.selectedSource.attributes.driver,
                        url: that.selectedSource.attributes.url,
                        username: that.selectedSource.attributes.user,
                        password: that.selectedSource.attributes.password,
                        table: that.value,
                        selectSQL: "",
                        dbType: that.selectedSource.attributes.DBType
                    }
                }
                getColumns(sourceJson.id, that.value).then((results) => {
                    that.step1Form.mappingSource.length = 0
                    for (var i = 0, j = 0; i < results.length / 2, j < results.length; i += 1, j += 2) {
                        that.sf.push(results[j])
                        that.step1Form.mappingSource.push({sourceField: results[j], sourceType: results[j + 1]});
//                        that.columns.push({name: results[i], dataType: results[i + 1]})
                    }
                    that.disableSelectTable = false;
                }, error => {
                    this.$confirm(error.response.data.err, "错误", {
                        type: "error"
                    })
                })
            },

            //过滤table
            filterTable(val) {
                if (val) {
                    this.value = val;
                    this.fetchTable(val)
                } else {
                    this.tableList = this.tables
                }
            },

            //更换table
            onTableChange: function () {
                this.columns = []
                if (!this.value)
                    return;
                this.getColumns(this.value);
            },

            //缓存或者查询table的数组
            fetchTable: function (val) {
                var that = this;
                if (that.getSelValDataSource && !that.getSelValDataSource.table) {
                    that.disableSelectTable = true;
                    //如果查询条件值改变，offset归0
                    if (that.lastTableKeyword != that.value) {
                        that.tablePage = 0;
                    }
                    var getTableParams = {
                        keyword: val,
                        id: that.getSelValDataSource.id,
                        offset: that.tablePage * that.tablePageSize,
                        limit: that.tablePageSize
                    }
//                    获取tables
                    getTables(getTableParams).then(results => {
                        that.isLastPage = results.last
                        //如果上次查询条件的key和这次是同一个那么就将这次结果拼接到上次并将page+1
                        if (that.lastTableKeyword == that.value) {
                            that.tables = that.tables.concat(results.content);
                            that.tablePage++;
                            console.log(that.tables);
                        } else {
                            //如果是新的查询条件，将以前的查询tables清空并page赋值为1
                            that.lastTableKeyword = that.value;
                            that.tables.splice(0, that.tables.length)
                            that.tables = that.tables.concat(results.content);
                            that.tablePage = 1;
                        }
                        that.disableSelectTable = false;
                        that.tableList = that.tables;

                    }, error => {
                        this.$confirm(error.response.data.err, "错误", {
                            type: "error"
                        })
                    })
                }
            },

            //预览数据
            previewData: function () {
                if (this.value) {
                    var id = this.selectedSource.id;
                    var table = this.value;
                }
                var sql = "SELECT * FROM " + table;
                var selectedWhere = this.step1Form.dataSource.selectSQL ? " where " + this.step1Form.dataSource.selectSQL : "";
                selectedWhere = encodeURIComponent(selectedWhere);
                if (selectedWhere)
                    sql = sql + " " + selectedWhere
                var par = "limit:5;offset:0;rowCount:true";
                taskPreviewData(id, sql, par).then(result => {
                    this.cols = result.names;
                    var obj = result.rows.toJson
                    this.rowCollection = result.rows ? result.rows : [];
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                });
            },

            //判断是否能够测试
            changeTest: function () {
                var regex = this.step1Form.dataSource.regex;
                var testText = this.testText;
                if (regex && regex != "" && testText && testText != "")
                    this.isTest = false;
                else this.isTest = true;
            },


            //验证待测文本是否与正则表达式匹配
            testTextCheck: function () {
                var regex = this.step1Form.dataSource.regex;
                var text = this.testText;
                var schema = this.sf.toString().substr(1);
                console.log("rexpe" + regex + "   text" + text + "  schema" + schema)
                this.json.regex = regex;
                this.json.text = text;
                this.json.columns = schema;
                taskRegexCheck(this.operateType, this.json).then(rest => {
                    if (rest.success) {
                        if (rest.ret.length == 0)
                            alert("匹配结果为空")
                        else
                            alert(rest.ret)
                    } else {
                        alert("测试失败")
                    }

                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            init: function () {
                var that = this;
                //获取datasource的类型,判断显示什么数据
                that.textShow = that.step1Form.dataSource.type
                //如果是socket，获取操作类型
                if (that.textShow == 'SOCKET') {
                    that.operateType = that.step1Form.dataSource.operateType;
                }
            }
        },
        mounted() {
            if (localStorage.taskEntity) {
                //获取全局的entity
                var that = this
                that.step1Form = JSON.parse(localStorage.taskEntity);
                //将entity的表放入表选择表的临时存储值

                //如果是选择了数据源就要获取表数组
                if (that.step1Form.dataSource.id) {
                    //获取表数组
                    if (that.isCollector) {
                        that.getSelValDataSourceCol = that.step1Form.dataSource
                    } else that.getSelValDataSource = that.step1Form.dataSource
                    //如果是复制就要把jdbc变成db
                    that.step1Form.dataSource.type = that.step1Form.dataSource.type == 'JDBC' ? 'DB' : that.step1Form.dataSource.type
                    if (that.step1Form.dataSource.type == 'DB') {
                        that.fetchTable()
                    }
                    //获取数据源的信息
                    that.selectedSource = that.step1Form.dataSource
                    //如果是复制获取datasourceMapping
                    if (that.step1Form.isCopy) {
                        //初始化要存储datasource的变量
                        that.sf.length = 0;
                        that.sf[0] = "";
                        that.step1Form.mappingSource = []
                        //如果是db类型的就要获取表的字段，不是就要获取schema的字段
                        if (that.step1Form.dataSource.type == 'DB') {
                            getColumns(that.step1Form.dataSource.id, that.step1Form.dataSource.table).then((results) => {
                                that.step1Form.mappingSource.length = 0
                                for (var i = 0, j = 0; i < results.length / 2, j < results.length; i += 1, j += 2) {
                                    that.sf.push(results[j])
                                    that.step1Form.mappingSource.push({
                                        sourceField: results[j],
                                        sourceType: results[j + 1]
                                    });
//                        that.columns.push({name: results[i], dataType: results[i + 1]})
                                }
                                that.disableSelectTable = false;
                            }, error => {
                                this.$confirm(error.response.data.err, "错误", {
                                    type: "error"
                                })
                            })
                        } else {
                            /*getSchema(that.step1Form.dataSource.schemaId).then(res => {
                                that.step1Form.mappingSource.length = 0
                                res.fields.forEach(function(field){
                                    that.sf.push(field.name)
                                    that.step1Form.mappingSource.push({sourceField:field.name,sourceType:field.type});
                                })
                            },error =>{
                                this.$confirm(error.response.data.err,"错误", {
                                    type: "error"
                                })
                            })*/
                        }

                    }

                }

                this.value = this.step1Form.dataSource.table;
                console.log(this.step1Form)
                this.init()
            }
        },
        beforeRouteLeave: function (to, from, next) {
            var that = this;
            if (localStorage.taskEntity) {
                //将选择表的临时存储值放入entity
                that.step1Form.dataSource.table = this.value;
                //如果是socket那就将选择操作类型样式保存
                if (that.operateType && that.textShow == 'SOCKET') {
                    that.step1Form.dataSource.operateType = that.operateType
                }
                //获取全局的entity,转换成json
                var entity = JSON.parse(localStorage.taskEntity);
                //将局部的entity合并到全局的entity中
                that.step1Form = that.copyObject(entity, that.step1Form)
                //保存全局的entity到storage
                localStorage.taskEntity = JSON.stringify(that.step1Form);
                console.log(that.step1Form)
                console.log(localStorage.taskEntity)
            }
            //如果在向导中跳转
            if (to.path.substr(0, 20) == '/fileTaskWizard/step') {
                //如果验证都通过才可以下一步
                that.$refs.step1Form.validate((valid) => {
                    if (valid) {
                        next();
                    } else {
                        //获取从第几步到第几步
                        var fromStep = from.path.charAt(from.path.indexOf('fileTaskWizard/step') + 19)
                        task.$emit('fileTaskNextStep', fromStep)
                        return false;
                    }
                })
            } else {
                localStorage.removeItem('taskEntity');
                next();
            }
        },
    }
</script>
<style lang="scss" scoped>
    .step1 {
        height: calc(100vh - 187px);
        overflow-y: auto;
        .form-selet {
            width: 100%;
        }
        .demo-step1 {
            margin-left: 25%;
            width: 50%;
            background-color: rgba(255, 255, 255, .9);
        }
        .pre-tab {
            width: 100%;
            min-height: 50px;
            margin-top: 5px;
            margin-bottom: 15px;
        }
    }
</style>
