<template>
  <div class="lookup">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item
        :prop="item.name"
        :label="item.name"
        v-for="(item,index) in formItemList"
        :key="index"
        :rules="{
      required: true, message: '', trigger: 'blur'
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
          v-if="(item.type=='String'||item.type=='long'||item.type=='char')&&!item.values"
          v-model="form[item.name]"
        ></el-input>
        <el-select
          v-if="item.type=='String'&&item.values"
          v-model="form[item.name]"
          placeholder="请选择"
          @change="setlookupRulesFromItem(item.name,form[item.name])"
        >
          <el-option
            v-for="(subitem,subindex) in item.values?item.values:''"
            :key="subindex"
            :label="subitem"
            :value="subitem"
          ></el-option>
        </el-select>
        <el-switch v-if="item.type=='boolean'" v-model="form[item.name]"></el-switch>

        <card
          v-if="item.name=='lookupRules'"
          :data="{editableTabs:editableTabs,cardFormItemList:cardFormItemList,cardForm:cardForm,schemaData:schemaData,KeyData:KeyData,ruleFormData:ruleFormData,parentForm:form,formItemList:formItemList}"
          @moodifyeditableTabsData="moodifyeditableTabsData"
          @modifyParameData="modifyParameData"
          @getFormItemByType="getFormItemByType"
          ref="card"
        ></card>
      </el-form-item>
    </el-form>
    <adItem :data="{adformItemList:adformItemList,adformItemData:adformItemData}"></adItem>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { steplist, stepsettings, outputStep } from "@server/realtime/index";
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
  find
} from "lodash";
import adItem from "./common/index";
import card from "./card/index";
import { setUpWatchersUtils, setFormDataUtils } from "@components/utils/index";
import { querySchema } from "@api";
import { thisExpression } from "@babel/types";
export default {
  watch: {
    "realtime.setStepData"(val) {
      // this.cardFormItemList = [
      //   find(val, item => {
      //     return item.name == "type";
      //   })
      // ];
      // let result = filter(val, item => {
      //   return item.name != "type";
      // });
      let result = [
        ...val,
        {
          advanced: false,
          defaultValue: "lookupRules",
          description: "lookupRules",
          name: "lookupRules",
          required: true,
          type: "lookupRules"
        }
      ];
      this.setFormData(result);
    },
    "realtime.checkedinPUTData"(val) {
      this.KeyData = map(val.input, item => {
        return {
          key: item.alias || item.column,
          value: item.alias || item.column
        };
      });
    },
    "realtime.initParametData"(val) {
      //this.getFormItemByType(val.lookupEngine);

      if (this.editableTabs.length == 0) {
        this.initForm(val);
      }
    },
    //选择 dataset 时初始化表单 dataset id ,name
    "realtime.selectCheckedDataSet"(val) {
      let result = {
        editableTabsValue:
          this.$refs.card && this.$refs.card[0].editableTabsValue,
        editableTabs: this.editableTabs,
        selectCheckedDataSet: val
      };

      this.editableTabs = map(result.editableTabs, item => {
        let initform = {};
        switch (val.storage) {
          case "REDIS":
            initform = {
              ...val.storageConfigurations
            };
            break;
          case "HDFS":
          case "JDBC":
            initform = {
              ...val.storageConfigurations,
              mapdbName: val.storageConfigurations.mapName
                ? val.storageConfigurations.mapName
                : "",
              mapdbFile: val.storageConfigurations.path
                ? val.storageConfigurations.path
                : ""
            };
            break;
          default:
            initform = {
              ...val.storageConfigurations
            };
        }

        if (item.name == result.editableTabsValue) {
          return {
            ...item,
            form: {
              ...item.form,
              datasetName: val.datasetName,
              id: val.id,
              fields: result.selectCheckedDataSet.fields,
              ...initform
            }
            // selectCheckedDataSet: result.selectCheckedDataSet
          };
        } else {
          return item;
        }
      });
    },

    form(val) {
      // this.setParamertData(val);
      this.modifyParameData(val, val.lookupRules);
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
  components: { adItem, card },
  data: function() {
    return {
      ruleFormData: "",
      KeyData: [],
      schemaData: [],
      cardFormItemList: [],
      cardForm: {},
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
      // tab
      editableTabsValue: "0",
      editableTabs: [],
      tabIndex: 0,
      editableTabsData: {}
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
      "setParamertData",
      "modifyLoadingStatus",
      "getStepConfiug",
      "initParametData",
      "setDataSetSelect"
    ]),
    setlookupRulesFromItem(key, value) {
      if (key == "type") {
        this.getFormItemByType(value);
      }
    },
    modifyParameData(val, lookupRules) {
      this.setParamertData({
        ...val,
        lookupRules: map(lookupRules, subitem => {
          return {
            ...subitem.form
          };
        })
      });
    },
    moodifyeditableTabsData(val) {
      this.editableTabs = val;
    },
    setTabTemplate(val) {
      switch (val) {
        case "lookupRules":
          return card;
        default:
          "";
      }
    },

    selectDataset() {
      this.openDialog(true);
    },
    initForm(val) {
      this.form = val;
      let { lookupRules, type } = this.form;
      this.editableTabs = map(lookupRules, (value, key) => {
        let initform = {};
        switch (
          val.storageConfigurations && val.storageConfigurations.storage
        ) {
          case "REDIS":
            initform = {
              ...val.storageConfigurations
            };
            break;
          case "HDFS":
            initform = {
              mapdbName: val.storageConfigurations.mapName
                ? val.storageConfigurations.mapName
                : "",
              mapdbFile: val.storageConfigurations.path
                ? val.storageConfigurations.path
                : ""
            };
            break;
          default:
            initform = {
              ...val.storageConfigurations
            };
        }
        if (value.form) {
          return {
            ...value,
            form: {
              ...value.form,
              ...initform
            }
          };
        } else {
          return {
            title: key == 0 ? "Rules" : "Rules" + key,
            name: key.toString(),
            form: {
              ...value,
              rule: key == 0 ? "Rules" : "Rules" + key,
              ...initform
            }
          };
        }
      });
      if (type) {
        this.getFormItemByType(type);
      }
    },

    initCardFormItem(val) {
      let result = {};
      _.forEach(val, (value, key) => {
        result[value.name] = value.name == "values" ? [] : value.defaultValue;
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

        let lookupRules = _.find(this.allformItemList, item => {
          return item.name == "lookupRules";
        });
        //this.cardForm = this.initCardFormItem(lookupRules && lookupRules.type);

        let initformdata = { ...val };
        if (isEmpty(data)) {
          initformdata = {
            ...this.form,
            ...this.setallformItemData(data),
            lookupRules: [
              {
                title: "Rules",
                name: "0",
                form: {
                  datasetName: "",
                  type: "",
                  rule: "Rules"
                }
              }
            ]
          };
        } else {
          initformdata = {
            ...this.form,
            ...this.setallformItemData(data)
          };
        }

        //初始化表单数据
        this.initForm(initformdata);

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
            this.setParamertData(formData);
            // if (watchItem == "form.type") {
            //   this.getFormItemByType(newValue)
            // }
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
      stepsettings("lookup_" + val).then(
        data => {
          this.cardFormItemList = find(data, val => {
            return val.name == "lookupRules";
          }).type;
          // let formItemList = find(data, val => {
          //   return val.name == "lookupRules";
          // });

          // let result = {
          //   editableTabsValue:
          //     this.$refs.card && this.$refs.card[0].editableTabsValue,
          //   editableTabs: this.editableTabs,
          //   formItemList: formItemList.type
          // };

          // this.editableTabs = map(result.editableTabs, item => {
          //   if (item.name == result.editableTabsValue) {
          //     return {
          //       ...item,
          //       form: {
          //         ...item.form
          //         // formItemList: result.formItemList
          //       },
          //       formItemList: result.formItemList
          //     };
          //   } else {
          //     return item;
          //   }
          // });
        },
        err => {}
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
    }
  }
};
</script>

<style lang="scss">
.lookup {
  .sign {
    margin: 0px;
    color: red;
    padding: 0px;
    font-size: 8px;
  }
}
</style>
