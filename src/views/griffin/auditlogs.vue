<template>
	<section class="irContent">
		<div id="bm-griffin-user-auditlogs">
			<div class="mid">
				<el-input id="bm-griffin-user-auditlogs-searchInput" placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
					<el-button id="bm-griffin-user-auditlogs-searchTable" slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
				</el-input>
				<div class="block">
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
				</div>
			</div>
			<el-table
					id="bm-griffin-user-auditlogs-table"
					v-loading = "loading"
					ref="multipleTable"
					:data="table.content"
					tooltip-effect="dark"
					style="width: 100%;"
					height="calc(100vh - 175px)"
					@selection-change="handleSelectionChange">
				<el-table-column
						prop="name"
						label="操作"
						:filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
						:filter-method="filterTag"
						filter-placement="bottom-end">
					<template slot-scope="scope">
						{{ scope.row.name }}
						<el-tag v-if="scope.row.tag"
								:type="scope.row.tag === '家' ? 'primary' : 'success'"
								close-transition>{{scope.row.tag}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column
						label="客户端IP"
						width="160"
						prop="creator">
				</el-table-column>
				<el-table-column
						label="创建时间"
						prop="createTime"
						width="160"
						:formatter="dateFormat">
				</el-table-column>
				<el-table-column
						prop="lastModifier"
						label="对象Id"
						width="160">
				</el-table-column>
				<el-table-column
						prop="lastModifiedTime"
						label="处理时间"
						width="160">
				</el-table-column>
				<el-table-column
						label="用户Id"
						width="160"
						prop="owner">
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
	</section>
</template>
<script>
    import { auditlogsList } from '@api';

    var parameter={filter:"",limit:"8",offset:"0",query:"",sorts:"-lastModifiedTime"};
    export default {
        data() {
            return {
                table:[],
                dateValue: '',
                facetContent:"",
                //show:false,
                currentPage:1,
                startTime: false,
                endTime:false,
                input23:"",
                pagesize:8,
                searchInput:'',
                isActive:false,
                loading: true
            }
        },
        methods: {
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
            handleSizeChange: function (size) {
                this.pagesize = size;
                var parameter={filter:"",limit:this.pagesize,offset:"0",query:this.searchInput,sorts:"-lastModifiedTime"}
                this.listTable(parameter)

            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var parameter={filter:"",limit:this.pagesize,offset:(currentPage-1)*this.pagesize,query:this.searchInput,sorts:"-lastModifiedTime"}
                this.listTable(parameter)

            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //table list
            listTable:function listTable(parameter){
                auditlogsList(parameter).then(data => {
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
                var parameter={filter:"",limit:"8",offset:"0",query:this.searchInput,sorts:"-lastModifiedTime"};
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup:function () {
                this.searchTable(parameter);
            },
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            }
        },
        mounted() {
            this.listTable(parameter)
        }
    };

</script>

<style lang="scss" scoped>
	.filterTag{
		background-color: #E7EAF1;
		display: flex;
		padding: 20px;
		flex-direction: row;
		flex-wrap: wrap;
		.cont{
			margin-bottom: 10px;
			.circle{
				border-radius: 20px;
				margin-right: 20px;
				background-color: #EFF1F8;
			}
			.active{
				background-color: #499FFF;
				color: white;
			}
		}

	}
	.mid{
		display: flex;
		flex-direction: row;
		justify-content:flex-end;
		margin: 15px 0px 15px 0px;
		justify-content: flex-end;
		.search-btn{
			width: 200px;
			margin-right: 20px;
		}
	}
</style>


