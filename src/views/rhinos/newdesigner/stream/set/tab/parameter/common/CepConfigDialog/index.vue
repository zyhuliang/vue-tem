<template>
  <div class="cep-config-dialog">
    <!-- <el-dialog
      title="设置"
      :visible.sync="dialogFormVisible"
      @closed="closeDialog"
        custom-class="dialogClass"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <div class="cep-config-dialog-content">
        dgdfgdfgdfg
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>-->
    <div class="cep-config-dialog-content">
      <el-container>
        <!-- <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
        <el-aside width="300px" style="padding-left:10px">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="画布设置" name="first" height="100%">
              <div class="tab-content">画布设置</div>
            </el-tab-pane>
            <el-tab-pane label="节点设置" name="sec">
              <div class="tab-content">节点设置</div>
            </el-tab-pane>
          </el-tabs>
        </el-aside>-->
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
