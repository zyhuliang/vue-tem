<template>
    <section class="add-resource" id='bm-ch-resMan-dbdataset-tmp'>
        <div class="res-data" v-loading.lock="loading" id="bm-ch-res-dataset-dbDataset-table">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew ? '新建 ' : '编辑 '}}数据集</h4>
                </div>
            </el-row>

            <el-form id="bm-sh-r-data-db1-form" :model="entity" ref="entity" :rules="rules"
                     class="data-content main-content-form">
                <div class="left-form">
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                        <el-input name="bm-sh-r-data-db1-name-input" class="input-form-width" v-model="entity.name"
                                  auto-complete="off" :placeholder="'必填'"></el-input>
                    </el-form-item>

                    <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                        <el-input name="bm-sh-r-data-db1-description-input" v-model="entity.description"
                                  auto-complete="off" class="input-form"></el-input>
                    </el-form-item>

                    <el-form-item :label="'expiredPeriod' | cn" :label-width="formLabelWidth" prop="expiredPeriod">
                        <el-input name="bm-sh-r-data-db1-expiredPeriod-input" placeholder="请输入内容"
                                  v-model="entity.expiredPeriod">
                            <el-select name="bm-sh-r-data-db1-expiredPeriodUnit-select" v-model="expiredPeriodUnit"
                                       slot="append" placeholder="请选择" class="input-with-select">
                                <el-option
                                        v-for="item in ['天','小时','分钟','秒']"
                                        :key="item"
                                        :name="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <hr class="hr-res-form">

                    <el-form-item label="数据源" :label-width="formLabelWidth" prop="storageConfigurations.name"
                                  v-if="showDataSource">
                        <el-input name="bm-sh-r-data-db1-storageConfigurations-name-input" placeholder="请选择内容"
                                  v-model="entity.storageConfigurations.name" class="input-form-width"
                                  @input="dataSourceInquire">
                            <el-button name="bm-sh-r-data-db1-dataSourceInquire-button" slot="append"
                                       icon="icon iconfont icon-ir-search" @click="dataSourceInquire"></el-button>
                        </el-input>
                    </el-form-item>
                    <!--展示部分字段-->
                    <el-form-item :label="'driver'| cn" :label-width="formLabelWidth"
                                  prop="storageConfigurations.driver">
                        <el-input name="bm-sh-r-data-db1-storageConfigurations-driver-input"
                                  v-model="entity.storageConfigurations.driver" auto-complete="off"
                                  class="input-form-width" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="数据库地址" :label-width="formLabelWidth" prop="storageConfigurations.url">
                        <el-input name="bm-sh-r-data-db1-storageConfigurations-url-input"
                                  v-model="entity.storageConfigurations.url" auto-complete="off"
                                  class="input-form-width" disabled></el-input>
                    </el-form-item>

                    <el-form-item :label="'user' | cn" :label-width="formLabelWidth" prop="storageConfigurations.user">
                        <el-input name="bm-sh-r-data-db1-storageConfigurations-user-input"
                                  v-model="entity.storageConfigurations.user" auto-complete="off"
                                  class="input-form-width" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="batchsize" :label-width="formLabelWidth" prop="batchsize"
                                  v-show="isShowbatchsize">
                        <el-select v-model="batchsize" class="input-form-width" placeholder="请选择">
                            <el-option
                                    v-for="item in batchsizeoptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>


                    <el-form-item label="表选择" :label-width="formLabelWidth">
                        <el-select
                                v-model="value"
                                filterable
                                placeholder="输入表/视图名显示查询结果..."
                                :filter-method="filterTable"
                                prop=" storageConfigurations.table"
                                class="input-form-width"
                                @visible-change="changeTable()"
                                name="bm-sh-r-data-db1-storageConfigurations-table-select"
                        >
                            <el-option
                                    v-for="item in tableList"
                                    :key="item"
                                    :name="item"
                                    :value="item"
                                    :label="item"
                            >
                            </el-option>
                            <el-button style="align-content: center;width: 100%" @click="fetchTable(value)"
                                       v-if="!isLastPage">加载更多......
                            </el-button>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="'sql'| cn" :label-width="formLabelWidth" prop="storageConfigurations.sql">
                        <el-input name="bm-sh-r-data-db1-storageConfigurations-sql-input" class="input-form-width"
                                  v-model="entity.storageConfigurations.sql" auto-complete="off"
                                  :placeholder="'sql语句，不能以;结尾'"></el-input>
                    </el-form-item>

                    <hr class="hr-res-form">
                    <el-form-item :label="'选择schema'| cn" :label-width="formLabelWidth" prop="showSelectSchema"
                                  v-if="isNew">
                        <el-select name="bm-sh-r-data-db1-storageConfigurations-showSelectSchema-select"
                                   v-model="showSelectSchema" @change="changeSchemaSelect" class="input-form-width">
                            <el-option
                                    v-for="item in ['true','false']"
                                    :key="item"
                                    :name="item"
                                    :label="item | cn"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="存放位置" :label-width="formLabelWidth" prop="schemaResource"
                                  v-if="isNew && showSelectSchema=='false'">
                        <el-input name="bm-sh-r-data-db1-schemaResource-input" placeholder="请选择内容"
                                  v-model="schemaResource" class="input-form-width">
                            <el-button slot="append" icon="icon iconfont icon-ir-search"
                                       @click="dialogSchemaTreeVisible=true"></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item :label="'schema'| cn" :label-width="formLabelWidth" prop="schema.name"
                                  v-if="!isNew || showSelectSchema=='true'">
                        <el-input name="bm-sh-r-data-db1-schema-name-input" v-model="entity.schema.name"
                                  placeholder="请选择内容(必填)" class="input-form-width" disabled>
                            <el-button slot="append" icon="icon iconfont icon-ir-search"
                                       @click="dataSchemaInquire"></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item :label="'schemaVersion' | cn" v-if="entity.schema.oid" :label-width="formLabelWidth"
                                  prop="storageConfigurations.schemaVersion">
                        <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-format-select"
                                   class='select-form-width' @visible-change="versionChange($event, entity)" v-model="entity.schemaVersion">
                            <el-option
                                    v-for="item in historySchemaEntity"
                                    :key="item.version"
                                    :name="item.version"
                                    :label="item.version"
                                    :value="item.version">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--高级选项-->
                    <el-collapse class="no-border">
                        <el-collapse-item title="高级选项" name="1" class="no-border">
                            <el-form-item :label="'partitionColumn'| cn" :label-width="formLabelWidth"
                                          prop="storageConfigurations.partitionColumn">
                                <el-tooltip placement="top" effect="light">
                                    <div slot="content">用作分区的字段，必须为数字,date,timestamp类型</div>
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                                <el-select name="bm-sh-r-data-db1-storageConfigurations-partitionColumn-select"
                                           v-model="entity.storageConfigurations.partitionColumn"
                                           @change="changeColumnName" class="input-form-width">
                                    <el-option name="" label="" value="">
                                    </el-option>
                                    <el-option
                                            v-for="item in partitionColumnFields"
                                            :key="item"
                                            :name="item"
                                            :label="item | cn"
                                            :value="item">
                                    </el-option>

                                </el-select>
                            </el-form-item>
                            <el-form-item :label="'lowerBound'| cn" :label-width="formLabelWidth"
                                          prop="storageConfigurations.lowerBound">
                                <el-tooltip placement="top" effect="light">
                                    <div slot="content">分区下界值</div>
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                                <el-input name="bm-sh-r-data-db1-storageConfigurations-sql-input"
                                          class="input-form-width"
                                          v-model="entity.storageConfigurations.lowerBound" auto-complete="off"
                                          :disabled="!entity.storageConfigurations.partitionColumn"
                                          :placeholder="'lowerBound'"></el-input>
                            </el-form-item>
                            <el-form-item :label="'upperBound'| cn" :label-width="formLabelWidth"
                                          prop="storageConfigurations.upperBound">
                                <el-tooltip placement="top" effect="light">
                                    <div slot="content">分区上界值</div>
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                                <el-input name="bm-sh-r-data-db1-storageConfigurations-sql-input"
                                          class="input-form-width"
                                          v-model="entity.storageConfigurations.upperBound" auto-complete="off"
                                          :disabled="!entity.storageConfigurations.partitionColumn"
                                          :placeholder="'upperBound'"></el-input>
                            </el-form-item>
                            <el-form-item :label="'numPartitions'| cn" :label-width="formLabelWidth"
                                          prop="storageConfigurations.numPartitions">
                                <el-tooltip placement="top" effect="light">
                                    <div slot="content">最大分区个数(默认和flow运行时executor个数相等)</div>
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                                <el-input name="bm-sh-r-data-db1-storageConfigurations-sql-input"
                                          class="input-form-width"
                                          :disabled="!entity.storageConfigurations.partitionColumn"
                                          v-model="entity.storageConfigurations.numPartitions" auto-complete="off"
                                          :placeholder="'numPartitions'"></el-input>
                            </el-form-item>
                        </el-collapse-item>
                    </el-collapse>
                </div>

                <!--预览数据-->
                <div class="right-form" v-loading="loadingPreview">
                    <preview :entity="entity"></preview>
                </div>
            </el-form>
            <div slot="footer" class="data-footer">
                <el-button type="primary" @click="save()" name="bm-ch-resMan-dbdataset-submitDataSource-save-ok">确定
                </el-button>
                <el-button @click="cancel()" name="bm-ch-resMan-dbdataset-submitDataSource-cancel-cancel">取消</el-button>
            </div>
        </div>

        <!-- DataSource dialog-->
        <el-dialog v-dialog-drag title="数据源查询" :visible.sync="dialogDataSourceVisible" :close-on-click-modal="false"
                   :before-close="cancelDatasetDialog"
                   :modal-append-to-body="false" custom-class="dialogClass">
            <el-form class="elForm dt-content" id="bm-sh-r-data-db2-form">
                <data-source-inquire ref="datasourceinquire" @thisSelectDateSourceVal="getSelectDateSourceVal"
                                     rootName="datasource_dir"></data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataSource"
                           name="bm-ch-resMan-dbdataset-submitDataSource-dataSource-ok">确定
                </el-button>
                <el-button @click="cancelDatasetDialog"
                           name="bm-ch-resMan-dbdataset-submitDataSource-dataSource-cancel">取消
                </el-button>
            </div>
        </el-dialog>

        <!-- SchemaTree dialog-->
        <el-dialog v-dialog-drag
                   :visible.sync="dialogSchemaTreeVisible"
                   width="50%"
                   :close-on-click-modal="false" :modal-append-to-body="false"
                   :title="'schema tree'| cn"
                   custom-class="dialogClass"
        >
            <el-form class="dt-content" id="bm-sh-r-data-db3-form">
                <schema-tree ref="schematree"></schema-tree>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSchemaTree()"
                           name="bm-ch-resMan-dbdataset-submitSchemaTree-schema-ok">确定
                </el-button>
                <el-button @click="dialogSchemaTreeVisible=false"
                           name="bm-ch-resMan-dbdataset-submitSchemaTree-schema-cancel">取消
                </el-button>
            </div>
        </el-dialog>

        <!-- Schema dialog-->
        <el-dialog v-dialog-drag
                   :visible.sync="dialogDataSchemaVisible"
                   width="80%"
                   :close-on-click-modal="false"
                   :modal-append-to-body="false"
                   title="元数据查询"
                   custom-class="dialogClass"
        >
            <el-form class="elForm" id="bm-sh-r-data-db4-form">
                <schema-inquire @thisSelectSchemaVal="getSelectSchemaVal"></schema-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSchemaData()"
                           name="bm-ch-resMan-dbdataset-submitSchemaData-schema-ok">确定
                </el-button>
                <el-button @click="dialogDataSchemaVisible=false"
                           name="bm-ch-resMan-dbdataset-submitSchemaData-schema-cancel">取消
                </el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import preview from './preview'
    import {
        postDataset,
        getDataset,
        putDataset,
        getTables,
        getColumns,
        resDirTree,
        postPreviewDataset,
        getSchema,
        getHistorySchema
    } from '@api'
    import dataSourceInquire from '@components/dataSourceInq/dataSourceInquire.vue';
    import schemaInquire from '@components/schemaInq/schemaInquire.vue';
    import schemaTree from '@components/schemaTree/schemaTree.vue';
    import resIn from '@components/dataTree/resNav.js'
    import resInPro from '@rhinos/projectDir/dataTree/resNav.js'


    export default {
        components: {
            dataSourceInquire,
            schemaInquire,
            schemaTree,
            preview
        },
        name: 'dbDataset',
        data() {
            var validateNull = (rule, value, callback) => {
                //如果 partitionColumn 有值才进行校验，否则直接通过校验
                if (this.entity.storageConfigurations.partitionColumn) {
                    if (!value) {
                        callback(new Error('请输入内容'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }
            var validateNumber = (rule, value, callback) => {
                //如果 partitionColumn 有值才进行校验，否则直接通过校验
                if (this.entity.storageConfigurations.partitionColumn) {
                    if (value && !/^[0-9]+$/.test(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }
            return {
                partitionColumnFields: [],//存放partitionColumnFields过滤的date等类型的字段
                //0， 500， 1000， 3000，10000， 50000， 100000， 默认选择10000，
                batchsizeoptions: [{
                    value: 0,
                    label: '0'
                }, {
                    value: 500,
                    label: '500'
                }, {
                    value: 1000,
                    label: '1000'
                }, {
                    value: 3000,
                    label: '3000'
                }, {
                    value: 10000,
                    label: '10000'
                }, {
                    value: 50000,
                    label: '50000'
                }, {
                    value: 100000,
                    label: '100000'
                }],
                isShowbatchsize: false,
                batchsize: "",
                fieldTypes: ["string", "byte", "short", "bigint", "int", "float", "double", "boolean", "date", "timestamp", "binary", "decimal"],
                dialogSchemaTreeVisible: false,
                dialogDataSourceVisible: false,
                dialogDataSchemaVisible: false,
                showSelectSchema: 'false',
                getSelValDataSource: {},
                formLabelWidth: "120px",
                isNew: true,
                //缓存tableList参数
                tablePage: 0,
                tablePageSize: 50,
                lastTableKeyword: "",
                isLastPage: false,
                showDataSource: true,
                tables: [],
                tableList: [],
                value: '',
                loading: false,
                loadingPreview: false,
                selectedNode: "",
                //schema挂在哪个dir下面
                schemaResource: "",
                expiredPeriodUnit: '天',
                entity: {
                    id: "",
                    name: "",
                    description: '',
                    expiredPeriod: "0",
                    storage: 'JDBC',
                    storageConfigurations: {
                        name: "",
                        table: "",
                    },
                    schema: {
                        name: '',
                        fields: [],
                        resource: {id: ""},
                        projectEntity: {id: ""},
                    },
                    owner: "",
                    batchsize: this.batchsize,
                    //batchsize:10000//0， 500， 1000， 3000，10000， 50000， 100000， 默认选择10000，
                    'schemaVersion':'',// 存放schema的版本信息
                },
                hasSchemaTemp: {},//保存schema切换schema的选择类型时候将值付上去
                noHasSchemaTemp: {},
                rules: {
                    name: [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'expiredPeriod': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.lowerBound': [
                        {validator: validateNull, trigger: 'change'}
                    ],
                    'storageConfigurations.upperBound': [
                        {validator: validateNull, trigger: 'change'}
                    ],
                    'storageConfigurations.numPartitions': [
                        {validator: validateNumber, trigger: 'change'}
                    ],
                    'storageConfigurations.name': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                },
                rowCollection: [],
                cols: [],
                historySchemaEntity: [], //存储schema的历史版本信息
                objectHistory:{},////存储schema的历史版本对象信息
                schemaEntity: {}, // schema 的版本显示的弹框
            }
        },
        methods: {
            //修改版本号发送请求
            versionChange(callback, row){
                var that = this;
                // 列表下拉，发送请求查看history
                if (callback == true) {
                    that.objectHistory = {}
                    that.loading = true
                    //根据oid查看历史数据
                    getHistorySchema(row.schema.oid).then(res => {
                        that.loading = false;
                        that.historySchemaEntity = res
                        res.forEach(item=>{
                            that.objectHistory[item.version] = item
                        })
                    })
                }else{
                    //收回下拉菜单弹出文本框
                    this.schemaEntity = that.objectHistory[row.schemaVersion]
                    this.entity.schemaId = this.schemaEntity.id
                    this.entity.schema = this.schemaEntity
                    this.getSelvalSchemaFields = this.schemaEntity.fields;
                    this.encryptColumnsArray = [];
                    this.getSelvalSchemaFields.forEach((item) => {
                        if (item.type.toLowerCase().indexOf('string') > -1) {
                            this.encryptColumnsArray.push(item.name);
                        }
                    })
                }
            },
            //修改ColumnName字段触发
            changeColumnName() {
                //如果此字段有值，下面字段必填切值为number，没有值下面字段为空
                if (this.entity.storageConfigurations.partitionColumn) {
                    this.$set(this.entity.storageConfigurations, 'lowerBound')
                    this.$set(this.entity.storageConfigurations, 'upperBound')
                    this.$set(this.entity.storageConfigurations, 'numPartitions')
                    this.$refs['entity'].validateField('storageConfigurations.lowerBound');
                    this.$refs['entity'].validateField('storageConfigurations.upperBound');
                } else {
                    this.$refs['entity'].clearValidate(['storageConfigurations.lowerBound', 'storageConfigurations.upperBound', 'storageConfigurations.numPartitions'])
                    setTimeout(() => {
                        this.entity.storageConfigurations.lowerBound = null
                        this.entity.storageConfigurations.upperBound = null
                        this.entity.storageConfigurations.numPartitions = null
                    }, 100)
                }
            },
            //取消dataset的组件按钮
            cancelDatasetDialog() {
                //关闭dialog
                this.dialogDataSourceVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.datasourceinquire.clearSelectionRow();
            },

            //切换schema的选择调用的方法
            changeSchemaSelect() {
                //如果是学则已有的，将schema存到没有的变量中
                if (this.showSelectSchema == 'true') {
                    this.noHasSchemaTemp = JSON.parse(JSON.stringify(this.entity.schema))
                    this.entity.schema = JSON.parse(JSON.stringify(this.hasSchemaTemp))
                } else {
                    this.hasSchemaTemp = JSON.parse(JSON.stringify(this.entity.schema))
                    this.entity.schema = JSON.parse(JSON.stringify(this.noHasSchemaTemp))
                }
            },
            //获取子组件的dataSource entity
            getSelectDateSourceVal(data) {
                this.getSelValDataSource = data;
            },

            //弹出"dataSource查询"层
            dataSourceInquire: function () {
                this.dialogDataSourceVisible = true;
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
                    this.$refs.entity.clearValidate(["storageConfigurations.name"]);
                    this.selectedSource = this.getSelValDataSource;
                    this.getSelValDataSource.attributes.selectSQL = this.getSelValDataSource.attributes.sql;
                    this.getSelValDataSource.attributes.username = this.getSelValDataSource.attributes.user;
                    this.getSelValDataSource.attributes.resType = this.getSelValDataSource.type;
                    this.tablePage = 0;
                    this.tablePageSize = 50;
                    this.lastTableKeyword = "";
                    this.isLastPage = false;
                    //将driver里面的name去掉，以免影响数据源的name
                    delete this.getSelValDataSource.attributes.name
                    //根据所选数据源更新entity的数据
                    this.copyObject(this.entity.storageConfigurations, this.getSelValDataSource);
                    Object.assign(this.entity.storageConfigurations, this.getSelValDataSource.attributes)
                    //如果storageConfigurations的字段的datastore存在就去掉
                    if (this.entity.storageConfigurations.dataStore) {
                        delete this.entity.storageConfigurations.dataStore;
                    }
                    this.entity.storageConfigurations.id = this.getSelValDataSource.id
                    delete this.entity.storageConfigurations.properties
                    this.fetchTable()

                    var checkedItem = this.$refs.datasourceinquire.multipleSelection[0];
                    if (checkedItem.attributes.batchsize) {
                        this.isShowbatchsize = true;
                        this.batchsize = parseInt(checkedItem.attributes.batchsize);
                    } else {
                        this.isShowbatchsize = false;
                    }
                    this.cancelDatasetDialog()
                }
            },

            //弹出"dataSchema查询"层
            dataSchemaInquire: function () {
                this.dialogDataSchemaVisible = true;
            },

            //获取子组件的DateSchema  entity
            getSelectSchemaVal(data) {
                this.getSelValDataSchema = data;
            },

            //Schema查询数据提交
            submitSchemaData: function () {
                if (!this.getSelValDataSchema || this.getSelValDataSchema === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
                    this.entity.schema = this.getSelValDataSchema
                    this.entity.schemaVersion = this.getSelValDataSchema.version
                    this.dialogDataSchemaVisible = false;
                }
            },
            //更改表时调用
            changeTable: function () {
                //清空schema，高级选项功能
                this.entity.schema.fields = [];
                delete this.entity.storageConfigurations.partitionColumn
                delete this.entity.storageConfigurations.lowerBound
                delete this.entity.storageConfigurations.upperBound
                delete this.entity.storageConfigurations.numPartitions
                //将table放入entity中
                this.entity.storageConfigurations.table = this.value;
                var sourceJson = this.entity.storageConfigurations;
                //选取默认的schema存放的resource id
                if (this.isNew) {
                    resDirTree({allUser: false, includes: 'schema_dir', strict: true}).then(res => {
                        var urlTrue = window.location.href.indexOf('/project') > -1;
                        if (urlTrue === true) {
                            this.entity.schema.projectEntity.id = res[0].id;
                        } else {
                            this.entity.schema.resource.id = res[0].id;
                        }
                        this.schemaResource = res[0].name;
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }

                //将表中所有的字段都存到schema里面
                if (sourceJson.id) {
                    this.loading = true
                    getColumns(sourceJson.id, this.value).then((results) => {
                        this.loading = false
                        this.partitionColumnFields = [];
                        for (var i = 0, j = 0; i < results.length / 2, j < results.length; i += 1, j += 2) {
                            //将type转换成数据库对应的基本数据类型
                            var tmpfield = this.databaseTypeTransform(sourceJson.DBType, results[j + 1])
                            this.entity.schema.fields.push({"name": results[j], "type": tmpfield});
                            //根据类型过滤出高级搜索想要的字段
                            if (tmpfield.toUpperCase().indexOf('DATE') > -1 ||
                                tmpfield.toUpperCase().indexOf('TIMESTAMP') > -1 ||
                                tmpfield.toUpperCase().indexOf('TINYINT') > -1 ||
                                tmpfield.toUpperCase().indexOf('SMALLINT') > -1 ||
                                tmpfield.toUpperCase().indexOf('INT') > -1 ||
                                tmpfield.toUpperCase().indexOf('BIGINT') > -1 ||
                                tmpfield.toUpperCase().indexOf('INTEGER') > -1 ||
                                tmpfield.toUpperCase().indexOf('DECIMAL') > -1 ||
                                tmpfield.toUpperCase().indexOf('NUMBER') > -1 ||
                                tmpfield.toUpperCase().indexOf('FLOAT') > -1 ||
                                tmpfield.toUpperCase().indexOf('DOUBLE') > -1) {
                                this.partitionColumnFields.push(results[j])
                            }
                        }
                        this.disableSelectTable = false;
                    }, err => {
                        this.loading = false
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
                //如果是学则已有的，将schema存到没有的变量中
                if (this.showSelectSchema == 'true') {
                    this.hasSchemaTemp = JSON.parse(JSON.stringify(this.entity.schema))
                } else {
                    this.noHasSchemaTemp = JSON.parse(JSON.stringify(this.entity.schema))
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
            //预览数据集的数据
            previewDataset: function () {
                this.loadingPreview = true;
                this.rowCollection = [];
                this.cols = []
                //将table放入entity中
                this.entity.storageConfigurations.table = this.value;
                //根据entity发送请求，获取预览数据
                //如果是选择已有的schema查找字段，先获取表头字段再将数据填入
                if (this.entity.schema.id) {
                    getSchema(this.entity.schema.id).then((schemaEntity) => {
                        this.cols = schemaEntity.fields
                        postPreviewDataset(this.entity.id ? this.entity.id : 'new', this.entity).then(datasetEntity => {
                            this.loadingPreview = false;
                            this.rowCollection = datasetEntity;
                        }, err => {
                            this.loadingPreview = false;
                            this.$message({
                                message: err.response.data.err,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    }, error => {
                        this.loadingPreview = false;
                        if (error.response.status == 500) {
                            this.$message({
                                message: error.response.data.err,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    })
                } else {
                    //如果没有schema id就从dataset中读取此字段
                    this.cols = this.entity.schema.fields
                    postPreviewDataset(this.entity.id ? this.entity.id : 'new', this.entity).then(datasetEntity => {
                        this.loadingPreview = false;
                        this.rowCollection = datasetEntity;
                    }, err => {
                        this.loadingPreview = false;
                        this.$message({
                            message: err.response.data.err,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },
            //缓存或者查询table的数组
            fetchTable: function (val) {
                this.loading = true
                if (this.getSelValDataSource) {
                    this.disableSelectTable = true;
                    //如果查询条件值改变，offset归0
                    if (this.lastTableKeyword != this.value) {
                        this.tablePage = 0;
                    }
                    var getTableParams = {
                        keyword: val,
                        id: this.entity.storageConfigurations.id,
                        offset: this.tablePage * this.tablePageSize,
                        limit: this.tablePageSize
                    }
                    //获取tables
                    if (this.entity.storageConfigurations.id) {
                        getTables(getTableParams).then(results => {
                            this.loading = false
                            this.isLastPage = results.last;
                            if (this.lastTableKeyword == this.value) {
                                this.tables = this.tables.concat(results.content);
                                this.tablePage++;
                            } else {
                                this.lastTableKeyword = this.value;
                                this.tables.splice(0, this.tables.length)
                                this.tables = this.tables.concat(results.content);
                                this.tablePage = 1;
                            }
                            this.tableList = this.tables;
                            this.disableSelectTable = false;
                        }, error => {
                            this.loading = false
                            var err = error.response.data.err;
                            if (err.indexOf('null') != -1) {
                                err = '获取数据源中表失败'
                            }
                            this.$message({
                                message: err,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    }
                }
            },

            //编辑添加数据源
            init: function () {
                this.entity.id = this.$route.params.id
                this.isNew = false;
                this.loading = true;
                //获取dataset的entity
                getDataset(this.entity.id).then(res => {
                    this.loading = false;
                    this.entity = Object.assign({}, this.entity, res);
                    //如果有字段，筛选出我要的类型
                    if(this.entity.schema && this.entity.schema.fields){
                        var fields = this.entity.schema.fields
                        this.partitionColumnFields = [];
                        for (var i = 0; i < fields.length ; i += 1) {
                            //将type转换成数据库对应的基本数据类型
                            var tmpfield = this.databaseTypeTransform(this.entity.storageConfigurations.DBType, fields[i].type)
                            //根据类型过滤出高级搜索想要的字段
                            if (tmpfield.toUpperCase().indexOf('DATE') > -1 ||
                                tmpfield.toUpperCase().indexOf('TIMESTAMP') > -1 ||
                                tmpfield.toUpperCase().indexOf('TINYINT') > -1 ||
                                tmpfield.toUpperCase().indexOf('SMALLINT') > -1 ||
                                tmpfield.toUpperCase().indexOf('INT') > -1 ||
                                tmpfield.toUpperCase().indexOf('BIGINT') > -1 ||
                                tmpfield.toUpperCase().indexOf('INTEGER') > -1 ||
                                tmpfield.toUpperCase().indexOf('DECIMAL') > -1 ||
                                tmpfield.toUpperCase().indexOf('NUMBER') > -1 ||
                                tmpfield.toUpperCase().indexOf('FLOAT') > -1 ||
                                tmpfield.toUpperCase().indexOf('DOUBLE') > -1) {
                                this.partitionColumnFields.push( fields[i].name)
                            }
                        }
                    }
                    this.isShowbatchsize = parseInt(this.entity.storageConfigurations.batchsize) >= 0 ? true : false;
                    this.batchsize = parseInt(this.entity.storageConfigurations.batchsize);
                    //将entity的表放入表选择表的临时存储值
                    this.value = this.entity.storageConfigurations.table;
                    //将过期时间转换
                    if (this.entity.expiredPeriod) {
                        var time = this.second2Other(this.entity.expiredPeriod);
                        this.entity.expiredPeriod = time.time;
                        this.expiredPeriodUnit = time.unit;
                    }
                    //进入编辑获取table的列表
                    this.disableSelectTable = true;
                    var getTableParams = {
                        keyword: '',
                        id: this.entity.storageConfigurations.id,
                        offset: this.tablePage * this.tablePageSize,
                        limit: this.tablePageSize
                    }
                    //流程生成的dataset是不用显示数据源的
                    if (this.entity.storageConfigurations.name && this.entity.storage == "JDBC") {
                        //获取tables
                        if (this.entity.storageConfigurations.id) {
                            getTables(getTableParams).then(results => {
                                this.tables = [];
                                this.isLastPage = results.last;
                                if (this.lastTableKeyword == this.entity.storageConfigurations.table) {
                                    this.tables = this.tables.concat(results.content);
                                    this.tablePage++;
                                } else {
                                    this.lastTableKeyword = this.entity.storageConfigurations.table;
                                    this.tables.splice(0, this.tables.length)
                                    this.tables = this.tables.concat(results.content);
                                    this.tablePage = 1;
                                }
                                this.disableSelectTable = false;
                                this.tableList = this.tables
                            }, error => {
                                var err = error.response.data.err;
                                if (err.indexOf('null') != -1) {
                                    err = '获取数据源中表失败'
                                }
                                this.$confirm(err, "错误", {
                                    type: "error"
                                })
                            })
                        }
                    } else {
                        //this.showDataSource = false;
                        this.entity.storageConfigurations.name = ''
                    }
                }, err => {
                    this.loading = false;
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },

            //获取schema的id
            submitSchemaTree: function () {
                //获取schema的node
                var schmaNode = this.$refs.schematree.selectedNode;
                if (schmaNode === '') {
                    this.$message({
                        message: '请选择一个目录！',
                        type: 'error'
                    });
                    return false;
                } else {
                    var urlTrue = window.location.href.indexOf('/project') > -1;
                    if (urlTrue === true) {
                        this.schemaProject = schmaNode.name
                        this.entity.schema.projectEntity.id = schmaNode.id
                        this.entity.schemaVersion = schmaNode.version
                        this.dialogSchemaTreeVisible = false;
                    } else {
                        this.schemaResource = schmaNode.name
                        this.entity.schema.resource.id = schmaNode.id
                        this.entity.schemaVersion = schmaNode.version
                        this.dialogSchemaTreeVisible = false;
                    }
                }
            },

            cancel: function () {
                var urlTrue = window.location.href.indexOf('/project') > -1;
                if (urlTrue === true) {
                    resInPro.$emit('refreshList', false, 'dataset');
                } else {
                    this.$router.push('/resourceMan')
                    resIn.$emit('refreshList', false, 'dataset');
                }
            },
            //确定回调
            save: function () {
                this.$refs.entity.validate((valid) => {
                    if (!this.value) {
                        this.$confirm("表选择必填", "错误", {
                            type: "error"
                        })
                    } else if (valid) {
                        //去掉tablename字段
                        this.entity.storage = 'JDBC'
                        if (this.entity.expiredPeriod) {
                            this.entity.expiredPeriod = this.other2Second(this.entity.expiredPeriod, this.expiredPeriodUnit) * 1.0;
                            //this.entity.expiredPeriod = this.entity.expiredPeriod *1.0;
                        }
                        //将选择表的临时存储值放入entity
                        this.entity.storageConfigurations.table = this.value;
                        if (this.entity.tableName)
                            delete this.entity.tableName;
                        //将schema的name和dataset使用相同的名字
                        this.entity.schema.name = this.entity.name + "_" + this.entity.storageConfigurations.table;
                        this.entity.storageConfigurations.batchsize = this.batchsize;
                        var addOrEditDataset = this.isNew ? postDataset(this.entity) : putDataset(this.entity.id, this.entity);
                        //提交 datasource
                        addOrEditDataset.then(data => {
                            //提交之后获取列
                            var urlTrue = window.location.href.indexOf('/project') > -1;
                            if (urlTrue === true) {
                                this.$router.push({path: '/resourceManProject'});
                                resInPro.$emit('refreshList', false, 'dataset');
                            } else {
                                this.$router.push({path: '/resourceMan'});
                                resIn.$emit('refreshList', false, 'dataset');
                            }
                        }, error => {
                            var err = error.response.data.err
                            if (err.indexOf('Duplicate') > -1)
                                err = '保存失败，此名称已存在'
                            this.$message({
                                message: err,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    } else {
                        return false;
                    }
                })

            }
        },
        mounted() {
            // 调用dataset的页面
            if (this.$route.params.id == 'new') {
                var urlTrue = window.location.href.indexOf('/project') > -1;
                if (urlTrue === true) {
                    var data = {projectEntity: {id: this.$route.params.projectId}}
                } else {
                    var data = {resource: {id: this.$route.params.parentId}}
                }
                this.entity = Object.assign({}, this.entity, data)
                this.selectedNode = this.$route.params.node
                this.entity.owner = this.selectedNode ? this.selectedNode.owner : ''
            } else this.init();
        }
    }
</script>

<style lang="scss" scoped>
    .btn-left {
        float: left;

        h4 {
            margin: 10px 0px 0px 10px;
        }
    }

    .add-resource {
        .main-content-form {
            .left-form {
                float: left;
                width: 550px;
            }

            .right-form {
                float: left;
                width: calc(100vw - 850px);
                min-width: 300px;

                .div-refresh {
                    width: calc(100vw - 900px);
                    overflow-x: auto;

                    .button-refresh {
                        /*button{*/
                        /*margin-left: 45%;*/
                        /*}*/
                        align-content: center;
                        line-height: 40px;
                    }
                }

            }
        }

        .res-data {
            background-color: rgba(255, 255, 255, .9);

            .hr-res-form {
                border: 0px;
                height: 1px;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .field-grope {
                width: 390px;

                .input {
                    width: 200px
                }

                .select {
                    width: 147px
                }
            }

            .input-form {
                width: 350px;
            }

            position: relative;

            .el-form {
                .el-input {
                    width: 350px;
                }
            }

            .select-form-width {
                width: 350px;
            }

            .input-form-width {
                width: 350px;
            }

            .input-expired-period {
                width: 225px;
            }

            .button-expired-period {
                width: 120px;
            }

            .input-with-select {
                width: 80px;
            }

            .selectFormWidth {
                width: 350px;
            }
        }
    }

    .elForm {
        float: left;
        width: 100%;
        height: 100%;
        padding: 0px 20px 0px 20px;
        box-sizing: border-box;
    }
</style>

