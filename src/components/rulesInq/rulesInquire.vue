
<!--  查询 规则 组件  -->
<template>
    <div>
        <el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search fiSearch">
            <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
        </el-input>
        <el-table
                :data="table.content"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading = "loading"
                id="bm-com-global-search-global-temp-rulers-table"
                max-height="700">
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
    import { argetDate } from '@api';
    import {queryObject, createParameter} from "@function/queryParameter.js";
    var parameter=queryObject();

    export default {
        data() {
            return {
                table:[],
                multipleSelection: [],
                mlSelVal:{
                    id:'',
                    name:''
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
                var parameter = createParameter('name',query,'LIKE').Offset(0).Limit(this.pagesize).Build();
                this.listTable(parameter)

            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var limit=this.pagesize;
                var offset = (currentPage-1)*this.pagesize;
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter =createParameter('name',query,'LIKE').Offset(offset).Limit(limit).Build();
                this.listTable(parameter)
	
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val; 
                console.log(this.multipleSelection);
                 console.log(this.multipleSelection[0].customValue);
                //console.log(val[0].dataScope);
                //console.log(val[0].ruleOption);
                //console.log(val.length);
                if(val.length === 0){
                    this.mlSelVal.id = '';
                    this.mlSelVal.name = '';
                    this.mlSelVal.ruleClass = '';
                    this.mlSelVal.ruleOutput = '';
                    this.mlSelVal.ruleInput='';
                    this.mlSelVal.dataScope='';
                    this.mlSelVal.fieldValueType='';
                    
                    
                    //增加规则保存时，需要上传的字段
                    this.mlSelVal.aggType=''
                    this.mlSelVal.ruleOption=''

                    
                    this.$emit('thisSelectRulesVal',this.mlSelVal.id,this.mlSelVal.name,this.mlSelVal.ruleClass,this.mlSelVal.ruleOutput,this.mlSelVal.ruleInput,
                    this.mlSelVal.dataScope,this.mlSelVal.fieldValueType,
                    this.mlSelVal.aggType,this.mlSelVal.ruleOption,this.multipleSelection[0].customValue
                    );
                }else if(val.length === 1){
                    this.mlSelVal.id = val[0].id;
                    this.mlSelVal.name = val[0].name;
                    this.mlSelVal.ruleClass = val[0].ruleClass;
                    
                    this.mlSelVal.ruleOutput = val[0].ruleOption.paramsMap.outputGroup;
                    this.mlSelVal.ruleInput = val[0].ruleOption.paramsMap.inputGroup;
                    this.mlSelVal.dataScope = val[0].dataScope;
                    this.mlSelVal.fieldValueType=val[0].fieldValueType;
                    
                    //增加规则保存时，需要上传的字段
                    this.mlSelVal.aggType=val[0].aggType;
                    
                    this.mlSelVal.ruleOption=val[0].ruleOption;
                    
                    this.$emit('thisSelectRulesVal',this.mlSelVal.id,this.mlSelVal.name, this.mlSelVal.ruleClass,
                    this.mlSelVal.ruleOutput,this.mlSelVal.ruleInput,this.mlSelVal.dataScope,this.mlSelVal.fieldValueType,
                    this.mlSelVal.aggType,this.mlSelVal.ruleOption,this.multipleSelection[0].customValue
                    );
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
                argetDate(parameter).then(data => {
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
            	var fieldValue='%'+this.searchInput+'%';
                var parameter={
					  "fieldList": [
					    {
					      "fieldName": "name",
					      "fieldValue": fieldValue,
					      "comparatorOperator": "LIKE"
					    }
					  ],
					  "sortObject": {
					    "field": "lastModifiedTime",
					    "orderDirection": "DESC"
					  },
					  "offset": 0,
					  "limit": 8
					}
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