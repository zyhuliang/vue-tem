<template>
  <div class="jsplumb-chart">
    <div class="cavansClass" id="cavans-sub">
      <!-- <cepNode
        :data="{stepData:stepData}"
        @modifyStepData="modifyStepData"
        v-show="nodeType=='cepNode'"
      ></cepNode>-->

      <!-- <div
        v-for="(data,index) in stepData"
        :id="data.id"
        :key="index"
        :class="setNodeStyle(data.eventType)"
        :data-sign="data.name"
        :data-type="data.eventType"
        :style="'left:'+data.x+'px;top:'+data.y+'px;position:absolute;margin:0'"
        @dblclick="dblClick(data)"
        @mousedown="selectCurrentStep(data)"
      >-->
      <div
        v-for="(data,index) in stepData"
        :id="data.id"
        :key="index"
        :class="setNodeStyle(data.eventType)"
        :data-sign="data.name"
        :data-type="data.eventType"
        :style="'left:'+data.x+'px;top:'+data.y+'px;position:absolute;margin:0'"
        @dblclick="dblClick(data)"
      >
        <span v-show="data.eventType=='StartEvent'">开始</span>
        <span v-show="data.eventType=='ConditionEvent'">条件</span>

        <!-- <div v-show="data.isSelected" class="resize top"></div>
        <div v-show="data.isSelected" class="resize left"></div>
        <div v-show="data.isSelected" class="resize bottom"></div>
        <div v-show="data.isSelected" class="resize right"></div>-->

        <div v-show="data.id==currentSelectStep.id" class="resize top"></div>
        <div v-show="data.id==currentSelectStep.id" class="resize left"></div>
        <div v-show="data.id==currentSelectStep.id" class="resize bottom"></div>
        <div v-show="data.id==currentSelectStep.id" class="resize right"></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions, mapState } from "vuex";
import getInstance from "./utils/getInstance";
import _ from "lodash";
import flowchartNode from "./node/flowchatNode/index";
// import cepNode from "./node/cepNode/index";
import {
  message,
  filterLinkData,
  nodeClass,
  nodeIcon,
  specialNodeClass,
  origin,
  destination,
  addEndpointToNode,
  getNodeType,
  setClass,
  connect
} from "./utils/flowchart";

