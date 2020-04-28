<template>
    <section class="user-container" id="bm-griffin-tenant-list">
        <el-row class="btnClass">
            <div class="btn-left">
                <el-date-picker
                        id="bm-griffin-tenant-list-timepicker"
                        v-model="dateValue"
                        type="daterange"
                        @change="handledateValue"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-input id="bm-griffin-tenant-list-searchInput" placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
                    <el-button id="bm-griffin-tenant-list-searchBtn" slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
            </div>
            <div class="btn-right">
                <router-link class="user-add" :to="createUserUrl"><el-button id="bm-griffin-tenant-list-create" type="info" ><i class="icon iconfont icon-ir-add"></i>&nbsp;创建</el-button></router-link>
                <el-button id="bm-griffin-tenant-list-run" type="info" @click="enableTenant" :disabled="multipleSelection.length < 1"><i class="icon iconfont icon-ir-start"></i>&nbsp;启用</el-button>
                <el-button id="bm-griffin-tenant-list-stop" type="info" @click="disableTenant" :disabled="multipleSelection.length < 1"><i class="icon iconfont icon-ir-operation"></i>&nbsp;停用</el-button>
            </div>
        </el-row>
        <router-view></router-view>
        <div class="rf-swap">
            <el-table
                    id="bm-griffin-tenant-list-table"
                    :data="table.content"
                    v-loading = "loading"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        :selectable="setSelection"
                        width="45">
                </el-table-column>
                <el-table-column
                        label="名称">
                    <template slot-scope="scope"><router-link class="usAdd" :to="{ path:'/tenants/'+scope.row.id}">{{scope.row.name}}</router-link></template>
                </el-table-column>
                <el-table-column
                        label="主键"
                        prop="id"
                        show-overflow-tooltip>
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
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.enabled == 0">停用</span >
                        <span  v-else>启用</span >
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="180"
                        :formatter="dateFormat"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="lastModifiedTime"
                        label="修改时间"
                        width="180"
                        :formatter="dateFormat"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-pagination
                    id="bm-griffin-tenant-list-page"
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
    import { tenantList,enableTenant,disableTenant} from '@api';

    import {queryObject,createParameter} from '@components/function/queryParameter.js';
    var parameter=queryObject();
    export default {
        data() {
            return {
                createUserUrl:"/tenants/add",
                table:[],
                dateValue: [],
                //show:false,
                currentPage:1,
                pagesize:8,
                multipleSelection:[],
                searchInput:'',
                isActive:false,
                loading: true
            }
        },
        methods: {
            handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                var parameter=this.buildParameters();
                this.listTable(parameter);
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                var parameter=this.buildParameters();
                this.listTable(parameter)
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var parameter=this.buildParameters();
                this.listTable(parameter)
            },
            handleSelectionChange: function(val) {
                this.multipleSelection = val;
            },
            // table list
            listTable:function listTable(parameter){
                tenantList(parameter).then(data => {
                    if (data.status === 0) {
                        this.loading = false
                        this.table= data.content;
                    } else {
                         this.$message({
                            message: data.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
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
                var parameter=this.buildParameters();
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup:function () {
                this.searchTable(parameter);
            },

            setSelection (row, index) {
                if (row.id === 'root') {
                    return false
                } else {
                    return true
                }
            },
            //表格操作：删除
            delTable: function delTable() {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                this.multipleSelection.forEach(function (i){
                    var tdIds = [i.id];
                    delUser(tdIds).then(data => {
                        that.listTable(parameter);
                        that.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    })
                });
            },
            // 启用用户
            enableTenant:function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i){
                    tbIds.push(i.id);
                });
                that.$confirm('确定启用?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    enableTenant(tbIds).then(data => {
                        that.listTable(parameter);
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
                    })
                }).catch(() => {

                });
            },
            // 停用用户
            disableTenant:function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i){
                     tbIds.push(i.id);
                });
                that.$confirm('确定停用?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    disableTenant(tbIds).then(data => {
                        that.listTable(parameter);
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
                }).catch(() => {

                });
            },
            buildParameters:function(){
                var limit=this.pagesize;
                var offset = (this.currentPage-1)*this.pagesize;
                var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
                if(query != '%'){
                    parameter = createParameter('name',query,"LIKE").Build(parameter);
                }
                if(this.dateValue[0] && this.dateValue[1]){
                    parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                    And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                    Build(parameter);
                }
                return parameter;
            },
        },
        mounted() {
            this.listTable(parameter)
        },
    };

</script>

<style lang="scss" scoped>
    .user-container{
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
