<template>
    <section class="user-container" id="bm-griffin-user-user">
        <el-row class="btnClass">
            <el-input id="bm-griffin-user-user-searchInput" placeholder="请输入用户名" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
                <el-button id="bm-griffin-user-user-searchValue" slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
            </el-input>
            <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    @change="handledateValue"
                    range-separator="至"
                    start-placeholder="开始日期"
                    value-format="timestamp"
                    end-placeholder="结束日期">
            </el-date-picker>

            <div class="btn-right">
                <router-link class="user-add" :to="createUserUrl"><el-button type="info"><i class="icon iconfont icon-ir-add"></i><span>创建</span></el-button></router-link>
                <el-button id="bm-griffin-user-user-run" @click="enableUser" type="info" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-start"></i><span>启用</span></el-button>
                <el-button id="bm-griffin-user-user-stop" @click="disableUser" type="info" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-operation"></i><span>停用</span></el-button>
                <el-button id="bm-griffin-user-user-del" @click="delTable" type="info" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-directory-delete"></i><span>删除</span></el-button>
            </div>
        </el-row>
        <router-view></router-view>
        <div class="rf-swap">
            <el-table
                    id="bm-griffin-user-user-table"
                    :data="table.content"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    @sort-change="getOrder"
                    v-loading = "loading"
                    height="calc(100vh - 175px)"
                    style="width: 100%;"  >
                <el-table-column
                        type="selection"
                        :selectable="setSelection"
                        width="45">
                </el-table-column>
                <el-table-column
                        label="用户名"
                        prop="name"
                        sortable="custom">
                    <template slot-scope="scope">
                        <div v-if="scope.row.name == 'admin' && currentUser != 'admin'">{{scope.row.name}}</div>
                        <div v-else>
                            <div v-if="currentUser == 'admin'">
                                <router-link class="usAdd" :to="{ path:'/user/'+scope.row.id}">{{scope.row.name}}</router-link>
                            </div>
                           <!-- <div v-else>
                                <router-link class="usAdd" :to="{ path:'/user/'+scope.row.id}">{{scope.row.name}}</router-link>
                            </div>-->
                            <div  v-else v-for="item in scope.row.permissions" :key="item.name">

                                <span  v-if="item.name == 'woven.admin'">{{scope.row.name}}</span >
                                <router-link v-else-if="scope.row.permissions.length == 1 && item.name == 'woven.user'" class="usAdd" :to="{ path:'/user/'+scope.row.id}">{{scope.row.name}}</router-link>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态"
                        prop="enabled">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.enabled == 0">停用</span >
                        <span  v-else>启用</span >
                    </template>
                </el-table-column>
                <el-table-column
                        prop="permissions"
                        label="角色"
                        sortable="custom">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.permissions" :key="item.name">
                            <span  v-if="item.name == 'woven.admin'">admin</span >
                            <span  v-else-if="scope.row.permissions.length == 1 && item.name == 'woven.user'">user</span >
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="resourceQueues"
                        label="资源队列"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.resourceQueues}}</span >
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="160"
                        sortable="custom"
                        :formatter="dateFormat"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="creator"
                        label="创建人"
                        width="120"
                        sortable="custom"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="lastModifier"
                        label="修改人"
                        width="100"
                        sortable="custom"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="lastModifiedTime"
                        label="修改时间"
                        width="160"
                        sortable="custom"
                        :formatter="dateFormat"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-pagination
                    id="bm-griffin-user-user-page"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[8, 16, 50, 100]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="table.totalElements">
            </el-pagination>
        </div>

    </section>
