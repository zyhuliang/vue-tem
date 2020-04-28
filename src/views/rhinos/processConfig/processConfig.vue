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
			<el-dropdown class="sel_down btn-right"  @command="handleCommand" trigger="click" name="operation-dropdown">
							<span class="el-dropdown-link">
								<el-button type="info" class="dropdown-toggle" toggle="dropdown" name="dropdown-toggle"><i class="icon iconfont icon-ir-triangle-down"></i>操作</el-button>
							</span>
								<el-dropdown-menu slot="dropdown" >
									<el-dropdown-item   command="Import" uib-tooltip="导入" name="Import"><i class="icon iconfont icon-ir-upload" name="Import"></i>&nbsp;导入</el-dropdown-item>
									<el-dropdown-item  command="Export" uib-tooltip="导出" name="Export"><i class="icon iconfont icon-ir-download" name="Export"></i>&nbsp;导出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
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
					:loading = "loading"
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
						v-if="routeParam !=='step define'"
						key="name"
						prop="className"
						label="完整类名"
						min-width="200"
						sortable="custom"
						align="center">
				</el-table-column>
				<el-table-column
				        v-if="routeParam =='step define'"
						key="id"
						prop="id"
						label="ID"
						sortable="custom"
						align="center">
				</el-table-column>
				<el-table-column
				        v-if="routeParam =='step define'"
						key="type"
						prop="type"
						label="类型"
						sortable="custom"
						align="center">
				</el-table-column>
				<el-table-column
						v-if="routeParam =='step define'"
						key="Name"
						prop="stepClassName"
						label="完整类名"
						min-width="200"
						sortable="custom"
						align="center">
				</el-table-column>
				<el-table-column
						v-if="type"
						key="typeCustom"
						sortable="custom"
						align="center"
						width="100px"
						label="返回类型">
					<template slot-scope="scope">
						<div> {{scope.row.returnType}}</div>
					</template>
				</el-table-column>
				<el-table-column
						v-if="routeParam !=='step define'"
						key="conter"
						label="类型"
						align="center"
						width="160"
						show-overflow-tooltip>
					<template slot-scope="scope">
						<div v-show="scope.row.processConfigType=='workflow selector'"> 工作流选择器</div>
						<div v-show="scope.row.processConfigType=='dataflow selector'"> 批处理选择器</div>
						<div v-show="scope.row.processConfigType=='dataflow udf'">自定义函数</div>
						<div v-show="scope.row.processConfigType=='filter class'"> 过滤器</div>
						<div v-show="scope.row.processConfigType=='jdbc driver'"> 数据库驱动</div>
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
		<el-dialog
			title="数据导入"
			:visible.sync="dialogVisibleImport"
			class="el-body-padding">
			 <el-upload
                        id="bm-rhinos-processconfig-add-upload"
                        class="upload-demo"
                        action="api/processconfigs/upload"
                        :headers="{'X-AUTH-TOKEN':xToken}"
						:show-file-list ="filelistStatus"
                        :on-change="handleChange"
                        :on-success="fileSucceed"
                        :on-error="fileError">
                    <el-button id="bm-rhinos-processconfig-add-upload-btn" size="small" type="primary">数据导入</el-button>
                </el-upload>
			<div class="el-row" style=" padding-top: 20px;">
					<div style=" padding-bottom: 20px;">
						<el-table :data="file.cst" v-if="file.cst.length>0" id="bm-rh-resourceMan-flowTable">
							<el-table-column  label="自定义step" prop="name" >
							</el-table-column>
						</el-table>
					</div>
					<div style=" padding-bottom: 20px;">
						<el-table :data="file.jif" v-if="file.jif.length>0" id="bm-rh-resourceMan-schemaTable">
							<el-table-column  label="jif" prop="name" >
							</el-table-column>
						</el-table>
					</div>
					<div style=" padding-bottom: 20px;">
						<el-table :data="file.pcf" v-if="file.pcf.length>0" id="bm-rh-resourceMan-flowTable">
							<el-table-column  label="pcf" prop="name" >
							</el-table-column>
						</el-table>
					</div>
			</div>
			<el-checkbox
			class="top20"
					v-model="overWrite">
				是否要覆盖
			</el-checkbox>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleImport = false">取 消</el-button>
				<el-button v-if="sureStatus" type="primary" @click="importSteps()">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
			title="数据导出"
			:visible.sync="dialogVisibleExport"
			class="el-body-padding">
			<div v-if="this.tbIdsExp.length>0">
				<p> 确定要导出中选中的{{this.tbIdsExp.length}}条数据?</p>
				<el-checkbox-group >
					<el-checkbox class="top20"
							v-if="!(this.tbIdsExp.length>0)"
							v-model="exportStatus" checked :disabled="disabled">
						全部导出
					</el-checkbox>
				</el-checkbox-group>
			</div>
			<el-collapse v-model="outFileName" v-if="!(this.tbIdsExp.length>0)">
				<el-collapse-item title="选择导出配置项" name="1">
					<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
					<div style="margin: 15px 0;"></div>
					<el-checkbox-group v-model="checkedPam" @change="handleCheckedParameterChange">
						<el-checkbox v-for="val in configureParameter" :label="val" :key="val">{{val}}</el-checkbox>
					</el-checkbox-group>
				</el-collapse-item>
			</el-collapse>
			
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleExport = false">取 消</el-button>
				<el-button type="primary" @click="exportSteps()">确 定</el-button>
			</span>
		</el-dialog>
	</section>
