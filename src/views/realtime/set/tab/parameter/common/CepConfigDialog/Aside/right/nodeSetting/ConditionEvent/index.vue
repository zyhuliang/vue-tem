<template>
  <div class="cep-conditon">
    <el-form ref="form" :model="form" label-width="150px" :label-position="'left'">
      <el-form-item
        :label-width="false?'90px':'170px'"
        :prop="item.name"
        :label="item.name"
        v-for="(item,index) in formItemList"
        :key="index"
        :rules="{
      required: true, message: '', trigger: 'blur'
    }"
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
          v-if="(item.type=='String'||item.type=='long'||item.type=='char')&&!item.values"
          v-model="form[item.name]"
          :disabled="item.name=='id'"
        ></el-input>
        <el-select
          v-if="item.values"
          v-model="form[item.name]"
          placeholder="请选择"
          style="width:100%"
        >
          <el-option
            v-for="(subitem,subindex) in item.values?item.values:''"
            :key="subindex"
            :label="subitem"
            :value="subitem"
          ></el-option>
        </el-select>
        <el-switch v-if="item.type=='boolean'" v-model="form[item.name]"></el-switch>

        <tableColumn
          v-if="item.name == 'conditions'"
          :data="{tableData:conditionData,item:item}"
          @modifyTableData="modifyTableData"
        ></tableColumn>

        <tableColumn
          v-if="item.name == 'quantifier'"
          :data="{tableData:quantifierData,item:item}"
          @modifyTableData="modifyTableData"
          @modifyformItemList="modifyformItemList"
        ></tableColumn>

        <tableColumn
          v-if="item.name == 'loopingUntilCondition'"
          :data="{tableData:loopingUntilConditionData,item:item}"
          @modifyTableData="modifyTableData"
        ></tableColumn>
      </el-form-item>
    </el-form>
    <!-- <adItem :data="{adformItemList:adformItemList,adformItemData:adformItemData}"></adItem> -->
  </div>
</template>


