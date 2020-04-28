<template >
    <section >   	
        <div>
            <el-row class="btnClass">
                <div class="seach-left">
                    <search-table-data name="ch-components-globalSearch-fileImport-search-date-data" ref="refSearchTable" @searchKey = "searchListTable" :pagesize = "pagesize" :startTime="startTime" :endTime="endTime"></search-table-data>
                    <search-date-data  name="ch-components-globalSearch-fileImport-search-table-data" ref="refSearchDate" @searchDate="searchListTable" :pagesize = "pagesize" :searchInput="searchInput"></search-date-data>
                </div>
            </el-row>
            <!--内容显示列表页面-->
            <template>
                <el-row class="rf-swap">
                    <el-table 
                    	      @sort-change="getOrder"
                    	     :data="tableData.content"
                              tooltip-effect="dark"
                              v-loading="loading"
                              id="bm-com-global-search-tables-fileImport-table"
                              @selection-change="handleSelectionChange"
                              style="width: 100%" height="calc(100vh - 200px)">


                        <el-table-column  label="名称" prop="name"  with="100"  sortable="custom">
                            <template slot-scope="scope">
                                <el-button
                                        type="text"
                                        size="small"

                                >
                                    {{scope.row.name}}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="数据源" prop="dataSource" with="50" sortable="custom">
                        </el-table-column>
                        <el-table-column label="同步对象" prop="object" with="50" sortable="custom">
                            <template slot-scope="scope">
                                <el-button
                                        type="text"
                                        size="small"
                                        style="padding-left: -15px;"
                                        @click="objectDialog(scope.row.dataSourceId, scope.row.object)"
                                        v-if="JSON.parse(scope.row.taskJson).dataSource.type == 'JDBC'"
                                >
                                    {{scope.row.object}}
                                </el-button>
                                <span v-else>{{scope.row.object}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="周期情况" prop="trigger" with="50" sortable="custom">
                            <template slot-scope="scope">
                                <span v-if="scope.row.trigger == ''">单次执行</span>
                                <span v-else>周期执行</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" prop="createTime" with="50" :formatter="dateFormat" sortable="custom">
                        </el-table-column>
                        <el-table-column label="状态" prop="status" width="80" sortable="custom">
                            <template slot-scope="scope">
                                <div  v-if="scope.row.status == 0" class="status-div-create">已创建</div >
                                <div  v-else-if="scope.row.status == 1"  class="status-div-deploy">已部署</div >
                                <div  v-else-if="scope.row.status == 2" class="status-div-stop">已停止</div >
                                <div  v-else-if="scope.row.status == -1" class="status-div-error">错 误</div >
                                <div  v-else>未知</div >
                            </template>
                        </el-table-column>
                        <el-table-column label="最后执行时间" prop="lastExecuteTime" with="50" :formatter="dateFormat" sortable="custom">
                        </el-table-column>
                        <el-table-column label="最后执行状态" prop="lastExecuteStatus" with="50" sortable="custom">
                            <template slot-scope="scope">
                                <div  v-if="scope.row.lastExecuteStatus == 0" >创建</div >
                                <div  v-else-if="scope.row.lastExecuteStatus == 1">运行中</div >
                                <div  v-else-if="scope.row.lastExecuteStatus == 2" >完成</div >
                                <div  v-else-if="scope.row.lastExecuteStatus == -1" >失败</div >
                                <div  v-else-if="scope.row.lastExecuteStatus == -2" >终止</div >
                                <div  v-else>未知</div >
                            </template>
                        </el-table-column>

                    </el-table>
                    <el-pagination
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

            <!--预览文件目录-->
            <!-- Table -->
            <el-dialog title="预览文件目录" :visible.sync="dialogTableVisible">
                <el-button size="small" type="primary" @click="previewDir()" round>根目录</el-button>
                <el-table :data="gridData">
                    <el-table-column property="name" label="名称" >
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.dir == true" @click="gotoDir(scope.row.path)" type="text">{{scope.row.name}}</el-button>
                            <el-button v-else-if="scope.row.dir == false" class="no-link" type="text" disabled>{{scope.row.name}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column property="len" label="大小(byte)" width="200"></el-table-column>
                    <el-table-column property="modificationTime" label="最后修改时间" :formatter="dateFormat"></el-table-column>
                </el-table>
            </el-dialog>

            <!--name dialog-->
            <preview-task-name ref="taskName"></preview-task-name>

            <!--数据源 dialog-->
            <preview-data-source ref="dataSource"></preview-data-source>

            <!--同步对象 dialog-->
            <preview-object ref="object"></preview-object>

            <!--&lt;!&ndash;数据预览 dialog&ndash;&gt;
            <preview-data-set ref="dataset"></preview-data-set>-->

            <router-view></router-view>
        </div>
    </section>
</template>

<script>
    import searchDateData from '@collectorSearch/searchDateData.vue'
    import searchTableData from '@collectorSearch/searchTableData.vue'
    import previewDataSet from '@collector/taskDialog/datasetDialog.vue'
    import previewObject from '@collector/taskDialog/object.vue'
    import previewTaskName from '@collector/taskDialog/fileName.vue'
    import previewDataSource from '@collector/taskDialog/dataSource.vue'
    import { getFileSynchronizationTaskList,deleteTasks,startTasks,stopTasks,getFileList} from '../../../api/api'
    import { getTaskJson,getDataSource } from '@api'
    import {queryObject,createParameter} from '@function/queryParameter.js';
    import task  from '@jsTask/taskStep.js';
    var parameter=queryObject();
    export default {
        components: {
            searchDateData,
            searchTableData,
            previewDataSet,
            previewObject,
            previewTaskName,
            previewDataSource
        },
        data() {

            return {
                cols:[],
                multipleSelection: [],
                option:"layout",
                tableData:{},
                show:false,
                currentPage:1,
                pagesize:8,
                loading: false,
                self:this,
                startTime:'',
                endTime:'',
                searchInput:'',
                parameter:"",
                form:'',
                dialogNewTaskJsonVisible: false,
                dialogTableVisible: false,
                formLabelWidth: '120px',
                gridData: [],
                prop: 'lastModifiedTime',
                orderDirection:'DESC',
                rootPath:""
            }
        },
        methods: {
        	//列表排序
			getOrder(column) {
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
                this.pagesize = 8
				this.currentPage = 1
				that.parameter = createParameter().Sort(column.prop,this.orderDirection).Build();
				that.getSynchronizationTasks(that.parameter);
			},
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
                this.getSynchronizationTasks(this.parameter,this.resType)
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput)
                this.getSynchronizationTasks(this.parameter,this.resType)
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //table查询的列表
            searchListTable: function (parameter, type, startTime,endTime, searchInput,pagesize) {
                var that = this;
                that.currentPage = 1
                if(pagesize)that.pagesize = pagesize;
                that.startTime = startTime;
                that.endTime = endTime;
                if(searchInput!=undefined)that.searchInput = searchInput;
                var len = that.parameter.fieldList.length
                var tmpField = that.parameter.fieldList.slice(0)
                for(var i=0;i<len;i++){
                    if(startTime !== 'undefined' && tmpField[i].fieldName === 'lastModifiedTime'&& (tmpField[i].comparatorOperator== "GREATER_THAN" || tmpField[i].comparatorOperator == "LESS_THAN")){
                        var l = that.parameter.fieldList.indexOf(tmpField[i])
                        if(l >- 1){
                            that.parameter.fieldList.splice(l,1)
                        }
                    }else if(searchInput!=undefined && tmpField[i].fieldName === 'name'){
                        var l = that.parameter.fieldList.indexOf(tmpField[i])
                        if(l >- 1){
                            that.parameter.fieldList.splice(l,1)
                        }
                    }
                }
                that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput, this.parameter.fieldList);
                this.parameter = createParameter().Sort(this.prop,this.orderDirection).Build(that.parameter,false)
                this.getSynchronizationTasks(that.parameter)
            },
//			获取同步任务列表
            getSynchronizationTasks: function (para) {
                if(!para){
                    para = this.parameter
                }
                this.loading = true;
                getFileSynchronizationTaskList(para).then((res) => {
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
            //新建任务
            newTask: function () {
                var that = this;
                //添加复制标识变量
                localStorage.taskEntity = JSON.stringify({isCopy: false});
                that.$router.push({ path: '/fileTask/add'})
            },
            //复制任务
            copyTask: function () {
                var that = this;
                //添加一个判断是不是复制的字段
                that.multipleSelection[0].isCopy = true
                //获取row内容放入localStorage
                localStorage.taskEntity = JSON.stringify(this.multipleSelection[0]);
                that.$router.push({ path: '/fileTask/add'})
            },
            // 预览文件目录——查看目录下内容
            gotoDir:function (path) {
                var that = this
                getFileList(path).then(data => {
                    that.gridData = data
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }).catch(function (error) {
                    // 由网络或者服务器抛出的错误
                    that.$confirm("无权限","错误", {
                        type: "error"
                    })
                })
            },
//			删除同步任务
            delTable: function delTable() {
                var tableRefresh = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                tableRefresh.$confirm('真的要删除'+tbIds.length+'个数据导入任务?', '提示', {
                }).then(() => {
                    deleteTasks(tbIds).then(data => {
                        tableRefresh.getSynchronizationTasks(this.parameter);
                        tableRefresh.$message({
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

//			启用同步任务
            startTask:function () {
                if(this.multipleSelection){
                    var that = this;
                    var tdIds = []
                    this.multipleSelection.forEach(function (i){
                        tdIds.push(i.id);
                    });
                    startTasks(tdIds).then(data => {
                        that.getSynchronizationTasks();
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },
//			停用同步任务
            stopTask:function () {
                if(this.multipleSelection){
                    var that = this;
                    var tdIds = []
                    this.multipleSelection.forEach(function (i){
                        tdIds.push(i.id);
                    });
                    stopTasks(tdIds).then(data => {
                        that.getSynchronizationTasks();
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
            /*dataPreview: function (dataStoreId,tenantId) {
                this.$refs.dataset.dataPreview(dataStoreId,tenantId)
            },*/
//			name查看任务详情
            nameDialog: function (id) {
                this.$refs.taskName.nameDialog(id)
            },
//			datasource信息编辑
            datasourceDialog: function (dataStoreId) {
                this.$refs.dataSource.datasourceDialog (dataStoreId)
            },
//			object编辑
            objectDialog: function (id,table) {
                this.$refs.object.objectDialog(id,table)
            },
            // 目录预览
            previewDir:function (taskJson) {
                if(!taskJson){
                    getFileList(this.rootPath).then(data => {
                        this.gridData = data
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }else{
                    var obj = JSON.parse(taskJson)
                    this.dialogTableVisible = true
                    var that = this
                    that.rootPath = obj.dataStore.path
                    getFileList(obj.dataStore.path).then(data => {
                        that.gridData = data
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            }
        },
        mounted() {
            var that = this;
            that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
            that.getSynchronizationTasks(that.parameter);
            task.$on('refreshFileSynchronizationListImport',function () {
                that.getSynchronizationTasks();
            })
        },
        watch: {
            '$route' (to, from) {
                var that = this;
                that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
                that.getSynchronizationTasks(that.parameter);
//                task.$on('refreshFileSynchronizationListImport',function () {
//                    that.getSynchronizationTasks();
//                })
            }
        }
    };

</script>

<style scoped>
    .con-module{
        padding: 20px;
    }
    .con-module .el-row{
        float: left;
        width: 100%;
    }
    .con-module .el-row .el-button i{
        font-size: 13px;
    }

    .el-table{
        float: left;
    }

    .tpAddrl{
        color: #FFFFFF;
        margin-right: 0px;
        text-decoration: none;
    }
    .copy-button{
        margin-left: 10px;
        margin-right: 10px;
        font-size: 16px;
    }

    .ers-pattern{
        float: left;
        width: 300px;
        height: 40px;
        line-height: 40px;
    }

    .ers-pattern h4{
        margin: 0px;
        float: left;
    }
    .ers-pattern .el-select{
        float: left;
        margin-left: 10px;
    }
    .status-div-create{
        background-color:#337ab7;
        padding:4px;
        text-align: center;
        font-size:12px;
        color: white;
    }
    .status-div-stop{
        background-color:#d9534f;
        padding:4px;
        text-align: center;
        font-size:12px;
        color: white;
    }
    .status-div-error{
        background-color:#ffa54f;
        padding:4px;
        text-align: center;
        font-size:12px;
        color: white;
    }
    .status-div-deploy{
        background-color:#5cb85c;
        padding:4px;
        text-align: center;
        font-size:12px;
        color: white;
    }
    .dialog-preview{
        background-color: #23b8a1;
    }
    dialog-preview-title{
        background-color: #000000;
        color: #ffffff;
    }
    .dialog-header{
        font-size: 20px;
        font-weight: 100
    }
    .dialog-body{
        width: 100%;
        margin-top: -15px;
        margin-bottom: 15px;
        max-height:500px;
    }
    .linkDir{
        color: red;
    }
    .no-link{
        color: black;
    }
.el-button--text{
	color:#333;
}
.el-button{
	cursor:text;
}
</style>