</template>
<script>
    import {confList ,delConf,defineList,delDefine,importDefine,exportDefine} from '@api';
    import {createParameter} from '@function/queryParameter.js';
    export default {
        data() {
            return {
                createUserUrl:"/user/add",
                table:[],
                dateValue: '',
                //show:false,
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
				dialogVisibleImport: false,
				dialogVisibleExport: false,
				xToken:sessionStorage['x-auth-token'],
				fileList:[],
				importList:[],
				exportStatus:false,
				tbIdsLen:'',
				tbIdsExp: [],
				overWrite: false,
				file:{
					cst:[],
					jif:[],
					pcf:[]
				},
				isIndeterminate:true,
				checkAll:false,
				checkedPam:[],
				configureParameter:['step define','jdbc driver','filter class','dataflow udf','dataflow selector','workflow selector'],
				fileTypes:[],
				disabled: true,
				checked:false,
				sureStatus:false,
				outFileName:['1'],
				filelistStatus: true
            }
        },
        methods: {
			handleCommand(val){
				let _this = this
				if(val=="Import"){
					_this.sureStatus = false
					_this.dialogVisibleImport = true
				}
				if(val == "Export"){
					_this.dialogVisibleExport = true
				}
			},
			handleChange(file, fileList) {
                if(fileList.length >=2){
                    fileList.splice(0,1)
                }
			},
			fileSucceed(response, file, fileList) {
                this.$message({
                    message: "上传成功",
                    type: 'success',
                    duration: 1500
				});
				this.sureStatus = true
				this.importList = response
				this.file.cst = response.cst
				this.file.jars = response.jars
				this.file.jif = response.jif
				if(response.pcf){
					this.file.pcf = response.pcf
				}
			},
			fileError(err, file, fileList) {
                if(err.message == "jar not match!"){
                    this.$message({
                        message: "选择的类型和上传的文件不匹配",
                        type: 'error',
                        duration: 1500
                    });
                }
			},
			importSteps(){
				var _this = this
				let parameter = {
					
					jif:_this.filterUpload(_this.importList.jif,'id'),
					jars:_this.filterUploadJars(_this.importList.jars),
					uploadDir:_this.importList.uploadDir,
					overWrite:_this.overWrite
				}
				if(_this.importList.pcf){
					parameter.pcf = _this.filterUpload(_this.importList.pcf,'id')
				}
				if(_this.importList.cst){
					parameter.cst = _this.filterUpload(_this.importList.cst,'id')
				}
				importDefine(parameter).then(data =>{
					_this.dialogVisibleImport = false
					parameter=_this.buildParameters(_this.pagesize, _this.currentPage, _this.startTime, _this.endTime, _this.searchInput);
					_this.listTable(parameter);
					_this.file = {
						cst:[],
						jif:[],
						pcf:[]
					}
				}, err => {
					this.$message({
						message: err.response.message,
						type: 'error',
						duration: 1500
					});
				})
			},
			exportSteps(){
				var _this = this
				let parameter = ''
				parameter = "&ids="+this.tbIdsExp.toString()
				//this.routeParam
				if(this.tbIdsExp.length>0){
					this.fileTypes[0] = this.routeParam
				}else{
					this.exportStatus = true
					this.fileTypes = this.checkedPam
				}
				exportDefine(this.exportStatus,parameter,this.fileTypes)
				this.dialogVisibleExport = false
				this.exportStatus = false
			},
			filterUpload(arr,id){
				let path = []
				arr.forEach(item =>{
					path.push(item.id)
				})
				return path
			},
			filterUploadJars(arr){
				let path = []
				arr.forEach(item =>{
					path.push(item.path)
				})
				return path
			},
			handleCheckAllChange(val){
				this.checkedPam = val ? this.configureParameter : [];
        		this.isIndeterminate = false;
			},
			handleCheckedParameterChange(value){
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.configureParameter.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.configureParameter.length;
			},
			localStorageParameter(){
                localStorage.setItem("parameter",JSON.stringify(this.parameter));
            },
            create() {
                this.$router.push({ path: `/processconfig/new/${this.routeParam.replace(' ','-')}` });
            },
            handledateValue(val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleSizeChange(size) {
				console.log(size)
                this.pagesize = size;
				// var parameter = this.buildParameters()
				this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
				this.parameter.sortObject.field = this.field
				this.parameter.sortObject.orderDirection = this.orderDirection
				this.listTable(this.parameter);
				this.localStorageParameter()
            },
            handleCurrentChange(currentPage){
				console.log(currentPage)
                this.currentPage = currentPage;
			   //  var parameter = this.buildParameters()
			   	this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput)
				this.parameter.sortObject.field = this.field
				this.parameter.sortObject.orderDirection = this.orderDirection
				this.listTable(this.parameter);
				this.localStorageParameter()
            },
            handleSelectionChange(val) {
				this.multipleSelection = val;
				this.tbIdsExp = []
				//循环选中项，获取选中id
					for(var i = 0; i< this.multipleSelection.length; i++){
                        this.tbIdsExp.push(this.multipleSelection[i]['id']);
					}
            },
            // table list
            listTable(parameter){
				this.loading = true;
				if(
					this.$route.fullPath=='/processconfig/step-define'
				){
					for(var i=0; i<parameter.fieldList.length;i++){
						if((parameter.fieldList)[i].fieldName == 'processConfigType'){
							parameter.fieldList.splice(i,1)
							i--
						}
					}
					defineList(parameter).then(data => {
						this.table ={}
						this.loading = false;
						this.table= data;
					}, err => {
						this.$message({
							message: err.response.message,
							type: 'error',
							duration: 1500
						});
					})
				}else {
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
				}
                
            },
            //查询
            searchTable(){
                var parameter = this.buildParameters()
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup() {
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
            delTable() {
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
					if(
					this.$route.fullPath=='/processconfig/step-define'
					){
						delDefine(tbIds).then(data => {
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
					}else {
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
					}
                }).catch(() => {

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
			getOrder(column) {
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
			 this.routeParam = this.$route.path.substr(15,this.$route.path.length).replace('-',' ')
			 sessionStorage.setItem('processconfigType',this.routeParam)
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
				sessionStorage.setItem('processconfigType',this.routeParam)
			},
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
.top20 {
	margin-top: 20px;
	margin-bottom: 20px;
}
</style>
