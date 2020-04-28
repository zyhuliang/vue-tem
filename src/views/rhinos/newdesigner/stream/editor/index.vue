<template>
  <el-container class="newjobDescription" id="content">
    <el-header>
      <el-row type="flex" class="row-bg" justify="end" align="middle" :gutter="5">
        <el-col :span="11" justify="start" :offset="3">
          <el-input placeholder="请输入内容" v-model="flowName">
            <template slot="prepend">流程名称</template>
          </el-input>
        </el-col>
        <el-col :span="14">
           <el-tooltip placement="top" effect="light">
            <div slot="content">
              最新版本为工作版本，如果需要从历史中恢复，
              <br />请选择一个版本，（编辑）保存后即为新版本
            </div>
            <el-dropdown
              class="drawSelHis"
              split-button
              type="primary"
              trigger="click"
              @command="disVersion"
            >
              <i class="icon iconfont icon-ir-operation-history drawHisBut"></i>
              &nbsp;历史&nbsp;V{{flowVersion}}
              <el-dropdown-menu slot="dropdown" class="drawHisSel">
                <el-dropdown-item
                  v-if="item.version != '0'"
                  v-for="item in flowHistory"
                  :key="item.version"
                  :command="item.version"
                >【{{item.version}}】&nbsp;{{item.lastModifiedTime | updateTimeFilter}}&nbsp;&nbsp;</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
        </el-col>
        <el-col :span="18" :offset="2">
          
          <el-button type="info" id="drawReturn" @click="goBack">
            <i class="icon iconfont icon-ir-left"></i>&nbsp;返回
          </el-button>
          <el-button type="info" id="designSet" @click="designSet" >
            <i class="icon iconfont icon-ir-set"></i>&nbsp;设置
          </el-button>
          <el-button type="info" id="designSave" @click="saveFlowData" :disabled="!this.flowName">
            <i class="icon iconfont icon-ir-save"></i>&nbsp;保存
          </el-button>
          <el-button type="info" id="designSubmit" @click="designSubmit" :disabled="!this.flowName">
            <i class="icon iconfont icon-ir-ok"></i>&nbsp;提交
          </el-button>
          <el-button
            type="info"
            @click="designSchedule"
            id="designSchedule"
          >
            <i class="icon iconfont icon-ir-add"></i>&nbsp;调度
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
      <el-container class="el-container-jsplumbchart">
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
      <el-aside width="220px">
        <leftaside :stepList="stepList"></leftaside>
      </el-aside>
    </el-container>
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

    <nodeSetStreamflow
      ref="nodeData"
      :nodeSet="nodeSet"
      @getWorkDataflowName="getStepDataflowName"
      @modifynodeSet="modifynodeSet"
    ></nodeSetStreamflow>

    <!-- 参数声明 弹出层 -->
      <design-set 
       :flowSetData="flowSet" 
       ref="desSetReData" 
       @tableData="tableData">
      </design-set>

      <!-- 执行计划设置 弹出层 -->
      <design-submit 
       :flowSubData="flowSubData">
      </design-submit>
  </el-container>
</template>

<script>
import "@/components/jsplumbchart/1.0.0/jsplumbchart.css";
import * as jsplumbchart from "@/components/jsplumbchart/1.0.0/jsplumbchart.umd.min.js";
import _ from "lodash";
// import jsplumbchart from "./jsplumbchart/index";
import leftaside from "@/components/aside/left/index";
import { mapGetters, mapActions, mapState } from "vuex";

import dataSourceInquire from "@dataSourceInq/dataSourceInquire.vue";
import { steplist, stepsettings, modifyflow } from "@server/realtime/index";

import stepdialog from "../set/StepDialog/index";

import runtimeSettingsDialog from "../set/runtimeSettings/index";
import * as jsPlumb from "@static/jsPlumb/jsPlumb-2.2.3-min";

import { GetRequest, createComparisonFunction } from "@components/utils/index";

import nodeSetStreamflow from "@design/designDraw/nodeSetStreamflow.vue";
import designSet from "@design/designDraw/designSet.vue"; //参数声明 组件
import designSubmit from "@design/designDraw/designSubmit.vue"; //执行计划设置 组件

import moment from "moment"//时间格式化

import Base64 from "js-base64";
const base64 = Base64.Base64;

