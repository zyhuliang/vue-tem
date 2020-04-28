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
						value-format="timestamp"
						@change="handledateValue"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
				</el-date-picker>
				<!--<div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
				<div v-show="endTime" ref="endTime">{{dateValue[1]}}</div>-->
			</div>
		</el-row>
		<router-view></router-view>
		<el-row class="rf-swap">
			<el-table
					@sort-change="getOrder"
					:data="table.content"
					tooltip-effect="dark"
					v-loading="loading"
					id="bm-com-global-search-config-table"
					style="width: 100%"  height="calc(100vh - 200px)" >
				<el-table-column

						width="10">
				</el-table-column>
				<el-table-column
						label="名称"
						sortable="custom"
						width="100"
						prop="name"
						>
					<template slot-scope="scope"><router-link class="configAdd" :to="{ path:''}"><el-button type="text" class="detail-btn">{{scope.row.name}}</el-button></router-link></template>
				</el-table-column>
				<el-table-column
						prop="className"
						label="完整类名"
						sortable="custom"
						width="400px"
						>
				</el-table-column>
				<el-table-column
						prop="parameterlist"
						label="参数个数"
						sortable="custom"
						>
				</el-table-column>
				<el-table-column
						prop="returnType"
						label="返回类型"
						sortable="custom"
						>
				</el-table-column>
				<el-table-column
						prop="processConfigType"
						label="类型"
						sortable="custom"
						>
				</el-table-column>
				<el-table-column
						prop="createTime"
						label="创建时间"
						sortable="custom"
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
						:formatter="dateFormat"
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
	</section>
</template>
<script>
	import Bus from '../bus.js'
    import {confList ,delConf} from '@api';

    import {queryObject,createParameter} from '@function/queryParameter.js';
    export default {
        data() {
            return {
                createUserUrl:"/user/add",
                table:[],
                dateValue: '',
                //show:false,
                currentPage:1,
                pagesize:8,
                multipleSelection:[],
                searchInput:'',
                isActive:false,
                startTime: false,
                endTime:false,
                type:"",
                prop:'lastModifiedTime',
                orderDirection:'DESC',
                parameter:'',
                loading:false
            }
        },
        methods: {
            // 下拉框回调事件
            handleCommand(command) {
                this.$router.push({ path: `/processconfig/new/${command}` });
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
                this.pagesize = size;
                var parameter = this.buildParameters()
                this.listTable(parameter)
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                var parameter = this.buildParameters()
                this.listTable(parameter)
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // table list
            listTable:function listTable(parameter){
            	this.loading=true;
                confList(parameter).then(data => {
                    this.table= data;
                    this.loading=false;
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
                that.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
				var parameter = this.buildParameters();
				that.listTable(parameter);
			},
            //查询
            searchTable:function searchTable(){
                var parameter = this.buildParameters()
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup:function () {
                var parameter=this.buildParameters();
                this.listTable(parameter);
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
                if(this.dateValue){
                    if(this.dateValue!= '' && this.dateValue.length != 0 ){
                        parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                        And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                        Build(parameter);
                    }
                }    
                parameter.sortObject.field = this.prop
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },
        },
        mounted() {        	
            var parameter = this.buildParameters()
            this.listTable(parameter)
            //从全局搜索传递过来数据        	
    		Bus.$on('val',(data)=>{
    			//console.log(data);
    			this.searchInput = data;
    			this.searchTable();
    		})
        },
        beforeDestroy () {
		    Bus.$off('val')
		  }
    };

</script>

<style lang="scss" scoped>

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
	.el-button--text{
	color: #333;
	cursor: text;
}
</style>
