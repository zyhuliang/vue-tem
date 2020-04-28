<template>
  <div class="list-control">
    <el-row>
      <el-col :span="24"
        ><div class="grid-content">
          <el-button @click="goBack">返回</el-button>
        </div></el-col
      >
    </el-row>
    <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in tabDData"
        :label="item.label"
        :key="index"
      >
        <component
          :is="setTemplate(item.value)"
          :data="{ row: rowData, type: item.value }"
          ref="tab"
        ></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
import log from "./tab/log";
import output from "./tab/output";
import overview from "./tab/overview";
import plan from "./tab/plan";
const Base64 = require("js-base64").Base64;
export default {
  watch: {
    // flowData(val) {
    // }
  },
  props: {
    // data: {
    //   type: Object,
    //   default: false
    // }
  },
  components: {},
  data: function() {
    return {
      tabDData: [
        { label: "概览", value: 0 },
        { label: "执行计划", value: 1 },
        { label: "日志", value: 2 },
        { label: "输出", value: 3 }
      ],
      rowData: [],
      activeName: 0
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {},
  beforeCreate() {},
  created() {
    this.rowData = JSON.parse(
      Base64.decode(decodeURIComponent(this.$route.query.row))
    );
  },
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
    goBack() {
      this.$router.go(-1);
    },
    handleClick() {
      // console.log(" handleClick(val) {", this.activeName);
      // console.log("this.$refs.tab", this.$refs.tab);
      if (this.activeName == 1) {
        this.$refs.tab[this.activeName].drawSvg();
      }

      if (this.activeName == 2) {
        this.$refs.tab[this.activeName].changeLogType(this.rowData.id);
      }
    },
    setTemplate(val) {
      switch (val) {
        case 0:
          return overview;
        case 1:
          return plan;
        case 2:
          return log;
        case 3:
          return output;
        default:
          "";
      }
    }
  }
};
</script>

<style lang="scss">
.list-control {
  .grid-content {
    text-align: right;
    padding: 0 3px;
  }
}
</style>