import {
  createflow,
  queryflow,
  creatscheduler,
  runtimeSettings
} from "@/api/realtime/index.js";

import {
  drawFlowData,
  drawGquery,
  drawHistoryData,
  drawHistoryVersion,
  drawSaveData,
  outputDataFlow,
  getSchema,
  getDataset,
  querySchema
} from "@api"; //接口
import {
  copyArr,
  deepCopy,
  unique,
  filterObj,
  filterId,
  transformArr
} from "@function/comFunction.js"; //引入公用函数
import {
  stepsFilterObj,
  lStepsFilterObj,
  displayProp
} from "@function/designFunction.js"; //引入design专用函数
import {
  nodeIcon,
  nodeClass,
  specialNodeClass,
  nodeQuote,
  nodeCache,
  nodeLinks,
  noParme
} from "@function/nodeSetStreamflow.js";
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
    nodeSetStreamflow,
    leftaside,
    stepdialog,
    dataSourceInquire,
    runtimeSettingsDialog,
    designSet,
    designSubmit
  },
  filters: {
    //过滤历史版本下拉内容的时间，返回 YYYY-MM-DD HH:mm:ss 格式
    updateTimeFilter: function(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    }
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
      flowData: [], //steps
      links: [],
      flowDataObj: {},
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
      jsPlumb: jsPlumb,
      jsplumbchartOption: {
        steps: this.flowData,
        links: this.links,
        container: "workplace",
        nodeType: "flowchartnode",
        jsPlumb: jsPlumb,
        enablePanZoom:false
      },
      editJsondialogVisible: false,
      //flowDataJson: JSON.stringify(this.flowData),
      flowDataJson: {},
      json: {},
      nodeSet: {},
      flowNodeTypes: "",
      flowSet: {
        //流程设置 参数声明 传参
        referenceVariable: [], //存储当前流程所有参数 存入的引用变量
        thisPamVar: [], //流程设置 存入的自定义变量
        quoteDataInput: [], //存储当前流程内的所有 source 节点  quoteDataMsg
        quoteDataParameter: [], //存储当前流程内有节点的名称
        quoteDataOutput: [], //存储当前流程内的所有 sink 节点
        quoteDataDependencies: [], //参数声明设置 依赖项
        inputs: false, //显示设置内的输入项
        outputs: false, //显示设置内的输出项
        flowData: {
          inputs: [], //流程设置 输入
          parameters: [], //流程设置 参数
          outputs: [], //流程设置 输出
          dependencies: [] //流程设置 依赖
        },
        flowSetVisible: false //设置 参数声明 弹出框 显示/隐藏
      },
      flowSubData: {
        //流程提交 传参
        flowId: "", //流程ID
        flowName: "", //流程名称
        flowType: "", //流程类型
        dSubName: "", //name
        dSubTime: "", //时间
        flowHisVersion: "", //当前流程历史版本值
        flowData: [], //流程数据
        flowSubmitVisible: false //提交 执行计划设置 显示/隐藏
      },
      statementTab:[],
      flowVersion:'',
      flowHistory:[]
      // getInstance:getInstance
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
      "FLOW_CEP_DATA_ACTION",
      "getdblSteps"
    ]),
    modifynodeSet(val) {
      this.flowData = _.map(this.flowData, item => {
        if (val.id == item.id) {
          return val;
        } else {
          return item;
        }
      });
      this.jsplumbchartOption = {
        ...this.jsplumbchartOption,
        steps: this.flowData,
        links: this.flowDataObj.links
      };
    },
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
      console.log(data);
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
      //this.setCepFlowData({});
    },
    setCepData() {
      let flowCepData = this.realtime.FLOW_CEP_DATA_STATA;
      if (_.isEmpty(flowCepData.name)) {
        this.$message({
          message: "名称不可以为空!",
          type: "warning"
        });
        return;
      }
      this.setCepConfigDailog(false);

      this.setParamertData({
        ...this.realtime.parametData,
        cepRule: flowCepData
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
      //this.$router.go(-1);
      this.$router.push({ path: "/design" });
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
        ...this.flowDataObj,
        //id: this.$route.query.id || this.currentFlowObject.id,
        name: this.flowName,
        createTime: new Date().getTime(),
        lastModifyTime: new Date().getTime(),
        steps: this.flowData,
        links: this.links
      };

      console.log("data", data);

      drawSaveData(this.$route.query.id, data).then(
        data => {
          if (data.status == 200) {
            //this.currentFlowObject = data.data;
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

      // let data = {
      //   id: this.$route.query.id || this.currentFlowObject.id,
      //   name: this.flowName,
      //   createTime: new Date().getTime(),
      //   lastModifyTime: new Date().getTime(),
      //   // scalingRatio: JSON.stringify(
      //   //   this.$refs.jsplumbchart.jsplumbInstance.pan.getTransform()
      //   // ),
      //   steps: this.flowData,
      //   links: _.map(this.links, item => {
      //     let targetInput =
      //       item.target.indexOf("sql") >= 0 ? item.source : item.targetInput;
      //     return {
      //       ...item,
      //       targetInput: targetInput
      //     };
      //   })
      // };

      // if (this.$route.query.id || this.currentFlowObject.id) {
      //   modifyflow(data).then(
      //     data => {
      //       if (data.status == 200) {
      //         this.currentFlowObject = data.data;
      //         this.$message({
      //           message: "操作成功",
      //           type: "success"
      //         });
      //       }
      //     },
      //     err => {
      //       this.$message({
      //         message: err.response.message,
      //         type: "error",
      //         duration: 1500
      //       });
      //     }
      //   );
      //   return;
      // }
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
    getStepListByType(data, flowType) {
      var dataTitle = [];
      var dataIcon = [];
      var _this = this;
      for (var i = 0; i < data.length; i++) {
        if (data[i].name == "analyzeStats") {
          data.splice(i, 1);
        }
        if (data[i].tags[1] == flowType) {
          dataIcon.push(data[i]);
          dataTitle.push(data[i].group);
        }
      }
      var dataT = _.uniq(dataTitle);
      var dataI = [];
      dataT.map(function(value, index, arr) {
        dataI.push({ group: dataT[index], dataIcon });
      });
      var pIcon = [];
      for (var i = 0; i < dataI.length; i++) {
        var thisIcon = [];
        for (var j = 0; j < dataI[i].dataIcon.length; j++) {
          if (dataI[i].dataIcon[j].tags[0] == dataI[i].group) {
            thisIcon.push(dataI[i].dataIcon[j]);
          }
        }
        pIcon.push({ group: dataT[i], thisIcon });
      }
      let result = pIcon.sort(createComparisonFunction("group"));

      return result;
    },

    initData() {
      drawGquery().then(
        data => {
          this.stepList = this.getStepListByType(data, this.$route.query.type);
        },
        err => {}
      );

      if (this.$route.query.id) {
        drawFlowData(this.$route.query.id).then(
          data => {
            let result = data;
            this.flowName = result.name;
            this.flowData = result.steps ? result.steps : [];
            this.links = result.links ? result.links : [];
            //this.currentFlowObject = result;
            this.flowDataObj = result;
            this.jsplumbchartOption = {
              ...this.jsplumbchartOption,
              steps: this.flowData,
              links: this.links
            };
          },
          err => {}
        );
        drawHistoryData(this.$route.query.id).then(
            data => {
              this.flowHistory = data;
              this.flowVersion = data.length-1;
              this.flowSubData.flowHisVersion =  data.length-1;
            },
            err => {
              this.$message({
                message: err.response.message,
                type: "error",
                duration: 1500
              });
            }
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
      if (val.type == "source" || val.type == "stream_source") {
        return false;
      }

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
    getStepDataflowName(name) {
      this.nodeSet.newName = name;
    },
    nodedblClick(val) {
      if (this.isOpenStepDialog(val)) {
        this.$message({
          message: "请建立正确的连接！",
          type: "error"
        });
        return;
      }

      let preNode = this.getPreNode(this.findLinks(val));
      let nodeSetTab = this.setNodeSetTab(val, preNode);
      let preSteps = this.getPreNodes(this.filterLinks(val));

      console.log("nodeSetTab", nodeSetTab);
      console.log("val", val);
      console.log("this.links", this.links);
      console.log("value", this.getPreNodes(this.filterLinks(val)));

      let nodeSet = {
        newName: val.name,
        inputData: [],
        outputData: [],
        nodeSetTab: nodeSetTab,
        thisNodeData: val,
        nodeLine: { inputLine: [], outputLine: [] },
        datasetType: val.otherConfigurations.datasetType,
        flowData: this.flowDataObj,
        nodeSetVisible: true,
        dbStatus: "1",
        btnStatus: true,
        oldName: val.name
      };
      switch (val.type) {
        case "source":
        case "streaming_source":
        case "sqlsource":
          // this.getdblSteps({ designType: val.type });
          break;
        case "sink":
        case "cache":
        case "supplement":
        case "aggregate":
        case "deduplication":
        case "top":
        case "sample":
        case "filter":
        case "sql":
        case "transform":
        case "validate":
        case "split":
          nodeSet = {
            ...nodeSet,
            inputData: [
              {
                id: "input",
                fields: preNode.outputConfigurations[0].fields
              }
            ]
          };
          break;

        case "join":
        case "productjoin":
        case "minus":
          nodeSet = {
            ...nodeSet,
            inputData: [
              {
                id: nodeSet.nodeSetTab[0].name,
                fields: _.find(preSteps, item => {
                  return item.id == nodeSet.nodeSetTab[0].id;
                }).outputConfigurations[0].fields
              },
              {
                id: nodeSet.nodeSetTab[1].name,
                fields: _.find(preSteps, item => {
                  return item.id == nodeSet.nodeSetTab[1].id;
                }).outputConfigurations[0].fields
              }
            ]
          };
          break;
        case "starjoin":
        case "intersect":
        case "union":
          nodeSet = {
            ...nodeSet,
            inputData: [
              {
                id: preSteps[0].id,
                fields: preSteps[0].outputConfigurations[0].fields
              },
              {
                id: preSteps[1].id,
                fields: preSteps[1].outputConfigurations[0].fields
              }
            ]
          };
          break;
        default:
          "";
      }

      
      this.getdblSteps({ designType: val.type });
      this.nodeSet = nodeSet;
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
          return [this.nodeTab[1], this.nodeTab[2]];
        case "source_dummy":
        case "streaming_source":
        case "sqlsource":
          return [this.nodeTab[1], this.nodeTab[2]];
        case "cache":
        case "supplement":
        case "aggregate":
        case "deduplication":
        case "top":
        case "sample":
        case "filter":
        case "sql":
        case "transform":
          return [
            {
              ...this.nodeTab[0],
              title: "输入 (" + pre.name + ")"
            },
            this.nodeTab[1],
            this.nodeTab[2]
          ];
        case "validate":
          return [
            {
              ...this.nodeTab[0],
              title: "输入 (" + pre.name + ")"
            },
            this.nodeTab[1],
            {
              title: "ok",
              name: "ok",
              icon: "fa fa-sign-out"
            },
            {
              title: "error",
              name: "error",
              icon: "fa fa-sign-out"
            }
          ];
        case "split":
          return [
            {
              ...this.nodeTab[0],
              title: "输入 (" + pre.name + ")"
            },
            this.nodeTab[1],
            {
              title: "yes",
              name: "yes",
              icon: "fa fa-sign-out"
            },
            {
              title: "no",
              name: "no",
              icon: "fa fa-sign-out"
            }
          ];
        case "join":
          result = [];

          _.forEach(this.getLinks(val), element => {
            let proNode = this.getPreNode(element);
            result.push({
              ...this.nodeTab[0],
              title: element.targetInput + " (" + proNode.name + ")",
              targetInput: element.targetInput,
              name: element.targetInput,
              id: proNode.id
            });
          });
          return [...result, this.nodeTab[1], this.nodeTab[2]];
        case "union":
          result = [];

          _.forEach(this.getLinks(val), element => {
            let proNode = this.getPreNode(element);
            result.push({
              ...this.nodeTab[0],
              title: element.targetInput + " (" + proNode.name + ")",
              targetInput: element.targetInput,
              name: proNode.id,
              id: proNode.id
            });
          });
          return [...result, this.nodeTab[1], this.nodeTab[2]];
        case "productjoin":
        case "minus":
          result = [];

          _.forEach(this.getLinks(val), element => {
            let proNode = this.getPreNode(element);
            result.push({
              ...this.nodeTab[0],
              title: element.targetInput + " (" + proNode.name + ")",
              targetInput: element.targetInput,
              name: element.targetInput,
              id: proNode.id
            });
          });
          return [...result, this.nodeTab[2]];

        case "intersect":
          result = [];

          _.forEach(this.getLinks(val), element => {
            let proNode = this.getPreNode(element);
            result.push({
              ...this.nodeTab[0],
              title: element.targetInput + " (" + proNode.name + ")",
              targetInput: element.targetInput,
              name: proNode.id,
              id: proNode.id
            });
          });
          return [...result, this.nodeTab[2]];

        case "starjoin":
          result = [];
          _.forEach(this.getLinks(val), element => {
            result.push({
              ...this.nodeTab[0],
              title:
                element.targetInput + " (" + this.getPreNode(element).id + ")",
              targetInput: element.targetInput,
              source: element.source,
              preNodeId: this.getPreNode(element).id,
              name: element.source
            });
          });
          return [...result, this.nodeTab[1], this.nodeTab[2]];
        default:
      }
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
      this.flowDataObj = {
        ...this.flowDataObj,
        steps: this.flowData,
        links: this.links
      };
    },
    designSet() {
      let _this = this;
      this.flowSet.flowData = this.flowDataObj;
      let flowStep = transformArr(copyArr(_this.flowData));
      let flowStepArr = [];

      //参数变量
      for (var qi = 0; qi < flowStep.length; qi++) {
        if (specialNodeClass(flowStep[qi].type) === "classW_A") {
          for (
            var qj = 0;
            qj < displayProp(flowStep[qi].otherConfigurations).length;
            qj++
          ) {
            let fsVal = displayProp(flowStep[qi].otherConfigurations)[qj];
            if (
              fsVal === "schemaId" ||
              fsVal === "datasetId" ||
              fsVal === "dataflowId$"
            ) {
            } else {
              //flowStepArr.push(flowStep[qi].name + "." + displayProp(flowStep[qi].otherConfigurations)[qj])
              var tempParam = {};
              var paramKey =
                flowStep[qi].id +
                "." +
                displayProp(flowStep[qi].otherConfigurations)[qj];
              var paramValue =
                flowStep[qi].otherConfigurations[
                  displayProp(flowStep[qi].otherConfigurations)[qj]
                ];
              tempParam[paramKey] = paramValue;

              flowStepArr.push(tempParam);
            }
          }
        } else {
          for (
            var qj = 0;
            qj < displayProp(flowStep[qi].otherConfigurations).length;
            qj++
          ) {
            let fsVal = displayProp(flowStep[qi].otherConfigurations)[qj];
            if (fsVal === "schemaId" || fsVal === "datasetId") {
            } else {
              //flowStepArr.push(flowStep[qi].name + "." + displayProp(flowStep[qi].otherConfigurations)[qj])
              var tempParam = {};
              var paramKey =
                flowStep[qi].id +
                "." +
                displayProp(flowStep[qi].otherConfigurations)[qj];
              var paramValue =
                flowStep[qi].otherConfigurations[
                  displayProp(flowStep[qi].otherConfigurations)[qj]
                ];
              tempParam[paramKey] = paramValue;
              flowStepArr.push(tempParam);
            }
          }
        }
      }
      //自定义变量
      _this.flowSet.thisPamVar = [];
      for (var vi = 0; vi < flowStep.length; vi++) {
        for (
          var vj = 0;
          vj < transformArr(flowStep[vi].otherConfigurations).length;
          vj++
        ) {
          let str = transformArr(flowStep[vi].otherConfigurations)[vj];
          if (typeof str === "string") {
            var patt = new RegExp("#{[^}]+:[^}]+}", "g");
            var result;
            while ((result = patt.exec(str)) != null) {
              var index = result[0].indexOf(":");
              var name = result[0]
                .substr(2, index - 2)
                .replace(/^\s*/, "")
                .replace(/\s*$/, "");
              var value = result[0]
                .substr(index + 1)
                .replace(/^\s*/, "")
                .replace(/\s*\}$/, "");
              _this.flowSet.thisPamVar.push({ name: name, value: value });
            }
          }
          if (typeof str === "object") {
            var patt = new RegExp("#{[^}]+:[^}]+}", "g");
            for (var vk = 0; vk < str.length; vk++) {
              var result;
              while ((result = patt.exec(str[vk])) != null) {
                var index = result[0].indexOf(":");
                var name = result[0]
                  .substr(2, index - 2)
                  .replace(/^\s*/, "")
                  .replace(/\s*$/, "");
                var value = result[0]
                  .substr(index + 1)
                  .replace(/^\s*/, "")
                  .replace(/\s*\}$/, "");
                _this.flowSet.thisPamVar.push({ name: name, value: value });
              }
            }
          }
        }
      }

      _this.flowSet.referenceVariable = flowStepArr;

      if (_this.flowData.inputs == undefined) {
        _this.flowSet.flowData.inputs = [];
      } else {
        _this.flowSet.flowData.inputs = transformArr(
          deepCopy(_this.flowData.inputs)
        );
      }
      if (_this.flowData.parameters == undefined) {
        _this.flowSet.flowData.inputs = [];
      } else {
        _this.flowSet.flowData.parameters = _this.flowData.parameters;
        if (sessionStorage.getItem("parameters") == "") {
          sessionStorage.setItem(
            "parameters",
            JSON.stringify(_this.flowSet.flowData.parameters)
          );
        }
      }
      if (_this.flowDataObj.outputs == undefined) {
        _this.flowSet.flowData.outputs = [];
      } else {
        _this.flowSet.flowData.outputs = transformArr(
          deepCopy(_this.flowDataObj.outputs)
        );
      }
      if (_this.flowDataObj.dependencies == undefined) {
        _this.flowSet.flowData.dependencies = [];
      } else {
        _this.flowSet.flowData.dependencies = transformArr(
          deepCopy(_this.flowDataObj.dependencies)
        );
      }

      _this.flowSet.flowSetVisible = true;
    },
    /**
     * 组件：参数设置声明 传参
     * ------------------------------------------------------------------
     */
    tableData(val) {
      this.statementTab = val;
      this.flowDataObj.inputs = this.statementTab[0].inputs;
      this.flowDataObj.parameters = this.statementTab[1].parameters;
      this.flowDataObj.outputs = this.statementTab[2].outputs;
      this.flowDataObj.dependencies = this.statementTab[3].dependencies;
    },
     /**
     * btnClick：提交 计划执行设置
     * ------------------------------------------------------------------
     */
    designSubmit: function() {
      this.flowSubData.flowData = JSON.parse(JSON.stringify(this.flowDataObj));
      // $(document).off("keydown"); //解绑键盘复制事件
      // if ($("#designMain").find(".designIconBig").length > this.nodeLength) {
      //   this.$confirm("当前的修改会被重置，确定要继续吗?", "提示", {
      //     type: "warning"
      //   })
      //     .then(() => {})
      //     .catch(() => {});
      // } else {
        this.flowSubData.flowSubmitVisible = true;
        this.flowSubData.flowName = this.flowDataObj.name;
        this.flowSubData.dSubName =
          this.flowName +
          " " +
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.flowSubData.dSubTime = moment(
          new Date(new Date().toLocaleDateString()).getTime()
        ).format("YYYY-MM-DD HH:mm:ss");
        this.flowSubData.flowId = this.flowDataObj.id;
        this.flowSubData.flowType = this.flowDataObj.flowType;
        this.flowSubData.flowHisVersion = this.flowDataObj.version
      
    },
    designSchedule: function() {
      this.$router.push({
        path: "/hippo/schedule/add",
        query: { pid: this.flowDataObj.id }
      });
    },
    disVersion: function(command) {
      this.flowVersion = command;
      this.flowSubData.flowHisVersion = command;
      drawHistoryVersion(
        this.flowDataObj.id + "/" + this.flowVersion + "?latestName=true"
      )
        .then(
          data => {
            this.flowCanvasLoading = false;
            let result = data;
            this.flowName = result.name;
            this.flowData = result.steps ? result.steps : [];
            this.links = result.links ? result.links : [];
            //this.currentFlowObject = result;
            this.flowDataObj = result;
            this.jsplumbchartOption = {
              ...this.jsplumbchartOption,
              steps: this.flowData,
              links: this.links
            };
          },
          err => {
            this.$message({
              message: err.response.message,
              type: "error",
              duration: 1500
            });
          }
        )
        .catch(() => {
          this.flowCanvasLoading = true;
        });
    },
  }
};
</script>

<style lang="scss">
.newjobDescription {
  background: #fff;
  //   width: 100%;
  // position: fixed;
  // top: 50px;
  // left: 0;
  // bottom: 0;
  // right: 0;
  // height: calc(100vh-50px);
  height: 100%;
  .el-container-jsplumbchart {
    height: calc(100vh-50px) !important;
  }
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
    background: url("../../../../../assets/design/designBg.png");
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
