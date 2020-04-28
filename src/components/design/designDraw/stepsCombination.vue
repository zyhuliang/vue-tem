<!--  design 设置 参数声明 组件  -->
<template>
  <div>
    <el-dialog
      v-dialog-drag
      title="组合节点分节点"
      id="stepsCombination"
      :close-on-click-modal="false"
      :visible.sync="stepsCombination.flowSetVisible"
      :modal-append-to-body="false"
      @opened="inintFlowchart"
      @close="remove"
      @open="showDailog"
    >
      <div>
        <div id="designSvg"></div>
      </div>
    </el-dialog>
    <component
      :is="flowNodeTypes"
      ref="nodeData"
      :nodeSet="nodeSet"
      @updateSubFlowSteps="updateSubFlowSteps"
      @resetNodeSet="resetNodeSet"
    ></component>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
import {
  drawFlowData,
  drawGquery,
  drawHistoryData,
  drawHistoryVersion,
  drawSaveData,
  outputDataFlow,
  getSchema,
  getDataset,
  mockStep
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
  nodeIcon,
  nodeClass,
  specialNodeClass,
  nodeQuote,
  nodeCache,
  nodeLinks,
  noParme,
  datamining
} from "@function/nodeSet";
import {
  connectorPaintStyle,
  connectorHoverStyle,
  origin,
  destination,
  createRandomTime
} from "@rhinos/design/flowType/flowStyle";
import {
  stepsFilterObj,
  lStepsFilterObj,
  displayProp,
  createComparisonFunction
} from "@function/designFunction.js"; //引入design专用函数
import { flowNodeTypeComp } from "@function/flowTypeNode"; //参数类型
import store from "@store/index";
import mockData from "@mock/example/steps";

