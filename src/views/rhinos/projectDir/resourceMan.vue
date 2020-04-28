<template>
	<div id="bm-rh-resourceMan">

		<section class="design-content">
			<!-- 引入左侧二级菜单组件 -->
			<div class="navProduct" :style="{display: collapsed ? 'none' : 'inherit'}">
				<second-nav></second-nav>
			</div>
			<!--schema和dataset的右侧列表页内容-->
			<div v-if="!isflow">
				<!-- 内容区 -->
				<router-view v-if="isShow"></router-view>
				<div class="dn-content" :style="{padding: collapsed ? '0px 0px 0px 0px' : '0px 0px 0px 250px'}">
					<div class="dn-data" v-show="beData && !isShow">
						<el-row class="proBtnClass">
							<div class="flexibleDes" @click.prevent="collapse">
								<i :class="collapsed?'icon iconfont icon-ir-navRight':'icon iconfont icon-ir-navLeft'"></i>
							</div>
							<div class="btn-left">
								<search-table-data ref="refSearchTable" @searchKey = "searchListTable" :pagesize = "pagesize" :startTime="startTime" :endTime="endTime"></search-table-data>
								<search-date-data  ref="refSearchDate" @searchDate="searchListTable" :pagesize = "pagesize" :searchInput="searchInput"></search-date-data>
							</div>
							<div class="btn-right">
								<!--新建不同类型的资源-->
								<el-dropdown class="sel_down" trigger="click" @command="addOrEdit" >
									<span class="el-dropdown-link">
										<el-button type="info" class="dropdown-toggle" toggle="dropdown"><i class="icon iconfont icon-ir-triangle-down"></i>新建</el-button>
									</span>
									<el-dropdown-menu slot="dropdown" >
										<el-dropdown-item v-if="resType.toLowerCase().indexOf('schema')> -1"  command="schemaProject" name="schemaProject"><i class="icon iconfont icon-ir-text-add"></i>&nbsp;schema</el-dropdown-item>
										<el-dropdown-item v-if="resType.toLowerCase().indexOf('dataset')> -1" command="DBdatasetProject" name="DBdatasetProject"><i class="icon iconfont icon-ir-text-add"></i>&nbsp;DB</el-dropdown-item>
										<el-dropdown-item v-if="resType.toLowerCase().indexOf('dataset')> -1" command="datasetProject" name="datasetProject"><i class="icon iconfont icon-ir-text-add"></i>&nbsp;存储</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
								<el-button type="info"  @click="delTable" :disabled="multipleSelection.length == 0" name="delBtn"><i class="icon iconfont icon-ir-directory-delete"></i>删除</el-button>
								<el-button type="info" v-if="resType == 'schema'"  @click="schemaCopy('schemaProject', 'copy')" :disabled="multipleSelection.length !== 1" name="copyBtn"><i class="fa fa-clone"></i>&nbsp;复制</el-button>
							</div>
						</el-row>
						<!--内容显示列表页面-->
						<div class="rf-swap">
							<el-table
									:data="table.content"
									tooltip-effect="dark"
									id="bm-rh-resourceMan-table"
									style="width: 100%"
									v-loading="loading"
									@sort-change="getOrder"
									height="calc(100vh - 175px)"
									@selection-change="handleSelectionChange">
								<el-table-column
										type="selection"
										width="40">
								</el-table-column>
								<el-table-column
										prop="id"
										label="主键"
										v-if="show">
								</el-table-column>
								<el-table-column
										prop="name"
										label="名称"
										min-width="200"
										>
									<template slot-scope="scope">
										<span class="editName" @click="handleEdit(scope.row.id, scope.$index, scope.row,false)">{{scope.row.name}}</span>
									</template>
								</el-table-column>
								<el-table-column
										v-if="showExpiredPeriod"
										label="schema"
										key= '2'
								>
									<template slot-scope="scope">
										<p v-if="scope.row.schema">
											<span class="editName" @click="showSchemaTable(scope.row)" >{{scope.row.schema.name}}</span>
										</p>
									</template>
								</el-table-column>
								<el-table-column
										v-if="showType"
										prop="type"
										label="类型"
										>
								</el-table-column>
								<el-table-column
										v-if="showStorage"
										prop="storage"
										label="类型"
										>
								</el-table-column>
								<!--<el-table-column-->
										<!--prop="version"-->
										<!--label="版本"-->
										<!---->
										<!--show-overflow-tooltip>-->
								<!--</el-table-column>-->
								<el-table-column
										prop="createTime"
										label="创建时间"
										width="180"
										:formatter="dateFormat">
								</el-table-column>
								<el-table-column
										prop="creator"
										label="创建人"
										min-width="120"
										>
								</el-table-column>
								<el-table-column
										prop="lastModifier"
										label="修改人"
										min-width="120"
										>
								</el-table-column>
								<el-table-column
										prop="lastModifiedTime"
										label="修改时间"
										width="180"
										sortable="custom"
										:formatter="dateFormat">
								</el-table-column>
								<el-table-column
										v-if="showExpiredPeriod"
										prop="expiredPeriod"
										label="过期时间"
										min-width="140"
										:formatter="expiredPeriodFormat">
								</el-table-column>

								<el-table-column width="80" key='1' v-if="showPreview" label="操作">
									<template slot-scope="scope">
										<el-button
												type="primary"
												size="mini"
												@click="dataPreview(scope.row)"
										>
											预览
										</el-button>
									</template>
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

					</div>
					<!--数据预览 dialog-->
					<preview-data-set ref="dataset"></preview-data-set>
				</div>
			</div>
			<!-- flow时的右侧列表页内容 -->
			<div class="dn-content" v-if="isflow" :style="{padding: collapsed ? '0px 0px 0px 0px' : '0px 0px 0px 250px'}">
				<!-- 列表 -->
				<div class="dn-data" v-if="beData">
					<el-row class="proBtnClass">
						<div class="flexibleDes" @click.prevent="collapse">
							<i :class="collapsed?'icon iconfont icon-ir-navRight':'icon iconfont icon-ir-navLeft'"></i>
						</div>
						<div class="btn-left">
							<div class="design-flowtype">
								<h4>流程类型</h4>
								<el-select v-model="flowType" placeholder="all" @change="handleTypeValue">
									<el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:name="item.value"
											:value="item.value">
									</el-option>
								</el-select>
							</div>
							<search-table-data ref="refSearchTable" @searchKey = "searchListTable" :pagesize = "pagesize" :startTime="startTime" :endTime="endTime"></search-table-data>
							<search-date-data  ref="refSearchDate" @searchDate="searchListTable" :pagesize = "pagesize" :searchInput="searchInput"></search-date-data>
						</div>
						<div class="btn-right">
							<!--添加一个通过json临时创建flow的按钮-->
							<el-button type="info" @click="addFlowBtn"><i class="icon iconfont icon-ir-add iconStyle" name="addFlowBtn"></i>新建</el-button>
							<el-button type="info" @click="deleteFlow" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-directory-delete iconStyle" name="deleteFlow"></i>删除</el-button>

							<!--复制 重命名 移动 制作 导入 导出 下拉面板-->
							<el-dropdown class="sel_down" trigger="click" @command="otherOperationsFlow" name="operation-dropdown">
							<span class="el-dropdown-link">
								<el-button type="info" class="dropdown-toggle" toggle="dropdown" name="dropdown-toggle"><i class="icon iconfont icon-ir-triangle-down"></i>操作</el-button>
							</span>
								<el-dropdown-menu slot="dropdown" >
									<el-dropdown-item v-if ="multipleSelection.length == 1" command="flowRename" uib-tooltip="重命名" name="flowRename"><i class="fa fa-edit"></i>&nbsp;重命名</el-dropdown-item>
									<el-dropdown-item v-if ="multipleSelection.length == 1" command="flowCopy" uib-tooltip="复制" name="flowCopy"><i class="fa fa-clone"></i>&nbsp;复制</el-dropdown-item>
									<!-- <el-dropdown-item v-if="multipleSelection && multipleSelection.length != 1 " command="flowJson" uib-tooltip="制作Json" name="flowJson"><i class="fa fa-tasks"></i>&nbsp;制作Json</el-dropdown-item> -->
									<!-- <el-dropdown-item v-if="multipleSelection.length == 1" command="flowJson" uib-tooltip="编辑Json" ><i class="fa fa-tasks" name="editJson"></i>&nbsp;编辑Json</el-dropdown-item> -->
									<el-dropdown-item v-if ="isButtonAbled('flow_import')" command="flowImport" uib-tooltip="流程导入" name="flowImport"><i class="icon iconfont icon-ir-upload" name="flowImport"></i>&nbsp;导入</el-dropdown-item>
									<el-dropdown-item v-if ="isButtonAbled('flow_export')" command="flowExport" uib-tooltip="流程导出" name="flowExport"><i class="icon iconfont icon-ir-download" name="flowExport"></i>&nbsp;导出</el-dropdown-item>

								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</el-row>

					<el-row class="rf-swap">
							<el-table
									:data="table.content"
									v-loading = "loading"
									tooltip-effect="dark"
									id="bm-rh-resourceMan-table2"
									@selection-change="handleSelectionChange"
									@sort-change="getOrder"
									style="width: 100%;"
									height="calc(100vh - 175px)">
								<el-table-column
										type="selection"
										width="45">
								</el-table-column>
								<el-table-column
										prop="name"
										label="名称"
										sortable="custom"
										min-width="200">
									<template slot-scope="scope">
										<span class="editName" @click="handleEdit(scope.row.id, scope.$index, scope.row,true)">{{scope.row.name}}</span>
									</template>
								</el-table-column>
								<el-table-column
										prop="flowType"
										label="类型"
										sortable="custom"
										width="120">
								</el-table-column>
								<!--<el-table-column-->
										<!--prop="tenant"-->
										<!--label="租户"-->
										<!--&gt;-->
									<!--<template slot-scope="scope">-->
										<!--<span >{{scope.row.tenant.name}}</span>-->
									<!--</template>-->
								<!--</el-table-column>-->
								<el-table-column
										prop="creator"
										label="创建人"
										sortable="custom"
										min-width="120">
								</el-table-column>
								<el-table-column
										prop="version"
										label="版本"
										sortable="custom"
										width="80"
										show-overflow-tooltip>
								</el-table-column>
								<el-table-column
										prop="createTime"
										label="创建时间"
										sortable="custom"
										:formatter="dateFormat"
										min-width="140">
								</el-table-column>
								<el-table-column
										prop="lastModifier"
										label="修改人"
										sortable="custom"
										min-width="120">
								</el-table-column>
								<el-table-column
										prop="lastModifiedTime"
										label="修改时间"
										sortable="custom"
										:formatter="dateFormat"
										min-width="140">
								</el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="计划">
                                    <template slot-scope="scope">
                                        <span class="editName" @click="handleEditplan(scope.row.id, scope.$index, scope.row,true)">计划</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="执行历史">
                                    <template slot-scope="scope">
                                        <span class="editName" @click="handleEdithis(scope.row.id, scope.row.flowType,scope.$index, scope.row,true)">执行历史</span>
                                    </template>
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
					<router-view class="desContent"></router-view>
				</div>
			</div>
		</section>

		<!--新建流程 弹出框-->
		<el-dialog v-dialog-drag
				title="新建流程"
				:visible.sync="dialogAddFlowVisible"
				width="30%"
				class="el-body-padding">
			<el-form id="bm-pro-addflow-form">
				<el-form-item label="名称:">
					<el-input type="text" v-model="addFlowName" auto-complete="off" name="addFlowName"></el-input>
				</el-form-item>
				<el-form-item label="流程类型:">
					<el-select style="width: 100%;" v-model="addFlowType" placeholder="请选择流程类型">
						<el-option label="dataflow" value="dataflow" name="dataflow"></el-option>
						<el-option label="workflow" value="workflow" name="workflow"></el-option>
						<el-option label="streamflow" value="streamflow" name="streamflow"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button :disabled="!addFlowName || !addFlowType" type="primary" @click="addFlow" name="addFlow-sure">确定</el-button>
				<el-button @click="dialogAddFlowVisible = false" name="addFlow-cancel">取消</el-button>
		  	</span>
		</el-dialog>
		<!--重命名 弹出框-->
		<el-dialog
				title="重命名流程"
				:visible.sync="dialogRenameVisible"
				width="30%"
				@close="dialogRenameVisible = false"
				class="el-body-padding">
			<el-form id="bm-pro-renameflow-form">
				<el-form-item label="名称:">
					<el-input type="text" v-model="reName" auto-complete="off" name="reName"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
						<el-button :disabled="!reName" type="primary" @click="renameFlow" name="renameFlow-sure">确定</el-button>
						<el-button @click="dialogRenameVisible = false" name="renameFlow-cancel">取消</el-button>
		  			</span>
		</el-dialog>
		<!--流程 复制 弹出框-->
		<el-dialog
				title="复制流程"
				:visible.sync="dialogCopyVisible"
				width="30%"
				@close="dialogCopyVisible = false"
				class="el-body-padding">
			<el-form id="bm-pro-copeflow-form">
				<el-form-item label="名称:">
					<el-input type="text" v-model="reName" auto-complete="off" name="name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
						<el-button :disabled="!reName" type="primary" @click="copyFlow" name="copyFlow-sure">确定</el-button>
						<el-button @click="dialogCopyVisible = false" name="copyFlow-cancel">取消</el-button>
		  			</span>
		</el-dialog>
		<!--制作flowJson 弹出框-->
		<el-dialog
				title="制作 flowJson"
				:visible.sync="dialogNewFlowJsonVisible"
				class="el-body-padding">
			<el-form id="bm-pro-flowjson-form">
				<el-form-item label="FlowJson">
					<el-input
							auto-complete="off"
							type="textarea"
							:rows="15"
							name="flowJson"
							placeholder="请输入flowJson"
							v-model="form">
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveFlow" name="saveFlow-sure">确定</el-button>
				<el-button @click="dialogNewFlowJsonVisible = false" name="saveFlow-cancel">取消</el-button>
			</span>
		</el-dialog>
		<!--流程导出 弹出框-->
		<el-dialog
				title="流程导出"
				:visible.sync="dialogExportFlowVisible"
				class="el-body-padding">
			<el-form id="bm-pro-exportflow-form">
				<el-form-item>
					<p v-if="tbIdsLen>0 && tbIdsLen<51"> 确定要导出{{selectedNode.name}}中选中的{{tbIdsLen}}条流程?</p>
					<p v-if="tbIdsLen>50">
						选中流程数目（{{tbIdsLen}}）大于每次最多导出条数（50），数目过多，请选择目录形式导出！
					</p>
					<!--导出目录-->
					<div v-if="tbIdsLen===0" >
						确定要导出目录{{selectedNode.name}}，下所有流程?
					</div>
				</el-form-item>
				<el-form-item>

					<el-checkbox
							auto-complete="off"
							v-model="withDependencies">
						级联导出
					</el-checkbox>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="flowExport" name="flowExport-sure">确定</el-button>
				<el-button @click="dialogExportFlowVisible = false" name="flowExport-cancel">取消</el-button>
	  		</span>
		</el-dialog>
		<!--流程导入 弹出框-->
		<el-dialog
				title="流程导入"
				:visible.sync="dialogImportFlowVisible"
                :close-on-click-modal="false"
				class="el-body-padding importantflow">
			<template>
				<el-form id="bm-pro-importflow-form" name="fileinfo"  method="post" enctype="multipart/form-data" >
					<el-form-item>选择上传的文件</el-form-item>
					<el-upload
							:show-file-list="false"
							action="/api/mis/upload"
							class="upload-demo"
							:headers="{'X-AUTH-TOKEN':xToken}"
							:multiple=true
							:on-success="uploadFile"
							:file-list="fileList">
						<el-button slot="trigger" style="margin-left: 10px;" size="small" type="success" name="browse">浏览</el-button>
						<!--<div slot="tip" class="el-upload__tip">只能上传zip/jar文件</div>-->
					</el-upload>
                    <el-form-item v-if="file.flow.length>0" :label="'flow存放地址'">
                        <el-input placeholder="flow存放位置 (覆盖不需要选择)" name="flow存放位置" :disabled="true" v-model="flowDataPath"
                                class="input-form-width">
                            <el-button slot="append" icon="icon iconfont icon-ir-search"
                                    @click="flowDatalocal('flow_dir')" name="datasetTree"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="file.dataset.length>0" :label="'dataset存放地址'">
                        <el-input placeholder="dataset存放位置 (覆盖不需要选择)" name="dataset存放位置" :disabled="true" v-model="datasetPath"
                                class="input-form-width">
                            <el-button slot="append" icon="icon iconfont icon-ir-search"
                                    @click="flowDatalocal('dataset_dir')" name="datasetTree"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="file.schema.length>0" :label="'schema存放地址'">
                        <el-input placeholder="schema存放位置 (覆盖不需要选择)" name="schema存放位置" :disabled="true" v-model="schemaPath"
                                class="input-form-width">
                            <el-button slot="append" icon="icon iconfont icon-ir-search"
                                    @click="flowDatalocal('schema_dir')" name="datasetTree"></el-button>
                        </el-input>
                    </el-form-item>
					<div v-if="importOk">
						<!--<span style="padding-left: 20px;">{{fileList}}</span>-->
						<div class="el-row" style=" padding-top: 20px;">
							<div style=" padding-bottom: 20px;" v-if="file.flow.length>0">
								<el-table :data="file.flow"  id="bm-rh-resourceMan-flowTable">
									<el-table-column  label="flow" prop="name" >
									</el-table-column>
								</el-table>

							</div>
							<div style=" padding-bottom: 20px;"  v-if="file.dataset.length>0">
								<el-table :data="file.dataset" id="bm-rh-resourceMan-datasetTable">
									<el-table-column  label="dataset" prop="name" >
									</el-table-column>
								</el-table>
							</div>
							<div style=" padding-bottom: 20px;"  v-if="file.schema.length>0">
								<el-table :data="file.schema" id="bm-rh-resourceMan-schemaTable">
									<el-table-column  label="schema" prop="name" >
										<template slot-scope="scope">
											{{scope.row.name}}_v{{scope.row.version}}
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>

						<div v-if="file.flow&&file.flow.length>0"  >
							<span style=" margin-bottom: 20px;">导入信息:</span>
							<span style="padding-left: 20px;margin-bottom: 20px;" v-if="file.flow&&file.flow.length>0">流程: {{file.flow.length}}</span>
							<div class="list-group-item no-border col-sm-12 no-padding top-margin-5" v-if="file.flow&&file.flow.length>0">
								<el-checkbox v-model="file.overWrite" @click="file.overWrite=!file.overWrite">覆盖(如果已经存在, 默认为跳过) </el-checkbox>
								<a ><span></span></a>
							</div>
							<div style=" margin-top: 20px;" class="list-group-item no-border col-sm-12 no-padding top-margin-10" v-if="file.flow&&file.flow.length>0">
								<span style="color: red"><strong> 警告: 导入前请检查数据的正确性, 备份相关数据, 导入操作无法撤销.</strong></span>
							</div>
						</div>
					</div>

				</el-form>
			</template>

			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="flowImport" name="flowImport-sure">确定</el-button>
				<el-button @click="dialogImportFlowVisible = false" name="flowImport-cancel">取消</el-button>
		  	</span>
		</el-dialog>
		<!-- schema fileds dialog-->
		<el-dialog
				:visible.sync="dialogShowSchemaVisible"
				width="50%"
				:close-on-click-modal="false" :modal-append-to-body="false"
				:title="showSchemaName"
		>

			<el-table :data="showSchemaFields" class="datasetPreview" id="bm-rh-resourceMan-datasetPreview">
				<el-table-column
						prop="name"
						label="名称"
						show-overflow-tooltip>
				</el-table-column>
				<el-table-column
						prop="type"
						label="类型"
						show-overflow-tooltip>
				</el-table-column>
			</el-table>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogShowSchemaVisible=false" name="footer-sure">确定</el-button>
				<el-button @click="dialogShowSchemaVisible=false" name="footer-cancel">取消</el-button>
			</div>
		</el-dialog>
        <!-- 数据集路径保存 -->
        <div v-if="dialogDataSetTreeVisible == true" class="nodeDialog">
            <div class="diHeader">
                <h3>{{flowDatatype}} Tree 查询</h3>
                <span @click="dialogDataSetTreeVisible = false" class="el-icon-close"></span>
            </div>
            <div class="diContent">
                <el-form id="bm-schematree1-form" class="elForm" label-width="80px">
                    <flow-tree :flowDatatype="flowDatatype" class="elFormSelect" ref="datasettree"></flow-tree>
                </el-form>
            </div>
            <div slot="footer" class="diFooter">
                <el-button type="primary" @click="submitDataSetTree" name="sure">确定</el-button>
                <el-button @click="dialogDataSetTreeVisible = false" name="cancel">取消</el-button>
            </div>
        </div>
	</div>
