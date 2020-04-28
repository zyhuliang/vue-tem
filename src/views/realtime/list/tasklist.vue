<template>
  <div class="real-time-list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :label="item.label"
        :name="item.value"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
    <el-input
      placeholder="请输入Execution"
      v-model="searchInput"
      @keyup.enter.native="searchKeyup"
      class="condition"
      name="seachInput"
    >
      <el-button
        slot="append"
        @click="searchKeyup"
        icon="icon iconfont icon-ir-search"
        name="searchTable"
      ></el-button>
    </el-input>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      height="calc( 100vh - 175px )"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in tableHead"
        :key="index"
        :prop="item.prop"
        :width="item.prop == 'name' ? '400px' : ''"
        :label="item.label"
        sortable="custom"
      >
        <template slot-scope="scope">
          <div v-if="item.prop != 'statusType'">
            <div v-show="item.prop != 'flowName' && item.prop != 'name'">{{ scope.row[item.prop] }}</div>
            <div v-show="item.prop == 'flowName'">
              <router-link
                :to="{
                  path: '/realtime/editor',
                  query: { id: scope.row.flowId }
                }"
              >{{ scope.row[item.prop] }}</router-link>
            </div>
            <div v-show="item.prop == 'name'">
              <router-link
                :to="{
                  path: '/realtime/list/control',
                  query: { row: control(scope.row) }
                }"
              >{{ scope.row[item.prop] }}</router-link>
            </div>
          </div>
          <div v-else>
            <el-button
              size="mini"
              :type="setStatusType(scope.row[item.prop]).type"
            >{{ setStatusType(scope.row[item.prop]).label }}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250px">
        <template slot-scope="scope">
          <el-button
            v-if="activeName!='READY'&&activeName!='RUNNING'"
            type="primary"
            size="small"
            @click.native.prevent="
              start({
                id: scope.row.id,
                type: '',
                row:scope.row
              })
            "
          >{{ setBtnStatus("").label }}</el-button>
          <el-button
            v-if="setBtnStatus(scope.row.statusType).disabled"
            type="primary"
            size="small"
            v-show="activeName!='READY'"
            @click.native.prevent="
              start({
                id: scope.row.id,
                type: setBtnStatus(scope.row.statusType).type
              })
            "
          >{{ setBtnStatus(scope.row.statusType).label }}</el-button>
          <el-button
            v-else
            disabled
            type="primary"
            size="small"
            v-show="activeName!='RUNNING'"
            @click.native.prevent="
              start({
                id: scope.row.id,
                type: setBtnStatus(scope.row.statusType).type
              })
            "
          >{{ setBtnStatus(scope.row.statusType).label }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click.native.prevent="snapshot(scope.row.id)"
            v-show="activeName!='READY'&&activeName!='FAILED'&&activeName!='STOPPED'"
          >快照</el-button>
          <el-button
            type="danger"
            size="small"
            @click.native.prevent="deleteRow(scope.row)"
            v-show="activeName!='READY'||activeName!='DEPLOY'"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage+1"
      :page-sizes="[8, 16, 50, 100]"
      :page-size="limit"
      :total="totalElements"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <!-- 恢复设置 -->
    <el-dialog
      :title="'恢复设置'"
      :visible.sync="editJsondialogVisible"
      width="70%"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-dialog-drag
      @opened="openedDialogjson"
      custom-class="dialogClass-json"
    >
      <resetform
        :data="{resetformdata:resetformdata,formItemList:formItemList,adformItemList:adformItemList}"
        ref="resetform"
      ></resetform>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editNodeJson">确 定</el-button>
        <el-button @click="editJsondialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import resetform from "./resetform/index";
import allformItemList from "./resetform/data/index.json";
import {
  listexecutions,
  delexecutions,
  executionsStart,
  executionsStop,
  savepoint,
  executionRestore
} from "@/api/realtime/index.js";
import {
  timeDifference,
  parseParams,
  deleteEmptyProperty
} from "@/components/utils/index";
import { getExecutionsIndex } from "@api";
import moment from "moment"; //时间格式化
import { map } from "lodash";
const Base64 = require("js-base64").Base64;

export default {
  components: {
    resetform
  },
  data: function() {
    return {
      resetrowitem: {},
      adformItemList: [],
      formItemList: [],
      resetformdata: {},
      editJsondialogVisible: false,
      activeName: "RUNNING",
      loading: true,
      tableHead: [
        // { label: "ID", prop: "id" },
        { label: "名称", prop: "name" },
        { label: "流程", prop: "flowName" },
        { label: "部署时间", prop: "createTimeformat" },
        { label: "运行时长", prop: "interval" },
        { label: "状态", prop: "statusType" }
      ],
      tableData: [],
      limit: 8,
      currentPage: 0,
      pagesize: 8,
      totalElements: 20,
      multipleSelection: "",
      dateValue: [],
      searchInput: "",
      label: ["运行中(20)", "就绪(20)", "成功(20)", "失败(30)"],
      tabList: []
    };
  },
  computed: {},
  mounted() {
    // 获取数量数据
    getExecutionsIndex().then(res => {
      let list = [
        { label: "就绪", value: "READY" },
        { label: "部署", value: "DEPLOY" },
        { label: "运行", value: "RUNNING" },
        { label: "成功", value: "SUCCEEDED" },
        { label: "失败", value: "FAILED" },
        { label: "停止", value: "STOPPED" },
        { label: "杀死", value: "KILLED" },
        { label: "未知", value: "UNKNOWN" }
      ];
      list.forEach(item => {
        let tmpLabel =
          item.label + "(" + (res[item.value] ? res[item.value] : "0") + ")";
        this.tabList.push({ value: item.value, label: tmpLabel });
      });
    });

    this.getList(
      parseParams(
        deleteEmptyProperty({
          page: this.currentPage,
          limit: this.limit,
          statusType: this.activeName,
          nameOrId: this.searchInput
        })
      )
    );
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    editNodeJson() {
      let formData = {
        ...this.$refs.resetform.form,
        runtimeSettings: this.$refs.resetform.runtimeSettings,
        checkpointSettings: this.$refs.resetform.checkpointSettings,
        restartStrategySettings: this.$refs.resetform.restartStrategySettings,
        latencyTrackingSettings: this.$refs.resetform.latencyTrackingSettings
      };

      delete formData.name;
      delete this.resetrowitem.createTimeformat;

      executionRestore({
        id: this.resetrowitem.id,
        body: { ...this.resetrowitem, settings: formData }
      }).then(
        res => {
          if (res.status == 204) {
            this.editJsondialogVisible = false;
            this.getList(
              parseParams(
                deleteEmptyProperty({
                  page: this.currentPage,
                  limit: this.limit,
                  statusType: this.activeName
                })
              )
            );
          }
        },
        err => {
          this.$message.error(err.response.data.err);
        }
      );
    },
    openedDialogjson() {
      this.resetformdata = {
        name: this.resetrowitem.name,
        ...this.resetrowitem.settings
      };
      this.formItemList = allformItemList.formItemList;
      this.adformItemList = allformItemList.adformItemList;
    },
    control(val) {
      return encodeURIComponent(Base64.encode(JSON.stringify(val)));
    },
    snapshot(val) {
      savepoint(val).then(res => {
        if (res.status == 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getList(
            parseParams(
              deleteEmptyProperty({
                page: this.currentPage,
                limit: this.limit,
                statusType: this.activeName
              })
            )
          );
        }
      });
    },
    format(val) {
      return moment(val).format("YYYY-MM-DD h:mm:ss");
    },
    deleteRow(val) {
      this.$confirm("此操作将永久删除该, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delexecutions(val.id).then(
            data => {
              if (data.status == 204) {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });

                this.getList(
                  parseParams(
                    deleteEmptyProperty({
                      page: this.currentPage,
                      limit: this.limit,
                      statusType: this.activeName
                    })
                  )
                );
              }
            },
            err => {
              this.$message({
                message: err.response.message,
                type: "error",
                duration: 1500
              });
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleClick(tab, event) {
      this.currentPage = 0;
      this.getList(
        parseParams(
          deleteEmptyProperty({
            page: this.currentPage,
            limit: this.limit,
            statusType: this.activeName
          })
        )
      );
    },
    getList(val) {
      listexecutions(val).then(res => {
        this.totalElements = res.data.totalElements;
        this.tableData = _.map(res.data.content, item => {
          return {
            ...item,
            createTimeformat: this.format(item.createTime),
            interval: timeDifference(item.createTime, moment())
          };
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getList(
        parseParams(
          deleteEmptyProperty({
            page: this.currentPage,
            limit: this.limit,
            statusType: this.activeName
          })
        )
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val - 1;
      this.getList(
        parseParams(
          deleteEmptyProperty({
            page: this.currentPage,
            limit: this.limit,
            statusType: this.activeName
          })
        )
      );
    },
    addFlow() {},
    handledateValue() {},
    searchTable() {},
    start(val) {
      if (val.type == "start") {
        executionsStart(val.id).then(res => {
          if (res.status == 204) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getList(
              parseParams(
                deleteEmptyProperty({
                  page: this.currentPage,
                  limit: this.limit,
                  statusType: this.activeName
                })
              )
            );
          }
        });
      }

      if (val.type == "stop") {
        this.$confirm("此操作将停止运行, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          executionsStop(val.id).then(res => {
            if (res.status == 204) {
              this.$message({
                message: "操作成功",
                type: "success"
              });

              this.getList(
                parseParams(
                  deleteEmptyProperty({
                    page: this.currentPage,
                    limit: this.limit,
                    statusType: this.activeName
                  })
                )
              );
            }
          });
        });
      }

      if (!val.type) {
        this.resetrowitem = val.row;
        this.editJsondialogVisible = true;
      }
    },
    setStatusType(val) {
      switch (val) {
        case "RUNNING":
          return { label: "运行", type: "primary" };
        case "UNKNOWN":
          return { label: "未知", type: "info" };
        case "FAILED":
          return { label: "失败", type: "danger" };
        case "SUCCEEDED":
          return { label: "成功", type: "primary" };
        case "KILLED":
          return { label: "杀死", type: "danger" };
        case "READY":
          return { label: "就绪", type: "primary" };
        case "DEPLOY":
          return { label: "部署", type: "warning" };
        case "STOPPED":
          return { label: "停止", type: "info" };
        default:
          "";
      }
    },

    setBtnStatus(val) {
      switch (val) {
        case "FAILED":
        case "KILLED":
        case "STOPPED":
          return { label: "启动", disabled: true, type: "start" };
        case "UNKNOWN":
        case "READY":
        case "SUCCEEDED":
        case "RUNNING":
          return { label: "停止", disabled: true, type: "stop" };
        case "DEPLOY":
          return { label: "启动", disabled: false, type: "" };
        default:
          return { label: "恢复", disabled: false, type: "" };
      }
    },
    searchKeyup() {
      this.getList(
        parseParams(
          deleteEmptyProperty({
            page: this.currentPage,
            limit: this.limit,
            statusType: this.activeName,
            nameOrId: this.searchInput
          })
        )
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.real-time-list {
  .newflle {
    width: 60px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
    text-align: center;
    float: right;
    margin: 5px 30px;
  }
  .iconStyle {
    font-size: 13px;
  }
  padding: 0 10px;

  .condition {
    width: 20%;
    margin-bottom: 5px;
  }
}
</style>
