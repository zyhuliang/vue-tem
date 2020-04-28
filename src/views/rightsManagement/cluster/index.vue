<template>
  <div class="real-time-list">
    <div style="padding: 5px 10px 5px 7px">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6"
          ><div class=" bg-purple-left">
            <el-input
              placeholder="请输入名称"
              v-model="searchInput"
              @keyup.enter.native="searchKeyup"
              class="input-with-search"
              name="seachInput"
            >
              <el-button
                slot="append"
                @click="searchTable"
                icon="icon iconfont icon-ir-search"
                name="searchTable"
              ></el-button>
            </el-input></div
        ></el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <el-button @click="handlClick(0)">启用</el-button>
            <el-button @click="handlClick(1)">停止</el-button>
            <el-button @click="handlClick(2)">注册</el-button>
            <el-button @click="handlClick(3)">删除</el-button>
          </div></el-col
        >
      </el-row>
    </div>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      height="calc( 100vh - 175px )"
      style="width: 100%"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        sortable="custom"
      >
       <template slot-scope="scope">
         <p style="color: #409eff;cursor: pointer;" v-if="scope.row.dfCount>0" @click="dialogDetailed(scope.row)">{{scope.row.name}}</p>
         <span v-else>{{scope.row.name}}</span>
       </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableHead"
        v-if = "item.prop!='name'"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row[item.prop] }}
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.row)"
            type="text"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      :total="tableData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 16, 50, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <clusterDialog :data="dialogData" @getList="getList"></clusterDialog>
    <clusterDetailed :data="detailedData"></clusterDetailed>
  </div>
</template>

<script>
import {
  clusterinfo,
  clusterAll,
  createCluster,
  listCluster,
  disableCluster,
  enableCluster,
  removeCluster
} from "@/api/cluster/index.js";
import moment from "moment"; //时间格式化

import { parseParams, deleteEmptyProperty } from "@/components/utils/index";
import { map } from "lodash";

import clusterDialog from "./clusterDialog/index";
import clusterDetailed from "./clusterDetailed/index";
import { throwStatement } from "@babel/types";

export default {
  components: {
    clusterDialog,
    clusterDetailed
  },
  data: function() {
    return {
      loading: true,
      tableHead: [
        // { label: "ID", prop: "id" },
        { label: "名称", prop: "name" },
        { label: "创建时间", prop: "createTime" },
        { label: "修改时间", prop: "lastModifiedTime" },
        { label: "livy地址", prop: "livyUrl" },
        { label: "HDFS地址", prop: "hdfsUrl" },
        { label: "dfCount", prop: "dfCount" },
        { label: "状态", prop: "enabled" }
      ],
      tableData: [],
      limit: 8,
      offset: 0,
      currentPage: 1,
      pagesize: 8,
      totalElements: 20,
      multipleSelection: "",
      dateValue: [],
      searchInput: "",
      dialogFormVisible: false,
      dialogData: {},
      dialogDetailedVisible: false,
      detailedData:{}
    };
  },
  mounted() {
    this.getList({ params: { offset: this.offset, limit: this.limit } });
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    handlClick(val) {
      if (this.multipleSelection.length == 0 && val != 2) {
        this.$message({
          message: "请至少选择一条数据!",
          type: "warning"
        });
        return;
      }

      if (val == 0) {
        enableCluster(
          _.map(this.multipleSelection, item => {
            return item.id;
          })
        ).then(res => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });

          this.getList({
            params: deleteEmptyProperty({
              offset: this.currentPage - 1,
              limit: this.pagesize,
              name: this.searchInput
            })
          });
          // if (data.status == 200) {

          // }
        });
      }

      if (val == 1) {
        disableCluster(
          _.map(this.multipleSelection, item => {
            return item.id;
          })
        ).then(res => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });

          this.getList({
            params: deleteEmptyProperty({
              offset: this.currentPage - 1,
              limit: this.pagesize,
              name: this.searchInput
            })
          });
          // if (data.status == 200) {

          // }
        });
      }
      if (val == 2) {
        this.dialogData = { dialogFormVisible: true };
      }
      if (val == 3) {
        removeCluster(
          _.map(this.multipleSelection, item => {
            return item.id;
          })
        ).then(res => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });

          this.getList({
            params: deleteEmptyProperty({
              offset: this.currentPage - 1,
              limit: this.pagesize,
              name: this.searchInput
            })
          });
          // if (data.status == 200) {

          // }
        });
        // this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // })
        //   .then(() => {
        //     this.$message({
        //       type: "success",
        //       message: "删除成功!"
        //     });

        //   })
        //   .catch(() => {
        //     this.$message({
        //       type: "info",
        //       message: "已取消删除"
        //     });
        //   });
      }
    },
    format(val) {
      //return val;
      return moment(val).format("YYYY-MM-DD h:mm:ss");
    },
    deleteRow(val) {
      delflow({ id: val.id }).then(
        data => {
          if (data.status == 204) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            //this.getList(this.offset, this.limit);
            this.getList(
              parseParams(
                deleteEmptyProperty({
                  offset: this.offset,
                  limit: this.limit,
                  name: this.searchInput
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
    },
    getList(data) {
      listCluster(data).then(res => {
        this.tableData = _.map(res.data.content, item => {
          return {
            ...item,
            lastModifiedTime: this.format(item.lastModifiedTime),
            createTime: this.format(item.createTime),
            enabled: item.enabled == 1 ? "启用" : "停止"
          };
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      let params = {
        offset: this.currentPage - 1,
        limit: this.pagesize,
        name: this.searchInput
      };

      this.getList({
        params: deleteEmptyProperty(params)
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      let params = {
        offset: this.currentPage - 1,
        limit: this.pagesize,
        name: this.searchInput
      };
      this.getList({
        params: deleteEmptyProperty(params)
      });
    },
    addFlow() {
      this.$router.push({ path: "/realtime/editor" }); //this.$router.push({ name: 'dataImport',params:{searchVal:this.keywords}});
    },
    handledateValue() {},
    searchTable() {
      this.getList({
        params: deleteEmptyProperty({
          offset: this.offset,
          limit: this.limit,
          name: this.searchInput
        })
      });
    },
    modify(val) {
      this.$router.push({ path: "/realtime/editor", query: { id: val.id } });
    },
    dialogDetailed(val){
      this.detailedData = {
        ...val,
        dialogDetailedVisible: true
      }
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

  .bg-purple-left {
    text-align: left;
  }

  .grid-content {
    text-align: right;
  }
}
</style>
