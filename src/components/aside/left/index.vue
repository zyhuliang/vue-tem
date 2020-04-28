<template>
  <div class="right-aside">
    <el-collapse accordion>
      <!-- <el-collapse-item
        v-for="(drawNav,index) in common.commonStepData.dataflow"
        track-by="$index"
        v-if="drawNav.thisIcon.length != '0'"
        :key="index + '-gQuery'"
        :name="index"
      >-->
      <el-collapse-item
        v-for="(drawNav,index) in stepList"
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
        <drag
          class="designIcon"
          title="type1"
          v-for="(drawIcon,index) in drawNav.thisIcon"
          :key="index + '-drawNav'"
          :data-index="index"
          :data-type="drawIcon.type"
          :transfer-data="{ drawIcon }"
        >
          <el-tooltip class="item" effect="dark" :content="drawIcon.name| cn" placement="top">
            <div class="item-step-icon">
              <i class="icon iconfont icon-ir-designIconBg designIconBg"></i>
              <i :class="drawIcon.name | iconFilter"></i>
              <h4>{{drawIcon.name | cn}}</h4>
            </div>
          </el-tooltip>
        </drag>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import {
  nodeIcon,
  nodeClass,
  specialNodeClass,
  nodeQuote,
  nodeCache,
  nodeLinks,
  noParme
} from "@function/nodeSet";
export default {
  computed: {
    ...mapState(["pk", "common"])
  },
  props: {
    flowType: {
      type: String,
      default: "dataflow"
    },
    range: {
      type: Object,
      default: () => {}
    },
    stepList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      gqueryTree: []
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
  mounted() {
    //this.gqueryTree = this.filterGquery(this.flowType);
  },
  methods: {
    start() {
      console.log("拖动开始");
    },
    drag(ev, item) {
      //   console.log(ev);
      //   console.log(item);
      console.log("元素正在拖动");
    }
  }
};
</script>
<style lang="scss" scoped>
.right-aside {
  background: #fff;
  height: 100%;
  padding: 0 10px 10px 10px;
  .gquery-item {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 90px;
      overflow: hidden;
      text-align: center;
      margin-top: 10px;
      i {
        font-size: 35px;
      }
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>
