<template>
  <el-aside width="200px" class="v-el-aside">
    <!-- <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="Events" name="1">
        <div class="el-collagse-content">与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
      </el-collapse-item>
    </el-collapse>-->

    <el-collapse accordion v-model="activeNames">
      <el-collapse-item
        v-for="(drawNav, index) in stepList"
        track-by="$index"
        v-if="drawNav.thisIcon.length != '0'"
        :key="index + '-gQuery'"
        :name="index"
      >
        <template slot="title">
          <i class="icon iconfont icon-ir-supply-chain"></i>
          &nbsp;{{ drawNav.group }}
          <span
            class="iconNavNub"
          >({{ drawNav.thisIcon.length }})</span>
        </template>
        <drag
          class="designIcon"
          v-for="(drawIcon, index) in drawNav.thisIcon"
          :key="index + '-drawNav'"
          :data-index="index"
          :data-type="drawIcon.type"
          :transfer-data="{ drawIcon }"
        >
          <el-tooltip class="item" effect="dark" :content="drawIcon.name" placement="top">
            <div class="item-step-icon">
              <i :class="drawIcon.name | iconFilter"></i>
              <h4>{{ drawIcon.name }}</h4>
            </div>
          </el-tooltip>
        </drag>
      </el-collapse-item>
    </el-collapse>
  </el-aside>
</template>


<script>
import { getCepEvents } from "@/api/realtime/index.js";
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
import { nodeIcon } from "@/components/utils/flowchart";
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
  components: {},
  data: function() {
    return {
      activeNames: [0],
      gqueryTree: [],
      stepList: [],
      cnObj: {}
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {

    getCepEvents().then(res=>{
      let result=[
        {
          group:"Events",
          thisIcon:_.map(res.data,item=>{
            return{
              ...item,
              name:item.eventType
            }
          })
        }
      ];

      this.stepList=result;
      
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
    //...mapActions([""]),
    handleChange(val) {
      console.log(val);
    },
    getLeftAsideData(data, group) {
      return _.map(group, item => {
        return {
          group: item,
          thisIcon: _.compact(this.getIconData(data, item))
        };
      });
    },
    getGroupData(val) {
      return _.map(val, item => {
        return item.tags[0];
      });
    },
    getIconData(data, val) {
      return _.map(data, item => {
        if (item.tags[0] == val) {
          return item;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.v-el-aside {
  background: #fff;
  height: 100%;
  padding: 0 10px 10px 10px;

  .designIcon {
    text-align: center;
    display: inline-block;
    margin-right: 10px;

    h4 {
      // position: absolute;
      // top: 45px;
      margin: 0px;
      padding: 0px;
      font-size: 12px;
      // width: 100%;
      font-weight: normal;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    i {
      float: none !important;
      // position: absolute;
      left: 0px;
      margin: 0px;
      width: 50px !important;
      height: 50px !important;
      line-height: 50px !important;
      font-size: 40px !important;
    }
  }

  .designIcon:hover {
    color: #3895ff;
  }
  .el-collagse-content {
    padding: 0 5px;
  }
}
</style>
