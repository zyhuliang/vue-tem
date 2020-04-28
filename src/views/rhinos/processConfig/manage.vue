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
				<el-button type="info" id="bm-rhinos-processconfig-list-del" class="delBut" @click="delTable" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-directory-delete"></i>&nbsp;删除</el-button>
			</div>
			<el-dropdown split-button class="commend" type="primary" @command="handleCommand">
				集  群
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item   command="Import" uib-tooltip="导入" name="Import"><i class="icon iconfont icon-ir-upload" name="Import"></i>&nbsp;上载</el-dropdown-item>
					<el-dropdown-item  command="Delete" uib-tooltip="导出" name="Delete"><i class="icon iconfont icon-ir-download" name="Export"></i>&nbsp;卸载</el-dropdown-item>
				</el-dropdown-menu>
				</el-dropdown>
			<el-form :label-position="labelPosition" label-width="200px" class="upload">
				<el-upload
                        id="bm-rhinos-processconfig-add-upload"
                        class="upload-demo"
						:show-file-list="false"
                        :action="uploadUrl()"
                        :headers="{'X-AUTH-TOKEN':xToken}"
                        :on-change="handleChange"
                        :on-success="fileSucceed"
                        :on-error="fileError"
                        :file-list="fileList">
                    <el-button id="bm-rhinos-processconfig-add-upload-btn" size="small" type="primary">点击上传</el-button>
                </el-upload>
			 </el-form>
		</el-row>
		<el-row class="rf-swap">
			<el-table
					id="bm-rhinos-processconfig-list-table"
					:data="table"
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
						prop="creator"
						label="创建人"
						align="center"
						sortable="custom">
				</el-table-column>
				<el-table-column
						prop="createTime"
						label="创建时间"
						sortable="custom"
						align="center"
						:formatter="dateFormat"
						show-overflow-tooltip>
				</el-table-column>
				<el-table-column
						prop="lastModifier"
						label="修改人"
						align="center"
						sortable="custom">
				</el-table-column>
				<el-table-column
						prop="lastModifiedTime"
						label="修改时间"
						sortable="custom"
						align="center"
						:formatter="dateFormat"
						show-overflow-tooltip>
				</el-table-column>
				<el-table-column
						prop="clusters"
						label="Clusters"
						sortable="custom"
						align="center">
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
		<el-dialog
			:title="colonyTitle"
			:visible.sync="dialogVisibleExport"
			class="el-body-padding">
			<el-form :model="form">
				<el-col :span="24">
					<el-divider content-position="left"></el-divider>
					<el-form-item label="clusterName" :label-width="formLabelWidth">
					<el-select v-model="clusterId" placeholder="请选择活动区域">
						<el-option
						:label="item.name"
						:value="item.name"
						v-for="(item, index) in selectOption"
						:key="index"
						></el-option>
					</el-select>
					</el-form-item>
				</el-col>
      			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleExport = false">取 消</el-button>
				<el-button type="primary" @click="exportSteps()">确 定</el-button>
			</span>
		</el-dialog>
	</section>
