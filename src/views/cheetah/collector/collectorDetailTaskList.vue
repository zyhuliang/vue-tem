<template>
    <section class="con-module" id='bm-ch-col-tsakList-tmp'>
        <el-row class="btnClass">
            <div class="btn-right">
                <el-button type="info" id='bm-ch-col-tasklist-create-button' @click="newTask"><i
                        class="icon iconfont icon-ir-add"></i>创建
                </el-button>
                <el-button type="info" id='bm-ch-col-tasklist-copy-button' @click="copyTask"
                           :disabled="multipleSelection.length != 1"><i class="el-icon-edit"></i>复制
                </el-button>
                <el-button type="info" id='bm-ch-col-tasklist-edit-button' @click="editTask"
                           :disabled="!(multipleSelection.length == 1 && multipleSelection[0] && multipleSelection[0].status != 1)">
                    <i class="el-icon-edit"></i>编辑
                </el-button>
                <el-button type="info" id='bm-ch-col-tasklist-start-button' @click="startTask()"
                           :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-start"></i>启用
                </el-button>
                <el-button type="info" id='bm-ch-col-tasklist-stop-button' @click="stopTask()"
                           :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-stop"></i>停用
                </el-button>
                <el-button type="info" id='bm-ch-col-tasklist-delete-button' @click="delTable"
                           :disabled="multipleSelection.length == 0"><i
                        class="icon iconfont icon-ir-directory-delete"></i>删除
                </el-button>
            </div>
            <div class="btn-left">
                <search-date-data name="bm-ch-col-tasklist-refSearchDate-search-select" ref="refSearchDate"
                                  @searchDate="searchListTable" :pagesize="pagesize"
                                  :searchInput="searchInput"></search-date-data>

                <!--todo周期过滤-->
                <div class="ers-pattern ers-pattern-col">
                    <h4>周期</h4>
                    <el-select name="bm-ch-col-tasklist-srcTrigger-search-select" v-model="srcTrigger" placeholder="所有"
                               @visible-change="srcOption($event, 'srcTrigger')">
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
                    <el-select name="bm-ch-col-tasklist-srcStatus-search-select" v-model="srcStatus" multiple collapse-tags
                               placeholder="所有" @visible-change="srcOption($event, 'srcStatus')"
                               @remove-tag="srcOption($event, 'srcStatus', 'remove')">
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
                    <el-select name="bm-ch-col-tasklist-srcLastExecuteStatus-search-select"
                               v-model="srcLastExecuteStatus" multiple collapse-tags placeholder="所有"
                               @visible-change="srcOption($event, 'srcLastExecuteStatus')"
                               @remove-tag="srcOption($event, 'srcLastExecuteStatus', 'remove')">
                        <el-option
                                v-for="item in ['创建', '运行中', '完成', '失败', '终止']"
                                :key="item"
                                :name="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <!--todo数据源过滤-->
                <div class="ers-pattern">
                    <h4>数据源</h4>
                    <el-select name="bm-ch-col-tasklist-srcDatasource-search-select" v-model="srcDatasource" multiple collapse-tags
                               placeholder="所有" @visible-change="srcOption($event, 'srcDatasource')"
                               @remove-tag="srcOption($event, 'srcDatasource', 'remove')">
                        <el-option
                                v-for="item in srcDatasources"
                                :key="item"
                                :name="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <search-table-data name="bm-ch-col-tasklist-searchListTable-search-select" ref="refSearchTable"
                                   @searchKey="searchListTable" :pagesize="pagesize" :startTime="startTime"
                                   :endTime="endTime"></search-table-data>
            </div>
        </el-row>
        <!--内容显示列表页面-->

        <template>
            <el-row class="rf-swap">
                <el-table id="bm-ch-collector-detailTaskList-table" :data="tableData.content"
                          tooltip-effect="dark"
                          v-loading="loading"
                          @selection-change="handleSelectionChange"
                          @sort-change="getOrder"
                          height="calc(100vh - 220px)"
                          style="width: 100%"
                >
                    <el-table-column
                            type="selection">
                    </el-table-column>

                    <el-table-column label="名称" prop="name" width="300" sortable>
                        <template slot-scope="scope">
                            <a @click="nameDialog(scope.row.id)"
                            >
                                {{scope.row.name}}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="数据源" prop="dataSource" sortable width="150">
                        <!--<template slot-scope="scope">-->
                        <!--<el-button-->
                        <!--type="text"-->
                        <!--size="small"-->
                        <!--@click="datasourceDialog(scope.row.dataSourceId)"-->
                        <!--&gt;-->
                        <!--{{scope.row.dataSource}}-->
                        <!--</el-button>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column label="同步对象" prop="object" sortable width="150">
                        <template slot-scope="scope">
                            <a @click="objectDialog(scope.row.dataSourceId, scope.row.object, scope.row.collecterId,collecterName)"
                               v-if="JSON.parse(scope.row.taskJson).dataSource.type == 'JDBC'"
                            >
                                {{scope.row.object}}
                            </a>
                            <span v-else>{{scope.row.object}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数据集" prop="dataStore" sortable width="150">
                    </el-table-column>
                    <el-table-column label="周期情况" align="center" prop="trigger" sortable width="150">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.trigger">单次执行</span>
                            <span v-else>周期执行</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status" width="80" sortable show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.status == 0" class="status-div-create">已创建</div>
                            <div v-else-if="scope.row.status == 1" class="status-div-deploy">已部署</div>
                            <div v-else-if="scope.row.status == 2" class="status-div-stop">已停止</div>
                            <div v-else-if="scope.row.status == -1" class="status-div-error">错 误</div>
                            <div v-else>未知</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后读入" prop="lastReadIn" align="center" sortable="custom"
                                     show-overflow-tooltip width="100">
                    </el-table-column>
                    <el-table-column label="最后写出" prop="lastWriteOut" align="center" sortable="custom"
                                     show-overflow-tooltip width="100">
                    </el-table-column>
                    <el-table-column label="最近变更" prop="lastChange" align="center" sortable="custom"
                                     show-overflow-tooltip width="100">
                    </el-table-column>
                    <el-table-column label="最后执行状态" prop="lastExecuteStatus" width="130" align="center"
                                     sortable="custom">
                        <template slot-scope="scope">
                            <div v-if="scope.row.lastExecuteStatus == 0">创建</div>
                            <div v-else-if="scope.row.lastExecuteStatus == 1">运行中</div>
                            <div v-else-if="scope.row.lastExecuteStatus == 2">完成</div>
                            <div v-else-if="scope.row.lastExecuteStatus == -1">失败</div>
                            <div v-else-if="scope.row.lastExecuteStatus == -2">终止</div>
                            <div v-else>未知</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后执行时间" prop="lastExecuteTime" width="160" :formatter="dateFormat"
                                     sortable="custom">
                    </el-table-column>
                    <el-table-column align="center" fixed="right">
                        <template slot-scope="scope" width="160">
                            <router-link
                                    type="text"
                                    size="small"
                                    :to="{ path: '/collector/executeList/'+scope.row.id+'?collectorId='+collecterName}"
                            >
                                执行列表
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" width="160">
                        <template slot-scope="scope">
                            <a
                                    @click="dataPreview(scope.row)"
                            >
                                预览数据集
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        name="bm-ch-9-el-pagination"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[8, 16, 50, 100]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.totalElements">
                </el-pagination>
            </el-row>
        </template>
        <!--name dialog-->
        <preview-task-name ref="taskName"></preview-task-name>

        <!--数据源 dialog-->
        <preview-data-source ref="dataSource"></preview-data-source>

        <!--同步对象 dialog-->
        <preview-object ref="object"></preview-object>

        <!--数据预览 dialog-->
        <preview-data-set ref="dataset"></preview-data-set>
        <router-view></router-view>
    </section>
</template>

<script>

    import {
        getCollectorTaskList,
        deleteTasks,
        startTasks,
        stopTasks,
        getDataset,
        datasourceList
    } from '@api'
    import searchDateData from '@collectorSearch/searchDateData.vue'
    import searchTableData from '@collectorSearch/searchTableData.vue'
    import previewDataSet from '@collector/taskDialog/datasetDialog.vue'
    import previewObject from '@collector/taskDialog/object.vue'
    import previewTaskName from '@collector/taskDialog/name.vue'
    import previewDataSource from '@collector/taskDialog/dataSource.vue'
    import {queryObject, createParameter} from '@function/queryParameter.js';
    import task from '@jsTask/taskStep.js';

    export default {
        components: {
            searchDateData,
            searchTableData,
            previewDataSet,
            previewObject,
            previewTaskName,
            previewDataSource,
        },
        data() {
            return {
                option: "layout",
                tableData: {},
                dateValue: '',
                show: false,
                currentPage: 1,
                pagesize: 8,
                value: '',
                startTime: '',
                endTime: '',
                searchInput: '',
                parameter: "",
                multipleSelection: [],
                checkList: [],
                loading: false,
                executeList: [],
                collecterName: this.$route.params.id,
                collectorId: this.$route.params.resourceId,
                cols: [],
                rowCollection: [],
                dialogPreviewVisible: false,
                form: '',
                dialogNewTaskJsonVisible: false,
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                srcTrigger: ['所有'],
                srcStatus: [],
                srcDatasource: [],
                srcDatasources: [],
                srcLastExecuteStatus: [],
                ArrStatus: {'已创建': '0', '已部署': '1', '已停止': '2', '错 误': '-1', '未知': '-2'},
                ArrLastExecuteStatus: {'创建': '0', '运行中': '1', '完成': '2', '失败': '-1', '终止': '-2'},
            }
        },
        methods: {
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
            srcOption: function (callback, type, remove) {
                var that = this;
                //callback值为true为下拉，值为false为收回
                if (callback == true) {
                    //点击数据源的筛选下拉时，发送请求获取数据源列表
                    if (type == 'srcDatasource') {
                        datasourceList(that.collecterName).then(res => {
                            this.srcDatasources = res
                        }, err => {
                            this.$message({
                                message: '获取数据源列表失败',
                                type: 'error',
                            })
                        })
                    }
                } else {
                    that.currentPage = 1
                    var len = that.parameter.fieldList.length;//获取当前的查询条件数目
                    var tmpField = that.parameter.fieldList.slice(0)//存放将当前的查询条件转换成数组的值
                    //点击去除单个属性值，将正在修改的参数的清空
                    var tf = {
                        'srcTrigger': 'trigger',
                        'srcStatus': 'status',
                        'srcDatasource': 'dataSource',
                        'srcLastExecuteStatus': 'lastExecuteStatus'
                    }
                    //添加过滤的查询条件
                    if (!remove) {
                        for (var i = 0; i < len; i++) {
                            //将每一条查询条件进行分类，如果没有，添加到全局的查询条件中去
                            if (type && tmpField[i].fieldName === tf[type]) {
                                var l = that.parameter.fieldList.indexOf(tmpField[i])
                                if (l > -1) {
                                    that.parameter.fieldList.splice(l, 1)
                                }
                            }
                        }
                    } else {
                        //防止删除数组时for循环出错，新建变量然后赋值
                        for (var i = 0; i < len; i++) {
                            if (tmpField[i].fieldName == tf[type]) {
                                //当修改的类型为status时，就将其去除
                                var l = that.parameter.fieldList.indexOf(tmpField[i])
                                if (l > -1) {
                                    that.parameter.fieldList.splice(l, 1)
                                    break
                                }
                            }
                        }
                    }
                    //根据某个字段拼成query参数
                    if (type === 'srcTrigger') {
                        //根据周期字段判断是不是单次执行
                        if (that.srcTrigger === '单次执行') {
                            that.parameter = createParameter("trigger", '', "EQUAL").Build(that.parameter);
                        } else if (that.srcTrigger === '周期执行') {
                            that.parameter = createParameter("trigger", '', "NOT_EQUAL").Build(that.parameter);
                        }
                    } else if (type === 'srcStatus') {
                        // 根据选中的状态新型请求参数的转换
                        let sf = []
                        for (var i = 0; i < that.srcStatus.length; i++) {
                            sf.push(that.ArrStatus[that.srcStatus[i]]);
                        }
                        //将获取的状态数据编辑成参数，添加到对应的全局参数中
                        that.parameter = createParameter("status", sf, "IN").Build(that.parameter);
                    } else if (type === 'srcDatasource') {
                        //获取查询条件添加到对应的全局参数中
                        that.parameter = createParameter("dataSource", that.srcDatasource, "IN").Build(that.parameter);
                    } else if (type === 'srcLastExecuteStatus') {
                        // 根据选中的最后执行状态新型请求参数的转换
                        let lef = []
                        //将获取的最后执行状态数据编辑成参数，添加到对应的全局参数中
                        for (var i = 0; i < that.srcLastExecuteStatus.length; i++) {
                            lef.push(that.ArrLastExecuteStatus[that.srcLastExecuteStatus[i]])
                        }
                        that.parameter = createParameter("lastExecuteStatus", lef, "IN").Build(that.parameter);
                    }
                    that.parameter.fieldList = that.parameter.fieldList ? that.parameter.fieldList : []
                    that.searchListTable()
                }
            },
            //新建任务
            newTask: function () {
                var that = this;
                //添加复制标识变量
                localStorage.taskEntity = JSON.stringify({isCopy: false});
                that.$router.push({path: '/task/add/' + that.collecterName + '/' + that.collectorId})
            },
            //复制任务
            copyTask: function () {
                var that = this;
                //添加一个判断是不是复制的字段
                that.multipleSelection[0].isCopy = true
                //获取row内容放入localStorage
                localStorage.taskEntity = JSON.stringify(this.multipleSelection[0]);
                that.$router.push({path: '/task/add/' + that.collecterName + '/' + that.collectorId})
            },
            //编辑任务
            editTask: function () {
                var that = this;
                //添加一个判断是不是复制的字段
                that.multipleSelection[0].isCopy = true
                //添加一个jobId
                that.multipleSelection[0].jobId = this.multipleSelection[0].id
                //获取row内容放入localStorage
                localStorage.taskEntity = JSON.stringify(this.multipleSelection[0]);
                that.$router.push({path: '/task/add/' + that.collecterName + '/' + that.collectorId + "?jobId=" + this.multipleSelection[0].id})
            },
            //table查询的列表
            searchListTable: function (parameter, type, startTime, endTime, searchInput, pagesize) {
                var that = this;
                that.currentPage = 1
                if (pagesize) that.pagesize = pagesize;
                that.startTime = startTime;
                that.endTime = endTime;
                if (searchInput != undefined) that.searchInput = searchInput;
                var len = that.parameter.fieldList ? that.parameter.fieldList.length : 0;
                var tmpField = that.parameter.fieldList ? that.parameter.fieldList.slice(0) : {}
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
//            获取采集器任务列表
            getCollectorTasks: function (para) {
                if (!para) {
                    var para = this.parameter;
                }
                this.loading = true;
                getCollectorTaskList(this.collecterName, para).then((res) => {
                    this.tableData = res;
                    this.loading = false;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                });
            },
//			删除采集器导入任务
            delTable: function () {
                var that = this;
                var tdIds = []
                var tdLength = 0;
                this.multipleSelection.forEach(function (i, index) {
                    tdIds.push(i.id);
                    tdLength = index + 1;
                });
                that.$confirm('真的要删除' + tdLength + '个数据导入任务?', '提示', {}).then(() => {
                    deleteTasks(tdIds).then(data => {
                        that.getCollectorTasks(that.parameter);
                        that.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }).catch(() => {
                });

            },
//			启用任务
            startTask: function () {
                if (this.multipleSelection) {
                    var that = this;
                    var tdIds = []
                    this.multipleSelection.forEach(function (i) {
                        tdIds.push(i.id);
                    });
                    startTasks(tdIds).then(data => {
                        that.getCollectorTasks(that.parameter);
                        that.$message({
                            message: '恭喜你，任务已启用！',
                            type: 'success'
                        });
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },
//			停用任务
            stopTask: function () {
                if (this.multipleSelection) {
                    var that = this;
                    var tdIds = []
                    this.multipleSelection.forEach(function (i) {
                        tdIds.push(i.id);
                    });
                    stopTasks(tdIds).then(data => {
                        that.getCollectorTasks(that.parameter);
                        that.$message({
                            message: '恭喜你，任务已停用！',
                            type: 'success'
                        });
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },
//			数据预览
            dataPreview: function (row) {
                if (row.schemaId) {
                    this.$refs.dataset.dataPreview(row.dataStoreId, row.tenantId, row.schemaId)
                } else {
                    let schemaId = ''
                    getDataset(row.dataStoreId, row.schemaId).then(res => {
                        schemaId = res.schemaId || res.schema.id
                        this.$refs.dataset.dataPreview(row.dataStoreId, row.tenantId, schemaId)
                    })
                    // .catch( (err) => {

                    // })
                }

            },
//			name查看任务详情
            nameDialog: function (id) {
                this.$refs.taskName.nameDialog(id)
            },
//			datasource信息编辑
            datasourceDialog: function (dataStoreId) {
                this.$refs.dataSource.datasourceDialog(dataStoreId)
            },
//			object编辑
            objectDialog: function (id, table, collecterName) {
                this.$refs.object.objectDialog(id, table, collecterName)
            },
//			列表排序
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
                that.parameter = createParameter().Limit(this.pagesize).Sort(column.prop, this.orderDirection).Build(that.parameter, false);
                that.getCollectorTasks(that.parameter);
            }
        },
        mounted() {
            var that = this;
            that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput);
            that.getCollectorTasks(that.parameter);
            //接收创建task、之后刷新列表
            task.$on('refreshCollectorList', function () {
                that.getCollectorTasks();
            })
        },
        watch: {
            '$route'(to, from) {
                var that = this;
                that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput, this.parameter.fieldList);
                //如果是执行列表返回就刷新列表
                if (from.name == "执行列表")
                    that.getCollectorTasks(that.parameter);
            }
        }
    }

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

    .ers-pattern-col {
        margin-left: 10px;
    }

    .ers-pattern h4 {
        margin: 0px;
        float: left;
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

    .copy-button {
        margin-left: 10px;
        margin-right: 10px;
        font-size: 16px;
    }

    .btn-left {
        padding-left: 160px;
    }
</style>

