<!-- steps参数 dataFlow Process shell -->
<template>
  <div>
    <el-form id="bm-nodeset-shell-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
      <el-form-item :label="'workingDiretory'| cn">
        <el-tooltip class="item" effect="dark" :content="'workingDiretory'| cn" placement="top">
          <i class="parIcon el-icon-warning"></i>
        </el-tooltip>
        <el-input :value="nodeData.workingDiretory" placeholder="（必填）" @input="workingDiretoryVal"
                  name="workingDiretoryVal"></el-input>
      </el-form-item>
      <el-form-item :label="'command'| cn">
        <el-tooltip class="item" effect="dark" :content="'command'| cn" placement="top">
          <i class="parIcon el-icon-warning"></i>
        </el-tooltip>
        <el-input :value="nodeData.command" placeholder="（必填）" @input="commandVal" name="commandVal"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    components: {},
    data() {
      return {
        nodeData: {},  //存放节点参数
      }
    },
    props: ["nodeSetData"],
    watch: {
      nodeSetData: {
        handler: function (newValue, oldValue) {
          this.nodeData = newValue;
        },
        deep: true,
        immediate: true,
      },
    },
    filters: {},
    methods: {
      /**
       * workingDiretory 绑定获取值
       * ------------------------------------------------------------------
       */
      workingDiretoryVal: function (val) {
        this.nodeData.workingDiretory = val;
      },
      /**
       * command 绑定获取值
       * ------------------------------------------------------------------
       */
      commandVal: function (val) {
        this.nodeData.command = val;
      },
    },
    mounted() {
      this.nodeData = this.nodeSetData;

      console.log(this.nodeData);
    }
  }

</script>

<style scoped>

</style>