<script>
import {
  getCepLinks,
  getCepSettings,
  getEventsSetting
} from "@/api/realtime/index.js";
import { mapGetters, mapActions, mapState } from "vuex";
import tableColumn from "../../table/index";
// import { steplist, stepsettings, outputStep } from "@server/realtime/index";
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
  isArray
} from "lodash";
// import adItem from "./common/index";
import { setUpWatchersUtils, setFormDataUtils } from "@components/utils/index";
export default {
  watch: {
    cepNodeItemList(val) {
      this.setFormData(val);
    },
    data(val) {
      this.cepNodeItemList = val.cepNodeItemList;
    },
    quantifierData(val) {
      this.setParamertDataCep({
        ...this.form,
        quantifier: val[0],
        conditions: this.conditionData,
        loopingUntilCondition: this.loopingUntilConditionData[0]
      });
    },
    conditionData(val) {
      this.setParamertDataCep({
        ...this.form,
        conditions: val,
        quantifier: this.quantifierData[0],
        loopingUntilCondition: this.loopingUntilConditionData[0]
      });
    },
    loopingUntilConditionData(val) {
      this.setParamertDataCep({
        ...this.form,
        conditions: this.conditionData,
        quantifier: this.quantifierData[0],
        loopingUntilCondition: val[0]
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
  components: { tableColumn },
  data: function() {
    return {
      form: {},
      formatData: ["csv", "parquet"],
      typeData: ["MapDB", "Redis"], //kafka
      formItemList: [],
      adformItemList: [],
      allformItemList: [],
      formItemData: [],
      adformItemData: {},
      allformItemData: [],
      unWatchlist: [],
      cepNodeItemList: [],
      conditionData: [],
      quantifierData: [],
      loopingUntilConditionData: [],
      cloneformItemList:""
    };
  },
  mounted() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    this.$nextTick(() => {
      //this.modifyLoadingStatus(false);
    });
  },
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    ...mapActions([
      "openDialog",
      "setParamertDataCep",
      "modifyLoadingStatus",
      "getStepConfiug",
      "initParametData",
      "modifyFlowCepStepsAction"
    ]),
    modifyformItemList(strategy) {
      this.formItemList = map(this.cloneformItemList, item => {
        // let strategy = this.allformItemData.quantifier.strategy;
        if (item.name == "quantifier") {
          if (strategy == "ONE_OR_MORE") {
            let quantifiercolums = item.type;
            return {
              ...item,
              type: [
                quantifiercolums[0],
                {
                  ...quantifiercolums[1],
                  type: ""
                },
                {
                  ...quantifiercolums[2],
                  type: ""
                }
              ]
            };
          }

          if (strategy == "TIMES_TO") {
            let quantifiercolums = item.type;
            return {
              ...item,
              type: [
                quantifiercolums[0],
                {
                  ...quantifiercolums[1],
                  type: "Integer"
                },
                {
                  ...quantifiercolums[2],
                  type: "Integer"
                }
              ]
            };
          }
          if (strategy == "TIMES" || strategy == "TIME_OR_MORE") {
            let quantifiercolums = item.type;
            return {
              ...item,
              type: [
                quantifiercolums[0],
                {
                  ...quantifiercolums[1],
                  type: "Integer"
                },
                {
                  ...quantifiercolums[2],
                  type: ""
                }
              ]
            };
          }
        } else {
          return item;
        }
      });

      this.formItemList = _.remove(this.formItemList, item => {
        if (strategy == "TIMES" || strategy == "TIMES_TO") {
          return item.name != "loopingUntilCondition";
        }
        return item;
      });
    },
    modifyTableData(val) {
      if (val.key == "conditions") {
        this.conditionData = val.value;
      }

      if (val.key == "quantifier") {
        this.quantifierData = val.value;
      }

      if (val.key == "loopingUntilCondition") {
        this.loopingUntilConditionData = val.value;
      }
    },

    isArray(val) {
      return isArray(val);
    },
    selectDataset() {
      this.openDialog(true);
    },
    initForm(val) {
      this.form = val;
      this.loopingUntilConditionData = val.loopingUntilCondition
        ? [val.loopingUntilCondition]
        : [{ column: "", operator: "", expectedValue: "" }];
      this.quantifierData = val.quantifier
        ? [val.quantifier]
        : [{ strategy: "", from: "", to: "" }];
      this.conditionData = isArray(val.conditions) ? val.conditions : [];
    },

    setFormData(val) {
      this.$nextTick(() => {
        //  this.cepNodeItemList = val;

        // console.log();
        //表单全部项
        this.allformItemList = this.filterFormItem(val, this.form.format);
        //表单高级选项
        this.adformItemList = filter(this.allformItemList, item => {
          return item.advanced;
        });

        let data = _.cloneDeep(this.realtime.currentSelectStep);
        this.allformItemData = this.setallformItemData(data);

        //表单基本项
        this.formItemList = difference(
          this.allformItemList,
          this.adformItemList
        );
         this.cloneformItemList = cloneDeep(this.formItemList);

        this.allformItemData.quantifier &&
          this.modifyformItemList(this.allformItemData.quantifier.strategy);

        // this.adformItemData = this.getFormItemData(
        //   this.adformItemList,
        //   this.allformItemData
        // );

        //初始化表单数据
        this.initForm({
          ...this.form,
          ...this.allformItemData
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

        setUpWatchersUtils(
          keys(formkeys),
          keys(this.form),
          this.unWatchlist,
          this.form,
          (watchItem, newValue, formData) => {
            if (
              watchItem == "form.quantifier" ||
              watchItem == "form.conditions"
            ) {
              if (watchItem == "form.quantifier") {
                this.quantifierData = newValue ? [newValue] : [];
                return;
              }

              if (watchItem == "form.conditions") {
                this.conditionData = newValue ? newValue : [];
                //this.setParamertDataCep(formData);
                return;
              }

              if (watchItem == "form.loopingUntilCondition") {
                this.loopingUntilConditionData = newValue ? newValue : [];
                this.setParamertDataCep(formData);
                return;
              }
            } else {
              // this.setParamertDataCep(formData);
            }
          },
          this
        );
      });
    },
    filterFormItem(val, format) {
      //item.name!='separator'||(item.bind=='bind'&&item.name=='separator'&&form.format=='csv')

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
        (val.name == "nullValue" && format == "csv") ||
        (val.name == "jsonSchema" && format == "csv")
      ) {
        return true;
      }

      if (
        (val.name == "separator" && format != "csv") ||
        (val.name == "escapeChar" && format != "csv") ||
        (val.name == "quoteChar" && format != "csv") ||
        (val.name == "nullValue" && format != "csv") ||
        (val.name == "jsonSchema" && format != "csv")
      ) {
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
    getFormItemByType(val) {
      //this.initParametData({});
      this.formItemList = [];
      stepsettings("lookup_" + val).then(
        data => {
          this.getStepConfiug(data);
        },
        err => {
          // this.$message({
          //   message: err.response.message,
          //   type: "error",
          //   duration: 1500
          // });
        }
      );
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
    setallformItemData(initParametData) {
      let allformItemData = {};
      let formkeys = map(this.allformItemList, val => {
        return val.name;
      });
      forEach(formkeys, val => {
        allformItemData[val] = initParametData[val]
          ? initParametData[val]
          : this.getValueByName(this.allformItemList, val);
      });

      return allformItemData;
    }
  }
};
</script>

<style lang="scss">
.cep-conditon {
  overflow-y: scroll;
  .sign {
    margin: 0px;
    color: red;
    padding: 0px;
    font-size: 8px;
  }
}
</style>
