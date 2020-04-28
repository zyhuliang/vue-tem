<template>
    <section id='bm-ch-col-detailDir-tmp' class="con-module">
        <el-row class="btnClass">
            <div class="btn-left">
                <!--关键字搜索框-->
                <search-table-data ref="refSearchTable" @searchKey="searchListTable" :pagesize="pagesize"
                                   :startTime="startTime" :endTime="endTime"></search-table-data>
                <!--日期搜索框-->
                <search-date-data ref="refSearchDate" @searchDate="searchListTable" :pagesize="pagesize"
                                  :searchInput="searchInput"></search-date-data>
            </div>
        </el-row>
        <!--内容显示列表页面-->
        <template>
            <el-row class="rf-swap">
                <el-table id="bm-ch-collector-detailDir-table" :data="tableData.content"
                          tooltip-effect="dark"
                          v-loading="loading"
                          @selection-change="handleSelectionChange"
                          @sort-change="getOrder"
                          style="width: 100%"
                          max-height="700">
                    <el-table-column type="selection">
                    </el-table-column>
                    <el-table-column label="名称" prop="name" sortable width="300">
                    </el-table-column>
                    <el-table-column label="类型" prop="type" sortable width="80">
                    </el-table-column>
                    <el-table-column label="版本" prop="version" sortable width="80" align="center">
                    </el-table-column>
                    <el-table-column label="创建人" prop="creator" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="修改人" prop="lastModifier" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="修改时间" prop="lastModifiedTime" width="160" :formatter="dateFormat" sortable
                                     align="center">
                    </el-table-column>
                    <el-table-column label="创建时间" prop="createTime" width="160" :formatter="dateFormat" sortable
                                     align="center">
                    </el-table-column>
                    <el-table-column label="最后同步时间" prop="attributes.lastSyncTime" width="160"
                                     :formatter="synDataFormat" sortable align="center">
                    </el-table-column>
                    <el-table-column width="250" key='1' label="操作" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="metaDataSynchronizationRow(scope.row)"
                                    :disabled="scope.row.type !='DB'"
                            >
                                元数据同步
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        name="bm-ch-6-el-pagination"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[8, 16, 50, 100]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.totalElements">
                </el-pagination>
            </el-row>
            <!--元数据同步组件-->
            <meta-data-synchronization ref="mateDatasSynchronization" :collectorId="collectorId"></meta-data-synchronization>
        </template>
    </section>
