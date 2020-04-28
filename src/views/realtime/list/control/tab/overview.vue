<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="key" label="属性名" fit="true"> </el-table-column>
      <el-table-column prop="value" label="属性值" fit="true">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
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
  components: {},
  data: function() {
    let row = this.data.row;
    return {
      tableData: [
        { key: "任务ID", value: row.id }, // id
        { key: "任务名称", value: row.name }, // name
        { key: "流程ID", value: row.flowId }, // flowId
        { key: "流程名称", value: row.flowName }, // flowName
        { key: "运行状态", value: row.statusType }, // statusType
        { key: "启动时间", value: row.createTime }, // createTime
        { key: "运行时长", value: row.interval }, // interval
        { key: "Yarn Application ID", value: row.appId }, //appId
        { key: "Flink Job ID", value: row.jobId }, //jobId
        { key: "读取数据数", value: "" },
        { key: "读取数据量(字节)", value: "" },
        { key: "写出数据数", value: "" },
        { key: "写出数据量(字节)", value: "" },
        { key: "最新快照路径", value: row.savepoint } //savepoint
      ]
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    // console.log("type", this.data.type);
    // console.log("row", this.data.row);

    let data = _.concat(
      this.data.row.extraConfigurations,
      this.data.row.properties
    );

    _.forEach(data, item => {
      this.tableData = [
        ...this.tableData,
        { key: item.name, value: item.value }
      ];
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
  }
};
</script>

<style lang="scss"></style>
