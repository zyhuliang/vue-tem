<template>
    <section class="outBox" id="bm-qa-template-rules">
        <div>
            <el-row class="btnClass">
                <div class="btn-right" id="bm-qa-template-rules-btns">
                    <span class="tpAddrl" ><el-button type="info" @click="newRules"><i class="icon iconfont icon-ir-add"></i>增加</el-button></span>
                    <el-button type="info" @click="handleEnable" :disabled="startDis" name="template-rules-enable"><i class="icon iconfont icon-ir-triangle-right"></i>启用</el-button>
                    <el-button type="info" :disabled="endDis" @click="handleDisable" name="template-rules-stop"><i class="icon iconfont icon-ir-stop"></i>停止</el-button>
                    <el-button type="info" @click="delTable"
                               :disabled="multipleSelection.length==0"
                               name="template-rules-del"

                    ><i class="icon iconfont icon-ir-directory-delete"></i>删除</el-button>
                    <el-button type="info" @click="runTemp" :disabled="setGray" name="template-rules-run"><i class="icon iconfont icon-ir-start"></i>运行</el-button>
                    <el-button type="info" @click="runCycleTemp" :disabled="setGray" name="template-rules-cycle"><i class="icon iconfont icon-ir-operation"></i>计划</el-button>

                    <el-button type="info" @click="seeThisRules" name="template-rules-see"><i class="icon iconfont icon-ir-see-template"></i>查看</el-button>
                    <el-button type="info" @click="returnTemplate" name="template-rules-back"><i class="icon iconfont icon-ir-left"></i>返回</el-button>
                </div>
            </el-row>

            <el-row class="rf-swap">
                <el-table
                	    id="bm-qa-template-ruels-table"
                        v-loading = "loading"
                        :data="table.content"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                        height="calc(100vh - 200px)">
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
                            label="名称"
                            width="200"
                            >
                        <template slot-scope="scope">
                            <el-tooltip placement="top" effect="light">
                                <div slot="content">{{scope.row.name}}</div>

                            </el-tooltip>
                            <span class="seeName" @click="handleEdit(scope.row.id)">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="启停状态"
                            width="200"
                            >
                            <template slot-scope="scope">
                            	<span v-if="scope.row.enabled==0">未启用</span>
                            	<span v-if="scope.row.enabled==1">正常</span>
                            </template>
                           
                    </el-table-column>
                    <el-table-column
                            prop="dataId"
                            label="字段名"
                            width="100"
                            >
                    </el-table-column>
                    <el-table-column
                            prop="ruleId"
                            label="规则主键"
                            width="180"
                            >
                    </el-table-column>
                    <el-table-column
                            prop="ruleName"
                            label="规则名"
                            width="180"
                            >
                    </el-table-column>
                    <el-table-column
                            prop="priority"
                            label="权重"
                            width="100"
                            >
                    </el-table-column>
                    <el-table-column
                            prop="inputParams"
                            label="参数">
                        <template slot-scope="scope">
                            <span>{{scope.row.inputParams}}</span>
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

        <router-view></router-view>

    </section>
</template>

