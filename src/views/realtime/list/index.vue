<template>
  <div class="real-time-list">
    <el-input
      placeholder="请输入名称"
      v-model="searchInput"
      @keyup.native="searchKeyup(searchInput)"
      class="input-with-search"
      name="seachInput"
    >
      <el-button
        slot="append"
        @click="searchTable"
        icon="icon iconfont icon-ir-search"
        name="searchTable"
      ></el-button>
    </el-input>
    <div
      @click="addFlow"
      class="newflle icon iconfont icon-ir-add iconStyle"
    >{{ $t('flowlist.btnSave') }}</div>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      height="calc( 100vh - 175px )"
      style="width: 100%"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableHead"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        sortable
      >
        <template slot-scope="scope">
          <a v-if="item.prop == 'name'" @click="modify(scope.row)">
            {{
            scope.row.name
            }}
          </a>
          <div v-else>{{ scope.row[item.prop] }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 16, 50, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalElements"
    ></el-pagination>
  </div>
</template>

<script>
import { listflow, delflow } from "@/api/realtime/index.js";
import moment from "moment"; //时间格式化

import { parseParams, deleteEmptyProperty } from "@/components/utils/index";
import { map } from "lodash";
import { format } from "path";

export default {
  components: {},
  data: function() {
    return {
      loading: true,
      tableHead: [
        // { label: "ID", prop: "id" },
        { label: "名称", prop: "name" },
        { label: "创建时间", prop: "createTime" },
        { label: "修改时间", prop: "lastModifyTime" }
      ],
      tableData: [],
      limit: "8",
      offset: "1",
      currentPage: 1,
      pagesize: 8,
      totalElements: 20,
      multipleSelection: "",
      dateValue: [],
      searchInput: ""
    };
  },
  mounted() {
    //this.getList(this.offset, this.limit);

    this.getList(
      parseParams(
        deleteEmptyProperty({
          page: this.currentPage - 1,
          limit: this.pagesize,
          name: this.searchInput
        })
      )
    );
  },
  beforeCreate() {},
  created() {
    let pagination = JSON.parse(sessionStorage.getItem("list-pagination"));
    if (pagination) {
      this.currentPage = parseInt(pagination.currentPage);
      this.pagesize = parseInt(pagination.pagesize);
    }
  },
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    searchKeyup(val) {
      this.getList(
        parseParams(
          deleteEmptyProperty({
            page: this.offset - 1,
            limit: this.limit,
            name: val
          })
        )
      );
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
                  page: this.currentPage - 1,
                  limit: this.pagesize,
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
    getList(offset, limit) {
      listflow(offset, limit).then(res => {
        this.totalElements = res.data.totalElements;
        this.tableData = _.map(res.data.content, item => {
          return {
            ...item,
            lastModifyTime: this.format(item.lastModifyTime),
            createTime: this.format(item.createTime)
          };
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getList(
        parseParams(
          deleteEmptyProperty({
            page: this.currentPage - 1,
            limit: val,
            name: this.searchInput
          })
        )
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList(
        parseParams(
          deleteEmptyProperty({
            page: val - 1,
            limit: this.pagesize,
            name: this.searchInput
          })
        )
      );
    },
    addFlow() {
      this.$router.push({ path: "/realtime/editor" }); //this.$router.push({ name: 'dataImport',params:{searchVal:this.keywords}});
    },
    handledateValue() {},
    searchTable() {
      this.getList(
        parseParams(
          deleteEmptyProperty({
            page: this.offset - 1,
            limit: this.limit,
            name: this.searchInput
          })
        )
      );
    },
    modify(val) {
      this.$router.push({
        path: "/realtime/editor",
        query: {
          id: val.id,
          currentPage: this.currentPage,
          pagesize: this.pagesize
        }
      });
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
}
</style>
