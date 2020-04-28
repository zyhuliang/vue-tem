<template>

    <section class="con-module" id="bm-rh-design-history">
        <div class="child-content">
            <router-view></router-view>
            <el-row>
               <div class="row">
                    <div class="btn-left">
                    <el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search" name="searchInput">
                        <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search" name="searchBtn"></el-button>
                    </el-input>
                    <el-date-picker
                            v-model="dateValue"
                            value-format="timestamp"
                            type="daterange"
                            @change="handledateValue"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </div>

                <div class="btn-right">
                    <el-button type="info" @click="historyReturn" id="historyReturn"><i class="icon iconfont icon-ir-left"></i>&nbsp;返回</el-button>
                    <el-button type="info" @click="killExection" :disabled="disabledStop" name="killExection"><i class="icon iconfont icon-ir-stop"></i>停止</el-button>
                    <el-button type="info" @click="reRun" :disabled="multipleSelection.length == 0" name="reRun"><i class="icon iconfont icon-ir-start"></i>重启</el-button>
                    <el-button type="info" @click="delTable" :disabled="multipleSelection.length == 0" name="delTable"><i class="icon iconfont icon-ir-directory-delete"></i>删除</el-button>
                </div>
               </div>
            </el-row>

            <!-- <el-row class="rf-swap"> -->
                <el-row>
                <el-table
                        v-loading = "loading"
                        :data="table.content"
                        tooltip-effect="dark"
                        id="bm-rh-design-history-table"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                        @sort-change="getOrder"
                        height="calc(100vh - 175px)">
                    <el-table-column
                            type="selection"
                            width="40">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            sortable="custom"
                            label="名称">
                        <template slot-scope="scope">
                            <router-link v-show="projectPath" class="detail"   :to="{  path:'/project/design/executingDetail/' + scope.row.flowId + '/exection/'+ scope.row.jobId +'/info'}"><a type="text" class="detail-btn">{{scope.row.name}}</a></router-link>
                            <router-link v-show="!projectPath" class="detail"   :to="{  path:'/design/executingDetail/' + scope.row.flowId + '/exection/'+ scope.row.jobId +'/info'}"><a type="text" class="detail-btn">{{scope.row.name}}</a></router-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                    sortable="custom"
                            label="流程">
                        <template slot-scope="scope">
                            <router-link v-show="projectPath" :to="{   path:'/project/design/designDrawing/'+scope.row.flowId,query:{type:scope.row.flowType}}"><a type="text" class="detail-btn">{{scope.row.flowName}}</a></router-link>
                            <router-link v-show="!projectPath" :to="{   path:'/design/designDrawing/'+scope.row.flowId,query:{type:scope.row.flowType}}"><a type="text" class="detail-btn">{{scope.row.flowName}}</a></router-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="flowSchedulerName"
                            sortable="custom"
                            label="调度">
                        <template slot-scope="scope">
                            <router-link :to="{ path:'/hippo/schedule/detail/'+scope.row.flowSchedulerId}"><a type="text" class="detail-btn">{{scope.row.flowSchedulerName}}</a></router-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            sortable="custom"
                            label="创建时间"
                            :formatter="dateFormat"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="cost"
                            label="耗时（秒）"
                            width="120"
                            sortable="custom">
                        <template slot-scope="scope">
                            <span>{{scope.row.cost | changeToSecond}}</span >
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="进度"
                            width="200"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="progressRun" v-if="scope.row.statusType=='RUNNING' && scope.row.flowType=='streamflow'"></div>
                            <el-tag v-else class="processedClass fl" :formatter="pTypeFilter(scope.row)" :type="scope.row.status.type">{{scope.row.status.processed}}/{{scope.row.status.estimateTotal}}</el-tag>  
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
                        :total="table.totalElements">
                </el-pagination>
            </el-row>


        </div>
        <!--停止执行计划-->
        <el-dialog v-dialog-drag title="提示" :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="400px" height="80px" id="bm-rh-design-history-dialog">
            <el-checkbox v-model="checked" name="checkBox">保存状态(仅对streamflow有效)</el-checkbox>
            <div slot="footer" class="dialog-footer" id="bm-rh-design-history-dialogFooter">
                <el-button type="primary" @click="open" name="open">确定</el-button>
                <el-button @click="dialogFormVisible = false" name="cancel">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import { listExecutingHistory,delExecute,rerunExecute,stopExecute} from '@api';
    import {queryObject,createParameter} from '@function/queryParameter.js';
    var parameter=queryObject();
    export default {
        data() {
            return {
                id:this.$route.params.id,
                table:[],
                multipleSelection: [],
                dateValue: '',
                startTime: false,
                endTime:false,
                searchInput:'',
                show:false,
                progress:'',
                currentPage:1,
                pagesize:8,
                checked: false,
                dialogFormVisible: false,
                delId:[],
                loading: true,
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                projectPath:false,
                disabledStop: true,//step按钮不能点击
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.listTable(this.buildParameters())

            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var limit=this.pagesize;
                var offset = (currentPage-1)*this.pagesize;
                this.listTable(this.buildParameters())

            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
                //选中条数大于0，并且选中数据中有运行中的就可以点击停止
                if(val.length > 0){
                    this.disabledStop = true;
                    for(var i = 0;i< val.length;i++){
                        if(val[i].statusType == "RUNNING"){
                            this.disabledStop = false;
                            return
                        }
                    }
                }
            },
            handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                this.listTable(this.buildParameters());
            },
            //过滤列表进度
            pTypeFilter:function(row) {
                if(row.status.type == "SUCCEEDED"){
                    return row.status.type = "success";
                }else if(row.status.type == "KILLED"){
                    return row.status.type = "warning";
                }else if(row.status.type == "FAILED"){
                    return row.status.type = "danger";
                }
            },

            //table list
            listTable:function listTable(parameter){
                // GET /someUrl
                listExecutingHistory(parameter).then(data => {
                    this.loading = false
                    this.table = data;
                }, err => {
                    var _this = this;
                    if(err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },
            //查询
            searchTable:function searchTable(){
                this.listTable(this.buildParameters());
            },
            //监听查询回车事件
            searchKeyup:function () {
                this.listTable(this.buildParameters());
            },
            //表格操作：删除
            delTable: function delTable() {
                var flowId = this.interceptedStr(this.$route.path)
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var tableRefresh = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                tableRefresh.$confirm('真的要删除'+tbIds.length+'个执行计划?', '提示', {
                }).then(() => {
                    delExecute(tbIds).then(data => {
                        tableRefresh.listTable(this.buildParameters());
                        tableRefresh.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    }, err => {
                        var _this = this;
                        if(err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    })
                }).catch(() => {

                });
            },
            //表格操作：重启
            reRun:function () {
                var flowId = this.interceptedStr(this.$route.path)
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var tableRefresh = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                tableRefresh.$confirm('真的要重启'+tbIds.length+'个执行计划?', '提示', {
                }).then(() => {
                    rerunExecute(tbIds).then(data => {
                        tableRefresh.listTable(this.buildParameters());
                        tableRefresh.$message({
                            message: '恭喜你，重启已成功！',
                            type: 'success'
                        });
                    }, err => {
                        var _this = this;
                        if(err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    })
                }).catch(() => {

                });
            },
            //表格操作：停止
            killExection:function () {
                var flowId = this.interceptedStr(this.$route.path)
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var tbIds = [];
                this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                this.delId = tbIds;
                this.dialogFormVisible = true;
            },
            // dialog确定回调
            open:function () {

                var isChecked = this.checked;
                var that = this;
                stopExecute(this.delId,isChecked).then(data => {
                    var flowId = this.interceptedStr(this.$route.path)
                    var parameter = createParameter('flowId',flowId,"EQUAL").Offset(0).Limit(8).Build();
                    that.listTable(parameter);
                    that.dialogFormVisible = false;
                    that.$message({
                        message: '恭喜你，停止已成功！',
                        type: 'success'
                    });
                }, err => {
                    var _this = this;
                    if(err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },
            buildParameters:function(){
                var that = this
                var limit=this.pagesize;
                var offset = (this.currentPage-1)*this.pagesize;
                var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter('flowId',this.interceptedStr(this.$route.path),'EQUAL').Limit(limit).Offset(offset).Build();
                if(query != '%'){
                    parameter = createParameter('name',query,"LIKE").Build(parameter);
                }
                if(this.dateValue ){
                    if(this.dateValue.length ==0){
                        
                    } else {
                        parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                        And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                        Build(parameter);
                    }
                }
                parameter.sortObject.field = that.prop
				parameter.sortObject.orderDirection = that.orderDirection
                return parameter;
            },
            //列表排序
			getOrder: function(column) {
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
                if(column.column.label == '流程') {
                    this.prop = 'flowName'
                }
				this.currentPage = 1
				var parameter = this.buildParameters();
                that.listTable(parameter);
            },
            historyReturn:function () {
                window.history.go(-1)
            }
        },
        mounted() {
            var parameter = this.buildParameters()
            // 查看某一计划的执行历史
            if(this.$route.query.fshId){
                parameter = createParameter('flowSchedulerId',this.$route.query.fshId,"EQUAL").Build(parameter);
            }
            this.listTable(parameter);
            // 判断当前处于design还是项目目录
            if(this.$route.path.indexOf("project") != -1){
                this.projectPath = true
            }else{
                this.projectPath = false
            }
        }
    }

</script>

<style scoped lang="scss">
    .con-module .child-content{
        padding: 0px;
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
        .processedClass{
            width: 80px;
            height: 25px;
            line-height: 25px;
            text-align: center;
        }
        .thisClickClass{
            color: #2182e4;
            cursor: pointer
        }
        .thisClickClass:hover{
            text-decoration: underline;
        }
    }
    .detail-btn{
        padding: 0px;
    }
    .btn-left{
        padding-left: 145px;
    }
    .fl{
        float: left;
    }
    .progressRun {
        margin-top: 6px;
        float: left;
        width: 40px;
        height: 15px;
        background-size: 3%;
        background: url("../../../../static/images/streamJob/progress.gif") 0 0 no-repeat;
    }

    .row{
        padding: 10px
    }

</style>