export default {
  watch: {
    data(val) {
      // console.log(" data(val) {");
      this.stepData = this.data.steps;
      this.links = this.data.links;
      // this.nodeType = this.data.nodeType;
    },
    "realtime.currentSelectStep"(val) {
      this.currentSelectStep = val;
    },
    links(val) {
      this.$emit("modifyChart", { stepData: this.stepData, links: val });
    }
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: {
    flowchartNode
    // cepNode
  },
  data: function() {
    return {
      jsplumbInstance: getInstance({
        // container: "workplace",
        container: this.data.container,
        delConnections: this.delConnections,
        completedConnect: this.completedConnect,
        connectionDrag: this.connectionDrag,
        jsPlumb: this.data.jsPlumb
      }),
      stepData: [],
      links: [],
      nodeType: "",
      currentSelectStep: {}
    };
  },
  computed: {
    ...mapState(["realtime"])
  },
  mounted() {
    this.$nextTick(() => {
      this.initEvent();
    });
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    this.$nextTick(() => {
      //console.log('document.getElementById("cavans-sub")',document.getElementById("cavans-sub").childNodes);
      // this.removChildNodes();
      this.drawJsplumbChart(
        {
          jsplumbInstance: this.jsplumbInstance,
          self: this,
          flowData: this.stepData,
          links: this.links
        },
        () => {
          this.getLinksData();
          // this.IS_FLOW_CEP_LINK_ADD_ACTION(false);
          this.$emit("modifyChart", { stepData: this.stepData, links: this.links });
        },
        this.connecting
      );
    });
  },
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    ...mapActions(["currentSelectStepAction", "IS_FLOW_CEP_LINK_ADD_ACTION"]),
    initEvent() {
      // delete node
      document.onkeydown = e => {
        if (e.keyCode == 46) {
          this.delAllselected(this.stepData);
        }
      };
    },
    delAllselected(data) {
      this.stepData = _.filter(data, item => {
        return item.id != this.currentSelectStep.id;
      });

      this.currentSelectStepAction({});
    },
    selectCurrentStep(val) {
      this.stepData = _.map(this.stepData, item => {
        if (val.id == item.id) {
          return {
            ...item,
            isSelected: true
          };
        } else {
          if (!this.mulSelect) {
            delete item.isSelected;
          }

          return item;
        }
      });
    },
    selectCurrentStepAfter(val, callback) {
      this.stepData = _.map(this.stepData, item => {
        if (val.id == item.id) {
          return {
            ...item,
            isSelected: true
          };
        } else {
          if (!this.mulSelect) {
            delete item.isSelected;
          }

          return item;
        }
      });
      callback();
    },
    dblClick(val) {
      this.currentSelectStepAction(val);
    },
    setNodeStyle(val) {
      switch (val) {
        case "StartEvent":
          return "circle";
        case "ConditionEvent":
          return "diamond";
        default:
          "";
      }
    },
    drawJsplumbChart(data, connectCallback, connecting) {
      addEndpointToNode(
        data.jsplumbInstance,
        data.self,
        data.flowData,
        val => {
          this.stepData = _.map(this.stepData, item => {
            if (item.id == val.id) {
              return {
                ...item,
                x: val.x,
                y: val.y
              };
            } else {
              return item;
            }
          });
        },
        _
      );
      connect(
        data.jsplumbInstance,
        data.self,
        data.links,
        connectCallback,
        connecting
      );
    },
    completedConnect(c) {
      let connLabel = this.getValueByLabel(
        c.connection.getOverlay("label").getLabel()
      );

      let currentConnection = this.getBeforeLinks(
        c.connection.sourceId,
        c.connection.targetId
      );

      if (currentConnection) {
        this.setLinkStyle(c.connection, currentConnection.linkStrategy);
      }

      c.connection
        .getOverlay("label")
        .setLabel(
          this.getLabelByValue(
            currentConnection
              ? currentConnection.linkStrategy
              : this.realtime.flowCepLinksStyle
          )
        );

      this.getLinksData(c);
    },
    getLabelByValue(val) {
      switch (val) {
        case "NEXT":
          return "紧邻";
        case "FOLLOWED_BY":
          return "相近";

        case "FOLLOWED_BY_ANY":
          return "任意";
        case "NOT_NEXT":
          return "不要紧邻";
        case "NOT_FOLLOWED_BY":
          return "不要相近";

        default:
          "";
      }
    },
    getValueByLabel(val) {
      switch (val) {
        case "紧邻":
          return "NEXT";
        case "相近":
          return "FOLLOWED_BY";

        case "任意":
          return "FOLLOWED_BY_ANY";
        case "不要紧邻":
          return "NOT_NEXT";
        case "不要相近":
          return "NOT_FOLLOWED_BY";

        default:
          "";
      }
    },
    connecting(linkStrategy) {
      return linkStrategy;
      //console.log("connecting(linkStrategy){", linkStrategy);

      // c.connection
      //   .getOverlay("label")
      //   .setLabel(this.getLabelByValue(linkStrategy));
    },
    setLinkStyle(c, currenLinksStyle) {
      //紧邻 default style

      //相近
      if (currenLinksStyle == "FOLLOWED_BY") {
        // c.canvas.classList.add("style:stroke: darkblue;");
        c.canvas.classList.add("FOLLOWED_BY");
      }

      //       任意
      // FOLLOWED_BY_ANY

      if (currenLinksStyle == "FOLLOWED_BY_ANY") {
        c.canvas.classList.add("FOLLOWED_BY_ANY");
      }
      // 不要紧邻
      // NOT_NEXT

      if (currenLinksStyle == "NOT_NEXT") {
        c.canvas.classList.add("NOT_NEXT");
      }
      // 不要相近
      // NOT_FOLLOWED_BY

      if (currenLinksStyle == "NOT_FOLLOWED_BY") {
        c.canvas.classList.add("NOT_FOLLOWED_BY");
      }
    },
    connectionDrag(c) {
      this.IS_FLOW_CEP_LINK_ADD_ACTION(true);
      let currenLinksStyle = this.realtime.flowCepLinksStyle;
      this.setLinkStyle(c, currenLinksStyle);
    },
    delConnections(val, fn) {
      fn();
      this.getLinksData();
    },
    getLinksData(c) {
      this.links = _.map(this.jsplumbInstance.getAllConnections(), item => {
        let currentConnection = this.getBeforeLinks(
          item.sourceId,
          item.targetId
        );

        return {
          name: item.id,
          source: item.sourceId,
          target: item.targetId,
          linkStrategy: this.getValueByLabel(
            item.getOverlay("label").getLabel()
          )
        };
      });
    },
    getBeforeLinks(sourceId, targetId) {
      return _.find(this.data.links, item => {
        return item.source == sourceId && item.target == targetId;
      });
    },
    reset() {
      this.modifyStepData({ stepData: [], links: [] });
    },
    modifyStepData(val) {
      this.$emit("modifyChart", { stepData: val.steps, links: this.links });
    }
  }
};
</script>

<style lang="scss">
.jsplumb-chart {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: absolute;

  // .aLabel {
  //   background-color: white;
  //   opacity: 0.8;
  //   padding: 0.3em;
  //   border-radius: 0.5em;
  //   // border: 1px solid #346789;
  //   cursor: pointer;
  // }

  // 相近
  .FOLLOWED_BY {
    //stroke: darkblue;
    stroke-dasharray: 20;

    //fill: red
  }

  // 任意
  .FOLLOWED_BY_ANY {
    stroke-dasharray: 10;
    //color: aqua !important;
  }

  // 不要紧邻
  .NOT_NEXT {
    stroke-dasharray: 15;
    //color: beige;
  }

  // 不要相近
  .NOT_FOLLOWED_BY {
    stroke-dasharray: 5;
    //color: darkkhaki;
  }

  .cavansClass {
    height: 100%;
    width: 100%;
    position: relative;

    .circle {
      background-image: url(./images/circle.png);
      width: 75px;
      height: 75px;
      line-height: 75px;
      background-size: 100%;
      cursor: pointer;
      text-align: center;
    }
    .diamond {
      background-image: url(./images/diamond.png);
      width: 75px;
      height: 75px;
      line-height: 75px;
      background-size: 100%;
      cursor: pointer;
      text-align: center;
    }

    .resize {
      width: 8px;
      height: 8px;
      background-color: #ddd;
      border: 1px solid #000;
      position: absolute;
      &.left {
        top: 50%;
        left: -4px;
        cursor: ew-resize;
      }
      &.right {
        top: 50%;
        right: -4px;
        cursor: ew-resize;
      }
      &.top {
        top: -4px;
        left: 50%;
        margin-left: -4px;
        cursor: ns-resize;
      }
      &.bottom {
        bottom: -4px;
        left: 50%;
        margin-left: -4px;
        cursor: ns-resize;
      }
    }
  }
}
</style>
