<template>
  <div>
    <el-table :data="tableData" style="width: 100%" height="calc(100vh - 200px)">
      <el-table-column
        :prop="item.value"
        :label="item.key"
        fit="true"
        v-for="(item,index) in column"
        :key="index"
      >
        <template slot-scope="scope">
          <div v-if="item.value == 'name'">
            <el-button type="text" @click="datasetDialog(scope.row)">{{ scope.row.name }}</el-button>
          </div>
          <div v-else-if="item.value == 'schema.name'">
            <el-button
              type="text"
              @click="schemaDialog(scope.row.schema)"
            >{{ scope.row.schema.name }}</el-button>
          </div>
          <div
            v-else-if="item.value == 'storageConfigurations.path'"
          >{{ scope.row.storageConfigurations.path }}</div>
          <div v-else>{{ scope.row[item.value]}}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click.native.prevent="dataPreview(scope.row)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--dataset详情弹出框-->
    <el-dialog
      title="dataset 详情"
      :visible.sync="dialogDatasetVisible"
      :modal-append-to-body="false"
      width="50%"
      v-loading="loading"
      id="bm-stream-jobTemplate-monitor-table"
      class="el-body-padding"
    >
      <el-form class="datasetDialog" id="bm-datasetd1-form">
        <el-form-item
          class="item"
          :label-width="formLabelWidth"
          v-for="(item, index) in datasetEntity"
          :key="item.name"
          :label="item.name"
          :prop="'datasetEntity.' + index + '.value'"
        >
          <el-input
            v-model="item.value"
            auto-complete="off"
            id="'datasetEntity.' + index + '.value'"
            name="item.name"
            :readonly="true"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDatasetVisible = false">确定</el-button>
        <el-button @click="dialogDatasetVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!--schema详情弹出框-->
    <el-dialog
      title="schema 详情"
      :visible.sync="dialogSchemaVisible"
      width="50%"
      :modal-append-to-body="false"
      class="el-body-padding"
    >
      <div class="div-schema-bady">
        <el-form :model="schemaEntity" ref="schemaEntity" id="bm-output-form">
          <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="schemaEntity.name" auto-complete="off" class="input-form" disabled></el-input>
          </el-form-item>

          <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
            <el-input
              v-model="schemaEntity.description"
              auto-complete="off"
              class="input-form"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item :label="'Schema'| cn" :label-width="formLabelWidth" prop="fields">
            <div class="div-fields-height">
              <template v-for="(field,index) in schemaEntity.fields">
                <div class="field-grope" :key="index">
                  <el-input
                    v-model="field.name"
                    :placeholder="'fields1'"
                    :class="(field.type).indexOf('decimal')== -1?'input':'input-selects'"
                    class="input"
                    disabled
                  ></el-input>
                  <el-input
                    v-model="field.type"
                    :class="(field.type).indexOf('decimal')== -1?'selects-para':'selects-para'"
                    disabled
                  ></el-input>
                </div>
              </template>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSchemaVisible = false">确定</el-button>
        <el-button @click="dialogSchemaVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!--数据预览 dialog-->
    <preview-data-set ref="dataset"></preview-data-set>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
import { queryflow } from "@/api/realtime/index.js";
//导入预览组件
import previewDataSet from "@components/collector/taskDialog/datasetDialog.vue";
import { getDataFlow } from "../../../../../store/action/dataflow";

export default {
  watch: {
    // flowData(val) {
    // }
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: { previewDataSet },
  data: function() {
    return {
      loading: false,
      formLabelWidth: "200px",
      schemaEntity: {},
      datasetEntity: [],
      dialogDatasetVisible: false,
      dialogSchemaVisible: false,
      dataFields: [], //数据集显示的详情字段
      tableData: [], //存放数据集的id
      column: [
        { key: "名称", value: "name" },
        { key: "schema", value: "schema.name" },
        { key: "类型", value: "type" },
        { key: "路径", value: "storageConfigurations.path" },
        { key: "版本", value: "version" },
        { key: "创建人", value: "creator" }
      ]
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    // console.log("type", this.data.type);
  },
  beforeCreate() {},
  created() {
    // 根据flowId获取flow的数据
    this.getFlow();
  },
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    // 获取输出step
    getSink(data) {
      return _.filter(data, function(item) {
        return item.type == "sink";
      });
    },
    // 获取flow的数据
    getFlow() {
      if (this.data.row.flowId) {
        queryflow(this.data.row.flowId).then(
          data => {
            if (data.status == 200) {
              // 获取数据集的列表
              let result = data.data;
              let sinkStep = this.getSink(result.steps);
              this.tableData = [];
              sinkStep.forEach(item => {
                this.tableData.push(item.stepSettings.datasetEntity);
              });
            }
          },
          err => {}
        );
      }
    },

    //dataset 详情弹框
    datasetDialog: function(entity) {
      //dataset部分赋值
      this.datasetEntity = [];
      var objStore = entity.storageConfigurations;
      //  构造dataset显示数据
      for (var key in entity) {
        if (typeof entity[key] !== "object") {
          this.datasetEntity.push({ name: key, value: entity[key] });
        }
      }
      for (var key in objStore) {
        this.datasetEntity.push({ name: key, value: objStore[key] });
      }
      //显示弹出框
      this.dialogDatasetVisible = true;
    },

    //schema 详情弹框
    schemaDialog: function(entity) {
      this.dialogSchemaVisible = true;
      //自己构建schema要展示的数据
      this.schemaEntity.name = entity.name;
      this.schemaEntity.description = entity.description;
      this.schemaEntity.fields = entity.fields;
    },

    //数据预览
    dataPreview: function(row) {
      this.$refs.dataset.dataPreview(
        row.id,
        row.tenantId,
        row.schemaId || row.schema.id
      );
    }
    //...mapActions([""]),
  }
};
</script>

<style lang="scss">
.datasetDialog {
  max-height: calc(100vh - 330px);
  overflow-y: auto;
  .item {
    height: 50%;
  }
}
.div-schema-bady {
  height: calc(100vh - 400px);
}
.div-fields-height {
  height: calc(80vh - 350px);
  overflow-y: auto;
  .field-grope {
    width: 350px;
    .input {
      width: 200px;
    }
    .selects-para {
      width: 145px;
    }
  }
}
</style>
