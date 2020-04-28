<!--  查询 flow 组件  -->
<template>
    <div class="rf-dContent">
        <el-input placeholder="请输入ID" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search fiSearch">
            <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
        </el-input>
        <el-table
                :data="table.content"
                tooltip-effect="dark"
                v-loading = "loading"
                id='bm-com-interCeptor-inquire-table'
                style="width: 100%"
                @selection-change="handleSelectionChange"
                height="calc(100% - 100px)">
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    prop="id"
                    label="主键"
                    v-if="show"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[8, 16, 50, 100]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="table.totalElements">
        </el-pagination>
    </div>
</template>

<script>
    import { confList } from '@api';

    import {queryObject,createParameter} from '@function/queryParameter.js';
    var parameter=queryObject();

    export default {
        data() {
            return {
                table:[],
                multipleSelection: [],
                mlSelVal:{
                    id:'',
                    name:'',
                    type:'',
                    filterClassName:''
                },
                show:false,
                searchInput:'',
                currentPage:1,
                pagesize:8,
                loading: true
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter('name',query,'LIKE')
                    .Offset(0).Limit(this.pagesize).Sort('lastModifiedTime','DESC').Build();
                // var parameter={filter:"flowType=dataflow&-source=zebra",limit:this.pagesize,offset:"0",query:this.searchInput,sorts:"-lastModifiedTime"}

                this.listTable(parameter)

            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var limit=this.pagesize;
                var offset = (currentPage-1)*this.pagesize;
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter =createParameter('name',query,'LIKE')
                    .Offset(offset).Limit(limit).Sort('lastModifiedTime','DESC').Build();
                // var parameter={filter:"flowType=dataflow&-source=zebra",limit:this.pagesize,offset:(currentPage-1)*this.pagesize,query:this.searchInput,sorts:"-lastModifiedTime"}
                this.listTable(parameter)

            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
                if(val.length === 0){
                    this.mlSelVal.id = '';
                    this.mlSelVal.name = '';
                    this.mlSelVal.type = '';
                    this.mlSelVal.parameters = [];
                    this.$emit('thisSelectInterceptorVal',this.mlSelVal);
                }else if(val.length === 1){
                    this.mlSelVal.id = val[0].id;
                    this.mlSelVal.name = val[0].name;
                    this.mlSelVal.type = val[0].flowType;
                    this.mlSelVal.parameters = val[0].parameters;
                    this.mlSelVal.filterClassName = val[0].className;
                    this.$emit('thisSelectInterceptorVal',this.mlSelVal);
                }else {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                }

            },
            //table list
            listTable:function listTable(parameter){
                // GET /someUrl
                confList(parameter).then(data => {
                    // console.log(data);
                    this.loading = false
                    this.table = data;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })

            },
            //查询
            searchTable:function searchTable(){
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter('name',query,'LIKE')
                    .Offset((this.currentPage-1)*this.pagesize).Limit(this.pagesize)
                    .Sort('lastModifiedTime','DESC').Build();
                // var parameter={filter:"flowType=dataflow&source=zebra",limit:"8",offset:"0",query:this.searchInput,sorts:"-lastModifiedTime"};
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup:function () {
                this.searchTable(parameter);
            },

        },
        mounted() {
            this.listTable(parameter);
        }
    }
</script>

<style scoped lang="scss">
    .fiSearch{
        float: left;
        width: 30%;
        margin: 0px 0px 10px 0px;
    }
</style>