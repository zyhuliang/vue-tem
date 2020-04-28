<template>
   <div id="id">
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
				<el-button type="info" id="bm-rhinos-processconfig-list-del" class="delBut" @click="delService"><i class="icon iconfont icon-ir-directory-delete"></i>&nbsp;删除</el-button>
			</div>
            <div class="btn-right">
				<el-button type="info" id="bm-rhinos-processconfig-list-del" class="delBut" @click="stopService" ><i class="icon  el-icon-close"></i>&nbsp;停止</el-button>
			</div>
            <div class="btn-right">
				<el-button type="info" id="bm-rhinos-processconfig-list-del" class="delBut" @click="startService"><i class="icon  el-icon-check"></i>&nbsp;启动</el-button>
			</div>
		</el-row>
        <el-row class="rf-swap">
			<el-table
					id="bm-rhinos-processconfig-list-table"
					:data="tableData"
					tooltip-effect="dark"
					:loading = "loading"
					@selection-change="setSelection"
					style="width: 100%"  height="calc(100vh - 175px)" >
				<el-table-column
						type="selection"
						width="45">
				</el-table-column>
				<el-table-column
						label="名称"
						prop="name"
						>
				</el-table-column>
				<el-table-column
						key="id"
						prop="type"
						label="任务类型"
						align="center">
				</el-table-column>
				<el-table-column
						prop="objType"
						label="对象类型"
						align="center">
				</el-table-column>
                <el-table-column
						prop="objName"
						label="对象名称"
						align="center">
				</el-table-column>
                <el-table-column
						prop="executeTimes"
						label="执行次数"
						align="center"
						show-overflow-tooltip>
				</el-table-column>
				<el-table-column
						prop="createTime"
						label="创建时间"
						align="center"
						:formatter="dateFormat"
						show-overflow-tooltip>
				</el-table-column>
				<el-table-column
						prop="lastModifier"
						label="修改人"
						align="center">
				</el-table-column>
				<el-table-column
						prop="lastModifiedTime"
						label="修改时间"
						align="center"
						:formatter="dateFormat"
						show-overflow-tooltip>
				</el-table-column>
				<el-table-column
						label="周期情况"
						align="center">
						<template slot-scope="scope">
							<el-button type="text"   v-if="scope.row.scheduleType=='cron'">周  期</el-button>
        					<el-button type="text"   v-if="scope.row.scheduleType=='once'">一次性</el-button>
						</template>
				</el-table-column>
				<el-table-column
						label="启用状态"
						align="center">
						<template slot-scope="scope">
							<el-button type="text"   v-if="scope.row.enabled==1">运  行</el-button>
        					<el-button type="text"  style="color: grey" v-if="scope.row.enabled==0">未启动</el-button>
						</template>
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
					:total="numberOfElements">
			</el-pagination>
		</el-row>
   </div>
</template>
<script>
import {
    backendList,
    startbackendService,
    stopbackendService,
    delbackendService
} from '@api';
import moment from 'moment'
import {createParameter} from '@function/queryParameter.js';
export default {
    data(){
        return {
            tableData:[{name:'',id:'',creator:'',createTime:'1583309140360',lastModifier:'',lastModifiedTime:'1583309140360'}],
            numberOfElements:8,
            pagesize:8,
            currentPage:1,
            dateValue:'',
            searchInput: '',
            multipleSelection: [],
            loading: false,
        }
    },
    methods:{
        searchTable(){
			this.getlist()
        },
        searchKeyup(){
            this.getlist()
        },
        handledateValue(){
            this.getlist()
        },
        setSelection(val){
            this.multipleSelection = val.map((item,index)=>{
                return item.id
            })
        },
        handleCurrentChange(val){
            this.currentPage = val
            this.getlist()
        },
        handleSizeChange(val){
            this.pagesize = val
            this.getlist()
        },
        getlist(){
            let parameter = this.buildParameters()
            backendList(parameter).then(res=>{
                this.tableData = res.content
                this.numberOfElements = res.totalElements
            })
        },
        buildParameters(){
            var limit=this.pagesize;
            var offset = (this.currentPage-1)*this.pagesize;
            var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
            var parameter = createParameter().Limit(limit).Offset(offset).Build();
            if(query != '%'){
                parameter = createParameter('name',query,"LIKE").Build(parameter);
            }
            parameter = createParameter().Build(parameter)
            if(this.dateValue){
                if(this.dateValue !='' && this.dateValue.length != 0){
                    parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                    And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                    Build(parameter);
                }
            }
            // parameter.sortObject.field = this.field
            // parameter.sortObject.orderDirection = this.orderDirection
            return parameter;
        },
        dateFormat(row, column, cellValue, index){
            return moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
        stopService(){
			this.$confirm(`确定要停止?`,'提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(()=>{
				stopbackendService(this.multipleSelection).then(res=>{
					this.$message({
						type: 'success',
						message: '已停止!'
					});
					this.getlist()
            	})
			})
        },
        startService(){
			this.$confirm(`确定要启动?`,'提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(()=>{
				startbackendService(this.multipleSelection).then(res=>{
					this.$message({
						type: 'success',
						message: '启动成功!'
					});
					this.getlist()
            	})
			})
            
        },
        delService(){
			this.$confirm(`确定要删除?`,'提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(()=>{
				delbackendService(this.multipleSelection).then(res=>{
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.getlist()
            	})
			})
		},
		tableRowClassName({row, rowIndex}) {
			if (row.enabled === 0) {
			return 'warning';
			} else if (row.enabled === 1) {
			return 'success';
			}
			return '';
		}

    },
    mounted(){
        this.getlist()
    }
}
</script>
<style >
    .btn-right {
        margin-left: 20px;
    }
	.rf-swap .warning{
		background: rgb(216, 214, 210);
	}
	.rf-swap .success {
		background: #1f6753;
	}
</style>