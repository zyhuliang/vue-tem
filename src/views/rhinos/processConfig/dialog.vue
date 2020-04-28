<template>
    <div class="dialog">
        <el-dialog
			title="注册"
			:visible.sync="jarData.dialogVisibleExport"
			class="el-body-padding">

            <el-table
					id="bm-rhinos-processconfig-list-table"
					:data="tableData"
					tooltip-effect="dark"
					v-loading = "loading"
                     @selection-change="setSelection"
					style="width: 100%"  height="calc(100vh - 475px)" >
				<el-table-column
						type="selection"
						width="45">
				</el-table-column>
				<el-table-column
						label="名称"
						prop="name"
						sortable="custom"
						>
				</el-table-column>
				<el-table-column
						key="id"
						prop="id"
						label="ID"
						sortable="custom"
						align="center">
				</el-table-column>
				<el-table-column
						prop="version"
						label="版本"
						sortable="custom"
						align="center">
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
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        :current-page="currentPage"
                        :page-size="pagesize"
                         :page-sizes="[8, 16, 24, 32]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalElements">
                </el-pagination>
			<span slot="footer" class="dialog-footer">
				<el-button @click="jarData.dialogVisibleExport = false">取 消</el-button>
				<el-button type="primary" @click="subJar()">确 定</el-button>
			</span>
		</el-dialog>
    </div>
     
</template>
<script>
import {queryObject, createParameter} from '@components/function/queryParameter.js';
import {externalQuery, getJar} from '@api'
export default {
    props:['jarData'],
    components:{},
    watch:{
        jarData:{
            handler(val){
                if(val.dialogVisibleExport == true){
                    this.getexternalQuery()
                }
            },
            deep: true
        }
    },
    data(){
        return {
            // jarData:{
            //     dialogVisibleExport: false,
            //     setSelection: []
            // }
            tableData :[],
            currentPage: 1,
            pagesize: 8,
            loading: false,
            tablelength:'',
            rows: {},
            parameter:{},
            totalElements:10
        }
    },
    methods:{
       getexternalQuery(){
            this.tableData = []
            this.dialogVisibleExport = true
            this.getList()
            
       },
       //获取列表
       getList(){
           this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage))
           this.loading = true
            externalQuery(this.parameter).then(res=>{
                this.loading = false
                this.tableData = res.content
                this.totalElements = res.totalElements
            })
       },
       //选择列表
        setSelection(val){
            this.rows = val[0]
        },
        subJar(){
            this.$emit('changeRowData',this.rows)
        },
        handleSizeChange: function (size) {
                this.pagesize = size;
                this.getList()
        },
        handleCurrentChange: function(currentPage){
            this.currentPage = currentPage;
            this.getList()
        },
        buildParameters(){
            var limit=this.pagesize;
            var offset = (this.currentPage-1)*this.pagesize;
            var parameter = createParameter().Limit(limit).Offset(offset).Build();
            return parameter;
        }
    },
    mounted(){

    }
}
</script>
<style lang="scss">
  .dialog{
      .el-select{
            position: relative;
            font-size: 14px;
            display: inline-block;
            width: 100px !important;
        }
        .el-form--label-top .el-form-item__label{
            min-width: normal !important;
        }
        .el-upload-list{
            min-width: normal !important;
        }
        .el-input.is-disabled .el-input__inner{
            min-width: normal !important;
        }
        .name-btn{
            width: 213px;
        }
        .el-input__inner{
            min-width: 0px !important;
        }
        .el-pagination .el-select .el-input {
            width: 100px !important;
            margin: 0 5px !important;
        }
  }
</style>