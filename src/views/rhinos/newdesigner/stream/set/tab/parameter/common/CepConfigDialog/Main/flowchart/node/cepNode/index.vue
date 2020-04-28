<template>
  <div class="flowchart-cep-node" id="flowchart-cep-node">
    <div
      v-for="(data,index) in stepData"
      :id="data.id"
      :key="index"
      :class="setNodeStyle(data.eventType)"
      :data-sign="data.name"
      :data-type="data.eventType"
      :style="'left:'+data.x+'px;top:'+data.y+'px;position:absolute;margin:0'"
      @click="dblClick(data)"
      @mousedown="selectCurrentStep(data)"
    >
      <span v-show="data.eventType=='StartEvent'">开始121</span>
      <span v-show="data.eventType=='ConditionEvent'">条件</span>

      <div v-show="data.isSelected" class="resize top"></div>
      <div v-show="data.isSelected" class="resize left"></div>
      <div v-show="data.isSelected" class="resize bottom"></div>
      <div v-show="data.isSelected" class="resize right"></div>
    </div>
  </div>
</template>


<script>
import { getEventsSetting } from "@/api/realtime/index.js";
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
import { setClass, nodeClass, nodeIcon } from "../../utils/flowchart";
export default {
  watch: {
    data(val) {
      this.stepData = val.stepData;
    },
    stepData(val) {
      // this.currentSelectStepAction(
      //   _.find(val, item => {
      //     return item.isSelected;
      //   })
      // );

      this.$emit("modifyStepData", { steps: val });
    }
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  components: {},
  data: function() {
    return {
      stepData: [],
      nodeClass: nodeClass,
      nodeIcon: nodeIcon,
      setClass: setClass
    };
  },
  computed: {
    //...mapState([""])
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
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    ...mapActions(["currentSelectStepAction"]),
    delNode(val) {
      this.$emit("delNode", val);
    },
    dblClick(val) {
      //this.$emit("dblClick", val);
      //getEventsSetting({ event: val.type });

      this.currentSelectStepAction(val);

      // this.currentSelectStepAction(
      //   _.find(this.stepData, item => {
      //     return item.id==val.id;
      //   })
      // );
    },
    copyNode(val) {
      this.$emit("copyNode", val);
    },
    setLineSplit(step) {},
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
    delAllselected(data) {
      this.stepData = _.filter(data, item => {
        return !item.isSelected;
      });

      // this.$emit("modifyStepData", { steps: this.stepData });
    },
    mousedownBody(event) {
      if (this.mouserOverConnect) {
        return;
      }

      this.stepData = _.map(this.stepData, item => {
        delete item.isSelected;
        return item;
      });
    },
    initEvent() {
      // document.getElementById("flowchart-cep-node").onmousedown = e => {
      //   this.mousedownBody(e);
      // };


      // delete node
      document.onkeydown = e => {
        if (e.keyCode == 46) {
          this.delAllselected(this.stepData);
        }
      };
    }
  }
};
</script>

<style lang="scss">
.flowchart-cep-node {
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
</style>
