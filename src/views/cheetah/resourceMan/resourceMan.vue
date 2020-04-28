<template>
    <section id='bm-ch-resMan-resourceman-tmp'>
        <!-- 引入二级菜单组件 -->
        <second-nav></second-nav>

        <!-- 内容区 -->
        <router-view v-if="isShow"></router-view>

        <div class="dn-content" v-loading="loading" id="bm-ch-res-table">
            <div class="dn-data" v-show="beData && !isShow">
                <el-row class="btnClass">
                    <!-- 显示 -->
                    <criteria
                            v-if="isOrdinary === false"
                            :isShowDelete="false"
                            :criteria="criteria"
                    />
                    <search-table-data name="ch-ch-resourceMan-standard-resourceMan-search-date-data" v-if="isOrdinary"
                                       ref="refSearchTable" @searchKey="searchListTable" :pagesize="pagesize"
                                       :startTime="startTime" :endTime="endTime"></search-table-data>
                    <search-date-data name="ch-ch-resourceMan-standard-resourceMan-search-table-data" v-if="isOrdinary"
                                      ref="refSearchDate" @searchDate="searchListTable" :pagesize="pagesize"
                                      :searchInput="searchInput"></search-date-data>
                    <overlay
                      :show-overlay="showOverlay"
                      @onCloseOverlay="onCloseOverlay"
                    >
                        <new-search
                          :interFace="interFace"
                          :table-title="columns"
                          @getTableData="getTableData"
                          @searchTag="searchTag"
                        />
                    </overlay>
                    <div class="btn-right">
                        <el-button type="info"  @click="creatIndexFn"  v-if="resType.toLowerCase().indexOf('dataset')> -1">
                            <i class="el-icon-s-platform"></i>后台分析
                        </el-button>
                        <el-button type="info" :class="{'buttonBg': isOrdinary}"
                                   id='bm-ch-resMan-resourceman-analysis-onShowOverlay-button' @click="ordinarySearch">
                            <i class="el-icon-search"></i>普通搜索
                        </el-button>
                        <el-button type="info" :class="{'buttonBg': !isOrdinary}"
                                   id='bm-ch-resMan-resourceman-analysis-seniorSearch-button' @click="seniorSearch"><i
                          class="el-icon-search"></i>高级搜索
                        </el-button>
                        <el-button type="info" id='bm-ch-resMan-resourceman-analysis-emptyCriteria-button'
                                   @click="emptyCriteria"><i class="icon iconfont icon-ir-directory-delete"></i>清空
                        </el-button>
                        <el-dropdown class="sel_down btn-right"  v-if="resType.toLowerCase().indexOf('standard')> -1"  @command="handleCommand" trigger="click" name="operation-dropdown">
                            <span class="el-dropdown-link">
                                <el-button type="info" class="dropdown-toggle" toggle="dropdown" name="dropdown-toggle"><i class="icon iconfont icon-ir-triangle-down"></i>集群</el-button>
                            </span>
                                <el-dropdown-menu slot="dropdown" >
                                    <el-dropdown-item   command="Import" uib-tooltip="导入" name="Import"><i class="icon iconfont icon-ir-upload" name="Import"></i>&nbsp;上载</el-dropdown-item>
                                    <el-dropdown-item  command="Export" uib-tooltip="导出" name="Export"><i class="icon iconfont icon-ir-download" name="Export"></i>&nbsp;卸载</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!--新建不同类型的资源-->
                        <el-dropdown class="sel_down" trigger="click" @command="addOrEdit">
							<span class="el-dropdown-link">
								<el-button type="info" id='bm-ch-resMan-resourceman-create-button'
                                           class="dropdown-toggle" toggle="dropdown"><i
                                        class="icon iconfont icon-ir-triangle-down"></i>新建</el-button>
							</span>
                            <el-dropdown-menu slot="dropdown">
                                <div v-if="hasAuthority">
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-schema-dropdown-menu'
                                                      command="schema"
                                                      v-if="resType === 'schema'"><i
                                      class="icon iconfont icon-ir-text-add"></i>&nbsp;元数据
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-DBSource-dropdown-menu'
                                                      v-if="resType.toLowerCase().indexOf('source')> -1"
                                                      command="DBSource">
                                        <i class="icon iconfont icon-ir-text-add"></i>&nbsp;{{'JDBC' | cn}}
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-httpSource-dropdown-menu'
                                                      v-if="resType.toLowerCase().indexOf('source')> -1"
                                                      command="httpSource"><i
                                      class="icon iconfont icon-ir-text-add"></i>&nbsp;{{'HTTP' | cn}}
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-localfsSource-dropdown-menu'
                                                      v-if="resType.toLowerCase().indexOf('source')> -1"
                                                      command="localfsSource"><i
                                      class="icon iconfont icon-ir-text-add"></i>&nbsp;{{'LOCALFS' | cn}}
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-ftpSource-dropdown-menu'
                                                      v-if="resType.toLowerCase().indexOf('source')> -1"
                                                      command="ftpSource"><i class="icon iconfont icon-ir-text-add"></i>&nbsp;{{'FTP'
                                        | cn}}
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-socketSource-dropdown-menu'
                                                      v-if="resType.toLowerCase().indexOf('source')> -1"
                                                      command="socketSource"><i
                                      class="icon iconfont icon-ir-text-add"></i>&nbsp;{{'SOCKET' | cn}}
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-mongoDBSource-dropdown-menu'
                                                      v-if="resType.toLowerCase().indexOf('source')> -1"
                                                      command="mongoDBSource"><i
                                      class="icon iconfont icon-ir-text-add"></i>&nbsp;{{'MONGODB' | cn}}
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-esSource-dropdown-menu'
                                                      v-if="resType.toLowerCase().indexOf('source')> -1"
                                                      command="esSource">
                                        <i class="icon iconfont icon-ir-text-add"></i>&nbsp;{{'ElasticSearch' | cn}}
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-DBdataset-dropdown-menu'
                                                      v-if="resType=='dataset'"
                                                      command="DBdataset"><i class="icon iconfont icon-ir-text-add"></i>&nbsp;数据库
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-dataset-dropdown-menu'
                                                      v-if="resType == 'dataset'"
                                                      command="dataset">
                                        <i class="icon iconfont icon-ir-text-add"></i>&nbsp;存储
                                    </el-dropdown-item>
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-standard-dropdown-menu'
                                                      v-if="resType.toLowerCase().indexOf('standard')> -1"
                                                      command="standard"><i class="icon iconfont icon-ir-text-add"></i>数据标准
                                    </el-dropdown-item>
                                </div>
                                <div v-if="!hasAuthority">
                                    <el-dropdown-item id='bm-ch-resMan-resourceman-schema-dropdown-menu-esle'>
                                        &nbsp;该目录没有创建数据的权限！
                                    </el-dropdown-item>
                                </div>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button type="info" id='bm-ch-resMan-resourceman-delete-beiruanModel-button'
                                   @click="delTable" :disabled="multipleSelection.length == 0" v-if="!beiruanModel && !isBeiRuan"><i
                          class="icon iconfont icon-ir-directory-delete"></i>删除
                        </el-button>
                        <el-button type="info" id='bm-ch-resMan-resourceman-copyschema-button'
                                   @click="copySchema('schema', 'copy')" v-if="resType === 'schema'"
                                   :disabled="multipleSelection.length !== 1 "><i class="el-icon-edit"></i>复制
                        </el-button>
                        <el-button type="info" id='bm-ch-resMan-resourceman-move-button' @click="moveRows()"
                                   :disabled="multipleSelection.length == 0 "><i class="icon iconfont icon-ir-stop"></i>移动
                        </el-button>
                        <el-button type="info" id='bm-ch-resMan-resourceman-delete-button' @click="delTable"
                                   :disabled="multipleSelection.length == 0"
                                   v-if="beiruanModel && selectedNode.resType=='standard_dir'"><i
                          class="icon iconfont icon-ir-directory-delete"></i>删除
                        </el-button>
                        <el-button type="info" id='bm-ch-resMan-resourceman-analysis-button' @click="analysis"
                                   v-if="resType === 'schema' && parentId"><i class="icon iconfont el-icon-view"></i>分析
                        </el-button>
                        <el-button type="info" id='bm-ch-resMan-resourceman-import-button' @click="importSchema"
                                   v-if="resType === 'schema'"><i class="icon iconfont el-icon-view"></i>导入
                        </el-button>
                        <el-button type="info" id='bm-ch-resMan-resourceman-export-button' @click="exportSchema"
                                   v-if="resType === 'schema'"><i class="icon iconfont el-icon-view"></i>导出
                        </el-button>
                    </div>
                </el-row>
                <!--内容显示列表页面-->
                <div class="rf-swap">
                    <el-table
                      id="bm-ch-resourceMan-table"
                      ref="multipleSelectionTable"
                      :data="table.content"
                      tooltip-effect="dark"
                      height="calc(100vh - 170px)"
                      style="width: 100%"
                      @sort-change="getOrder"
                      @selection-change="handleSelectionChange">
                        <el-table-column
                          type="selection"
                          width="40">
                        </el-table-column>
                        <el-table-column
                          prop="id"
                          label="主键"
                          key="主键"
                          v-if="show"
                          show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                          prop="name"
                          key="名称"
                          label="名称"
                        >
                            <template slot-scope="scope">
                                <span class="editName"
                                      @click="handleEdit(scope.row.id, scope.$index, scope.row)">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                          v-if="resType == 'dataset'"
                          label="元数据"
                          key="元数据"
                        >
                            <template slot-scope="scope">
                                <p v-if="scope.row.schema">
                                    <span class="editName"
                                          @click="showSchemaTable(scope.row.schema)">{{scope.row.schema.name}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column
                          v-if="resType.toLowerCase().indexOf('source') > -1"
                          prop="type"
                          label="类型"
                          key="类型"
                          show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.type | cn}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                          v-if="resType == 'dataset'"
                          prop="storage"
                          label="类型"
                          key="类型"
                          show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.storage | cn}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                          prop="recordNumber"
                          v-if="resType == 'dataset'"
                          label="记录数"
                          width="100"
                          :sortable="isBeiRuan"
                          key="记录数"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="createTime"
                          label="创建时间"
                          key="创建时间"
                          min-width="100"
                          :formatter="dateFormat">
                        </el-table-column>
                        <el-table-column
                          prop="creator"
                          label="创建人"
                          key="创建人"
                          min-width="100"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="lastModifier"
                          label="修改人"
                          key="修改人"
                          min-width="100"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="lastModifiedTime"
                          label="修改时间"
                          key="修改时间"
                          min-width="100"
                          sortable="custom"
                          :formatter="dateFormat">
                        </el-table-column>
                        <el-table-column
                          v-if="resType == 'standard'"
                          prop="clusters"
                          label="clustersId"
                          key="clustersId"
                          min-width="100"
                        >
                        </el-table-column>
                        <el-table-column
                          v-if="resType == 'dataset'"
                          prop="expiredPeriod"
                          label="过期时间"
                          key="过期时间"
                          min-width="100"
                          :formatter="expiredPeriodFormat">
                        </el-table-column>
                        <el-table-column
                          v-if="resType == 'schema'"
                          prop="lastModifier"
                          key="lastModifier"
                          align="left"
                          label="版本">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.version" @visible-change="changeSchemaVersion($event, scope.row)">
                                    <el-option
                                      v-for="(item) in historySchemaEntity"
                                      :label="item.version"
                                      :name="item.version"
                                      :key="item.version"
                                      :value="item.version"
                                    >
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column width="320" key="操作" v-if="resType == 'dataset'" label="操作" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                  type="primary"
                                  size="mini"
                                  @click="dataPreview(scope.row)"
                                >
                                    预览
                                </el-button>

                                <el-button
                                  type="primary"
                                  size="mini"
                                  @click="relation(scope.row)"
                                >
                                    查看
                                </el-button>

                                <el-button
                                  type="primary"
                                  size="mini"
                                  :disabled="!(scope.row.storage == 'HDFS' && scope.row.storageConfigurations.format == 'csv')"
                                  @click="dataAnalysis(scope.row)"
                                >
                                    分析
                                </el-button>
                                <el-button
                                  type="primary"
                                  size="mini"
                                  @click="contentQuery(scope.row)"
                                >
                                    内容查询
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                      name="bm-ch-5-el-pagination"
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
            <!-- 无数据 -->
            <div class="dn-no-data" v-if="noData">
                <div class="noData">
                    <p><i class="icon iconfont icon-ir-no-data"></i></p>
                    <p>暂无数据，请选择</p>
                </div>
            </div>
            <!--数据预览 dialog-->
            <preview-data-set-dialog ref="dataset"></preview-data-set-dialog>
            <!-- ResourceTree dialog-->
            <el-dialog v-dialog-drag
                       :visible.sync="dialogResourceTreeVisible"
                       width="50%"
                       :close-on-click-modal="false" :modal-append-to-body="false"
                       :title="'Resource tree'| cn"
            >
                <el-form>
                    <resource-tree ref="resourcetree" :theModel="treeModel"></resource-tree>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitResourceTree()"
                               name="bm-ch-resourceMan-submitResourceTree-ResourceTree-ok">确定
                    </el-button>
                    <el-button @click="dialogResourceTreeVisible=false"
                               name="bm-ch-resourceMan-submitResourceTree-ResourceTree-cancel">取消
                    </el-button>
                </div>
            </el-dialog>
            <!-- schema fileds dialog-->
            <el-dialog v-dialog-drag
                       v-if="schemaEntity"
                       :visible.sync="dialogShowSchemaVisible"
                       :close-on-click-modal="false" :modal-append-to-body="false"
                       :title="schemaEntity.name"
            >
                <el-form id="bm-ch-resourceMan-schema-form" disabled :model="schemaEntity" ref="entity"
                         class="data-content">
                    <el-form-item label="名称" prop="name">
                        <el-input name="bm-ch-resourceMan-schema-name-input" v-model="schemaEntity.name" auto-complete="off"
                                  class="input-form"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input name="bm-ch-resourceMan-schema-description-input" v-model="schemaEntity.description"
                                  auto-complete="off" class="input-form"></el-input>
                    </el-form-item>
                    <el-form-item label="版本" prop="version">
                        <el-input name="bm-ch-resourceMan-schema-version-input" v-model="schemaEntity.version"
                                  auto-complete="off" class="input-form"></el-input>
                    </el-form-item>
                    <el-table id="bm-ch-resourceMan-schema-table" :data="schemaEntity.fields" class="datasetPreview">
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
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogShowSchemaVisible=false"
                               name="bm-ch-resourceMan-resType-ok">确定
                    </el-button>
                    <el-button @click="dialogShowSchemaVisible=false" name="bm-ch-resourceMan-resType-cancel">取消
                    </el-button>
                </div>
            </el-dialog>
            <!-- dataAnalysis dialog -->
            <el-dialog v-dialog-drag
                       :visible.sync="dialogdataAnalysisVisible"
                       :close-on-click-modal="false"
                       :modal-append-to-body="false"
                       title="数据分析"
            >
                <el-form id="bm-schemaadd-form" :model="dataAnalysisEntity" ref="entity"
                         v-loading="loadingDataAnalysis">
                    <el-form-item>
                        <template>
                            <div class="dataAnalysisindex">
                                <div class="dataAnalysisindexItem">
                                    <p><b>记录行数</b></p>
                                    <el-input v-model="dataAnalysisEntity.rowCount" auto-complete="off"
                                              class="input-form"></el-input>
                                </div>
                                <div class="dataAnalysisindexItem">
                                    <p><b>数据集大小</b></p>
                                    <el-input v-model="dataAnalysisEntity.sizeInBytes" auto-complete="off"
                                              class="input-form"></el-input>
                                </div>
                                <div class="dataAnalysisindexItem">
                                    <p><b>分析时间</b></p>
                                    <el-input v-model="dataAnalysisEntity.lastAnalyzeTime" auto-complete="off"
                                              class="input-form"></el-input>
                                </div>
                                <div class="dataAnalysisindexItem">
                                    <p><b>分析状态</b></p>
                                    <el-input v-model="dataAnalysisEntity.status" auto-complete="off"
                                              class="input-form"></el-input>
                                </div>
                            </div>
                        </template>
                    </el-form-item>
                    <el-form-item>
                        <el-table id="bm-ch-resourceMan-dataAnalysis-table"
                                  :data="dataAnalysisEntity.table"
                                  class="datasetPreview"
                                  height="calc(100vh - 405px)">
                            <el-table-column
                              prop="name"
                              label="字段名"
                              show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                              prop="distinctCount"
                              label="非重复"
                              show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                              prop="nullCount"
                              label="空值"
                              show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                              prop="avgLen"
                              label="平均长度"
                              show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                              prop="maxLen"
                              label="最大长度"
                              show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                              prop="max"
                              label="最大值"
                              show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{scope.row.max}}
                                </template>
                            </el-table-column>
                            <el-table-column
                              prop="min"
                              label="最小值"
                              show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{scope.row.min}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <span class="timer">{{ `已经等待：${formatSeconds(count)}`}}</span>
                    <el-button type="primary" @click="openExecuteAnalysis()" name="bm-ch-resourceMan-dataAnalysis-ok">
                        执行分析
                    </el-button>
                    <el-button @click="dataAnalysis()" :disabled="loadingDataAnalysis"
                               name="bm-ch-resourceMan-dataAnalysis-cancel">刷新
                    </el-button>
                    <el-button @click="cancelAnalysis('close')" name="bm-ch-resourceMan-dataAnalysis-cancel">取消
                    </el-button>
                </div>
            </el-dialog>
            <!--schema字段选择框-->
            <schema-fields ref="schemaFields" @executeAnalysis="executeAnalysis"></schema-fields>
            <!--删除数据集弹框-->
            <el-dialog
              title="元数据导出"
              :visible.sync="dialogDelectDatasetVisible"
              width="30%">
                <el-form id="bm-exportflow-dialog-form">
                    <el-form-item>
                        <!--删除数据集-->
                        <p> 确认要删除选中数据集?</p>
                    </el-form-item>
                    <el-form-item v-if="hasHdfs">
                        <el-checkbox
                          auto-complete="off"
                          v-model="delHdfsFlag">
                            同时删除HDFS文件？
                        </el-checkbox>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="delDataset" name="flowExport-sure">确定</el-button>
					    <el-button @click="dialogDelectDatasetVisible = false" name="flowExport-cancel">取消</el-button>
				    </span>
            </el-dialog>
            <!-- datasetContent内容查询 -->
            <dataset-content ref="queryDialog"></dataset-content>
        </div>
        <!-- <clusterDialog :clusterData="clusterData"></clusterDialog> -->
        <el-dialog
          :title="colonyTitle"
          :visible.sync="dialogVisibleExport"
          class="el-body-padding">
            <el-form >
                <el-col :span="24">
                    <el-divider content-position="left"></el-divider>
                    <el-form-item label="clusterName" :label-width="formLabelWidth">
                        <el-select v-model="clusterName" placeholder="请选择clusterName">
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
        <!--元数据导入 弹出框-->
        <el-dialog
          title="元数据导入"
          v-loading="loadingUpload"
          :visible.sync="dialogImportSchemaVisible"
          :close-on-click-modal="false"
          class="el-body-padding">
            <div style="height: calc(100vh - 315px);overflow: auto">
                <template>
                    <el-form id="bm-pro-importflow-form" name="fileinfo"  method="post" enctype="multipart/form-data" >
                        <el-form-item  :label="'schema存放地址'">
                            <el-input placeholder="schema存放位置 (默认根目录)" name="schema存放位置" :disabled="true" v-model="schemaPath"
                                      class="input-form-width">
                                <el-button slot="append" icon="icon iconfont icon-ir-search"
                                           @click="dialogSchemaTreeVisible=true" name="datasetTree"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item>选择上传的文件</el-form-item>
                        <el-form-item>
                            <div v-if="isError" style="color: red" v-for="error in errorMessage">
                                {{error}}
                            </div>
                        </el-form-item>
                        <el-upload
                          ref="upload"
                          :auto-upload="false"
                          :on-error="uploadError"
                          :on-success="uploadSuccess"
                          action="/api/schemas/import"
                          class="upload-demo"
                          :headers="{'X-AUTH-TOKEN':xToken}"
                          :multiple=true
                          :data="{'resourceId':resourceId}"
                          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
                          :file-list="fileList">
                            <el-button slot="trigger" style="margin-left: 10px;" size="small" type="success" name="browse">浏览</el-button>
                        </el-upload>
                    </el-form>
                </template>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="uploadFile" name="saveImportSchema-sure">确定</el-button>
                    <el-button @click="dialogImportSchemaVisible = false" name="saveImportSchema-cancel">取消</el-button>
                </span>
        </el-dialog>
        <!-- SchemaTree dialog-->
        <el-dialog v-dialog-drag
                   :visible.sync="dialogSchemaTreeVisible"
                   :close-on-click-modal="false" :modal-append-to-body="false"
                   :title="'schema tree'| cn"
                   custom-class="dialogClass"
        >
            <el-form class="dt-content" id="bm-sh-r-data-db3-form">
                <schema-tree ref="schematree"></schema-tree>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSchemaTree()"
                           name="bm-ch-resMan-dbdataset-submitSchemaTree-schema-ok">确定
                </el-button>
                <el-button @click="dialogSchemaTreeVisible=false"
                           name="bm-ch-resMan-dbdataset-submitSchemaTree-schema-cancel">取消
                </el-button>
            </div>
        </el-dialog>
        <!-- creatIndex dialog-->
        <el-dialog v-dialog-drag
                   :visible.sync="dialogCreatIndexVisible"
                   :close-on-click-modal="false" :modal-append-to-body="false"
                   title="新建索引"
        >
        <creat-index :creatIndexData="indexData" ref="creatref"></creat-index>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitCreatIndex()"
                        name="bm-ch-resMan-dbdataset-submitSchemaTree-schema-ok">确定
                </el-button>
                <el-button @click="dialogCreatIndexVisible=false">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    // 导入导出excel表格
    import FileSaver from 'file-saver'
    import  XLSX from 'xlsx';

    import congfigData from '@config/data/index.json'
    import {cloneDeep} from "lodash";
    import {mapActions, mapGetters} from "vuex";
    import {formatSeconds} from "@function/comFunction";
    // 高级搜索组件
    import Overlay from '@components/overlay/overlay'
    import newSearch from '@components/search/newSearch'
    import Criteria from '@components/search/criteria'

    import secondNav from '@components/dataTree/secondNav.vue'
    //引入查询组件
    import searchDateData from '@components/collectorSearch/searchDateData.vue'
    import searchTableData from '@components/collectorSearch/searchTableData.vue'
    //导入树组件
    import dataTree from '@components/dataSourceInq/dataSourceInqTree.vue'
    import schemaTree from '@components/schemaTree/schemaTree.vue';
    import resIn from '@components/dataTree/resNav.js'
    //导入预览组件
    import previewDataSetDialog from '@components/collector/taskDialog/datasetDialog.vue'
    import schemaFields from '@components/collector/schemaFields.vue'
    //导入书组建
    import resourceTree from '@components/resourceTree/resourceTree.vue';
    import clusterDialog from './clusterDialog/index.vue'
    //新建index
    import creatIndex from '@components/creatIndex/creatIndex.vue'
    import {
        listData,
        listData2,
        deleteSchema,
        deleteDataset,
        deleteDatasource,
        deleteStandard,
        moveResource,
        resDirTree,
        executeDataAnalysis,
        getDataAnalysis,
        getHistorySchema, //获取不同版本号的schema
        uninstallStandardbd,
        uploadStandardbd,
        backendCreate
    } from '@api'
    import {clusterAll} from '@/api/cluster/index.js'
    import {queryObject, createParameter} from '@components/function/queryParameter.js';
    import moment from "moment"
    import {exportFlow, importFlowPro} from "../../../api/api";
    import datasetContent from './dataset/datasetContent.vue'
    //时间格式化
    export default {
        props: ['rootName'],
        components: {
            schemaFields,
            secondNav,
            dataTree,
            schemaTree,
            searchDateData,
            searchTableData,
            previewDataSetDialog,
            resourceTree,
            newSearch,
            Overlay,
            Criteria,
            creatIndex,
            datasetContent
            // clusterDialog
        },
        data() {
            return {
                isError: false,
                errorMessage: [],
                schemaPath:'',//存放导入schema的resource节点path
                resourceId:'',//存放导入schema的resource节点id
                fileList:[],//存储上传文件的列表
                xToken:sessionStorage['x-auth-token'],//获取token
                dialogImportSchemaVisible: false,//元数据导入
                dialogSchemaTreeVisible: false,//元数据树结构导入
                isBeiRuan: congfigData[process.env.BASE_PROJECT].systemName === 'BeiRuan',
                hasAuthority: false,//没有权限，可以创建数据
                count: 0,//将时间转换成秒
                formatSeconds: formatSeconds,//分析页面请求时间秒
                isOrdinary: true,
                empty: () => {
                },
                columns: [],
                interFace: '',
                dataSetColumns: [
                    {
                        prop: 'name',
                        label: '名称',
                    }, {
                        prop: 'storage',
                        label: '类型',
                    }, {
                        prop: 'recordNumber',
                        label: '记录数',
                    }, {
                        prop: 'lastModifiedTime',
                        label: '修改时间',
                        align: 'left'
                    }
                ],
                datasourcesColumns: [
                    {
                        prop: 'name',
                        label: '名称',
                    }, {
                        prop: 'type',
                        label: '类型',
                    }, {
                        prop: 'lastModifiedTime',
                        label: '修改时间',
                        align: 'left'
                    }
                ],
                schemasColumns: [
                    {
                        prop: 'name',
                        label: '名称',
                    }, {
                        prop: 'lastModifiedTime',
                        label: '修改时间',
                        align: 'left'
                    }
                ],
                standardsColumns: [
                    {
                        prop: 'name',
                        label: '名称',
                    }, {
                        prop: 'lastModifiedTime',
                        label: '修改时间',
                    }
                ],
                criteria: [],
                showOverlay: false,
                analysisId: '',
                table: [],
                multipleSelection: [],
                navId: '',
                parentId: '',
                loading: false,
                loadingUpload: false,
                noData: true,
                beData: false,
                show: false,
                owner: '',
                currentPage: 1,
                pagesize: 8,
                startTime: '',
                endTime: '',
                searchInput: '',
                isShow: false,
                resType: 'dataset',
                parameter: queryObject(),
                searchParameter: queryObject(),
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                dialogResourceTreeVisible: false,
                dirType: 'dataset_dir',
                selectedNode: {},
                treeModel: [],
                delHdfsFlag:false,// true删除，删除数据集的级联删除hdfs数据的标志
                dialogShowSchemaVisible: false,
                dialogdataAnalysisVisible: false,//hdfs类型数据分析
                dialogDelectDatasetVisible: false,//删除数据集确认弹框
                dialogSchemaFieldsVisible: false,//schema字段选择弹框
                loadingDataAnalysis: false,//loading
                columnAnalysis: true,
                dataAnalysisEntity: {
                    id: '',
                    fields: [],
                    sizeInBytes: '',
                    status: '',
                    rowCount: '',
                    lastAnalyzeTime: '',
                    table: []
                },//数据分析执行分析数据
                historySchemaEntity: [], //存储schema的历史版本信息
                hasHdfs: false, // 删除数据集里面是否包含hdfs类型的
                objectHistory:{},////存储schema的历史版本对象信息
                dataAnalysisRow: {},
                schemaEntity: {}, // schema 的版本显示的弹框
                colonyTitle:'上载',
                dialogVisibleExport:false,
                formLabelWidth: "120px",
                clusterName:'',
                selectOption: [],
                changRow: [],
                ids:[],
                dialogCreatIndexVisible:false,
                indexData:{
                    objId:'',
                    objName:'',
                    objType: ''
                },
                isDataset: false,
                dialogContentQueryVisible: false
                // clusterData:{
                //     colonyTitle:'上载',
                //     dialogVisibleExport:false,
                //     formLabelWidth: "120px",
                //     clusterName:'',
                //     selectOption: [],
                //     changRow: [],
                //     ids:[],
                // }
            }
        },
        computed: {
            ...mapGetters(["multipleSelectionState"]),
            //...mapState(["pk.multipleSelection"]),
        },
        methods: {
            ...mapActions(["getMultipleSelection",'getMuseData']),
            //注册集群
            create(){
                this.dialogVisibleExport = true
                clusterAll().then(res=>{
                    this.selectOption = res.data
                }, err => {
                    this.$message({
                        message: err.response.data.err,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            handleCommand(val){
                this.dialogVisibleExport = true
                // this.clusterData.dialogVisibleExport = true
                if(val == 'Import'){
                    // this.clusterData.colonyTitle ='上载'
                    this.colonyTitle = '上载'
                } else {
                    this.colonyTitle = '卸载'
                    // this.clusterData.colonyTitle ='卸载'
                }
                this.create()
            },
            exportSteps(){
                this.ids = []
                this.changRow.forEach(item=>{
                    this.ids.push(item.id.toString())
                })
                // var addOrEditDataset = this.isNew ? postDataset(entity) : putDataset(entity.id, entity);
                let externalFn = this.colonyTitle == '上载'?uploadStandardbd(this.clusterName,this.ids):uninstallStandardbd(this.clusterName,this.ids)
                externalFn.then(res=>{
                    this.dialogVisibleExport = false
                    this.listTable()
                }, err => {
                    this.$message({
                        message: err.response.data.err,
                        type: 'error',
                        duration: 1500
                    });
                })

            },
            //修改schema的版本号调用的方法
            changeSchemaVersion(callback, row){
                var that = this;
                // 列表下拉，发送请求查看history
                if (callback == true) {
                    that.objectHistory = {}
                    that.loading = true
                    var oid = row.oid ? row.oid : row.id
                    getHistorySchema(oid).then(res => {
                        that.loading = false;
                        that.historySchemaEntity = res
                        res.forEach(item=>{
                            that.objectHistory[item.version] = item
                        })
                    })
                }else{
                    //收回下拉菜单弹出文本框
                    that.schemaEntity = that.objectHistory[row.version]
                    that.showSchemaTable()
                }
            },
            //状态过滤字段
            statusFilter: function (value) {
                var status = {
                    "0": "分析中",
                    "1": "分析成功",
                    "-1": "分析失败",
                }[value]
                status = status? status: "待分析"
                return status
            },
            //打开分析字段选择框
            openExecuteAnalysis: function () {
                this.dialogSchemaFieldsVisible = true;
                this.$refs.schemaFields.showDialog(this.dialogSchemaFieldsVisible, this.dataAnalysisEntity.fields)
            },
            //执行分析
            executeAnalysis: function (selectFields) {
                this.loadingDataAnalysis = true;
                executeDataAnalysis(this.dataAnalysisEntity.id, selectFields).then(res => {
                    this.$message({
                        message: '恭喜你，执行分析已提交成功！',
                        type: 'success'
                    });
                    this.loadingDataAnalysis = false;
                }, err => {
                    this.loadingDataAnalysis = false;
                    this.$message({
                        message: err.response.data.err,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            //取消或者离开页面请吃请求
            cancelAnalysis(isClose) {
                if (isClose) {
                    //如果是关闭弹框时执行
                    this.dialogdataAnalysisVisible = false;
                }
                clearTimeout(this.timer)
                clearInterval(this.timer2)
                this.loadingDataAnalysis = false;
            },
            //页面数据拼凑
            showAnalysisResult(res) {
                this.cancelAnalysis();
                var table = []
                var colStats = res.content.colStats ? Object.keys(res.content.colStats) : [];
                //将后台返回的数据变成前端页面要的形式
                this.dataAnalysisEntity.sizeInBytes = res.content.sizeInBytes
                this.dataAnalysisEntity.status = this.statusFilter(res.content.status)
                this.dataAnalysisEntity.lastAnalyzeTime = res.content.lastAnalyzeTime ? moment(res.content.lastAnalyzeTime).format("YYYY-MM-DD HH:mm:ss") : ''
                this.dataAnalysisEntity.rowCount = res.content.rowCount
                for (var i = 0; i < colStats.length; i++) {
                    table[i] = res.content.colStats[colStats[i]]
                    table[i].name = colStats[i]
                    //最后一个数据添加进去之后就把这个值赋给table
                    if (i == colStats.length - 1) {
                        this.dataAnalysisEntity.table = table
                    }
                }
            },
            //调用获取分解结果轮询接口
            getAnalysisResult: function (datasetId, statementId, clusterId) {
                this.timer = setTimeout(() => {
                    getDataAnalysis(datasetId, statementId, clusterId).then(res => {
                        //如果返回内容直接将内容放到页面停止请求
                        if (res.content) {
                            this.showAnalysisResult(res)
                            return;
                        }
                        //如果返回-1,内容为空，说明没有执行过，不在发请求
                        if (res.statementId == -1) {
                            this.cancelAnalysis();
                            this.$message({
                                message: '请先执行分析，再获取分析结果！',
                                type: 'error',
                                duration: 1500
                            });
                            return;
                        }
                        //如果返回状态不是runing，就显示数据
                        if (res.statement === 'available' || res.statement === 'error' || res.statement === 'cancelled') {
                            this.showAnalysisResult(res)
                        } else {
                            this.getAnalysisResult(datasetId, res.statementId, res.clusterId);
                        }
                    }, err => {
                        this.cancelAnalysis();
                        this.$message({
                            message: err.response.data.err,
                            type: 'error',
                            duration: 1500
                        });
                    })

                }, 1000)
            },
            //数据分析
            dataAnalysis: function (row) {
                this.dialogdataAnalysisVisible = true;
                //刷新就用之前保存的row，新的数据分析就用传进来的值
                this.dataAnalysisEntity = {}
                this.dataAnalysisRow = row ? row : this.dataAnalysisRow
                row = this.dataAnalysisRow
                //弹出数据分析的dialog框
                this.loadingDataAnalysis = true;
                //无论是否请求返回数据，都先厨师或id和字段
                this.dataAnalysisEntity.id = row.id;
                this.dataAnalysisEntity.fields = row.schema.fields
                //等待时间
                this.count = 0
                this.timer2 = setInterval(() => {
                    this.count++
                }, 1000)
                this.getAnalysisResult(row.id, -1)
            },
            emptyCriteria() {
                // 清空搜索组件的条件
                this.searchParameter = queryObject()
                this.empty()
                this.criteria = []
                this.listTable(null, this.resType, 'status')
            },
            getTableData(data) {

            },
            // 高级搜索
            seniorSearch() {
                this.isOrdinary = false
                this.showOverlay = true
                this.listTable(null, this.resType, 'status')
            },
            // 普通搜索
            ordinarySearch() {
                this.isOrdinary = true
                this.emptyCriteria()
                this.listTable(null, this.resType, 'status')
            },
            onCloseOverlay() {
                this.showOverlay = false
            },
            searchTag(data, parameter, empty) {
                this.criteria = data
                this.showOverlay = false
                // 当触发 searchTag 回调的时候把 newSearch 的方法赋值给 resourceMam 的 empty
                this.empty = empty
                this.searchParameter = parameter
                this.listTable(parameter, this.resType, 'status')
            },
            //更改某一页面的显示条数
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter, this.resType, 'status')
            },
            //更改当前所在页
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter, this.resType, 'status')
            },
            //选中某条数据
            handleSelectionChange(val) {
                this.changRow = JSON.parse(JSON.stringify(val))
                this.multipleSelection = val;
                //如果选中数据，数据做参数返回，没有数据参数为空
                this.$emit('thisSelectDateSourceVal', val.length === 0 ? '': val[0] )
                
                let objId = val.map((item,index)=>{
                    return item.id
                })
                let objName = val.map((item,index)=>{
                    return item.name
                })
                this.indexData.objId = objId.toString()
                this.indexData.objName = objName.toString()
                this.isDataset = true
                this.getMuseData('Dataset')
            },
            //查看resourceMan
            handleEdit: function (id, index, row) {
                this.isShow = true
                var type;
                //只有编辑数据源时,根据type判断路由跳转页面
                if (row.type == 'DB') {
                    type = 'DBSource'
                } else if (row.type == 'HTTP') {
                    type = 'httpSource'
                } else if (row.type == 'LOCALFS') {
                    type = 'localfsSource'
                } else if (row.type == 'FTP') {
                    type = 'ftpSource'
                } else if (row.type == 'socket') {
                    type = 'socketSource'
                } else if (row.type == 'MONGODB') {
                    type = 'mongoDBSource'
                } else if (row.type == 'ES') {
                    type = 'esSource'
                } else if (row.storage == "JDBC") {
                    type = 'DBdataset'
                } else if (row.storageConfigurations) {
                    type = 'dataset'
                } else type = this.resType
                //除了数据源其他资源类型都是根据resType一致
                this.$router.push({
                    name: type,
                    params: {parentId: this.navId, id: row.id ? row.id : 'new', tenantId: row.tenantId}
                });
            },
            copySchema: function (type, isCopy) {
                this.$router.push({
                    name: type,
                    params: {
                        parentId: this.selectedNode.id,
                        id: this.multipleSelection[0] ? this.multipleSelection[0].id : 'new',
                        owner: this.selectedNode.owner
                    },
                    query: {isCopy: isCopy}
                });
                this.parentId = this.selectedNode.id;
                this.resType = type
                this.isShow = true
            },
            addOrEdit: function (type) {
                //新建各种数数据	跳转到对应的resourceMan页面， schema有一个复制功能
                this.$router.push({
                    name: type,
                    params: {parentId: this.selectedNode.id, id: 'new', node: this.selectedNode}
                });
                this.parentId = this.selectedNode.id;
                this.resType = type
                this.isShow = true
            },
            //查看schema的值
            showSchemaTable: function (row) {
                row ? this.schemaEntity = row: ''
                this.dialogShowSchemaVisible = true;
            },
            //数据预览
            dataPreview: function (row) {
                this.$refs.dataset.dataPreview(row.id, row.tenantId, row.schemaId)
            },
            delDataset(){
                let ids = this.multipleSelection.map(item=>{
                    return item.id
                })
                deleteDataset(this.delHdfsFlag, ids).then(data => {
                    this.listTable(false, 'dataset');
                    this.dialogDelectDatasetVisible = false
                    this.$message({
                        message: '恭喜你，删除已成功！',
                        type: 'success'
                    });
                }, err => {
                    this.dialogDelectDatasetVisible = false
                    this.$message({
                        message: err.response.data.err,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            // 选中行数据
            delTable: function delTable() {
                var that = this;
                var tbIds = [];
                this.hasHdfs = false
                this.multipleSelection.forEach(function (i, index) {
                    if((that.resType).indexOf('dataset') > -1 && i.storage=='HDFS'){
                        that.hasHdfs = true
                    }
                    var tdId = i.id;
                    tbIds.push(tdId);
                });
                if ((that.resType).indexOf('dataset') > -1) {
                    // 删除之前将删除选框默认为未选中
                    that.delHdfsFlag = false
                    that.dialogDelectDatasetVisible = true
                } else{
                    that.$confirm('真的要删除' + tbIds.length + '个数据?', '提示', {}).then(() => {
                        if (that.resType == 'schema') {
                            deleteSchema(tbIds).then(data => {
                                that.parameter = createParameter("parentId", that.parentId, "EQUAL").Build(that.parameter);
                                that.listTable(false, 'schema');
                                if (data.length == 0) {
                                    that.$message({
                                        message: '恭喜你，删除已成功！',
                                        type: 'success'
                                    });
                                } else {
                                    var mess = ''
                                    data.forEach(function (item) {
                                        mess += item.schema + '_v'+ item.schemaVersion + ', '
                                    })
                                    mess += " 已被dataset使用，不能删除！"
                                    this.$confirm(mess, "错误", {
                                        type: "error"
                                    })
                                }
                            }, error => {
                                var datasetUse = "FOREIGN KEY (`schema_id`)"
                                var err = error.response.data.err
                                if (error.response.data.err.indexOf(datasetUse) > 0) {
                                    err = '此schema已被dataset使用，不能删除！'
                                }
                                this.$message({
                                    message: err,
                                    type: 'error',
                                    duration: 1500
                                });
                            })
                        }else if ((that.resType).toLowerCase().indexOf('source') > -1) {
                            deleteDatasource(tbIds).then(data => {
                                  that.listTable(false, 'datasource');
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
                              }
                            )
                        } else if (that.resType == 'standard') {
                            deleteStandard(tbIds).then(data => {
                                that.listTable(false, 'standard');
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
                    })
                }
            },
            // 导出schema
            exportSchema() {
                if(this.multipleSelection.length == 0){
                    this.$message({
                        type:"error",
                        message:"请至少选择一条数据！"
                    })
                }else {
                    this.getExcel(this.multipleSelection)
                }
            },
            // 下载到本地
            getExcel(selectDatas) {
                require.ensure([], () => {
                    var { export_json_to_excel } = require('@components/jsExcel/Export2Excel')
                    var tHeader = ['名称', '类型', '备注']
                    var filterVal = ['name', 'type', 'description']
                    let sheets = [];
                    // 选中数据
                    selectDatas.forEach(item=>{
                        // 获取字段
                        let data = this.formatJson(filterVal, item.fields)
                        sheets.push({name:item.name,value: data})
                    })
                    let data = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss")
                    export_json_to_excel(tHeader, sheets, 'schema_'+data)
                })
            },
            //获取excel所需数据
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            // 导入schema
            importSchema() {
                this.dialogImportSchemaVisible = true
                this.resourceId = '';
                this.schemaPath = '';
                this.errorMessage = [];
                this.fileList  =[];
            },
            uploadFile: function (data) {
                this.$refs.upload.submit();
            },
            // 上传失败时候方法
            uploadError(error,file,fileList){
                fileList.push(file)
                console.log(file)
                let err = JSON.parse(error.message)
                // 显示错误信息
                this.isError = true;
                this.errorMessage.push (err.msg)
            },
            // 上传失败时候方法
            uploadSuccess(res,file,fileList){
                this.dialogImportSchemaVisible = false;
                message({
                    type:'success',
                    message:'恭喜，上传成功！'
                })
            },
            //导入元数据选取存放位置
            submitSchemaTree(){
                //获取schema的node
                let schemaNode = this.$refs.schematree.selectedNode;
                let that = this;
                if (schemaNode === '') {
                    that.$message({
                        message: '请选择一个目录！',
                        type: 'error'
                    });
                    return false;
                } else {
                    this.schemaPath = schemaNode.path
                    this.resourceId = schemaNode.id
                    this.dialogSchemaTreeVisible = false;
                }
            },
            // 分析
            analysis() {
                this.isShow = true;
                var analysis = {};
                if (this.multipleSelection.length === 0) {
                    analysis.parentId = this.analysisId
                } else {
                    // 根据ids 判断点击是不是目录
                    let ids = []
                    this.multipleSelection.forEach((item) => {
                        ids.push(item.id);
                    })
                    analysis.parentId = this.analysisId
                    analysis.ids = ids
                }
                this.$router.push({path: '/schemaAnalysis/id', query: {id: JSON.stringify(analysis)}});
            },
            // 分析关系
            relation(row) {
                this.getMultipleSelection(this.multipleSelection);
                this.isShow = true;
                let name = row.name;
                this.$router.push({path: '/kinship/id', query: {id: JSON.stringify(name)}});
                // this.$router.resolve({ path: '/kinship/id', query:{id: JSON.stringify(name)}});
                // window.open(routeUrl.href, '_blank', routeUrl.query);
            },
            //调用资源树移动组件
            moveRows: function () {
                var that = this;
                var parameter = {excludes: "", includes: that.selectedNode.resType, strict: true}
                resDirTree(parameter).then(data => {
                    this.treeModel = data;
                    that.dialogResourceTreeVisible = true
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            // 移动
            submitResourceTree: function () {
                //获取resource的node
                var resourceNode = this.$refs.resourcetree.selectedNode;
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdId = i.id;
                    tbIds.push(tdId);
                });
                var dirId = resourceNode.id
                if (!dirId) {
                    this.$message({
                        message: "请选择一条数据",
                        type: 'error',
                        duration: 1500
                    });
                    return false
                }
                that.$confirm('真的要移动' + tbIds.length + '个数据?', '提示', {}).then(() => {
                    moveResource(dirId, 'rows', tbIds).then(data => {
                        //刷新列表
                        that.listTable()
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                })
                that.dialogResourceTreeVisible = false
            },
            //根据过期时间过滤结果
            expiredPeriodFormat: function (row, column) {
                let exPerName = row.expiredPeriod;
                if (exPerName == 0 || exPerName > 200000000000) {
                    return "永不过期";
                } else {
                    return moment(row.createTime + exPerName * 1000).format("YYYY-MM-DD HH:mm:ss");
                }
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
            listTable: function listTable(parameter, type, status) {
                this.table.content = []
                var that = this;
                that.parameter = queryObject()
                if (!this.isOrdinary) {
                    //将owner的equal换成like
                    that.parameter = createParameter('parentId', that.navId, 'EQUAL').Build(this.searchParameter, false)
                    that.parameter.limit = this.pagesize
                    that.parameter.offset = (this.currentPage - 1) * that.pagesize
                } else {
                    that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput);
                    that.parameter = createParameter('parentId', that.navId, 'EQUAL').Build(that.parameter);
                    //将owner的equal换成like
                }
                if (status === 'status') {
                    that.parameter.sortObject.field = that.prop
                    that.parameter.sortObject.orderDirection = that.orderDirection
                }
                if (!type) type = that.resType;
                if (type == 'dataset' || type == 'schema') {
                    var typeTmp = type + "s"
                    that.loading = true
                    listData2(that.parameter, typeTmp).then(data => {
                        that.table = data;
                        that.loading = false;
                        //console.log("multipleSelectionState",that.multipleSelectionState);

                        if (that.multipleSelectionState.length != 0) {
                            that.$nextTick(function () {
                                that.table.content.forEach(row => {
                                    let multipleSelectionData = cloneDeep(that.multipleSelectionState);
                                    for (let j = 0; j < multipleSelectionData.length; j++) {
                                        if (row.id === multipleSelectionData[j].id) {
                                            that.$refs.multipleSelectionTable.toggleRowSelection(
                                              row,
                                              true
                                            );
                                        }
                                    }
                                });
                            })
                        }
                    }, err => {
                        that.loading = false
                        if (err.response.message === 'No value present') {
                            err.response.message = '文件已经删除， 请选择新的目录'
                        }
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                } else {
                    type = type == 'standard' ? 'standardbd' : type
                    that.loading = true
                    listData(that.parameter, type).then(data => {
                        that.table = data;
                        that.loading = false
                    }, err => {
                        that.loading = false
                        if (err.response.message === 'No value present') {
                            err.response.message = '文件已经删除， 请选择新的目录'
                        }
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },
            //列表排序
            getOrder: function (column) {
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
                that.parameter = createParameter().Limit(this.pagesize).Sort(column.prop, this.orderDirection).Build(that.parameter, false);
                that.listTable(that.parameter, this.resType, 'status');
            },
            initPage() {
                if (this.$route.query.resType) {
                    this.noData = false;
                    this.beData = true;
                    this.isShow = false;
                    this.resType = this.$route.query.resType;
                    this.navId = this.$route.query.navId;
                    this.owner = this.$route.query.owner;
                    this.emptyCriteria();
                    if (this.$route.query.resType == "dataset") {
                        this.resType = 'dataset'
                    }
                }
                if (JSON.parse(localStorage.getItem("parameter"))) {
                    let localparam = JSON.parse(localStorage.getItem("parameter"));
                    this.parameter.limit = localparam.limit;
                    this.parameter.offset = localparam.offset;
                    this.currentPage = (this.parameter.offset / this.parameter.limit) + 1;
                    this.pagesize = localparam.limit;
                }
            },
            creatIndexFn(){
                if( this.multipleSelection.length==0){
                    this.indexData.objId = this.selectedNode.id
                    this.indexData.objName = this.selectedNode.name
                }
                console.log('this.isDataset',this.isDataset)
                if(this.isDataset){
                    this.indexData.objType = 'Dataset'
                }else {
                    this.indexData.objType = 'ResourceDesc'
                }
                this.dialogCreatIndexVisible = true
            },
            submitCreatIndex(){
                console.log( this.$refs.creatref.form)
                let data = {
                    ...this.$refs.creatref.form
                }
                backendCreate(data).then((res)=>{
                    
                },err=>{
                    console.log(err)
                })
                this.dialogCreatIndexVisible = false
            },
            getObjIndex(data){
                console.log('getObjIndex',data)
                this.isDataset = false
                this.indexData.objId = data.id
                this.indexData.objName = data.name
                this.getMuseData('ResourceDesc')
            },
            contentQuery(rowData){
                this.dialogContentQueryVisible = true
                this.$refs.queryDialog.showdialog(this.dialogContentQueryVisible,rowData)
                
            }
            
        },
        mounted() {
            var that = this
            //判断在某条数据源详情时候刷新也要重新请求，保证页面不会丢失
            if (window.location.hash == '#/resourceMan' && !that.selectedNode.id) {
                that.isShow = false
                that.beData = false
            } else {
                that.isShow = true
                that.noData = false
            }
            if (that.$route.params.parentId == 'hippo') {
                that.isShow = true
            }
            //清空列表
            resIn.$on('clearList', () => {
                that.table = [];
            })
            //  刷新列表
            resIn.$on('refreshList', (parameter, type) => {
                that.resType = type
                that.parameter = createParameter("parentId", that.parentId, "EQUAL").Build(that.parameter);
                that.listTable(parameter, type);
                that.isShow = false
            });
            // 用$on事件来接收参数
            resIn.$on('childMethod', (data) => {
                this.searchParameter = queryObject()
                this.analysisId = data.id
                //清除table和date的查询条件
                that.startTime = ''
                that.endTime = ''
                that.searchInput = ''
                that.currentPage = 1
                that.pagesize = 8
                //全选halfSelect=true：能添加数据 false：不能添加数据
                that.hasAuthority = data.halfSelect
                //获取资源目录类型,没有默认是source
                that.resType = !data.resType ? 'dataset': data.resType.substring(0, data.resType.indexOf('_dir'))
                //如果是dataset显示过期时间和预览数据
                if (that.resType == 'dataset') {
                    this.columns = this.dataSetColumns
                    this.interFace = '/api/datasets'
                } else if ((that.resType).toLowerCase().indexOf('source') > -1){
                    this.interFace = '/api/woven/datasource'
                    this.columns = this.datasourcesColumns
                } else if (that.resType == 'schema'){
                    this.columns = this.schemasColumns
                    this.interFace = '/api/schemas'
                }else if ((that.resType).toLowerCase().indexOf('standard') > -1) {
                    this.columns = this.standardsColumns
                    this.interFace = '/api/woven/standardbd'
                }
                that.navId = data.id;
                localStorage.setItem('navId', JSON.stringify(that.navId));
                if (!that.navId) {
                    that.table = [];
                    that.noData = true;
                }
                that.noData = false;
                that.beData = true;
                that.selectedNode = data
                this.getObjIndex(that.selectedNode)
                
                that.owner = data.owner;
                localStorage.setItem('owner', JSON.stringify(that.owner))
                //return;
                // 切换的时 清空搜索选项，调刷新页面接口
                this.emptyCriteria()
                that.$router.push({
                    path: '/resourceMan',
                    query: {navId: that.navId, owner: that.owner, resType: that.resType}
                });
                that.parentId = data.id;
                that.isShow = false
                if (that.$refs.refSearchDate)
                    that.$refs.refSearchDate.initParameter()
                if (that.$refs.refSearchTable)
                    that.$refs.refSearchTable.initParameter()
            })
            that.$refs.multipleSelectionTable.clearSort();
            this.initPage();
        },
        beforeRouteLeave: function (to, from, next) {
            resIn.$off()
            next();
        },
        watch: {
            parameter() {
                localStorage.setItem("parameter", JSON.stringify(this.parameter));
            },
            indexData:{
                handler(val){
                    console.log('watch indexData',val)
                },
                deep: true
            }
        },
    }

</script>

<style lang="scss" scoped>
    .btnClass {
        display: flex;

        .criteria {
            width: 45%
        }

        .btn-right {
            margin-left: auto;
        }

        .buttonBg {
            background: #e4e4e4;
        }
    }

    .dn-content {
        float: left;
        width: 99.8%;
        position: relative;
        padding-left: 250px;
        box-sizing: border-box;
        height: 100%;

        .dn-data {
            position: relative;

            .el-table {
                .editName {
                    color: #2182e4;
                    cursor: pointer
                }

                .editName:hover {
                    text-decoration: underline;
                }
            }
        }
    }
    .data-content{
        height: calc(100vh - 300px);
    }
    .dn-content .dn-no-data {
        position: fixed;
        width: 100%;
        box-sizing: border-box;
        height: 100%;
        z-index: -1;
    }

    .dn-content .dn-no-data .noData {
        position: absolute;
        width: 150px;
        height: 70px;
        top: 30%;
        left: 50%;
        margin-left: -175px;
        color: #cccccc;

        p {
            text-align: center;
            font-size: 0.8rem;
            margin: 0px;
        }

        i {
            width: 150px;
            height: 70px;
            line-height: 70px;
            font-size: 3rem;
        }
    }

    .res-table {
        max-height: 750px;
        overflow-y: auto;
    }

    .dataAnalysisindex {
        width: 100%;

        .dataAnalysisindexItem {
            display: inline;
            width: 25%;

            p {
                display: inline-block;
                width: 8%;
                text-align: center;
            }

            .el-input {
                width: 15%;
                box-sizing: border-box;
            }
        }
    }
</style>
