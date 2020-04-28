<template>
    <section id='bm-ch-sys-syschronization-tmp'>
        <div class="synchronizationsBox">
            <el-row class="btnClass">
                <div class="btn-right">
                    <el-button type="info" id='bm-ch-sys-syschronization-create-button' @click="newTask"><i
                            class="icon iconfont icon-ir-add"></i>创建
                    </el-button>
                    <el-button type="info" id='bm-ch-sys-syschronization-copy-button' @click="copyTask"
                               :disabled="multipleSelection.length != 1"><i class="el-icon-edit"></i>复制
                    </el-button>
                    <el-button type="info" id='bm-ch-sys-syschronization-edit-button' @click="editTask"
                               :disabled="!(multipleSelection.length == 1 && multipleSelection[0] && multipleSelection[0].status != 1)">
                        <i class="el-icon-edit"></i>编辑
                    </el-button>
                    <el-button type="info" id='bm-ch-sys-syschronization-start-button' @click="startTask()"
                               :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-start"></i>启用
                    </el-button>
                    <el-button type="info" id='bm-ch-sys-syschronization-stop-button' @click="stopTask()"
                               :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-stop"></i>停用
                    </el-button>
                    <el-button type="info" id='bm-ch-sys-syschronization-delete-button' @click="delTable"
                               :disabled="multipleSelection.length == 0"><i
                            class="icon iconfont icon-ir-directory-delete"></i>删除
                    </el-button>
                </div>
                <div class="btnLeft">
                    <search-date-data name='bm-ch-sys-syschronization-refSearchDate-search-select' ref="refSearchDate"
                                      @searchDate="searchListTable" :pagesize="pagesize"
                                      :searchInput="searchInput"></search-date-data>

                    <!--todo周期过滤-->
                    <div class="ers-pattern ers-pattern-col">
                        <h4>周期</h4>
                        <el-select name='bm-ch-sys-syschronization-srcTrigger-search-select' v-model="srcTrigger"
                                   placeholder="所有" @visible-change="srcOption($event, 'srcTrigger')">
                            <el-option
                                    v-for="item in ['所有', '单次执行','周期执行']"
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
                        <el-select name='bm-ch-sys-syschronization-status-search-select' v-model="srcStatus" multiple collapse-tags
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
                        <el-select name='bm-ch-sys-syschronization-srcLastExecuteStatus-search-select'
                                   v-model="srcLastExecuteStatus" multiple collapse-tags placeholder="所有"
                                   @visible-change="srcOption($event, 'srcLastExecuteStatus')"
                                   @remove-tag="srcOption($event, 'srcLastExecuteStatus', 'remove')">
                            <el-option
                                    v-for="item in ['创建', '运行中', '完成', '失败', '未知']"
                                    :key="item"
                                    :name="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <search-table-data ref="refSearchTable"
                                       name='bm-ch-sys-syschronization-searchListTable-search-select'
                                       @searchKey="searchListTable" :pagesize="pagesize" :startTime="startTime"
                                       :endTime="endTime"></search-table-data>
                </div>
                <!--高级搜索-->
                <!--<new-search :tableTitle="tableTitle" interFace = "synchronizations" @getTableData="getTableData"></new-search>-->
                <!-- <search-table-data ref="refSearchTable" @searchKey = "searchListTable" :pagesize = "pagesize" :startTime="startTime" :endTime="endTime"></search-table-data>
                <search-date-data  ref="refSearchDate" @searchDate="searchListTable" :pagesize = "pagesize" :searchInput="searchInput"></search-date-data> -->


            </el-row>
            <!--内容显示列表页面-->
            <template>
                <div class="rf-swap">
                    <el-table id="bm-ch-syschronization-table" :data="tableData.content"
                              tooltip-effect="dark"
                              @selection-change="handleSelectionChange"
                              @sort-change="getOrder"
                              v-loading="loading"
                              height="calc(100vh - 220px)"
                              style="width: 100%">
                        <el-table-column
                                type="selection">
                        </el-table-column>

                        <el-table-column label="名称" prop="name" sortable="custom" min-width="200">
                            <template slot-scope="scope">
                                <a @click="nameDialog(scope.row.id)">
                                    {{scope.row.name}}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column label="数据源" prop="dataSource" sortable="custom" min-width="200">
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
                        <el-table-column label="同步对象" prop="object" sortable="custom" width="150">
                            <template slot-scope="scope">
                                <a
                                        @click="objectDialog(scope.row.dataSourceId, scope.row.object)"
                                        v-if="JSON.parse(scope.row.taskJson).dataSource.type == 'JDBC'"
                                >
                                    {{scope.row.object}}
                                </a>
                                <span v-else>{{scope.row.object}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数据集" prop="dataStore" sortable="custom" width="150">
                        </el-table-column>
                        <el-table-column label="周期情况" prop="trigger" width="100" align="left" sortable="custom">
                            <template slot-scope="scope">
                                <span v-if="!scope.row.trigger">单次执行</span>
                                <span v-else>周期执行</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" prop="createTime" min-width="100" align="left"
                                         :formatter="dateFormat" sortable="custom">
                        </el-table-column>
                        <el-table-column label="状态" prop="status" align="center" sortable="custom">
                            <template slot-scope="scope">
                                <div v-if="scope.row.status == 0" class="status-div-create">已创建</div>
                                <div v-else-if="scope.row.status == 1" class="status-div-deploy">已部署</div>
                                <div v-else-if="scope.row.status == 2" class="status-div-stop">已停止</div>
                                <div v-else-if="scope.row.status == -1" class="status-div-error">错 误</div>
                                <div v-else>未知</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="最后读入" prop="lastReadIn" align="center" sortable="custom" width="100">
                        </el-table-column>
                        <el-table-column label="最后写出" prop="lastWriteOut" align="center" sortable="custom" width="100">
                        </el-table-column>
                        <el-table-column label="最近变更" prop="lastChange" align="center" sortable="custom" width="100">
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
                        <el-table-column label="最后执行时间" prop="lastExecuteTime" min-width="140" :formatter="dateFormat"
                                         align="left" sortable="custom">
                        </el-table-column>
                        <el-table-column width="80" align="center" fixed="right">
                            <template slot-scope="scope">
                                <router-link
                                        type="text"
                                        size="small"
                                        :to="{ path: '/synchronization/executeList/'+scope.row.id}"
                                >
                                    执行列表
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column width="90" fixed="right">
                            <template slot-scope="scope">
                                <a @click="dataPreview(scope.row)"
                                >
                                    预览数据集
                                </a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            name="bm-ch-4-el-pagination"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[8, 16, 50, 100]"
                            :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.totalElements">
                    </el-pagination>
                </div>
            </template>
            <!--name dialog-->
            <preview-task-name ref="taskName"></preview-task-name>

            <!--数据源 dialog-->
            <preview-data-source ref="dataSource" :isShowDialog="isShowDialog" :dataStoreId="dataStoreId"
                                 v-on:ShowDialog="ShowDialog"></preview-data-source>

            <!--同步对象 dialog-->
            <preview-object ref="object"></preview-object>

            <!--数据预览 dialog-->
            <preview-data-set ref="dataset"></preview-data-set>

            <router-view></router-view>
        </div>
    </section>
</template>

<script>
    import searchDateData from '@components/collectorSearch/searchDateData.vue'
    import searchTableData from '@components/collectorSearch/searchTableData.vue'
    import NewSearch from '@components/search/newSearch.vue'
    import previewDataSet from '@components/collector/taskDialog/datasetDialog.vue'
    import previewObject from '@components/collector/taskDialog/object.vue'
    import previewTaskName from '@components/collector/taskDialog/name.vue'
    import previewDataSource from '@components/collector/taskDialog/dataSource.vue'
    import {
        getSynchronizationTaskList,
        deleteTasks,
        startTasks,
        stopTasks,
    } from '../../../api/api'
    import {getDataset, getTaskJson, getDataSource, postSynchronizationTask} from '@api'
    import {queryObject, createParameter} from '@components/function/queryParameter.js';
    import task from '@components/jsTask/taskStep.js';

    var parameter = queryObject();
    export default {
        components: {
            NewSearch,
            searchDateData,
            searchTableData,
            previewDataSet,
            previewObject,
            previewTaskName,
            previewDataSource,
        },
        data() {

            return {
                dataStoreId: '',
                isShowDialog: false,
                cols: [],
                multipleSelection: [],
                option: "layout",
                tableData: {},
                show: false,
                currentPage: 1,
                pagesize: 8,
                loading: true,
                self: this,
                startTime: '',
                endTime: '',
                searchInput: '',
                parameter: "",
                form: '',
                dialogNewTaskJsonVisible: false,
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                field: '',
                tableTitle: [{
                    value: 'name',
                    label: '名称',
                }, {
                    value: 'dataSource',
                    label: '数据源',
                }, {
                    value: 'object',
                    label: '同步对象',
                }, {
                    value: 'dataStore',
                    label: '数据集',
                }, {
                    value: 'trigger',
                    label: '周期情况',
                }, {
                    value: 'createTime',
                    label: '创建时间',
                }, {
                    value: 'status',
                    label: '状态',
                    options: [{
                        value: '0',
                        label: '已创建',
                    }, {
                        value: '1',
                        label: '已部署',
                    }, {
                        value: '2',
                        label: '已停止',
                    }, {
                        value: '-1',
                        label: '错误',
                    }]
                }, {
                    value: 'lastExecuteStatus',
                    label: '最后执行状态',
                    options: [{
                        value: '0',
                        label: '创建',
                    }, {
                        value: '1',
                        label: '运行中',
                    }, {
                        value: '2',
                        label: '完成',
                    }, {
                        value: '-1',
                        label: '失败',
                    }, {
                        value: '-2',
                        label: '失败',
                    }]
                }, {
                    value: 'lastExecuteTime',
                    label: '最后执行时间',
                }],
                srcTrigger: ['所有'],
                srcStatus: [],
                srcLastExecuteStatus: [],
                ArrStatus: {'已创建': '0', '已部署': '1', '已停止': '2', '错 误': '-1', '未知': '-2'},//状态的name与value的对应map
                ArrLastExecuteStatus: {'创建': '0', '运行中': '1', '完成': '2', '失败': '-1', '终止': '-2'},//最后执行状态的name与value的对应map
            }
        },
        methods: {
            getTableData(data) {
                this.tableData = data
            },
            ShowDialog() {
                this.isShowDialog = false;
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput, this.parameter.fieldList))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getSynchronizationTasks(this.parameter, this.resType);
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput, this.parameter.fieldList)
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getSynchronizationTasks(this.parameter, this.resType);
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //根据不同的字段进行筛选过滤
            srcOption: function (callback, type, remove) {
                var that = this;
                if (callback != true) {
                    that.currentPage = 1
                    var len = that.parameter.fieldList.length;//获取当前的查询条件数目
                    var tmpField = that.parameter.fieldList.slice(0)//存放将当前的查询条件转换成数组的值
                    //点击去除单个属性值，将正在修改的参数的清空
                    var tf = {
                        'srcTrigger': 'trigger',
                        'srcStatus': 'status',
                        'srcLastExecuteStatus': 'lastExecuteStatus'
                    }
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
                that.$router.push({path: '/task/add/WOVEN-SERVER/synchronization'})
            },
            //复制任务
            copyTask: function () {
                var that = this;
                //添加一个判断是不是复制的字段
                that.multipleSelection[0].isCopy = true
                //获取row内容放入localStorage
                localStorage.taskEntity = JSON.stringify(this.multipleSelection[0]);
                that.$router.push({path: '/task/add/WOVEN-SERVER/synchronization'})
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
                that.$router.push({path: '/task/add/WOVEN-SERVER/' + this.multipleSelection[0].id})
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
                this.getSynchronizationTasks(that.parameter)
            },
            //获取同步任务列表
            getSynchronizationTasks: function (para) {
                if (!para) {
                    para = this.parameter
                }
                this.loading = true;
                getSynchronizationTaskList(para).then((res) => {
                        this.tableData = res;
                        this.loading = false;
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                );
            },
            //删除同步任务
            delTable: function delTable() {
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                that.$confirm('真的要删除' + tbIds.length + '个数据导入任务?', '提示', {}).then(() => {
                    deleteTasks(tbIds).then(data => {
                            that.getSynchronizationTasks(this.parameter);
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
                        }
                    )
                }).catch(() => {

                });
            },

            //启用同步任务
            startTask: function () {
                if (this.multipleSelection) {
                    var that = this;
                    var tdIds = []
                    this.multipleSelection.forEach(function (i) {
                        tdIds.push(i.id);
                    });
                    startTasks(tdIds).then(data => {
                            that.getSynchronizationTasks(this.parameter);
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
                        }
                    )
                }
            },
            //停用同步任务
            stopTask: function () {
                if (this.multipleSelection) {
                    var that = this;
                    var tdIds = []
                    this.multipleSelection.forEach(function (i) {
                        tdIds.push(i.id);
                    });
                    stopTasks(tdIds).then(data => {
                            that.getSynchronizationTasks(this.parameter);
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
                        }
                    )
                }
            },
            //数据预览
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
            //name查看任务详情
            nameDialog: function (id) {
                this.$refs.taskName.nameDialog(id)
            },
            //datasource信息编辑
            datasourceDialog: function (dataStoreId) {
                this.dataStoreId = dataStoreId;
                this.isShowDialog = true;
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
                this.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                that.parameter = createParameter().Limit(this.pagesize).Sort(column.prop, this.orderDirection).Build(that.parameter, false);
                that.getSynchronizationTasks(that.parameter);
            }
        },
        mounted() {
            var that = this;
            if(this.$route.path=='/synchronization'){
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
                this.parameter.fieldList = []
                this.currentPage = (this.parameter.offset / this.parameter.limit) + 1;
                this.pagesize = this.parameter.limit;
            }else if(JSON.parse(localStorage.getItem("parameter"))) {
                this.parameter = JSON.parse(localStorage.getItem("parameter"));
                this.currentPage = (this.parameter.offset / this.parameter.limit) + 1;
                this.pagesize = this.parameter.limit;
            } else {
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
            }
            //that.parameter = localStorage.getItem("parameter")?JSON.parse(localStorage.getItem("parameter")):that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput);
            that.getSynchronizationTasks(that.parameter);
            //接受task提交之后的列表页刷新
            task.$on('refreshSynchronizationList', function () {
                that.getSynchronizationTasks();
            });
        },
        watch: {
            '$route'(to, from) {
                var that = this;
                that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput, this.parameter.fieldList);
                //如果是执行列表返回就刷新列表
                if (from.name == "执行列表"){
                    that.getSynchronizationTasks();
                }
            },
            parameter() {
                localStorage.setItem("parameter", JSON.stringify(this.parameter));
            }
        }
    };

</script>

<style lang="scss" scoped>
    .con-module {
        padding: 20px;
    }

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

    .copy-button {
        margin-left: 10px;
        margin-right: 10px;
        font-size: 16px;
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

    .dialog-preview {
        background-color: #23b8a1;
    }

    dialog-preview-title {
        background-color: #000000;
        color: #ffffff;
    }

    .dialog-header {
        font-size: 20px;
        font-weight: 100
    }

    .dialog-body {
        width: 100%;
        margin-top: -15px;
        margin-bottom: 15px;
        max-height: 500px;
    }

    .synchronizationsBox {
        .btn-right {
            float: right;
            /*margin-right: 20px;*/
        }
    }

    .btnLeft {
        /*padding-left: 125px;*/
    }
</style>