</template>

<script>

    import secondNav from './dataTree/secondNav.vue'
    //引入查询组件
    import searchDateData from '@collectorSearch/searchDateData.vue'
    import searchTableData from '@collectorSearch/searchTableData.vue'
    import design from '../flowManage/design.vue'
    //导入树组件
    import dataTree from '@dataSourceInq/dataSourceInqTree.vue'
    import resIn from './dataTree/resNav.js'
    //导入预览组件
    import previewDataSet from '@collector/taskDialog/datasetDialog.vue'
	import moment from "moment"//时间格式化
    import {  exportFlow, importFlowPro,nodeDataSet,listData, listData2,drawSaveData, deleteDatasetProject, addFlow, delFlowProject, deleteSchemaProject,resDirTree } from '../../../api/api'
    import {createParameter} from '@function/queryParameter.js';
    import {deepCopy} from "@function/comFunction";
    import flowTree from '@components/flowTree/flowTree.vue';
    /**
     * 当前时间
     * ------------------------------------------------------------------
     */
    function createRandomTime() {
        return (new Date()).getTime();
    }
    export default {
        props:['rootName'],
        components: {
            secondNav,
            dataTree,
            searchDateData,
            searchTableData,
            previewDataSet,
            flowTree
        },
        data() {
            return {
                isShowFlows: true,
                dateValue: '',
                navId:'',
                projectId:'',
                flowType:'all',
                selectedNode:{},
                options: [{
                    value: 'all',
                    label: '全部类型'
                }, {
                    value: 'dataflow',
                    label: '批处理'
                }, {
                    value: 'workflow',
                    label: '工作流'
                }, {
                    value: 'streamflow',
                    label: '流处理'
                }],
                noData: true,
                beData: false,
                table:[],
                collapsed:false,
                showDesign:true,
                disId: '',
                multipleSelection: [],
                loading: false,
                dialogAddFlowVisible:false,
                dialogRenameVisible:false,
                dialogCopyVisible:false,
                dialogExportFlowVisible: false,
                dialogImportFlowVisible: false,
                dialogNewFlowJsonVisible: false,
                form:{},
                navPname:'',
                addFlowName:'',
                addFlowType:'',
                reName:'',
                isflow:true,
                showType: false,
                showPreview: false,
                showStorage: false,
                showExpiredPeriod:false,
                mlSelVal:{
                    name:'',
                    id:'',
                },
                show:false,
                currentPage:1,
                pagesize:8,
                startTime:'',
                endTime:'',
                searchInput:'',
                isShow:false,
                resType:'dataSource',
                parameter:{},
                withDependencies:false,
                tbIdsLen: "",
                fileList:[],
                isNew:true,
                flowId:"",
                importOk:false,
                file:{
                    flow: [],
                    dataset: [],
                    schema: [],
                    browserEnabled: true,
                    okEnabled: false,
                    f: {},
                    overWrite:false
                },
                tbIdsExp: [],
                xToken:sessionStorage['x-auth-token'],
                orderDirection: 'DESC',
                field: 'lastModifiedTime',
                showSchemaFields: [],
                showSchemaName: '',
                 dialogShowSchemaVisible: false,
                 dialogDataSetTreeVisible:false,
                 flowDataPath:'',
                 datasetPath:'',
                 schemaPath:'',
                 flowResourceId:'',
                 datasetResourceId:'',
                 schemaResourceId:'',
                 flowDatatype: ''
            }
        },
        watch:{
            $route(to,from){

            }
        },
        methods: {
            flowDatalocal(val){
                this.flowDatatype = val
                this.dialogDataSetTreeVisible = true
            },
            submitDataSetTree(){
                this.dialogDataSetTreeVisible = false
                //获取schema的node
                var datasetNode = this.$refs.datasettree.selectedNode;
                var that = this;
                if (datasetNode === '') {
                    that.$message({
                        message: '请选择一个目录！',
                        type: 'error'
                    });
                    return false;
                } else {
                    if( this.flowDatatype =='dataset_dir'){
                        this.datasetPath = datasetNode.path
                        this.datasetResourceId = datasetNode.id
                    } else if ( this.flowDatatype =='flow_dir'){
                        this.flowDataPath = datasetNode.path
                        this.flowResourceId = datasetNode.id
                    } else if ( this.flowDatatype == 'schema_dir'){
                        this.schemaPath = datasetNode.path
                        this.schemaResourceId = datasetNode.id
                    }

                    that.dialogSchemaTreeVisible = false;
                }
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
                this.listTable(this.parameter,this.resType)
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput)
                this.listTable(this.parameter,this.resType)
            },
            //选中某条数据
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
                if(val.length === 0){
                    this.mlSelVal.name = '';
                    this.$emit('thisSelectDateSourceVal',this.mlSelVal.name);
                }else if(val.length === 1){
                    this.$emit('thisSelectDateSourceVal', val[0]);
                }
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
            //导入导出是否显示
            isButtonAbled : function (name) {
                var that = this;
                //flowExport
                if("flow_export" == name) {
                    return that.selectedNode.resType == 'flow';
                }
                //flowImport
                if("flow_import" == name) {
                    return that.selectedNode.resType == 'flow';
                }
            },
            //折叠导航栏
            collapse:function(){
                this.collapsed=!this.collapsed;
            },
            //重命名flow
            renameFlow : function () {
                let _this = this;
                let thisData = {};
                this.multipleSelection.forEach(function (i,index){
                    thisData = deepCopy(i);
                    if(_this.reName == thisData.name){
                        _this.$message({
                            message: '请输入其他名称！',
                            type: 'error'
                        });
                    }else{
                        thisData.name = _this.reName;
                        thisData.lastModifiedTime = createRandomTime();
                        drawSaveData(thisData.id,thisData).then(data => {
                            _this.dialogRenameVisible = false;
                            _this.listTable();
                            _this.$message({
                                message: '恭喜您，修改已成功！',
                                type: 'success'
                            });
                        },error =>{
                            if(error.response.status == "500"){
                                _this.dialogRenameVisible = false;
                                _this.listTable();
                                _this.$message({
                                    message: '恭喜您，修改已成功！',
                                    type: 'success'
                                });
                            }else{
                                _this.$message({
                                    message: error.response.data.detailMsg,
                                    type: 'error'
                                });
                            }
                        })
                    }
                });
            },
            addOrEdit:function (type) {
                // 调用schema的页面
                this.$router.push({name: type ,
                    params: {
                        projectId: this.selectedNode.id,
                        id: this.multipleSelection[0]?this.multipleSelection[0].id:'new',
                        node: this.selectedNode
                    },
                });
				this.projectId = this.selectedNode.id;
				this.isShow = true
            },
            schemaCopy: function (type, isCopy) {
                // 调用schema的页面
                this.$router.push({name: type ,
                    params: {
                        projectId: this.selectedNode.id,
                        id: this.multipleSelection[0]?this.multipleSelection[0].id:'new',
                        node: this.selectedNode
                    },
                    query: {isCopy: isCopy}
                });
                this.projectId = this.selectedNode.id;
                this.isShow = true
            },
            //复制flow
            copyFlow : function () {
                let _this = this;
                let thisData = {};
                this.multipleSelection.forEach(function (i,index){
                    thisData = deepCopy(i);
                    thisData.name = _this.reName;
                    delete thisData.id;
                    thisData.projectEntity = {
                        id:_this.disId
                    }
                    thisData.createTime = createRandomTime();
                    thisData.lastModifiedTime = createRandomTime();
                    addFlow(thisData).then(data => {
                        _this.dialogCopyVisible = false;
                        _this.listTable();
                        _this.$message({
                            message: '恭喜您，复制已成功！',
                            type: 'success'
                        });
                    },error =>{
                        if(error.response.status == "500"){
                            _this.dialogCopyVisible = false;
                            _this.listTable();
                            _this.$message({
                                message: '恭喜您，修改已成功！',
                                type: 'success'
                            });
                        }else{
                            _this.$message({
                                message: '名称在目录中必须是唯一的!',
                                type: 'error'
                            });
                        }
                    });
                });
            },
            //其他操作下拉框的点击事件
            otherOperationsFlow: function (type) {
                if((type).toLowerCase().indexOf('flowimport')>-1){
                    this.dialogImportFlowVisible = true
					//当进入导入页面就要清空之前的数值
                    this.file.flow = [];
                    this.file.schema = [];
                    this.file.dataset = [];
                }else if((type).toLowerCase().indexOf('flowexport')>-1){
                    this.tbIdsExp = [];
                    //循环选中项，获取选中id
					for(var i = 0; i< this.multipleSelection.length; i++){
                        this.tbIdsExp.push(this.multipleSelection[i]['id']);
					}
                    this.tbIdsLen = this.tbIdsExp.length;
                    this.dialogExportFlowVisible = true
                }

                var _this = this;
                //制作json流程事件
                if(type == "flowJson"){
                    if(this.multipleSelection[0]&&this.multipleSelection[0].id && this.multipleSelection.length==1){
                        this.flowId = this.multipleSelection[0].id
                        this.form = this.multipleSelection[0];
                        this.isNew = false;
                    }
                    this.dialogNewFlowJsonVisible = true
                }

                //流程重命名事件
                if(type == "flowRename"){
                    this.dialogRenameVisible = true;
                    this.multipleSelection.forEach(function (i,index){
                        _this.reName = i.name;
                    });
                }

                //流程复制事件
                if(type == "flowCopy"){
                    this.dialogCopyVisible = true;
                    this.multipleSelection.forEach(function (i,index){
                        _this.reName = i.name;
                    });
                }
            },
            //流程导出
            flowExport: function () {
                var that = this;
                //导出流程接口
                var para = ''
                if(that.tbIdsLen > 50){
                    that.$confirm('请重新选择','提示', {
                        type: "error"
                    })
                }else {
                    if(that.tbIdsLen >0 && that.tbIdsLen < 51){
                        para = "&ids="+that.tbIdsExp.toString()
                    }else {
                        para = "&projectId="+that.selectedNode.id
                    }
                    exportFlow(that.withDependencies,para);
                    that.listTable(false,'flow');
                    that.$message({
                        message: '恭喜你，导出已成功！',
                        type: 'success'
                    })
                }
                that.dialogExportFlowVisible = false
            },

            //流程导入
            flowImport: function () {
                var that = this;
//				拼凑成提交要的entity
                that.file.cfd = [];
                that.file.flow.forEach(function (item) {
                    that.file.cfd.push(item.path)
                })

                that.file.csm = [];
                that.file.schema.forEach(function (item) {
                    that.file.csm.push(item.path)
                })

                that.file.cds = [];
                that.file.dataset.forEach(function (item) {
                    that.file.cds.push(item.path)
                })
                that.file.tag = [];
                that.file.processDirId = that.navId
                that.file.uploadDirectory = that.file.uploadDir
                if(that.file.overWrite== true){
                    that.flowResourceId = ''
                    that.datasetResourceId =''
                    that.schemaResourceId = ''
                    that.flowDataPath=''
                    that.datasetPath=''
                    that.schemaPath=''
                }else {
                    // if(this.schemaPath!=''&&this.flowDataPath!= ''&&this.datasetPath!=''){
                    // }else if(this.flowDataPath!= ''&&that.file.dataset.length==0){
                    // }else {
                    //     that.$message({
                    //         message:'请选择flow dataset schema存放位置',
                    //         type:"error"
                    //     })
                    //     return false
                    // }
                    if((this.schemaPath==''||this.flowDataPath==''||this.datasetPath=='')&&that.file.dataset.length !=0){
                        that.$message({
                            message:'请选择flow dataset schema存放位置',
                            type: "error"
                        })
                        return false
                    }else if(this.flowDataPath==''&&that.file.dataset.length ==0){
                        that.$message({
                            message:'请选择flow存放位置',
                            type:'error'
                        })
                        return false
                    }
                }
                importFlowPro(that.navId,{
                        cfd:that.file.cfd,
                        cds:that.file.cds,
                        csm:that.file.csm,
                        tag:that.file.tag,
                        processDirId:that.file.processDirId,
                        uploadDirectory:that.file.uploadDirectory,
                        overWrite:that.file.overWrite,
                        flowResourceId: that.flowResourceId,
                        datasetResourceId:that.datasetResourceId,
                        schemaResourceId:that.schemaResourceId
                    }).then(res=>{
                        that.$message({
                            message:res,
                            type:"success"
                        })
                        that.flowDataPath=''
                        that.datasetPath=''
                        that.schemaPath=''
                        that.dialogImportFlowVisible= false
                    },err=>{
                        that.$message({
                            message:res,
                            type:"error"
                        })
                    })
            },
            uploadFile: function (data) {
                var that = this
                this.$message({
                    message: data.msg,
                    type: 'success'
                })
                that.importOk = true;
                that.file.result = data;
                that.file.flow = data.cfd;
                that.file.dataset = data.cds;
                that.file.schema = data.csm;
                that.file.uploadDir = data.uploadDir;
                that.file.okEnabled = true;
            },

            drawing_jobanalysis :function(option,id,xAxis,legend,datas,yName){
                var myChart = this.$echarts.init(document.getElementById(id));
                option.legend.data =legend;
                option.xAxis.data=this.Dataformate(xAxis);
                option.yAxis.name=yName;
                option.series[0].name= legend[0];
                option.series[0].data= datas;
                myChart.setOption(option);
                window.onresize = myChart.resize;
            },
            //查看resourceMan
            handleEdit:function(id, index, row,isflow) {
                this.showDesign = true;
                if(isflow){
                    this.isflow = true;
                    this.resType = 'flow';
                    sessionStorage.setItem('type',row.flowType);
                    this.$router.push({ path: "/project/design/designDrawing/"+id,query:{type:row.flowType}});
                    this.isShowFlows = false;
                }else{
                    this.isShow = true
                    //只有编辑数据源时,根据type判断路由跳转页面
                    var type;
                    //只有编辑数据源时,根据type判断路由跳转页面
                    if(row.type == 'DB'){
                        type = 'DBSource'
                    }else if(row.type == 'HTTP'){
                        type = 'httpSource'
                    }else if(row.type == 'FTP'){
                        type = 'ftpSource'
                    }else if(row.type == 'socket'){
                        type = 'socketSource'
                    }else if(row.storage == "JDBC"){
                        type = 'DBdataset'
                    }else if(row.storageConfigurations ){
                        type = 'dataset'
                    }
                    //除了数据源其他资源类型都是根据resType一致
                    else if(row.tableName == "merce_schema"){
                        type = 'schema';
                    }else if(row.tableName == "merce_dataset"){
                        type = 'dataset';
                    }else if(row.tableName == "merce_dataSource"){
                        type = 'dataSource';
                    }else if(row.tableName == "merce_flow"){
                        type = 'flow';
                    }else type = this.resType
                    this.$router.push({ name: type +"Project", params: {projectId: this.navId,id: row.id? row.id : 'new', tenantId: row.tenantId}});
                }
            },
            //查看design 计划
            handleEditplan:function(id,type, index, row) {
                this.isflow = true;
                this.resType = 'flow';
                this.$router.push({ name: " 计划",params:{id:id}, query:{type:type }});
            },
            //查看design 执行历史
            handleEdithis:function(id,type, index, row) {
                //是flow的页面，并且类型时flow
                this.isflow = true;
                this.resType = 'flow';
                this.$router.push({ name: " 执行历史",params:{id:id}, query:{type:type }});
            },
            //数据预览
            dataPreview: function (row) {
                this.$refs.dataset.dataPreview(row.id, row.tenantId, row.schemaId)
            },
            //schemas复制
            copySchema : function () {
                resIn.$emit('addOrEditSchemaProject',this.selectedNode, 'schema','copy')
            },
            // 选中行数据
            delTable: function delTable() {
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                that.$confirm('真的要删除'+tbIds.length+'个数据?', '提示', {
                }).then(() => {
                    if(that.resType == 'schema'){
                        deleteSchemaProject(that.navId, tbIds).then(data => {
                            that.parameter = createParameter("projectId",that.navId,"EQUAL").Offset(0).Limit(8).Sort("lastModifiedTime","DESC").Build();
                            that.listTable(false,'schema');
                            if(data.length == 0){
                                that.$message({
                                    message: '恭喜你，删除已成功！',
                                    type: 'success'
                                });
                            }else{
                                var mess=''
                                data.forEach(function (item) {
                                    mess += item.schema+ ', '
                                })
                                mess += " 已被dataset使用，不能删除！"
                                this.$confirm(mess ,"错误", {
                                    type: "error"
                                })
                            }
                        },error =>{
                            var datasetUse = "FOREIGN KEY (`schema_id`)"
                            var err = error.response.data.err
                            if(error.response.data.err.indexOf(datasetUse) > 0 ){
                                err = '此schema已被dataset使用，不能删除！'
                            }

                            this.$confirm(err ,"错误", {
                                type: "error"
                            })
                        })
                    }else if((that.resType).indexOf('dataset')>-1 ){
                        deleteDatasetProject(that.navId, tbIds).then(data => {
                            that.listTable(false,'dataset');
                            that.$message({
                                message: '恭喜你，删除已成功！',
                                type: 'success'
                            });
                        },error =>{
                            // this.$confirm(error.response.data.err,"错误", {
                            //     type: "error"
                            // })
                        })
                    }
                }).catch(() => {

                });
            },
            //根据过期时间过滤结果
            expiredPeriodFormat:function(row, column){
                let exPerName = row.expiredPeriod;
                if(exPerName == 0 || exPerName> 200000000000){
                    return "永不过期";
                }else {
                    return moment(row.createTime + exPerName*1000).format("YYYY-MM-DD HH:mm:ss");
                }
            },
            //创建flow 按钮
            addFlowBtn:function () {
                this.dialogAddFlowVisible = true;
                this.addFlowName = '';
                this.addFlowType = '';
            },
            //创建flow 确认
            addFlow:function () {
                var that = this
                var flowParameters = {
                    name:that.addFlowName,
                    flowType:that.addFlowType,
                    projectEntity:{
                        id:that.navId
                    },
                    steps:[],
                    links:[]
                }
                addFlow(flowParameters).then(data =>{
                    that.dialogAddFlowVisible = false;
                    that.$message({
                        message: '恭喜你，新增已成功！',
                        type: 'success'
                    });
                    that.listTable();
                },error =>{
//                    console.log(error.response)
                    that.$message({
                        message: '名称在目录中必须是唯一的!',
                        type: 'error'
                    });
                })
            },
            //通过json创建flow
            saveFlow: function () {
                var that = this;
                this.dialogNewFlowJsonVisible = false
                that.form = JSON.parse(that.form)
                var suFlow = that.isNew ?addFlow(that.form):  nodeDataSet(that.flowId,that.form);
                suFlow.then(res =>{
                    that.listTable(that.parameter,'flow')
                },err=>{
                    that.$message({
                        message:err.data.err,
                        type:'error'
                    })
                })
            },
            //查看schema的值
            showSchemaTable: function (row) {
                this.showSchemaFields = row.schema.fields;
                this.showSchemaName =  row.schema.name;
                this.dialogShowSchemaVisible = true;

            },
            //table查询的列表
            searchListTable: function (parameter, type, startTime, endTime, searchInput, pagesize) {
                var that = this;
                that.currentPage = 1
                if (pagesize) that.pagesize = pagesize;
                that.startTime = startTime;
                that.endTime = endTime;
                if (searchInput != undefined) that.searchInput = searchInput;
                this.listTable(parameter, type, startTime, endTime, searchInput)
            },
            //table list
            listTable:function (parameter, type , startTime,endTime, searchInput){
                var that = this;
                that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
                that.parameter = createParameter('projectId',that.navId,'EQUAL').Build(that.parameter);
                //将owner的equal换成like
				// that.parameter = createParameter('owner',that.owner,'LIKE').Build(that.parameter);
				if(!type){
                    type = that.resType;
                }
                if (searchInput) {
                    that.parameter = createParameter('name',"%"+searchInput+"%", "LIKE").Build(that.parameter);
                }
                //只有flow才将类型加到列表请求参数中
                if(that.flowType !='all' &&  that.resType == 'flow'){
                    that.parameter=createParameter('flowType',that.flowType,'EQUAL').Build(that.parameter)
                }
                that.isflow = false;
                that.isShow = false;
//                if(!that.parameter) that.parameter = parameter;
                var haveSourceId = false;
                if(that.parameter.fieldList){
                    for (var i = 0; i < that.parameter.fieldList.length; i++) {
                        if ("projectId"==that.parameter.fieldList[i].fieldName) {
                            haveSourceId = true;
                            break;
                        }
                        if ("instanceType"==that.parameter.fieldList[i].fieldName) {
                            type = that.parameter.fieldList[i].fieldValue;
                            break;
                        }
                        //如果有flow的过滤条件，将传过来的值赋给flowtype
                        if (parameter && "flowType"==that.parameter.fieldList[i].fieldName) {
                            type = that.parameter.fieldList[i].fieldValue;
                            break;
                        }
                    }
                }
                that.isflow = false;
                that.resType = type;
                if(!type) type = that.resType;
                that.parameter.sortObject.field = that.field
                that.parameter.sortObject.orderDirection = that.orderDirection
                if(type == 'dataset' || type == 'schema') {
                    that.isflow = false;
                    var typeTmp = type+"s"
                    that.loading = true
                    listData2(that.parameter, typeTmp).then(data => {
                        that.table = data;
                        that.loading = false
                    },error =>{
                        // that.$confirm(error.response.data.err,"错误", {
                        //     type: "error"
                        // })
                    })
                } else if(type == 'output_dataset'){
                    that.isflow = false;
                    var newList = [];
                    for(var li in that.parameter.fieldList){
                        if(that.parameter.fieldList[li].fieldName != 'projectId'&& parameter.fieldList[li].fieldName != 'projectId'){
                            newList.push(parameter.fieldList[li]);
                        }
                    }
                    that.parameter.fieldList = newList;
                    that.parameter = createParameter("source","output","EQUAL").Build(that.parameter);
                    that.parameter.sortObject.field = that.prop
                    that.parameter.sortObject.orderDirection = that.orderDirection
                    that.loading = true
                    nodeDataSet(that.parameter).then(data => {
                        that.table = data;
                        that.loading = false
                    },error =>{
                        // that.$confirm(error.response.data.err,"错误", {
                        //     type: "error"
                        // })
                    })
                }else if(type == 'user'){
                    that.isflow = false;
                }else if(type == 'flow'){
                    that.isflow = true;
                    that.$router.push({ path: "/resourceManProject"});
                    that.loading = true
                    listData2(that.parameter, "flows").then(data => {
                        sessionStorage.setItem('projectId',that.navId)
                        that.table = data;
                        that.loading = false
                    },error =>{
                        // that.$confirm(error.response.data.err,"错误", {
                        //     type: "error"
                        // })
                    })
                }else if(type == 'dataSource'){
                    this.isShow = false;
                    this.beData =false;
                    return ;
                }
                else{
                    type = type == 'standard'?'standardbd':type
                    that.loading = true
                    listData(that.parameter,type).then(data => {
                        that.table = data;
                        that.loading = false
                    },error =>{
                        // that.$confirm(error.response.data.err,"错误", {
                        //     type: "error"
                        // })
                    })
                }
            },

            deleteFlow: function () {
                var tbIds = [];
                var that = this;
                this.multipleSelection.forEach(function (i,index){
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                this.$confirm('真的要删除'+tbIds.length+'个数据?', '提示', {
                }).then(() => {
                    delFlowProject(that.navId,tbIds).then(data => {
                        that.parameter = createParameter('projectId',that.navId,'EQUAL').Build(that.parameter);
                        that.listTable(that.parameter,'flow');
                        that.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    },error =>{
                        // this.$confirm(error.response.data.err,"错误", {
                        //     type: "error"
                        // })
                    })
                })
            },
			//清空查询组建的内容
			clearSearchContent:function () {
                if(this.$refs.refSearchDate)
                    this.$refs.refSearchDate.initParameter()
                if(this.$refs.refSearchTable)
                    this.$refs.refSearchTable.initParameter()
            },
            //flow类型选择
            handleTypeValue : function (val) {
                this.clearSearchContent();
                this.searchInput = "";
                this.startTime = "";
                this.endTime = "";
                this.flowType = val;
                this.parameter = createParameter('flowType',val,'EQUAL').Build(this.parameter);
                this.listTable(this.parameter)
            },
            //列表排序
            getOrder: function(column) {
                if (column.order === 'ascending') {
                    this.orderDirection = 'ASC'
                } else {
                    this.orderDirection = 'DESC'
                }
                this.field = column.prop
                if (column.prop === null) {
                    this.field = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                var parameter = createParameter().Limit(this.pagesize).Sort(this.field,this.orderDirection).Build();
                this.listTable(parameter, this.resType);
            },
        },
        mounted() {
            if(this.$route.path === '/resourceManProject'){
                this.isShow = true;
            }else {
                this.isShow = false;
            }
            if(this.$route.params.projectId !=null && this.$route.params.id !=null){
                this.isShow = true;
            }else if(this.$route.params.id !=null){
                this.beData = true;
            }
            if(this.$route.params.parentId == 'hippo'){
                this.isShow = true;
            }
            //  刷新列表
            resIn.$on('refreshList',(parameter, type) => {
                this.parameter = createParameter("projectId",this.navId,"EQUAL").Build();
                this.listTable(parameter, type);
                this.isShow = false
            });
            if(this.resType == 'flow'){
                this.days=this.getAll(this.weeks[0],this.weeks[7]);
                var parameter=createParameter('createTime',new Date(this.weeks[0]).getTime(),'GREATER_THAN')
                    .And('createTime',new Date(this.weeks[7]).getTime(),'LESS_THAN')
                    .GroupBy('day')
                    .Build();
                this.listTable(parameter);
            }
            // 用$on事件来接收参数
            resIn.$on('childMethod', (data) => {
				console.log("// 用$on事件来接收参数 werwe");
                this.noData= false;
                //清除table和date的查询条件
                this.startTime=''
                this.endTime=''
                this.disId = data.id;
                this.searchInput=''
                this.currentPage=1
                this.pagesize=8
				//构建默认的列表请求参数
                this.parameter = createParameter("projectId",data.id,"EQUAL").Offset(0).Limit(8).Sort("lastModifiedTime","DESC").Build();
                //如果点击不是user才获取类型，没有类型默认是数据源
                if (data.resType && data.resType != 'user') {
                    this.resType = data.resType
                } else if(data.resType == 'user'){
                    this.resType = 'user'
                } else {
                    this.resType = 'dataSource'
                }
                //如果是dataset显示过期时间和预览数据
                if((this.resType).indexOf('dataset')>-1 ){
                    this.showExpiredPeriod = true;
                    this.showPreview = true;
                    this.showStorage = true;
                }else{
                    this.showExpiredPeriod = false;
                    this.showPreview = false;
                    this.showStorage = false;
                }
                //当datasource时候显示类型其他时候不显示此字段
                if(this.resType =='datasource'){
                    this.showType = true;
                }else this.showType = false;
                this.selectedNode = data
                this.navId = data.id;
                if(!this.navId){
                    this.table = [];
                }
                this.beData = true;
                this.owner = data.owner;
                if(data.resType != 'flow'){
                    this.projectId = data.id;
                    this.isShow = false
                    this.listTable(this.parameter,data.resType);
                }else if(data.resType == 'flow'){
                    this.listTable(this.parameter,data.resType);
                    this.isShow = false;
                    this.projectId = data.id;
                }
                this.clearSearchContent();
            })
        },
        beforeRouteLeave: function (to, from, next) {
            resIn.$off();
            next();
        }
    }

</script>

<style lang="scss" scoped>
	.design-content{
		float: left;
		width: 100%;
	}
	i{
		font-size: 14px;
		width: 13px;
		height: 13px;
		vertical-align:inherit;
	}
	.dn-content .dn-no-data{
		position: absolute;
		width: 100%;
		box-sizing:border-box;
		z-index:1;
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

	.el-table td, .el-table th {
		padding-right: 10px;
	}
	.dn-content{
		float: left;
		width: 100%;
		position: relative;
		padding-left: 250px;
		box-sizing:border-box;
		height: 100%;
		.dn-data{
			position: relative;
			.el-table{
				.editName{
					color: #2182e4;
					cursor: pointer
				}
				.editName:hover{
					text-decoration: underline;
				}
			}
			.design-flowtype{
				float: left;
				margin: 4px 10px 0px 0px;
				height: 34px;
				line-height: 34px;
				h4{
					margin: 0px;
					float: left;
				}
				.el-select{
					float: left;
					width: 120px;
					margin-left: 10px;
				}
			}
		}
	}
	.desContent{
		position: absolute;
		top: 0px;
	}
	.flexibleDes{
		position: absolute;
		margin: 19px 0px 0px 10px;
		z-index: 12;
		cursor: pointer;
	}
	.btn-left{
		margin: 5px 0px 0px 35px;
	}
	.proBtnClass{
		padding: 0px;
		height: 50px;
		box-sizing: border-box;
		border-bottom: 1px solid #ddd;
		box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);
	}
	.navProduct{
		width: 250px;
	}
	.btn-right{
		margin-right: 10px;
	}
	.sel_down{
		margin-left: 10px;
    }
    /*design node 嵌套弹出层统一样式*/
.nodeDialog {
    position: fixed;
    left: 50%;
    top: 10%;
    width: 80%;
    height: 80%;
    margin-left: -40%;
    background-color: #ffffff;
    z-index: 99999
}

.nodeDialog .diHeader {
    position: absolute;
    width: 100%;
    height: 45px;
    z-index: 10;
    line-height: 45px;
    background-color: #4c4c51;
}

.nodeDialog .diHeader h3 {
    float: left;
    margin: 0px;
    width: 60%;
    padding: 0px 0px 0px 20px;
    font-weight: normal;
    color: #ffffff;
}

.nodeDialog .diHeader span {
    color: #ffffff;
    float: right;
    margin-right: 20px;
    margin-top: 14px;
    font-size: 16px;
    cursor: pointer;
}

.nodeDialog .diFooter {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 60px;
    border-top: 1px solid #eeeeee;
    background-color: #ffffff;
    padding: 15px 20px 15px 15px;
    z-index: 10;
    box-sizing: border-box;
    text-align: right;
}

.nodeDialog .diContent {
    position: absolute;
    padding: 45px 0px 0px 0px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 50px);
}
.importantflow{
    position: fixed;
    z-index: 999;
}
</style>
