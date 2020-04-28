<template>
  <div class="card-table">
    <el-table
      :data="
            aggregateArr.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
      style="width: 100%"
      max-height="500"
    >
      <el-table-column type="index" width="60" :index="indexMethod"></el-table-column>
      <el-table-column
        :label="subitem.name"
        v-for="(subitem, subindex) in data.type"
        :key="subindex"
      >
        <template slot-scope="scope">
          <el-input
            v-if="subitem.type == 'String'&&subitem.name!='name'"
            v-model="scope.row[subitem.name]"
            @blur="inpputBlur"
            :validate-event="false"
            :placeholder="subitem.name+'(必填)'"
            :disabled="subitem.name =='type'"
          ></el-input>

          <el-select
            v-if="subitem.name=='name'"
            v-model="scope.row[subitem.name]"
            placeholder="请选择"
            @change="setTypeRow(scope.row[subitem.name],data.schemaData,scope.row)"
          >
            <el-option
              v-for="(item, index) in data.schemaData"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <div class="removeExpressions(scope.$index)">
            <i
              @click="removeExpressions(scope.$index, aggregateArr)"
              title="删除当前表达式"
              class="i remove el-icon-remove-outline"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="addExpressions">
      <i @click="addExpressions" title="新增表达式" class="i add el-icon-circle-plus-outline"></i>
    </div>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 16, 50, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="aggregateArr.length"
    ></el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { querySchema } from "@api";
import {
  isEmpty,
  forEach,
  map,
  mapKeys,
  keys,
  cloneDeep,
  isEqual,
  filter,
  difference,
  isArray,
  find
} from "lodash";
import { setUpWatchersUtils, setFormDataUtils } from "@components/utils/index";
import { constants } from "buffer";
export default {
  watch: {
    aggregateArr: {
      handler(val) {
        this.setTableData(val);
      },
      deep: true
    },
    data(val) {
      let result = this.data.editableTabs[parseInt(this.data.editableTabsValue)]
        .form.values;
      this.aggregateArr = result ? result : [];
    }
  },
  computed: {
    ...mapState(["realtime"])
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
      schemaData: [],
      form: {},
      formatData: ["csv", "parquet"],
      dialogDataSetVisible: false,
      typeData: ["HDFS", "KAFKA"],
      formItemList: [],
      adformItemList: [],
      allformItemList: [],
      formItemData: [],
      adformItemData: {},
      allformItemData: [],
      currentPage: 1,
      pagesize: 8,
      aggregateArr: [],
      unWatchlist: []
    };
  },
  mounted() {
    let val = this.realtime.initParametData;

    if (this.data.editableTabsValue == "0" && isArray(val.lookupRules)) {
      this.aggregateArr =
        val.lookupRules[parseInt(this.data.editableTabsValue)].values;
    }

    //this.schemaData = this.data.schema;

    // this.schemaData = map(this.data.schema, item => {
    //   return {
    //     key: item.name,
    //     value: item.name
    //   };
    // });
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    ...mapActions([
      "openDialog",
      "setParamertData",
      "initOutInputData",
      "modifyLoadingStatus"
    ]),
    setTypeRow(val, schemaData,row) {
      let result = find(schemaData, item => {
        return item.name == val;
      });
      row["type"] = result.type;
    },
    setTableData(val) {
      let editableTabs = _.map(this.data.editableTabs, item => {
        if (item.name == this.data.editableTabsValue) {
          return {
            ...item,
            form: {
              ...item.form,
              values: val
            }
          };
        } else {
          return {
            ...item,
            form: {
              ...item.form,
              values: this.data.editableTabs[parseInt(item.name)].form.values
            }
          };
        }
      });

      this.$emit("modifyEditableTabs", editableTabs);
      this.setParamertData({
        ...this.realtime.parametData,
        lookupRules: _.map(editableTabs, item => {
          return { ...item.form };
        })
      });

      return editableTabs;
    },
    isDeleteItem(key, value, form) {
      if (key != "slide") {
        delete form.slide;
      } else {
        form[val] = "30";
      }
    },
    inpputBlur() {
      return true;
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    addExpressions() {
      this.aggregateArr = [
        ...this.aggregateArr,
        {
          column: "",
          func: "",
          alias: ""
        }
      ];
    },
    indexMethod(index) {
      return this.pagesize * (this.currentPage - 1) + index + 1;
    },
    removeExpressions(index, rows) {
      rows.splice((this.currentPage - 1) * this.pagesize + index, 1);
      if (rows.length % this.pagesize === 0 && this.currentPage !== 1) {
        this.currentPage = this.currentPage - 1;
      }
    },
    cloneDeep(data) {
      return cloneDeep(data);
    },
    mapData(data) {
      return map(data, val => {
        return val.alias || val.column || val.name;
      });
    },

    getFormItemData(formItem, data) {
      let result = {};
      _.forEach(formItem, item => {
        _.forEach(data, (subitem, key) => {
          if (key == item.name) {
            result[key] = subitem;
          }
        });
      });

      return result;
    },
    initForm(val) {
      this.form = val;
      this.aggregateArr = val.aggregates ? val.aggregates : [];
      this.currentPage = 1;
    },
    selectDataset() {
      //this.dialogDataSetVisible = true;
      this.openDialog(true);
    },
    cancelDatasetDialog() {
      //关闭dialog
      this.dialogDataSetVisible = false;
    },
    submitDataSet() {},
    selectChange() {},
    setFormData(val) {
      this.$nextTick(() => {
        //表单全部项
        let data = this.realtime.initParametData;
        this.allformItemData = this.setallformItemData(data, val);

        // isshow form item
        this.allformItemList = this.filterFormItemnew(
          val,
          this.allformItemData
        );
        //表单高级选项
        this.adformItemList = filter(this.allformItemList, item => {
          return item.advanced;
        });
        //表单基本项
        this.formItemList = difference(
          this.allformItemList,
          this.adformItemList
        );

        this.adformItemData = this.getFormItemData(
          this.adformItemList,
          this.allformItemData
        );

        //初始化表单数据
        this.initForm({
          ...this.form,
          ...this.allformItemData
        });
      });
    },
    filterFormItemnew(allformItemList, formData) {
      //console.log("this.unWatchlist",this.unWatchlist);

      return _.map(allformItemList, item => {
        if (item.name == "slide") {
          return {
            ...item,
            isshow: formData["windowType"] == "slide" ? true : false
          };
        } else {
          return {
            ...item,
            isshow: true
          };
        }
      });
    },
    filterFormItem(val, format) {
      return _.map(val, item => {
        return {
          ...item,
          isshow: this.isshow(item, format)
        };
      });
    },
    isshow(val, format) {
      if (val.name == "slide" && format != "slide") {
        return false;
      }
      return true;
    },
    getValueByName(data, val) {
      let result = "";
      _.forEach(data, (value, key) => {
        if (value.name == val) {
          result = value.defaultValue;
        }
      });

      return result;
    },
    setallformItemData(initParametData, allformItemList) {
      let allformItemData = {};
      let formkeys = map(allformItemList, val => {
        return val.name;
      });
      forEach(formkeys, val => {
        if (val == "groupBy") {
          allformItemData[val] =
            initParametData[val] == ""
              ? []
              : initParametData[val] == undefined
              ? []
              : initParametData[val];
        } else {
          allformItemData[val] = initParametData[val]
            ? initParametData[val]
            : this.getValueByName(allformItemList, val);
        }
      });

      return allformItemData;
    }
  }
};
</script>

<style lang="scss">
.card-table {
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
  .titleIcon {
    color: #ffffff;
  }
}
</style>
