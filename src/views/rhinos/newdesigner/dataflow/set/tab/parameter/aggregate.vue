<template>
  <div class="sink-step">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item
        :prop="item.name"
        :label="item.name"
        v-for="(item, index) in formItemList"
        :key="index"
        :rules="{
          required: item.required,
          message: '',
          trigger: 'blur'
        }"
        v-if="item.isshow"
      >
        <el-tooltip
          lass="item"
          effect="dark"
          :content="item.description ? item.description : item.name"
          placement="top"
        >
          <i class="parIcon el-icon-warning"></i>
        </el-tooltip>
        <el-input
          v-if="
            (item.type == 'String' || item.type == 'char') &&
              !item.values &&
              item.name != 'timeCol'
          "
          v-model="form[item.name]"
        ></el-input>

        <el-select v-if="item.name == 'timeCol'" v-model="form[item.name]" placeholder="请选择">
          <el-option
            v-for="(subitem, subindex) in mapData(
              cloneDeep(realtime.initInputData)
            )"
            :key="subindex"
            :label="subitem"
            :value="subitem"
          ></el-option>
        </el-select>

        <!-- groupBy -->
        <!-- <el-select
          v-if="item.type == 'String[]'"
          v-model="form[item.name]"
          placeholder="请选择"
          multiple
          collapse-tags
          class="select-groupBy"
        >-->
        <el-select
          v-if="item.type == 'String[]'"
          v-model="form[item.name]"
          placeholder="请选择"
          multiple
          class="select-groupBy"
        >
          <el-option
            v-for="(subitem, subindex) in mapData(
              cloneDeep(realtime.checkedinPUTData.input)
            )"
            :key="subindex"
            :label="subitem"
            :value="subitem"
          ></el-option>
        </el-select>

        <el-select
          v-if="item.type == 'String' && item.values"
          v-model="form[item.name]"
          placeholder="请选择"
        >
          <el-option
            v-for="(subitem, subindex) in item.values ? item.values : ''"
            :key="subindex"
            :label="subitem"
            :value="subitem"
          ></el-option>
        </el-select>
        <el-switch v-if="item.type == 'boolean'" v-model="form[item.name]"></el-switch>

        <el-table
          :data="
            aggregateArr.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          style="width: 100%"
          max-height="500"
          v-if="item.name == 'aggregates'"
        >
          <el-table-column type="index" width="60" :index="indexMethod"></el-table-column>
          <el-table-column
            :label="subitem.name"
            v-for="(subitem, subindex) in item.type"
            :key="subindex"
          >
            <template slot-scope="scope">
              <el-input
                v-if="subindex == 2"
                v-model="scope.row[subitem.name]"
                @blur="inpputBlur"
                :validate-event="false"
                placeholder="别名(必填)"
              ></el-input>

              <!-- groupBy -->
              <el-select v-if="subindex == 0" v-model="scope.row[subitem.name]" placeholder="请选择">
                <el-option
                  v-for="(subitem, subindex) in mapData(
                    cloneDeep(realtime.checkedinPUTData.input)
                  )"
                  :key="subindex"
                  :label="subitem"
                  :value="subitem"
                ></el-option>
              </el-select>

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
        <div class="addExpressions" v-if="item.name == 'aggregates'">
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
          v-if="item.name == 'aggregates'"
        ></el-pagination>
      </el-form-item>
    </el-form>
    <adItem :data="{ adformItemList: adformItemList, adformItemData: adformItemData }"></adItem>
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
  difference
} from "lodash";
import adItem from "./common/index";
import { setUpWatchersUtils, setFormDataUtils } from "@components/utils/index";
export default {
  watch: {
    "realtime.setStepData"(val) {
      this.setFormData(val);
    },
    form: {
      handler(val) {
        if (val.windowType != "slide") {
          delete this.form.slide;
        }
        // this.isDeleteItem(val.windowType,"slide",this.form)
        val.aggregates = this.aggregateArr;
        this.setParamertData(val);

        this.formItemList = this.filterFormItemnew(this.formItemList, val);
      },
      deep: true
    },

    aggregateArr: {
      handler(val) {
        this.setParamertData({
          ...this.form,
          aggregates: val
        });
      },
      deep: true
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
  components: {
    adItem
  },
  data: function() {
    return {
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
  mounted() {},
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

        // this.addWatch();
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
.sink-step {
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

  .select-groupBy {
    width: 100%;
  }
}
</style>
