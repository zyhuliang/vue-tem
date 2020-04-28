<template>
	<section class="con-module">
		<el-row class="btnClass" id="bm-rhinos-processconfig-list">
			<el-input id="bm-rhinos-processconfig-list-searchInput" placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
				<el-button id="bm-rhinos-processconfig-list-searchBtn" slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
			</el-input>
			<el-date-picker
					id="bm-rhinos-processconfig-list-timepicker"
					v-model="dateValue"
					type="daterange"
					value-format="timestamp"
					@change="handledateValue"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期">
			</el-date-picker>
			<div class="btn-right">
					<el-button id="bm-rhinos-processconfig-list-create" type="info" @click="create"><i class="icon iconfont icon-ir-add"></i>创建</el-button>

				<el-button type="info" id="bm-rhinos-processconfig-list-del" class="delBut" @click="delTable" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-directory-delete"></i>&nbsp;删除</el-button>
			</div>
		</el-row>
		<!--<router-view></router-view>-->
		<el-row class="rf-swap">
			<el-table
					id="bm-rhinos-processconfig-list-table"
					:data="table.content"
					tooltip-effect="dark"
					@selection-change="handleSelectionChange"
					@sort-change="getOrder"
					v-loading = "loading"
					style="width: 100%"  height="calc(100vh - 175px)" >
				<el-table-column
						type="selection"
						:selectable="setSelection"
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
						min-width="200"
						sortable="custom"
						align="center">
				</el-table-column>
				<el-table-column
						v-if="type"
						sortable="custom"
						align="center"
						width="100px"
						label="返回类型">
					<template slot-scope="scope">
						<div> {{scope.row.returnType}}</div>
					</template>
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
						width="90">
				</el-table-column>
				<el-table-column
						prop="lastModifier"
						label="修改人"
						align="center"
						sortable="custom"
						min-width="90">
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
					id="bm-rhinos-processconfig-list-page"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-sizes="[8, 16, 50, 100]"
					:page-size="pagesize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="table.totalElements">
			</el-pagination>
		</el-row>
	</section>
</template>
<script>
    import {confList ,delConf} from '@api';
    import {createParameter} from '@function/queryParameter.js';
    export default {
        data() {
            return {
                table:[],
                dateValue: '',
                currentPage: 1,
                pagesize: 8,
                multipleSelection:[],
                searchInput:'',
                isActive:false,
                startTime: false,
                endTime:false,
				type:false,
				parameter: '',
				orderDirection: 'DESC',
				field: 'lastModifiedTime',
				loading: true,
                routeParam:"",   // 路由参数,
            }
        },
        methods: {
			localStorageParameter(){
                localStorage.setItem("parameter",JSON.stringify(this.parameter));
            },
            create:function () {
                this.$router.push({ path: `/processconfig/new/${this.routeParam.replace(' ','-')}` });
            },
            handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleSizeChange: function (size) {
				console.log(size)
                this.pagesize = size;
				this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
				this.parameter.sortObject.field = this.field
				this.parameter.sortObject.orderDirection = this.orderDirection
				this.listTable(this.parameter);
				this.localStorageParameter()
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
			   	this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput)
				this.parameter.sortObject.field = this.field
				this.parameter.sortObject.orderDirection = this.orderDirection
				this.listTable(this.parameter);
				this.localStorageParameter()
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // table list
            listTable:function listTable(parameter){
				this.loading = true;
                confList(parameter).then(data => {
					this.loading = false;
                    this.table= data;
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
                var parameter = this.buildParameters()
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup:function () {
                this.searchTable(parameter);
            },
            setSelection (row, index) {
                if (row.owner === 'root') {
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
                var tbIds = [];
                this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                that.$confirm('真的要删除'+tbIds.length+'个配置?', '提示', {
                }).then(() => {
                    delConf(tbIds).then(data => {
                        var parameter = that.buildParameters()
                        that.listTable(parameter);
                        that.$message({
                            message: '恭喜你，删除已成功！',
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
            buildParameters:function(){
                var limit=this.pagesize;
                var offset = (this.currentPage-1)*this.pagesize;
                var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
                if(query != '%'){
                    parameter = createParameter('name',query,"LIKE").Build(parameter);
				}
				parameter = createParameter('processConfigType',this.routeParam,'EQUAL').Build(parameter)
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
			//列表排序
			getOrder: function(column) {
                var that = this
				if (column.order === 'ascending') {
					this.orderDirection = 'ASC'
				} else {
					this.orderDirection = 'DESC'
				}
				this.field = column.prop
                if (column.prop === null) {
                    return false
				}
				this.currentPage = 1
				// that.parameter = createParameter().Limit(this.pagesize).Sort(column.prop,this.orderDirection).Build();
				that.parameter = this.buildParameters()
				that.listTable(that.parameter);
			},
        },
        mounted() {
			console.log('define')
             this.routeParam = this.$route.path.substr(15,this.$route.path.length).replace('-',' ')
			// var parameter = this.buildParameters()
			 if(JSON.parse(localStorage.getItem("parameter"))){
				this.parameter=JSON.parse(localStorage.getItem("parameter"));
				this.routeParam = this.parameter.fieldList[0].fieldValue;
				this.currentPage=(this.parameter.offset/this.parameter.limit)+1;
                this.pagesize=this.parameter.limit;
            }else{
                this.parameter=this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
            }
			this.listTable(this.parameter);
        },
        watch:{
            $route(to,from){
                this.type = false
				this.routeParam = this.$route.path.substr(15,this.$route.path.length)
				this.routeParam = this.routeParam.replace(/-/, " ")
				if(this.routeParam == "dataflow-udf"){
                    this.type = true
				}
				this.parameter=this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
                this.listTable(this.parameter)
			}
        },
    };

</script>

<style lang="scss" scoped>

	.con-module{
		float: left;
		position: relative;
		box-sizing: border-box;
		.detail-btn{
			padding: 0px;
		}
		.el-row{
			.el-button i{
				font-size: 13px;
			}
			.delBut{
				margin: 0px 0px 0px 10px;
			}
		}
		.el-table{
			float: left;
		}
		.configAdd{
			color: #ffffff;
			text-decoration: none;
			margin-right: 10px;
		}
	}
	
.el-table--scrollable-x .el-table__body-wrapper {
     overflow-x: hidden; 
}
</style>
