<template>
  <!--部署 dialog-->
  <el-dialog
    :visible.sync="dialogDeployJobVisible"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    v-loading="loading"
    title="部署参数"
  >
    <el-form :model="deployJobForm">
      <el-form-item label="资源队列" :label-width="formLabelWidth">
        <el-input v-model="deployJobForm.queue" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="执行容器数量" :label-width="formLabelWidth">
        <el-slider
          v-model="deployJobForm.executors"
          show-input
          show-stops
          :max="maxExecutors"
          :min="0"
          :step="1"
        ></el-slider>
      </el-form-item>

      <el-form-item label="执行容器内存" :label-width="formLabelWidth">
        <el-slider
          v-model="deployJobForm['executor-memory']"
          show-input
          show-stops
          :max="maxExecutorMemory"
          :min="0"
          :step="512"
        ></el-slider>
      </el-form-item>

      <el-form-item label="执行容器并行度" :label-width="formLabelWidth">
        <el-slider
          v-model="deployJobForm['executor-cores']"
          show-input
          show-stops
          :max="12"
          :min="1"
          :step="1"
        ></el-slider>
      </el-form-item>

      <el-form-item label="驱动内存" :label-width="formLabelWidth">
        <el-slider
          v-model="deployJobForm['driver-memory']"
          show-input
          show-stops
          :max="4096"
          :min="512"
          :step="512"
        ></el-slider>
      </el-form-item>

      <el-form-item label="作业并行度" :label-width="formLabelWidth">
        <el-slider
          v-model="deployJobForm.parallelism"
          show-input
          show-stops
          :max="12"
          :min="1"
          :step="1"
        ></el-slider>
      </el-form-item>

      <el-form-item label="使用快照恢复" :label-width="formLabelWidth">
        <el-select v-model="deployJobForm['use-last-state']" style="width: 100%">
          <el-option
                  v-for="item in ['true','false']"
                  :key="item"
                  :name="item"
                  :label="item | cn"
                  :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="deployJobForm['use-last-state'] == 'true'" label="快照路径" :label-width="formLabelWidth">
        <el-input v-model="deployJobForm['last-savepoint-path']" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="deploy">提交</el-button>
      <el-button @click="dialogDeployJobVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deployJob, getClusterInfo } from "@api";
export default {
   computed: {
    saveCurrentData () {
      return this.$store.state.saveCurrentData.saveCurrentData
    },
  },
  name: "deployJobConfig",
  data() {
    return {
      dialogDeployJobVisible: false,
      deployJobForm: {
        id: "",
        //资源队列
        queue: "default",
        //执行容器数量
        executors: 2,
        //执行容器内存
        "executor-memory": 2048,
        //执行容器并行度
        "executor-cores": 4,
        //驱动内存
        "driver-memory": 1024,
        //作业并行度
        parallelism: 1,
        "use-last-state":"false",
        "last-savepoint-path":"",
      },
      formLabelWidth: "200px",
      maxExecutors: 0,
      maxExecutorMemory: 0,
      loading: false
    };
  },
  methods: {
    init: function(row) {
      //调用接口获取初始值
      getClusterInfo().then(res => {
        //获取参数值,如果其中‘当前可用处理器’或’当前可用内存‘值为0则不弹出部署dialog
        if (res.avaliableVirtualCores !== 0 && res.availableMB !== 0) {
          this.maxExecutors = res.avaliableVirtualCores;
          this.maxExecutorMemory = res.availableMB;
          this.dialogDeployJobVisible = true;
          this.deployJobForm.id = row.id;
        } else {
          this.$message({
            message: "资源不足",
            type: "error",
            duration: 1500
          });
        }
      });
    },
    //部署
    deploy: function() {
      this.loading = true;
      var id = this.deployJobForm.id;
      delete this.deployJobForm.id;
      deployJob(id, this.deployJobForm).then(
        res => {
          this.loading = false;
          //刷新列表
          this.$emit("getList",this.saveCurrentData.offset,this.saveCurrentData.limit);
          this.dialogDeployJobVisible = false;
        },
        error => {
          var err = error.response.data.err;
          this.loading = false;
          this.dialogDeployJobVisible = false;
          this.$message({
            message: err,
            type: "error",
            duration: 1500
          });
        }
      );
    }
  },
  mounted() {},
  props: {
    start: {
      type: Number
    },
    limit: {
      type: Number
    }
  }
};
</script>


<style lang="scss" scoped>
.datasetPreview {
  height: calc(100vh - 400px);
  overflow-y: auto;
}
.noData {
  text-align: center;
}
</style>
