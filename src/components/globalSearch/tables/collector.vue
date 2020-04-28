<template>
	<section>
		<el-row class="btnClass">
			<div class="seach-left">
				<el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
                    <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
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
			</div>
		</el-row>
		<template>
			<el-row class="rf-swap">
				<el-table :data="tableData.content"
						  tooltip-effect="dark"

						  @sort-change="getOrder"
						  style="width: 100%" height="calc(100vh - 200px)">
					<!--<el-table-column
                            type="selection">
                    </el-table-column>-->
					<el-table-column prop="id" label="主键" width="150" sortable="custom" >
						<template slot-scope="scope" >
							<router-link v-if="scope.row.status == 1"
										 :to="{ path:''}">
								<el-button type="text" class="detail-btn">{{scope.row.id}}</el-button>
							</router-link>
							<span v-else>{{scope.row.id}}</span>
						</template>
					</el-table-column>

					<el-table-column  prop="name" label="名称" width="150" sortable="custom">
					</el-table-column>
					<el-table-column prop="ip" label="主机地址" width="150" >
					</el-table-column>
					<el-table-column prop="hostname" label="主机名" width="150" >
					</el-table-column>
					<el-table-column prop="startedTime" label="启动时间" with="100" :formatter="startedTimeFormat" >
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" with="100" :formatter="dateFormat" sortable="custom">
					</el-table-column>
					<el-table-column prop="creator" label="创建人" with="80" sortable="custom">
					</el-table-column>
					<el-table-column prop="status" label="状态" width="80" sortable="custom">
						<template slot-scope="scope">
							<div  v-if="scope.row.status == 0" class="status-div-stop">OFFLINE</div >
							<div  v-else-if="scope.row.status == 1"  class="status-div-deploy">ONLINE</div >
						</template>
					</el-table-column>
					<!--<el-table-column>-->
					<!--<template slot-scope="scope">-->
					<!--<el-button-->
					<!--type="text"-->
					<!--size="small"-->
					<!--&gt;-->
					<!--资源目录-->
					<!--</el-button>-->
					<!--</template>-->
					<!--</el-table-column>-->


				</el-table>
				<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="currentPage"
						:page-sizes="[8, 16, 50, 100]"
						:page-size="pagesize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="tableData.totalElements">
				</el-pagination>
			</el-row>
		</template>
	</section>
</template>
<script>
	import {createParameter} from "@function/queryParameter";
	import { getCollectorList} from '@api'
	import moment from "moment"//时间格式化
	import searchDateData from '@collectorSearch/searchDateData.vue'
    import searchTableData from '@collectorSearch/searchTableData.vue'
    export default{
    	 components: {
             searchDateData,
             searchTableData,
        },
        data(){
        	return{
        		searchInput:'',
        		startTime:'',
                endTime:'',
                tableData:{},
                currentPage:1,
                prop: 'lastModifiedTime',
                orderDirection:'DESC',
                parameter:'',
        		pagesize:8,
        		dateValue:''
        	}
        },
        methods:{
        	searchTable(){
        		
        	},
        	handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                this.currentPage=1;
                var parameter = this.buildParameters();
                this.getCollector(parameter);
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
                return parameter;
            },
        	handleSizeChange: function (size) {
                this.pagesize = size;
                var parameter = this.buildParameters();
                this.getCollector(parameter)
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var parameter = this.buildParameters();
                this.getCollector(parameter)
            },
        	searchListTable: function (parameter, type, startTime,endTime, searchInput,pagesize) {
                var that = this;
                that.currentPage = 1
                if(pagesize)that.pagesize = pagesize;
                if(startTime)that.startTime = startTime;
                if(endTime)that.endTime = endTime;
                if(searchInput!=undefined)that.searchInput = searchInput;
                that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
                this.getCollector(that.parameter)
           },
           handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
           },
           //获取采集器列表
            getCollector:function(para) {
                if(!para){
                    para = this.parameter;
                }
                this.loading = true;
                getCollectorList(para).then((res) => {
                    this.tableData = res;
                    this.loading = false;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
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
                that.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.pagesize = 8
				this.currentPage = 1
				that.parameter = createParameter().Sort(column.prop,this.orderDirection).Build();
				that.getCollector(that.parameter);
			},
			 //根据过期时间过滤结果
            startedTimeFormat:function(row, column){
                let time = row.startedTime;
                if(time == 0){
                    return "未启动";
                }else {
					return moment(time).format("YYYY-MM-DD HH:mm:ss");
				}
            }
        },
        mounted(){
        	var that = this;
            that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
            that.getCollector(that.parameter);
        }
        
    }
</script>

<style lang="scss" scoped>
.con-module{
	width: 98%;
	margin: 20px;
}
	.topContent{
		float: left;
		position: relative;
		width: 100%;

		box-sizing: border-box;
		padding-top: 10px;
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
	.status-div-stop{
		background-color:#d9534f;
		padding:4px;
		text-align: center;
		font-size:12px;
		color: white;
	}
	.status-div-deploy{
		background-color:#5cb85c;
		padding:4px;
		text-align: center;
		font-size:12px;
		color: white;
	}
	/*.el-button--text{
		color:#333;
	}*/
	.el-button{
		cursor: text;
	}
</style>