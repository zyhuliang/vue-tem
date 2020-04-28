<!-- steps参数 dataFlow IO source -->
<template>
  <div>
    <el-form
      id="bm-nodeset-source-form"
      ref="nodeSetData"
      :model="nodeSetData"
      indexMethod
      label-width="150px"
    >

    
      <el-form-item :label="'dataset' | nodeNameFilter">
        <el-tooltip
          lass="item"
          effect="dark"
          content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合"
          placement="top"
        >
          <i class="parIcon el-icon-warning"></i>
        </el-tooltip>
        <el-input
          placeholder="请选择内容"
          v-model="nodeData.dataset"
          :model="nodeData.dataset"
          :disabled="true"
          name="dataset"
        >
          <el-button
            slot="append"
            icon="icon iconfont icon-ir-search"
            @click="dataSetInq"
            name="dataSetInq"
          ></el-button>
        </el-input>
        <p class="sign" v-if="bok">选择内容不能为空</p>
      </el-form-item>
      <el-form-item label="忽略无效路径" v-show="crrentDatasetType == 'HDFS' && nodeData.datasetId">
        <el-tooltip class="item" effect="dark" content="忽略HDFS类型数据的无效Path" placement="top">
          <i class="parIcon el-icon-warning"></i>
        </el-tooltip>
        <el-switch v-model="nodeData.ignoreMissingPath" class="switch-style"></el-switch>
      </el-form-item>
    </el-form>
    <!-- 数据集查询 dialog-->
    <el-dialog
      title="数据集查询"
      :visible.sync="dialogDataSetVisible"
      :close-on-click-modal="false"
      :before-close="cancelDatasetDialog"
      :modal-append-to-body="false"
      custom-class="dialogClass"
      append-to-body
    >
      <el-form>
        <data-source-inquire
          ref="dataSourceInquire"
          @thisSelectDatasetVal="getSelectDateVal"
          rootName="dataset_dir"
        ></data-source-inquire>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataSet" name="bm-ch-step2Form-dataset-ok">确定</el-button>
        <el-button @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dataSourceInquire from "@dataSourceInq/dataSourceInquire.vue";

export default {
  components: {
    dataSourceInquire
  },
  data() {
    return {
      nodeData: {}, //存放节点内容
      bok: false,
      dialogDataSetVisible: false,
      labelPosition: "left",
      getSelvalSchemaFields: [], //存放所选数据集中的字段
      crrentDatasetType: false
    };
  },
  props: ["nodeSetData", "datasetType"], //从父组件nodeset.vue中传递过来的节点信息
  //监听节点信息
  watch: {
    // nodeSetData(newValue, oldValue) {
    //   this.nodeData = newValue; //将节点信息存放到nodeData中
    // },
    // datasetType: function(newValue, oldValue) {
    //   this.crrentDatasetType = newValue;
    // },
    nodeSetData: {
      handler: function(newValue, oldValue) {
       this.nodeData = newValue; 
      },
      deep: true,
      immediate: true,
    },
    datasetType: {
      handler: function(newValue, oldValue) {
        this.crrentDatasetType = newValue;
      },
      deep: true,
      immediate: true,
    },
    nodeData: {
      handler: function(newValue, oldValue) {
        var _this = this;
        if (!newValue.dataset) {
          newValue.dataset = "";
        }
        if (newValue.dataset == "") {
          _this.bok = true;
        } else {
          _this.bok = false;
        }

        this.$emit("modifynodeSetData",newValue)
      },
      deep: true,
      immediate: true,
    }
  },
  filters: {
    nodeNameFilter: function(value) {
      if (value == "dataset") {
        return "数据集";
      } else {
        return value;
      }
    }
  },
  methods: {
    //取消dataset的组件按钮
    cancelDatasetDialog() {
      //关闭dialog
      this.dialogDataSetVisible = false;
      //调用子组件的方法清空子组件的值
      this.$refs.dataSourceInquire.clearSelectionRow();
    },
    /**
     * dataSet 查询
     * ------------------------------------------------------------------
     */
    dataSetInq: function() {
      this.dialogDataSetVisible = true;
    },
    /**
     * 获取子组件的dataSet
     * ------------------------------------------------------------------
     */
    getSelectDateVal(data) {
      this.getSelvalDataId = data.id;
      this.getSelvalDataName = data.name;
      this.getSelvalSchemaName = data.schemaName;
      this.getSelvalSchemaId = data.schemaId;
      this.getSelvalSchemaFields = data.fields; //存放schema的字段
      this.getSelvalData = data;
      // 根据不同类型数据选择显示配置字段
      if (data.storage == "HDFS") {
        this.crrentDatasetType = "HDFS";
      } else this.crrentDatasetType = "";
    },
    /**
     * 获取dataSet 弹出框 绑定获取值（确认按钮事件）
     * ------------------------------------------------------------------
     */
    submitDataSet: function() {
      if (
        this.nodeData.datasetId &&
        this.nodeData.datasetId != "" &&
        this.nodeData.datasetId != this.getSelvalDataId
      ) {
        this.$confirm(
          "修改数据源数据集需要重新手动配置该流程其他节点的字段,确定更改数据集么?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.setDatasetParam();
          })
          .catch(() => {
            this.dialogDataSetVisible = false;
          });
      } else {
        this.setDatasetParam();
      }
    },
    setDatasetParam: function() {
      this.cancelDatasetDialog();
      this.nodeData.dataset = this.getSelvalDataName;
      this.nodeData.datasetId = this.getSelvalDataId;
      this.nodeData.schema = this.getSelvalSchemaName;
      this.nodeData.schemaId = this.getSelvalSchemaId;
      this.nodeData.datasetType = this.crrentDatasetType;

        // this.nodeData = {
        //   // ...this.nodeData,
        //   dataset: this.getSelvalDataName,
        //   datasetId: this.getSelvalDataId,
        //   schema: this.getSelvalSchemaName,
        //   schemaId: this.getSelvalSchemaId
        // };
      //选择dataSet 获取 输出字段

      var fieldsArr = JSON.stringify(this.getSelvalData.fields);
      var fieldsFilter = JSON.parse(fieldsArr);
      for (var f = 0; f < fieldsFilter.length; f++) {
        fieldsFilter[f].column = fieldsFilter[f].name;
        delete fieldsFilter[f].name;
      }
      for (var i = 0; i < fieldsFilter.length; i++) {
        fieldsFilter[i].alias = "";
      }
      this.$emit("sourceOutput", fieldsFilter);

      //console.log("this.nodeData", this.nodeData);
      // this.$emit("modifynodeSetData",this.nodeData);
    }
  },
  created() {
    this.nodeData = this.nodeSetData;
    if (this.nodeData.ignoreMissingPath == undefined) {
      this.$set(this.nodeData, "ignoreMissingPath", false);
    }
  }
};
</script>

<style scoped>
.sign {
  margin: 0px;
  color: red;
  padding: 0px;
  font-size: 8px;
}
</style>