</template>
<script>
    import { userList ,delUser,enableUser,disableUser} from '@api';

    import {queryObject,createParameter} from '@components/function/queryParameter.js';
    var parameter=queryObject();
    export default {
        data() {
            return {
                createUserUrl:"/user/add",
                table:[],
                dateValue: '',
                //show:false,
                currentPage:1,
                pagesize:8,
                multipleSelection:[],
                searchInput:'',
                isActive:false,
                startTime: false,
                endTime:false,
                parameter: '',
                orderDirection: 'DESC',
                field: 'lastModifiedTime',
                loading: true,
                currentUser:""

            }
        },
        methods: {
            handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
				this.parameter.sortObject.field = this.field
				this.parameter.sortObject.orderDirection = this.orderDirection
                // var parameter = this.buildParameters();
                this.listTable(this.parameter);
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                // var parameter = this.buildParameters();
                this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput)
				this.parameter.sortObject.field = this.field
				this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter);
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // table list
            listTable:function listTable(parameter){
                this.loading = true
                userList(parameter).then(data => {
                    this.loading = false
                    this.table= data;
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            },
            //查询
            searchTable:function searchTable(){
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup:function () {
                this.searchTable();
            },
            buildParameters:function(){
                var limit=this.pagesize;
                var offset = (this.currentPage-1)*this.pagesize;
                var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
                if(query != '%'){
                    parameter = createParameter('name',query,"LIKE").Build(parameter);
                }
                if(this.dateValue){
                    if(this.dateValue!= '' && this.dateValue.length != 0 ){
                        parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                        And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                        Build(parameter);
                    }
                }
                parameter.sortObject.field = this.field
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },

            setSelection (row, index) {
                /*if(row.loginId == "admin" || row.permissions[0].name == "woven.admin"){
                    return false
                }else{
                    return true
                }*/
                if(this.currentUser == "admin" && row.loginId != "admin"){
                    return true
                }else if(row.loginId == "admin" || row.permissions[0].name == "woven.admin"){
                    return false
                }else{
                    return true
                }
            },
            //表格操作：删除
            delTable: function() {
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
                that.$confirm('真的要删除'+tbIds.length+'个用户?', '提示', {
                }).then(() => {
                    delUser(tbIds).then(data => {
                        that.listTable(this.buildParameters());
                        that.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    }, err => {
                            if(err.response.data.err.indexOf("enabled can not be removed,please disabled first")!="-1"){
                                this.$message({
                                    message: "请先停用再删除",
                                    type: 'error',
                                    duration: 1500
                                });
                            }else{
                                this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }
                    )
                }).catch(() => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                });
            },
            // 启用用户
            enableUser:function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                this.multipleSelection.forEach(function (i){
                    console.log(i,"#################")
                    var tdIds = [i.id];
                    enableUser(tdIds).then(data => {
                        that.listTable(that.buildParameters());
                        that.$message({
                            message: '恭喜你，启用已成功！',
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
                });
            },
            // 停用用户
            disableUser:function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                this.multipleSelection.forEach(function (i){
                    console.log(i,"查看用户相关信息")
                    if(i.name == "admin"){
                        that.$message({
                            message: '管理员不可以停用！',
                            type: 'warning'
                        });
                    }else{
                        var tdIds = [i.id];
                        disableUser(tdIds).then(data => {
                            that.listTable(that.buildParameters());
                            that.$message({
                                message: '恭喜你，停用已成功！',
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
                });
            },
            //列表排序
			getOrder: function(column) {
                var that = this
				if (column.order === 'ascending') {
					this.orderDirection = 'ASC'
				} else {
					this.orderDirection = 'DESC'
                }
                this.field = column.prop
                if (column.prop === null) {
                    this.field = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                var parameter = this.buildParameters();
				that.parameter = createParameter().Limit(this.pagesize).Sort(this.field,this.orderDirection).Build();
				that.listTable(that.parameter);
			}
        },
        mounted() {
            this.currentUser = sessionStorage.getItem("user")

            if(JSON.parse(localStorage.getItem("parameter"))){
                this.parameter=JSON.parse(localStorage.getItem("parameter"));
                this.currentPage=(this.parameter.offset/this.parameter.limit)+1;
                this.pagesize=this.parameter.limit;
            }else{
                this.parameter=this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
            }
            this.listTable(this.parameter)

        },
         watch: {
            parameter(){
                console.log("value changed",this.parameter);
                localStorage.setItem("parameter",JSON.stringify(this.parameter));
            }
        }
    };

</script>

<style lang="scss" scoped>
    .user-container{
        margin: 0px;
        .detail-btn{
            padding: 0px;
        }
        .el-row{
            .el-button i{
                font-size: 13px;
            }
        }
        .el-table{
            float: left;
        }
        .user-add{
            color: #ffffff;
            text-decoration: none;
            margin-right: 10px;
        }
    }

</style>

