<template>
  <div class="step-dialog">
    <el-dialog
      title="执行计划设置"
      :visible.sync="data.dialogVisible"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-dialog-drag
      @opened="showDailog"
      class="designDialog"
      width="97%"
    >
      <el-form
        class="elForm"
        ref="form"
        :model="form"
        label-width="250px"
        :label-position="labelPosition"
      >
        <el-form-item :label="'name'" :rules="[{ required: true, message: '', trigger: 'blur' }]">
          <el-tooltip lass="item" effect="dark" content="name" placement="top">
            <i class="parIcon el-icon-warning"></i>
          </el-tooltip>
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item
          :prop="item.name"
          :label="item.name"
          v-for="(item, index) in formItemList"
          :key="index"
          :rules="{
          required: true,
          message: '',
          trigger: 'blur'
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

          <!-- <el-select
            v-if="item.name == 'type'"
            v-model="form.type"
            placeholder="请选择"
            @change="getFormItemByType(form.type)"
          >
            <el-option
              v-for="(item, index) in item.values"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>-->

          <el-input
            v-if="
            (item.type == 'String' ||
              item.type == 'long' ||
              item.type == 'char') &&
              !item.values
          "
            v-model="form[item.name]"
          ></el-input>
          <el-select
            v-if="item.type == 'String' && item.values && item.name != 'type'"
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
        </el-form-item>

        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="(item, index) in adformItemData" :key="index">
            <template slot="title">
              <h3 class="advanced-options">
                <i class="fa fa-sort-amount-asc"></i>
                &nbsp;&nbsp;{{ item.key }}
              </h3>
            </template>
            <el-form-item
              v-for="(subitem, subindex) in item.value"
              :key="subitem.name+subindex"
              :label="subitem.name"
              v-if="subitem.isShow"
            >
              <el-tooltip class="priorityMes" placement="top" effect="dark">
                <div slot="content">{{ subitem.description ? subitem.description : subitem.name }}</div>
                <i class="el-icon-info"></i>
              </el-tooltip>
              <div v-show="item.key=='runtimeSettings'">
                <!-- <el-switch v-if="subitem.type == 'boolean'" v-model="runtimeSettings[subitem.name]"></el-switch>
                <el-input v-model="runtimeSettings[subitem.name]" v-else></el-input>-->

                <el-switch
                  v-if="subitem.type == 'boolean'"
                  v-model="runtimeSettings[subitem.name]"
                  @change="changeSetting(subitem, runtimeSettings[subitem.name])"
                ></el-switch>

                <el-input
                  v-model="runtimeSettings[subitem.name]"
                  v-if="(subitem.type == 'String'||subitem.type == 'long'  || subitem.type == 'int')&&!isArray(subitem.values)"
                ></el-input>

                <el-select
                  v-if="(subitem.type == 'String'||subitem.type == 'long')&&isArray(subitem.values)"
                  v-model="runtimeSettings[subitem.name]"
                  placeholder="请选择"
                  @change="getFormItemByType(form.type)"
                >
                  <el-option
                    v-for="(item, index) in subitem.values"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>

              <div v-show="item.key=='checkpointSettings'">
                <el-switch
                  v-if="subitem.type == 'boolean'"
                  v-model="checkpointSettings[subitem.name]"
                  @change="changeSetting(subitem, checkpointSettings[subitem.name])"
                ></el-switch>
                <el-input
                  v-model="checkpointSettings[subitem.name]"
                  v-if="(subitem.type == 'String'||subitem.type == 'long' || subitem.type == 'int')&&!isArray(subitem.values)"
                ></el-input>

                <el-select
                  v-if="(subitem.type == 'String'||subitem.type == 'long')&&isArray(subitem.values)"
                  v-model="checkpointSettings[subitem.name]"
                  placeholder="请选择"
                  @change="getFormItemByType(form.type)"
                >
                  <el-option
                    v-for="(item, index) in subitem.values"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>

              <div v-show="item.key=='restartStrategySettings'">
                <!-- <el-switch
                  v-if="subitem.type == 'boolean'"
                  v-model="restartStrategySettings[subitem.name]"
                ></el-switch>
                <el-input v-model="restartStrategySettings[subitem.name]" v-else></el-input>-->

                <el-switch
                  v-if="subitem.type == 'boolean'"
                  v-model="restartStrategySettings[subitem.name]"
                  @change="changeSetting(subitem, restartStrategySettings[subitem.name])"
                ></el-switch>
                <el-input
                  v-model="restartStrategySettings[subitem.name]"
                  v-if="(subitem.type == 'String'||subitem.type == 'long' || subitem.type == 'int')&&!isArray(subitem.values)"
                ></el-input>

                <el-select
                  v-if="(subitem.type == 'String'||subitem.type == 'long')&&isArray(subitem.values)"
                  v-model="restartStrategySettings[subitem.name]"
                  placeholder="请选择"
                  @change="getFormItemByType(form.type)"
                >
                  <el-option
                    v-for="(item, index) in subitem.values"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>

              <div v-show="item.key=='latencyTrackingSettings'">
                <!-- <el-switch
                  v-if="subitem.type == 'boolean'"
                  v-model="latencyTrackingSettings[subitem.name]"
                ></el-switch>
                <el-input v-model="latencyTrackingSettings[subitem.name]" v-else></el-input>-->
                <el-switch
                  v-if="subitem.type == 'boolean'"
                  v-model="latencyTrackingSettings[subitem.name]"
                  @change="changeSetting(subitem, latencyTrackingSettings[subitem.name])"
                ></el-switch>
                <el-input
                  v-model="latencyTrackingSettings[subitem.name]"
                  v-if="(subitem.type == 'String'||subitem.type == 'long' || subitem.type == 'int')&&!isArray(subitem.values)"
                ></el-input>

                <el-select
                  v-if="(subitem.type == 'String'||subitem.type == 'long')&&isArray(subitem.values)"
                  v-model="latencyTrackingSettings[subitem.name]"
                  placeholder="请选择"
                  @change="getFormItemByType(form.type)"
                >
                  <el-option
                    v-for="(item, index) in subitem.values"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="setCurrentStep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import {
  steplist,
  stepsettings,
  runtimeSettings,
  creatscheduler
} from "@server/realtime/index";
import { setUpWatchersUtils, setFormDataUtils } from "@components/utils/index";
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
import moment from "moment";
import tableColumn from "./table/index";
export default {
  watch: {
    data(val) {
      this.form = {
        ...this.form,
        name: val.flowName + moment().format()
      };
    }
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: {
    tableColumn
  },
  data: function() {
    return {
      itemList: [
        {
          name: "name",
          value: ""
        }
      ],
      labelPosition: "left",
      form: {
        name: ""
      },
      ruleForm: {
        //定义表单验证字段
        newName: "" //节点名称
      },
      rules: {
        //节点表单验证
        newName: [
          //新名称验证
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            max: 100,
            message: "显示名称，最长100",
            trigger: "blur"
          }
        ]
      },
      activeNames: ["1"],
      adFormDdata: [],
      formItemList: [],
      allformItemList: [],
      runtimeSettingsData: [],
      checkpointSettingsData: [],
      restartStrategySettingsData: [],
      latencyTrackingSettingsData: [],
      adformItemData: [],
      checkpointSettings: {},
      runtimeSettings: {},
      restartStrategySettings: {},
      latencyTrackingSettings: {},
      kerberosEnable: false,
      adformlist: {
        checkpointSettings: this.checkpointSettings,
        runtimeSettings: this.runtimeSettings,
        restartStrategySettings: this.restartStrategySettings,
        latencyTrackingSettings: this.latencyTrackingSettings
      }
    };
  },
  computed: {
    ...mapState(["realtime"])
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
    ...mapActions(["setParamertData"]),
    isArray(val) {
      return isArray(val);
    },
    initAdForm(key, value) {
      // this.setAdFormItemValue(key, value);

      if (key == "runtimeSettings") {
        forEach(value, item => {
          this.$set(this.runtimeSettings, item.name, item.defaultValue);
        });
      }
      if (key == "checkpointSettings") {
        forEach(value, item => {
          this.$set(this.checkpointSettings, item.name, item.defaultValue);
        });

        // console.log("this.checkpointSettings", this.checkpointSettings);
        // forEach(value, item => {
        //   console.log(item.name, item.defaultValue);
        //   this.$set(
        //     this.checkpointSettings,
        //     item.name,
        //     item.name == "checkpointEnable" ? true : item.defaultValue
        //   );
        // });

        // console.log("this.checkpointSettings", this.checkpointSettings);
      }
      if (key == "restartStrategySettings") {
        //this.restartStrategySettings[item.name] = item.defaultValue;
        forEach(value, item => {
          //this.restartStrategySettings[item.name] = item.defaultValue;
          this.$set(this.restartStrategySettings, item.name, item.defaultValue);
        });
      }
      if (key == "latencyTrackingSettings") {
        //this.latencyTrackingSettings[item.name] = item.defaultValue;
        forEach(value, item => {
          //this.latencyTrackingSettings[item.name] = item.defaultValue;
          this.$set(this.latencyTrackingSettings, item.name, item.defaultValue);
        });
      }

      forEach(value, item => {
        if (this.runtimeSettings[item.scope]) {
          item["isShow"] = this.scopeBind(this.runtimeSettings, item);
        } else if (this.checkpointSettings[item.scope]) {
          //item["isShow"] = this.scopeBind(this.checkpointSettings, item);
          item["isShow"] = true;
        } else if (this.restartStrategySettings[item.scope]) {
          item["isShow"] = this.scopeBind(this.restartStrategySettings, item);
        } else if (this.latencyTrackingSettings[item.scope]) {
          item["isShow"] = this.scopeBind(this.latencyTrackingSettings, item);
        } else {
          item["isShow"] = true;
        }
      });
    },
    getTabeleData(val) {
      if (val == "runtimeSettings") {
        return this.runtimeSettingsData;
      }
      if (val == "restartStrategySettings") {
        return this.restartStrategySettingsData;
      }
      if (val == "latencyTrackingSettings") {
        return this.latencyTrackingSettingsData;
      }
      if (val == "checkpointSettings") {
        return this.checkpointSettingsData;
      }
    },
    modifyTableData(val) {
      if (val.key == "runtimeSettings") {
        this.runtimeSettingsData = val.value;
      }
      if (val.key == "restartStrategySettings") {
        this.restartStrategySettingsData = val.value;
      }
      if (val.key == "latencyTrackingSettings") {
        this.latencyTrackingSettingsData = val.value;
      }
      if (val.key == "checkpointSettings") {
        this.checkpointSettingsData = val.value;
      }
    },
    setCurrentStep() {
      // console.log(this.form);

      // return;
      this.closeDialog();
      // let parametData = this.realtime.parametData;
      // delete parametData.name;
      // let itemList = map(parametData, (value, key) => {
      //   let result = {};
      //   result[key] = value;
      //   return result;
      // });

      this.$emit("setRuntimeSettingsdialogOption", {
        ...this.data,
        itemList: {
          ...this.form,
          runtimeSettings: this.runtimeSettings,
          checkpointSettings: this.checkpointSettings,
          restartStrategySettings: this.restartStrategySettings,
          latencyTrackingSettings: this.latencyTrackingSettings
        },
        name: this.form.name
      });

      //this.setParamertData({});
    },
    closeDialog() {
      this.data.dialogVisible = false;
    },
    handleClick(tab, event) {
      //   console.log(tab, event);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          data.dialogVisible = false;
          done();
        })
        .catch(_ => {});
    },
    showDailog() {
      this.itemList = [];
      runtimeSettings().then(
        data => {
          this.setFormData(data.data);

          //console.log('data.data',data.data);

          // this.itemList = [...this.itemList, ...data.data.runtime];
          // delete data.data.runtime;
          // this.adFormDdata = _.map(data.data, (value, key) => {
          //   return { key: key, value: value };
          // });

          // let allformIitem = [...this.itemList];

          // _.forEach(data.data, (value, key) => {
          //   //_.concat(allformIitem, value);
          //   allformIitem = [...allformIitem, ...value];
          // });

          // _.forEach(allformIitem, val => {
          //   this.form[val.name] = val.value;
          // });
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
    getValueByName(data, val) {
      let result = "";
      forEach(data, (value, key) => {
        if (value.name == val) {
          result = value.defaultValue;
        }
      });

      return result;
    },
    filterFormItem(val, format) {
      return map(val, item => {
        return {
          ...item
          //   isshow: this.isshow(item, format)
        };
      });
    },
    initForm(val) {
      this.form = {
        ...this.form,
        ...val
      };
    },
    getFormItemData(formItem, data) {
      let result = {};
      forEach(formItem, item => {
        forEach(data, (subitem, key) => {
          if (key == item.name) {
            result[key] = subitem;
          }
        });
      });

      return result;
    },

    setFormData(val) {
      //表单全部项
      this.allformItemList = this.filterFormItem(val, "");
      //表单高级选项
      this.adformItemList = filter(this.allformItemList, item => {
        //return item.advanced;
        if (isArray(item.type)) {
          return item;
        }
      });

      //console.log("this.adformItemList ", this.adformItemList);
      //表单基本项
      this.formItemList = difference(this.allformItemList, this.adformItemList);
      //初始化基本表单数据
      forEach(this.formItemList, item => {
        this.$set(this.form, item.name, item.defaultValue);
      });

      // this.adformItemData = map(this.adformItemList, item => {
      //   return {
      //     key: item.name,
      //     value: item.type
      //   };
      // });

      this.adformItemData = map(this.adformItemList, item => {
        return {
          key: item.name,
          //value: item.type
          value: map(cloneDeep(item.type), subitem => {
            return {
              ...subitem,
              defaultValue:
                subitem.type == "boolean"
                  ? eval(subitem.defaultValue.toLowerCase())
                  : subitem.defaultValue
            };
          })
        };
      });
      //初始化高级表单

      forEach(this.adformItemData, (value, key) => {
        this.initAdForm(value.key, value.value);
      });
      //this.adformItemData = adformItemDataTest;

      // let data = this.realtime.initParametData;

      // this.allformItemData = this.setallformItemData(data);

      // console.log("this.allformItemData ", this.allformItemData);

      // this.adformItemData = this.getFormItemData(
      //   this.adformItemList,
      //   this.allformItemData
      // );

      //初始化表单数据
      // this.initForm({
      //   ...this.form,
      //   ...this.setallformItemData(data)
      // });

      // forEach(this.adformItemData, val => {
      //   this.form[val.key] = map(val.value, item => {
      //     let result = {};
      //     result[item.name] = item.defaultValue;
      //     return result;
      //   });
      // });

      //高级选项数据初始化

      //针对 form format item,动态控制显示与format数据
      // this.formItemList = this.filterFormItem(
      //   this.formItemList,
      //   this.form.format
      // );

      //add dynamic watched

      // let formkeys = mapKeys(this.form, function(value, key) {
      //   return "form." + key;
      // });

      // //注销 watch
      // forEach(this.unWatchlist, unWatch => {
      //   unWatch();
      // });
      // this.unWatchlist = [];

      // setUpWatchersUtils(
      //   keys(formkeys),
      //   keys(this.form),
      //   this.unWatchlist,
      //   this.form,
      //   (watchItem, newValue, formData) => {
      //     this.setParamertData(formData);
      //   },
      //   this
      // );
    },
    /*
     * 初始化表单时调用
     * 根据参数作用域与绑定值判断该参数是否显示
     * */
    scopeBind: function(settings, item) {
      if (!item.scope) {
        return true;
      }
      let settingScope = item.scope;
      let scopeKeyValue = settings[settingScope];
      if (scopeKeyValue === item.bind) {
        return true;
      } else {
        return false;
      }
    },
    /*
     * 更改某个开关值调用
     * */
    changeSetting: function(item, newValue) {
      this.isShow(item, newValue);
    },
    /*
     * 更改表单时调用
     * 根据参数作用域与绑定值判断该参数是否显示
     * */
    isShow: function(item, newValue) {
      let finded = false;
      forEach(this.adformItemData, settingItems => {
        forEach(settingItems.value, settingItem => {
          if (settingItem.scope === item.name) {
            if (settingItem.bind === newValue.toString()) {
              settingItem.isShow = true;
            } else {
              settingItem.isShow = false;
            }
            finded = true;
          }
        });
        /*
         * 避免无用的迭代，损耗性能
         * */
        if (finded) {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.step-dialog {
  .elForm {
    margin: 0px 0px 10px 0px;
  }

  .priorityMes {
    position: absolute;
    top: 13px;
    color: #333;
    left: -20px;
  }

  .advanced-options {
    width: 100%;
    // text-align: center;
    color: #3e98fe;
    margin: 0px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
