<template>
  <section class="con-module">
    <div class="child-content" id="bm-designdrawing-form">
      <div class="btnClass" v-if="!id">
        <!-- 左侧功能区 -->
        <div class="desLeft">
          <el-input
            class="flowNameInput"
            placeholder
            name="名称"
            :title="flowName"
            v-model="flowName"
            readonly="readonly"
          >
            <template slot="prepend">名称</template>
          </el-input>
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
                  v-for="(item,index) in flowHistory"
                  :key="index + '-flowHistory'"
                  :command="item.version"
                >【{{item.version}}】&nbsp;{{item.lastModifiedTime | updateTimeFilter}}&nbsp;&nbsp;</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
          <el-dropdown  split-button type="primary" class="drawSelHis"  @command="testDesignRes" style="margin-left: 20px;">
          测试
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="01">&nbsp;&nbsp;测&nbsp;试</el-dropdown-item>
            <el-dropdown-item command="02">&nbsp;&nbsp;校&nbsp;验</el-dropdown-item>
            <el-dropdown-item v-if="testDesignData.length>0" command="03">&nbsp;上一次测试结果</el-dropdown-item>
            <el-dropdown-item v-if="testDesignerror.length>0" command="04">&nbsp;上一次测试日志</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
        <!-- 右侧功能区 -->
        <div class="btn-right">
             <!-- v-if="changeSteps.changeStepsArr.length > 0" -->
          <el-button    
            v-if="false"
              type="info"
              @click="customStep"
              id="designSet"
          >
            <i class="icon iconfont icon-ir-set"></i>&nbsp;自定义
          </el-button>
          <el-button type="info" @click="drawRefresh" id="drawRefresh">
            <i class="icon iconfont icon-ir-refresh"></i>&nbsp;重置
          </el-button>
          <el-button type="info" @click="drawReturn" id="drawReturn">
            <i class="icon iconfont icon-ir-left"></i>&nbsp;返回
          </el-button>
          <el-button type="info" @click="designSet" id="designSet">
            <i class="icon iconfont icon-ir-set"></i>&nbsp;设置
          </el-button>
          <el-button type="info" :disabled="!designStepLength" @click="designSave" id="designSave">
            <i class="icon iconfont icon-ir-save"></i>&nbsp;保存
          </el-button>
          <el-button
            v-if="submitState==0"
            type="info"
            :disabled="!designStepLength"
            id="designSubmit1"
            @click="designSubmiterror"
            class="submiterror"
          >
            <i class="icon iconfont icon-ir-ok"></i>&nbsp;提交
          </el-button>
          <el-button
            v-if="submitState==1"
            type="info"
            :disabled="!designStepLength"
            id="designSubmit"
            @click="designSubmit"
          >
            <i class="icon iconfont icon-ir-ok"></i>&nbsp;提交
          </el-button>
          <el-button
            type="info"
            :disabled="!designStepLength"
            @click="designSchedule"
            id="designSchedule"
          >
            <i class="icon iconfont icon-ir-add"></i>&nbsp;调度
          </el-button>
          <el-button type="info" @click="designDelSave" id="designDelSave">
            <i class="fa fa-eraser"></i>&nbsp;清空
          </el-button>
        </div>
      </div>
      <div class="rf-content">
        <el-row class="drawingCanvas" id="drawingCanvas" element-loading-background="#f6f6f6">
          <!-- 右侧节点区 -->
          <!-- <div id="right" v-loading="gQueryLoading" v-if="!id"> -->
          <div id="right">
            <el-collapse accordion>
              <!-- <el-collapse-item
                v-for="(drawNav,index) in gQuery"
                track-by="$index"
                v-if="drawNav.thisIcon.length != '0'&&drawNav.group!=='define'"
                :key="index + '-gQuery'"
                :name="index"
              > -->
              <el-collapse-item
                v-for="(drawNav,index) in defineArr"
                track-by="$index"
                v-if="drawNav.thisIcon.length != '0'"
                :key="index + '-gQuery'"
                :name="index"
              >
                <template slot="title">
                  <i class="icon iconfont icon-ir-supply-chain"></i>
                  &nbsp;{{drawNav.group | cn}}
                  <span
                    class="iconNavNub"
                  >({{drawNav.thisIcon.length}})</span>
                </template>
                <div
                  class="designIcon"
                  v-for="(drawIcon,index) in drawNav.thisIcon"
                  :key="index + '-drawNav'"
                  :data-index="index"
                  :data-type="drawIcon.type"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="drawIcon.name| cn"
                    placement="top"
                  >
                    <div>
                      <i class="icon iconfont icon-ir-designIconBg designIconBg"></i>
                      <i :class="drawIcon.name | iconFilter"></i>
                      <h4>{{drawIcon.name | cn}}</h4>
                    </div>
                  </el-tooltip>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <!-- 画布 -->
          <div id="designMain"
          ></div>
        </el-row>
      </div>
      <el-dialog
        title="请选择节点输出ID"
        :visible.sync="customize.dialogVisible"
        width="30%"
        >
        <el-select v-model="customizeData" placeholder="请选择">
          <el-option
            v-for="item in customizeOptions"
            :key="item.id"
            :label="item.id"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="customize.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="customizeSure">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="节点测试"
        :visible.sync="testSteps.dialogVisible"
        width="60%"
        id="nodeTest"
        @closed="reload()"
        >
        <div>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane v-for="item in testOutputkey" :key="item" :label="item" :name="item"></el-tab-pane>
          </el-tabs>
          <el-table
            :data="testDesignData"
            border
            style="width: 100%;"
            height="500"
            >
             <el-table-column
              v-for="(item,index) in tableHead"
              :key = "index"
              :prop="item.prop"
              :label="item.prop">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <el-dialog
        title="节点测试日志"
        :visible.sync="designTestdialogVisible"
        width="60%"
        >
          <div>
            <p v-for="item in testDesignerror">{{item}}</p>
          </div>
        </el-dialog>
      <!-- 节点设置 弹出层 -->
      <!-- <node-set ref="nodeData" :nodeSet = "nodeSet"  @getWorkDataflowName="getStepDataflowName" ></node-set> -->
      <component
        :is="flowNodeTypes"
        ref="nodeData"
        :nodeSet="nodeSet"
        @getWorkDataflowName="getStepDataflowName"
      ></component>
      <!-- 参数声明 弹出层 -->
      <design-set :flowSetData="flowSet" ref="desSetReData" @tableData="tableData"></design-set>
      <!-- 执行计划设置 弹出层 -->
      <design-submit :flowSubData="flowSubData"></design-submit>
      <!-- 自定义step标题 弹出层 -->
      <custom-step
        :customDataSet="customData"
        :changeSteps="changeSteps"
        @customStatus="customStatus"
      ></custom-step>
      <!-- 自定义组合step内容 弹出层 -->
      <custom-content
        :customDataSet="customContentStep"
        @customDataContentSet="customDataContentSet"
      ></custom-content>
      <!-- 组合step 展示每个节点的内容 -->
      <steps-combination :stepsCombination="stepsCombination"></steps-combination>
      <!-- 选择节点的输入输出 -->
      <steps-input :stepsinput="stepsinput" @delCurrentLinks="delCurrentLinks"></steps-input>
      <steps-output :stepsoutput="stepsoutput" @delCurrentLinks="delCurrentLinks"></steps-output>
      <design-node :designNode="designNode" @designNodeload="designNodeload"></design-node>
      <el-dialog
              :title="thisNode.type+' 类型信息'"
              :visible.sync="updateJsondialogVisible"
              width="70%"
              :before-close="handleClose"
              :close-on-click-modal="false">
          <el-form id="bm-flowjson-dialog-form" class="updateJson">
              <el-form-item>
                  <p>
                      ID&nbsp;:&nbsp;{{thisNode.id}}&nbsp;&nbsp;
                      名称&nbsp;:&nbsp;{{thisNode.name}}&nbsp;&nbsp;
                      类型&nbsp;:&nbsp;{{thisNode.type}}&nbsp;&nbsp;
                      X&nbsp;:&nbsp;{{thisNode.x}}&nbsp;&nbsp;
                      Y&nbsp;:&nbsp;{{thisNode.y}}&nbsp;&nbsp;
                  </p>
                  <el-input
                          auto-complete="off"
                          :rows="16"
                          type="textarea"
                          placeholder="请输入节点Json"
                          v-model="updateJsonData">
                  </el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="nodeJsonTrue">确 定</el-button>
              <el-button @click="updateJsondialogVisible = false">取 消</el-button>
          </span>
      </el-dialog>
    </div>
  </section>
</template>
<script>
import _ from "lodash";
import { mapActions, mapState } from "vuex";
// import $ from "jquery"; //jquery库
import jQul from "@static/jsLibrary/jquery-ui.min.js"; //jquery-ui库
 //时间过滤库
// import jsPlumb from "@static/jsPlumb/jsPlumb-2.2.3-min"; //jsPlumb-2.2.3-min
import jsPlumb from "jsplumb"; //"jsplumb": "^2.11.2",
import {
  drawFlowData,
  drawGquery,
  drawHistoryData,
  drawHistoryVersion,
  drawSaveData,
  getDataset,
  definestep,
  savestep,
  defineListAll,
  defineConfDetail,
  testFlow,
  testFlowStatementid
} from "@api"; //接口
import {
  origin,
  destination,
  getSteps,
  createRandomTime
} from "./flowStyle";
// import nodeSet from '@design/designDraw/nodeSetDataflow.vue';   //节点设置 组件
import { flowNodeTypeComp } from "@function/flowTypeNode"; //参数类型
import designSet from "@design/designDraw/designSet.vue"; //参数声明 组件
import designSubmit from "@design/designDraw/designSubmit.vue"; //执行计划设置 组件
import zoom from "@static/jsLibrary/jsPlumbLine/zoom.js"; //缩放函数
import {
  copyArr,
  deepCopy,
  unique,
  filterObj,
  filterId,
  transformArr,
  formatJson
} from "@function/comFunction.js"; //引入公用函数
import {
  stepsFilterObj,
  displayProp,
  createComparisonFunction
} from "@function/designFunction.js"; //引入design专用函数
import {
  nodeIcon,
  nodeClass,
  specialNodeClass,
  nodeQuote,
  nodeCache,
  nodeLinks,
  noParme,
  customizeSteps,
  datamining
} from "@function/nodeSet";
import customStep from "@design/designDraw/customStep.vue";
import customContent from "@design/designDraw/customContent.vue"; //组合steps列表
import stepsCombination from "@design/designDraw/stepsCombination.vue"; //组合steps 显示分节点
import stepsInput from "@design/designDraw/stepsInput.vue"; // 选择节点的输入输出
import stepsOutput from "@design/designDraw/stepsOutput.vue"; // 选择节点的输入输出
// import store from '@store/index'
import designNode from "@design/designDraw/designNode.vue"; //组合steps 显示分节点
import moment from "moment"//时间格式化

