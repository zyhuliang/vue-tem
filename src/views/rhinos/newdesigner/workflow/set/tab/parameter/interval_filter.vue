<template>
  <div>
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item
        :prop="item.name"
        :label="item.name"
        v-for="(item,index) in formItemList"
        :key="index"
        :rules="{
      required:  item.required, message: '', trigger: 'blur'
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

        <!-- 选择key by字段 -->
        <el-select v-if="item.name == 'keyColumn'" v-model="form[item.name]" placeholder="请选择">
          <el-option
            v-for="(subitem, subindex) in timeColumnOptions"
            :key="subindex"
            :label="subitem"
            :value="subitem"
          ></el-option>
        </el-select>

        <!-- interval filter contidions -->
        <el-table
          :data="conditionArr.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          style="width: 100%"
          max-height="500"
          v-if="item.name=='conditions'"
        >
          <el-table-column type="index" width="60" :index="indexMethod"></el-table-column>
          <el-table-column
            :label="subitem.name"
            v-for="(subitem,subindex) in item.type"
            :key="subindex"
          >
            <template slot-scope="scope">
              <el-select
                v-if="subitem.name == 'column'"
                v-model="scope.row[subitem.name]"
                placeholder="请选择"
              >
                <el-option
                  v-for="(subitem, subindex) in timeColumnOptions"
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
                  @click="removeExpressions(scope.$index, conditionArr)"
                  title="删除当前表达式"
                  class="i remove el-icon-remove-outline"
                ></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="addExpressions" v-if="item.name=='conditions'">
          <i @click="addExpressions" title="新增表达式" class="i add el-icon-circle-plus-outline"></i>
        </div>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="conditionArr.length"
          v-if="item.name == 'conditions'"
        ></el-pagination>

        <el-input
          v-if="item.name != 'keyColumn' && (item.type=='String'||item.type=='char')&&!item.values"
          v-model="form[item.name]"
        ></el-input>
      </el-form-item>
    </el-form>
    <adItem :data="{adformItemList:adformItemList,adformItemData:adformItemData}"></adItem>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapState } from "vuex";
import adItem from "./common/index";
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
import { setUpWatchersUtils, setFormDataUtils } from "@components/utils/index";
export default {
  watch: {
    "realtime.setStepData"(val) {
      this.setFormData(val);
    },
    "realtime.initParametData"(val) {
      this.initForm(val);
    },
    "realtime.checkedinPUTData"(val) {
      this.timeColumnOptions = val.input.map(field => {
        return field.alias ? field.alias : field.column;
      });
    },
    form(val) {
      this.setParamertData(val);
    },
    conditionArr(val) {
      this.setParamertData({
        ...this.form,
        conditions: val
      });
    }
  },
  computed: {
    ...mapState(["realtime"])
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: { adItem },
  data: function() {
    return {
      //[{"name":"serialVersionUID","type":"long"},{"name":"condition","type":"String"}]
      form: {},
      formItemList: [],
      adformItemList: [],
      allformItemList: [],
      formItemData: [],
      adformItemData: {},
      allformItemData: [],
      unWatchlist: [],
      conditionArr: [],
      currentPage: 1,
      pagesize: 5,
      timeColumnOptions: []
    };
  },
  mounted() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    ...mapActions(["openDialog", "setParamertData", "modifyLoadingStatus"]),
    setUpWatchers(watchList, formList) {
      for (let i in watchList) {
        let formItem = formList[i];
        let watchItem = watchList[i];
        this.$watch(watchItem, newValue => {
          let item = {};
          item[formItem] = newValue;
          this.setParamertData({ ...this.form, ...item });
          if (watchItem == "form.format") {
            this.formItemList = this.filterFormItem(
              this.formItemList,
              newValue
            );
          }
        });
      }
    },
    initForm(val) {
      this.form = val;
      this.conditionArr = val.conditions ? val.conditions : [];
      this.currentPage = 1;
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
    setFormData(val) {
      this.$nextTick(() => {
        //表单全部项
        this.allformItemList = this.filterFormItem(val, this.form.format);
        //表单高级选项
        this.adformItemList = filter(this.allformItemList, item => {
          return item.advanced;
        });
        //表单基本项
        this.formItemList = difference(
          this.allformItemList,
          this.adformItemList
        );

        let data = this.realtime.initParametData;

        this.allformItemData = this.setallformItemData(data);

        this.adformItemData = this.getFormItemData(
          this.adformItemList,
          this.allformItemData
        );

        //初始化表单数据
        this.initForm({
          ...this.form,
          ...this.setallformItemData(data)
        });

        //注销 watch
        forEach(this.unWatchlist, unWatch => {
          unWatch();
        });
        this.unWatchlist = [];

        //add dynamic watched

        let formkeys = mapKeys(this.form, function(value, key) {
          return "form." + key;
        });
        //this.setUpWatchers(keys(formkeys), keys(this.form));

        setUpWatchersUtils(
          keys(formkeys),
          keys(this.form),
          this.unWatchlist,
          this.form,
          (watchItem, newValue, formData) => {
           this.setParamertData({ ...formData, conditions: this.conditionArr });
          },
          this
        );
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
      if (
        (val.name == "separator" && format == "csv") ||
        (val.name == "escapeChar" && format == "csv") ||
        (val.name == "quoteChar" && format == "csv") ||
        (val.name == "nullValue" && format == "csv")
      ) {
        return true;
      }

      if (
        (val.name == "separator" && format != "csv") ||
        (val.name == "escapeChar" && format != "csv") ||
        (val.name == "quoteChar" && format != "csv") ||
        (val.name == "nullValue" && format != "csv") ||
        (val.name == "jsonSchema" && format != "json")
      ) {
        return false;
      }
      return true;
    },
    getValueByName(data, val) {
      let result = "";
      _.forEach(data, (value, key) => {
        if (value.name == val) {
          if (val == "conditions") {
            result = [];
          } else {
            result = value.defaultValue;
          }
        }
      });

      return result;
    },
    setallformItemData(initParametData) {
      let allformItemData = {};
      let formkeys = map(this.allformItemList, val => {
        return val.name;
      });
      forEach(formkeys, val => {
        if (val == "processOnce") {
          allformItemData[val] =
            initParametData[val] == "" ? false : initParametData[val];
        } else {
          allformItemData[val] = initParametData[val]
            ? initParametData[val]
            : this.getValueByName(this.allformItemList, val);
        }
      });

      return allformItemData;
    },
    cloneDeep(data) {
      return cloneDeep(data);
    },
    mapData(data) {
      return map(data, val => {
        return val.alias || val.column || val.name;
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    addExpressions() {
      this.conditionArr = [
        ...this.conditionArr,
        {
          column: "",
          op: ""
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
    }
  }
};
</script>

<style lang="scss">
</style>
