<template>
	<section>
		<el-row class="btnClass">
			<div class="seach-left">
				<el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchTable" class="input-with-search">
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
				<el-table 
						 @sort-change="getOrder"
					     :data="tableData.content"
						  tooltip-effect="dark"
						  style="width: 100%" height="calc(100vh - 200px)">
					<!--<el-table-column type="selection">
                    </el-table-column>-->

					<el-table-column  label="名称" prop="name" sortable="custom">
						<template slot-scope="scope">
							<span>
								{{scope.row.name}}
							</span>
						</template>
					</el-table-column>

					<el-table-column label="数据源" prop="dataSource" min-width="90" sortable="custom">
						<template slot-scope="scope">
							<span>
								{{scope.row.dataSource}}
							</span>
						</template>
					</el-table-column>

					<el-table-column label="同步对象" prop="object" width="150" sortable="custom">
						<template slot-scope="scope">
							<span style="padding-left: -15px;"
									@click="objectDialog(scope.row.dataSourceId, scope.row.object, scope.row.collecterId)"
									v-if="JSON.parse(scope.row.taskJson).dataSource.type == 'JDBC'"
							>
								{{scope.row.object}}
							</span>
							<span v-else>{{scope.row.object}}</span>
						</template>
					</el-table-column>

					<el-table-column label="数据集" prop="dataStore" sortable="custom" min-width="90">
					</el-table-column>
					<el-table-column label="周期情况" prop="trigger" width="100" sortable="custom">
						<template slot-scope="scope">
							<span v-if="scope.row.trigger == ''">单次执行</span>
							<span v-else>周期执行</span>
						</template>
					</el-table-column>


					<el-table-column label="创建时间" prop="createTime" width="180" :formatter="dateFormat" sortable="custom">
					</el-table-column>
					<el-table-column label="状态" prop="status" width="80" sortable="custom">
						<template slot-scope="scope">
							<div  v-if="scope.row.status == 0" class="status-div-create">已创建</div >
							<div  v-else-if="scope.row.status == 1"  class="status-div-deploy">已部署</div >
							<div  v-else-if="scope.row.status == 2" class="status-div-stop">已停止</div >
							<div  v-else-if="scope.row.status == -1" class="status-div-error">错 误</div >
							<div  v-else>未知</div >
						</template>
					</el-table-column>

					<el-table-column label="最后执行时间" prop="lastExecuteTime" width="180" :formatter="dateFormat" sortable="custom">
					</el-table-column>
					<el-table-column label="最后执行状态" prop="lastExecuteStatus" width="130" sortable="custom">
						<template slot-scope="scope">
							<div  v-if="scope.row.lastExecuteStatus == 0" >创建</div >
							<div  v-else-if="scope.row.lastExecuteStatus == 1">运行中</div >
							<div  v-else-if="scope.row.lastExecuteStatus == 2" >完成</div >
							<div  v-else-if="scope.row.lastExecuteStatus == -1" >失败</div >
							<div  v-else>未知</div >
						</template>
					</el-table-column>

					<el-table-column label="最后读入" prop="lastReadIn" width="100" sortable="custom">
					</el-table-column>
					<el-table-column label="最后写出" prop="lastWriteOut" width="100" sortable="custom">
					</el-table-column>
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
	import {queryObject, createParameter} from "@function/queryParameter";
    import { getCollectorTaskList } from '@api'
	export default{
		 components: {               
        },
		data(){
			return{
				searchInput:'',
				startTime:'',
				endTime:'',
				tableData:{},
				parameter:'',
				currentPage:1,
				collectorId : "_ALL_COLLECTER_JOBS_",
				pagesize:8,
				prop: 'lastModifiedTime',
                orderDirection:'DESC',
                dateValue:''
                
			}
		},
		methods:{
			searchTable(){
				this.currentPage=1;
                var parameter = this.buildParameters();
                this.getCollectorTasks(parameter);
			},
			handledateValue(val){
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                this.currentPage=1;
                var parameter = this.buildParameters();
                this.getCollectorTasks(parameter);
            },
			buildParameters(){
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
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
                this.getCollectorTasks(this.parameter)
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var parameter = this.buildParameters();
                this.getCollectorTasks(this.parameter)
            },
            
            //获取采集器任务列表
            getCollectorTasks: function (para) {
                if(!para){
                    para = this.parameter
                }
                this.loading = true;           
                getCollectorTaskList(this.collectorId, para).then((res) => {
                    this.tableData = res;
                    this.total = res.total
                    this.loading = false;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                });
            },
			//table查询的列表
            searchListTable: function (parameter, type, startTime,endTime, searchInput,pagesize) {
                var that = this;
                that.currentPage = 1
                if(pagesize)that.pagesize = pagesize;
                if(startTime)that.startTime = startTime;
                if(endTime)that.endTime = endTime;
                if(searchInput!=undefined)that.searchInput = searchInput;
                that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
                this.getCollectorTasks(that.parameter)
            },
             //列表排序
			getOrder(column) {
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
				that.getCollectorTasks(parameter);
			}
		},
		mounted(){
			var that = this;
            that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
           // console.log(that.currentPage+'当前页页码')
            that.getCollectorTasks(that.parameter);
            
		}
	}
</script>

<style lang="scss" scoped>
.con-module{
	width: 98%;
	margin: 20px;
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
    margin-right: 0px;
    text-decoration: none;
  }

  .ers-pattern{
    float: left;
    width: 300px;
    height: 40px;
    line-height: 40px;
  }

  .ers-pattern h4{
    margin: 0px;
    float: left;
  }
  .ers-pattern .el-select{
    float: left;
    margin-left: 10px;

  }
  .status-div-create{
    background-color:#337ab7;
    padding:4px;
    text-align: center;
    font-size:12px;
    color: white;
  }
  .status-div-stop{
    background-color:#d9534f;
    padding:4px;
    text-align: center;
    font-size:12px;
    color: white;
  }
  .status-div-error{
    background-color:#ffa54f;
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
  .el-button--text{
  	color: #333;
  }
  .el-button{
		cursor: text;
	}
</style>