var int = parseInt(0);
function createRandomId() {
  int++;
  var thisId = [];
  $("#designMain .designIconBig").each(function() {
    thisId.push($(this).attr("data-index"));
  });
  var thisIfArr = [];
  for (var i = 0; i < thisId.length; i++) {
    var str = thisId[i];
    var index = str.lastIndexOf("_");
    str = str.substring(index + 1, str.length);
    if (str == int) {
      thisIfArr.push(true);
    } else {
      thisIfArr.push(false);
    }
  }
  if (thisIfArr.indexOf(true) == -1) {
    return int;
  } else if (thisIfArr.indexOf(true) != -1) {
    return createRandomId();
  }
}
export default {
  components: {
    jQul,
    jsPlumb,
    // nodeSet,
    designSet,
    designSubmit,
    customStep,
    customContent,
    stepsCombination,
    stepsInput,
    stepsOutput,
    designNode
  },
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  inject: ["reload"],
  data() {
    return {
      uiElement: {},
      loading: false,
      IsFirstConnection: false,
      currentConnection: "",
      flowId: this.$route.params.id, //流程ID
      flowType: this.$route.query.type, //流程类型
      flowName: "", //流程名称
      flowData: [], //流程数据
      flowHistory: [], //流程历史数据
      flowVersion: "", //流程历史版本值
      statementTab: [], //流程设置 参数申明 的tab切换数据
      schemaId: "", //存储schemaId 验证
      datasetIdArr: [], //存储 datasetIdArr 验证
      saveFlowData: {}, //流程保存 保存接口的传参对象
      nodeLength: "", //初始化时，获取流程节点的数量
      nodeStepsData: [], //存储gquery 当前流程类型的节点数据
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
        // quoteAllDataMsg: {                  //流程设置 数据
        //     inputs: [],                     //流程设置 输入
        //     parameters: [],                 //流程设置 参数
        //     outputs: [],                    //流程设置 输出
        //     dependencies:[]                 //流程设置 依赖
        // },
        flowData: {
          inputs: [], //流程设置 输入
          parameters: [], //流程设置 参数
          outputs: [], //流程设置 输出
          dependencies: [] //流程设置 依赖
        },
        flowSetVisible: false //设置 参数声明 弹出框 显示/隐藏
      },
      customData: {
        flowSetVisible: false,
        flowData: []
      },
      testSteps:{
        dialogVisible: false
      },
      customContentStep: {
        flowSetVisible: false,
        flowData: []
      },
      stepsCombination: {
        flowSetVisible: false,
        flowData: []
      },
      stepsinput: {
        flowSetVisible: false,
        flowData: []
      },
      stepsoutput: {
        flowSetVisible: false,
        flowData: []
      },
      designNode:{
        nodeVisible : false,
        flowData:[]
      },
      flowSubData: {
        //选择历史版本
        flowId: "",
        flowName: "",
        flowType: "",
        dSubName: "",
        dSubTime: "",
        flowHisVersion: "",
        flowData: [],
        flowSubmitVisible: false
      },
      copySteps: [], //复制 需要的当前的流程数据
      thisStepId: "", //复制 需要的当前流程的ID
      thisObj: {}, //复制 存储深度拷贝数据
      thisLinksData: [], //双击获取当前流程的所有连接线
      gQuery: [], //根据流程类型获取相对应的节点
      flowCanvasLoading: true, //流程画布 加载状态
      gQueryLoading: true, //右侧节点 加载状态
      nodeSet: {
        //节点详细信息
        newName: "", //新名称
        inputData: [], //存储当前节点上一个的输入数据
        outputData: [], //存储输出数据
        nodeSetTab: [], //存储 节点信息 弹出框的tab切换
        thisNodeData: [], //双击节点 获取当前节点数据
        nodeLine: {
          //当前节点的 输入输出线
          inputLine: [],
          outputLine: []
        },
        datasetType: "", // source 数据集类型
        flowData: [], //流程数据
        nodeSetVisible: false, //节点设置 组件 弹出框 显示/隐藏
        dbStatus: "1" //节点双击状态
      },
      designStepLength: "", //当前流程的 节点数量
      labelPosition: "left", //表单域标签的位置
      bSk: false, //验证 参数声明 流程设置 的参数内有无数据 ??
      submitState: 1, //提交按钮状态
      //id: this.id,
      flowNodeTypes: "", //节点类型组件
      routeTrue: false, //离开路由监听状态
      changeSteps: {
        changeStepsArr: [],
        changeLinksArr: []
      },
      preStepList:'',
      subFlowId: "",
      nodedesign:{},
      mockdefine:[{
            group: "definesteps",
            thisIcon: [
                  {
                    "id": "definesteps_straaa",
                    "name": "definesteps",
                    "type": "definesteps",
                    "group": "ICO",
                    "icon": "default.png",
                    "inputCount": 0,
                    "outputCount": 1,
                    "inputConfigurations": [{
                        "id": "",
                        "fields": []
                    }],
                    "outputConfigurations": [{
                        "id": "",
                        "fields": []
                    }],
                    "otherConfigurations": {
                    },
                    "creator": "SYSTEM",
                    "createTime": 1564727377000,
                    "lastModifier": "SYSTEM",
                    "lastModifiedTime": 1564727377000,
                    "owner": "SYSTEM",
                    "version": 1,
                    "enabled": 1,
                    "moduleVersion": 0,
                    "tags": ["ICO", "dataflow"],
                    "expiredPeriod": 0
                }
              ]
          }
        ],
      defineArr:[],
      customize:{
        dialogVisible: false,
        flowData: []
      },
      customizeOptions:[{value:'output01',label:'output01'},
                {value:'output02',label:'output02'}
              ],
      customizeData:[],
      sourceData:[],
      targetData:[],
      connect:[],
      outputId: ['output','left','right','yes','no','ok','error'],
      inputCountArr:[],
      coustomizeStatus:false,
      testIdArr: [],
      statementId:'',
      execution: false,
      activeName: '',
      testOutputkey:[],
      testOutputContent: {
      },
      tableHead:[
      ],
       testDesignData: [],
       testDesignerror:[],
       designTestdialogVisible:false,
       prevRes:{},
       prevHead:{},
       nodeParame:[                 // 节点参数配置sink
          {
            title: "输入",
            name: 'input',
            icon: "fa fa-sign-in"
          },
          {
            title: "参数",
            name: "parameter",
            icon: "fa fa-sign-out"
          }
       ],
       updateJsondialogVisible:false,           //当前节点编辑json 弹出框 显示/隐藏
       updateJsonData:"",                       //编辑当前节点的json数据
       thisNode:{
            id:"",
            type:"",
            name:"",
            x:"",
            y:"",
        },

    };
  },
  filters: {
    //过滤右侧图标
    iconFilter: function(value) {
      if (nodeIcon(value) == "iconTrue") {
        return "icon iconfont icon-ir-d-" + value;
      } else {
        return "icon iconfont icon-ir-d-default";
      }
    },
    //过滤历史版本下拉内容的时间，返回 YYYY-MM-DD HH:mm:ss 格式
    updateTimeFilter: function(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    $route(to, from) {
    }
  },
  created: function() {
  },
  methods: {
    ...mapActions([
      "getAllLinks",
      "insertLinks",
      "getDataFlow",
      "inserSubtLinks",
      "setlinksId",
      "getSubFlowSteps",
      "getdblSteps",
      "setSetting",
      "getactionLinks",
      "getStepsparameter",
      "getCommonStepData"
    ]),
    drawJsplumbflow(_that, ui, _this, self,$) {
      _that.setContainer(self);
      var randomId = createRandomId();
      var left =
        parseInt(ui.left - self.offset().left) + self.scrollLeft(); //添加左侧滚动条的距离
      var top = parseInt(ui.top - self.offset().top) + self.scrollTop(); //添加右侧滚动条的距离
      var type = ui.type;
      var name = ui.name;
      if (nodeIcon(type) == "iconTrue") {
        var iconType = type;
      } else {
        var iconType = "default";
      }
      var ele = $(
        '<div class="designIconBig t2Style" data-sign="' +
          name +
          "_" +
          randomId +
          '" dataindex="' +
          type +
          "_" +
          randomId +
          '" data-index="' +
          type +
          "_" +
          randomId +
          '"  data-type="' +
          type +
          '">' +
          '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-' +
          iconType +
          '"></i><h4 title="' +
          name +
          "_" +
          randomId +
          '">' +
          name +
          "_" +
          randomId +
          "</h4><h5>ID:" +
          type +
          "_" +
          randomId +
          
          '</h5><em id="updateJson" class="fa fa-pencil-square-o"></em><em id="pitchOnDes" class="fa fa-square-o" style=' +
          (type == "cache" ? "display:none" : "") +
          ' title="选中" ></em><em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em><em id="removeDes" class="fa fa-trash-o" title="删除"></em>' +
          "</div>" +
          "</div>"
      );

      if (nodeClass(type) == "classD_A") {
        var ele = $(
          '<div class="designIconBig t1Style" data-sign="' +
            name +
            "_" +
            randomId +
            '" dataindex="' +
            type +
            "_" +
            randomId +
            '" data-index="' +
            type +
            "_" +
            randomId +
            '"  data-type="' +
            type +
            '">' +
            '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-' +
            iconType +
            '"></i><h4 title="' +
            type +
            "_" +
            randomId +
            '">' +
            name +
            "_" +
            randomId +
            "</h4><h5>ID:" +
            type +
            "_" +
            randomId +
            '</h5><em id="updateJson" class="fa fa-pencil-square-o"></em><em id="pitchOnDes" class="fa fa-square-o" title="选中" style=' +
            (type == "sink" ? "display:none" : "") +
            '></em><em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em><em id="removeDes" class="fa fa-trash-o" title="删除"></em>' +
            "</div>" +
            "</div>"
        );

        _that.addEndpoint(
          ele,
          { anchors: "RightMiddle", maxConnections: -1 },
          origin
        ); //起点
      } else if (nodeClass(type) == "classD_B") {
        var ele = $(
          '<div class="designIconBig t3Style" data-sign="' +
            name +
            "_" +
            randomId +
            '" dataindex="' +
            type +
            "_" +
            randomId +
            '" data-index="' +
            type +
            "_" +
            randomId +
            '"  data-type="' +
            type +
            '">' +
            '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-' +
            iconType +
            '"></i><h4 title="' +
            type +
            "_" +
            randomId +
            '">' +
            name +
            "_" +
            randomId +
            "</h4><h5>ID:" +
            type +
            "_" +
            randomId +
            '</h5><em id="updateJson" class="fa fa-pencil-square-o"></em><em id="pitchOnDes" class="fa fa-square-o" title="选中" style=' +
            (type == "sink" ? "display:none" : "") +
            '></em><em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em><em id="removeDes" class="fa fa-trash-o" title="删除"></em>' +
            "</div>" +
            "</div>"
        );
        _that.addEndpoint(ele, { anchors: "LeftMiddle" }, destination);
      } else if (
        nodeClass(type) == "classD_C" ||
        nodeClass(type) == "classW_C"
      ) {
        _that.addEndpoint(
          ele,
          { anchors: "RightMiddle", maxConnections: -1 },
          origin
        ); //起点
        _that.addEndpoint(
          ele,
          { anchors: "LeftMiddle", maxConnections: -1 },
          destination
        ); //终点
      } else if (specialNodeClass(type) == "classD_D1") {
        _that.addEndpoint(
          ele,
          {
            anchors: [1, 0.3, 0, 0],
            maxConnections: -1,
            overlays: [
              [
                "Label",
                {
                  location: [1.5, -0.5],
                  label: "yes",
                  cssClass: "endpointSourceLabel"
                }
              ]
            ]
          },
          origin
        );
        _that.addEndpoint(
          ele,
          {
            anchors: [1, 0.7, 0, 0],
            maxConnections: -1,
            overlays: [
              [
                "Label",
                {
                  location: [1.5, 1.3],
                  label: "no",
                  cssClass: "endpointSourceLabel"
                }
              ]
            ]
          },
          origin
        );
        _that.addEndpoint(ele, { anchors: "LeftMiddle" }, destination); //终点
      } else if (specialNodeClass(type) == "classD_D2") {
        _that.addEndpoint(
          ele,
          {
            anchors: [1, 0.3, 0, 0],
            maxConnections: -1,
            overlays: [
              [
                "Label",
                {
                  location: [1.5, -0.5],
                  label: "ok",
                  cssClass: "endpointSourceLabel"
                }
              ]
            ]
          },
          origin
        );
        _that.addEndpoint(
          ele,
          {
            anchors: [1, 0.7, 0, 0],
            maxConnections: -1,
            overlays: [
              [
                "Label",
                {
                  location: [1.5, 1.3],
                  label: "error",
                  cssClass: "endpointSourceLabel"
                }
              ]
            ]
          },
          origin
        );
        _that.addEndpoint(ele, { anchors: "LeftMiddle" }, destination); //终点
      } else if (specialNodeClass(type) == "classD_E1") {
        _that.addEndpoint(
          ele,
          { anchors: "RightMiddle", maxConnections: -1 },
          origin
        );
        _that.addEndpoint(
          ele,
          {
            anchors: [0, 0.3, 0, 0],
            overlays: [
              [
                "Label",
                {
                  location: [-1, -0.5],
                  label: "left",
                  cssClass: "endpointSourceLabel"
                }
              ]
            ]
          },
          destination
        );
        _that.addEndpoint(
          ele,
          {
            anchors: [0, 0.7, 0, 0],
            overlays: [
              [
                "Label",
                {
                  location: [-1, 1.5],
                  label: "right",
                  cssClass: "endpointSourceLabel"
                }
              ]
            ]
          },
          destination
        );
      } else if (specialNodeClass(type) == "classD_E2") {
        _that.addEndpoint(
          ele,
          { anchors: "RightMiddle", maxConnections: -1 },
          origin
        );
        _that.addEndpoint(
          ele,
          {
            anchors: [0, 0.3, 0, 0],
            overlays: [
              [
                "Label",
                {
                  location: [-1, -0.5],
                  label: "input1",
                  cssClass: "endpointSourceLabel"
                }
              ]
            ]
          },
          destination
        );
        _that.addEndpoint(
          ele,
          {
            anchors: [0, 0.7, 0, 0],
            overlays: [
              [
                "Label",
                {
                  location: [-1, 1.5],
                  label: "input2",
                  cssClass: "endpointSourceLabel"
                }
              ]
            ]
          },
          destination
        );
      } else {
        _that.addEndpoint(
          ele,
          { anchors: "RightMiddle", maxConnections: -1 },
          origin
        ); //起点
        _that.addEndpoint(
          ele,
          { anchors: "LeftMiddle", maxConnections: -1 },
          destination
        ); //终点
      }
      ele.css({
        left: left,
        top: top,
        position: "absolute",
        margin: 0
      });
      //_that.draggable(ele, {containment: "parent"});//端点可以拖动设置,并且将端点限制在父级内
      self.append(ele);
      _that.repaintEverything();
      _that.draggable(ele);
      ele.draggable({
        containment: $("#designMain")
      });
      if (self.find(".designIconBig").length == 0) {
        _this.designStepLength = "";
      } else {
        _this.designStepLength = $("#designMain").find(".designIconBig").length;
      }
      //参数声明 引用读取
      _this.flowSet.inputs = false;
      _this.flowSet.outputs = false;
      self
        .find(".designIconBig")
        .each(function() {
          var dataType = $(this).attr("data-type");
          if (nodeQuote(dataType) === "quoteA") {
            _this.flowSet.quoteDataInput.push(
              $(self)
                .find("h4")
                .text()
            );
            _this.flowSet.inputs = true;
          }
          if (nodeQuote(dataType) === "quoteB") {
            _this.flowSet.quoteDataOutput.push(
              $(this)
                .find("h4")
                .text()
            );
            _this.flowSet.outputs = true;
          }
          _this.flowSet.quoteDataParameter.push(
            $(this)
              .find("h4")
              .text()
          );
        });
      _this.flowSet.quoteDataInput = unique(_this.flowSet.quoteDataInput);
      _this.flowSet.quoteDataParameter = unique(
        _this.flowSet.quoteDataParameter
      );
      _this.flowSet.quoteDataOutput = unique(_this.flowSet.quoteDataOutput);
    },
    handleClick(tab, event) {
        let tableHeadJson =[]
        if((this.testOutputContent[this.activeName]).length==0){
          tableHeadJson =[]
        }else {
          tableHeadJson = Object.keys((this.testOutputContent[this.activeName])[0])
        }

        this.tableHead =[]
        if(tableHeadJson.length!=0){
          tableHeadJson.forEach((item,index) =>{
            this.tableHead.push({prop:item})
          })
        }
        this.testDesignData =  this.testOutputContent[this.activeName]
    },
    testDesignRes(val){
      switch(val){
        case '01':
          this.execution = true
          this.testDesign()
          break;
        case '02':
          this.execution = false
          this.testDesign()
          break;
        case '03':
          this.loadTestTable(this.prevRes)

          this.testSteps.dialogVisible = true
          break;
        case '04':
          this.designTestdialogVisible = true
          break;
      }
    },
    testDesign(){  //测试流程
        this.filterLinks()
        this.testOutputContent = {}   //清空测试数据tableData
        this.prevRes = []
        let changeLinks = []
        let getlinks = JSON.parse(sessionStorage.getItem("links"));
        this.testIdArr = this.changeSteps.changeStepsArr.map(item => {
          return item.id
        })
        this.testIdArr.forEach(item => {
          getlinks.forEach(item1 =>{
            if(item==item1.target){
              changeLinks.push(item1)
            }
          })
        })
        //过滤多余的线 （线里有targe节点，但是没有source节点）
        for(var k = 0; k<changeLinks.length;k++){
            if(this.testIdArr.indexOf(changeLinks[k].source) < 0){
                changeLinks.splice( k,1)
            }
        }
        let sessionTestId = []
        if(sessionStorage.getItem('testIdArr')!=null){
            sessionTestId = (sessionStorage.getItem('testIdArr')).split(',')
        }

        if(sessionTestId.length==1&&sessionTestId[0]==""){
          sessionTestId = []
        }
        if(sessionTestId!='undefined'&&sessionTestId.length!=0){
          sessionTestId.forEach(item =>{
              $(`div[dataindex=${item}]`).css('animation','')
          })
        }
        // animation: 1.5s ease-in-out 0s infinite normal none running scaleout;
        // scaleout 1.5s infinite ease-in-out
        this.testIdArr.forEach(item =>{
          setTimeout(()=>{
            $(`div[dataindex=${item}]`).css('animation','scaleout 1.5s infinite ease-in-out')
          },500)
        })
        sessionStorage.setItem('testIdArr',this.testIdArr)
        let data = {
            ...this.flowData,
            steps:this.changeSteps.changeStepsArr,
            links:changeLinks,
        }
        if(data.dependencies&&data.dependencies.length==0){
          delete data.dependencies
        }
        if(data.parameters&&data.parameters.length==0){
          delete data.parameters
        }
        let BaseSteps = JSON.parse(JSON.stringify(data))
        testFlow(this.execution,BaseSteps).then((res)=>{
          this.statementId = res.statementId
          this.clusterId = res.clusterId
          this.getFlowInit()
        },err=>{
          // 全局400报 请求错误 忽略当前的错误提幸
          // this.$message({
          //   message:err.response.data.detailMsg,
          //   type:'error',
          //   duration: 1500
          // })
          this.testIdArr.forEach(item =>{
            setTimeout(()=>{
              $(`div[dataindex=${item}]`).css('animation','')
            },500)
          })
          this.$message({
            message: err.response.data.detailMsg
          })
        })
        this.customStatus()
    },
    getFlowInit(){
      let flowTimer = setTimeout(()=>{
        testFlowStatementid(this.statementId, this.clusterId).then(res =>{
          let data = res.statement
           if(data === 'running' || data === 'waiting' || data === 'error' || data === 'ready'){
             clearTimeout(flowTimer)
             this.getFlowInit()
           }else {
             if(res.content){
                this.testSteps.dialogVisible = true
                this.prevRes = JSON.parse(JSON.stringify(res))
                this.loadTestTable(res)
             }
             if(this.execution==false){
               this.$message({
                 message:'校验成功',
                 type:'success',
                 duration: 1500
               })
             }
            this.testIdArr.forEach(item =>{
                  $(`div[dataindex=${item}]`).css('animation','success 1.5s infinite ease-in-out')
              })
            this.testDesignerror = []
           }
        },error=>{
          if(this.execution==false){
               this.$message({
                 message:'校验失败',
                 type:'error',
                 duration: 1500
               })
             }
          this.testIdArr.forEach(item =>{
            setTimeout(()=>{
              $(`div[dataindex=${item}]`).css('animation','')
            },500)
          })
          this.testDesignerror = error.response.data.errorlog
          this.designTestdialogVisible = true

          this.testDesignData = []
        })
      },3000)
    },
    loadTestTable(res){
      this.testOutputContent = res.content
      this.testOutputkey = Object.keys(res.content)
      this.activeName = this.testOutputkey[0]
      let tableHeadJson =[]
      if((this.testOutputContent[this.activeName]).length==0){
        tableHeadJson =[]
      }else {
        tableHeadJson = Object.keys((this.testOutputContent[this.activeName])[0])
      }
      this.tableHead =[]
      if(tableHeadJson.length!=0){
        tableHeadJson.forEach((item,index) =>{
          this.tableHead.push({prop:item})
        })
      }
      this.testDesignData = this.testOutputContent[this.activeName]
      this.$set(this.testDesignData,this.testOutputContent[this.activeName])
      // this.prevRes = JSON.parse(JSON.stringify(this.testDesignData))
      // this.prevHead= JSON.parse(JSON.stringify(this.testOutputkey))
    },
    filetSinkParamData(val){
       let otherConfigurations=val.otherConfigurations;
       let nodeSetFlowType=val.type;
       let thisNodeData=val;
      //  let otherConfigurations=nodeSet.thisNodeData.otherConfigurations;
      //  let nodeSetFlowType=nodeSet.thisNodeData.type;
      //  let thisNodeData=nodeSet.thisNodeData;
       let result={
         dataset:otherConfigurations.dataset,
         datasetId:otherConfigurations.datasetId?otherConfigurations.datasetId:"",
         schema:otherConfigurations.schema,
         schemaId:otherConfigurations.schemaId?otherConfigurations.schemaId:"",
         type:otherConfigurations.type,
         schemaVersion:otherConfigurations.schemaVersion?otherConfigurations.schemaVersion:"",
         description:otherConfigurations.description,
        //  countWrittenRecord:thisNodeData.countWrittenRecordVal?thisNodeData.countWrittenRecordVal:"",
        //  expiredTime:thisNodeData.expiredTime?thisNodeData.expiredTime:""
         countWrittenRecord:otherConfigurations.countWrittenRecord?otherConfigurations.countWrittenRecord:"",
         expiredTime:(otherConfigurations.expiredTime==0||otherConfigurations.expiredTime)?otherConfigurations.expiredTime:""
       };
        if(otherConfigurations.dataResource&&otherConfigurations.dataResource!=''){
          result.dataResource = otherConfigurations.dataResource
          result.datasetResourceId = otherConfigurations.datasetResourceId
        }
        if( otherConfigurations.schemaResource&& otherConfigurations.schemaResource!=''){
          result.schemaResource = otherConfigurations.schemaResource
          result.schemaResourceId = otherConfigurations.schemaResourceId
        }

       if((Object.keys(otherConfigurations)).length==0){
         return result = {}
       }
       //高级
       if(thisNodeData.advancedParameters){
         result={
           ...result,
           singleRowCache:thisNodeData.advancedParameters.singleRowCache,
         };
       }

       if(thisNodeData.countWrittenRecord){
         result={
           ...result,
           countWrittenRecord:thisNodeData.countWrittenRecord,
         };
       }


        if(thisNodeData.cpexpiredTimeVal){
            result={
              ...result,
              cpexpiredTimeVal:thisNodeData.otherConfigurations.cpexpiredTimeVal,
            };
          }

       if(otherConfigurations.type=='HDFS'){
         result={
           ...result,
           format:otherConfigurations.format,
           path:otherConfigurations.path
         };
       }

       if(otherConfigurations.type=='HDFS' && (otherConfigurations.format == 'csv'||otherConfigurations.format == 'txt')){
         result={
           ...result,
           separator:otherConfigurations.separator
         };
       }

       if(otherConfigurations.type=='HDFS' && otherConfigurations.format == 'csv'){
           result={
           ...result,
           quoteChar:otherConfigurations.quoteChar
         };
       }

       if(otherConfigurations.type=='HDFS' && otherConfigurations.format == 'csv'){
         result={
           ...result,
           escapeChar:otherConfigurations.escapeChar
         };
       }

       if(otherConfigurations.type=='JDBC'){
          result={
           ...result,
           name:otherConfigurations.name,
           driver:otherConfigurations.driver,
           DBType:otherConfigurations.DBType?otherConfigurations.DBType:"",
           specifiedStringColumnTypes:otherConfigurations.specifiedStringColumnTypes,
           jarPath:otherConfigurations.jarPath,
          //  specifiedStringColumnTypes:_.compact([
          //    {dataType:otherConfigurations.specifiedStringColumnTypes1},
          //    {dataType:otherConfigurations.specifiedStringColumnTypes2},
          //    {dataType:otherConfigurations.specifiedStringColumnTypes3},
          //  ])
         };
       }

       if(otherConfigurations.type=='JDBC' || otherConfigurations.type=='FTP'){
          result={
           ...result,
           url:otherConfigurations.url,
           password:otherConfigurations.password
         };
       }

        if(otherConfigurations.type=='JDBC' || otherConfigurations.type=='FTP'|| otherConfigurations.type=='Neo4j'){
          result={
           ...result,
           user:otherConfigurations.user
         };
       }

       if(otherConfigurations.type=='HIVE' || otherConfigurations.type=='JDBC' || otherConfigurations.type=='HBASE'){
        result={
           ...result,
           table:otherConfigurations.table
         };
       }

       if(otherConfigurations.isShowbatchsize){
         result={
           ...result,
           batchsize:otherConfigurations.batchsize
         };
       }

       if(otherConfigurations.type=='HIVE' || otherConfigurations.type=='JDBC'){
         result={
           ...result,
           partitionColumns:otherConfigurations.partitionColumns
         };
       }

       if(otherConfigurations.type=='KAFKA'){
         result={
           ...result,
           brokers:otherConfigurations.brokers,
           topic:otherConfigurations.topic,
           groupId:otherConfigurations.groupId
         };
       }

       if(otherConfigurations.type=='HBASE'){
          result={
           ...result,
           namespace:otherConfigurations.namespace,
           columns:otherConfigurations.columns,
           columnsKey:otherConfigurations.columnsKey,
           columnsColumns:otherConfigurations.columnsColumns
         };
       }

       if(otherConfigurations.type=='REDIS'|| otherConfigurations.type=='Neo4j'){
         result={
           ...result,
           url:otherConfigurations.url,
           password:otherConfigurations.password
         };
       }

       if(otherConfigurations.type=='REDIS'){
          result={
           ...result,
           keyColumn:otherConfigurations.keyColumn,
           table:otherConfigurations.table
         };
       }

       if(otherConfigurations.type == 'Neo4j'){
          result={
           ...result,
           src:otherConfigurations.src,
           edge:otherConfigurations.edge,
           target:otherConfigurations.target,
         };
       }

       if(otherConfigurations.type == 'Neo4j'&&otherConfigurations.sourceFields.length!=0){
          result={
           ...result,
           sourceFields:otherConfigurations.sourceFields
         };
       }

        if(otherConfigurations.type == 'Neo4j'&&otherConfigurations.edgeFields.length!=0){
          result={
           ...result,
           edgeFields:otherConfigurations.edgeFields
         };
       }

        if(otherConfigurations.type == 'Neo4j'&&otherConfigurations.targetFields.length!=0){
          result={
           ...result,
           targetFields:otherConfigurations.targetFields
         };
       }

       if(otherConfigurations.type=='S3A'){
          result={
           ...result,
           format:otherConfigurations.format,
           path:otherConfigurations.path,
           accessKey:otherConfigurations.accessKey,
           secretKey:otherConfigurations.secretKey,
           endpoint:otherConfigurations.endpoint,
           quoteChar:otherConfigurations.quoteChar

         };
       }

       if(otherConfigurations.type=='S3A' && (otherConfigurations.format == 'csv'||otherConfigurations.format == 'txt')){
         result={
           ...result,
           separator:otherConfigurations.separator
         };
       }

       if(otherConfigurations.type=='S3A' && otherConfigurations.format == 'csv'){
          result={
           ...result,
           escapeChar:otherConfigurations.escapeChar
         };
       }

       if(otherConfigurations.type!='Neo4j'){
          result={
           ...result,
           mode:otherConfigurations.mode
         };
       }

       if( thisNodeData.otherConfigurations.type=='HDFS'){
          result={
           ...result,
           nullValue:thisNodeData.otherConfigurations.nullValue,
           maxFileSize:thisNodeData.otherConfigurations.maxFileSize,
           maxFileNumber:thisNodeData.otherConfigurations.maxFileNumber,
           sliceTimeColumn:thisNodeData.otherConfigurations.sliceTimeColumn,
           sliceType:thisNodeData.otherConfigurations.sliceType
         };
       }
       return result;
    },
    findDefineSteps() {
      return _.find(this.flowData.steps, item => {
        return item.type == "define";
      });
    },
    getTargetItem(val) {
      return _.find(this.pk.subFlowLinks, (item, index) => {
        return val == item.target;
      });
    },
    getSubFlowPreSteps(val) {
      return _.find(this.pk.subFlowSteps, (item, index) => {
        return item.id == val.source;
      });
    },
    delCurrentLinks() {
      jsPlumb.jsPlumb.deleteConnection(this.currentConnection);
      this.insertLinks([]);
      this.setlinksId("");
    },
    async getSubFlowData(val) {
      let subItem = _.find(val.steps, o => {
        return o.type == "define";
      });
      if (subItem) {
        this.subFlowId = subItem.id;
        let data = await definestep(subItem.id);
        data.isEdit = true;
        this.customDataContentSet([data]);
        //sessionStorage.setItem('links',JSON.stringify(this.pk.allLinks))
        //console.log("联系 格式",JSON.parse(sessionStorage.getItem('links')));
      }
    },
    delSubFlowLinks(val, self) {
      let links = _.filter(_.cloneDeep(this.pk.subFlowLinks), item => {
        return item.name != val;
      });
      // return;
      this.inserSubtLinks(links);
    },
    //获取自定义组合steps状态
    customStatus(val) {
      $("#designMain .designIconBig").removeClass("redStyle");
      $("#designMain .designIconBig #pitchOnDes")
        .removeClass("fa-square")
        .css("color", "#b9c0d");
      this.changeSteps.changeStepsArr = []; //提交后清空多选steps
      this.changeSteps.changeLinksArr = [];
    },
    //流程参数不完整 提交
    designSubmiterror() {
      this.$message({
        message: "当前流程还没有保存,请修改后保存！！",
        type: "error",
        duration: 1500
      });
    },
    /**
     * 加载当前ID的设计视图
     * ------------------------------------------------------------------
     */
    readDesign(data) {
      this.flowData = data;
      //名称
      this.flowName = data.name;
      this.nodeLength = data.steps.length;
      //显示当前设计
      var elementSign = 0;
      var _this = this;
      var _that = jsPlumb.jsPlumb;
      // 连线初始化配置
      _that.ready(function() {
        _that.setContainer($("#designMain"));
        var mainHTML = "";
        for (var i = 0; i < data.steps.length; i++) {
          if (elementSign < data.steps[i].sign) {
            //如果已经保存过,即将标记更新
            elementSign = data.steps[i].sign;
          }
          var type = data.steps[i].type;
          let iconType = ""
          if (nodeIcon(type) == "iconTrue") {
            var designType = type;
            iconType = type
          }else if(type=='cache'){
            iconType = type
            var designType = "default";
          } else {
            var designType = "default";
            iconType = "default"
          }
          function frameDesign(css) {

            mainHTML +=
              '<div class="designIconBig ' +
              css +
               '" dataindex="' +
              data.steps[i].id +
              '" data-sign="' +
              data.steps[i].name +
              '" data-index="' +
              data.steps[i].id +
              '" data-type="' +
              data.steps[i].type +
              '" style="left:' +
              data.steps[i].x +
              "px;top:" +
              data.steps[i].y +
              'px;position:absolute;margin:0" >' +
              "<div>" +
              '<i class="icon iconfont icon-ir-designIconBg designIconBg"></i>' +
              '<i id="changeSte" class="icon iconfont icon-ir-d-' +
              designType+
              '"></i>' +
              '<h4 title="' +
              data.steps[i].name +
              '">' +
              data.steps[i].name +
              "</h4>" +
              "<h5>ID:" +
              data.steps[i].id +
              "</h5>" +
              '<em id="updateJson" class="fa fa-pencil-square-o"></em>'+
              '<em id="pitchOnDes" class="fa fa-square-o" title="选中" style=' +
              (iconType == "sink"||iconType =="cache"
                ? "display:none"
                : "") +
              "></em>" +
              // + designType=='source'||designType=="sink"?'':'<em id="pitchOnDes" class="fa fa-square-o" title="选中"></em>'
              '<em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>' +
              '<em id="removeDes" class="fa fa-trash-o" title="删除"></em>' +
              "</div>" +
              "</div>";
          }
          if (nodeClass(type) == "classD_A") {
            frameDesign("t1Style");
          } else if (nodeClass(type) == "classD_B") {
            frameDesign("t3Style");
          } else {
            frameDesign("t2Style");
          }
        }
        $("#designMain").append(mainHTML);
        $("#designMain .designIconBig").each(function() {
          var drawType = $(this).attr("data-type");
          //左侧无，右侧一个起点
          if (nodeClass(drawType) == "classD_A") {
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: 100 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
          } else if (nodeClass(drawType) == "classD_B") {
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle" },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
          } else if (
            nodeClass(drawType) == "classD_C" ||
            nodeClass(type) == "classW_C"
          ) {
            //左侧一个终点（多），右侧起点(多)
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle", maxConnections: -1 },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: -1 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
          } else if (specialNodeClass(drawType) == "classD_D1") {
            _that.addEndpoint(
              this,
              {
                anchors: [1, 0.3, 0, 0],
                maxConnections: -1,
                overlays: [
                  [
                    "Label",
                    {
                      location: [1.5, -0.5],
                      label: "yes",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "yes" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [1, 0.7, 0, 0],
                maxConnections: -1,
                overlays: [
                  [
                    "Label",
                    {
                      location: [1.5, 1.3],
                      label: "no",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "no" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle" },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
          } else if (specialNodeClass(drawType) == "classD_D2") {
            _that.addEndpoint(
              this,
              {
                anchors: [1, 0.3, 0, 0],
                maxConnections: -1,
                overlays: [
                  [
                    "Label",
                    {
                      location: [1.5, -0.5],
                      label: "ok",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "ok" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [1, 0.7, 0, 0],
                maxConnections: -1,
                overlays: [
                  [
                    "Label",
                    {
                      location: [1.5, 1.3],
                      label: "error",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "error" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle" },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
          } else if (specialNodeClass(drawType) == "classD_E1") {
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: -1 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [0, 0.3, 0, 0],
                overlays: [
                  [
                    "Label",
                    {
                      location: [-1, -0.5],
                      label: "left",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "left" + "destination"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [0, 0.7, 0, 0],
                overlays: [
                  [
                    "Label",
                    {
                      location: [-1, 1.5],
                      label: "right",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "right" + "destination"
              })
            );
          } else if (specialNodeClass(drawType) == "classD_E2") {
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: -1 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [0, 0.3, 0, 0],
                overlays: [
                  [
                    "Label",
                    {
                      location: [-1, -0.5],
                      label: "input1",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input1" + "destination"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [0, 0.7, 0, 0],
                overlays: [
                  [
                    "Label",
                    {
                      location: [-1, 1.5],
                      label: "input2",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input2" + "destination"
              })
            );
          } else {
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: -1 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle", maxConnections: -1 },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
          }
          _that.repaintEverything();
          _that.draggable($(this));
          $(this).draggable({
            containment: $("#designMain")
          });
        });
        if ($("#designMain").find(".designIconBig").length == 0) {
          _this.designStepLength = "";
        } else {
          _this.designStepLength = $("#designMain").find(
            ".designIconBig"
          ).length;
        }
        //固定连线
        if (data.links == undefined || data.links == "") {
        } else {
          for (var i = 0; i < data.links.length; i++) {
            var sourceOutputName = data.links[i].sourceOutput;
            var targtInputName = data.links[i].input;
            //    let sourceId=data.links[i].source+sourceOutputName+"origin",targetId=data.links[i].target+targtInputName+"destination";
            //    jsPlumb.connect({uuids:[sourceId,targetId],source:sourceId,target:targetId})
            _that.connect({
              uuids: [
                data.links[i].source + sourceOutputName + "origin",
                data.links[i].target + targtInputName + "destination"
              ]
            });
            // let uuids={uuids:[data.links[i].source+sourceOutputName+"origin",data.links[i].target+targtInputName+"destination"]};
          }
          // console.log("links ", data.links.length);
        }
        //参数声明 引用读取
        $("#designMain")
          .find(".designIconBig")
          .each(function() {
            var dataType = $(this).attr("data-type");
            if (nodeQuote(dataType) === "quoteA") {
              _this.flowSet.quoteDataInput.push(
                $(this)
                  .find("h4")
                  .text()
              );
              _this.flowSet.inputs = true;
            }
            if (nodeQuote(dataType) === "quoteB") {
              _this.flowSet.quoteDataOutput.push(
                $(this)
                  .find("h4")
                  .text()
              );
              _this.flowSet.outputs = true;
            }
            _this.flowSet.quoteDataParameter.push(
              $(this)
                .find("h4")
                .text()
            );
          });
        _this.flowSet.quoteDataInput = unique(_this.flowSet.quoteDataInput);
        _this.flowSet.quoteDataParameter = unique(
          _this.flowSet.quoteDataParameter
        );
        _this.flowSet.quoteDataOutput = unique(_this.flowSet.quoteDataOutput);
      });
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
      var dataT = unique(dataTitle);
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
      let result = pIcon.sort(createComparisonFunction("group")),
        nodeStep = [];
      if (!sessionStorage.getItem("nodeStep")) {
        for (var i = 0; i < result.length; i++) {
          for (var j = 0; j < result[i].thisIcon.length; j++) {
            nodeStep.push(result[i].thisIcon[j]);
          }
        }
        sessionStorage.setItem("nodeStep", JSON.stringify(nodeStep));
      }
      return result;
    },
    /**
     * gQuery接口查询 根据类型过滤展示steps
     * ------------------------------------------------------------------
     */
    drawGqueryList(flowId) {
      // console.log("  drawGqueryList : function (flowId) {", flowId);
      drawGquery(flowId).then(
        data => {
          //============
           data.forEach((item,index) =>{
            if(item.name == "backend" ||item.group =='define'
            ){
              data.splice(index, 1)
            }
          })
          this.getCommonStepData({
            dataflow: this.getStepListByType(data, "dataflow"),
            workflow: this.getStepListByType(data, "workflow"),
            streamflow: this.getStepListByType(data, "streamflow")
          });
          //============
          var dataTitle = [];
          var dataIcon = [];
          var _this = this;
          for (var i = 0; i < data.length; i++) {
            if (data[i].name == "analyzeStats") {
              data.splice(i, 1);
            }
            if (data[i].tags[1] == this.flowType) {
              dataIcon.push(data[i]);
              dataTitle.push(data[i].group);
            }
          }
          var dataT = unique(dataTitle);
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
          this.gQuery = pIcon.sort(createComparisonFunction("group"));
          for (var i = 0; i < _this.gQuery.length; i++) {
            for (var j = 0; j < _this.gQuery[i].thisIcon.length; j++) {
              _this.nodeStepsData.push(_this.gQuery[i].thisIcon[j]);
            }
          }
          sessionStorage.setItem(
            "nodeStep",
            JSON.stringify(_this.nodeStepsData)
          );
          this.gQueryLoading = false;
        },
        err => {
          this.gQueryLoading = true;
          this.$message({
            message: err.response.message,
            type: "error",
            duration: 1500
          });
        }
      );
    },
    /**
     * flow接口查询 历史版本接口查询
     * ------------------------------------------------------------------
     */
    listTable(flowId) {
      this.loading = true;
      // GET /someUrl
      drawFlowData(flowId)
        .then(data => {
          this.getactionLinks(JSON.parse(JSON.stringify(data.links)))
          this.getDataFlow(data); //action
          this.flowType = data.flowType;
          this.flowData = data;
          this.submitState = data.enabled;
          this.flowCanvasLoading = false;


          this.flowData.links.map(item => {
             if(this.outputId.indexOf(item.sourceOutput)=='-1'){
               return item.sourceOutput = 'output'
             }
          })
          this.stepsCombination.flowDataLinks = this.flowData.links;
          this.readDesign(data);
          this.copySteps = transformArr(deepCopy(data.steps));
          this.getSubFlowData(data); //子流程数据
          this.loading = false;
          var _this = this
          var timer = setTimeout(function(){
            _this.coustomizeStatus = true
          },300)
        })
        .catch(() => {
          this.flowCanvasLoading = true;
        });
      // let data= await drawFlowData(flowId);
      drawHistoryData(flowId).then(
        data => {
          this.flowHistory = data;
          // this.flowVersion = data[0].version;
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
    },
    /**
     * btnClick：刷新当前路由 重置
     * ------------------------------------------------------------------
     */
    drawRefresh() {
      if ($("#designMain").find(".designIconBig").length > this.nodeLength) {
        this.$confirm("当前的修改会被重置，确定要继续吗?", "提示", {
          type: "warning"
        })
          .then(() => {
            this.reload();
          })
          .catch(() => {});
      } else {
        this.reload();
      }
      //sessionStorage.setItem('status','oldData'); // 设置design 返回时显示正常数据
    },
    /**
     * btnClick：返回上一页
     * ------------------------------------------------------------------
     */
    drawReturn() {
      let urlTrue = window.location.href.indexOf("/project") != -1;
      if (urlTrue === true) {
        this.$router.push({ path: "/resourceManProject" });
      } else {
        this.$router.push({ path: "/design" });
      }
    },
    /**
     * selClick：选择历史版本
     * ------------------------------------------------------------------
     */
    disVersion(command) {
      this.flowVersion = command;
      this.flowSubData.flowHisVersion = command;
      drawHistoryVersion(
        this.flowId + "/" + this.flowVersion + "?latestName=true"
      )
        .then(
          data => {
            var _this = this
            _this.coustomizeStatus = false
            this.flowCanvasLoading = false;
            jsPlumb.jsPlumb.deleteEveryEndpoint();
            $("#designMain .designIconBig").each(function() {
              this.remove();
            });
            data.links.map(item => {
             if(this.outputId.indexOf(item.sourceOutput)=='-1'){
               return item.sourceOutput = 'output'
             }
          })
            this.readDesign(data);
            var timer = setTimeout(function(){
              _this.coustomizeStatus = true
            },300)
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
    /**
     * btnClick：设置 参数声明
     * ------------------------------------------------------------------
     */
    designSet() {
      var _this = this;
      $(document).off("keydown"); //解绑键盘复制事件
      //获取当前的steps
      _this.getDesignSteps();
      this.flowSet.flowData = this.flowData;
      let flowStep = transformArr(copyArr(_this.flowData.steps));
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
      _this.flowSet.flowData = {
        inputs: _this.flowData.inputs
          ? transformArr(deepCopy(_this.flowData.inputs))
          : [],
        parameters: _this.flowData.parameters || [],
        outputs: _this.flowData.outputs
          ? transformArr(deepCopy(_this.flowData.outputs))
          : [],
        dependencies: _this.flowData.dependencies
          ? transformArr(deepCopy(_this.flowData.dependencies))
          : []
      };
      _this.flowSet.flowSetVisible = true;
    },
    /**
     * btnClick：提交 计划执行设置
     * ------------------------------------------------------------------
     */
    designSubmit() {
      this.flowSubData.flowData = JSON.parse(JSON.stringify(this.flowData));
      $(document).off("keydown"); //解绑键盘复制事件
      if ($("#designMain").find(".designIconBig").length > this.nodeLength) {
        this.$confirm("当前的修改会被重置，确定要继续吗?", "提示", {
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
      } else {
        this.flowSubData.flowSubmitVisible = true;
        this.flowSubData.flowName = this.flowName;
        this.flowSubData.dSubName =
          this.flowName +
          " " +
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.flowSubData.dSubTime = moment(
          new Date(new Date().toLocaleDateString()).getTime()
        ).format("YYYY-MM-DD HH:mm:ss");
        this.flowSubData.flowId = this.flowId;
        this.flowSubData.flowType = this.flowType;
      }
    },
    /**
     * btnClick：调度计划
     * ------------------------------------------------------------------
     */
    designSchedule() {
      this.$router.push({
        path: "/hippo/schedule/add",
        query: { pid: this.flowId }
      });
    },
    /**
     * 确认 节点设置
     * ------------------------------------------------------------------
     */
    getStepDataflowName(name) {
      this.nodeSet.newName = name;
    },
    /**
     * 自定义 节点设置
     * ------------------------------------------------------------------
     */
    customStep() {
      this.customData.flowSetVisible = true;
      //获取当前的steps
      this.getDesignSteps();
      this.customData.flowData = this.flowData;
    },
    customContentList() {
      this.customContentStep.flowSetVisible = true;
    },
    designNodeCom(){
      this.designNode.nodeVisible = true
    },
    /**
     * design设计器
     * ------------------------------------------------------------------
     */
    design() {
      //标志元素唯一性
      var elementSign = 0;
      var _this = this;
      var _that = jsPlumb.jsPlumb;
      _that.ready(function() {
        $("#right")
          .children()
          .find(".designIcon")
          .draggable({
            helper: "clone",
            scope: "ss",
            zIndex: 10
          });
        $("#designMain").droppable({
          scope: "ss",
          drop: function(event, ui) {
            _this.uiElement = {
              left: ui.offset.left,
              top: ui.offset.top
            };

            var type = $(ui.helper)[0].dataset.type;
            if (type !== "definestep" || type == "undefined") {
              _this.uiElement = {
                left: ui.offset.left,
                top: ui.offset.top,
                type: $(ui.helper)[0].dataset.type,
                name: $(ui.helper)[0].textContent.replace(/ /g, "")
              };

              _this.drawJsplumbflow(
                jsPlumb.jsPlumb,
                _this.uiElement,
                _this,
                $("#designMain"),
                $
              );
            } else {
              _this.customContentList();
            }
          
          }
          //end
        });
        _that.fire("addEndpoint", origin);
      });
    },
    /**
     * Function：获取当前的连接线
     * ------------------------------------------------------------------
     */
    getDesignLinks() {
      var _this = this;
      var links = [];
      $.each(jsPlumb.jsPlumb.getAllConnections(), function(idx, connection) {
        links.push({
          name: connection.id,
          source: connection.source.dataset.index,
          sourceOutput: connection.endpoints[0].canvas.nextSibling.textContent,
          target: connection.target.dataset.index,
          targetInput: connection.target.dataset.type,
          input: connection.endpoints[1].canvas.nextSibling.textContent
        });
      });
      //过滤sourceOutput
      $.each(links, function(key, value) {
        if (value.sourceOutput == "yes") {
          return (value.sourceOutput = "yes");
        } else if (value.sourceOutput == "no") {
          return (value.sourceOutput = "no");
        } else if (value.sourceOutput == "ok") {
          return (value.sourceOutput = "ok");
        } else if (value.sourceOutput == "error") {
          return (value.sourceOutput = "error");
        } else {
          return (value.sourceOutput = "output");
        }
      });
      //过滤targetInput
      $.each(links, function(key, value) {
        if (nodeClass(value.targetInput) == "classD_C") {
          return (value.targetInput = value.source);
        } else if (value.input == "input1") {
          return (value.targetInput = "input1");
        } else if (value.input == "input2") {
          return (value.targetInput = "input2");
        } else if (value.input == "right") {
          return (value.targetInput = "right");
        } else if (value.input == "left") {
          return (value.targetInput = "left");
        } else if(_this.findinputCount(value.targetInput)>1){
          return (value.targetInput = value.source)
        } else {
          return (value.targetInput = "input");
        }
      });
      //过滤input
      $.each(links, function(key, value) {
        if (value.input == "left") {
          return (value.input = "left");
        } else if (value.input == "right") {
          return (value.input = "right");
        } else if (value.input == "input1") {
          return (value.input = "input1");
        } else if (value.input == "input2") {
          return (value.input = "input2");
        } else {
          return (value.input = "input");
        }
      });
      _this.thisLinksData = filterObj(links);
      sessionStorage.setItem("links", JSON.stringify(_this.thisLinksData));
    },
    findinputCount(type){
      //inputCountArr
      for(var i=0; i<this.inputCountArr.length;i++){
        if(type.indexOf(this.inputCountArr[i].name)!='-1'){
          return this.inputCountArr[i].inputCount
        }
      }
    },
    /**
     * Function：获取当前的节点
     * ------------------------------------------------------------------
     */
    getDesignSteps() {
      getSteps();
      var sessionStorageSteps = JSON.parse(sessionStorage.getItem("steps"));
      var allSteps = this.flowData.steps.concat(sessionStorageSteps);
      stepsFilterObj(allSteps);
      this.flowData.steps = allSteps;
      // 判断是否拖拽新的steps 新的就添加到copySteps中深拷贝
      var arr = [];
      if (this.copySteps.length == 0) return false;
      if (sessionStorageSteps.length == 0) return false;
      for (var i = 0; i < this.copySteps.length; i++) {
        if (
          this.copySteps[i].id ==
          sessionStorageSteps[sessionStorageSteps.length - 1].id
        ) {
          arr.push(true);
        } else {
          arr.push(false);
        }
      }
      if (arr.indexOf(true) == "-1") {
        this.copySteps.push(
          sessionStorageSteps[sessionStorageSteps.length - 1]
        );
      }
      this.getDataFlow(this.flowData);
    },
    /**
     * btnClick：执行 保存
     * ------------------------------------------------------------------
     */
    designSave() {
      // console.log("  this.stepsCombination.flowData ",  this.stepsCombination.flowData );
      // return;
      var _this = this;
      //获取steps
      this.getDesignSteps();
      //循环step 更改input
      for (var i = 0; i < this.flowData.steps.length; i++) {
        if (
          this.flowData.steps[i].type == "dataflow" ||
          this.flowData.steps[i].type == "shell"
        ) {
          this.flowData.steps[i].inputConfigurations = [];
          this.flowData.steps[i].outputConfigurations = [];
        }
      }
      //获取links
      // this.getDesignLinks();
      this.filterLinks()
      var pStatement = this.$refs.desSetReData;
      if (pStatement == undefined) {
        if (_this.flowData.inputs == undefined) {
          var saveInputs = [];
        } else {
          var saveInputs = _this.flowData.inputs;
        }
        if (_this.flowData.parameters == undefined) {
          var saveParameters = [];
        } else {
          var saveParameters = _this.flowData.parameters;
        }
        if (_this.flowData.outputs == undefined) {
          var saveOutputs = [];
        } else {
          var saveOutputs = _this.flowData.outputs;
        }
      } else {
        var saveInputs = this.flowData.inputs;
        var saveParameters = this.flowData.parameters;
        var saveOutputs = this.flowData.outputs;
        var saveDependencies = this.flowData.dependencies;
      }

      //过滤 lookupTable
      //for(var i = 0; i<this.flowData.steps.length; i++){
      //    if(this.flowData.steps[i].type === "lookupTable"){
      //       this.flowData.steps[i].type = "cache"
      //     }
      // }
      //获取All参数
      this.saveFlowData = {
        id: this.flowData.id,
        name: this.flowData.name,
        flowType: this.flowData.flowType,
        nameDuplicatable: this.flowData.nameDuplicatable,
        creator: this.flowData.creator,
        createTime: this.flowData.createTime,
        lastModifier: this.flowData.lastModifier,
        lastModifiedTime: createRandomTime(),
        inputs: saveInputs,
        outputs: saveOutputs,
        dependencies: saveDependencies,
        oid: this.flowData.oid,
        owner: this.flowData.owner,
        source: this.flowData.source,
        tenant: this.flowData.tenant,
        solrdocVersion: this.flowData.solrdocVersion,
        version: this.flowData.version,
        enabled: this.flowData.enabled,
        moduleVersion: this.flowData.moduleVersion,
        idPrefix: this.flowData.idPrefix,
        expiredPeriod: this.flowData.expiredPeriod,
        steps: this.flowData.steps,
        links: JSON.parse(sessionStorage.getItem("links")),
        // fileLinks: this.connect,
        //  steps:_.filter(_.cloneDeep(this.flowData.steps),item=>{
        //      return !item.changeStepsArr
        //  }),
        steps:_.compact(_.map(_.cloneDeep(this.flowData.steps), item => {
          if (item.changeStepsArr) {
            return {
              id: item.id,
              name: item.name,
              type: item.type,
              x: item.x,
              y: item.y,
              data: item,
              otherConfigurations: {},
              outputConfigurations: [],
              inputConfigurations: []
            };
          }

          if(item.type=="sink"){
            return {...item,
                    otherConfigurations:this.filetSinkParamData(item),
                    inputConfigurations:item.inputConfigurations.length>0?item.inputConfigurations:[{id:'input',fields:[]}]
                  };
          }
          return item;
        }))
        //  subFlow:_.filter(this.flowData.steps,item=>{
        //      return item.changeStepsArr
        //  }),
        //links:_.concat(JSON.parse(sessionStorage.getItem('links')),this.pk.subFlowLinks)
      };
      if(saveParameters&&saveParameters.length>0){
        this.saveFlowData.parameters=saveParameters
      }
      if(sessionStorage.getItem('projectId')){ //判断是不是项目目录的flow
        let projectId = {
          id: sessionStorage.getItem('projectId')
        }
          this.saveFlowData.projectEntity = projectId
      }
      // console.log("this.saveFlowData",this.saveFlowData);
      drawSaveData(_this.saveFlowData.id, _this.saveFlowData).then(
        data => {
          _this.$message({
            message: "success，保存成功！",
            type: "success"
          });
          this.getDataFlow(this.saveFlowData);
          if (this.findDefineSteps()) {
            this.modifySubFlow(this.subFlowId, () => {
              this.reload();
            });
          } else {
            this.reload();
          }
          //_this.reload();
        },
        err => {
          let errMesList = JSON.parse(err.response.data.detailMsg);
          let mes = err.response.message;
          let meslist = document.createElement("ol");
          for (var i = 0; i < errMesList.length; i++) {
            meslist.appendChild(
              document.createTextNode("<li>" + errMesList[i].message + "</li>")
            );
          }
          if (errMesList != "") {
            this.$message({
              dangerouslyUseHTMLString: true,
              message: "参数错误<br/><br/>" + meslist.innerText,
              type: "error",
              duration: 1500
            });
          } else {
            this.$message({
              message: mes,
              type: "error",
              duration: 1500
            });
          }
          // _this.reload();
          if (this.pk.subFlowSteps.length > 0) {
            this.modifySubFlow(this.subFlowId, () => {
              // console.log("回调刷新页面");
              this.reload();
            });
          } else {
            this.reload();
          }
        }
      );
    },
    addtBaseransform(val){
      let arr = []
      for(let i=0;i<val.length;i++){
        arr.push(`BASE64(${Base64.encode(val[i])})`)
      }
      return arr
    },
    modifySubFlow(subFlowId, callBack) {
      // console.log("this.pk.subFlowLinks", this.pk.subFlowLinks);
      let definestep = {
        //自定义节点后台需要的数据
        //"id": subFlowId,
        id: this.stepsCombination.flowData.id,
        groupCount: 0,
        groupFieldValue: "",
        name: this.stepsoutput.flowData.name,
        creator: this.flowData.creator,
        createTime: createRandomTime(),
        lastModifier: this.flowData.lastModifier,
        lastModifiedTime: "",
        owner: this.flowData.owner,
        version: 0,
        moduleVersion: 0,
        enabled: 0,
        description: "",
        flowType: this.stepsoutput.flowData.flowtype,
        stepInfo: {
          ...this.stepsoutput.flowData,
          changeLinksArr: this.pk.subFlowLinks
        },
        // "stepInfo": {...this.stepsoutput.flowData,changeLinksArr:[{"name":"con_39","source":"transform_7","sourceOutput":"output","target":"transform_1","targetInput":"input","input":"input"}]},
        expiredPeriod: 0
      };
      // console.log('definestep',{...this.stepsoutput.flowData,changeLinksArr:this.pk.subFlowLinks})
      savestep(definestep).then(data => {
        var _this = this;
        if (data.list[0].code == 200) {
          callBack();
        } else {
          _this.$message({
            message: data.list[0].message,
            type: "error"
          });
        }
      });
    },
    /**
     * btnClick：执行 清空所有设计
     * ------------------------------------------------------------------
     */
    designDelSave() {
      //标志元素唯一性
      var _this = this;
      var _that = jsPlumb.jsPlumb;
      _this
        .$confirm("确认要清理所有执行设计吗？", "提示", {
          type: "warning"
        })
        .then(() => {
          _that.deleteEveryEndpoint();
          $("#designMain .designIconBig").each(function() {
            this.remove();
          });
          if ($("#designMain").find(".designIconBig").length == 0) {
            _this.designStepLength = "";
          } else {
            _this.designStepLength = $("#designMain").find(
              ".designIconBig"
            ).length;
          }
          //参数声明 引用读取
          _this.flowSet.quoteDataInput = [];
          _this.flowSet.quoteDataParameter = [];
          _this.flowSet.quoteDataOutput = [];
          _this.flowSet.quoteDataDependencies = [];
          _this.flowSet.inputs = false;
          _this.flowSet.outputs = false;
          //清空 sessionStorage
          sessionStorage.setItem("steps", []);
          _this.flowData.steps = [];
          sessionStorage.setItem("links", []);
          _this.getactionLinks([])
          //获取steps
          _this.getDesignSteps();
          _this.$message({
            message: "恭喜你，删除已成功！",
            type: "success"
          });
        })
        .catch(() => {});
    },
    /**
     * 组件：参数设置声明 传参
     * ------------------------------------------------------------------
     */
    tableData(val) {
      this.statementTab = val;
      this.flowData.inputs = this.statementTab[0].inputs;
      this.flowData.parameters = this.statementTab[1].parameters;
      this.flowData.outputs = this.statementTab[2].outputs;
      this.flowData.dependencies = this.statementTab[3].dependencies;
    },
    // filterRandom(){
    //   return val + Math.random()
    // },
    customDataContentSet(val) {
      // console.log(val)
      // let data = JSON.parse(JSON.stringify(val))
      //  data.stepInfo.stepsOutput.map(item=>{
      //    return  this.filterRandom(item)
      //  })
      //  data.stepInfo.stepsInput.map(item=>{
      //    return this.filterRandom(item)
      //  })
      // data.stepInof.changeStepsArr.map(item=>{
      //   return this.filterRandom(item.id)
      // })
      // data.stepInof.changeStepsArr.map(item=>{
      //   return this.filterRandom(item.name)
      // })
      val[0].stepInfo.id = val[0].id;
      val[0].stepInfo.tenant = val[0].tenantId;
      if (!val[0].isEdit) {
        this.flowData.steps.push(val[0].stepInfo);
        this.defineload(val);
      }
      this.stepsinput.flowData = val[0].stepInfo;
      this.stepsoutput.flowData = val[0].stepInfo;
      this.stepsCombination.flowData = val[0].stepInfo;
      this.getAllLinks(
        _.concat(
          this.flowData.links,
          this.stepsCombination.flowData.changeLinksArr
        )
      );
      this.inserSubtLinks(this.stepsCombination.flowData.changeLinksArr);
      //this.flowData.steps=[...this.flowData.steps,...this.stepsCombination.flowData.changeStepsArr];
      // console.log(
      //   "this.stepsCombination.flowData.changeStepsArr",
      //   this.stepsCombination.flowData.changeStepsArr
      // );
      this.getSubFlowSteps(this.stepsCombination.flowData.changeStepsArr);
      //this.defineload(val);
      this.IsFirstConnection = true;
    },
    designNodeload(val){
      let data = [{stepInfo:[],id:val[0].id}]
      data[0].stepInfo = val[0]
      this.defineload(data)
    },
    /**
     * 多个steps
     * ------------------------------------------------------------------
     */
    customStepsLoad(val) {
      this.getDesignSteps();
      this.getDesignLinks();
      var Links = JSON.parse(sessionStorage.getItem("links"));
      var data = {
        steps: [],
        links: []
      };
      var newSteps = JSON.parse(JSON.stringify(val.changeStepsArr));
      var newLinks = JSON.parse(JSON.stringify(val.changeLinksArr));
      //把线里面的source 放在一个数组里面
      var newLinkSource = [];
      for (var h = 0; h < newLinks.length; h++) {
        newLinkSource.push(newLinks[h].source);
      }
      //把节点的id放在一个数组里面
      var newStepsId = [];
      for (var m = 0; m < newSteps.length; m++) {
        newStepsId.push(newSteps[m].id);
      }
      //在newLinkSource中查找newStepsId中的值是否有对应
      var nullStep = [];
      for (var n = 0; n < newLinkSource.length; n++) {
        for (var t = 0; t < newStepsId.length; t++) {
          if (newStepsId.indexOf(newLinkSource[t]) < 0) {
            nullStep.push(newLinkSource[t]);
          }
        }
      }
      nullStep = Array.from(new Set(nullStep));
      for (let h = 0; h < newLinks.length; h++) {
        for (let a = 0; a < nullStep.length; a++) {
          if (newLinks[h].source == nullStep[a]) {
            newLinks.splice(h, 1);
            if (h == 0) {
              h = 0;
            } else {
              h--;
            }
          }
        }
      }
      for (var i = 0; i < val.changeStepsArr.length; i++) {
        for (var k = 0; k < this.flowData.steps.length; k++) {
          if (val.changeStepsArr[i].id === this.flowData.steps[k].id) {
            var randomId = createRandomId();
            for (var j = 0; j < val.changeLinksArr.length; j++) {
              if (val.changeStepsArr[i].id === val.changeLinksArr[j].source) {
                newLinks[j].source = newSteps[i].type + "_" + randomId;
              }
              if (val.changeStepsArr[i].id === val.changeLinksArr[j].target) {
                newLinks[j].target = newSteps[i].type + "_" + randomId;
              }
              newSteps[i].name = newSteps[i].type + "_" + randomId;
              newSteps[i].id = newSteps[i].type + "_" + randomId;
            }
          }
        }
      }
      this.flowData.links = this.flowData.links.concat(newLinks);
      this.flowData.steps = this.flowData.steps.concat(newSteps);
      data.steps = newSteps;
      data.links = newLinks;
      this.customStepsPaste(data);
    },
    customStepsPaste(data) {
      let n = 0;
      var _this = this;
      var _that = jsPlumb.jsPlumb;
      var elementSign = 0;
      _that.ready(function() {
        _that.setContainer($("#designMain"));
        var mainHTML = "";
        for (var i = 0; i < data.steps.length; i++) {
          if (elementSign < data.steps[i].sign) {
            //如果已经保存过,即将标记更新
            elementSign = data.steps[i].sign;
          }
          var type = data.steps[i].type;
          if (nodeIcon(type) == "iconTrue") {
            var designType = type;
          } else {
            var designType = "default";
          }
          data.steps[i].x = data.steps[i].x + 50;
          data.steps[i].y = data.steps[i].y + 50;
          function frameDesign(css) {
            mainHTML +=
              '<div class="designIconBig ' +
              css +
              '" data-sign="' +
              data.steps[i].name +
               '" dataindex="' +
              data.steps[i].id +
              '" data-index="' +
              data.steps[i].id +
              '" data-type="' +
              data.steps[i].type +
              '" style="left:' +
              data.steps[i].x +
              "px;top:" +
              data.steps[i].y +
              'px;position:absolute;margin:0" >' +
              "<div>" +
              '<i class="icon iconfont icon-ir-designIconBg designIconBg"></i>' +
              '<i id="changeSte" class="icon iconfont icon-ir-d-' +
              designType +
              '"></i>' +
              '<h4 title="' +
              data.steps[i].name +
              '">' +
              data.steps[i].name +
              "</h4>" +
              "<h5>ID:" +
              data.steps[i].id +
              "</h5>" +
              '<em id="updateJson" class="fa fa-pencil-square-o"></em>'+
              '<em id="pitchOnDes" class="fa fa-square-o" title="选中"></em>' +
              '<em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>' +
              '<em id="removeDes" class="fa fa-trash-o" title="删除"></em>' +
              "</div>" +
              "</div>";
          }
          if (nodeClass(type) == "classD_A") {
            frameDesign("t1Style");
          } else if (nodeClass(type) == "classD_B") {
            frameDesign("t3Style");
          } else {
            frameDesign("t2Style");
          }
        }
        $("#designMain").append(mainHTML);
        $("#designMain .designIconBig").each(function() {
          var drawType = $(this).attr("data-type");
          //左侧无，右侧一个起点
          if (nodeClass(drawType) == "classD_A") {
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: 100 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
          } else if (nodeClass(drawType) == "classD_B") {
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle" },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
          } else if (
            nodeClass(drawType) == "classD_C" ||
            nodeClass(type) == "classW_C"
          ) {
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle", maxConnections: -1 },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: -1 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
          } else if (specialNodeClass(drawType) == "classD_D1") {
            _that.addEndpoint(
              this,
              {
                anchors: [1, 0.3, 0, 0],
                maxConnections: -1,
                overlays: [
                  [
                    "Label",
                    {
                      location: [1.5, -0.5],
                      label: "yes",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "yes" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [1, 0.7, 0, 0],
                maxConnections: -1,
                overlays: [
                  [
                    "Label",
                    {
                      location: [1.5, 1.3],
                      label: "no",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "no" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle" },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
          } else if (specialNodeClass(drawType) == "classD_D2") {
            _that.addEndpoint(
              this,
              {
                anchors: [1, 0.3, 0, 0],
                maxConnections: -1,
                overlays: [
                  [
                    "Label",
                    {
                      location: [1.5, -0.5],
                      label: "ok",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "ok" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [1, 0.7, 0, 0],
                maxConnections: -1,
                overlays: [
                  [
                    "Label",
                    {
                      location: [1.5, 1.3],
                      label: "error",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "error" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle" },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
          } else if (specialNodeClass(drawType) == "classD_E1") {
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: -1 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [0, 0.3, 0, 0],
                overlays: [
                  [
                    "Label",
                    {
                      location: [-1, -0.5],
                      label: "left",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "left" + "destination"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [0, 0.7, 0, 0],
                overlays: [
                  [
                    "Label",
                    {
                      location: [-1, 1.5],
                      label: "right",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "right" + "destination"
              })
            );
          } else if (specialNodeClass(drawType) == "classD_E2") {
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: -1 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [0, 0.3, 0, 0],
                overlays: [
                  [
                    "Label",
                    {
                      location: [-1, -0.5],
                      label: "input1",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input1" + "destination"
              })
            );
            _that.addEndpoint(
              this,
              {
                anchors: [0, 0.7, 0, 0],
                overlays: [
                  [
                    "Label",
                    {
                      location: [-1, 1.5],
                      label: "input2",
                      cssClass: "endpointSourceLabel"
                    }
                  ]
                ]
              },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input2" + "destination"
              })
            );
          } else {
            _that.addEndpoint(
              this,
              { anchors: "RightMiddle", maxConnections: -1 },
              deepCopy(origin, {
                uuid: $(this).attr("data-index") + "output" + "origin"
              })
            );
            _that.addEndpoint(
              this,
              { anchors: "LeftMiddle", maxConnections: -1 },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
          }
          _that.repaintEverything();
          _that.draggable($(this));
          $(this).draggable({
            containment: $("#designMain")
          });
        });
        if ($("#designMain").find(".designIconBig").length == 0) {
          _this.designStepLength = "";
        } else {
          _this.designStepLength = $("#designMain").find(
            ".designIconBig"
          ).length;
        }
        //固定连线
        if (data.links == undefined || data.links == "") {
        } else {
          for (var i = 0; i < data.links.length; i++) {
            var sourceOutputName = data.links[i].sourceOutput;
            var targtInputName = data.links[i].input;
            _that.connect({
              uuids: [
                data.links[i].source + sourceOutputName + "origin",
                data.links[i].target + targtInputName + "destination"
              ]
            });
          }
        }
      });
    },
     defineload(val) {
      let stepInfo = val[0].stepInfo;
      this.stepInfoFlow = stepInfo;

      var type = stepInfo.type;
      if (nodeIcon(type) == "iconTrue") {
        var designType = type;
      } else {
        var designType = "default";
      }

      this.drawJsplumbflow(
        jsPlumb.jsPlumb,
        {
          ...this.uiElement,
          name: stepInfo.name,
          type: stepInfo.type,
          stepInfo: JSON.stringify(stepInfo)
        },
        this,
        $("#designMain"),
        $
      );
    },
    stepsinputFlowdata(val) {
      for (var i = 0; i < this.flowData.steps.length; i++) {
        if (this.flowData.steps[i].id == val.id) {
          this.flowData.steps[i] = val;
        }
      }
    },
    stepsoutputFlowdata(val) {
      for (var i = 0; i < this.flowData.steps.length; i++) {
        if (this.flowData.steps[i].id == val.id) {
          this.flowData.steps[i] = val;
        }
      }
    },
    findPreLinks(val) {
      this.getDesignLinks()
      let links = JSON.parse(sessionStorage.getItem('links'))
      let preLinks = _.filter(links, item => {
        return item.target == val;
      });
      return this.findPreNodeList(preLinks);
    },
    findPreNodeList(val) {
      let result = [];
      this.getDesignSteps()
      let allSteps = this.flowData.steps
      _.forEach(val, (p, index) => {
        _.forEach(allSteps, (S, subIndex) => {
          if (p.source == S.id) {
            result = [...result, { input: p.input, item: S }];
          }
        });
      });
      return _.map(
        _.uniq( _.map(result, item => {
            return JSON.stringify(item);
          })
        ),
        val => {
          return JSON.parse(val);
        }
      );
    },
    getFields(val) {
      return _.map(val.outputConfigurations[0].fields, item => {
        if (item.alias) {
          return {
            alias: "",
            column: item.alias //alias
          };
        } else {
          return item;
        }
      });
    },
    getInputFields(val){
      return _.map(val.inputConfigurations[0].fields, item =>{
        if(item.alias){
          return {
            alias: "",
            column: item.alias
          }
        } else {
          return item
        }
      })
    },
    defineNode(val){
      var _this = this
      this.getDesignLinks()
      this.getDesignSteps()
      // this.nodeSet= {
      //     newName: "",
      //     inputData: [],
      //     outputData: [],
      //     nodeSetTab: [],
      //     thisNodeData: [],
      //     nodeLine: {
      //       inputLine: [],
      //       outputLine: []
      //     },
      //     datasetType: "",
      //     flowData: [],
      //     nodeSetVisible: false,
      //     dbStatus: "0"
      // };
      if(customizeSteps(val.designType)=="customize"){
          defineConfDetail(val.designType).then(data => {
            _this.getStepsparameter(data)
              _this.setSetting(data.settings)
              _this.nodeSet.outputData = data.outputConfigurations
              _this.nodeSet.nodeSetTab = [
                ..._.map(_this.preStepList, val => {
                  return {
                    title: "输入（" + val.item.name + "）",
                    name: val.item.name,
                    icon: "fa fa-sign-in"
                  };
                }),
                {
                  title: "参数",
                  name: "parameter",
                  icon: "fa fa-sign-out"
                },
                ..._.map(_this.nodeSet.outputData, val => {
                  return {
                    title: "输出("+val.id+")",
                    name: val.id,
                    icon: "fa fa-sign-in"
                  };
                })
              ];
            _this.nodeSet.inputData = _.map(_this.preStepList, (val,index) => {
              return {
                id: val.item.name,
                fields: _this.getFields(val.item)
              };
            });

            if(_this.nodeSet.inputData.length==1){
              _this.nodeSet.nodeSetTab[0].name = 'input'
              _this.nodeSet.inputData[0].id='input'
            }
            //nodedesign
            $("#nodeSetDialog .el-dialog__title").text(_this.nodedesign.designType + " 设置");
              _this.nodeSet.oldName = _this.nodedesign.designText;
              _this.nodeSet.newName = _this.nodedesign.designText;
              var flowSteps = _this.flowData.steps;
              _this.nodeSet.thisNodeData = (flowSteps.filter(function(flow) {
                return flow.name === _this.nodedesign.designText;
              }))[0];

            var b = Object.keys(_this.nodeSet.thisNodeData.otherConfigurations);
            let outputConfigurations = _this.nodeSet.thisNodeData.outputConfigurations
            if(b.length == '0'){
              _this.nodeSet.thisNodeData = {
                id: _this.nodedesign.designId,
                name: _this.nodedesign.designText,
                type: _this.nodedesign.designType,
                inputConfigurations: [],
                outputConfigurations: [{
                              "id": "output",
                              "fields": []
                          }],
                otherConfigurations: {...data.otherConfigurations,
                                      stepClassName:data.stepClassName,
                                      customJarFileName:data.customJarFileName
                                    },
                x: _this.nodedesign.left,
                y: _this.nodedesign.top
              };
              let len = _this.preStepList.length
              if(_this.nodeSet.inputData.length!=_this.nodeSet.thisNodeData.inputConfigurations.length){
                let length = _this.nodeSet.inputData.length-_this.nodeSet.thisNodeData.inputConfigurations.length
                  for(var i=0;i<length;i++){
                  _this.nodeSet.thisNodeData.inputConfigurations.push({"id": "input","fields": []})
                }
              }

              if(outputConfigurations.length!=0&&outputConfigurations[0].fields.length!=0){
                _this.nodeSet.thisNodeData.outputConfigurations = outputConfigurations
              }else {
                _this.nodeSet.thisNodeData.outputConfigurations = data.outputConfigurations
              }
            }
              // _this.nodeSet.thisNodeData.inputConfigurations = data.inputConfigurations
              // if(data.inputConfigurations.length==_this.nodeSet.inputData.length){
              //     data.inputConfigurations.map((item,index) => {
              //         _this.nodeSet.inputData[index].id = item.id
              //         _this.nodeSet.nodeSetTab[index].name = item.id
              //       })

              // }else if(data.inputConfigurations.length > _this.nodeSet.inputData.length){
              //   let length = data.inputConfigurations.length - _this.nodeSet.inputData.length
              //   for(var i=0;i<length;i++){
              //       _this.nodeSet.thisNodeData.inputConfigurations.pop()
              //     }
              //   _this.nodeSet.inputData.map((item,index) => {
              //       _this.nodeSet.inputData[index].id = data.inputConfigurations[index].id
              //       _this.nodeSet.nodeSetTab[index].name = data.inputConfigurations[index].id
              //     })
              // }else if(data.inputConfigurations.length < _this.nodeSet.inputData.length) {
              //   _this.nodeSet.thisNodeData.inputConfigurations = data.inputConfigurations
              //   // let length = _this.nodeSet.inputData.length - data.inputConfigurations.length
              //   //     for(var i=0;i<length;i++){
              //   //     _this.nodeSet.thisNodeData.inputConfigurations.push({"id": "input","fields": []})
              //   //   }
              // }

            _this.nodeSet.nodeSetVisible = true
            _this.nodeSet.dbStatus = '1'
            _this.nodeSet.btnStatus = true
            _this.nodeSet.flowData = this.flowData
            _this.nodeSet.outputData = data.outputConfigurations
          })
      }
    },
    getDefineList(){
      defineListAll().then( (data) => {
        this.inputCountArr =JSON.parse(JSON.stringify(data))
          for(var i=0;i<data.length;i++){
            data[i].otherConfigurations =  this.filterSetting(data[i].settings);
            data[i].tags= [data[i].group,'dataflow']
            data[i].inputConfigurations =  [{
                "id": "input",
                "fields": []
            }];
            data[i].outputConfigurations =  [{
                "id": "output",
                "fields": []
            }];
            data[i].icon =  "default.png"
            delete data[i].settings
          }
          if(data.length!==0){
            let defineGroup = [{group:data[0].group,thisIcon:data}]
            defineGroup.map((item)=>{
              return item.group = "User Defined"
            })
            this.defineArr = defineGroup.concat(this.common.commonStepData.dataflow)
          }else{
            this.defineArr = this.common.commonStepData.dataflow
          }

      }).catch((err)=>{
        this.defineArr = this.common.commonStepData.dataflow
      })
    },
    filterSetting(val){
      var settingJson = {}
      for(var i=0;i<val.length;i++){
        settingJson[val[i].fileName] = val[i].descrip
      }
      return settingJson
    },
    fineCurrentsteps(sourceId,targetId){
      this.sourceData = this.findsteps(sourceId)
      this.targetData = this.findsteps(targetId)
      this.customizeOptions = this.sourceData[0].outputConfigurations
      this.customize.dialogVisible = true
    },
    findsteps(ID){
      this.getDesignSteps();
      return this.flowData.steps.filter(item => {
        return item.id == ID
      });
    },
    customizeSure(){
      let targetSteps = {
        name:'id',
        source:this.sourceData[0].id,
        sourceOutput:this.customizeData,
        target:this.targetData[0].id,
        targetInput: 'input',
        input:'input'
      }
      if(this.connect.length>0){
        this.connect.forEach((index,item) => {
          if(item.sourceOutput!=targetSteps.sourceOutput&&item.source!=targetSteps.source){
            this.connect.push(targetSteps)
          }
          if(item.sourceOutput!=targetSteps.sourceOutput&&item.source==targetSteps.source&&item.target==targetSteps.target){
            item.sourceOutput =targetSteps.sourceOutput
          }
        })
      }else {
        this.connect.push(targetSteps)
      }

      this.filterLinks()
      this.customize.dialogVisible = false
    },
    filterLinks(){  //过滤自定义steps output值
      let flowlinks = this.dataflow.links
      let filterlinks = flowlinks.filter(item =>{
        if(this.outputId.indexOf(item.sourceOutput)=='-1'){
          return item
        }
      })
      this.getactionLinks(filterlinks)
      let fileLinks = this.connect
      let connectLinks = []
      this.getDesignLinks()
      let links = JSON.parse(sessionStorage.getItem('links'))
      // for(var h=0;h<filterlinks.length;h++){
      //   for(var m=0;m<links.length;m++){
      //     if(filterlinks[h].target == links[m].target&&filterlinks[h].targetInput == links[m].targetInput&&filterlinks[h].source == links[m].source){
      //        links[m].sourceOutput = filterlinks[h].sourceOutput
      //     }
      //   }
      // }
      filterlinks.forEach(item => {
        links.forEach(item1 =>{
          if(item.target == item1.target&&item.targetInput ==item1.targetInput&&item.source == item1.source){
             item1.sourceOutput = item.sourceOutput
          }
        })
      })
      // for(var i=0;i<links.length;i++){
      //   for(var j=0;j<fileLinks.length;j++){
      //     if(links[i].target == fileLinks[j].target){
      //         links[i].source = fileLinks[j].source
      //         links[i].sourceOutput = fileLinks[j].sourceOutput
      //     }
      //   }
      // }
      links.forEach(item => {
        fileLinks.forEach( item1 =>{
          if(item.target == item1.target){
             item.source = item1.source
             item.sourceOutput = item1.sourceOutput
          }
        })
      })
      // console.log('links过滤线',links)
      sessionStorage.setItem('links', JSON.stringify(links))
    },
    deleteActionlinks(id){
      let links = this.dataflow.links
      let connetlinks = this.connect

      if(links.length>0){
        links = links.filter(item =>{
          if(item.target!=id){
            return item
          }
        })
        links = links.filter(item =>{
          if(item.source!=id){
            return item
          }
        })
      }
      this.getactionLinks(links)
    },
    dataflowNode(val){
      let _this = this
      let links = JSON.parse(sessionStorage.getItem('links'))
      let stepMessage = _this.nodeSet.flowData.steps.filter(item=>{ //过滤当前点击steps信息
        return item.id == _this.nodedesign.designId
      })
       _this.nodeSet.thisNodeData.outputConfigurations = stepMessage[0].outputConfigurations
      let targetLinks = links.filter(item=>{  //过滤点击节点连线
        return item.target == _this.nodedesign.designId
      })
      if(targetLinks.length==0&&val!=='source'){
        this.$message({
          message: "请建立正确的连接！",
          type: "error"
        })
        return false
      }
      if (stepMessage[0].otherConfigurations.datasetId&& val == 'source') {
        var tenantIdTmp = _this.flowData.tenantId;
        getDataset(
          stepMessage[0].otherConfigurations.datasetId,
          tenantIdTmp
        ).then(
          data => {
            _this.nodeSet.datasetType = data.storage;
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
      if(val=='sink'){
        this.nodeParame =[
          {
            title: "输入",
            name: 'input',
            icon: "fa fa-sign-in"
          },
          {
            title: "参数",
            name: "parameter",
            icon: "fa fa-sign-out"
          }
        ]
        _this.nodeSet.inputData = _.map(_this.preStepList, (val,index) => {
          return {
            id: 'input',
            fields: _this.getFields(val.item)
          }
        })
      }else if(val=='source'||val=="sqlsource"){
        this.nodeParame = [{
                title: "参数",
                name: "parameter",
                icon: "fa fa-sign-out"
              },
              {
                title: "输出",
                name: 'output',
                icon: "fa fa-sign-in"
              }
          ]
      }else if(val=='join'||val=='minus'||val=='productjoin'){
        console.log(_this.preStepList)
        this.nodeParame = [
             ..._.map(_this.preStepList, (val,index) => {
                  return {
                    title: `${val.input}（${val.item.name}）`,
                    name: val.input,
                    icon: "fa fa-sign-in"
                  };
                }),
             {
                title: "参数",
                name: "parameter",
                icon: "fa fa-sign-out"
              },
              {
                title: "输出",
                name: 'output',
                icon: "fa fa-sign-in"
              }
          ]
          _this.nodeSet.inputData = _.map(_this.preStepList, (val,index) => {
            return {
              id: val.input,
              fields: _this.getFields(val.item)
            }
          })
      }else if(val=='lookup'||val=='aggregate'||val=='top'||val =='cache'||val=='sql'||val=='sample'||val=='transform'||val=='filter'|| val=='supplement'||datamining(val)==='datamining'){
        this.nodeParame = [
            ..._.map(_this.preStepList, (val,index) => {
                return {
                  title: `输入（${val.item.name}）`,
                  name: 'input',
                  icon: "fa fa-sign-in"
                };
              }),
              {
                title: "参数",
                name: "parameter",
                icon: "fa fa-sign-out"
              },
              {
                title: "输出",
                name: 'output',
                icon: "fa fa-sign-in"
              }
        ]
         _this.nodeSet.inputData = _.map(_this.preStepList, (val,index) => {
          return {
            id: 'input',
            fields: _this.getFields(val.item)
          }
        })
      }else if(val=='starjoin'){
        // _this.nodeSet.nodeLine.inputLine = [];lineNameSource
        // _this.nodeSet.nodeLine.outputLine = [];lineNameTarget
        _this.nodeSet.nodeLine.inputLine = []
        this.nodeParame = [
             ..._.map(_this.preStepList, (val,index) => {
               _this.nodeSet.nodeLine.inputLine.push({lineNameSource:val.item.name})
                  return {
                    title: `输入（${val.item.name}）`,
                    name: val.item.name,
                    icon: "fa fa-sign-in"
                  };
                }),
             {
                title: "参数",
                name: "parameter",
                icon: "fa fa-sign-out"
              },
              {
                title: "输出",
                name: 'output',
                icon: "fa fa-sign-in"
              }
          ]
          _this.nodeSet.inputData = _.map(_this.preStepList, (val,index) => {
            return {
              id: val.item.name,
              fields: _this.getFields(val.item)
            }
          })
      }else if(val=='intersect'||val=='union'){
        this.nodeParame = [
             ..._.map(_this.preStepList, (val,index) => {
               _this.nodeSet.nodeLine.inputLine.push({lineNameSource:val.item.name})
                  return {
                    title: `输入（${val.item.name}）`,
                    name: val.item.name,
                    icon: "fa fa-sign-in"
                  };
                }),
              {
                title: "输出",
                name: 'output',
                icon: "fa fa-sign-in"
              }
          ]
        _this.nodeSet.inputData = _.map(_this.preStepList, (val,index) => {
            return {
              id: val.item.name,
              fields: _this.getFields(val.item)
            }
          })
      }else if(val=='split'||val=='decision'){
        this.nodeParame = [
          ..._.map(_this.preStepList,(val,index) =>{
            _this.nodeSet.nodeLine.inputLine.push({lineNameSource:val.item.name})
            return {
              title:`输入（${val.item.name}）`,
              name: 'input',
              icon: 'fa fa-sign-in'
            }
          }),
          {
            title: "参数",
            name: "parameter",
            icon: "fa fa-sign-out"
          },
          {
            title: "yes",
            name: 'yes',
            icon: "fa fa-sign-out"
          },
          {
            title:'no',
            name:'no',
            icon: 'fa fa-sign-out'
          },
          // ..._.map(_this.nodeSet.outputData, val => {
          //         return {
          //           title: "输出("+val.id+")",
          //           name: val.id,
          //           icon: "fa fa-sign-in"
          //         };
          //       })
        ]
        _this.nodeSet.inputData = _.map(_this.preStepList, (val,index) => {
            return {
              id: 'input',
              fields: _this.getFields(val.item)
            }
          })
        _this.nodeSet.outputData =[{
          id:'yes',
          fields:[]
        },
        {
          id:'no',
          fields:[]
        }]
      }else if(val=='validate'){
          this.nodeParame = [
          ..._.map(_this.preStepList,(val,index) =>{
            _this.nodeSet.nodeLine.inputLine.push({lineNameSource:val.item.name})
            return {
              title:`输入（${val.item.name}）`,
              name: 'input',
              icon: 'fa fa-sign-in'
            }
          }),
          {
            title: "参数",
            name: "parameter",
            icon: "fa fa-sign-out"
          },
          {
            title: "ok",
            name: 'ok',
            icon: "fa fa-sign-out"
          },
          {
            title:'error',
            name:'error',
            icon: 'fa fa-sign-out'
          }
        ]
        _this.nodeSet.inputData = _.map(_this.preStepList, (val,index) => {
            return {
              id: 'input',
              fields: _this.getFields(val.item)
            }
          })
      }
      _this.nodeSet.nodeSetTab = [
        ..._this.nodeParame
      ]
      _this.nodeSet.oldName = _this.nodedesign.designText;
      _this.nodeSet.newName = _this.nodedesign.designText;
      let flowSteps = _this.flowData.steps;

      let pData =  JSON.parse(sessionStorage.getItem("nodeStep"));
      _this.nodeSet.thisNodeData = (flowSteps.filter(function(flow) {
          return flow.name === _this.nodedesign.designText;
        }))[0];
        let newStepsParams = (pData.filter(item =>{
          return _this.nodeSet.thisNodeData.type == item.type
        }))[0]
      if(Object.keys(_this.nodeSet.thisNodeData.otherConfigurations).length==0&&val!=='intersect'&&val!=='split'&&val!=='decision'&&val!=='validate'){
          _this.nodeSet.thisNodeData.inputConfigurations = newStepsParams.inputConfigurations
        _this.nodeSet.thisNodeData.otherConfigurations = newStepsParams.otherConfigurations
        _this.nodeSet.thisNodeData.outputConfigurations = [{id:'output',fields:[]}]
      }
      if((Object.keys(_this.nodeSet.thisNodeData.otherConfigurations).length==0 && val=='split')){
          _this.nodeSet.thisNodeData.inputConfigurations = newStepsParams.inputConfigurations
        _this.nodeSet.thisNodeData.otherConfigurations = newStepsParams.otherConfigurations
          _this.nodeSet.thisNodeData.outputConfigurations = [{id:'yes',fields:[]},{id:'no',fields:[]}]
      }
      if(Object.keys(_this.nodeSet.thisNodeData.otherConfigurations).length==0 && val=='validate'){
          _this.nodeSet.thisNodeData.inputConfigurations = newStepsParams.inputConfigurations
        _this.nodeSet.thisNodeData.otherConfigurations = newStepsParams.otherConfigurations
          _this.nodeSet.thisNodeData.outputConfigurations = [{id:'ok',fields:[]},{id:'error',fields:[]}]
      }
      if(val=='intersect'&&_this.nodeSet.thisNodeData.outputConfigurations.length==0){
        _this.nodeSet.thisNodeData.outputConfigurations = [{id:'output',fields:[]}]
        //针对union 删除source节点之后节点 inputConfiguragion id没有更新
        _this.nodeSet.thisNodeData.inputConfigurations =_this.nodeSet.inputData;
      }
      if((Object.keys(_this.nodeSet.thisNodeData.otherConfigurations).length==0) &&val=='decision'){
          _this.nodeSet.thisNodeData.inputConfigurations = newStepsParams.inputConfigurations
          _this.nodeSet.thisNodeData.otherConfigurations = newStepsParams.otherConfigurations
          _this.nodeSet.thisNodeData.outputConfigurations = [{id:'yes',fields:[]},{id:'no',fields:[]}]
      }
      $("#nodeSetDialog .el-dialog__title").text(_this.nodedesign.designType + " 设置");
      _this.nodeSet.nodeSetVisible = true
      _this.nodeSet.dbStatus = '1'
      _this.nodeSet.btnStatus = true
      _this.nodeSet.flowData = this.flowData
    },
    handleClose:function(){
      this.updateJsondialogVisible = false;
    },
    nodeJsonTrue:function () {
        var _this = this;
        $(document).off('keydown')
        // var updateJson = JSON.parse(_this.updateJsonData.replace(/\s+/g," "))
        var updateJson = JSON.parse((_this.updateJsonData.toString()));
        for(let i = 0; i < _this.flowData.steps.length; i++){
            if(_this.flowData.steps[i].id == updateJson.id){
                if(_this.flowData.steps[i].id != updateJson.id || _this.flowData.steps[i].name != updateJson.name || _this.flowData.steps[i].type != updateJson.type || _this.flowData.steps[i].x != updateJson.x || _this.flowData.steps[i].y != updateJson.y){
                    _this.$message({
                        message: '请确保 ID NAME TYPE X Y 值与原节点数据一致！',
                        type: 'error'
                    });
                }else{
                    _this.flowData.steps[i] = updateJson;
                    _this.updateJsondialogVisible = false;
                }
            }
        }
    },
  },
  computed: {
    ...mapState(["pk", "common",'dataflow'])
  },
  mounted() {
    this.inserSubtLinks([]);
    this.getSubFlowSteps([]);
    sessionStorage.setItem("type", this.$route.query.type);
    // 资源目录跳转入传值
    // this.flowId = this.$route.params.id ? this.$route.params.id : this.id
    if (this.id) {
      this.flowId = this.id;
    }
    this.listTable(this.flowId);
    this.drawGqueryList(this.flowId);
    this.getDefineList()
    var _this = this;
    var _that = jsPlumb.jsPlumb;
    _that.getInstance()
    /**
     * jsPlumb：点击线段删除
     * ------------------------------------------------------------------
     */
    _that.bind("click", function(conn, originalEvent) {
      _this
        .$confirm("真的要删除当前点击的连接线?", "提示", {
          type: "warning"
        })
        .then(() => {
          _this.IsFirstConnection = true;
          _that.deleteConnection(conn);
          // console.log(originalEvent);
          _this.$message({
            message: "恭喜你，删除已成功！",
            type: "success"
          });
        })
        .catch(() => {});
    });
    // 连接线删除时触发
    _that.bind("connectionDetached", connection => {
      let source = connection.source.dataset;
      let target = connection.target.dataset;
      let sublinks = _.cloneDeep(this.pk.subFlowLinks);
      let result = [];
      if (source.type == "define") {
        result = _.filter(sublinks, item => {
          return item.target != target.sign;
        });
        this.inserSubtLinks(result);
      }
      if (target.type == "define") {
        result = _.filter(sublinks, item => {
          return item.source != source.sign;
        });
        this.inserSubtLinks(result);
      }
    });
    /**
     * jsPlumb：连接对象是自己的管控
     * ------------------------------------------------------------------
     */
    _that.bind("connection", function(connInfo, originalEvent) {
      _this.getDesignSteps();

      //  console.log("connInfo.connection",connInfo.connection);
      // console.log("connInfo.connection.id",connInfo.connection.id);
      // console.log('connInfo.source',connInfo.source)

      if(customizeSteps(connInfo.target.dataset.type) == 'customize'&&_this.coustomizeStatus==true){
        _this.getDesignLinks();
        let links = JSON.parse((sessionStorage.getItem('links')))
        let linksLength = links.filter(item =>{
          return item.target == connInfo.target.dataset.index
        }).length
        let inputLength = _this.findinputCount(connInfo.target.dataset.type)
        if(linksLength>inputLength){
          _this.$message({
            message: `最多连接${inputLength}条线`,
            type: "error"
          });
          _that.deleteConnection(connInfo.connection);
        }
      }
      if(customizeSteps(connInfo.source.dataset.type)=='customize'){
        let sourceId = connInfo.source.dataset.index
        let targetId = connInfo.target.dataset.index
        let sourcestep = _this.findsteps(sourceId)
        if(sourcestep[0].outputConfigurations.length==0&&sourcestep[0].inputConfigurations.length==0){
            sourcestep = _this.inputCountArr.filter(item =>{
              return item.type == sourcestep[0].type
            })
        }

        if(sourcestep[0].outputConfigurations.length>1&&_this.coustomizeStatus==true){
          _this.fineCurrentsteps(sourceId,targetId)
        }
      }
      if (connInfo.target.dataset.type == "define" && _this.IsFirstConnection) {
        _this.stepsinput.flowSetVisible = true; ///节点输入选择
        _this.insertLinks({
          id: connInfo.source.dataset.index,
          type: connInfo.source.dataset.type
        });
        _this.setlinksId(connInfo.connection.id);
        _this.currentConnection = connInfo;
      }
      if (connInfo.connection.sourceId == connInfo.connection.targetId) {
        _this.$message({
          message: "不能连接自己！",
          type: "error"
        });
        _that.deleteConnection(connInfo.connection);
      } else {
      }
    });
    /**
     * btnClick：删除当前的节点
     * ------------------------------------------------------------------
     */
    $("#designMain").on("click", ".designIconBig #removeDes", function(e) {
      var _jqThis = $(this)
        .parent()
        .parent();
      //return;
      let thisId = _jqThis.attr("data-index");
      _this
        .$confirm("真的要删除当前design?", "提示", {
          type: "warning"
        })
        .then(() => {
          _that.removeAllEndpoints(_jqThis.attr("id"));
          _jqThis.remove();
          _this.deleteActionlinks(thisId) //删除节点对应的线
          //获取steps
          _this.getDesignSteps();
          if ($("#designMain").find(".designIconBig").length == 0) {
            _this.designStepLength = "";
          } else {
            _this.designStepLength = $("#designMain").find(
              ".designIconBig"
            ).length;
          }
          for (var i = 0; i < _this.flowData.steps.length; i++) {
            if (_this.flowData.steps[i].id == thisId) {
              _this.flowData.steps.splice(i, 1);
            }
          }
           _this.getDataFlow(_this.flowData);
          //参数声明 引用读取
          _this.flowSet.quoteDataInput = [];
          _this.flowSet.quoteDataOutput = [];
          _this.flowSet.quoteDataParameters = [];
          _this.flowSet.inputs = false;
          _this.flowSet.outputs = false;
          $("#designMain")
            .find(".designIconBig")
            .each(function() {
              var dataType = $(this).attr("data-type");
              if (nodeQuote(dataType) === "quoteA") {
                _this.flowSet.quoteDataInput.push(
                  $(this)
                    .find("h4")
                    .text()
                );
                _this.flowSet.inputs = true;
              }
              if (nodeQuote(dataType) === "quoteB") {
                _this.flowSet.quoteDataOutput.push(
                  $(this)
                    .find("h4")
                    .text()
                );
                _this.flowSet.outputs = true;
              }
              _this.flowSet.quoteDataParameter.push(
                $(this)
                  .find("h4")
                  .text()
              );
            });
          _this.flowSet.quoteDataInput = unique(_this.flowSet.quoteDataInput);
          _this.flowSet.quoteDataParameter = unique(
            _this.flowSet.quoteDataParameter
          );
          _this.flowSet.quoteDataOutput = unique(_this.flowSet.quoteDataOutput);
          _this.$message({
            message: "恭喜你，删除已成功！",
            type: "success"
          });
        })
        .catch(() => {});
      e.stopPropagation(); //阻止事件冒泡
    });
    /**
     * btnClick：编辑当前的节点
     * ------------------------------------------------------------------
     */
    $("#designMain").on("click",".designIconBig #updateJson",function(){
        _this.updateJsondialogVisible = true;
        $(document).off('keydown');
        var stepsId = $(this).parent().parent().attr("data-index")
        _this.getDesignSteps();
        for(let i = 0; i < _this.flowData.steps.length; i++){
            if(_this.flowData.steps[i].id == stepsId){
                _this.thisNode.id = _this.flowData.steps[i].id;
                _this.thisNode.name = _this.flowData.steps[i].name;
                _this.thisNode.type = _this.flowData.steps[i].type;
                _this.thisNode.x = _this.flowData.steps[i].x;
                _this.thisNode.y = _this.flowData.steps[i].y;
                // _this.updateJsonData = formatJson(JSON.stringify(_this.flowData.steps[i]))
                _this.updateJsonData = JSON.stringify(_this.flowData.steps[i])
            }
        }
    })
    /**
     * btnClick：复制当前的节点
     * ------------------------------------------------------------------
     */
    $("#designMain").on("click", ".designIconBig #copeDes", function(e) {
      var thisStepsName = $(this)
        .parent()
        .parent()
        .attr("data-sign");
      $(this)
        .addClass("pitchOn")
        .siblings()
        .removeClass("pitchOn");
      $(document)
        .unbind("keydown")
        .bind("keydown", function(e) {
          if (e.ctrlKey && e.keyCode == 86) {
            //触发粘贴函数
            stepsPaste();
            // 返回false, 防止重复触发copy事件
            return false;
          }
        });
      //Funciton：复制
      function stepsCope() {
        getSteps();
        var Steps = JSON.parse(sessionStorage.getItem("steps"));
        var stepbOk = false;
        for (var i = 0; i < _this.flowData.steps.length; i++) {
          if (thisStepsName === _this.flowData.steps[i].name) {
            _this.thisObj = JSON.parse(JSON.stringify(_this.flowData.steps[i]));
            stepbOk = true;
          }
        }
        if (stepbOk == false) {
          for (var j = 0; j < Steps.length; j++) {
            if (thisStepsName === Steps[j].name) {
              //_this.thisObj = deepCopy(Steps[j])
              _this.thisObj = JSON.parse(JSON.stringify(Steps[j]));
            }
          }
        }
        _this.$message({
          message: "复制成功，请操作 Ctrl+v 进行粘贴！",
          type: "success"
        });
      }
      //触发复制函数
      stepsCope();
      //Funciton：粘贴
      function stepsPaste() {
        var randomId = createRandomId();
        _this.thisObj.id = _this.thisObj.type + "_" + randomId;
        _this.thisObj.name = _this.thisObj.type + "_" + randomId;
        _this.thisObj.x = _this.thisObj.x + 50;
        _this.thisObj.y = _this.thisObj.y + 50;
        _this.flowData.steps.push(JSON.parse(JSON.stringify(_this.thisObj)));
        var type = _this.thisObj.type;
        let designType = ''
        if (nodeIcon(type) == "iconTrue") {
          var iconType = type;
          designType = type
        }else if(type=='cache'){
          var iconType = "default";
          designType = type
        } else {
          var iconType = "default";
          designType = 'default'
        }
        // var ele = $(
        //   `<div class="designIconBig t2Style" data-sign="${_this.thisObj.name}" dataindex="${_this.thisObj.id}" data-index="${_this.thisObj.id}" data-type="${type}">
        //       <div>
        //          <i class="icon iconfont icon-ir-designIconBg designIconBg"></i>
        //          <i id="changeSte" class="icon iconfont icon-ir-d-${iconType}"></i>
        //          <h4 title="${_this.thisObj.name}">${_this.thisObj.name}</h4>
        //          <h5>ID:${_this.thisObj.id}</h5>
        //          <em id="pitchOnDes" class="fa fa-square-o" style="(${designType}=='sink'||${designType}=='cache'?'display:none':'')" title="选中"></em>
        //          <em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>
        //          <em id="removeDes" class="fa fa-trash-o" title="删除"></em>
        //       </div>
        //   </div>`
        // )
        // style=' +
        //             ( type == "sink" ? "display:none" : "") +
        var ele = $(
          '<div class="designIconBig t2Style" data-sign="' +
            _this.thisObj.name +
            '" dataindex="' +
            _this.thisObj.id +
            '" data-index="' +
            _this.thisObj.id +
            '"  data-type="' +
            type +
            '">' +
            '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-' +
            iconType +
            '"></i><h4 title="' +
            _this.thisObj.name +
            '">' +
            _this.thisObj.name +
            "</h4>"+
            "<h5>ID:"+
            _this.thisObj.id +
            "</h5>" +
            '<em id="updateJson" class="fa fa-pencil-square-o"></em>'+
              '<em id="pitchOnDes" class="fa fa-square-o" title="选中" style=' +
              (designType == "sink"||designType =="cache"
                ? "display:none"
                : "") +
              "></em>" +
              '<em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>' +
              '<em id="removeDes" class="fa fa-trash-o" title="删除"></em>' +
              "</div>" +
              "</div>"
        );
        if (nodeClass(type) == "classD_A") {
          // var ele = $(
          //   `<div class="designIconBig t1Style" data-sign="${_this.thisObj.name}" dataindex="${_this.thisObj.id}" data-index="${_this.thisObj.id}" data-type="${type}">
          //       <div>
          //         <i class="icon iconfont icon-ir-designIconBg designIconBg"></i>
          //         <i id="changeSte" class="icon iconfont icon-ir-d-${iconType}"></i>
          //         <h4 title="${_this.thisObj.name}">${_this.thisObj.name}</h4>
          //         <h5>ID:${_this.thisObj.id}</h5>
          //         <em id="pitchOnDes" class="fa fa-square-o" style="(${designType}=='sink'||${designType}=='cache'?'display:none':'')" title="选中"></em>
          //         <em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>
          //         <em id="removeDes" class="fa fa-trash-o" title="删除"></em>
          //       </div>
          //   </div>`
          // )
          var ele = $(
            '<div class="designIconBig t2Style" data-sign="' +
              _this.thisObj.name +
              '" dataindex="' +
            _this.thisObj.id +
              '" data-index="' +
              _this.thisObj.id +
              '"  data-type="' +
              type +
              '">' +
              '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-' +
              iconType +
              '"></i><h4 title="' +
              _this.thisObj.name +
              '">' +
              _this.thisObj.name +
              "</h4>"+
              "<h5>ID:"+
              _this.thisObj.id +
              "</h5>" +
              '<em id="updateJson" class="fa fa-pencil-square-o"></em>'+
              '<em id="pitchOnDes" class="fa fa-square-o" title="选中" style=' +
              (designType == "sink"||designType =="cache"? "display:none": "") +
              "></em>" +
              '<em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>' +
              '<em id="removeDes" class="fa fa-trash-o" title="删除"></em>' +
              "</div>" +
              "</div>"
          );
          _that.addEndpoint(
            ele,
            { anchors: "RightMiddle", maxConnections: -1 },
            origin
          ); //起点
        } else if (nodeClass(type) == "classD_B") {
          // var ele=$(
          //   `<div class="designIconBig t3Style" data-sign="${_this.thisObj.name}" data-index="${_this.thisObj.id}" dataindex="${_this.thisObj.id}" data-type="${type}">
          //     <div>
          //           <i class="icon iconfont icon-ir-designIconBg designIconBg"></i>
          //           <i id="changeSte" class="icon iconfont icon-ir-d-${iconType}"></i>
          //           <h4 title="${_this.thisObj.name}">${_this.thisObj.name}</h4>
          //           <h5>ID:${ _this.thisObj.id}</h5>
          //           <em id="pitchOnDes" class="fa fa-square-o" style="(${designType}=='sink'||${designType}=='cache'?'display:none':'')" title="选中"></em>
          //           <em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>
          //           <em id="removeDes" class="fa fa-trash-o" title="删除"></em>
          //     </div>
          //   </div>`
          // )
          var ele = $(
              '<div class="designIconBig t2Style" data-sign="' +
                _this.thisObj.name +
                '" dataindex="' +
                _this.thisObj.id +
                '" data-index="' +
                _this.thisObj.id +
                '"  data-type="' +
                type +
                '">' +
                '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-' +
                iconType +
                '"></i><h4 title="' +
                _this.thisObj.name +
                '">' +
                _this.thisObj.name +
                "</h4>"+
                "<h5>ID:"+
                _this.thisObj.id +
                "</h5>" +
                '<em id="updateJson" class="fa fa-pencil-square-o"></em>'+
                '<em id="pitchOnDes" class="fa fa-square-o" title="选中" style=' +
                (designType == "sink"||designType =="cache"? "display:none": "") +
                "></em>" +
                '<em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>' +
                '<em id="removeDes" class="fa fa-trash-o" title="删除"></em>' +
                "</div>" +
                "</div>"
            );
          _that.addEndpoint(ele, { anchors: "LeftMiddle" }, destination); //终点
        } else if (
          nodeClass(type) == "classD_C" ||
          nodeClass(type) == "classW_C"
        ) {
          _that.addEndpoint(
            ele,
            { anchors: "RightMiddle", maxConnections: -1 },
            origin
          ); //起点
          _that.addEndpoint(
            ele,
            { anchors: "LeftMiddle", maxConnections: -1 },
            destination
          ); //终点
        } else if (specialNodeClass(type) == "classD_D1") {
          _that.addEndpoint(
            ele,
            {
              anchors: [1, 0.3, 0, 0],
              maxConnections: -1,
              overlays: [
                [
                  "Label",
                  {
                    location: [1.5, -0.5],
                    label: "yes",
                    cssClass: "endpointSourceLabel"
                  }
                ]
              ]
            },
            origin
          );
          _that.addEndpoint(
            ele,
            {
              anchors: [1, 0.7, 0, 0],
              maxConnections: -1,
              overlays: [
                [
                  "Label",
                  {
                    location: [1.5, 1.3],
                    label: "no",
                    cssClass: "endpointSourceLabel"
                  }
                ]
              ]
            },
            origin
          );
          _that.addEndpoint(ele, { anchors: "LeftMiddle" }, destination); //终点
        } else if (specialNodeClass(type) == "classD_D2") {
          _that.addEndpoint(
            ele,
            {
              anchors: [1, 0.3, 0, 0],
              maxConnections: -1,
              overlays: [
                [
                  "Label",
                  {
                    location: [1.5, -0.5],
                    label: "ok",
                    cssClass: "endpointSourceLabel"
                  }
                ]
              ]
            },
            origin
          );
          _that.addEndpoint(
            ele,
            {
              anchors: [1, 0.7, 0, 0],
              maxConnections: -1,
              overlays: [
                [
                  "Label",
                  {
                    location: [1.5, 1.3],
                    label: "error",
                    cssClass: "endpointSourceLabel"
                  }
                ]
              ]
            },
            origin
          );
          _that.addEndpoint(ele, { anchors: "LeftMiddle" }, destination); //终点
        } else if (specialNodeClass(type) == "classD_E1") {
          _that.addEndpoint(
            ele,
            { anchors: "RightMiddle", maxConnections: -1 },
            origin
          );
          _that.addEndpoint(
            ele,
            {
              anchors: [0, 0.3, 0, 0],
              overlays: [
                [
                  "Label",
                  {
                    location: [-1, -0.5],
                    label: "left",
                    cssClass: "endpointSourceLabel"
                  }
                ]
              ]
            },
            destination
          );
          _that.addEndpoint(
            ele,
            {
              anchors: [0, 0.7, 0, 0],
              overlays: [
                [
                  "Label",
                  {
                    location: [-1, 1.5],
                    label: "right",
                    cssClass: "endpointSourceLabel"
                  }
                ]
              ]
            },
            destination
          );
        } else if (specialNodeClass(type) == "classD_E2") {
          _that.addEndpoint(
            ele,
            { anchors: "RightMiddle", maxConnections: -1 },
            origin
          );
          _that.addEndpoint(
            ele,
            {
              anchors: [0, 0.3, 0, 0],
              overlays: [
                [
                  "Label",
                  {
                    location: [-1, -0.5],
                    label: "input1",
                    cssClass: "endpointSourceLabel"
                  }
                ]
              ]
            },
            destination
          );
          _that.addEndpoint(
            ele,
            {
              anchors: [0, 0.7, 0, 0],
              overlays: [
                [
                  "Label",
                  {
                    location: [-1, 1.5],
                    label: "input2",
                    cssClass: "endpointSourceLabel"
                  }
                ]
              ]
            },
            destination
          );
        } else {
          _that.addEndpoint(
            ele,
            { anchors: "RightMiddle", maxConnections: -1 },
            origin
          ); //起点
          _that.addEndpoint(
            ele,
            { anchors: "LeftMiddle", maxConnections: -1 },
            destination
          ); //终点
        }
        ele.css({
          left: _this.thisObj.x,
          top: _this.thisObj.y,
          position: "absolute",
          margin: 0
        });
        $("#designMain").append(ele);
        _that.draggable(ele);
        ele.draggable({
          containment: "parent"
        });
        _that.repaintEverything();
      }
      e.stopPropagation(); //阻止事件冒泡
    });
    /**
     * btn-dbClick：节点设置
     * ------------------------------------------------------------------
     */
    $("#designMain").on("dblclick", ".designIconBig", function(event) {
      _this.nodeSet.btnStatus = true;
      $(document).off("keydown");
      var left = event.currentTarget.offsetLeft;
      var top = event.currentTarget.offsetTop;
      var designType = $(this).attr("data-type");
      var designId = $(this).attr("data-index");
      var designText = $(this).find("h4").text();
      if (designType == "define") {
        _this.stepsCombination.flowSetVisible = true;
        _this.stepsCombination.flowData = _this.stepInfoFlow;
        _this.stepsCombination.parentFlowData=_this.flowData;
       // console.log('_this.stepsCombination',_this.stepsCombination);
        return;
      }
      _this.nodedesign = {
        left: event.currentTarget.offsetLeft,
        top: event.currentTarget.offsetTop,
        designType: $(this).attr("data-type"),
        designId: $(this).attr("data-index"),
        designText: $(this).find("h4").text()
      }
       //===================================
       _this.thisStepId = $(this).attr("data-index");
      //双击节点时 把流程数据 赋给 节点设置上的flowData变量
      _this.nodeSet.flowData = _this.flowData;
      _this.nodeSet.dbStatus = "1"; //节点弹出框状态
      _this.getDesignSteps();
      // _this.getDesignLinks();
      _this.filterLinks();
       //===================================
      _this.getdblSteps(_this.nodedesign)
      _this.preStepList = _this.findPreLinks(designId);
      if (
        customizeSteps(designType) == "customize"
      ) {
        _this.defineNode(_this.nodedesign)
        return false
      }
        // _this.dataflowNode(designType)
        // return false
        //执行flow数据
      var ouputData = [];
      for (var i = 0; i < _this.flowData.steps.length; i++) {
        if (_this.flowData.steps[i].id == designId) {
          ouputData = _this.flowData.steps[i].outputConfigurations;
          if (nodeQuote(_this.flowData.steps[i].type) == "quoteB") {
            this.datasetPath = false;
          }
          if (nodeQuote(_this.flowData.steps[i].type) == "quoteA") {
            if (_this.flowData.steps[i].otherConfigurations.datasetId) {
              var tenantIdTmp = _this.flowData.tenantId;
              getDataset(
                _this.flowData.steps[i].otherConfigurations.datasetId,
                tenantIdTmp
              ).then(
                data => {
                  _this.nodeSet.datasetType = data.storage;
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
          }
          //获取当前点击节点schemaId的ID
          if (_this.flowData.steps[i].otherConfigurations.schemaId) {
            _this.schemaId =
              _this.flowData.steps[i].otherConfigurations.schemaId;
            sessionStorage.setItem("schemaId", _this.schemaId);
          }
          //获取当前点击节点dataset的ID
          var lookupschemaIdArr = [];
          if (
            _this.flowData.steps[i].otherConfigurations.ruleSettings &&
            _this.flowData.steps[i].otherConfigurations.ruleSettings.length !=
              0 &&
            _this.flowData.steps[i].otherConfigurations.ruleSettings[0]
              .datasetId
          ) {
            _this.datasetIdArr =
              _this.flowData.steps[i].otherConfigurations.ruleSettings;
            lookupschemaIdArr = _this.datasetIdArr.map(function(i) {
              return i.schemaId;
            });
            sessionStorage.setItem(
              "datasetIdArr",
              JSON.stringify(lookupschemaIdArr)
            );
          } else {
            sessionStorage.setItem(
              "datasetIdArr",
              JSON.stringify(lookupschemaIdArr)
            );
          }
          //designType为dataflow时获取其输出字段
          let dataflowId = "";
          if (
            specialNodeClass(_this.flowData.steps[i].type) == "classW_A" &&
            JSON.stringify(_this.flowData.steps[i].otherConfigurations) != "{}"
          ) {
            dataflowId =
              _this.flowData.steps[i].otherConfigurations.dataflowId$;
            sessionStorage.setItem("dataflowId", dataflowId);
          } else {
            sessionStorage.setItem("dataflowId", "");
          }
        }
      }
      if (ouputData == "") {
        if (specialNodeClass(designType) == "classD_D1") {
          ouputData.push(
            {
              id: "yes",
              fields: []
            },
            {
              id: "no",
              fields: []
            }
          );
        } else if (specialNodeClass(designType) == "classD_D2") {
          ouputData.push(
            {
              id: "ok",
              fields: []
            },
            {
              id: "error",
              fields: []
            }
          );
        } else {
          ouputData.push({
            id: "output",
            fields: []
          });
        }
      }
      //获取当前输出的Name
      _this.nodeSet.nodeSetTab = [];
      _this.nodeSet.inputData = [];
      var thisIndividualTypeLinks = [];
      //获取当前steps的ID
      var thisDesignID = $(this).attr("id");
      var thisEndif = false;

      let links = JSON.parse(sessionStorage.getItem('links'))
      let preLinks = _.filter(links, item => {
        return item.target ==  _this.nodedesign.designId;
      });
      //根据当前ID 获取当前steps的所有点
      var thisStepsEndpoints = jsPlumb.jsPlumb.getEndpoints(thisDesignID);
      var sessionInputVal = [];
      if (specialNodeClass(_this.flowType) == "classW_A") {
        //遍历当前steps的点
        for (var ei = 0; ei < thisStepsEndpoints.length; ei++) {
          //遍历当前steps的点绑定的线
          for (
            var ej = 0;
            ej < thisStepsEndpoints[ei].connections.length;
            ej++
          ) {
            if (thisStepsEndpoints[ei].canvas.width == 12) {
              //Tab 输入线
              if (nodeClass(designType) == "classD_A") {
              } else if (nodeQuote(designType) == "quoteB") {
                _this.nodeSet.nodeSetTab.push({
                  title: "输入",
                  name: "input",
                  icon: "fa fa-sign-in"
                });
                var getlinks = JSON.parse(sessionStorage.getItem("links"));
                for (var x = 0; x < getlinks.length; x++) {
                  if (getlinks[x].target == designId) {
                    for (var s = 0; s < _this.flowData.steps.length; s++) {
                      if (_this.flowData.steps[s].id == getlinks[x].source) {
                        if (_this.flowData.steps[s].type == "define") {
                          let preLinks = _this.getTargetItem(designId);
                          let preStep = _this.getSubFlowPreSteps(preLinks);
                          sessionStorage.setItem(
                            "outputConfig",
                            JSON.stringify(preStep.outputConfigurations[0])
                          );
                          // console.log(" 1 ", preStep);
                          // console.log(_this.flowData);
                        } else {
                          for (
                            var o = 0;
                            o <
                            _this.flowData.steps[s].outputConfigurations.length;
                            o++
                          ) {
                            if (
                              getlinks[x].sourceOutput ==
                              _this.flowData.steps[s].outputConfigurations[o].id
                            ) {
                              sessionStorage.setItem(
                                "outputConfig",
                                JSON.stringify(
                                  _this.flowData.steps[s].outputConfigurations[
                                    o
                                  ]
                                )
                              );
                            }
                          }
                        }
                        var sessionStorageSteps = JSON.parse(
                          sessionStorage.getItem("outputConfig")
                        );
                        sessionStorageSteps.id = "input";
                        for (
                          var sj = 0;
                          sj < sessionStorageSteps.fields.length;
                          sj++
                        ) {
                          if (sessionStorageSteps.fields[sj].alias == "") {
                          } else {
                            sessionStorageSteps.fields[sj].column =
                              sessionStorageSteps.fields[sj].alias;
                            sessionStorageSteps.fields[sj].alias = "";
                          }
                        }
                        _this.nodeSet.inputData.push(sessionStorageSteps);
                      }
                    }
                  }
                }
              } else {
                if (
                  nodeLinks(
                    thisStepsEndpoints[ei].canvas.nextElementSibling.innerText
                  ) == "pointC"
                ) {
                  _this.nodeSet.nodeSetTab.push({
                    title:
                      thisStepsEndpoints[ei].canvas.nextElementSibling
                        .innerText +
                      "（" +
                      thisStepsEndpoints[ei].connections[ej].source.dataset
                        .sign +
                      "）",
                    name:
                      thisStepsEndpoints[ei].canvas.nextElementSibling
                        .innerText,
                    icon: "fa fa-sign-in"
                  });
                  var sourceName = thisStepsEndpoints[ei].connections[
                    ej
                  ].source.dataset.sign.replace(/(^\s*)|(\s*$)/g, "");
                  for (var fl = 0; fl < _this.flowData.steps.length; fl++) {
                    if (_this.flowData.steps[fl].name == sourceName) {
                      sessionStorage.setItem(
                        "outputConfig",
                        JSON.stringify(
                          _this.flowData.steps[fl].outputConfigurations
                        )
                      );
                      var sessionStorageSteps = JSON.parse(
                        sessionStorage.getItem("outputConfig")
                      );
                      if (
                        sessionStorageSteps.length > 1 &&
                        thisStepsEndpoints[ei].canvas.nextElementSibling
                          .innerText == "input1"
                      ) {
                        for (
                          var ss = 0;
                          ss < sessionStorageSteps.length;
                          ss++
                        ) {
                          sessionStorageSteps[0].id =
                            thisStepsEndpoints[
                              ei
                            ].canvas.nextElementSibling.innerText;
                          for (
                            var sj = 0;
                            sj < sessionStorageSteps[0].fields.length;
                            sj++
                          ) {
                            if (sessionStorageSteps[0].fields[sj].alias == "") {
                            } else {
                              sessionStorageSteps[0].fields[sj].column =
                                sessionStorageSteps[0].fields[sj].alias;
                              sessionStorageSteps[0].fields[sj].alias = "";
                            }
                          }
                          sessionInputVal.push(sessionStorageSteps[0]);
                        }
                        filterId(sessionInputVal);
                      } else if (
                        sessionStorageSteps.length > 1 &&
                        thisStepsEndpoints[ei].canvas.nextElementSibling
                          .innerText == "right"
                      ) {
                        let rightLinks = links.filter(item=>{
                            return item.targetInput=='right'
                          })
                        for (var ss = 0;ss < sessionStorageSteps.length;ss++) {
                          if(sessionStorageSteps[ss].id ==rightLinks[0].sourceOutput){
                              sessionStorageSteps[ss].id =thisStepsEndpoints[ei].canvas.nextElementSibling.innerText;
                              for (var sj = 0;sj < sessionStorageSteps[ss].fields.length;sj++) {
                                if (sessionStorageSteps[ss].fields[sj].alias == "") {
                                } else {
                                  sessionStorageSteps[ss].fields[sj].column =
                                    sessionStorageSteps[ss].fields[sj].alias;
                                  sessionStorageSteps[ss].fields[sj].alias = "";
                                }
                              }
                              sessionInputVal.push(sessionStorageSteps[ss]);
                          }
                        }
                        filterId(sessionInputVal);
                      } else if (
                        sessionStorageSteps.length > 1 &&
                        thisStepsEndpoints[ei].canvas.nextElementSibling
                          .innerText == "input2"
                      ) {
                        for (
                          var ss = 0;
                          ss < sessionStorageSteps.length;
                          ss++
                        ) {
                          sessionStorageSteps[1].id =
                            thisStepsEndpoints[
                              ei
                            ].canvas.nextElementSibling.innerText;
                          for (
                            var sj = 0;
                            sj < sessionStorageSteps[1].fields.length;
                            sj++
                          ) {
                            if (sessionStorageSteps[1].fields[sj].alias == "") {
                            } else {
                              sessionStorageSteps[1].fields[sj].column =
                                sessionStorageSteps[1].fields[sj].alias;
                              sessionStorageSteps[1].fields[sj].alias = "";
                            }
                          }
                          sessionInputVal.push(sessionStorageSteps[1]);
                        }
                        filterId(sessionInputVal);
                      } else {
                        if(thisStepsEndpoints[ei].canvas.nextElementSibling
                          .innerText == "left"){
                            let leftLinks = links.filter(item=>{
                            return item.targetInput=='left'
                            })
                            for (var ss = 0;ss < sessionStorageSteps.length;ss++) {
                              if(sessionStorageSteps[ss].id ==leftLinks[0].sourceOutput){
                                  sessionStorageSteps[ss].id =thisStepsEndpoints[ei].canvas.nextElementSibling.innerText;
                                  for (var sj = 0;sj < sessionStorageSteps[ss].fields.length;sj++) {
                                    if (sessionStorageSteps[ss].fields[sj].alias == "") {
                                    } else {
                                      sessionStorageSteps[ss].fields[sj].column =
                                        sessionStorageSteps[ss].fields[sj].alias;
                                      sessionStorageSteps[ss].fields[sj].alias = "";
                                    }
                                  }
                                  sessionInputVal.push(sessionStorageSteps[ss]);
                              }
                            }
                            filterId(sessionInputVal);
                        }else {
                            for (
                              var ss = 0;
                              ss < sessionStorageSteps.length;
                              ss++
                            ) {
                              sessionStorageSteps[ss].id =
                                thisStepsEndpoints[
                                  ei
                                ].canvas.nextElementSibling.innerText;
                              for (
                                var sj = 0;
                                sj < sessionStorageSteps[ss].fields.length;
                                sj++
                              ) {
                                if (
                                  sessionStorageSteps[ss].fields[sj].alias == ""
                                ) {
                                } else {
                                  sessionStorageSteps[ss].fields[sj].column =
                                    sessionStorageSteps[ss].fields[sj].alias;
                                  sessionStorageSteps[ss].fields[sj].alias = "";
                                }
                              }
                              sessionInputVal.push(sessionStorageSteps[ss]);
                            }
                            filterId(sessionInputVal);
                        }
                      }
                    }
                  }
                  _this.nodeSet.inputData = sessionInputVal;
                  filterId(_this.nodeSet.inputData);
                } else if (nodeClass(designType) === "classD_C") {
                  _this.nodeSet.nodeSetTab.push({
                    title:
                      "输入（" +
                      thisStepsEndpoints[ei].connections[ej].source.dataset
                        .sign +
                      "）",
                    name:
                      thisStepsEndpoints[ei].connections[ej].source.dataset
                        .index,
                    icon: "fa fa-sign-in"
                  });
                  var getlinks = JSON.parse(sessionStorage.getItem("links"));
                  var linkLength;
                  for (var i = 0; i < getlinks.length; i++) {
                    if (
                      getlinks[i].target === designId &&
                      getlinks[i].source ===
                        thisStepsEndpoints[ei].connections[ej].source.dataset
                          .index
                    ) {
                      linkLength = i;
                    }
                  }
                  if (getlinks[linkLength].target === designId) {
                    for (var s = 0; s < _this.flowData.steps.length; s++) {
                      if (
                        _this.flowData.steps[s].id ===
                        getlinks[linkLength].source
                      ) {
                        for (
                          var o = 0;
                          o <
                          _this.flowData.steps[s].outputConfigurations.length;
                          o++
                        ) {
                          for (var l = 0; l < getlinks.length; l++) {
                            if (
                              getlinks[l].sourceOutput ===
                                _this.flowData.steps[s].outputConfigurations[o]
                                  .id &&
                              getlinks[l].target === designId
                            ) {
                              sessionStorage.setItem(
                                "outputConfig",
                                JSON.stringify(
                                  _this.flowData.steps[s].outputConfigurations[
                                    o
                                  ]
                                )
                              );
                              var sessionStorageSteps = JSON.parse(
                                sessionStorage.getItem("outputConfig")
                              );
                              sessionStorageSteps.id =
                                thisStepsEndpoints[ei].connections[
                                  ej
                                ].source.dataset.index;
                              for (
                                var sj = 0;
                                sj < sessionStorageSteps.fields.length;
                                sj++
                              ) {
                                if (
                                  sessionStorageSteps.fields[sj].alias == ""
                                ) {
                                } else {
                                  sessionStorageSteps.fields[sj].column =
                                    sessionStorageSteps.fields[sj].alias;
                                  sessionStorageSteps.fields[sj].alias = "";
                                }
                              }
                              // console.log("1917");
                              _this.nodeSet.inputData.push(sessionStorageSteps);
                            }
                          }
                        }
                      }
                    }
                  }
                  filterId(_this.nodeSet.inputData);
                } else {
                  _this.nodeSet.nodeSetTab.push({
                    title:
                      "输入（" +
                      thisStepsEndpoints[ei].connections[ej].source.dataset
                        .sign +
                      "）",
                    name: "input",
                    icon: "fa fa-sign-in"
                  });
                  var getlinks = JSON.parse(sessionStorage.getItem("links"));
                  var linkLength;
                  for (var i = 0; i < getlinks.length; i++) {
                    if (
                      getlinks[i].target === designId &&
                      getlinks[i].source ===
                        thisStepsEndpoints[ei].connections[ej].source.dataset
                          .index
                    ) {
                      linkLength = i;
                    }
                  }
                  if (getlinks[linkLength].target === designId) {
                    for (var s = 0; s < _this.flowData.steps.length; s++) {
                      if (
                        _this.flowData.steps[s].id ===
                        getlinks[linkLength].source
                      ) {
                        for (
                          var o = 0;
                          o <
                          _this.flowData.steps[s].outputConfigurations.length;
                          o++
                        ) {
                          for (var l = 0; l < getlinks.length; l++) {
                            if (
                              getlinks[l].sourceOutput ===
                                _this.flowData.steps[s].outputConfigurations[o]
                                  .id &&
                              getlinks[l].target === designId
                            ) {
                              sessionStorage.setItem(
                                "outputConfig",
                                JSON.stringify(
                                  _this.flowData.steps[s].outputConfigurations[
                                    o
                                  ]
                                )
                              );
                              var sessionStorageSteps = JSON.parse(
                                sessionStorage.getItem("outputConfig")
                              );
                              sessionStorageSteps.id = "input";
                              for (
                                var sj = 0;
                                sj < sessionStorageSteps.fields.length;
                                sj++
                              ) {
                                if (
                                  sessionStorageSteps.fields[sj].alias == ""
                                ) {
                                } else {
                                  sessionStorageSteps.fields[sj].column =
                                    sessionStorageSteps.fields[sj].alias;
                                  sessionStorageSteps.fields[sj].alias = "";
                                }
                              }
                              // console.log("1053");
                              _this.nodeSet.inputData.push(sessionStorageSteps);
                            }
                          }
                        }
                      }
                    }
                  }
                  filterId(_this.nodeSet.inputData);
                }
              }
            } else {
            }
            //获取 当连线连接终点 == steps的ID 时，thisEndif为true，否则为false
            if (
              thisStepsEndpoints[ei].connections[ej].targetId == thisDesignID
            ) {
              thisIndividualTypeLinks.push(
                thisStepsEndpoints[ei].connections[ej].targetId
              );
              thisEndif = true;
            }
          }
        }
        if (
          nodeClass(designType) == "classD_E" &&
          thisIndividualTypeLinks.length != 2
        ) {
          thisEndif = false;
        }
        //Tab 参数
        if (noParme(designType) == "classN_P") {
        } else {
          _this.nodeSet.nodeSetTab.push({
            title: "参数",
            name: "parameter",
            icon: "fa fa-gear"
          });
        }
        if (nodeClass(designType) == "classD_A") {
          _this.nodeSet.nodeSetTab.push({
            title: "输出",
            name: "output",
            icon: "fa fa-sign-out"
          });
        }
        //遍历当前steps的点
        for (var ei = 0; ei < thisStepsEndpoints.length; ei++) {
          //遍历当前steps的点绑定的线
          if (thisStepsEndpoints[ei].canvas.width == 14) {
            if (nodeClass(designType) == "classD_A") {
            } else if (nodeClass(designType) == "classD_B") {
            } else {
              if (nodeClass(designType) == "classD_D") {
                _this.nodeSet.nodeSetTab.push({
                  title:
                    thisStepsEndpoints[ei].canvas.nextElementSibling.innerText,
                  name:
                    thisStepsEndpoints[ei].canvas.nextElementSibling.innerText,
                  icon: "fa fa-sign-out"
                });
              } else {
                _this.nodeSet.nodeSetTab.push({
                  title: "输出",
                  name: "output",
                  icon: "fa fa-sign-out"
                });
              }
              filterObj(_this.nodeSet.nodeSetTab);
            }
          }
        }
      } else {
        if (specialNodeClass(designType) == "classW_A") {
          _this.nodeSet.inputData = [];
          _this.nodeSet.nodeSetTab.push(
            // {
            //     title: '输入',
            //     name: 'input',
            //     icon: 'fa fa-sign-in',
            // },
            {
              title: "参数",
              name: "parameter",
              icon: "fa fa-gear"
            }
          );
        } else {
          _this.nodeSet.nodeSetTab.push({
            title: "参数",
            name: "parameter",
            icon: "fa fa-gear"
          });
        }
      }
      //传值 当前steps的所有line
      _this.nodeSet.nodeLine.inputLine = [];
      _this.nodeSet.nodeLine.outputLine = [];
      for (var iLine = 0; iLine < thisStepsEndpoints.length; iLine++) {
        for (
          var jLine = 0;
          jLine < thisStepsEndpoints[iLine].connections.length;
          jLine++
        ) {
          if (thisStepsEndpoints[iLine].canvas.width == 12) {
            _this.nodeSet.nodeLine.inputLine.push({
              lineNameSource: thisStepsEndpoints[iLine].connections[
                jLine
              ].source.dataset.index.replace(/(^\s*)|(\s*$)/g, "")
            });
          } else {
            _this.nodeSet.nodeLine.outputLine.push({
              lineNameTarget: thisStepsEndpoints[iLine].connections[
                jLine
              ].target.dataset.index.replace(/(^\s*)|(\s*$)/g, "")
            });
          }
        }
      }
      //判断 连接提示  注:workflow所有step无连接提示
      if (
        thisEndif == true ||
        nodeClass(designType) == "classD_A" ||
        nodeClass(designType) == "classW_C"
      ) {
        _this.nodeSet.nodeSetVisible = true;
        /*--------------------------------------------------------------------------*/
        $("#nodeSetDialog .el-dialog__title").text(designType + " 设置");
        _this.nodeSet.oldName = designText;
        _this.nodeSet.newName = designText;
        var flowSteps = _this.flowData.steps;
        var newFlow = flowSteps.filter(function(flow) {
          return flow.name === designText;
        });
        _this.nodeSet.thisNodeData = newFlow;
        _this.nodeSet.thisNodeData.inputConfigurations =
          _this.nodeSet.inputData; //针对union 删除source节点之后节点 inputConfiguragion id没有更新
        var inpData = [];
        var inputCon = [];
        for (var i = 0; i < _this.flowData.steps.length; i++) {
          if (_this.flowData.steps[i].name == _this.nodeSet.newName) {
            if (
              _this.flowData.steps[i].otherConfigurations &&
              _this.flowData.steps[i].otherConfigurations.singleRowCache
            ) {
              if (nodeCache(_this.flowData.steps[i].type) == "nodeCache") {
              } else {
                delete _this.flowData.steps[i].otherConfigurations
                  .singleRowCache;
              }
            }
            if (
              nodeClass(_this.flowData.steps[i].type) == "classD_B" ||
              nodeClass(_this.flowData.steps[i].type) == "classD_A" ||
              specialNodeClass(_this.flowData.steps[i].type) == "classW_A"
            ) {
              inpData = _this.flowData.steps[i].inputConfigurations;
            } else {
              if (_this.flowData.steps[i].inputConfigurations) {
                //??????????????
                if (
                  _this.flowData.steps[i].inputConfigurations.length !=
                  _this.nodeSet.nodeLine.inputLine.length
                ) {
                } else {
                  inpData = JSON.parse(JSON.stringify(_this.nodeSet.inputData));
                  inputCon = _this.flowData.steps[i].inputConfigurations;
                  //     _this.flowData.steps[i].inputConfigurations = _this.nodeSet.inputData
                }
              }
            }
          }
        }
        if (inpData == "") {
          var inData = transformArr(deepCopy(_this.nodeSet.inputData));
          inpData = inData;
        }
        var setNameTrue = false;
        //根据对象的id直接从对象数组中获取该对象
        if (nodeClass(designType) == "classD_A") {
          for (var i = 0; i < flowSteps.length; i++) {
            if (designText == flowSteps[i].name) {
              _this.nodeSet.thisNodeData = flowSteps[i];
              setNameTrue = true;
              var b = Object.keys(flowSteps[i].otherConfigurations);
            }
          }
        } else {
          for (var i = 0; i < flowSteps.length; i++) {
            if (designText == flowSteps[i].name) {
                // console.log(this.nodeSet.thisIcon)
              _this.nodeSet.thisNodeData = flowSteps[i];
              // _this.nodeSet.thisNodeData.inputConfigurations = inpData
              setNameTrue = true;
              var b = Object.keys(flowSteps[i].otherConfigurations);
            }
          }
        }
        //判断接口内没有该step，根据false并添加一个新的step
        if ( b.length == 0) {
          var pData =   JSON.parse(sessionStorage.getItem("nodeStep"));
          (_this.mockdefine[0].thisIcon).forEach((item,index) => {
            pData.push(item)
          })
          if (nodeClass(designType) == "classD_A") {
            for (var i = 0; i < pData.length; i++) {
              if (pData[i].type == designType) {
                _this.nodeSet.thisNodeData = {
                  id: designId,
                  name: designText,
                  type: designType,
                  outputConfigurations: pData[i].outputConfigurations,
                  otherConfigurations: pData[i].otherConfigurations,
                  x: left,
                  y: top
                };
              }
            }
          } else {
            for (var i = 0; i < pData.length; i++) {
              if (pData[i].type == "classW_C") {
                _this.nodeSet.thisNodeData = {
                  id: designId,
                  name: designText,
                  type: designType,
                  inputConfigurations: [],
                  outputConfigurations: [],
                  otherConfigurations: pData[i].otherConfigurations,
                  x: left,
                  y: top
                };
              } else if (pData[i].type == designType) {
                //inputCon   比较inpData里面的ID 与inputConId
                //inpData    是连线所获得的
                if (inpData.length > 0 && inputCon.length > 0) {
                  var inputDataArr = inpData.map(function(item) {
                    return item.id;
                  });
                  for (var ov = 0; ov < inputCon.length; ov++) {
                    if (inputDataArr.indexOf(inputCon[ov].id) == -1) {
                      //把变化的inputConfigation 换成inpData
                    } else {
                      for (var ow = 0; ow < inpData.length; ow++) {
                        if (inpData[ow].id == inputCon[ov].id) {
                          inpData[ow].fields = inputCon[ov].fields;
                        }
                      }
                    }
                  }
                }
                _this.nodeSet.thisNodeData = {
                  id: designId,
                  name: designText,
                  type: designType,
                  inputConfigurations: transformArr(inpData),
                  outputConfigurations: ouputData,
                  otherConfigurations: pData[i].otherConfigurations,
                  x: left,
                  y: top
                };
              }
            }
          }
        }
        // console.log(JSON.stringify(_this.nodeSet));
        // console.log("mockData",mockData);
        // _this.nodeSet=mockData;
        // console.log(" _this.nodeSet",_this.nodeSet);
      } else {
        if (specialNodeClass(designType) == "classD_E1") {
          _this.nodeSet.thisNodeData = {
            id: designId,
            name: designText,
            type: designType,
            inputConfigurations: [
              {
                id: "left",
                fields: []
              },
              {
                id: "right",
                fields: []
              }
            ],
            outputConfigurations: [],
            otherConfigurations: {},
            x: left,
            y: top
          };
        } else if (specialNodeClass(designType) == "classD_E2") {
          _this.nodeSet.thisNodeData = {
            id: designId,
            name: designText,
            type: designType,
            inputConfigurations: [
              {
                id: "input1",
                fields: []
              },
              {
                id: "input2",
                fields: []
              }
            ],
            outputConfigurations: [],
            otherConfigurations: {},
            x: left,
            y: top
          };
        } else {
          _this.nodeSet.thisNodeData = {
            id: designId,
            name: designText,
            type: designType,
            inputConfigurations: [
              {
                id: "input",
                fields: []
              }
            ],
            outputConfigurations: [],
            otherConfigurations: {},
            x: left,
            y: top
          };
        }
        // _this.nodeSet.nodeSetVisible = false;
        _this.$message({
          message: "请建立正确的连接！",
          type: "error"
        });
      }
      if(_this.nodeSet.thisNodeData.type=="backend"){
            _this.nodeSet.thisNodeData.outputConfigurations = []
        }
    });
    //多选steps
    $("#designMain").on("click", ".designIconBig #pitchOnDes", function(e) {
      var thisStepsName = $(this)
        .parent()
        .parent()
        .attr("data-sign");
      var thisStepsId = $(this)
        .parent()
        .parent()
        .attr("data-index");
      var str = $(this)
        .parent()
        .parent()
        .attr("class")
        .toString();
      if (str.match(/\bredStyle\b/gi) == "redStyle") {
        $(this)
          .parent()
          .parent()
          .removeClass("redStyle");
        changeRemoveSteps(thisStepsName, thisStepsId);
        $(this)
          .removeClass("fa-square")
          .css("color", "#b9c0d");
      } else {
        $(this)
          .parent()
          .parent()
          .addClass("redStyle");
        $(this)
          .addClass("fa-square")
          .css("color", "red");
        changeSteps(thisStepsName, thisStepsId);
      }
      //选中多个steps 提取选中的steps的json格式
      function changeSteps(thisStepsName, thisStepsId) {
        _this.getDesignSteps(); //获取画布steps
        // _this.getDesignLinks(); //获取画布连线
        _this.filterLinks()
        var getlinks = JSON.parse(sessionStorage.getItem("links"));
        var Steps = JSON.parse(sessionStorage.getItem("steps"));
        for (var i = 0; i < _this.flowData.steps.length; i++) {
          if (thisStepsName === _this.flowData.steps[i].name) {
            _this.changeSteps.changeStepsArr.push(
              JSON.parse(JSON.stringify(_this.flowData.steps[i]))
            );
          }
        }
        for (var j = 0; j < getlinks.length; j++) {
          if (thisStepsId === getlinks[j].target) {
            _this.changeSteps.changeLinksArr.push(
              JSON.parse(JSON.stringify(getlinks[j]))
            );
          }
        }
        let stepsArr = []         //保存节点的id
        let stepsInput = []       //保存流程输入的节点
        let stepsOutput = []      //保存流程输出的节点
        let linkSourceArr = []    //保存线的 source
        let linkTargetArr = []    //保存线的 target
        // // 提取流程节点的ID
        for(var m =0; m<_this.changeSteps.changeStepsArr.length; m++){
            stepsArr.push(_this.changeSteps.changeStepsArr[m].id)
        }
        //过滤多余的线 （线里有targe节点，但是没有source节点）
        for(var k = 0; k<_this.changeSteps.changeLinksArr.length;k++){
            if(stepsArr.indexOf(_this.changeSteps.changeLinksArr[k].source) < 0){
                _this.changeSteps.changeLinksArr.splice( k,1)
            }
        }
        // // 提取流程的输入
        // for(var h = 0; h<_this.changeSteps.changeLinksArr.length; h++){
        //     linkSourceArr.push(_this.changeSteps.changeLinksArr[h].source)
        //     linkTargetArr.push(_this.changeSteps.changeLinksArr[h].target)
        //     if(stepsArr.indexOf(_this.changeSteps.changeLinksArr[h].source)=='-1'){
        //         stepsInput.push(_this.changeSteps.changeLinksArr[h].target)
        //     }
        // }
        // // 提取流程的输出节点
        // for(var n=0; n<_this.changeSteps.changeStepsArr.length; n++){
        //     if(linkSourceArr.indexOf(_this.changeSteps.changeStepsArr[n].id)=='-1'){
        //         stepsOutput.push(_this.changeSteps.changeStepsArr[n].id)
        //     }
        //     if(linkTargetArr.indexOf(_this.changeSteps.changeStepsArr[n].id)=='-1'){
        //         stepsInput.push(_this.changeSteps.changeStepsArr[n].id)
        //     }
        // }
        // // 过滤流程输入点不为source
        // if(stepsInput.length!=0){
        //             stepsInput = (Array.from(new Set(stepsInput)))
        //             stepsInput = stepsInput.filter(_this.checkInput)
        // }
        // // 过滤流程输出点不为sink
        // if(stepsOutput.length!=0){
        //     stepsOutput = Array.from(new Set(stepsOutput))
        //     stepsOutput = stepsOutput.filter(_this.checkOutput)
        // }
        // console.log('-----------------')
        // console.log(stepsInput)
        // console.log(stepsOutput)
        // console.log(_this.changeSteps)
        // console.log(_this.flowData)
        //  console.log('-----------------')
      }
      //取消选中的steps
      function changeRemoveSteps(thisStepsName, thisStepsId) {
        for (var j = 0; j < _this.changeSteps.changeStepsArr.length; j++) {
          if (thisStepsName === _this.changeSteps.changeStepsArr[j].name) {
            _this.changeSteps.changeStepsArr.splice(j, 1);
            j--;
          }
        }
        for (var k = 0; k < _this.changeSteps.changeLinksArr.length; k++) {
          if (thisStepsId === _this.changeSteps.changeLinksArr[k].target) {
            _this.changeSteps.changeLinksArr.splice(k, 1);
            k--;
          }
        }
        // console.log(_this.changeSteps)
        // console.log('获取线')
        let stepsArr = [];
        let stepsInput = [];
        let stepsOutput = [];
        let linkSourceArr = [];
        let linkTargetArr = [];
        for (var m = 0; m < _this.changeSteps.changeStepsArr.length; m++) {
          stepsArr.push(_this.changeSteps.changeStepsArr[m].id);
        }
        for (var h = 0; h < _this.changeSteps.changeLinksArr.length; h++) {
          linkSourceArr.push(_this.changeSteps.changeLinksArr[h].source);
          linkTargetArr.push(_this.changeSteps.changeLinksArr[h].target);
          if (
            stepsArr.indexOf(_this.changeSteps.changeLinksArr[h].source) == "-1"
          ) {
            stepsInput.push(_this.changeSteps.changeLinksArr[h].target);
            if (stepsInput.length != 0) {
              stepsInput = Array.from(new Set(stepsInput));
            }
          }
        }
        for (var n = 0; n < _this.changeSteps.changeStepsArr.length; n++) {
          if (
            linkSourceArr.indexOf(_this.changeSteps.changeStepsArr[n].id) ==
            "-1"
          ) {
            stepsOutput.push(_this.changeSteps.changeStepsArr[n].id);
          }
          if (
            linkTargetArr.indexOf(_this.changeSteps.changeStepsArr[n].id) ==
            "-1"
          ) {
            stepsInput.push(_this.changeSteps.changeStepsArr[n].id);
          }
        }
        if (stepsInput.length != 0) {
          stepsInput = Array.from(new Set(stepsInput));
          // stepsInput = stepsInput.filter(_this.checkInput);
        }
        if (stepsOutput.length != 0) {
          stepsOutput = Array.from(new Set(stepsOutput));
          // stepsOutput = stepsOutput.filter(_this.checkOutput);
        }
        console.log(_this.changeSteps)
      }
      e.stopPropagation(); //阻止事件冒泡
    });
    //鼠标移入事件
    $('#designMain').on("mouseover", ".designIconBig #changeSte ",function(e){
      let data = _this.testOutputContent
      let currentsteps = $(this).parent().parent().attr("data-sign")
      let idArr = Object.keys(data)    //存储输出结果的ID
      idArr.forEach(item=>{
        if(item.indexOf(currentsteps)>=0){
          _this.testSteps.dialogVisible = true
        }
      })
      if( _this.testSteps.dialogVisible == true){
          let currentID = []
          idArr.map((item)=>{
            if(item.indexOf(currentsteps)>=0){
              currentID.push(item)
            }
          })
          //筛选过滤出data 中有currentID的值
          let currentJson = {}
          //循环json
          for(var key in data){
            currentID.forEach(item1 =>{
              if(key==item1){
                currentJson[key] = data[key]
              }
            })
          }
          _this.testOutputkey = Object.keys(currentJson)
          _this.activeName = currentID[0]
          let tableHeadJson =[]
          if((currentJson[_this.activeName]).length==0){
            tableHeadJson =[]
          }else {
            tableHeadJson = Object.keys((currentJson[_this.activeName])[0])
          }
          _this.tableHead =[]
          if(tableHeadJson.length!=0){
            tableHeadJson.forEach((item,index) =>{
              _this.tableHead.push({prop:item})
            })
          }
          _this.testDesignData = currentJson[_this.activeName]
          _this.$set(_this.testDesignData,currentJson[_this.activeName])
      }
    })
    let comp = flowNodeTypeComp(); //节点组件
    _this.flowNodeTypes = comp[_this.flowType];
  },
  updated() {
    this.design();
    this.routeTrue =
      $("#designMain").find(".designIconBig").length > this.nodeLength;
  },
  destroyed() {
    jsPlumb.jsPlumb.deleteEveryEndpoint($("#designMain"));
    $(document).off("keydown"); //解绑键盘复制事件
  }
};
</script>

<style  lang="scss">
.con-module {
  margin: 0px;
  .child-content {
    padding: 0px;
    height: -webkit-calc(100% - 40px);
    height: -moz-calc(100% - 40px);
    height: calc(100% - 40px);
    .drawSelHis {
      float: left;
      margin: 1px 0px 0px 0px;
      .drawHisBut {
        font-size: 12px;
        height: 0px;
        line-height: 0px;
      }
    }
    i {
      font-size: 13px;
    }
    .desLeft {
      float: left;
      padding: 5px 0px 0px 120px;
    }
    .flowNameInput {
      float: left;
      margin-right: 10px;
      width: 230px;
    }
    .drawingCanvas {
      position: relative;
      z-index: 100;
      float: left;
      margin: 0px;
      width: 100%;
    }
  }
}
.drawingCanvas {
  height: 100%;
  min-height: 500px;
}
#designMain {
  background: url("../../../../assets/design/designBg.png");
}
.btn-right .submiterror {
  border: 0;
  border-radius: 0;
  background-clip: padding-box;
  font-size: 14px;
  outline: none;
  padding: 3px 0 !important;
  white-space: normal;
  border-left: 1px solid #999999;
  border-right: 1px solid #999999;
  transition: all 0.2s ease;
  width: 60px;
  color: #999999;
  background-color: #ffffff !important;
  border-color: #c8c9cc;
}

  .blingbling{
    border: 6px solid #73BF00 ;
    width: 36px ;
    height: 36px ;
    border-radius: 50% ;
    position: absolute ;
    -webkit-animation: scaleout 2.5s infinite ease-in-out ;
    animation: scaleout 1.5s infinite ease-in-out ;
  }
  @keyframes scaleout {
    0% {
       background:#a766362b ;
       opacity: 0.8 ;
    }
      50%{
        background:#a766366e ;
        opacity: 0.5 ;
      }
      75%{
        background:#a76636ad ;
        opacity: 0.8 ;
      }
      100% {
         background:#a76636d6 ;
         opacity: 1.0 ;
      }
  }
  @keyframes success {
    0% {
       background:#5b8ec92b;
    }
    100% {
        background:#5b8ec92b;
    }
  }
  .testBing{
    background:#73BF00;
  }
</style>
