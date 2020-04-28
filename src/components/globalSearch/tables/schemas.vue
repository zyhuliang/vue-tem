<template>
	<div>
			<div class="dn-data">
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
				<!--内容显示列表页面-->
				<el-row class="rf-swap">
					<el-table
							@sort-change="getOrder"
							:data="table.content"
							tooltip-effect="dark"
							style="width: 100%"
							v-loading="loading"
							id="bm-com-global-search-schema-table"
							height="calc(100vh - 200px)"
							>
						<!--<el-table-column
								type="selection"
								width="40">
						</el-table-column>-->
						<el-table-column
								prop="id"
								label="主键"
								v-if="show"
								>
						</el-table-column>
						<el-table-column
								prop="name"
								label="名称"
								sortable="custom"
								>
							<template slot-scope="scope">
								<span class="editName">{{scope.row.name}}</span>
							</template>
						</el-table-column>
						<el-table-column
								v-if="showType"
								prop="type"
								label="类型"
								sortable="custom"
								>
						</el-table-column>
						<el-table-column
								v-if="showStorage"
								prop="storage"
								label="类型"
								sortable="custom"
								>
						</el-table-column>
						<!--<el-table-column
								prop="path"
								label="路径"
								show-overflow-tooltip>
						</el-table-column>-->
						<el-table-column
								prop="version"
								label="版本"
								sortable="custom"
								>
						</el-table-column>
						<el-table-column
								prop="createTime"
								label="创建时间"
								sortable="custom"
								width="180"
								:formatter="dateFormat"
								>
						</el-table-column>
						<el-table-column
								prop="creator"
								label="创建人"
								sortable="custom"
								>
						</el-table-column>
						<el-table-column
								prop="lastModifier"
								label="修改人"
								sortable="custom"
								>
						</el-table-column>
						<el-table-column
								prop="lastModifiedTime"
								label="修改时间"
								sortable="custom"
								width="180"
								:formatter="dateFormat"
								>
						</el-table-column>
						<el-table-column
								v-if="showExpiredPeriod"
								prop="expiredPeriod"
								label="过期时间"
								sortable="custom"
								width="180"
								:formatter="expiredPeriodFormat"
								>
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
			<!-- 无数据 -->
			<!--<div class="dn-no-data" v-if="noData && !isShow">
				<div class="noData">
					<p><i class="icon iconfont icon-ir-no-data"></i></p>
					<p>暂无数据，请选择</p>
				</div>
			</div>-->
		
		</div>
</template>

<script>
	//引入查询组件
    /*import searchDateData from '@collectorSearch/searchDateData.vue'
    import searchTableData from '@collectorSearch/searchTableData.vue'*/
    import { resDirTree, listData, listData2, nodeDataSet, deleteSchema, deleteDataset, deleteDatasource, deleteStandard } from '../../../api/api'
    import {queryObject,createParameter} from '@function/queryParameter.js';
	export default{
		data(){
			return{
				beData: false,
				pagesize:8,
				searchInput:'',
				startTime:'',
				endTime:'',
				loading:false,
				table:[],
				show:false,
				showType: false,
				showStorage: false,
				showExpiredPeriod:false,
				showPreview: false,
				currentPage:1,
				resType:'schemas',
				navId:'',
				owner:'',
				dateValue:'',
				parameter:''
			}
		},
		/*components:{
			searchDateData,
            searchTableData            
		},*/
		methods:{
			searchTable(){
				this.currentPage=1;
                var parameter = this.buildParameters();
                this.listTable(parameter);
			},
			handledateValue(val){
				if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                this.currentPage=1;
                var parameter = this.buildParameters();
                this.listTable(parameter);
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
				this.listTable(this.parameter,this.resType,'status')
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var parameter = this.buildParameters();
                this.listTable(this.parameter)
            },
			//查询table列表
			 searchListTable: function (parameter, type, startTime,endTime, searchInput,pagesize) {
                var that = this;
                that.currentPage = 1
                if(pagesize)that.pagesize = pagesize;
                if(startTime)that.startTime = startTime;
                if(endTime)that.endTime = endTime;
                if(searchInput!=undefined)that.searchInput = searchInput;
                this.listTable(parameter, type, startTime,endTime, searchInput)
           },
           
           listTable(parameter,type,status){
           	    var that = this;
           	    
                that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
                that.parameter = createParameter('parentId',that.navId,'EQUAL').Build(that.parameter);
                that.parameter = createParameter('owner',that.owner,'EQUAL').Build(that.parameter);
                var typeTmp=that.resType;
                that.loading=true;
                if(status === 'status') {
                    that.parameter.sortObject.field = that.prop
				    that.parameter.sortObject.orderDirection = that.orderDirection
                }
           		listData2(that.parameter, typeTmp).then(data => {
                        //console.log(data,打印出来的数据);
                        that.table = data;
                        that.loading=false;
                   }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
           },
           //列表排序
			getOrder: function(column) {
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
				var parameter = createParameter().Limit(this.pagesize).Sort(that.prop,that.orderDirection).Build();
                that.listTable(parameter, this.resType, 'status');
            },
           //获取目录所对应的ID值
           getNavId() {
           	var para = {allUser: true, excludes: '$Workflow;$Dataflow;$Streamflow', includes: 'schema_dir;dataset_dir;datasource_dir;standard_dir', strict: true}
	           	resDirTree(para).then(data => {
	           		this.theModel = data;
	           		//console.log(data.length + '目录名字');
	
	           		for(var k in data) {
	           			//console.log(data[k].name);
	           			if(data[k].name=='Schemas'){
	           				//console.log(data[k].id+'打印出来');
	           				this.navId=data[k].id;
	          				this.owner=data[k].owner;
	           			}
	           		}
	           		var parameter=createParameter("parentId",this.navId,"EQUAL").Limit(8).Offset(0).Sort("lastModifiedTime","DESC").Build();			
			        this.listTable(parameter,'schemas');	
	           	}, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
             }
           },
           mounted() {
           	   
           	   this.getNavId();          
		}
	}
</script>

<style lang="scss" scoped>
	.dn-content{
		float: left;
		width: 100%;
		position: relative;
		/*padding-left: 250px;*/
		box-sizing:border-box;
		height: 100%;
		.dn-data{
			position: relative;
			padding: 20px;
			.el-table{
                margin-top: 20px;
				.editName{
					color: #2182e4;
					cursor: pointer
				}
				.editName:hover{
					text-decoration: underline;
				}
			}
		}
	}
	.dn-content .dn-no-data{
		position: fixed;
		width: 100%;
		box-sizing:border-box;
		height: 100%;
		z-index:-1;
	}
	.dn-content .dn-no-data .noData{
		position: absolute;
		width: 200px;
		height: 200px;
		top: 50%;
		left: 50%;
		margin-left: -325px;
		margin-top: -150px;
		color:#cccccc;
		p{
			text-align: center;
			font-size: 16px;
			margin: 0px;
		}
		i{
			width: 100px;
			height: 100px;
			font-size: 80px;
		}
	}
	.res-table{
		max-height: 750px;
		overflow-y: auto;
	}
	.dn-content .dn-data .el-table .editName{
		color: #333;
    	cursor: text;
	}
</style>