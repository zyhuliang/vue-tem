<template>

    <section class="con-module">
        <div class="child-content" id="bm-rh-design-plan">
            <router-view></router-view>
            <!-- <el-row class="btnClass"> -->
                 <el-row>
                <div class="btn-left" id="bm-rh-design-plan-left">
                    <el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search" name="searchInput">
                        <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search" name="searchBtn"></el-button>
                    </el-input>
                    <el-date-picker
                            v-model="dateValue"
                            type="daterange"
                            value-format="timestamp"
                            @change="handledateValue"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </div>

                <div class="btn-right" id="bm-rh-design-plan-right">
                    <el-button type="info" @click="planReturn" id="planReturn"><i class="icon iconfont icon-ir-left"></i>&nbsp;返回</el-button>
                    <el-button type="info" @click="newPlan"><i class="icon iconfont icon-ir-add" name="newPlan"></i>创建</el-button>
                    <el-button type="info" :disabled="multipleSelection.length != 1" @click="enablePlan"><i class="icon iconfont icon-ir-start" name="enablePlan"></i>启用</el-button>
                    <el-button type="info" :disabled="multipleSelection.length != 1" @click="disablePlan"><i class="icon iconfont icon-ir-stop" name="disablePlan"></i>停止</el-button>
                    <el-button type="info" @click="delTable" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-directory-delete" name="delTable"></i>删除</el-button>
                </div>
            </el-row>
            <el-row>
                <div class="rf-swap">
                    <el-table
                            :data="table.content"
                            v-loading = "loading"
                            id="bm-rh-design-plan-table"
                            tooltip-effect="dark"
                            height="calc(100vh - 175px)"
                            @selection-change="handleSelectionChange"
                            @sort-change="getOrder">
                        <el-table-column
                                type="selection"
                                width="40">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                sortable="custom"
                                label="名称">
                            <template slot-scope="scope">
                                <router-link :to="{ path:'/hippo/schedule/detail/'+scope.row.id}"><a>{{scope.row.name}}</a></router-link>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="enabled"
                                label="启动状态"
                                width="100"
                                sortable="custom"
                                :formatter="typeFilter">
                        </el-table-column>
                        <el-table-column
                                prop="flowName"
                                sortable="custom"
                                label="流程">
                            <template slot-scope="scope">
                                <span class="thisClickClass">{{scope.row.flowName}}</span>
                            </template>
                            <template slot-scope="scope">
                                <router-link v-show="projectPath" class="usAdd"   :to="{  path:'/project/design/designDrawing/'+scope.row.flowId,query:{type:scope.row.flowType}}"><a>{{scope.row.flowName}}</a></router-link>
                                <router-link v-show="!projectPath" class="usAdd"   :to="{  path:'/design/designDrawing/'+scope.row.flowId,query:{type:scope.row.flowType}}"><a>{{scope.row.flowName}}</a></router-link>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="createTime"
                                label="创建时间"
                                sortable="custom"
                                :formatter="dateFormat"
                                min-width="140">
                        </el-table-column>
                        <el-table-column
                                prop="creator"
                                label="创建人"
                                min-width="85"
                                sortable="custom"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="lastModifier"
                                label="修改人"
                                min-width="85"
                                sortable="custom">
                        </el-table-column>
                        <el-table-column
                                prop="totalExecuted"
                                label="执行次数"
                                width="100"
                                sortable="custom">
                        </el-table-column>
                        <el-table-column
                                prop=""
                                label="周期情况"
                                width="80">
                            <template slot-scope="scope">
                                <span v-show="scope.row.schedulerId == 'once'">一次性</span>
                                <span v-show="scope.row.schedulerId == 'cron'">周期</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop=""
                                label=""
                                width="120"
                                show-overflow-tooltip>
                            <template slot-scope="scope">
                                <router-link v-show="projectPath" class="usAdd"   :to="{  path:'/project/design/executingHistory/'+scope.row.flowId,query:{fshId:scope.row.id}}"><el-button type="primary" plain>执行列表</el-button></router-link>
                                <router-link v-show="!projectPath" class="usAdd"   :to="{  path:'/design/executingHistory/'+scope.row.flowId,query:{fshId:scope.row.id}}"><el-button type="primary" plain>执行列表</el-button></router-link>
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
                </div>
            </el-row>
        </div>

    </section>
</template>
<script>

    import { scheduleList,delePlan,enablePlan,disablePlan } from '@api';
    var parameter = createParameter('name',"",'LIKE').Offset(0).Limit(8).Build();
    import {createParameter} from '@function/queryParameter.js';
    export default {
        data() {
            return {
                //id:this.$route.params.id,
                table:[],
                multipleSelection: [],
                dateValue: '',
                startTime: false,
                endTime:false,
                searchInput:'',
                show:false,
                currentPage:1,
                pagesize:8,
                loading: true,
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                projectPath:false
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.listTable(this.buildParameters())
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var offset = (currentPage-1)*this.pagesize;
                this.listTable(this.buildParameters())

            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                this.listTable(this.buildParameters());
            },

            //table 启动状态
            typeFilter : function (row,column) {
                var enable = row[column.property];
                if (enable == "0") {
                    return "未启用";
                }
                return "正常";
            },
            //table list
            listTable:function listTable(parameter){
                // GET /someUrl
                scheduleList(parameter).then(data => {
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
                var planId = this.interceptedStr(this.$route.path);
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
                tableRefresh.$confirm('真的要删除'+tbIds.length+'个计划吗?', '提示', {
                }).then(() => {
                    delePlan(tbIds).then(data => {
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
            //表格操作：启用
            enablePlan:function () {
                var planId = this.interceptedStr(this.$route.path);
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                that.$confirm('真的要启用'+tbIds.length+'个计划吗?', '提示', {
                }).then(() => {
                    enablePlan(tbIds).then(data => {
                        that.listTable(this.buildParameters());
                        that.$message({
                            message: '恭喜你，启用已成功！',
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
            disablePlan:function () {
                var planId = this.interceptedStr(this.$route.path);
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                that.$confirm('真的要停止'+tbIds.length+'个计划吗?', '提示', {
                }).then(() => {
                    disablePlan(tbIds).then(data => {
                        that.listTable(this.buildParameters());
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
                }).catch(() => {

                });
            },
            //创建新计划
            newPlan : function newPlan() {
                this.$router.push({ path: "/hippo/schedule/add",query: { pid: this.interceptedStr(this.$route.path) }});
            },
            buildParameters:function(){
                var limit=this.pagesize;
                var that = this;
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
				this.currentPage = 1
				var parameter = this.buildParameters();
                that.listTable(parameter);
            },
            planReturn:function () {
                window.history.go(-1)
            }
        },
        mounted() {
            var parameter = this.buildParameters()
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
    .btn-left{
        padding-left: 120px;
    }
    .el-table{
        float: left;
        .thisClickClass{
            color: #2182e4;
            cursor: pointer
        }
        .thisClickClass:hover{
            text-decoration: underline;
        }
    }

</style>