<!-- steps参数 dataFlow Transform filter -->
<template>
  <div class="stepTable">
    <el-form id="bm-nodeset-filter-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
      <el-form-item label="condition">
        <el-tooltip class="item" effect="dark" content="condition" placement="top">
          <i class="parIcon el-icon-warning"></i>
        </el-tooltip>
        {{' 使用 Ctrl-Shift-Alt-I 插入字段 Ctrl-Shift-Alt-F 格式化'}}
        <ace-editor
          @getValue="getValue"
          :isUseTableName="false"
          height="150"
          :dictionaries="schemas"
          :defaultsql="nodeData.condition"
        />
        <!--<el-input v-else class="noParameter" value="未绑定动态值的参数！"></el-input>-->
      </el-form-item>
      <i class="sign" v-if="nodeData.condition==''">{{'condition'| cn}}不能为空</i>
    </el-form>
  </div>
</template>

<script>
// 编写 语句
import AceEditor from "@components/aceEditor/aceEditor";
export default {
  components: {
    AceEditor
  },
  data() {
    return {
      nodeData: {} //存放节点参数信息
    };
  },
  props: ["nodeSetData", "schemas"],
  watch: {
    nodeSetData(newValue, oldValue) {
      this.nodeData = newValue;
    }
  },
  filters: {},
  methods: {
    /**
     * conditionVal  绑定动态获取值
     * ------------------------------------------------------------------
     */
    getValue(val) {
      this.nodeData.condition = val;
      //this.$emit("modifynodeSetData", this.nodeData);
      //console.log("this.nodeData.condition", this.nodeData.condition);
      //   this.nodeData = {
      //     ...this.nodeData,
      //     condition: val
      //   };
    }
  },
  mounted() {
    this.nodeData = this.nodeSetData;

    console.log(this.nodeData);
  }
};
</script>

<style scoped>
.sign {
  margin-left: 150px;
  color: red;
  padding: 0px;
  font-size: 8px;
  font-style: normal;
}
.stepTable .el-form-item {
  margin-bottom: 0px !important;
  margin-top: 10px;
}
</style>