</template>
<script>

    import {getCollectorDirList, DBLinkTest} from '@api'
    import searchDateData from '@collectorSearch/searchDateData.vue'
    import searchTableData from '@collectorSearch/searchTableData.vue'
    import {createParameter} from '@function/queryParameter.js';
    import congfigData from '@config/data/index.json'
    import metaDataSynchronization from "./metaDataSynchronization.vue";//元数据同步配置页面
    import moment from "moment"//时间格式化

    export default {
        components: {
            searchDateData,
            searchTableData,
            metaDataSynchronization
        },
        data() {
            return {
                parentId: this.$route.params.resourceId,
                collectorId: this.$route.params.id,
                show: false,
                currentPage: 1,
                pagesize: 8,
                startTime: '',
                endTime: '',
                searchInput: '',
                parameter: "",
                multipleSelection: [],
                option: "layout",
                loading: false,
                tableData: {},
                collectorDetail: [
                    {name: 'name', disName: '节点名称', value: ''},
                    {name: 'id', disName: '主键', value: ''},
                    {name: 'hostname', disName: '主机名', value: ''},
                    {name: 'ip', disName: '主机地址', value: ''},
                    {name: 'startedTime', disName: '启动时间', value: ''},
                    {name: 'owner', disName: '所有者', value: ''},
                    {name: 'createTime', disName: '创建时间', value: ''},
                    {name: 'status', disName: '节点状态', value: ''},
                ],
                referenceProgress: {},
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
            }
        },
        methods: {
            //修改当前页面数据的条数
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getCollectorDir()
            },
            //修改当前页数
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput)
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getCollectorDir()
            },
            //获取选中数据条数
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //table查询的列表
            searchListTable: function (parameter, type, startTime, endTime, searchInput, pagesize) {
                this.currentPage = 1
                if (pagesize) this.pagesize = pagesize;
                this.startTime = startTime;
                this.endTime = endTime;
                if (searchInput != undefined) this.searchInput = searchInput;
                var len = this.parameter.fieldList.length
                var tmpField = this.parameter.fieldList.slice(0)
                this.getCollectorDir()
            },
            //获取采集器资源目录列表
            getCollectorDir: function () {
                var that = this;
                this.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput);
                that.parameter = that.parentId ? createParameter('parentId', that.parentId, 'EQUAL').Build(that.parameter) : that.parameter
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.loading = true;
                if (this.startTime == '') {
                    var len = that.parameter.fieldList.length
                    var tmpField = that.parameter.fieldList.slice(0)
                    for (var i = 0; i < len; i++) {
                        if (that.startTime !== 'undefined' && tmpField[i].fieldName === 'lastModifiedTime' && (tmpField[i].comparatorOperator == "GREATER_THAN" || tmpField[i].comparatorOperator == "LESS_THAN")) {
                            var l = that.parameter.fieldList.indexOf(tmpField[i])
                            if (l > -1) {
                                that.parameter.fieldList.splice(l, 1)
                            }
                        }
                        if (that.searchInput == '') {
                            if (tmpField[i].fieldName === 'name') {
                                var l = that.parameter.fieldList.indexOf(tmpField[i])
                                if (l > -1) {
                                    that.parameter.fieldList.splice(l, 1)
                                }
                            }
                        }
                    }

                }
                //--获取采集器目录的列表页
                getCollectorDirList(that.parameter).then((res) => {
                    this.tableData = res;
                    for (var i = 0; i < this.tableData.content.length; i += 1) {
                        this.tableData.content[i].progressValue = 0
                    }
                    this.loading = false;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                });
            },
            //同步元数据按钮可以同时同步多条
            metaDataSynchronizationRow: function (row) {
                var that = this;
                //测试链接和元数据同步需要上传的entit
                let type = congfigData[process.env.BASE_PROJECT].systemName === 'Cab' ?  '/data' : '/tmp'
                var entityDB = {
                    //使用默认存储配置
                    useSystemStore: row.attributes.useSystemStore != undefined ? row.attributes.useSystemStore : true,
                    dataSource: {
                        id: row.id,
                        name: row.name,
                        type: "JDBC",
                        driver: row.attributes.driver,
                        url: row.attributes.url,
                        username: row.attributes.user,
                        password: row.attributes.password,
                        dateToTimestamp: row.attributes.dateToTimestamp,
                        catalog: row.attributes.catalog,
                        schema: row.attributes.schema,
                        table: "",
                        selectSQL: "",
                        dbType: row.type,
                        version: row.attributes.version,
                        jarPath: row.attributes.jarPath,
                    },
                    dataStore: {
                        path: row.attributes.dataStore? row.attributes.dataStore.path: type + '/collecter/'+ this.collectorId + '/' + row.name,
                        format: row.attributes.dataStore ? row.attributes.dataStore.format : 'csv',
                        separator: row.attributes.dataStore ? row.attributes.dataStore.separator : ',',
                        type: row.attributes.dataStore ? row.attributes.dataStore.type : 'HDFS',
                        sliceTime: row.attributes.sliceTime ? row.attributes.dataStore.sliceTime : '',
                        dataResource: row.attributes.dataStore ? row.attributes.dataStore.dataResource : '',
                        datasetResourceId: row.attributes.dataStore ? row.attributes.dataStore.datasetResourceId : '',
                        sliceTime: row.attributes.dataStore ? row.attributes.dataStore.sliceTime : '',
                        schemaResource: row.attributes.dataStore ? row.attributes.dataStore.schemaResource : '',
                        schemaResourceId: row.attributes.dataStore ? row.attributes.dataStore.schemaResourceId : '',
                        clusterId: row.attributes.dataStore ? row.attributes.dataStore.clusterId: ''
                    }
                };
                if (row.type === 'DB') {
                    //链接测试请求
                    DBLinkTest(that.collectorId, entityDB.dataSource).then(function (resp) {
                        if (resp == true) {
                            //打开弹框配置元数据同步需要的参数
                            that.$refs.mateDatasSynchronization.formDialog(entityDB)
                        } else if (resp === false) {
                            that.$message({
                                message: row.name + '连接不可用！',
                                type: 'warning'
                            })
                        }
                    }, error => {
                        if (error.response.status == 500) {
                            _this.$message({
                                message: error.response.data.err,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    })
                }
                else {
                    that.$message({
                        message: row.type + "类型数据无法同步",
                        type: 'error'
                    })
                }

            },
            //最后同步时间的日期转换
            synDataFormat: function (row) {
                var date = row.attributes.lastSyncTime;
                if (date == undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD HH:mm:ss");
            },
            //初始化采集器资源目录列表
            initList: function () {
                //获取采集器的id
                var href = window.location.href
                var arr = href.split('/')
                this.parentId = arr[arr.length - 1]
                this.getCollectorDir()
            },
            //列表排序
            getOrder: function (column) {
                if (column.order === 'ascending') {
                    this.orderDirection = 'ASC'
                } else {
                    this.orderDirection = 'DESC'
                }
                this.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                if (column.column.label === '最后同步时间') {
                    this.prop = 'lastSyncTime'
                    return false
                }
                this.currentPage = 1
                this.getCollectorDir();
            }
        },
        mounted() {
            //获取采集器的id
            this.initList();
        }
    };

</script>

<style scoped>
    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .btn-left {
        padding-left: 160px;
    }
</style>
