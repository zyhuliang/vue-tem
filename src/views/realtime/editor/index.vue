<template>
  <el-container class="newjobDescription" id="content">
    <el-header>
      <el-row type="flex" class="row-bg" justify="end" align="middle" :gutter="20">
        <el-col :span="16">
          <el-input placeholder="请输入内容" v-model="flowName">
            <template slot="prepend">流程名称</template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="info" id="designDelSave" @click="editJson">
            <i class="fa fa-eraser"></i>&nbsp;flowjson
          </el-button>
          <!-- <el-button type="info" id="designSet" @click="resetJsplumbChart">
            <i class="icon iconfont icon-ir-set"></i>&nbsp;重置
          </el-button>-->
          <el-button type="info" id="drawReturn" @click="goBack">
            <i class="icon iconfont icon-ir-left"></i>&nbsp;返回
          </el-button>

          <el-button type="info" id="designSave" @click="saveFlowData" :disabled="!this.flowName">
            <i class="icon iconfont icon-ir-save"></i>&nbsp;保存
          </el-button>
          <el-button type="info" id="designSave" @click="getConfigData" :disabled="!this.flowName">
            <i class="icon iconfont icon-ir-ok"></i>&nbsp;提交
          </el-button>

          <el-button type="info" id="designDelSave" @click="reset">
            <i class="fa fa-eraser"></i>&nbsp;清空
          </el-button>
          <el-button type="info" id="designDelSave" @click="Screen">
            <i class="fa fa-eraser"></i>&nbsp;全屏
          </el-button>
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="220px">
        <leftaside :stepList="stepList"></leftaside>
      </el-aside>
      <el-container>
        <el-main class="jsplumb-editor">
          <drop class="drop-workplace" @drop="handleDrop" id="workplace">
            <jsplumbchart
              :data="jsplumbchartOption"
              @modifyJsplumbchartOption="modifyJsplumbchartOption"
              @modifyChart="modifyChart"
              @nodedblClick="nodedblClick"
              @handleDrop="handleDrop"
              ref="jsplumbchart"
            ></jsplumbchart>
          </drop>
        </el-main>
      </el-container>
    </el-container>

    <stepdialog
      :data="dialogOption"
      :flowData="flowData"
      @modifyFlowData="modifyFlowData"
      @getSelectDateVal="getSelectDateVal"
    ></stepdialog>
    <runtimeSettingsDialog
      :data="runtimeSettingsdialogOption"
      @setRuntimeSettingsdialogOption="setRuntimeSettingsdialogOption"
    ></runtimeSettingsDialog>

    <el-dialog
      title="数据集查询"
      :visible.sync="realtime.stepDialogSate"
      :before-close="cancelDataSetDialog"
      custom-class="dialogClass"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-dialog-drag
    >
      <el-form>
        <data-source-inquire
          ref="dataSourceInquire"
          @thisSelectDatasetVal="getSelectDateVal"
          rootName="dataset_dir"
        ></data-source-inquire>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectDataSet" name="bm-ch-step2Form-dataset-ok">确定</el-button>
        <el-button @click="cancelDataSetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="CEP 设置"
      :visible.sync="realtime.dialogCepFormVisibleStatus"
      :before-close="cancelCepDialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-dialog-drag
      width="97%"
      min-height="900px"
      custom-class="dialogClass-cep"
      @opened="openedDialog"
    >
      <cepConfigDialog :data="configCepData"></cepConfigDialog>
      <div slot="footer" class="dialog-footer-cep">
        <el-button type="primary" @click="setCepData" name="bm-ch-step2Form-dataset-ok">确定</el-button>
        <el-button @click="cancelCepDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑节点json组件 -->
    <el-dialog
      :title="'editjson'"
      :visible.sync="editJsondialogVisible"
      width="70%"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-dialog-drag
      @opened="openedDialogjson"
      custom-class="dialogClass-json"
    >
      <vue-json-editor
        v-model="flowDataJson"
        :show-btns="false"
        :mode="'code'"
        lang="zh"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
        @has-error="onError"
      ></vue-json-editor>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editNodeJson">确 定</el-button>
        <el-button @click="editJsondialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import "@/components/jsplumbchart/1.0.0/jsplumbchart.css";
import * as jsplumbchart from "@/components/jsplumbchart/1.0.0/jsplumbchart.umd.min.js";
import _ from "lodash";
import leftaside from "@/components/aside/left/index";
import { mapGetters, mapActions, mapState } from "vuex";

