<template >
    <section >
        <div class="synchronizationsBox">
            <el-row class="btnClass">
                <div class="btn-right">
                    <el-button type="info" @click="addOrEdit()"><i class="icon iconfont icon-ir-add"></i>创建</el-button>
                    <el-button type="info" @click="getList()"><i class="icon iconfont icon-ir-operation"></i>刷新</el-button>
                </div>
            </el-row>
            <!--内容显示列表页面-->
            <template>
                <div class="rf-swap dn-data">
                    <el-table :data="tableData.list"
                              tooltip-effect="dark"
                              v-loading="loading"
                              id="bm-stream-jobTemplate-Template-table"
                              height="calc(100vh - 175px)"
                              style="width: 100%" >

                        <el-table-column  label="名称" prop="name"  width="300">
                            <template slot-scope="scope">
                                <span class="editName" @click="addOrEdit(scope.row)">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="描述" prop="desc"  >
                        </el-table-column>
                        <el-table-column label="内容" prop="content">
                        </el-table-column>
                        <el-table-column label="创建时间" prop="createTime" width="160" align="center" :formatter="dateFormat" >
                        </el-table-column>
                        <el-table-column label="修改时间" prop="lastModifyTime" width="160" align="center" :formatter="dateFormat" >
                        </el-table-column>
                        <el-table-column label="操作" align="center" fixed="right">
                            <template slot-scope="scope" >
                                <el-button
                                        type="danger"
                                        size="mini"
                                        @click="deleteTemplate(scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[8, 16, 50, 100]"
                            :page-size="limit"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.total">
                    </el-pagination>
                </div>
            </template>
        </div>
        <router-view></router-view>
    </section>
</template>

<script>
    import {getTemplateList, deleteTemplate} from '@api'
    export default {
        data() {
            return {
                tableData:{},
                currentPage:1,
                limit:8,
                start: 0,
                loading: true,
                entity: {
                    "name": "",
                    "id": "",
                    "desc": "",
                    "content": ''
                }
            }
        },
        methods: {
            //新建或者编辑job
            addOrEdit: function (row) {
                //如果是编辑，带参数，跳转到编辑页面的路由
                if(row){
                    this.$router.push({ name: '添加模板', params: {id: row.id}, query:{row: row}});
                }else{
                    this.$router.push({ name: '添加模板', params: {id: 'new'}});
                }
            },

            //删除
            deleteTemplate: function (row) {
                //添加询问
                this.$confirm('真的要删除?', '提示', {
                }).then(() => {
                    deleteTemplate(row.id).then(res =>{
                        //刷新列表
                        this.getList(this.start, this.limit);
                    },error =>{
                        var err = error.response.data.err
                        this.$message({
                            message: err,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }).catch(() => {
                });
            },
            // 列表
            getList: function (start, limit) {
                this.loading = true;
                start = start? start: this.start;
                limit = limit? limit: this.limit;
                getTemplateList(start, limit).then(res =>{
                    //更新数据
                    this.tableData = res;
                    this.loading = false;
                },error =>{
                    var err = error.response.data.err
                    this.$message({
                        message: err,
                        type: 'error',
                        duration: 1500
                    });
                })
            },

            //修改当前页显示多少条数据
            handleSizeChange: function (size) {
                this.limit = size;
                this.start = (this.currentPage-1) * this.limit;
                this.getList(this.start,this.limit)
            },
            //切换当前页
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage
                this.start = (this.currentPage-1) * this.limit;
                this.getList(this.start,this.limit)
            },
        },

        mounted() {
            this.loading = false
            //获取列表数据
            this.getList(this.start, this.limit);
        },
    };

</script>

<style lang="scss" scoped>
    .el-table{
        float: left;
    }
    .synchronizationsBox{
        .btn-right{
            float: right;
        }
    }
    .dn-data{
        position: relative;
        .el-table{
            .editName{
                color: #2182e4;
                cursor: pointer
            }
            .editName:hover{
                text-decoration: underline;
            }
        }
    }
</style>