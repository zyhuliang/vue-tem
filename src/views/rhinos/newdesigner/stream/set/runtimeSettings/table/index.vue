<template>
  <div class="table-column">
    <el-table
      :data="
            tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
      style="width: 100%"
      max-height="500"
    >
      <!-- <el-table-column type="index" width="5" :index="indexMethod"></el-table-column> -->
      <el-table-column
        :label="subitem.name"
        v-for="(subitem, subindex) in item.type"
        :key="subindex"
      >
        <template slot-scope="scope">
          <el-input
            v-if="(subitem.type=='String'||subitem.type=='long'||subitem.type=='char'||subitem.type=='Object'||subitem.type=='Integer'||subitem.type=='int')&&!subitem.values"
            v-model="scope.row[subitem.name]"
            :validate-event="false"
          ></el-input>

          <el-switch v-if="subitem.type == 'boolean'" v-model="scope.row[subitem.name]"></el-switch>

          <!-- <el-input-number
            v-if="subitem.type == 'int'"
            v-model="scope.row[subitem.name]"
            :min="1"
            :max="100"
          ></el-input-number>-->

          <el-select
            v-if="subitem.type == 'String' && subitem.values"
            v-model="scope.row[subitem.name]"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in subitem.values ? subitem.values : ''"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="50">
        <template slot-scope="scope">
          <div class="removeExpressions(scope.$index)">
            <i
              @click="removeExpressions(scope.$index, tableData)"
              title="删除当前表达式"
              class="i remove el-icon-remove-outline"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="addExpressions">
      <i @click="addExpressions(item.type)" title="新增表达式" class="i add el-icon-circle-plus-outline"></i>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 9, 50, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.length"
    ></el-pagination>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { cloneDeep, map, forEach } from "lodash";
export default {
  watch: {
    data(val) {
      this.tableData = val.tableData;
      this.item = val.item;
    },
    tableData(val) {
      this.$emit("modifyTableData", { key: this.item.name, value: val });
    }
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  components: {},
  data: function() {
    return {
      currentPage: 1,
      pagesize: 8,
      tableData: [],
      item: ""
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    this.tableData = this.data.tableData;
    this.item = this.data.item;
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
    cloneDeep(data) {
      return cloneDeep(data);
    },
    mapData(data) {
      return map(data, val => {
        return val.column || val.name;
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    addTableItem(val) {
      let result = {};
      forEach(val, (value, key) => {
        result[value.name] = value.defaultValue;
      });

      return result;
    },
    addExpressions(val) {
      this.tableData = [
        ...this.tableData,
        {
          ...this.addTableItem(val)
        }
      ];

      this.$emit("modifyTableData", {
        key: this.item.name,
        value: this.tableData
      });
    },
    indexMethod(index) {
      return this.pagesize * (this.currentPage - 1) + index + 1;
    },
    removeExpressions(index, rows) {
      rows.splice((this.currentPage - 1) * this.pagesize + index, 1);
      if (rows.length % this.pagesize === 0 && this.currentPage !== 1) {
        this.currentPage = this.currentPage - 1;
      }
    }
  }
};
</script>

<style lang="scss">
.table-column {
  .sign {
    margin: 0px;
    color: red;
    padding: 0px;
    font-size: 8px;
  }

  .addExpressions {
    float: left;
    right: 0px;
    top: 0px;
  }
  .uploadExpressions {
    float: left;
    margin-left: 10px;
  }
  .removeExpressions {
    float: left;
    margin-left: 10px;
  }
  .i {
    color: #3e98fe;
  }
  .remove {
    color: #ff4949;
    cursor: pointer;
  }
  .add {
    cursor: pointer;
  }
  .upload {
    cursor: pointer;
    color: #67c23a;
  }
}
</style>
