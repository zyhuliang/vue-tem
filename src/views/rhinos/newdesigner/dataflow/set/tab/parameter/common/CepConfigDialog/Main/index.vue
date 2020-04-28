<template>
  <el-main class="v-el-main-cep">
    <drop class="drop-workplace" @drop="handleDrop" id="workplace-sub">
      <jsplumbchartsub
        :data="{
                steps: steps,
                links: links,
                container: 'workplace-sub',
                nodeType:'cepNode',
                jsPlumb: jsPlumb
              }"
        @modifyChart="modifyChart"
        @handleDrop="handleDrop"
        ref="jsplumbchart"
      ></jsplumbchartsub>
    </drop>
  </el-main>
</template>


<script>
import jsplumbchartsub from "./flowchart/index";
import * as jsPlumb from "@static/jsPlumb/jsPlumb-2.2.3-min";
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
  watch: {
    "realtime.parametDataCep"(val) {
      ///console.log('"realtime.parametDataCep"(val) {', val);
      this.$nextTick(() => {
        this.steps = _.map(this.steps, item => {
          if (item.id == val.id) {
            return {
              eventType: item.eventType,
              isSelected: item.isSelected,
              x: item.x,
              y: item.y,
              ...val
            };
          } else {
            return item;
          }
        });
      });
    },
    "realtime.FLOW_CEP_DATA_STATA"(val) {
      this.steps = val.events;
      this.links = val.links;
    }
  },
  props: {
    // data: {
    //   type: Object,
    //   default: false
    // }
  },
  components: { jsplumbchartsub },
  data: function() {
    return {
      // flowData: [],
      links: [],
      steps: [],
      jsPlumb: jsPlumb
    };
  },
  computed: {
    ...mapState(["realtime"])
  },
  mounted() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  // updated() {
  // },
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    ...mapActions(["FLOW_CEP_DATA_ACTION"]),
    getCurrentNode(data) {
      return {
        id: data.drawIcon.eventType + "_cep_" + (this.steps.length + +1),
        name: data.drawIcon.name,
        type: data.drawIcon.eventType,
        x: event.offsetX,
        y: event.offsetY
      };
    },
    modifyChart(val) {
      console.log(" modifyChart(val) { Main", val);
      this.steps = val.stepData;
      this.links = val.links;
      this.FLOW_CEP_DATA_ACTION({
        ...this.realtime.FLOW_CEP_DATA_STATA,
        events: this.steps,
        links: this.links
      });
    },
    handleDrop(val) {
      this.steps.push({
        ...val.drawIcon,
        id: val.drawIcon.eventType + "_cep_" + (this.steps.length + +1),
        x: event.offsetX,
        y: event.offsetY
      });
    }
  }
};
</script>

<style lang="scss">
.v-el-main-cep {
  //background: url("../../../assets/design/designBg.png");
  background: url("../../../../../assets/design/designBg.png");
  .drop-workplace {
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