</template>
<script>
	import {externalQuery,removeexternal,registerExternal,DelregisterExternal} from '@api';
	import {clusterAll} from '@/api/cluster/index.js'
    import {createParameter} from '@function/queryParameter.js';
    export default {
        data() {
            return {
				table:[],
				searchInput:'',
				dateValue:'',
				multipleSelection:[],
				currentPage: 1,
                pagesize: 8,
				loading: false,
				xToken:sessionStorage['x-auth-token'],
				fileList:[],
				labelPosition: 'top',
				dialogVisibleExport:false,
				selectOption:[],
				form: {
					name: "",
					livyUrl: ""
				},
				formLabelWidth: "120px",
				parentItem:{},
				clusterId:'',
				ids:[],
				colonyTitle:'上载',
				numberOfElements:8
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
			//注册集群
			create(){
				this.dialogVisibleExport = true
						
				// {"err":"Name Duplicated","detailMsg":"org.springframework.dao.DuplicateKeyException: \n### Error updating database.  Cause: com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException: Duplicate entry 'mysql-connector-java-5.1.38.jar' for key 'UK27nqjc3o80e2awk79xvm9tq5d'\n### The error may exist in com/merce/woven/data/mybatis/mapper/core/JarInfoEntityMapper.java (best guess)\n### The error may involve com.merce.woven.data.mybatis.mapper.core.JarInfoEntityMapper.insertSelective-Inline\n### The error occurred while setting parameters\n### SQL: INSERT INTO merce_jar_package_info  ( id,name,creator,create_time,last_modifier,last_modified_time,expired_time,owner,version,module_version,enabled,tenant_id,jar_file ) VALUES( ?,?,?,?,?,?,?,?,?,?,?,?,? )\n### Cause: com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException: Duplicate entry 'mysql-connector-java-5.1.38.jar' for key 'UK27nqjc3o80e2awk79xvm9tq5d'\n; Duplicate entry 'mysql-connector-java-5.1.38.jar' for key 'UK27nqjc3o80e2awk79xvm9tq5d'; nested exception is com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException: Duplicate entry 'mysql-connector-java-5.1.38.jar' for key 'UK27nqjc3o80e2awk79xvm9tq5d'"}
				try{   
					clusterAll().then(res=>{
							this.selectOption = res.data
						}, err => {
							this.$message({
								message: err.response.err,
								type: 'error',
								duration: 1500
							});
						}).catch(error=>{
							console.log(err)
						})
					}
				catch(err){
					console.log(err)
					 this.$message.error(err.response.data.detailMsg);
				}
				// this.dialogVisibleExport = true
				// clusterAll().then(res=>{
				// 	this.selectOption = res.data
				// }).catch( (err) => {
				// 	    console.log(err)
                //         this.$message.error(err.response.data.detailMsg);
                //     })
			},
			//删除列表
			delTable(){
				this.ids = []
				this.multipleSelection.forEach(item=>{
					this.ids.push(item.id.toString())
				})
				removeexternal(this.ids).then(res=>{
					this.getlist()
				})
			},
			setSelection (val) {
				this.multipleSelection = val
			},
			exportSteps(){
				// var addOrEditDataset = this.isNew ? postDataset(entity) : putDataset(entity.id, entity);
				this.ids = []
				this.multipleSelection.forEach(item=>{
					this.ids.push(item.id.toString())
				})
				let externalFn = this.colonyTitle == '上载'?registerExternal(this.clusterId,this.ids):DelregisterExternal(this.clusterId,this.ids)
				externalFn.then(res=>{
					this.dialogVisibleExport = false
				},err=>{
					this.$message({
						message:this.colonyTitle + '失败',
						type:'error'
					})
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
			uploadUrl () {
                this.uploadFile = "/api/external/uploadjar"
                return this.uploadFile
			},
			handleChange(file, fileList) {
                // if(fileList.length >=2){
                //     fileList.splice(0,1)
                // }
			},
			fileSucceed:function (response, file, fileList) {
                this.$message({
                    message: "上传成功",
                    type: 'success',
                    duration: 1500
				});
				let parameter = this.buildParameters()
				externalQuery(parameter).then(res=>{
					this.table = res.content
				})
			},
			fileError:function (err, file, fileList) {
				// console.log(err)
				// let str = (err.toString()).match(/(?<="err":).+(?=,)/)
				// console.log(str[0])
				// let res = str.match(/(?<=")[A-Z ]+(?=")/)
				// console.log('res',res)
				this.$message({
						message: 'Name Duplicated',
						type: 'error',
						duration: 1500
					});
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
			//获取列表
			getlist(){
				let parameter = this.buildParameters()
				externalQuery(parameter).then(res=>{
					this.table = res.content
					this.numberOfElements = res.totalElements
				})
			},
			handleCommand(val){
				//Import Delete
				if(val=='Import'){
					this.colonyTitle = '上载'
				}else {
					this.colonyTitle = "卸载"
				}
				this.create()
			}
			
		},
        mounted() {
			this.getlist()
        },
        watch:{
        },
    };

</script>

<style lang="scss" scoped>
	.el-body-padding{
		width: 50%;
		margin-top:5vh;
		margin-left: 25vw;
	}
	.upload{
		width: 80px;
		height: 35px;
		float: right;
	}
	.commend {
		border-radius:5px;
	    background: #3895ff;
    	padding: 2px;
		width: 90px;
		height: 35px;
		margin-left:20px;
		float: right;
	}
	.commend .el-button {
		height:40px !important;
	}
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
				margin: 0px 30px 0px 8px;
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
	.btn-right{
		margin-left: 30px;
	}
	
.el-table--scrollable-x .el-table__body-wrapper {
     overflow-x: hidden; 
}
</style>