import dataSourceInquire from "@dataSourceInq/dataSourceInquire.vue";
import { steplist, stepsettings, modifyflow } from "@server/realtime/index";

import stepdialog from "../set/StepDialog/index";
import cepConfigDialog from "../set/tab/parameter/common/CepConfigDialog/index";

import runtimeSettingsDialog from "../set/runtimeSettings/index";

import vueJsonEditor from "@/components/vue-json-editor/vue-json-editor.vue";
import { GetRequest } from "@components/utils/index";

import Base64 from "js-base64";
const base64 = Base64.Base64;

import {
  createflow,
  queryflow,
  creatscheduler,
  runtimeSettings
} from "@/api/realtime/index.js";

export default {
  watch: {
    "realtime.stepDialogDataOption"(val) {
      this.dialogOption = val;
    },
    "realtime.dialogCepFormVisibleStatus"(val) {
      this.dialogCepFormVisible = val;
    },
    dialogCepFormVisible(val) {
      this.configCepData = { dialogCepFormVisible: val };
    }
  },
  components: {
    leftaside,
    stepdialog,
    dataSourceInquire,
    runtimeSettingsDialog,
    cepConfigDialog,
    vueJsonEditor
  },
  data: function() {
    return {
      configCepData: { dialogCepFormVisible: false },
      dialogCepFormVisible: false,
      currentFlowObject: "",
      runtimeSettingsdialogOption: {},
      dialogOption: {},
      activeName: "second",
      flowType: "",
      flowData: [],
      links: [],
      self: this,
      dialogVisible: false,
      dialogComponent: "",
      nodeType: "",
      toolkit: "",
      stepList: [],
      dialogVisible: false,
      nodeTab: [
        {
          title: "输入",
          name: "input",
          icon: "fa fa-sign-in",
          lable: "input"
        },
        {
          title: "参数",
          name: "parameter",
          icon: "fa fa-gear",
          lable: "parameter"
        },
        {
          title: "输出",
          name: "output",
          icon: "fa fa-sign-out",
          lable: "output"
        }
      ],
      selectCheckedItem: {},
      flowName: "",
      jsplumbchartOption: {
        steps: this.flowData,
        links: this.links,
        container: "workplace",
        nodeType: "flowchartnode",
        enablePanZoom: false,
        flowType: "flink",
      },
      editJsondialogVisible: false,
      //flowDataJson: JSON.stringify(this.flowData),
      flowDataJson: {},
      json: {}
    };
  },
  computed: {
    ...mapState(["realtime"])
  },
  mounted() {
    this.initData();
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    ...mapActions([
      "openDialog",
      "setOutData",
      "setDataSetSelect",
      "setCurrentFlowData",
      "initInputCheckedData",
      "initOutInputData",
      "modifyLoadingStatus",
      "initParametData",
      "initOutCheckedData",
      "initInputData",
      "setAdList",
      "setStepDailogDataOption",
      "setCepConfigDailog",
      "setParamertData",
      "FLOW_CEP_DATA_ACTION"
    ]),
    modifyJsplumbchartOption(val) {
      this.jsplumbchartOption = val;
    },
    onJsonChange(value) {
      //console.log("value:", value);
    },

    onJsonSave(value) {
      //console.log("value:", value);
    },

    onError(value) {
      //console.log("value:", value);
    },
    openedDialogjson() {
      //this.flowDataJson = JSON.stringify(this.currentFlowObject);
      this.flowDataJson = this.currentFlowObject;
    },
    editJson() {
      this.editJsondialogVisible = true;
    },
    editNodeJson() {
      modifyflow(this.flowDataJson).then(
        data => {
          if (data.status == 200) {
            let flowData = data.data;
            this.currentFlowObject = flowData;
            this.jsplumbchartOption = {
              ...this.jsplumbchartOption,
              steps: flowData.steps,
              links: flowData.links
            };
            this.$message({
              message: "操作成功",
              type: "success"
            });

            this.editJsondialogVisible = false;
          }
        },
        err => {
          this.$message({
            message: err.response.message,
            type: "error",
            duration: 1500
          });
        }
      );
    },
    clearAllStatus() {
      this.setDataSetSelect({});
      this.initParametData({});
      this.initOutCheckedData([]);
      this.initInputCheckedData([]);
      this.initInputData([]);
      this.modifyLoadingStatus(false);
      this.setAdList([]);
    },
    resetJsplumbChart() {
      this.$confirm("确定进行重置操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.jsplumbchartOption = {
            ...this.jsplumbchartOption,
            steps: this.currentFlowObject.steps,
            links: this.currentFlowObject.links
          };
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    startFlow() {
      if (!this.currentFlowObject.id) {
        this.$message({
          message: "请保存当前流程!",
          type: "warning"
        });
        return;
      }
      if (!this.runtimeSettingsdialogOption.itemList) {
        this.$message({
          message: "请提交当前流程!",
          type: "warning"
        });
        return;
      }
      let data = {
        flowId: this.currentFlowObject.id,
        flowName: this.currentFlowObject.name,
        createTime: new Date().getTime(),
        name: this.runtimeSettingsdialogOption.name,
        configurations: {
          arguments: [
            {
              name: "string",
              value: {}
            }
          ],
          properties: this.runtimeSettingsdialogOption.itemList,
          extraConfigurations: [
            {
              name: "string",
              value: {}
            }
          ]
        }
      };
      this.scheduler(data);
    },
    scheduler(data) {
      creatscheduler(data).then(
        data => {
          if (data.status == 200) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        },
        err => {
          this.$message({
            message: err.response.message,
            type: "error",
            duration: 1500
          });
        }
      );
    },
    getSelectDateVal(data) {
      this.selectCheckedItem = data;
    },
    selectDataSet() {
      this.initParametData({});
      this.setDataSetSelect(this.selectCheckedItem);
      this.cancelDataSetDialog();
    },
    cancelDataSetDialog() {
      this.$refs.dataSourceInquire.clearSelectionRow();
      this.openDialog(false);
    },
    cancelCepDialog() {
      this.setCepConfigDailog(false);
      this.FLOW_CEP_DATA_ACTION([]);
      //this.setCepFlowData({});
    },
    setCepData() {
      let flowCepData = this.realtime.FLOW_CEP_DATA_STATA;
      flowCepData = {
        ...flowCepData,
        events: _.map(flowCepData.events, val => {
          delete val.isSelected;
          return val;
        })
      };
      if (_.isEmpty(flowCepData.name)) {
        this.$message({
          message: "名称不可以为空!",
          type: "warning"
        });
        return;
      }
      this.setCepConfigDailog(false);

      // this.setParamertData({
      //   ...this.realtime.parametData,
      //   cepRule: flowCepData
      // });

      this.setParamertData({
        ...this.realtime.parametData,
        cepRule: {
          ...flowCepData,
          cepGroups: this.realtime.CEP_FLOW_GROUP_DATA
        }
      });
    },
    openedDialog() {
      //console.log("this.realtime.parametData", this.realtime.parametData);

      let cepRule = this.realtime.parametData.cepRule;
      if (cepRule) {
        this.FLOW_CEP_DATA_ACTION(cepRule);
      }
    },
    handleClick() {},
    resetData() {
      this.initData();
    },
    goBack() {
      this.$router.go(-1);
    },
    getConfigData() {
      this.runtimeSettingsdialogOption = {
        dialogVisible: true,
        flowName: this.flowName
      };
    },
    setRuntimeSettingsdialogOption(val) {
      this.runtimeSettingsdialogOption = val;
      this.scheduler({
        flowId: this.currentFlowObject.id,
        flowName: this.currentFlowObject.name,
        createTime: new Date().getTime(),
        name: this.runtimeSettingsdialogOption.name,
        settings: this.runtimeSettingsdialogOption.itemList
      });
    },
    getStepData(flowData) {
      const matrix = window.getComputedStyle(
        this.$refs.jsplumbchart.jsplumbInstance.getContainer()
      ).transform;

      let sourceStepList = _.remove(flowData, val => {
        return val.type == "source";
      });

      sourceStepList = _.map(sourceStepList, val => {
        return {
          ...val,
          stepSettings: {
            ...val.stepSettings,
            matrix: matrix
          }
        };
      });
      return [...flowData, ...sourceStepList];
    },
    saveFlowData() {
      // console.log(this.flowData);
      // console.log(this.links);
      // return;

      if (!this.flowName) {
        this.$message({
          message: "请填写流程名称",
          type: "warning"
        });
        return;
      }

      let data = {
        id: this.$route.query.id || this.currentFlowObject.id,
        name: this.flowName,
        createTime: new Date().getTime(),
        lastModifyTime: new Date().getTime(),
        // scalingRatio: JSON.stringify(
        //   this.$refs.jsplumbchart.jsplumbInstance.pan.getTransform()
        // ),
        steps: this.flowData,
        links: _.map(this.links, item => {
          let targetInput =
            item.target.indexOf("sql") >= 0 ? item.source : item.targetInput;
          return {
            ...item,
            targetInput: targetInput
          };
        })
      };

      if (this.$route.query.id || this.currentFlowObject.id) {
        modifyflow(data).then(
          data => {
            if (data.status == 200) {
              this.currentFlowObject = data.data;
              this.$message({
                message: "操作成功",
                type: "success"
              });
            }
          },
          err => {
            this.$message({
              message: err.response.message,
              type: "error",
              duration: 1500
            });
          }
        );
        return;
      }

      createflow(data).then(
        data => {
          if (data.status == 200) {
            this.currentFlowObject = data.data;
            // this.flowName = "";
            //this.reset();
            this.$message({
              message: "操作成功",
              type: "success"
            });
            //this.goBack();
          }
        },
        err => {
          this.$message({
            message: err.response.message,
            type: "error",
            duration: 1500
          });
        }
      );
    },
    modifyFlowData(val) {
      console.log("modifyFlowData(val) {", val.step);

      this.flowData = _.map(this.flowData, item => {
        if (
          item.type == val.step.type &&
          (val.step.type == "source" || val.step.type == "source_dummy") &&
          item.id == val.step.id
        ) {
          return {
            ...item,
            name: val.step.name,
            stepSettings: {
              ...val.data.parametData,
              schema:
                (val.step.type == "source" ||
                  val.step.type == "source_dummy") &&
                this.selectCheckedItem.fields
                  ? this.selectCheckedItem.fields
                  : item.stepSettings.schema
            },
            outputConfigurations: val.data.checkedOutData
          };
        }

        if (
          (item.type == val.step.type || item.type == "lookup") &&
          (val.step.type != "source" || val.step.type != "sink") &&
          item.id == val.step.id
        ) {
          return {
            ...item,
            name: val.step.name,
            stepSettings: val.data.parametData,
            outputConfigurations: val.data.checkedOutData,
            inputConfigurations: val.data.checkedinPUTData
          };
        }

        if (
          item.type == val.step.type &&
          val.step.type == "sink" &&
          item.id == val.step.id
        ) {
          return {
            ...item,
            name: val.step.name,
            stepSettings: val.data.parametData,
            inputConfigurations: val.data.checkedinPUTData
          };
        }
        return item;
      });

      this.jsplumbchartOption = {
        ...this.jsplumbchartOption,
        steps: this.flowData,
        links: this.links
      };
    },

    initData() {
      // this.stepList = this.getLeftAsideData(
      //   this.stepList,
      //   _.uniq(this.getGroupData(this.stepList))
      // );
      steplist().then(
        data => {
          this.stepList = this.getLeftAsideData(
            data,
            _.uniq(this.getGroupData(data))
          );
        },
        err => {}
      );

      if (this.$route.query.id) {
        queryflow(this.$route.query.id).then(
          data => {
            if (data.status == 200) {
              let result = data.data;
              this.flowName = result.name;
              this.flowData = result.steps ? result.steps : [];
              this.links = result.links ? result.links : [];
              this.currentFlowObject = result;
              this.jsplumbchartOption = {
                ...this.jsplumbchartOption,
                steps: this.flowData,
                links: this.links,
                matrix: result.scalingRatio && JSON.parse(result.scalingRatio)
              };
            }
          },
          err => {}
        );
      }

      if (this.$route.query.currentPage && this.$route.query.pagesize) {
        sessionStorage.setItem(
          "list-pagination",
          JSON.stringify({
            currentPage: this.$route.query.currentPage,
            pagesize: this.$route.query.pagesize
          })
        );
      }
    },
    reset() {
      this.$confirm("确定进行清空操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$message({
          //   type: "success",
          //   message: "删除成功!"
          // });
          this.flowData = [];
          this.links = [];
          this.$refs.jsplumbchart.reset();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    copyNode(node) {
      let uuid = jsPlumbUtil.uuid();
      return {
        ...node,
        id: this.isExitStepID(node.id) ? node.id + "_new" + uuid : node.id
      };
    },
    handleDrop(val) {
      let stepData = "";
      let containerRect = "";
      let container = this.jsplumbchartOption.enablePanZoom
        ? this.$refs.jsplumbchart.jsplumbInstance.getContainer()
        : "";
      // add step
      if (val.drawIcon) {
        stepData = this.getCurrentNode(
          val,
          this.jsplumbchartOption.enablePanZoom ? container : ""
        );
        containerRect = container && container.getBoundingClientRect();
      } else {
        // copy step
        stepData = this.copyNode(val);
      }
      this.flowData.push(stepData);

      this.jsplumbchartOption = {
        ...this.jsplumbchartOption,
        steps: this.flowData,
        links: this.links,
        containerRect: containerRect
      };
    },
    isExitStepID(val) {
      let result = false;
      _.forEach(this.flowData, item => {
        if (item.id == val) {
          result = true;
        }
      });

      return result;
    },
    getCurrentNode(data, container) {
      let uuid = jsPlumbUtil.uuid();
      let stepId = data.drawIcon.id + "_" + (this.flowData.length + 1);
      let newstepid = this.isExitStepID(stepId)
        ? stepId + "_new" + uuid
        : stepId;
      let node = {
        id: this.isExitStepID(newstepid) ? newstepid + "_new" : newstepid,
        name: data.drawIcon.name,
        type: data.drawIcon.type,
        // x: event.offsetX - 20,
        // y: event.offsetY - 20,
        x: _.isElement(container) ? event.pageX : event.offsetX,
        y: _.isElement(container) ? event.pageY : event.offsetY,
        stepSettings: data.drawIcon.stepSettings
      };

      let outputConfigurations = {
        outputConfigurations: {
          output: []
        }
      };

      let inputConfigurations = {
        inputConfigurations: {
          input: []
        }
      };

      switch (data.drawIcon.type) {
        case "source":
        case "source_dummy":
          return {
            ...node,
            ...outputConfigurations
          };
        case "sink":
          return {
            ...node,
            ...inputConfigurations
          };
        default:
          return {
            ...node,
            ...inputConfigurations,
            ...outputConfigurations
          };
      }
    },
    findLinks(val) {
      return _.find(this.links, function(item) {
        return item.target == val.id;
      });
    },
    filterLinks(val) {
      return _.filter(this.links, function(item) {
        return item.target == val.id;
      });
    },
    getLinks(val) {
      return _.filter(this.links, function(item) {
        return item.target == val.id;
      });
    },
    isOpenStepDialog(val) {
      if (val.type == "source" || val.type == "source_dummy") {
        return false;
      }
      //console.log("this.findLinks(val)", this.findLinks(val));
      // if (
      //   ((val.type == "filter" ||
      //     val.type == "sink" ||
      //     val.type == "aggregate" ||
      //     val.type == "transform" ||
      //     // val.type == "join" ||
      //     val.type == "lookup" ||
      //     val.type == "split" ||
      //     val.type == "sql") &&
      //     this.links.length == 0) ||
      //   ((val.type == "filter" ||
      //     val.type == "sink" ||
      //     val.type == "aggregate" ||
      //     val.type == "transform" ||
      //     // val.type == "join" ||
      //     val.type == "lookup" ||
      //     val.type == "split" ||
      //     val.type == "sql") &&
      //     !this.findLinks(val))
      // ) {
      //   return true;
      // }

      if (
        val.type == "join" &&
        (this.filterLinks(val).length == 0 || this.filterLinks(val).length == 1)
      ) {
        return true;
      }

      if (
        (val.type == "filter" ||
          val.type == "sink" ||
          val.type == "aggregate" ||
          val.type == "transform" ||
          // val.type == "join" ||
          val.type == "lookup" ||
          val.type == "split" ||
          val.type == "sql" ||
          val.type == "cep") &&
        !this.filterLinks(val)[0]
      ) {
        return true;
      }
    },

    getPreNodes(links) {
      let result = [];
      _.forEach(links, p => {
        _.forEach(this.flowData, s => {
          if (p.source == s.id) {
            result.push(s);
          }
        });
      });
      return result;
    },

    getPreNode(val) {
      return _.find(this.flowData, function(o) {
        if (!val) {
          return "";
        }
        return o.id == val.source;
      });
    },

    nodedblClick(val) {
      if (this.isOpenStepDialog(val)) {
        this.$message({
          message: "请建立正确的连接！",
          type: "error"
        });
        return;
      }

      this.setStepDailogDataOption({
        dialogVisible: true,
        step: val,
        filterLinks: this.filterLinks(val),
        preSteps: this.getPreNodes(this.filterLinks(val)),
        pre: this.getPreNode(this.findLinks(val)),
        nodeSetTab: this.setNodeSetTab(
          val,
          this.getPreNode(this.findLinks(val))
        ),
        flowData: this.flowData,
        links: this.links
      });
      //this.modifyLoadingStatus(true);
    },
    setNodeSetTab(val, pre) {
      let result = [];
      switch (val.type) {
        case "sink":
          return [
            {
              ...this.nodeTab[0],
              title: "输入 (" + pre.name + ")"
            },
            this.nodeTab[1]
          ];
        case "source":
        case "source_dummy":
          return [this.nodeTab[1], this.nodeTab[2]];
        case "filter":
        case "aggregate":
        case "transform":
        case "lookup":
        case "split":
        case "watermark":
        case "interval_filter":
        case "cep":
          return [
            {
              ...this.nodeTab[0],
              title: "输入 (" + pre.name + ")"
            },
            this.nodeTab[1],
            this.nodeTab[2]
          ];
        case "join":
          result = [];
          _.forEach(this.getLinks(val), element => {
            result.push({
              ...this.nodeTab[0],
              title:
                element.targetInput +
                " (" +
                this.getPreNode(element).name +
                ")",
              targetInput: element.targetInput
            });
          });
          return [...result, this.nodeTab[1], this.nodeTab[2]];

        case "sql":
          result = [];
          _.forEach(this.getLinks(val), element => {
            result.push({
              ...this.nodeTab[0],
              title:
                element.targetInput + " (" + this.getPreNode(element).id + ")",
              targetInput: element.targetInput,
              source: element.source,
              preNodeId: this.getPreNode(element).id
            });
          });
          return [...result, this.nodeTab[1], this.nodeTab[2]];
        default:
      }

      // if (val.type == "sink") {
      //   return [
      //     {
      //       ...this.nodeTab[0],
      //       title: "输入 (" + pre.name + ")"
      //     },
      //     this.nodeTab[1]
      //   ];
      // }
      // if (val.type == "source" || val.type == "source_dummy") {
      //   return [this.nodeTab[1], this.nodeTab[2]];
      // }
      // if (
      //   val.type == "filter" ||
      //   val.type == "aggregate" ||
      //   val.type == "transform" ||
      //   val.type == "lookup" ||
      //   val.type == "split" ||
      //   val.type == "watermark" ||
      //   val.type == "interval_filter" ||
      //   val.type == "cep"
      // ) {
      //   return [
      //     {
      //       ...this.nodeTab[0],
      //       title: "输入 (" + pre.name + ")"
      //     },
      //     this.nodeTab[1],
      //     this.nodeTab[2]
      //   ];
      // }

      // if (val.type == "join") {
      //   let result = [];
      //   _.forEach(this.getLinks(val), element => {
      //     result.push({
      //       ...this.nodeTab[0],
      //       title:
      //         element.targetInput + " (" + this.getPreNode(element).name + ")",
      //       targetInput: element.targetInput
      //     });
      //   });
      //   return [...result, this.nodeTab[1], this.nodeTab[2]];
      // }

      // if (val.type == "sql") {
      //   let result = [];
      //   _.forEach(this.getLinks(val), element => {
      //     result.push({
      //       ...this.nodeTab[0],
      //       title:
      //         element.targetInput + " (" + this.getPreNode(element).id + ")",
      //       targetInput: element.targetInput,
      //       source: element.source,
      //       preNodeId: this.getPreNode(element).id
      //     });
      //   });
      //   return [...result, this.nodeTab[1], this.nodeTab[2]];
      // }
    },
    Screen() {
      this.fullScreen("content");
    },
    getGroupData(val) {
      return _.map(val, item => {
        return item.tags[0];
      });
    },
    getLeftAsideData(data, group) {
      return _.map(group, item => {
        return {
          group: item,
          thisIcon: _.compact(this.getIconData(data, item))
        };
      });
    },
    getIconData(data, val) {
      return _.map(data, item => {
        if (item.tags[0] == val) {
          return item;
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    modifyChart(val) {
      this.flowData = val.stepData;
      this.links = val.links;
    }
  }
};
</script>

<style lang="scss">
.newjobDescription {
  background: #fff;
  //   width: 100%;
  position: fixed;
  top: 50px;
  left: 0;
  bottom: 0;
  right: 0;
  .dialogClass-cep {
    max-height: 100%;
    .el-dialog__wrapper {
      overflow: hidden;
    }

    .dialog-footer-cep {
      text-align: center;
    }
  }
  .jsplumb-editor {
    background: url("../../../assets/design/designBg.png");
  }

  .right-aside {
    padding: 0 10px;
  }

  .row-bg {
    height: 100%;
  }

  .el-main {
    padding: 0;
  }

  .drop-workplace {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .dialogClass-json {
    .editjson-form {
      height: 500px;
    }
  }
}
</style>
