<template>
    <div id='bm-ch-col-step1-tmp' class="step1">
        <!-- element表单组件 -->
        <el-form id="bm-ch-step1-form" :model="step1Form" status-icon :rules="rules" ref="step1Form" class="demo-step1"
                 label-position="top" v-loading="loading">
            <!-- 表单项，prop属性表示要进行表单验证，验证规则对应为rules的属性name -->
            <el-form-item label="任务名称" :label-width="formLabelWidth" prop="name">
                <el-input name="bm-ch-step1Form-name-input" type="text" v-model="step1Form.name"
                          auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="数据源" :label-width="formLabelWidth" prop="dataSource.name">
                <el-input name="bm-ch-step1Form-datasource-input" placeholder="请选择内容"
                          v-model="step1Form.dataSource.name" class="input-with-select" @input="dataSourceInquire"
                          disabled>
                    <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSourceInquire"></el-button>
                </el-input>
            </el-form-item>

            <el-form-item label="表选择" :label-width="formLabelWidth" v-if="textShow =='DB'" prop="value">
                <el-select
                        class="form-selet"
                        v-model="value"
                        filterable
                        placeholder="输入表/视图名显示查询结果..."
                        :filter-method="filterTable"
                        prop="dataSource.table"
                        @visible-change="onTableChange"
                        name="bm-ch-step1Form-table-select"
                >
                    <el-option
                            v-for="item in tableList"
                            :key="item"
                            :value="item"
                            :label="item"
                    >
                    </el-option>
                    <el-button style="align-content: center;width: 100%" @click="fetchTable(value)" v-if="!isLastPage">
                        加载更多......
                    </el-button>
                </el-select>
            </el-form-item>

            <el-form-item label="扩展表" :label-width="formLabelWidth" prop="dataSource.tableExt" v-if="textShow =='DB'">
                <el-input name="bm-ch-step1Form-datasource-tableExt-input" type="text"
                          v-model="step1Form.dataSource.tableExt" auto-complete="off"
                          placeholder="请填写扩展表的表达式！"></el-input>
                <el-tooltip content="扩展表格式,  #FUNC_NAME(ARGS)#
                    1. 动态获取当前日期, 如表名为Table1, 表达式Table1_#DATE(yyyy_MM_dd)#,
                    可获得Table1_ 2018_03_23" effect="dark" placement="top">
                    111<i class="parIcon el-icon-warning"></i>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="选择操作类型" :label-width="formLabelWidth" v-if="textShow =='SOCKET'">
                <el-radio-group name="bm-ch-step1Form-datasource-operateType-rasio" prop="dataSource.operateType"
                                v-model="operateType" @click="click1()">
                    <el-radio :label="0">原样</el-radio>
                    <el-radio :label="1">抽取</el-radio>
                    <el-radio :label="2">分割</el-radio>
                    <el-radio :label="3">过滤</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="游标批量大小" :label-width="formLabelWidth" prop="dataSource.fetchSize"
                          v-if="textShow =='DB'">
                <el-input name="bm-ch-step1Form-datasource-fetchSize-input" type="text"
                          v-model="step1Form.dataSource.fetchSize" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="查询超时" :label-width="formLabelWidth" prop="dataSource.queryTimeout"
                          v-if="textShow =='DB'">
                <el-input name="bm-ch-step1Form-datasource-queryTimeout-input" type="text"
                          v-model="step1Form.dataSource.queryTimeout" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="数据过滤" :label-width="formLabelWidth" prop="dataSource.selectSQL" v-if="textShow =='DB'">
                <el-input name="bm-ch-step1Form-datasource-selectSQL-input" type="text"
                          v-model="step1Form.dataSource.selectSQL" auto-complete="off"
                          placeholder="按照sql语法填写where部分，但是不需要写where关键字"></el-input>
            </el-form-item>

            <el-form-item label="字符集" :label-width="formLabelWidth" prop="dataSource.charset"
                          v-if="textShow =='SOCKET'">
                <el-input name="bm-ch-step1Form-datasource-charset-input" type="text"
                          v-model="step1Form.dataSource.charset" auto-complete="off" placeholder="字符集"></el-input>
            </el-form-item>

            <el-form-item label="元数据" :label-width="formLabelWidth" prop="dataSource.schemaName"
                          v-if="textShow !='DB' ">
                <el-input name="bm-ch-step1Form-datasource-schemaName-input" v-model="step1Form.dataSource.schemaName"
                          placeholder="请选择内容(必填)" class="input-form-width" @input="schemaInquire" disabled>
                    <el-button slot="append" icon="icon iconfont icon-ir-search" @click="schemaInquire"></el-button>
                </el-input>
            </el-form-item>

            <el-form-item label="文件名" :label-width="formLabelWidth" prop="dataSource.filename" v-if="textShow =='FTP'">
                <el-input name="bm-ch-step1Form-datasource-filename-input" type="textarea"
                          v-model="step1Form.dataSource.filename" auto-complete="off" placeholder="填写文件名"></el-input>
            </el-form-item>

            <el-form-item label="数据过滤" :label-width="formLabelWidth" prop="dataSource.parameters"
                          v-if="textShow =='HTTP'">
                <el-input name="bm-ch-step1Form-datasource-parameters-input" type="textarea"
                          v-model="step1Form.dataSource.parameters" auto-complete="off" placeholder="填写过滤条件"></el-input>
            </el-form-item>

            <el-form-item label="正则表达式" :label-width="formLabelWidth" prop="dataSource.regex"
                          v-if="textShow =='SOCKET' && operateType != 0">
                <el-input name="bm-ch-step1Form-datasource-regex-input" type="textarea"
                          v-model="step1Form.dataSource.regex" auto-complete="off" placeholder="正则表达式(必填)"></el-input>
            </el-form-item>

            <el-form-item label="待测文本" :label-width="formLabelWidth" prop="testText"
                          v-if="textShow =='SOCKET' && operateType != 0">
                <el-input name="bm-ch-step1Form-testText-input" type="textarea" v-model="testText" auto-complete="off"
                          placeholder="待测文本" @input="changeTest"></el-input>
            </el-form-item>

            <el-form-item label="集合名称" :label-width="formLabelWidth" prop="dataSource.collection"
                          v-if="textShow =='MONGODB'">
                <el-input name="bm-ch-step1Form-datasource-collection-input" type="text"
                          v-model="step1Form.dataSource.collection" auto-complete="off" placeholder="集合名称"></el-input>
            </el-form-item>
            <el-form-item label="数据过滤" :label-width="formLabelWidth" prop="dataSource.query"
                          v-if="textShow =='MONGODB'">
                <el-input name="bm-ch-step1Form-datasource-query-input" type="text" v-model="step1Form.dataSource.query"
                          auto-complete="off" placeholder="数据过滤"></el-input>
            </el-form-item>
            <el-form-item label="数据过滤" :label-width="formLabelWidth" prop="dataSource.filter" v-if=" textShow =='ES'">
                <el-input name="bm-ch-step1Form-datasource-filter-input" type="text"
                          v-model="step1Form.dataSource.filter" auto-complete="off" placeholder="数据过滤"></el-input>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth" v-if="textShow =='SOCKET' && operateType != 0">
                <el-button name="bm-ch-step1Form-text-button" class="btn btn-primary" :disabled="isTest"
                           @click="testTextCheck()">测试
                </el-button>
            </el-form-item>

            <!--预览数据-->
            <el-form-item :label-width="formLabelWidth" v-if="textShow =='DB'">
				<span>
                    <el-button name="bm-ch-step1Form-datasource-refrensh-button" type="primary" @click="previewData()">刷新</el-button>
					<el-table id="bm-ch-collector-step1-table" :data="rowCollection" class="pre-tab"
                              height="calc(100vh - 400px)">
						<tr v-for="(col, index) in cols">
							<el-table-column :prop="col[index]" :label="col">
								<template slot-scope="scope">
									{{scope.row[index]}}
								</template>
							</el-table-column>
						</tr>

                    </el-table>
				</span>
            </el-form-item>

        </el-form>

        <!-- DataSource dialog-->
        <el-dialog title="数据源查询" :visible.sync="dialogDataSourceVisible" :close-on-click-modal="false"
                   :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass">
            <el-form id="bm-sh-ds1-form">
                <data-source-inquire ref="dataSourceInquire" @thisSelectDateSourceVal="getSelectDateSourceVal" rootName="datasource_dir"
                                     :collectorId="step1Form.resourceId"></data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataSource" name="bm-ch-step1Form-datasource-ok">确定</el-button>
                <el-button @click="cancelDatasetDialog" name="bm-ch-step1Form-datasource-cancel">取消
                </el-button>
            </div>
        </el-dialog>
        <el-dialog
                :visible.sync="dialogDataSchemaVisible"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                title="元数据查询"
                custom-class="dialogClass"
        >
            <el-form id="bm-sh-ds2-form">
                <schema-inquire @thisSelectSchemaVal="getSelectDateSchemaVal"></schema-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSchemaData()" name="bm-ch-step1Form-schema-ok">确定</el-button>
                <el-button @click="dialogDataSchemaVisible=false" name="bm-ch-step1Form-schema-cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import task from '@jsTask/taskStep.js';
    import schemaInquire from '@schemaInq/schemaInquire.vue';
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import {
        getSchema,
        taskRegexCheck,
        previewObjectCollector,
        taskPreviewData,
        getTables,
        getColumns,
        getCollectorTable,
        getCollectorColumns,
        postCollectorCheck,
        taskNameRule
    } from '@api';

    //dataSourceTypes dataStoreTypes
    const dist = {
        "HDFS": {
            storage: "HDFS",
            dataSource: {
                format: "csv",
                path: "",
                pathMode: "exact",
                header: "false",
                separator: ",",
                quoteChar: "\"",
                escapeChar: "\\"
            },
            dataStore: {
                format: "csv",
                path: "",
                pathMode: "exact",
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
                version: "",
                url: "",
                sql: "",
                table: "",
                username: "",
                password: "",
                host: "",
                port: 3306,
                database: "",
                type: "",
                catalog: "",
                schema: "",
                fetchSize: 0,
                queryTimeout: 0,
                dateToTimestamp: ''
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
                skipHeader: 'false',
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
                skipHeader: 'false',
            },
            expiredPeriod: 0
        },
        "SOCKET": {
            storage: "SOCKET",
            dataSource: {
                bind: "",
                port: "",
                protocol: "TCP",
                schemaId: "",
                operateType: 0,
                charset: "utf-8",
                type: "",
            },
            dataStore: {bind: "", port: "", protocol: "TCP", schemaId: "", operateType: 0, charset: "utf-8"},
            expiredPeriod: 0
        },
        "MONGODB": {
            storage: "MONGODB",
            dataSource: {
                address: "",
                port: "",
                username: "",
                password: "",
                database: "",
                schemaId: "",
                type: "MONGODB",
                query: ''
            },
            dataStore: {
                address: "",
                port: "",
                username: "",
                password: "",
                database: "",
                schemaId: "",
                type: "MONGODB",
                query: ''
            },
            expiredPeriod: 0
        },
        "ES": {
            storage: "ES",

            dataSource: {
                clusterName: "",
                ipAddresses: "",
                index: "",
                indexType: "",
                version: "1.x",
                schemaId: "",
                type: "ES",
                filter: ''
            },
            dataStore: {
                clusterName: "",
                ipAddresses: "",
                index: "",
                indexType: "",
                version: "1.x",
                schemaId: "",
                type: "ES",
                filter: ''
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
                type: "",
            },
            dataStore: {
                parameters: "",
                properties: [{name: "", value: ""}],
                rootPath: "",
                method: "GET",
                schemaId: "",
            },
            expiredPeriod: 0
        },
        "LOCALFS": {
            storage: "LOCALFS",
            dataSource: {
                type: "",
                schemaId: "",
                encoder: "UTF-8",
                path: ""
            },
            dataStore: {
                type: "",
                encoder: "UTF-8",
                path: "",
                schemaId: "",
            },
            expiredPeriod: 0
        },
        storeMap: {
            "HTTP": "HTTP",
            "LOCALFS": "LOCALFS",
            "HDFS": "HDFS",
            "KV": "HBASE",
            "FTP": "FTP",
            "MQ": "KAFKA",
            "DB": "JDBC",
            "HIVE": "HIVE",
            "SOCKET": "SOCKET",
            "MONGODB": "MONGODB",
            "ES": "ES",
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
            tableExt: "",
            fetchSize: 0,
            queryTimeout: 0,
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
            dataSourceInquire
        },
        name: 'step1',
        data: function () {
            var validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入内容...'));
                } else if (value) {
                    task.$emit('taskNameNextStep')
                    //获取job的id
                    var jobId = this.step1Form.jobId
                    taskNameRule(this.step1Form.collecterId, value, jobId).then(res => {
                        if (!res.success) {
                            callback(new Error('此名字已存在'));
                        } else {
                            callback();
                        }
                    })
                }
            };
            return {
                tablePage: 0,
                tablePageSize: 50,
                lastTableKeyword: "",
                isLastPage: false,
                tables: [],
                tableList: [],
                value: '',
                loading: false,
                isCollector: false,
                formLabelWidth: "200px",
                selectedNode: "",
                textShow: "DB",
                operateType: 0,
                sf: [],
                isTest: true,
                json: {},
                testText: "",
                selectedSource: {},
                rowCollection: [],//数据预览的table数值
                cols: [],
                dialogDataSourceVisible: false,
                dialogDataSchemaVisible: false,
                dialogDataVisible: false,
                getSelValDataSource: {},
                getSelvalDataId: '',
                getSelvalDataName: '',
                step1Form: {
                    mappingSource: [],
                    dataSource: {}
                },
                rules: {
                    name: [
                        {required: true, validator: validateName, trigger: 'change'}
                    ],
                    'dataSource.name': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'dataSource.schemaName': [
                        {required: true, message: '请输入内容123...', trigger: 'blur'}
                    ],
                    'dataSource.filename': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'dataSource.regex': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'dataSource.collection': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'dataSource.fetchSize': [
                        {
                            validator(rule, value, callback) {
                                var errors = [];
                                if (!value && value != 0) {
                                    callback('游标批量大小不能为空....');
                                }
                                if (!/^[0-9]+$/.test(value)) {
                                    callback('游标批量大小必须为数字值....');
                                }
                                callback(errors);

                            }
                        }
                    ],
                    'dataSource.queryTimeout': [
                        {
                            validator(rule, value, callback) {
                                var errors = [];
                                if (!value && value != 0) {
                                    callback('查询超时不能为空....');
                                }
                                if (!/^[0-9]+$/.test(value)) {
                                    callback('查询超时必须为数字值....');
                                }
                                callback(errors);
                            }
                        }
                    ],
                }
            };
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
            schemaInquire: function () {
                this.dialogDataSchemaVisible = true;
            },

            //dataSource查询数据提交
            submitDataSource: function () {
                var getSelVal = this.getSelValDataSource;
                if (getSelVal === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
                    //清空校验,但是保留name字段
                    var nameTmp = this.step1Form.name;
                    this.$refs.step1Form.clearValidate();
                    this.step1Form.name = nameTmp
                    //清空datasaource
                    this.step1Form.dataSource = Object.assign({}, entity.dataSource)
                    //根据不同的restype更新datasource的结构
                    this.textShow = getSelVal.type
                    this.textShow = this.textShow == 'MONGODB' ? this.textShow : this.textShow.toUpperCase()
                    var resType = this.textShow
                    dist[resType ? dist.storeMap[resType] : "HDFS"]
                    this.step1Form.dataSource = Object.assign(this.step1Form.dataSource, dist[resType ? dist.storeMap[resType] : "HDFS"].dataSource)
                    // 将数据源的数据添加到dom树上进行实时监听
                    var dataSourceTmp = dist[resType ? dist.storeMap[resType] : "HDFS"].dataSource
                    var dataSourceKeyTmp = Object.keys(dataSourceTmp)
                    for (var i = 0; i < dataSourceKeyTmp.length; i++) {
                        this.$set(this.step1Form.dataSource, dataSourceKeyTmp[i], dataSourceTmp[dataSourceKeyTmp[i]])
                    }
                    //根据特定类型系进行所需字段转换
                    if (resType == "DB") {
                        this.selectedSource = getSelVal;
                        getSelVal.attributes.dateToTimestamp = getSelVal.attributes.dateToTimestamp;
                        getSelVal.attributes.version? getSelVal.attributes.version = getSelVal.attributes.version: '';
                        getSelVal.attributes.selectSQL = getSelVal.attributes.sql;
                        getSelVal.attributes.username = getSelVal.attributes.user;
                        getSelVal.attributes.resType = resType;
                        this.tablePage = 0;
                        this.tablePageSize = 50;
                        this.lastTableKeyword = "";
                        this.value = '';
                        this.isLastPage = false;
                        this.tables = [];
                        this.fetchTable()
                    } else if (resType == "SOCKET") {
                        getSelVal.type = 'SOCKET';
                        getSelVal.bind = getSelVal.attributes.ipAddress;
                    } else getSelVal.type = resType
                    //根据所选数据源更新step1Form的数据
                    this.copyObject(this.step1Form.dataSource, getSelVal);
                    //将driver里面的name去掉，以免影响数据源的name
                    delete getSelVal.attributes.name
                    this.copyObject(this.step1Form.dataSource, getSelVal.attributes);
                    this.cancelDatasetDialog()
                    this.selectDataSource(resType);
                }
            },
            //Schema查询数据提交
            submitSchemaData: function () {
                var that = this;
                if (that.getSelValDataSchema === '') {
                    that.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
                    that.step1Form.dataSource.schemaId = that.getSelValDataSchema.id;
                    that.step1Form.dataSource.schemaName = that.getSelValDataSchema.name;
                    that.sf.length = 0;
                    that.sf[0] = "";
                    getSchema(that.step1Form.dataSource.schemaId).then(res => {
                        that.step1Form.mappingSource.length = 0
                        res.fields.forEach(function (field) {
                            that.sf.push(field.name)
                            that.step1Form.mappingSource.push({sourceField: field.name, sourceType: field.type});
                        })
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                    that.dialogDataSchemaVisible = false;
                }
            },

            //根据数据源类型判断有哪些参数需要显示配置
            selectDataSource: function (resType) {
                if (resType == "HTTP") {
                    var object = {};
                    var getSelVal = this.getSelValDataSource;
                    getSelVal.attributes.properties.forEach(function (e) {
                        var key = e.name;
                        var value = e.value;
                        object[key] = value;
                    })
                    this.step1Form.dataSource.properties = object;
                }
            },

            //选择source的table时获取字段信息
            getColumns: function () {
                var that = this;
                that.sf = [""];
                var sourceJson = {};
                if (Object.keys(that.selectedSource).length != 0 && that.value) {
                    sourceJson = {
                        id: that.selectedSource.id,
                        name: that.selectedSource.name,
                        type: "JDBC",
                        driver: that.selectedSource.driver ? that.selectedSource.driver : that.selectedSource.attributes.driver,
                        version: that.selectedSource.version ? that.selectedSource.version :(that.selectedSource.driver.toLowerCase().indexOf('oracle')> -1 ? '': undefined),
                        url: that.selectedSource.url ? that.selectedSource.url : that.selectedSource.attributes.url,
                        username: that.selectedSource.username ? that.selectedSource.username : that.selectedSource.attributes.user,
                        dateToTimestamp: that.selectedSource.dateToTimestamp ? that.selectedSource.dateToTimestamp : false,
                        password: that.selectedSource.password ? that.selectedSource.password : that.selectedSource.attributes.password,
                        table: that.value,
                        selectSQL: "",
                        dbType: that.selectedSource.DBType ? that.selectedSource.DBType : that.selectedSource.type ? that.selectedSource.type : that.selectedSource.attributes.DBType
                    }
                    if (that.isCollector) {
                        var that = this;
                        that.loading = true
                        //如果是采集器的获取字段，就要检查字段是否更新了
                        postCollectorCheck(that.step1Form.collecterId, sourceJson).then(res => {
                            that.loading = false
                            //如果没有变化就发请求
                            if (!res.success) {
                                if (res.errorMg == "get database connection failed.") {
                                    this.$message({
                                        message: '数据库链接失败',
                                        type: "error"
                                    })
                                } else {
                                    this.$message({
                                        message: '选择表的结构在数据源中已被修改，您可以继续执行，或者重新同步源数据',
                                        type: "error"
                                    })
                                }
                            }
                            that.loading = true
                            getCollectorColumns(sourceJson.id, that.step1Form.collecterId, that.value).then((results) => {
                                that.loading = false
                                //如果是采集器并且返回的字段为空，可能是没有元数据同步
                                if (that.isCollector && results.length == 0) {
                                    this.$message({
                                        message: '列表为空，请同步源数据',
                                        type: "error"
                                    })
                                } else {
                                    that.step1Form.mappingSource.length = 0
                                    for (var i = 0, j = 0; i < results.length / 2, j < results.length; i += 1, j += 2) {
                                        that.sf.push(results[j])
                                        that.step1Form.mappingSource.push({
                                            sourceField: results[j],
                                            sourceType: results[j + 1]
                                        });
                                        //that.columns.push({name: results[i], dataType: results[i + 1]})
                                    }
                                    that.disableSelectTable = false;
                                }
                            }, err => {
                                that.loading = false
                                this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            })
                        }, err => {
                            that.loading = false
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    } else {
                        //数据导入的获取表
                        that.loading = true
                        getColumns(sourceJson.id, that.value).then((results) => {
                            that.loading = false
                            //如果返回的字段为空，可能是数据库连接错误
                            if (results.length == 0) {
                                this.$message({
                                    message: '列表为空，请确认数据库连接成功！',
                                    type: 'error',
                                });
                            } else {
                                that.step1Form.mappingSource.length = 0
                                for (var i = 0, j = 0; i < results.length / 2, j < results.length; i += 1, j += 2) {
                                    that.sf.push(results[j])
                                    that.step1Form.mappingSource.push({
                                        sourceField: results[j],
                                        sourceType: results[j + 1]
                                    });
                                    //that.columns.push({name: results[i], dataType: results[i + 1]})
                                }
                                that.disableSelectTable = false;
                            }
                        }, err => {
                            that.loading = false
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    }
                }
                //如果是更换了表，字段映射数据源的字段清空
                if (that.value != that.step1Form.dataSource.table) {
                    that.step1Form.fieldMapping.forEach(function (item) {
                        item.sourceField = ""
                        item.sourceType = ""
                    })
                }
            },

            //过滤table
            filterTable(val) {
                if (val != undefined) {
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
                var getSelVal = that.getSelValDataSource;
                if (getSelVal) {
                    that.disableSelectTable = true;
                    //如果查询条件值改变，offset归0
                    if (that.lastTableKeyword != that.value) {
                        that.tablePage = 0;
                    }
                    var getTableParams = {
                        keyword: val,
                        id: getSelVal.id,
                        offset: that.tablePage * that.tablePageSize,
                        limit: that.tablePageSize
                    }
                    //获取tables
                    var getTablesUrl = that.isCollector ? getCollectorTable(that.step1Form.collecterId, getSelVal.id, getTableParams) : getTables(getTableParams)
                    that.loading = true
                    getTablesUrl.then(results => {
                        that.loading = false
                        that.isLastPage = results.last
                        //如果上次查询条件的key和这次是同一个那么就将这次结果拼接到上次并将page+1
                        if (that.lastTableKeyword == that.value) {
                            that.tables = that.tables.concat(results.content);
                            that.tablePage++;
                        } else {
                            //如果是新的查询条件，将以前的查询tables清空并page赋值为1
                            that.lastTableKeyword = that.value;
                            that.tables.splice(0, that.tables.length)
                            that.tables = that.tables.concat(results.content);
                            that.tablePage = 1;
                        }
                        that.disableSelectTable = false;
                        that.tableList = that.tables;
                    }, err => {
                        that.loading = false
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },

            //预览数据
            previewData: function () {
                var that = this;
                if (that.value) {
                    var id = that.selectedSource.id;
                    var table = that.value;
                }
                var sql = "SELECT * FROM " + table;
                var selectedWhere = that.step1Form.dataSource.selectSQL ? " where " + that.step1Form.dataSource.selectSQL : "";
                selectedWhere = encodeURIComponent(selectedWhere);
                if (selectedWhere)
                    sql = sql + " " + selectedWhere
                var par = "limit:5;offset:0;rowCount:true;table:" + table;
                var preData = that.isCollector ? previewObjectCollector(that.step1Form.collecterId, id, sql, par) : taskPreviewData(id, sql, par)
                preData.then(result => {
                    that.cols = result.names;
                    that.rowCollection = result.rows ? result.rows : [];
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
                this.json.regex = regex;
                this.json.text = text;
                this.json.columns = schema;
                taskRegexCheck(this.operateType, this.json).then(rest => {
                    let message = rest.success?(rest.ret.length == 0? "匹配结果为空" : rest.ret): "测试失败"
                    this.$message({
                        type:rest.success? 'success': 'error',
                        message: message,
                        duration: 1500
                    })
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
        created() {
            var that = this;
            if (localStorage.taskEntity) {
                //获取全局的entity
                that.step1Form = JSON.parse(localStorage.taskEntity);
                // 将数据源的数据添加到dom树上进行实时监听
                var dataSourceTmp = that.step1Form.dataSource
                var dataSourceKeyTmp = Object.keys(dataSourceTmp)
                for (var i = 0; i < dataSourceKeyTmp.length; i++) {
                    that.$set(that.step1Form.dataSource, dataSourceKeyTmp[i], dataSourceTmp[dataSourceKeyTmp[i]])
                }
                //获取采集器的id
                var httpArr = window.location.href.split('/')
                that.step1Form.collecterId = httpArr[httpArr.indexOf('step1') + 1]
                that.step1Form.resourceId = httpArr[httpArr.indexOf('step1') + 2]
                //是不是采集器任务
                that.isCollector = that.step1Form.collecterId && that.step1Form.collecterId != 'WOVEN-SERVER'
                //如果是选择了数据源就要获取表数组
                if (that.step1Form.dataSource.id) {
                    //获取表数组
                    that.getSelValDataSource = that.step1Form.dataSource
                    //如果是复制就要把jdbc变成db
                    that.step1Form.dataSource.type = that.step1Form.dataSource.type == 'JDBC' ? 'DB' : that.step1Form.dataSource.type
                    if (that.step1Form.dataSource.type == 'DB') {
                        that.fetchTable()
                        //如果是没有值就默认给个值
                        if (that.step1Form.dataSource.fetchSize == undefined) {
                            that.step1Form.dataSource.fetchSize = 0
                        }
                        if (that.step1Form.dataSource.queryTimeout == undefined) {
                            that.step1Form.dataSource.queryTimeout = 0
                        }
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
                            var getCols = that.isCollector ? getCollectorColumns(that.step1Form.dataSource.id, that.step1Form.collecterId, that.step1Form.dataSource.table) : getColumns(that.step1Form.dataSource.id, that.step1Form.dataSource.table)
                            that.loading = true
                            getCols.then((results) =>{
                                that.loading = false
                                that.step1Form.mappingSource.length = 0
                                for (var i = 0, j = 0; i < results.length / 2, j < results.length; i += 1, j += 2) {
                                    that.sf.push(results[j])
                                    that.step1Form.mappingSource.push({
                                        sourceField: results[j],
                                        sourceType: results[j + 1]
                                    });
                                    //that.columns.push({name: results[i], dataType: results[i + 1]})
                                }
                                that.disableSelectTable = false;
                            }, err => {
                                that.loading = false
                                this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            })
                        } else {
                            that.loading = true
                            getSchema(that.step1Form.dataSource.schemaId).then(res => {
                                    that.loading = false
                                    that.step1Form.mappingSource.length = 0
                                    res.fields.forEach(function (field) {
                                        that.sf.push(field.name)
                                        that.step1Form.mappingSource.push({
                                            sourceField: field.name,
                                            sourceType: field.type
                                        });
                                    })
                                }, err => {
                                    that.loading = false
                                    this.$message({
                                        message: err.response.message,
                                        type: 'error',
                                        duration: 1500
                                    });
                                }
                            )
                        }
                    }
                }
                //将entity的表放入表选择表的临时存储值
                that.value = that.step1Form.dataSource.table;
                that.init()
            }
        },
        beforeRouteLeave: function (to, from, next) {
            var that = this;
            if (localStorage.taskEntity) {
                //将选择表的临时存储值放入entity
                that.step1Form.dataSource.table = that.value;
                //如果是socket那就将选择操作类型样式保存
                if ((that.operateType || that.operateType == 0) && that.textShow == 'SOCKET') {
                    that.step1Form.dataSource.operateType = that.operateType
                }
                //如果没有数据源的字段就再发一次请求
                if (that.step1Form.mappingSource.length == 0) {
                    that.getColumns();
                }
                //获取全局的entity,转换成json
                var entity = JSON.parse(localStorage.taskEntity);
                //将局部的entity合并到全局的entity中
                that.step1Form = that.copyObject(entity, that.step1Form)
                //保存全局的entity到storage
                localStorage.taskEntity = JSON.stringify(that.step1Form);
            }
            //如果在向导中跳转
            if (to.path.substr(0, 16) == '/taskWizard/step') {
                //如果验证都通过才可以下一步
                that.$refs.step1Form.validate((valid) => {
                    if (valid) {
                        next();
                    } else {
                        //获取从第几步到第几步
                        var fromStep = from.path.charAt(from.path.indexOf('taskWizard/step') + 15)
                        task.$emit('taskNextStep', fromStep)
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
