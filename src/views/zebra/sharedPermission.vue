<template>

  <section class="irContent">
    <el-row>
      <el-button type="primary"><i class="icon iconfont icon-ir-add"></i>&nbsp;新增</el-button>
      <el-button @click="delTable" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-directory-delete"></i>&nbsp;删除</el-button>
      <el-date-picker
              v-model="dateValue"
              type="daterange"
              @change="handledateValue"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
      </el-date-picker>
      <div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
      <div v-show="endTime" ref="endTime">{{dateValue[1]}}</div>
      <el-input placeholder="请输入用户名" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
        <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
      </el-input>

    </el-row>

    <el-table
            v-loading = "loading"
            id="bm-za-shared-permissission-form"
            :data="table.content"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            max-height="700">
      <el-table-column
              type="selection"
              width="40">
      </el-table-column>
      <el-table-column
              prop="id"
              label="主键"
              width="50"
              v-if="show">
      </el-table-column>
      <el-table-column
              prop="name"
              label="用户名"
              show-overflow-tooltip>
      </el-table-column>
      <el-table-column
              prop="account"
              label="接口验证账号"
              show-overflow-tooltip>
      </el-table-column>
      <el-table-column
              prop="creator"
              label="创建人"
              width="100"
              show-overflow-tooltip>
      </el-table-column>
      <el-table-column
              prop="lastModifier"
              label="修改人"
              width="100"
              show-overflow-tooltip>
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[8, 16, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="table.totalElements">
    </el-pagination>


  </section>
</template>
<script>
    import { spgetDate,spdelTbaleDate } from '@api';
    import {queryObject,createParameter} from '@components/function/queryParameter.js';
    var parameter=queryObject();
    export default {
        data() {
            return {
                table:[],
                multipleSelection: [],
                dateValue: '',
                startTime: false,
                endTime:false,
                searchInput:'',
                show:false,
                currentPage:1,
                pagesize:8,
                parameter: '',
                orderDirection: 'DESC',
				prop: 'lastModifiedTime',
                loading: true
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
				this.parameter.sortObject.field = this.prop
				this.parameter.sortObject.orderDirection = this.orderDirection
                // var parameter = this.buildParameters();
                this.listTable(this.parameter);

            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                // var parameter = this.buildParameters();
                this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput)
				this.parameter.sortObject.field = this.prop
				this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter);

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
                var startTime=this.$refs.startTime.innerText.replace("\"","").replace("\"","");
                var endTime=this.$refs.endTime.innerText.replace("\"","").replace("\"","");
                var dateTime=startTime.replace(".000","")+" TO "+endTime.replace(".000","");
                var parameter={filter:"lastModifiedTime=["+dateTime+"]",limit:"8",offset:"0",query:"",sorts:"-lastModifiedTime"};
                this.listTable(parameter);
            },
            // table list
            listTable:function listTable(parameter){
                spgetDate(parameter).then(data => {
                    this.loading = false
                    this.table= data;
                }, err => {
                    var _this = this;
                    if(err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                    }
                )
            },
            //查询
            searchTable:function searchTable(){
               // var parameter={filter:"",limit:"8",offset:"0",query:this.searchInput,sorts:"-lastModifiedTime"};
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup:function () {
               // var parameter={filter:"",limit:"8",offset:"0",query:this.searchInput,sorts:"-lastModifiedTime"};
                this.searchTable(parameter);
            },
            //表格操作：删除
            delTable: function delTable() {
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
                tableRefresh.$confirm('真的要删除'+tbIds.length+'个共享权限数据?', '提示', {
                }).then(() => {
                    spdelTbaleDate(tbIds).then(data => {
                        tableRefresh.listTable(parameter);
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
                        }
                    )
                }).catch(() => {

                });
            },
        },
        mounted() {
            this.listTable(parameter)
        }
    };

</script>

<style scoped>
  .con-module .el-row{
    float: left;
    width: 100%;
  }
  .con-module .el-row .el-button i{
    font-size: 13px;
  }

  .el-table{
    float: left;
    margin-top: 15px;
  }

  .tpAddrl{
    color: #FFFFFF;
    margin-right: 10px;
    text-decoration: none;
  }



</style>