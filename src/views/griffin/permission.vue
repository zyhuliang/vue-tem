<template>
	<section class="permissin-container" id="bm-griffin-user-permission">
		<el-row class="btnClass">
			<el-input id="bm-griffin-user-searchInput" placeholder="请输入用户名" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
				<el-button id="bm-griffin-user-searchTable"  slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
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
		</el-row>
		<router-view></router-view>
		<div class="rf-swap">
			<el-table
					id="bm-griffin-user-permission-table"
					height="calc(100vh - 175px)"
					:data="table.content"
					@sort-change="getOrder"
					v-loading = "loading"
					tooltip-effect="dark">
				<el-table-column
						prop="name"
						label="用户名"
						sortable="custom">
					<template slot-scope="scope">
						<router-link class="usAdd" :to="{ path:'/user/'+scope.row.id}" >{{scope.row.name}}</router-link>
					</template>
				</el-table-column>
				<el-table-column
						label="大数据平台"
						>
					<template slot-scope="scope">
						<div v-show="scope.row.permissions.length == 2">
							<span>
								<input type="checkbox" checked disabled>管理员
							</span >
							<span>
								<input type="checkbox" checked disabled>用户
							</span>
						</div>
						<div  v-show="scope.row.permissions.length != 2">
							<span  v-show="scope.row.permissions[0].name.indexOf('woven.admin') != -1">
									 <input type="checkbox" checked disabled>管理员
									</span >
							<span  v-show="scope.row.permissions[0].name.indexOf('woven.admin') == -1">
									  <input type="checkbox"  disabled>管理员
									</span >
							<span v-show="scope.row.permissions[0].name.indexOf('woven.user') != -1">
									  <input type="checkbox" checked disabled>用户
									</span>
							<span v-show="scope.row.permissions[0].name.indexOf('woven.user') == -1">
									  <input type="checkbox"  disabled>用户
									</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
					id="bm-griffin-user-permission-page"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-sizes="[8, 16, 50, 100]"
					:page-size="pagesize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="table.totalElements">
			</el-pagination>
		</div>
	</section>
</template>
<script>
    import { permissionsList } from '@api';
    import {queryObject,createParameter} from "@components/function/queryParameter";

    var parameter= queryObject();
    export default {
        data() {
            return {
                createUserUrl:"/user/add",
                table:[],
                dateValue: '',
                //show:false,
                currentPage:1,
                pagesize:8,
                searchInput:'',
                isActive:false,
                startTime: false,
				endTime:false,
				loading: true,
				prop: 'lastModifiedTime',
				orderDirection:'DESC',
				parameter:""

            }
        },
        methods: {
            handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                // var parameter = createParameter('name',query,"LIKE").
                // And('lastModifiedTime',Number(this.$refs.startTime.innerText),'GREATER_THAN').
                // And('lastModifiedTime',Number(this.$refs.endTime.innerText),'LESS_THAN').
				// Build();
				var parameter = createParameter('name',query,"LIKE").Build()
				if(this.dateValue ){
                  if(this.dateValue.length ==0){
                        
                    } else {
                        parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                        And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                        Build(parameter);
                    }
                }
                this.listTable(parameter);
			},

            handleSizeChange: function (size) {
                this.pagesize = size;
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
				this.parameter = createParameter('name',query,'LIKE').Offset(0).Limit(this.pagesize).Sort(this.prop,this.orderDirection).Build();
				this.parameter.sortObject.field = this.prop
				this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)

            },
            handleCurrentChange: function(currentPage) {
                this.currentPage = currentPage;
                var limit=this.pagesize;
                var offset = (currentPage-1)*this.pagesize;
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
				this.parameter =createParameter('name',query,'LIKE').Offset(offset).Limit(limit).Build();
				this.parameter.sortObject.field = this.prop
				this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)

            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
			// table list
            listTable:function listTable(parameter){
				this.loading = true
                permissionsList(parameter).then(data => {
					this.loading = false
                    this.table= data;
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            },
            //查询
            searchTable:function searchTable(){
                var query = this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter('name',query,'LIKE').Build();
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
				that.parameter = createParameter().Limit(this.pagesize).Sort(this.prop,this.orderDirection).Build();
				that.listTable(that.parameter);
			}
        },
        mounted() {

			 if(JSON.parse(localStorage.getItem("parameter"))){
                this.parameter=JSON.parse(localStorage.getItem("parameter"));
                this.currentPage=(this.parameter.offset/this.parameter.limit)+1;
				this.pagesize=this.parameter.limit;
				
				console.log("if",this.parameter);
            }else{
				this.parameter=this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
					console.log("else",this.parameter);
            }
            this.listTable(this.parameter)
		},
         watch: {
            parameter(){
                localStorage.setItem("parameter",JSON.stringify(this.parameter));
            }
        }
    };

</script>

<style lang="scss" scoped>

	.permissin-container{
		margin: 0px;
		.detail-btn{
			padding: 0px;
		}
		.el-row{
			.el-button i{
				font-size: 13px;
			}
		}
		.el-table{
			float: left;
		}
	}

</style>


