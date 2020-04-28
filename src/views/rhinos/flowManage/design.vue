
<template>
  <section class="design-content" id="bm-rh-flowManage-design">
    <!-- 引入二级菜单组件 -->
    <div :style="{display: collapsed ? 'none' : 'inherit'}">
      <design-nav></design-nav>
    </div>
    <!-- 内容区 -->
    <div
      class="dn-content"
      id="design"
      :style="{padding: collapsed ? '0px 0px 0px 0px' : '0px 0px 0px 250px'}"
    >
      <div v-if="$route.path !='/design'" class="flexibleDes2" @click.prevent="collapse">
        <i :class="collapsed?'icon iconfont icon-ir-navRight':'icon iconfont icon-ir-navLeft'"></i>
      </div>
      <router-view></router-view>
      <div class="dn-data" v-if="beData">
        <div class="btnClass">
          <div class="btn-left">
            <div v-if="showDesign" class="design-route">
              <div class="flexibleDes" @click.prevent="collapse">
                <i
                  :class="collapsed?'icon iconfont icon-ir-navRight':'icon iconfont icon-ir-navLeft'"
                ></i>
              </div>
            </div>
            <div class="design-flowtype">
              <h4>类型</h4>
              <el-select v-model="flowType" placeholder="all" @change="handleTypeValue">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :name="item.value"
                  :label="item.value| cn"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>

            <el-input
              placeholder="请输入名称"
              v-model="searchInput"
              @keyup.enter.native="searchKeyup"
              class="input-with-search"
              name="seachInput"
            >
              <el-button
                slot="append"
                @click="searchTable"
                icon="icon iconfont icon-ir-search"
                name="searchTable"
              ></el-button>
            </el-input>

            <el-date-picker
              v-model="dateValue"
              type="daterange"
              @change="handledateValue"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <!-- <div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
            <div v-show="endTime" ref="endTime">{{dateValue[1]}}</div>-->
          </div>
          <div class="btn-right">
            <!--添加一个通过json临时创建flow的按钮-->
            <el-button type="info" @click="addFlowBtn">
              <i class="icon iconfont icon-ir-add iconStyle" name="addFlowBtn"></i>新建
            </el-button>
            <el-button
              type="info"
              @click="deleteFlow"
              :disabled="multipleSelection.length == 0"
              name="deleteFlow"
            >
              <i class="icon iconfont icon-ir-directory-delete iconStyle"></i>删除
            </el-button>

            <!--复制 重命名 移动 制作 下拉面板-->
            <el-dropdown class="sel_down" trigger="click" @command="otherOperationsFlow">
              <span class="el-dropdown-link">
                <el-button
                  :disabled="multipleSelection.length == 0"
                  type="info"
                  class="dropdown-toggle"
                  toggle="dropdown"
                  name="dropdown-toggle"
                >
                  <i class="icon iconfont icon-ir-triangle-down"></i>操作
                </el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-show="multipleSelection.length == 1"
                  command="flowRename"
                  uib-tooltip="重命名"
                  name="flowRename"
                >
                  <i class="fa fa-edit"></i>&nbsp;重命名
                </el-dropdown-item>
                <el-dropdown-item
                  v-show="multipleSelection.length == 1"
                  command="flowCopy"
                  uib-tooltip="复制"
                  name="flowCopy"
                >
                  <i class="fa fa-clone"></i>&nbsp;复制
                </el-dropdown-item>
                <el-dropdown-item
                  v-show="multipleSelection.length >= 1"
                  command="flowMove"
                  uib-tooltip="移动"
                  name="flowMove"
                >
                  <i class="fa fa-arrows"></i>&nbsp;移动
                </el-dropdown-item>
                <!-- <el-dropdown-item command="flowJson" uib-tooltip="制作Json" ><i class="fa fa-tasks" name="flowJson"></i>&nbsp;制作Json</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <!--新建流程 弹出框-->
        <el-dialog
          title="新建流程"
          :visible.sync="dialogAddFlowVisible"
          width="50%"
          @close="dialogAddFlowVisible = false"
          class="el-body-padding"
        >
          <el-form id="bm-addflow-dialog-form">
            <el-form-item label="名称:">
              <el-input type="text" v-model="addFlowName" auto-complete="off" name="addFlowName"></el-input>
            </el-form-item>
            <el-form-item label="流程类型:">
              <el-select style="width: 100%;" v-model="addFlowType" placeholder="请选择流程类型">
                <el-option
                  v-for="item in ['dataflow','workflow','streamflow']"
                  :key="item"
                  :label="item| cn"
                  :name="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              :disabled="addFlowNameStatus || !addFlowType"
              type="primary"
              @click="addFlow"
              name="addFlow-sure"
            >确定</el-button>
            <el-button @click="dialogAddFlowVisible = false" name="addFlow-cancel">取消</el-button>
            <!-- Pattern p1 = Pattern.compile("\\s") -->
          </span>
        </el-dialog>

        <!--重命名 弹出框-->
        <el-dialog
          title="重命名流程"
          :visible.sync="dialogRenameVisible"
          width="50%"
          @close="dialogRenameVisible = false"
          class="el-body-padding"
        >
          <el-form id="bm-renameflow-dialog-form">
            <el-form-item label="名称:">
              <el-input type="text" v-model="reName" auto-complete="off" name="reName"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              :disabled="!reName"
              type="primary"
              @click="renameFlow"
              name="renameFlow-sure"
            >确定</el-button>
            <el-button @click="dialogRenameVisible = false" name="renameFlow-cancel">取消</el-button>
          </span>
        </el-dialog>

        <!--复制 弹出框-->
        <el-dialog
          title="复制流程"
          :visible.sync="dialogCopyVisible"
          width="50%"
          @close="dialogCopyVisible = false"
          class="el-body-padding"
        >
          <el-form id="bm-copyflow-dialog-form">
            <el-form-item label="名称:">
              <el-input type="text" v-model="reName" auto-complete="off" name="rename2"></el-input>
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
          width="50%"
          class="el-body-padding"
        >
          <el-form id="bm-flowjson-dialog-form">
            <el-form-item label="FlowJson">
              <el-input
                auto-complete="off"
                type="textarea"
                :rows="15"
                placeholder="请输入flowJson"
                name="flowJson"
                v-model="form"
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveFlow" name="saveFlow-sure">确定</el-button>
            <el-button @click="dialogNewFlowJsonVisible = false" name="saveFlow-sure">取消</el-button>
          </span>
        </el-dialog>
        <!--流程导出 弹出框-->
        <el-dialog
          title="流程导出"
          :visible.sync="dialogExportFlowVisible"
          width="50%"
          class="el-body-padding"
        >
          <el-form id="bm-exportflow-dialog-form">
            <el-form-item>
              <!--导出流程-->
              <p v-if="tbIdsLen>0 && tbIdsLen<51">确定要导出{{navPname}}中选中的{{tbIdsLen}}条流程?</p>
              <p v-if="tbIdsLen>50">选中flow数目（{{tbIdsLen}}）大于每次最多导出条数（50），数目过多，请选择目录形式导出！</p>
              <!--导出目录-->
              <div v-if="tbIdsLen===0">
                确定要导出目录{{navPname}}，下所有流程?
                <div>
                  <el-checkbox auto-complete="off" v-model="withChildDir">包含子目录</el-checkbox>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-checkbox auto-complete="off" v-model="withDependencies">级联导出</el-checkbox>
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
          width="50%"
          class="el-body-padding"
        >
          <template>
            <el-form
              id="bm-importflow-dialog-form"
              name="fileinfo"
              method="post"
              enctype="multipart/form-data"
            >
              <el-form-item>选择上传的文件</el-form-item>
              <el-upload
                :show-file-list="false"
                action="/api/mis/upload"
                class="upload-demo"
                :headers="{'X-AUTH-TOKEN':xToken}"
                :multiple="true"
                :on-success="uploadFile"
                :file-list="fileList"
              >
                <el-button
                  slot="trigger"
                  style="margin-left: 10px;"
                  size="small"
                  type="primary"
                  name="scan"
                >浏览</el-button>
                <!--<div slot="tip" class="el-upload__tip">只能上传zip/jar文件</div>-->
              </el-upload>
              <div v-if="importOk">
                <!--<span style="padding-left: 20px;">{{fileList}}</span>-->
                <div class="el-row" style=" padding-top: 20px;">
                  <div style=" padding-bottom: 20px;">
                    <el-table
                      :data="file.flow"
                      v-if="file.flow.length>0"
                      id="bm-rh-flowManage-flowTable"
                    >
                      <el-table-column label="flow" prop="name"></el-table-column>
                    </el-table>
                  </div>
                  <div style=" padding-bottom: 20px;">
                    <el-table
                      :data="file.dataset"
                      v-if="file.dataset.length>0"
                      id="bm-rh-flowManage-datasetTable"
                    >
                      <el-table-column label="dataset" prop="name"></el-table-column>
                    </el-table>
                  </div>
                  <div style=" padding-bottom: 20px;">
                    <el-table
                      :data="file.schema"
                      v-if="file.schema.length>0"
                      id="bm-rh-flowManage-schemaTable"
                    >
                      <el-table-column label="schema" prop="name"></el-table-column>
                    </el-table>
                  </div>
                </div>

                <div v-if="file.flow&&file.flow.length>0">
                  <span style=" margin-bottom: 20px;">导入信息:</span>
                  <span
                    style="padding-left: 20px;margin-bottom: 20px;"
                    v-if="file.flow&&file.flow.length>0"
                  >流程: {{file.flow.length}}</span>
                  <div
                    class="list-group-item no-border col-sm-12 no-padding top-margin-5"
                    v-if="file.flow&&file.flow.length>0"
                  >
                    <el-checkbox
                      v-model="file.overWrite"
                      @click="file.overWrite=!file.overWrite"
                    >覆盖(如果已经存在, 默认为跳过)</el-checkbox>
                    <a>
                      <span></span>
                    </a>
                  </div>
                  <div
                    style=" margin-top: 20px;"
                    class="list-group-item no-border col-sm-12 no-padding top-margin-10"
                    v-if="file.flow&&file.flow.length>0"
                  >
                    <span style="color: red">
                      <strong>警告: 导入前请检查数据的正确性, 备份相关数据, 导入操作无法撤销.</strong>
                    </span>
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
        <!-- ResourceTree dialog-->
        <el-dialog
          :visible.sync="dialogResourceTreeVisible"
          width="50%"
          :close-on-click-modal="false"
          :modal-append-to-body="false"
          :title="'Resource tree'| cn"
        >
          <el-form id="bm-resourcetree-dialog-form">
            <resource-tree ref="resourcetree" :theModel="treeModel"></resource-tree>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitResourceTree()" name="resourceTree-sure">确定</el-button>
            <el-button @click="dialogResourceTreeVisible=false" name="resourceTree-cancel">取消</el-button>
          </div>
        </el-dialog>

        <div class="rf-swap">
          <el-table
            v-loading="loading"
            :data="table.content"
            tooltip-effect="dark"
            id="bm-rh-flowManage-table"
            @selection-change="handleSelectionChange"
            @sort-change="getOrder"
            height="calc( 100vh - 175px )"
            style="width: 100%"
          >
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="name" label="名称" sortable="custom">
              <template slot-scope="scope">
                <span
                  class="editName"
                  @click="handleEdit(scope.row.id,scope.row.flowType, scope.$index, scope.row)"
                >{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="flowType" label="类型" sortable="custom" width="100">
              <template slot-scope="scope">{{scope.row.flowType | cn}}</template>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" sortable="custom" width="100"></el-table-column>

            <el-table-column prop="version" label="版本" sortable="custom" align="center" width="80"></el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              sortable="custom"
              :formatter="dateFormat"
              width="180"
            ></el-table-column>
            <el-table-column prop="lastModifier" label="修改人" sortable="custom" width="100"></el-table-column>
            <el-table-column
              prop="lastModifiedTime"
              label="修改时间"
              sortable="custom"
              :formatter="dateFormat"
              width="180"
            ></el-table-column>
            <el-table-column prop="name" label="计划" width="100" fixed="right">
              <template slot-scope="scope">
                <span
                  class="editName"
                  @click="handleEditplan(scope.row.id,scope.row.flowType, scope.$index, scope.row)"
                >计划</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="执行历史" width="180" fixed="right">
              <template slot-scope="scope">
                <span
                  class="editName"
                  @click="handleEdithis(scope.row.id,scope.row.flowType, scope.$index, scope.row)"
                >执行历史</span>
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
            :total="table.totalElements"
          ></el-pagination>
        </div>
      </div>

      <!-- 无数据 -->
      <div class="dn-no-data" v-if="noData">
        <div class="noData">
          <p>
            <i class="icon iconfont icon-ir-no-data"></i>
          </p>
          <p>暂无数据，请选择</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import resourceTree from "@resourceTree/resourceTree.vue";
import designNav from "@design/designTree/designNav.vue";
import {
  designTableList,
  addFlow,
  drawSaveData,
  delFlow,
  exportFlow,
  importFlow,
  resDirTree,
  moveResource
} from "@api";
import desIn from "@design/designTree/desNav.js";
import { deepCopy } from "@function/comFunction";
import { createParameter } from "@function/queryParameter.js";

/**
 * 当前时间
 * ------------------------------------------------------------------
 */
function createRandomTime() {
  return new Date().getTime();
}
export default {
  components: {
    resourceTree,
    designNav
  },
  data() {
    return {
      hasAuthority: false, //没有权限，可以创建数据
      options: [
        {
          value: "all",
          label: "全部类型"
        },
        {
          value: "dataflow",
          label: "批处理"
        },
        {
          value: "workflow",
          label: "工作流"
        },
        {
          value: "streamflow",
          label: "流处理"
        }
      ],
      collapsed: false,
      flowType: "all",
      noData: true,
      beData: false,
      table: [],
      disId: "",
      multipleSelection: [],
      dateValue: [],
      startTime: false,
      endTime: false,
      searchInput: "",
      show: false,
      showDesign: false,
      currentPage: 1,
      pagesize: 8,
      dialogAddFlowVisible: false,
      dialogRenameVisible: false,
      dialogCopyVisible: false,
      dialogNewFlowJsonVisible: false,
      form: {},
      navPname: "",
      addFlowName: "",
      addFlowNameStatus: true,
      addFlowType: "",
      reName: "",
      loading: true,
      orderDirection: "DESC",
      prop: "lastModifiedTime",
      dialogExportFlowVisible: false,
      dialogImportFlowVisible: false,
      withDependencies: false,
      tbIdsLen: "",
      fileList: [],
      isNew: true,
      flowId: "",
      importOk: false,
      file: {
        flow: [],
        dataset: [],
        schema: [],
        browserEnabled: true,
        okEnabled: false,
        f: {},
        overWrite: false
      },
      xToken: sessionStorage["x-auth-token"],
      selectedNode: {},
      withChildDir: false,
      ownerId: "",
      treeModel: "",
      dialogResourceTreeVisible: false,
      status: "",
      parameter: {}
    };
  },
  watch: {
    $route(to, from) {
      var _this = this;
      var fromPath = from.path;
      var toPath = to.path;

      if (fromPath == "/design" && toPath.indexOf("/design/plan") == 0) {
        this.showDesign = true;
        this.beData = false;
      }

      if (toPath == "/design" && fromPath.indexOf("/design/plan") == 0) {
        this.showDesign = false;
        this.beData = true;
      }

      if (
        fromPath == "/design" &&
        toPath.indexOf("/design/executingHistory") == 0
      ) {
        this.showDesign = true;
        this.beData = false;
      }

      if (
        toPath == "/design" &&
        fromPath.indexOf("/design/executingHistory") == 0
      ) {
        this.showDesign = false;
        this.beData = true;
      }

      if (
        fromPath.indexOf("/design/designDrawing/") != "-1" &&
        toPath == "/design"
      ) {
        // 获取缓存数据
        this.status = sessionStorage.getItem("status");
        //从design页面跳到designdraw在点返回执行列表
        if (this.status == "newData") {
          if (to.path === "/design") {
            this.beData = true;
            this.noData = false;
            var parameter = createParameter().Build(
              this.buildParameters(
                this.pagesize,
                this.currentPage,
                this.startTime,
                this.endTime,
                this.searchInput
              )
            );
            parameter.sortObject.field = this.prop;
            parameter.sortObject.orderDirection = this.orderDirection;
            this.listTable(parameter);
          }
          this.status = "oldData";
          sessionStorage.setItem("status", this.status);
        } else if (this.status == "oldData" || this.status == null) {
          //从监控新页面跳到designdraw在点返回执行列表
          _this.disId = sessionStorage.getItem("desFindFlowsId");
          _this.ownerId = sessionStorage.getItem("userId");
          _this.pagesize = 8;
          _this.beData = true;
          _this.noData = false;
          var parameter = createParameter("parentId", _this.disId, "EQUAL")
            .Limit(_this.pagesize)
            .Sort(_this.prop, _this.orderDirection)
            .Build();
          _this.listTable(parameter);
        }
        this.status = "oldData";
        sessionStorage.setItem("status", this.status);
      }

      // new designer

      if (
        (fromPath.indexOf("/streamflow") != "-1" ||
          fromPath.indexOf("/dataflow") != "-1" ||
          fromPath.indexOf("/workflow") != "-1") &&
        toPath == "/design"
      ) {
        // 获取缓存数据
        this.status = sessionStorage.getItem("status");
        //从design页面跳到designdraw在点返回执行列表
        if (this.status == "newData") {
          if (to.path === "/design") {
            this.beData = true;
            this.noData = false;
            var parameter = createParameter().Build(
              this.buildParameters(
                this.pagesize,
                this.currentPage,
                this.startTime,
                this.endTime,
                this.searchInput
              )
            );
            parameter.sortObject.field = this.prop;
            parameter.sortObject.orderDirection = this.orderDirection;
            this.listTable(parameter);
          }
          this.status = "oldData";
          sessionStorage.setItem("status", this.status);
        } else if (this.status == "oldData" || this.status == null) {
          //从监控新页面跳到designdraw在点返回执行列表
          _this.disId = sessionStorage.getItem("desFindFlowsId");
          _this.ownerId = sessionStorage.getItem("userId");
          _this.pagesize = 8;
          _this.beData = true;
          _this.noData = false;
          var parameter = createParameter("parentId", _this.disId, "EQUAL")
            .Limit(_this.pagesize)
            .Sort(_this.prop, _this.orderDirection)
            .Build();
          _this.listTable(parameter);
        }
        this.status = "oldData";
        sessionStorage.setItem("status", this.status);
      }
    },
    parameter() {
      localStorage.setItem("parameter", JSON.stringify(this.parameter));
    },
    addFlowName: {
      handler(newValue, oldValue) {
        if (newValue.trim("") === "") {
          this.addFlowNameStatus = true;
        } else {
          this.addFlowNameStatus = false;
        }
      },
      deep: true
    }
  },
  methods: {
    getNavId(desId) {
      this.desId = desId;
    },
    //折叠导航栏
    collapse() {
      this.collapsed = !this.collapsed;
    },
    handleSizeChange(size) {
      this.pagesize = size;
      // var parameter = this.buildParameters();
      this.parameter = createParameter().Build(
        this.buildParameters(
          this.pagesize,
          this.currentPage,
          this.startTime,
          this.endTime,
          this.searchInput
        )
      );
      this.parameter.sortObject.field = this.prop;
      this.parameter.sortObject.orderDirection = this.orderDirection;
      this.listTable(this.parameter);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      // var parameter = this.buildParameters();
      this.parameter = this.buildParameters(
        this.pagesize,
        this.currentPage,
        this.startTime,
        this.endTime,
        this.searchInput
      );
      this.parameter.sortObject.field = this.prop;
      this.parameter.sortObject.orderDirection = this.orderDirection;
      this.listTable(this.parameter);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handledateValue(val) {
      if (val == null) {
        this.dateValue = [];
      } else {
        this.dateValue = [val[0], val[1] + 86399000];
      }
      var parameter = this.buildParameters();
      this.listTable(parameter);
    },
    //flow类型选择
    handleTypeValue(val) {
      this.searchInput = "";
      this.dateValue = [];
      var parameter = this.buildParameters();
      this.listTable(parameter);
    },
    //table list
    listTable(parameter) {
      this.loading = true;
      // GET /someUrl
      if (!parameter) {
        var parameter = createParameter(
          "parentId",
          this.disId,
          "EQUAL"
        ).Build();
      }
      designTableList(parameter)
        .then(data => {
          sessionStorage.setItem("projectId", "");
          this.loading = false;
          this.table = data;
        })
        .catch(() => {});
    },
    resetAll() {
      this.currentPage = 1;
      this.pagesize = 8;
    },
    searchTable() {
      this.currentPage = 1;
      var parameter = this.buildParameters();
      this.listTable(parameter);
    },
    searchKeyup() {
      var parameter = this.buildParameters();
      this.listTable(parameter);
    },
    buildParameters() {
      var limit = this.pagesize;
      var offset = (this.currentPage - 1) * this.pagesize;
      var query =
        this.searchInput.length > 0 ? "%" + this.searchInput + "%" : "%";
      var parameter = createParameter("parentId", this.disId, "EQUAL")
        .Limit(limit)
        .Offset(offset)
        .Build();
      if (query != "%") {
        parameter = createParameter("name", query, "LIKE").Build(parameter);
      }
      if (this.flowType != "all") {
        parameter = createParameter("flowType", this.flowType, "EQUAL").Build(
          parameter
        );
      }
      if (this.dateValue) {
        if (this.dateValue.length == 0) {
        } else {
          parameter = createParameter(
            "lastModifiedTime",
            Number(this.dateValue[0]),
            "GREATER_THAN"
          )
            .And("lastModifiedTime", Number(this.dateValue[1]), "LESS_THAN")
            .Build(parameter);
        }
      }
      parameter.sortObject.field = this.prop;
      parameter.sortObject.orderDirection = this.orderDirection;
      return parameter;
    },
    //查看design
    handleEdit(id, type, index, row) {
      this.status = "updata";
      this.showDesign = true;
      this.beData = false;
      sessionStorage.setItem("type", type);
      this.status = "newData";
      sessionStorage.setItem("status", this.status);
      this.$router.push({ name: "流程设计",params:{id:id},query:{type:type }});
    },
    //查看design 计划
    handleEditplan(id, type, index, row) {
      this.status = "updata";
      // this.showDesign = true;
      // this.beData = false;
      this.$router.push({
        name: "计划 ",
        params: { id: id },
        query: { type: type }
      });
      this.status = "newData";
    },
    //查看design 执行历史
    handleEdithis(id, type, index, row) {
      this.status = "updata";
      // this.showDesign = true;
      // this.beData = false;
      this.$router.push({
        name: "执行历史",
        params: { id: id },
        query: { type: type }
      });

      this.status = "newData";
    },
    //创建flow 按钮
    addFlowBtn() {
      if (this.hasAuthority) {
        this.dialogAddFlowVisible = true;
        this.addFlowName = "";
        this.addFlowType = "";
      } else {
        this.$message({
          message: "该目录没有创建数据的权限！",
          type: "error"
        });
      }
    },
    //创建flow 确认
    addFlow() {
      var _this = this;
      var flowParameters = {
        name: this.addFlowName,
        flowType: this.addFlowType,
        resource: {
          id: this.disId
        },
        steps: [],
        links: []
      };
      addFlow(flowParameters).then(
        data => {
          this.dialogAddFlowVisible = false;
          _this.$message({
            message: "恭喜你，新增已成功！",
            type: "success"
          });
          this.listTable();
        },
        error => {
          //                    console.log(error.response)
          if (error.response.status == "500") {
            _this.$message({
              message: error.response.data.err,
              type: "error"
            });
          }
        }
      );
    },
    //通过json创建flow
    saveFlow() {
      this.dialogNewFlowJsonVisible = false;
      var json = JSON.parse(this.form);
      addFlow(json).then(
        res => {
          this.$message({
            type: "success",
            message: "保存成功"
          });
        },
        err => {
          this.$message({
            type: "error",
            message: err.response.data.err
          });
        }
      );
    },
    //移动flow
    removeFlow() {
      var that = this;
      var parameter = {
        excludes: "",
        includes: that.selectedNode.resType,
        strict: true
      };
      resDirTree(parameter).then(
        data => {
          this.treeModel = data;
          that.dialogResourceTreeVisible = true;
        },
        err => {
          var _this = this;
          if (err.response.status == 500) {
            _this.$message({
              message: err.response.message,
              type: "error",
              duration: 1500
            });
          }
        }
      );
    },
    submitResourceTree() {
      //获取resource的node
      var resourceNode = this.$refs.resourcetree.selectedNode;
      var that = this;
      var tbIds = [];
      this.multipleSelection.forEach(function(i, index) {
        var tdId = i.id;
        tbIds.push(tdId);
      });
      var dirId = resourceNode.id;
      that
        .$confirm("真的要移动" + tbIds.length + "个数据?", "提示", {})
        .then(() => {
          moveResource(dirId, "rows", tbIds).then(
            data => {
              //刷新列表
              that.listTable();
            },
            err => {
              this.$message({
                message: err.response.message,
                type: "error",
                duration: 1500
              });
            }
          );
        });
      that.dialogResourceTreeVisible = false;
    },
    //删除flow
    deleteFlow() {
      var tbIds = [];
      var that = this;
      this.multipleSelection.forEach(function(i, index) {
        var tdIds = i.id;
        tbIds.push(tdIds);
      });
      this.$confirm("真的要删除" + tbIds.length + "个数据?", "提示", {}).then(
        () => {
          delFlow(tbIds).then(data => {
            that.listTable();
            that.$message({
              message: "恭喜您，删除已成功！",
              type: "success"
            });
          });
        }
      );
    },

    //重命名flow
    renameFlow() {
      let _this = this;
      let thisData = {};
      this.multipleSelection.forEach(function(i, index) {
        thisData = deepCopy(i);
        if (_this.reName == thisData.name) {
          _this.$message({
            message: "名称在目录中必须是唯一的！",
            type: "error"
          });
        } else {
          thisData.name = _this.reName;
          thisData.lastModifiedTime = createRandomTime();
          drawSaveData(thisData.id, thisData).then(
            data => {
              _this.dialogRenameVisible = false;
              _this.listTable();
              _this.$message({
                message: "恭喜您，修改已成功！",
                type: "success"
              });
            },
            error => {
              if (error.response.status == "500") {
                _this.$message({
                  message: error.response.data.err,
                  type: "error"
                });
              }
            }
          );
        }
      });
    },

    //复制flow
    copyFlow() {
      let _this = this;
      let thisData = {};
      this.multipleSelection.forEach(function(i, index) {
        thisData = deepCopy(i);
        thisData.name = _this.reName;
        delete thisData.id;
        thisData.resource = {
          id: _this.disId
        };
        thisData.createTime = createRandomTime();
        thisData.lastModifiedTime = createRandomTime();
        addFlow(thisData).then(
          data => {
            _this.dialogCopyVisible = false;
            _this.listTable();
            _this.$message({
              message: "恭喜您，复制已成功！",
              type: "success"
            });
          },
          error => {
            if (error.response.status == "500") {
              _this.$message({
                message: error.response.data.err,
                type: "error"
              });
            } else {
              _this.$message({
                message: error.response.data.err,
                type: "error"
              });
            }
          }
        );
      });
    },

    //其他操作下拉框的点击事件
    otherOperationsFlow(type) {
      var _this = this;
      //制作json流程事件
      if (type == "flowJson") {
        this.dialogNewFlowJsonVisible = true;
      }

      //流程重命名事件
      if (type == "flowRename") {
        this.dialogRenameVisible = true;
        this.multipleSelection.forEach(function(i, index) {
          _this.reName = i.name;
        });
      }

      //流程复制事件
      if (type == "flowCopy") {
        this.dialogCopyVisible = true;
        this.multipleSelection.forEach(function(i, index) {
          _this.reName = i.name;
        });
      }

      //流程移动事件
      if (type == "flowMove") {
        this.removeFlow();
      }
    },
    //列表排序
    getOrder(column) {
      var that = this;
      if (column.order === "ascending") {
        this.orderDirection = "ASC";
      } else {
        this.orderDirection = "DESC";
      }
      this.prop = column.prop;
      if (column.prop === null) {
        this.prop = "lastModifiedTime";
        return false;
      }
      this.currentPage = 1;
      var parameter = this.buildParameters();
      that.listTable(parameter);
    },
    //流程导出
    flowExport() {
      var that = this;
      var tbIds = [];
      that.multipleSelection.forEach(function(i, index) {
        var tdIds = i.id;
        tbIds.push(tdIds);
      });
      that.tbIdsLen = tbIds.length;
      //导出流程接口
      var para = "";
      if (that.tbIdsLen > 50) {
        that.$confirm("请重新选择", "提示", {
          type: "error"
        });
      } else {
        if (that.tbIdsLen > 0 && that.tbIdsLen < 51) {
          para = "&ids=" + tbIds.toString();
        } else {
          para =
            "&resourceId=" +
            that.selectedNode.id +
            "&withChildDir=" +
            that.withChildDir;
        }
        exportFlow(that.withDependencies, para);
        var parameter = createParameter("parentId", that.disId, "EQUAL")
          .Limit(that.pagesize)
          .Sort(that.prop, that.orderDirection)
          .Build();
        that.listTable(parameter);
        that.$message({
          message: "恭喜你，导出已成功！",
          type: "success"
        });
      }
      that.dialogExportFlowVisible = false;
    },

    //流程导入
    flowImport() {
      var that = this;
      //拼凑成提交要的entity
      that.file.cfd = [];
      that.file.flow.forEach(function(item) {
        that.file.cfd.push(item.path);
      });

      that.file.csm = [];
      that.file.schema.forEach(function(item) {
        that.file.csm.push(item.path);
      });

      that.file.cds = [];
      that.file.dataset.forEach(function(item) {
        that.file.cds.push(item.path);
      });
      that.file.tag = [];
      that.file.processDirId = that.navId;
      that.file.uploadDirectory = that.file.uploadDir;

      importFlow(that.navId, {
        cfd: that.file.cfd,
        cds: that.file.cds,
        csm: that.file.csm,
        tag: that.file.tag,
        processDirId: that.file.processDirId,
        uploadDirectory: that.file.uploadDirectory,
        overWrite: that.file.overWrite
      }).then(
        res => {
          that.$message({
            message: res,
            type: "success"
          });
          that.dialogImportFlowVisible = false;
        },
        err => {
          that.$message({
            message: res,
            type: "error"
          });
        }
      );
    },
    uploadFile(data) {
      var that = this;
      this.$message({
        message: data.msg,
        type: "success"
      });
      that.importOk = true;
      that.file.result = data;
      that.file.flow = data.cfd;
      that.file.dataset = data.cds;
      that.file.schema = data.csm;
      that.file.uploadDir = data.uploadDir;
      that.file.okEnabled = true;
    },
    getSelectLength() {
      var that = this;
      var tbIds = [];
      that.multipleSelection.forEach(function(i, index) {
        var tdIds = i.id;
        tbIds.push(tdIds);
      });
      that.tbIdsLen = tbIds.length;
    },

    initPage() {
      if (this.$route.query.disId) {
        this.beData = true;
        this.noData = false;
        this.disId = this.$route.query.disId;
        this.ownerId = this.$route.query.ownerId;
        this.parameter = createParameter("parentId", this.disId, "EQUAL")
          .Limit(this.pagesize)
          .Sort(this.prop, this.orderDirection)
          .Build();
        if (JSON.parse(localStorage.getItem("parameter"))) {
          let localparam = JSON.parse(localStorage.getItem("parameter"));
          this.parameter.limit = localparam.limit;
          this.parameter.offset = localparam.offset;
          this.currentPage = this.parameter.offset / this.parameter.limit + 1;
          this.pagesize = localparam.limit;
        }
        this.listTable(this.parameter);
      }
    }
  },
  mounted() {
    this.initPage();
    this.getNavId();
    var _this = this;
    //接收数据导出的方法
    desIn.$on("desOptions", function(option) {
      if (option.toLowerCase().indexOf("flowimport") > -1) {
        _this.dialogImportFlowVisible = true;
      } else if (option.toLowerCase().indexOf("flowexport") > -1) {
        _this.getSelectLength();
        _this.dialogExportFlowVisible = true;
      } else {
        _this.$confirm("暂不支持此功能", "错误", {
          type: "error"
        });
      }
    });
    desIn.$on("desParentId", function(parentNode) {
      sessionStorage.setItem("desFindFlowsId", parentNode.id);
    });
    desIn.$on("desChildId", function(nameId, pName, node) {
      _this.resetAll();
      if (pName === "Flows") {
        sessionStorage.setItem("desFindFlowsId", nameId);
      }
      //_this.pagesize = 8
      _this.showDesign = true;
      _this.disId = nameId;
      _this.navPname = pName;
      _this.selectedNode = node;
      _this.ownerId = node.owner;
      _this.hasAuthority = node.halfSelect;

      // var parameter={filter:"parentId="+_this.disId+"&processType=process",limit:"8",offset:"0",query:"",sorts:"-lastModifiedTime"};
      var parameter = createParameter("parentId", _this.disId, "EQUAL")
        .Limit(_this.pagesize)
        .Sort(_this.prop, _this.orderDirection)
        .Build();
      /*如果选中目录树上面的flow节点发送请求，
				如果选中的是其他用户就展示暂无数据，不发送请求*/
      if (node.resType == "flow_dir") {
        _this.beData = true;
        _this.noData = false;
        _this.listTable(parameter);
        //_this.currentPage = 1
        _this.$router.push({
          path: "/design",
          query: { disId: nameId, ownerId: node.owner }
        });
        if (_this.$route.path === "/design") {
          _this.beData = true;
        } else {
          _this.beData = false;
        }
      } else {
        _this.beData = false;
        _this.noData = true;
      }
    });
  },
  beforeRouteLeave: function(to, from, next) {
    desIn.$off();
    next();
    let leavePathPath = to.path;
    if (
      leavePathPath.indexOf("/design/executingHistory/") == "-1" ||
      leavePathPath.indexOf("/design/executingDetail/") == "-1" ||
      leavePathPath.indexOf("/design/plan/") == "-1"
    ) {
      this.status = "oldData";
      sessionStorage.setItem("status", this.status);
    }
  }
};
</script>

<style lang="scss" scoped>
.design-content {
  float: left;
  width: 100%;
  height: 100%;
}
.flexibleDes {
  position: absolute;
  top: 19px;
  left: 10px;
  z-index: 12;
  cursor: pointer;
}
.flexibleDes2 {
  position: absolute;
  top: 19px;
  margin: 0px 0px 0px 10px;
  z-index: 12;
  cursor: pointer;
}
.dn-content {
  float: left;
  width: 100%;
  padding-left: 250px;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  .dn-data {
    position: relative;
    .el-table {
      .editName {
        color: #2182e4;
        cursor: pointer;
      }
      .editName:hover {
        text-decoration: underline;
      }
    }
    .design-flowtype {
      float: left;
      margin-right: 10px;
      margin: 4px 10px 0px 20px;
      height: 34px;
      line-height: 34px;
      h4 {
        margin: 0px;
        float: left;
      }
      .el-select {
        float: left;
        width: 120px;
        margin-left: 10px;
      }
    }
  }
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
.iconStyle {
  font-size: 13px;
}
</style>