export default {
  computed: {
    ...mapState(["pk"])
  },
  data() {
    return {
      jsplumbInstance: "",
      flowType: this.$route.query.type, //流程类型
      commnTab: [
        {
          title: "参数",
          name: "parameter",
          icon: "fa fa-gear"
        },
        {
          title: "输出",
          name: "output",
          icon: "fa fa-sign-out"
        }
      ],
      splitTab: [
        {
          title: "参数",
          name: "parameter",
          icon: "fa fa-gear"
        },
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
      ],
      validateTab: [
        {
          title: "参数",
          name: "parameter",
          icon: "fa fa-gear"
        },
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
      ],
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
        dbStatus: "0" //节点双击状态
      },
      flowNodeTypes: "", //节点类型组件
      jsplumbPro: "",
      subFlowData: []
    };
  },
  props: ["stepsCombination"],
  watch: {
    stepsCombination: {
      // 监听父级传的来的整体的data
      handler: function(newValue) {},
      deep: true
    }
  },
  methods: {
    ...mapActions(["getAllLinks", "insertLinks"]),
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
    getLeftRightItem(preStepList) {
      let leftItem = {},
        rightItem = {};
      _.forEach(preStepList, (item, index) => {
        if (item.input == "left") {
          leftItem = item;
        }
        if (item.input == "right") {
          rightItem = item;
        }
      });

      return [leftItem, rightItem];
    },
    resetNodeSet() {
      this.nodeSet = {
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
        dbStatus: "0" //节点双击状态
      };
    },
    getSubFlowLinks(self) {
      let links = _.filter(
        self.getSubFlowData(self.stepsCombination.flowData).links,
        item => {
          return (
            item.target !=
            _.head(self.stepsCombination.flowData.changeStepsArr).id
          );
        }
      );

      return _.filter(links, item => {
        return (
          item.source !=
          _.last(self.stepsCombination.flowData.changeStepsArr).id
        );
      });
    },
    findPreLinks(val) {
      let preLinks = _.filter(this.pk.subFlowLinks, item => {
        return item.target == val;
      });
      return this.findPreNodeList(preLinks);
    },
    findPreNodeList(val) {
      let result = [];
      let allSteps = _.concat(
        this.stepsCombination.flowData.changeStepsArr,
        this.stepsCombination.parentFlowData.steps
      );
      // console.log(
      //   "this.stepsCombination.flowData.changeStepsArr",
      //   this.stepsCombination.flowData.changeStepsArr
      // );
      // console.log(
      //   "this.stepsCombination.parentFlowData.steps",
      //   this.stepsCombination.parentFlowData.steps
      // );
      // console.log("allSteps", allSteps);
      _.forEach(val, (p, index) => {
        _.forEach(allSteps, (S, subIndex) => {
          if (p.source == S.id) {
            result = [...result, { input: p.input, item: S }];
          }
        });
      });
      // return result;
      return _.map(
        _.uniq(
          _.map(result, item => {
            return JSON.stringify(item);
          })
        ),
        val => {
          return JSON.parse(val);
        }
      );
    },
    findPreNode(val) {
      let preLinks = _.find(this.pk.subFlowLinks, item => {
        return item.target == val;
      });
      return preLinks && this.getCurrentNode(preLinks.source);
    },
    getCurrentNode(val) {
      return _.find(
        _.concat(
          this.stepsCombination.flowData.changeStepsArr,
          this.stepsCombination.parentFlowData.steps
        ),
        (value, index) => {
          return value.id == val;
        }
      );
    },
    showDailog() {
      this.subFlowData = this.getSubFlowData(this.stepsCombination.flowData);
    },
    getSubFlowData(item) {
      return {
        ...item,
        links: item.changeLinksArr,
        steps: item.changeStepsArr
      };
    },
    //对话关闭的时候清空dom
    remove() {
      $("#designSvg").empty();
      $(".el-dialog >.jtk-endpoint").remove();
      $(".el-dialog >.jtk-connector").remove();
      $(".el-dialog >.jtk-overlay").remove();
    },
    updateSubFlowSteps(val) {
      // this.nodeSet.newName = name;
      //_this.nodeSetData.outputConfigurations[index].fields
      console.log("updateSubFlowSteps", val);

      _.forEach(this.stepsCombination.flowData.changeStepsArr, function(
        value,
        key
      ) {
        if (value.id == val.id) {
          value.outputConfigurations = val.outputConfigurations;
        }
      });
    },
    //对话打开的时候初始化dom
    inintFlowchart() {
      this.readDesign(this.stepsCombination.flowData);
      var _this = this;
      $("#designSvg").on("dblclick", ".designIconBig", function(event) {
        let currentNode = {
          left: event.currentTarget.offsetLeft,
          top: event.currentTarget.offsetTop,
          designType: $(this).attr("data-type"),
          designId: $(this).attr("data-index"),
          designText: $(this)
            .find("h4")
            .text()
        };

        //let preStepList = _this.findPreLinks(currentNode.designId);
        // if (
        //   preStepList.length == 0 ||
        //   (preStepList.length == 1 && currentNode.designType == "join") ||
        //   (preStepList.length == 1 && currentNode.designType == "minus")
        // ) {
        //   _this.$message({
        //     message: "请建立正确的连接！",
        //     type: "error"
        //   });
        //   return;
        // }
        let preStepList = _this.findPreLinks(currentNode.designId);
        console.log("preStepList", preStepList);
        $("#nodeSetDialog .el-dialog__title").text(
          currentNode.designType + " 设置"
        );

        _this.nodeSet.newName = currentNode.designText;
        _this.nodeSet.btnStatus = false;
        _this.nodeSet.dbStatus = "1";
        _this.nodeSet.flowData = {
          flowType: _this.flowType,
          steps: _.concat(
            _this.stepsCombination.flowData.changeStepsArr,
            _this.stepsCombination.parentFlowData.steps
          )
        };
        _this.nodeSet.thisNodeData = _this.getCurrentNode(currentNode.designId);
        _this.nodeSet.nodeSetVisible = true;
        //transform join starjoin

        let nodeSetTab = "";
        let inputData = "";

        switch (currentNode.designType || datamining(currentNode.designType)) {
          case "source":
          case "transform":
          case "lookup":
          case "starjoin":
          case "supplement":
          case "cache":
          case "aggregate":
          case "top":
          case "sample":
          case "filter":
          case "sql":
          case "datamining":
            nodeSetTab = [
              ..._.map(preStepList, val => {
                return {
                  title: "输入（" + val.item.name + "）",
                  name: val.input,
                  icon: "fa fa-sign-in"
                };
              }),
              ..._this.commnTab
            ];
            inputData = _.map(preStepList, val => {
              return {
                id: val.input,
                fields: _this.getFields(val.item)
              };
            });
            break;
          case "intersect":
          case "minus":
            nodeSetTab = [
              ..._.map(preStepList, val => {
                return {
                  title: "输入（" + val.item.name + "）",
                  name: val.item.name,
                  icon: "fa fa-sign-in"
                };
              }),
              {
                title: "输出",
                name: "output",
                icon: "fa fa-sign-out"
              }
            ];
            inputData = _.map(preStepList, val => {
              return {
                id: val.item.name,
                fields: _this.getFields(val.item)
              };
            });
            break;
          case "union":
            nodeSetTab = [
              ..._.map(preStepList, val => {
                return {
                  title: "输入（" + val.item.name + "）",
                  name: val.item.name,
                  icon: "fa fa-sign-in"
                };
              }),
              ..._this.commnTab
            ];
            inputData = _.map(preStepList, val => {
              return {
                id: val.item.name,
                fields: _this.getFields(val.item)
              };
            });
            break;
          case "validate":
            nodeSetTab = [
              ..._.map(preStepList, val => {
                return {
                  title: "输入（" + val.item.name + "）",
                  name: "input",
                  icon: "fa fa-sign-in"
                };
              }),
              ..._this.validateTab
            ];
            inputData = _.map(preStepList, val => {
              return { id: val.input, fields: _this.getFields(val.item) };
            });
            break;
          case "split":
          case "decision":
            nodeSetTab = [
              ..._.map(preStepList, val => {
                return {
                  title: "输入（" + val.item.name + "）",
                  name: "input",
                  icon: "fa fa-sign-in"
                };
              }),
              ..._this.splitTab
            ];
            inputData = _.map(preStepList, val => {
              return { id: val.input, fields: _this.getFields(val.item) };
            });
            break;
          case "join":
          case "productjoin":
            // let tab
            nodeSetTab = [
              ..._.map(preStepList, val => {
                return {
                  title: "" + val.input + "（" + val.item.name + "）",
                  name: val.input,
                  icon: "fa fa-sign-in"
                };
              }),
              ..._this.commnTab
            ];
            inputData = _.map(preStepList, val => {
              return {
                id: val.input,
                fields: _this.getFields(val.item)
              };
            });
            break;
          default:
        }

        _this.nodeSet = {
          ..._this.nodeSet,
          nodeSetTab: nodeSetTab,
          inputData: inputData
        };
      });
    },
    /**
     * 加载当前ID的设计视图
     * ------------------------------------------------------------------
     */
    readDesign: function(data) {
      this.flowData = data;
      //名称
      // this.flowName = data.name;
      this.nodeLength = data.changeStepsArr.length;
      //显示当前设计
      var elementSign = 0;
      var _this = this;
      var _that = jsPlumb.getInstance({});
      this.jsplumbPro = _that;

      // 连线初始化配置
      jsPlumb.ready(function() {
        // _that.setContainer("designSvg");
        var mainHTML = "";
        for (var i = 0; i < data.changeStepsArr.length; i++) {
          if (elementSign < data.changeStepsArr[i].sign) {
            //如果已经保存过,即将标记更新
            elementSign = data.changeStepsArr[i].sign;
          }
          var type = data.changeStepsArr[i].type;
          if (nodeIcon(type) == "iconTrue") {
            var designType = type;
          } else {
            var designType = "default";
          }
          function frameDesign(css) {
            mainHTML +=
              '<div  class="designIconBig ' +
              css +
              '" data-sign="' +
              data.changeStepsArr[i].name +
              '" data-index="' +
              data.changeStepsArr[i].id +
              '" data-type="' +
              data.changeStepsArr[i].type +
              '" style="left:' +
              data.changeStepsArr[i].x +
              "px;top:" +
              data.changeStepsArr[i].y +
              'px;position:absolute;margin:0" >' +
              "<div>" +
              '<i class="icon iconfont icon-ir-designIconBg designIconBg"></i>' +
              '<i id="changeSte" class="icon iconfont icon-ir-d-' +
              designType +
              '"></i>' +
              '<h4 title="' +
              data.changeStepsArr[i].name +
              '">' +
              data.changeStepsArr[i].name +
              "</h4>" +
              "<h5>ID:" +
              data.changeStepsArr[i].id +
              "</h5>" +
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
        $("#designSvg").append(mainHTML);
        //return;
        $("#designSvg .designIconBig").each(function() {
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
              { anchors: "LeftMiddle" },
              deepCopy(destination, {
                uuid: $(this).attr("data-index") + "input" + "destination"
              })
            );
          }
          _that.repaintEverything();
          _that.draggable($(this));
          $(this).draggable({
            containment: $("#designSvg")
          });
        });

        if ($("#designSvg").find(".designIconBig").length == 0) {
          _this.designStepLength = "";
        } else {
          _this.designStepLength = $("#designSvg").find(
            ".designIconBig"
          ).length;
        }
        //固定连线
        if (data.changeLinksArr == undefined || data.changeLinksArr == "") {
        } else {
          for (var i = 0; i < data.changeLinksArr.length; i++) {
            var sourceOutputName = data.changeLinksArr[i].sourceOutput;
            var targtInputName = data.changeLinksArr[i].input;
            _that.connect({
              uuids: [
                data.changeLinksArr[i].source + sourceOutputName + "origin",
                data.changeLinksArr[i].target + targtInputName + "destination"
              ]
            });
          }
        }
        // _this.flowSet.quoteDataInput = unique(_this.flowSet.quoteDataInput);
        // _this.flowSet.quoteDataParameter = unique(_this.flowSet.quoteDataParameter);
        // _this.flowSet.quoteDataOutput = unique(_this.flowSet.quoteDataOutput);
      });
    },
    /**
     * Function：获取当前的节点
     * ------------------------------------------------------------------
     */
    getDesignSteps: function() {
      this.getSteps();
      var sessionStorageSteps = JSON.parse(sessionStorage.getItem("steps"));
      var allSteps = this.stepsCombination.flowData.changeStepsArr;
      stepsFilterObj(allSteps);
      this.flowData.steps = allSteps;
      this.flowData.tenant = this.stepsCombination.flowData.tenant;
    },
    /**
     * 获取steps
     * ------------------------------------------------------------------
     */
    getSteps() {
      var steps = []; //存储元素的数组
      $("#designSvg .designIconBig").each(function() {
        steps.push({
          id: $(this).attr("data-index"),
          name: $(this).attr("data-sign"),
          type: $(this).attr("data-type"),
          x: $(this).position().left + $("#designSvg")[0].scrollLeft,
          y: $(this).position().top + $("#designSvg")[0].scrollTop,
          inputConfigurations: [],
          otherConfigurations: {},
          outputConfigurations: []
        });
      });
      sessionStorage.setItem("steps", JSON.stringify(steps));
    },
    /**
     * Function：获取当前的连接线
     * ------------------------------------------------------------------
     */
    getDesignLinks: function() {
      var _this = this;
      var links = [];
      $.each(_this.jsplumbPro.getAllConnections(), function(idx, connection) {
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
    }
  },
  created() {},
  mounted() {
    var _this = this;
    /**
     * btn-dbClick：节点设置
     * ------------------------------------------------------------------
     */
    let comp = flowNodeTypeComp(); //节点组件
    _this.flowNodeTypes = comp[_this.flowType];
  }
};
</script>

<style scoped lang="scss">
#designSvg {
  width: 100%;
  height: 80vh;
  overflow: auto;
  background: url("../../../assets/design/designBg.png");
}
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
    .designSvg {
      position: relative;
      z-index: 100;
      float: left;
      margin: 0px;
      width: 100%;
    }
  }
}
.designSvg {
  height: 100%;
  min-height: 500px;
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
</style>