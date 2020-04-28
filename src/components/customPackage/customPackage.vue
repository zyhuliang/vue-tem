<template>
    <div class="dt-content">
        <div class="dtTableJar">
            <el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchTable" class="input-with-search diSearch">
                <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
            </el-input>
            <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    @change="handledateValue"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
        </div>

        <div class="content">
            <div class="dtTableRight">
                <el-table
                        :data="table.content"
                        tooltip-effect="dark"
                        v-loading="loading"
                        id="bm-com-custompackage-dsi-table"
                        class="datasetTable"
                        height="calc(100% - 60px)"
                        @sort-change="getOrder"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="45">
                    </el-table-column>
                    <el-table-column
                            label="名称"
                            prop="name"
                            sortable="custom"
                    >
                        <template slot-scope="scope"><router-link class="configAdd" :to="{ path:'/processconfig/'+scope.row.id}"><a>{{scope.row.name}}</a></router-link></template>
                    </el-table-column>
                    <el-table-column
                            prop="className"
                            label="完整类名"
                            width="300px"
                            sortable="custom"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="returnType"
                            sortable="custom"
                            align="center"
                            width="100px"
                            label="返回类型">
                    </el-table-column>
                    <el-table-column
                            prop="processConfigType"
                            label="类型"
                            sortable="custom"
                            align="center"
                            width="160"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            sortable="custom"
                            align="center"
                            width="160"
                            :formatter="dateFormat"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="creator"
                            label="创建人"
                            align="center"
                            sortable="custom"
                            width="90"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="lastModifier"
                            label="修改人"
                            align="center"
                            sortable="custom"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="lastModifiedTime"
                            label="修改时间"
                            sortable="custom"
                            align="center"
                            width="160"
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
        </div>


    </div>
</template>
<script>
    import {queryObject, createParameter} from "@function/queryParameter"
    import {confList } from '@api';
    var parameter=queryObject();

    export default{
        data(){
            return{
                searchInput:"",
                dateValue:"",
                loading:true,
                table:[],
                pagesize:8,
                currentPage:1,
                setSelection:"",
                field: 'lastModifiedTime',
                orderDirection: 'ASC'
            }
        },
        methods:{
            handleSizeChange:function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.searchInput))
                //this.parameter.sortObject.field = this.field
                //this.parameter.sortObject.orderDirection = this.orderDirection
                // var parameter = this.buildParameters();
                this.listTable(this.parameter);
            },
            handledateValue:function (val) {
                /*var startTime=this.$refs.startTime.innerText.replace("\"","").replace("\"","");
                var endTime=this.$refs.endTime.innerText.replace("\"","").replace("\"","");
                var dateTime=startTime.replace(".000","")+" TO "+endTime.replace(".000","");
                var parameter={filter:"lastModifiedTime=["+dateTime+"]",limit:"8",offset:"0",query:"",sorts:"-lastModifiedTime"};
                this.listTable(parameter);*/
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleCurrentChange:function (currentPage) {
                this.currentPage = currentPage;
                // var parameter = this.buildParameters();
                this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.searchInput)
                //this.parameter.sortObject.field = this.field
                //this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter);
            },
            handleSelectionChange:function (val) {
                if(val.length != 1){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                }else{
                    this.$emit('thisSelectLocalJarVal',val);
                }
            },
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
                that.parameter = createParameter().Limit(this.pagesize).Sort(column.prop, this.orderDirection).Build(that.parameter, false);
                that.listTable(that.parameter);
            },
            searchTable:function () {
                if(this.searchInput==''){
                    var parameter = this.buildParameters();
                    parameter.fieldList = []
                }else {
                    var parameter = this.buildParameters();
                }
                
                this.listTable(parameter);
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
                    if(this.dateValue !='' && this.dateValue.length != 0){
                        parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                        And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                        Build(parameter);
                    }
                }
                parameter.sortObject.field = this.field
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },
            // table list
            listTable:function(parameter){
                confList(parameter).then(data => {
                    this.loading = false
                    this.table= data;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
        },
        mounted(){
            var parameter = this.buildParameters()
            this.listTable(parameter)
        }
    }

</script>
<style lang="scss" scoped>
    .dt-content{
        float: left;
        width: 100%;
        height:calc(100% - 20px);

        .dtTableJar{
            float: left;
            width: 100%;
            padding: 0px 0px 10px 0px;
            box-sizing: border-box;

            .diSearch{
                float: left;
            }
        }

        .content{
            float: left;
            width: 100%;
            height: 90%;
            margin-bottom:10px;
            .dtTableRight{
                float: left;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: #ffffff;
                .datasetTable{
                    float: left;
                    width: 100%;
                }
            }
        }

    }
    .el-table{
        border-right: none;
        border-top: none;
        box-shadow: 0px 0px 3px 0 rgba(0, 0, 0, 0.1);
    }
</style>