<script>
    import {rulesgetDate,addTbaleDate,fieldsList,ruleDelete,ruleEnable,ruleStop,atgetDate} from '@api';
    import {queryObject, createParameter} from "@components/function/queryParameter";
	
	import Bus from '../bus.js';
    var parameter=queryObject();
    
    export default {
        data() {
            return {
            	
                //URL参数ID
                id:this.$route.query.id,
                row:this.$route.params.row,
                labelPosition: 'top',
                table:[],
                multipleSelection: [],
                formLabelWidth: '125px',
                startDis:true,
                endDis:true,
                setGray:true,
                show:false,
                currentPage:1,
                pagesize:8,  
                parameter: '',
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                loading: true,
                modelName:''
            };
        },
        methods: {
        	
            handleSizeChange: function (size) {
               /* this.pagesize = size;
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter('name',query,'LIKE').Offset(0).Limit(this.pagesize).Build();
                this.parameter.sortObject.field = this.prop
				this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(parameter)*/
                
                
                this.pagesize = size;
                //var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                this.parameter = createParameter('name','LIKE').Offset(0).Limit(this.pagesize).Build();
                this.parameter.sortObject.field = this.prop
				this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)

            },
            handleCurrentChange: function(currentPage){
            	
            	//改错：去掉了query
            	this.currentPage = currentPage;
            	var limit=this.pagesize;
            	var offset = (currentPage-1)*this.pagesize;
            	this.parameter =createParameter('name','LIKE').Offset(offset).Limit(limit).Build();
                this.parameter.sortObject.field = this.prop
				this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)
            	
              // console.log('当前页'+currentPage);
               //alert('11');

            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
                if(val.length > 0){
                    this.startDis = false;
                    this.endDis = false;
                }else {
                    this.startDis = true;
                    this.endDis = true;
                }
            },
            //table list
            listTable:function listTable(parameter){
                // GET List
                rulesgetDate(this.id,parameter).then(data => {

                    this.loading = false
                    this.table = data;
                    
                    if(data.content==''){
                    	this.setGray=true;
                    }else{
                    	this.setGray=false;
                    }
                    
                    
                    if(this.table==''){                    	
                    	this.loading = false;      
                    }
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
           
            //返回分析模板
            returnTemplate:function(){
                this.$router.push({ path: '/qualityAnalysis/analysisTemplate' });                
            },
            
            //启用
            handleEnable(){
            	var tableRefresh = this;
            	var tbIds = [];
            	this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                
            	/*ruleEnable(this.id).then(data=>{
            		
            	})*/
            	
            	tableRefresh.$confirm('真的要启用'+tbIds.length+'个分析规则绑定?', '提示', {
                }).then(() => {
                        ruleEnable(this.id,tbIds).then(data => {
                            tableRefresh.listTable(parameter);
                            /*tableRefresh.$message({
                                message: '恭喜你，删除已成功！',
                                type: 'success'
                            });*/
                           
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
            //规则停止
            handleDisable(){
            	var tableRefresh = this;
            	var tbIds = [];
            	this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                
            	
            	tableRefresh.$confirm('真的要停用'+tbIds.length+'个分析规则绑定?', '提示', {
                }).then(() => {
                        ruleStop(this.id,tbIds).then(data => {
                            tableRefresh.listTable(parameter);
                            /*tableRefresh.$message({
                                message: '恭喜你，删除已成功！',
                                type: 'success'
                            });*/
                           
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
            
            
            
            
            
            //删除
            delTable(){
            	var tableRefresh = this;
            	var tbIds = [];
            	this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                
                tableRefresh.$confirm('真的要删除'+tbIds.length+'个分析规则绑定?', '提示', {
                }).then(() => {
                        ruleDelete(this.id,tbIds).then(data => {
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
            
            //为了传值，将列表第一条的name保存下来
            // this.modelName=data.content[0].name;
            //重新获取分析模板列表
            getModelName(parameter){
            	atgetDate(parameter).then(data=>{
            		this.modelName=data.content[0].name;
            		Bus.$emit('handleRow',this.id,this.modelName,this.multipleSelection);
            	}).catch(err=>{
            		console.log(err)
            	})
            },
            
            getModelNameCycle(parameter){
            	atgetDate(parameter).then(data=>{
            		this.modelName=data.content[0].name;
            		Bus.$emit('handleCycleRow',this.id,this.modelName);
            	}).catch(err=>{
            		console.log(err)
            	})
            },
            //运行
            runTemp(){
            	if(this.row){
	            	if(this.row.name!==undefined){
	            		Bus.$emit('handleRow',this.id,this.row.name,this.multipleSelection,this.$route.query.id);
	            	}else{
	            		this.getModelName(parameter);
	            		
	            		//Bus.$emit('handleRow',this.id,this.modelName);
	            	}
            	}else{
            		Bus.$emit('handleRow',this.id,localStorage.getItem('modelName'),this.multipleSelection);
            	}
            	
            	
            },
            
            //周期运行
            runCycleTemp(){
            	if(this.row){            		
            		if(this.row.name!==undefined){
            			Bus.$emit('handleCycleRow',this.id,this.row.name);
	            	}else{
	            		this.getModelNameCycle(parameter);
	            	}
            		
            	}else{
            		Bus.$emit('handleCycleRow',this.id,localStorage.getItem('modelName'));
            	}
            	
            	//Bus.$emit('handleCycleRow',this.id,this.row.name)
            },
            
            
            
            
            //创建规则模板
            newRules: function () {
            	
                this.parentHtml = false;
                this.childrenHtml = true;
               /* addTbaleDate(this.id).then(data=>{
                	console.log(data+'点击增加按钮');
                })*/
               //点击增加按钮后将从时间值传到新增模板页面
               /*"{ path: '/qualityAnalysis/analysisTemplate/rules/new',query:{id:this.id}}"*/
              this.$router.push({ name: "创建规则模板",params:{}, query: {id:this.id, processDataId:this.$route.query.processDataId}});
            },
            
             //查看当前规则模板
            seeThisRules : function(){
            	
              this.$router.push({ name: "查看分析模板",params:{row:this.row}, query: {id:this.id}});
            },
            
            
            
            //进入规则绑定页面
            handleEdit(ruleId){
            	
            	
            	this.$router.push({ name: "规则绑定",params:{row:this.row,ruleId:ruleId}, query: {id:this.id}});
            	//获取到每条规则的ID值，将该值传到ruleBind.vue页面
            	
            }
           
        },
        //监听路由变化，进行数据更新
        watch:{
            "$route":function () {
                this.listTable(parameter)
            }
        },
        mounted() {
        	this.listTable(parameter);
        	if(this.row){
        		localStorage.setItem('modelName',this.row.name)
        	}
        	
        	//console.log(this.id,this.row.name)
            //console.log(this.row.createTime);
            //console.log(this.row.processDataId);
           //console.log(this.$route.params.modelName+'test');
        }

    }
</script>

<style scoped>
	.outBox{
	background: #fff;
	position: absolute;
	z-index: 100;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	/*min-height: 700px;*/
}
    
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
        margin-right: 10px;
        text-decoration: none;
    }
    .seeName{
	    margin-left: 5px;
	    color: #2182e4;
	    cursor: pointer
    }
    .seeName:hover{
    text-decoration: underline;
  }
  .el-table__row{
  	color: #333;
  }
</style>