<template>
    <section class="con-module" id='bm-ch-col-importData-tmp'>
        <el-row class="btnClass">
            <div class="btnLeft">
                <search-date-data name="bm-ch-col-importData-collectorId-refSearchDate-search-select"
                                  ref="refSearchDate" @searchDate="searchListTable" :pagesize="pagesize"
                                  :searchInput="searchInput"></search-date-data>
                <!--todo任务类型过滤-->
                <div class="ers-pattern ers-pattern-col">
                    <h4>采集器ID</h4>
                    <el-select name="bm-ch-col-importData-collectorId-select" v-model="collectorId" placeholder="all"
                               @change="collectorIdSelected(collectorId)">
                        <el-option
                                v-for="item in collectorIds"
                                :key="item"
                                :name="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="ers-pattern">
                    <h4>周期</h4>
                    <el-select name="bm-ch-col-importData-collectorId-srcTrigger-search-select" v-model="srcTrigger"
                               placeholder="所有" @visible-change="srcOption('srcTrigger')">
                        <el-option
                                v-for="item in ['所有','单次执行','周期执行']"
                                :key="item"
                                :name="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <!--todo状态过滤-->
                <div class="ers-pattern">
                    <h4>状态</h4>
                    <el-select name="bm-ch-col-importData-collectorId-srcStatus-search-select" v-model="srcStatus"
                               multiple collapse-tags placeholder="所有" @visible-change="srcOption('srcStatus')"
                               @remove-tag="srcOption('srcStatus', 'remove')">
                        <el-option
                                v-for="item in ['已创建', '已部署', '已停止' , '错 误', '未知']"
                                :key="item"
                                :name="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <!--todo最后执行状态过滤-->
                <div class="ers-pattern">
                    <h4>最后执行状态</h4>
                    <el-select name="bm-ch-col-importData-collectorId-srcLastExecuteStatus-search-select"
                               v-model="srcLastExecuteStatus" multiple collapse-tags placeholder="所有"
                               @visible-change="srcOption('srcLastExecuteStatus')"
                               @remove-tag="srcOption('srcLastExecuteStatus', 'remove')">
                        <el-option
                                v-for="item in ['创建', '运行中', '完成', '失败','未知']"
                                :key="item"
                                :name="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <search-table-data ref="refSearchTable"
                                   name="bm-ch-col-importData-collectorId-searchListTable-search-select"
                                   @searchKey="searchListTable" :pagesize="pagesize" :startTime="startTime"
                                   :endTime="endTime"></search-table-data>

            </div>
        </el-row>
        <!--内容显示列表页面-->
        <template>
            <el-col class="rf-swap">
                <el-table id="bm-ch-collector-importDatas-table" :data="tableData.content"
                          tooltip-effect="dark"
                          v-loading="loading"
                          @sort-change="getOrder"
                          height="calc(100vh - 215px)"
                          style="width: 100%" max-height="700">
                    <el-table-column
                            type="selection">
                    </el-table-column>

                    <el-table-column label="名称" prop="name" min-width="100" sortable>
                        <template slot-scope="scope">
                            <a @click="nameDialog(scope.row.id,scope.row.collecterId)"
                            >
                                {{scope.row.name}}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="数据源" min-width="100" prop="dataSource" sortable>
                    </el-table-column>
                    <el-table-column label="同步对象" min-width="100" prop="object" sortable>
                        <template slot-scope="scope">
                            <a
                                    @click="objectDialog(scope.row.dataSourceId, scope.row.object, scope.row.collecterId)"
                                    v-if="JSON.parse(scope.row.taskJson).dataSource.type == 'JDBC'"
                            >
                                {{scope.row.object}}
                            </a>
                            <span v-else>{{scope.row.object}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数据集" min-width="100" prop="dataStore" sortable>
                    </el-table-column>
                    <el-table-column label="周期情况" prop="trigger" width="100" sortable align="center">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.trigger">单次执行</span>
                            <span v-else>周期执行</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="createTime" min-width="120" :formatter="dateFormat" sortable
                                     align="center">
                    </el-table-column>
                    <el-table-column label="状态" prop="status" width="80" sortable align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status == 0" class="status-div-create">已创建</div>
                            <div v-else-if="scope.row.status == 1" class="status-div-deploy">已部署</div>
                            <div v-else-if="scope.row.status == 2" class="status-div-stop">已停止</div>
                            <div v-else-if="scope.row.status == -1" class="status-div-error">错 误</div>
                            <div v-else>未知</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后执行时间" prop="lastExecuteTime" width="160" :formatter="dateFormat" sortable
                                     align="center">
                    </el-table-column>
                    <el-table-column label="最后执行状态" prop="lastExecuteStatus" width="130" sortable align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.lastExecuteStatus == 0">创建</div>
                            <div v-else-if="scope.row.lastExecuteStatus == 1">运行中</div>
                            <div v-else-if="scope.row.lastExecuteStatus == 2">完成</div>
                            <div v-else-if="scope.row.lastExecuteStatus == -1">失败</div>
                            <div v-else>未知</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后读入" min-width="100" prop="lastReadIn" sortable show-overflow-tooltip
                                     align="center">
                    </el-table-column>
                    <el-table-column label="最后写出" min-width="100" prop="lastWriteOut" sortable show-overflow-tooltip
                                     align="center">
                    </el-table-column>
                    <el-table-column width="60" align="center">
                        <template slot-scope="scope">
                            <router-link
                                    type="text"
                                    size="small"
                                    :to="{ path: '/import/executeList/'+scope.row.id}"
                            >
                                执行
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column width="60" align="center">
                        <template slot-scope="scope">
                            <a @click="dataPreview(scope.row)"
                            >
                                预览
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column width="60" align="center">
                        <template slot-scope="scope">
                            <a @click="statistics(scope.row)"
                            >
                                指标
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        name="bm-ch-7-el-pagination"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[8, 16, 50, 100]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.totalElements">
                </el-pagination>
            </el-col>
        </template>
        <!--name dialog-->
        <preview-task-name ref="taskName"></preview-task-name>

        <!--数据源 dialog-->
        <preview-data-source ref="dataSource"></preview-data-source>

        <!--同步对象 dialog-->
        <preview-object ref="object"></preview-object>

        <!--数据预览 dialog-->
        <preview-data-set ref="dataset"></preview-data-set>
        <!-- 数据统计 -->
        <statistics-dialog ref="statisticsDialog"></statistics-dialog>
        <router-view></router-view>
    </section>
</template>

<script>

    import {getCollectorTaskList, getCollectorIds, getSynchronizationTaskExecuteList, getDataset} from '@api'
    import searchDateData from '@collectorSearch/searchDateData.vue'
    import searchTableData from '@collectorSearch/searchTableData.vue'
    import previewDataSet from '@collector/taskDialog/datasetDialog.vue'
    import previewObject from '@collector/taskDialog/object.vue'
    import previewTaskName from '@collector/taskDialog/name.vue'
    import previewDataSource from '@collector/taskDialog/dataSource.vue'
    import statisticsDialog from './statistics/statistics.vue'
    import {queryObject, createParameter} from '@function/queryParameter.js';

    export default {
        components: {
            searchDateData,
            searchTableData,
            previewDataSet,
            previewObject,
            previewTaskName,
            previewDataSource,
            statisticsDialog
        },
        data() {
            return {
                option: "layout",
                collectorIds: [],
                tableData: {},
                show: false,
                currentPage: 1,
                pagesize: 8,
                startTime: '',
                endTime: '',
                searchInput: '',
                parameter: "",
                value: '',
                checkList: [],
                loading: false,
                collectorId: "_ALL_COLLECTER_JOBS_",
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                srcTrigger: ['所有'],
                srcStatus: [],
                srcLastExecuteStatus: [],
            }
        },
        methods: {
            statistics (row) {
                this.$refs.statisticsDialog.showStatisticsDialog(row)
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput, this.parameter.fieldList))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getCollectorTasks(this.parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput, this.parameter.fieldList)
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getCollectorTasks(this.parameter)
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //根据不同的字段进行筛选过滤
            srcOption: function (type, remove) {
                var that = this;
                that.currentPage = 1
                //根据不同字段进行删除
                var len = that.parameter.fieldList.length;
                var tmpField = that.parameter.fieldList.slice(0)
                if (!remove) {
                    for (var i = 0; i < len; i++) {
                        if (type === 'srcTrigger' && tmpField[i].fieldName === 'trigger') {
                            var l = that.parameter.fieldList.indexOf(tmpField[i])
                            if (l > -1) {
                                that.parameter.fieldList.splice(l, 1)
                            }
                        } else if (type === 'srcStatus' && tmpField[i].fieldName === 'status') {
                            var l = that.parameter.fieldList.indexOf(tmpField[i])
                            if (l > -1) {
                                that.parameter.fieldList.splice(l, 1)
                            }
                        } else if (type === 'srcLastExecuteStatus' && tmpField[i].fieldName === 'lastExecuteStatus') {
                            var l = that.parameter.fieldList.indexOf(tmpField[i])
                            if (l > -1) {
                                that.parameter.fieldList.splice(l, 1)
                            }
                        }
                    }
                } else {
                    //如果是两个参数，删除一个，另一个也没有用了
                    var trigger = []
                    var status = []
                    var lastExecuteStatus = []
                    for (var i = 0; i < len; i++) {
                        if (that.parameter.fieldList[i].fieldName === 'trigger') {
                            trigger.push(that.parameter.fieldList[i])
                        } else if (that.parameter.fieldList[i].fieldName === 'status') {
                            status.push(that.parameter.fieldList[i])
                        } else if (that.parameter.fieldList[i].fieldName === 'lastExecuteStatus') {
                            lastExecuteStatus.push(that.parameter.fieldList[i])
                        }
                    }
                    if (type === 'srcTrigger') {
                        trigger = []
                    } else if (type === 'srcStatus') {
                        status = []
                    } else if (type === 'srcLastExecuteStatus') {
                        lastExecuteStatus = []
                    }
                    that.parameter.fieldList = [].concat(trigger, status, lastExecuteStatus)
                }
                //根据某个字段拼成query参数
                if (type === 'srcTrigger') {
                    if (that.srcTrigger === '单次执行') {
                        that.parameter = createParameter("trigger", '', "EQUAL").Build(that.parameter);
                    } else if (that.srcTrigger === '周期执行') {
                        that.parameter = createParameter("trigger", '', "NOT_EQUAL").Build(that.parameter);
                    }
                } else if (type === 'srcStatus') {
                    if (that.srcStatus.length === 1) {
                        if (that.srcStatus[0] === '已创建') {
                            that.parameter = createParameter("status", '0', "EQUAL").Build(that.parameter);
                        } else if (that.srcStatus[0] === '已部署') {
                            that.parameter = createParameter("status", '1', "EQUAL").Build(that.parameter);
                        } else if (that.srcStatus[0] === '已停止') {
                            that.parameter = createParameter("status", '2', "EQUAL").Build(that.parameter);
                        } else if (that.srcStatus[0] === '错 误') {
                            that.parameter = createParameter("status", '-1', "EQUAL").Build(that.parameter);
                        } else if (that.srcStatus[0] === '未知') {
                            that.parameter = createParameter("status", '-2', "EQUAL").Build(that.parameter);
                        }
                    } else if (that.srcStatus.length > 1) {
                        //根据选择的数据获取不需要的数据
                        var tmpStatusArr = ['已创建', '已部署', '已停止', '错 误', '未知'];
                        var statusArr = ['已创建', '已部署', '已停止', '错 误', '未知'];
                        for (var i = 0; i < statusArr.length; i++) {
                            for (var j = 0; j < that.srcStatus.length; j++) {
                                if (statusArr[i] === that.srcStatus[j]) {
                                    tmpStatusArr.splice(tmpStatusArr.indexOf(statusArr[i]), 1)
                                }
                            }
                        }
                        //将不需要的数据变成过滤条件
                        for (var i = 0; i < tmpStatusArr.length; i++) {
                            if (tmpStatusArr[i] === '已创建') {
                                that.parameter = createParameter("status", '0', "NOT_EQUAL").Build(that.parameter);
                            } else if (tmpStatusArr[i] === '已部署') {
                                that.parameter = createParameter("status", '1', "NOT_EQUAL").Build(that.parameter);
                            } else if (tmpStatusArr[i] === '已停止') {
                                that.parameter = createParameter("status", '2', "NOT_EQUAL").Build(that.parameter);
                            } else if (tmpStatusArr[i] === '错 误') {
                                that.parameter = createParameter("status", '-1', "NOT_EQUAL").Build(that.parameter);
                            } else if (tmpStatusArr[i] === '未知') {
                                that.parameter = createParameter("status", '-2', "NOT_EQUAL").Build(that.parameter);
                            }
                        }
                    }
                } else if (type === 'srcLastExecuteStatus') {
                    if (that.srcLastExecuteStatus.length === 1) {
                        if (that.srcLastExecuteStatus[0] === '创建') {
                            that.parameter = createParameter("lastExecuteStatus", '0', "EQUAL").Build(that.parameter);
                        } else if (that.srcLastExecuteStatus[0] === '运行中') {
                            that.parameter = createParameter("lastExecuteStatus", '1', "EQUAL").Build(that.parameter);
                        } else if (that.srcLastExecuteStatus[0] === '完成') {
                            that.parameter = createParameter("lastExecuteStatus", '2', "EQUAL").Build(that.parameter);
                        } else if (that.srcLastExecuteStatus[0] === '失败') {
                            that.parameter = createParameter("lastExecuteStatus", '-1', "EQUAL").Build(that.parameter);
                        } else if (that.srcLastExecuteStatus[0] === '未知') {
                            that.parameter = createParameter("lastExecuteStatus", '-2', "EQUAL").Build(that.parameter);
                        }
                    } else if (that.srcLastExecuteStatus.length > 1) {
                        //根据选择的数据获取不需要的数据
                        var tmpStatusArr = ['创建', '运行中', '完成', '失败', '未知'];
                        var statusArr = ['创建', '运行中', '完成', '失败', '未知'];
                        for (var i = 0; i < statusArr.length; i++) {
                            for (var j = 0; j < that.srcLastExecuteStatus.length; j++) {
                                if (statusArr[i] === that.srcLastExecuteStatus[j]) {
                                    tmpStatusArr.splice(tmpStatusArr.indexOf(statusArr[i]), 1)
                                }
                            }
                        }
                        //将不需要的数据变成过滤条件
                        for (var i = 0; i < tmpStatusArr.length; i++) {
                            if (tmpStatusArr[i] === '创建') {
                                that.parameter = createParameter("lastExecuteStatus", '0', "NOT_EQUAL").Build(that.parameter);
                            } else if (tmpStatusArr[i] === '运行中') {
                                that.parameter = createParameter("lastExecuteStatus", '1', "NOT_EQUAL").Build(that.parameter);
                            } else if (tmpStatusArr[i] === '完成') {
                                that.parameter = createParameter("lastExecuteStatus", '2', "NOT_EQUAL").Build(that.parameter);
                            } else if (tmpStatusArr[i] === '失败') {
                                that.parameter = createParameter("lastExecuteStatus", '-1', "NOT_EQUAL").Build(that.parameter);
                            } else if (tmpStatusArr[i] === '未知') {
                                that.parameter = createParameter("lastExecuteStatus", '-2', "NOT_EQUAL").Build(that.parameter);
                            }
                        }
                    }
                }
                that.parameter.fieldList = that.parameter.fieldList ? that.parameter.fieldList : []
                that.searchListTable()
            },
            //table查询的列表
            searchListTable: function (parameter, type, startTime, endTime, searchInput, pagesize) {
                var that = this;
                that.currentPage = 1
                if (pagesize) that.pagesize = pagesize;
                if (startTime || startTime == '') that.startTime = startTime;
                if (endTime || endTime == '') that.endTime = endTime;
                if (searchInput != undefined) that.searchInput = searchInput;
                if (searchInput != undefined) that.searchInput = searchInput;
                var len = that.parameter.fieldList.length
                var tmpField = that.parameter.fieldList.slice(0)
                for (var i = 0; i < len; i++) {
                    if (startTime !== 'undefined' && tmpField[i].fieldName === 'lastModifiedTime' && (tmpField[i].comparatorOperator == "GREATER_THAN" || tmpField[i].comparatorOperator == "LESS_THAN")) {
                        var l = that.parameter.fieldList.indexOf(tmpField[i])
                        if (l > -1) {
                            that.parameter.fieldList.splice(l, 1)
                        }
                    } else if (searchInput != undefined && tmpField[i].fieldName === 'name') {
                        var l = that.parameter.fieldList.indexOf(tmpField[i])
                        if (l > -1) {
                            that.parameter.fieldList.splice(l, 1)
                        }
                    }
                }
                that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput, this.parameter.fieldList);
                this.parameter = createParameter().Sort(this.prop, this.orderDirection).Limit(that.pagesize).Build(that.parameter, false)
                this.getCollectorTasks(that.parameter)
            },
            //获取采集器任务列表
            getCollectorTasks: function (para) {
                if (!para) {
                    para = this.parameter
                }
                this.loading = true;
                getCollectorTaskList(this.collectorId, para).then((res) => {
                    this.tableData = res;
                    this.total = res.total
                    this.loading = false;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                });
            },
            //获取采集器的id列表
            getCollectorIdsArray: function () {
                var that = this
                getCollectorIds().then((res) => {
                    that.collectorIds = res
                    //console.log(res);
                    if (that.collectorIds.indexOf('_ALL_COLLECTER_JOBS_') == -1) {
                        that.collectorIds.unshift("_ALL_COLLECTER_JOBS_")
                    }
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            //改变采集器的id更新列表
            collectorIdSelected: function (collectorId) {
                this.collectorId = collectorId
                this.currentPage = 1
                this.searchListTable()
            },
            //数据预览
            dataPreview: function (row) {
                if (row.schemaId) {
                    this.$refs.dataset.dataPreview(row.dataStoreId, row.tenantId, row.schemaId)
                } else {
                    let schemaId = ''
                    getDataset(row.dataStoreId).then(res => {
                        if (res) {
                            schemaId = res.schemaId || res.schema.id
                            this.$refs.dataset.dataPreview(row.dataStoreId, row.tenantId, schemaId)
                            return;
                        }
                        this.$message({
                            message: '数据集不存在！',
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },
            //name查看任务详情
            nameDialog: function (id, collectorId) {
                this.$refs.taskName.nameDialog(id, collectorId)
            },
            //datasource信息编辑
            datasourceDialog: function (dataStoreId) {
                this.$refs.dataSource.datasourceDialog(dataStoreId)
            },
            //object编辑
            objectDialog: function (id, table) {
                this.$refs.object.objectDialog(id, table)
            },
            //列表排序
            getOrder: function (column) {
                var that = this
                if (column.order === 'ascending') {
                    this.orderDirection = 'ASC'
                } else {
                    this.orderDirection = 'DESC'
                }
                that.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                that.parameter = createParameter().Limit(this.pagesize).Sort(this.prop, this.orderDirection).Build(that.parameter, false);
                that.getCollectorTasks(that.parameter);
            }
        },
        mounted() {
            var that = this;
            that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput);
            that.getCollectorTasks(that.parameter);
            that.getCollectorIdsArray();
        }
    };
</script>
<style scoped>
    .con-module .el-row {
        float: left;
        width: 100%;
    }

    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .el-table {
        float: left;
    }

    .tpAddrl {
        color: #FFFFFF;
        margin-right: 0px;
        text-decoration: none;
    }

    .ers-pattern {
        float: left;
        height: 40px;
        line-height: 40px;
        margin-right: 10px;
    }

    .ers-pattern h4 {
        margin: 0px;
        float: left;
    }

    .ers-pattern-col {
        margin-left: 10px;
    }

    .ers-pattern .el-select {
        float: left;
        margin-left: 10px;

    }

    .status-div-create {
        background-color: #337ab7;
        padding: 4px;
        text-align: center;
        font-size: 12px;
        color: white;
    }

    .status-div-stop {
        background-color: #d9534f;
        padding: 4px;
        text-align: center;
        font-size: 12px;
        color: white;
    }

    .status-div-error {
        background-color: #ffa54f;
        padding: 4px;
        text-align: center;
        font-size: 12px;
        color: white;
    }

    .status-div-deploy {
        background-color: #5cb85c;
        padding: 4px;
        text-align: center;
        font-size: 12px;
        color: white;
    }

    .btnLeft {
        padding-left: 125px;
    }

</style>
