<template>
  <div class="cep-config-dialog">
    <div class="cep-config-dialog-content">
      <el-container>
        <vasideleft></vasideleft>

        <vmain></vmain>
        <vasideright></vasideright>
      </el-container>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
import vasideleft from "./Aside/left/index";
import vasideright from "./Aside/right/index";
import vmain from "./Main/index";
export default {
  watch: {
    data(val) {
      this.dialogFormVisible = val.dialogCepFormVisible;
    }
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: {
    vasideleft,
    vasideright,
    vmain
  },
  data: function() {
    return {
      dialogFormVisible: false
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
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    ...mapActions(["setStepDailogDataOption"]),
    closeDialog() {
      // this.setStepDailogDataOption({
      //   ...this.realtime.stepDialogDataOption,
      //   dialogVisible: true
      // });
    },
    showdrawer() {
      this.table = true;
    }
  }
};
</script>

<style lang="scss">
.cep-config-dialog {
  overflow: auto;
  max-height: 700px;
  height: 600px;
  .cep-config-dialog-content {
    height: 100%;
    .el-container {
      // height: calc(100% - 45px) !important;
      height: 100%;
    }

    .el-aside {
      // background-color: #d3dce6;
      color: #333;
      text-align: center;
      position: relative;
    }

    .el-main {
      background-color: #e9eef3;
    }

  }
}
</style>
