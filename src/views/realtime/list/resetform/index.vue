<template>
  <div class="step-dialog">
    <el-form
      class="elForm"
      ref="form"
      :model="form"
      label-width="250px"
      :label-position="labelPosition"
    >
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
          >
            <el-tooltip class="priorityMes" placement="top" effect="dark">
              <div slot="content">{{ subitem.description ? subitem.description : subitem.name }}</div>
              <i class="el-icon-info"></i>
            </el-tooltip>
            <div v-show="item.key=='runtimeSettings'">
              <el-switch v-if="subitem.type == 'boolean'" v-model="runtimeSettings[subitem.name]"></el-switch>
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
              <el-switch
                v-if="subitem.type == 'boolean'"
                v-model="restartStrategySettings[subitem.name]"
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
              <el-switch
                v-if="subitem.type == 'boolean'"
                v-model="latencyTrackingSettings[subitem.name]"
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
import allformItemList from "./data/index.json";
export default {
  watch: {
    data(val) {
      this.form = {
        ...val.resetformdata
      };
      this.formItemList = val.formItemList;
      this.adformItemList = val.adformItemList;
      this.setFormData("");
    },
    form(val){
      console.log('form(val){',val);
    }
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: {},
  data: function() {
    return {
      itemList: [{ name: "name", value: "" }],
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
          this.$set(this.runtimeSettings, item.name, this.form["runtimeSettings"][item.name]);
        });
      }
      if (key == "checkpointSettings") {
        forEach(value, item => {
          // this.$set(this.checkpointSettings, item.name, item.defaultValue);
           this.$set(this.checkpointSettings, item.name, this.form["checkpointSettings"][item.name]);
        });
      }
      if (key == "restartStrategySettings") {
        //this.restartStrategySettings[item.name] = item.defaultValue;
        forEach(value, item => {
          //this.restartStrategySettings[item.name] = item.defaultValue;
          this.$set(this.restartStrategySettings, item.name, this.form["restartStrategySettings"][item.name]);
        });
      }
      if (key == "latencyTrackingSettings") {
        //this.latencyTrackingSettings[item.name] = item.defaultValue;
        forEach(value, item => {
          //this.latencyTrackingSettings[item.name] = item.defaultValue;
          this.$set(this.latencyTrackingSettings, item.name, this.form["latencyTrackingSettings"][item.name]);
        });
      }
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
      this.form = { ...this.form, ...val };
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
      this.adformItemData = map(this.adformItemList, item => {
        return {
          key: item.key,
          value: item.value
        };
      });

      console.log("adformItemData",this.adformItemData);

      //初始化高级表单

      forEach(this.adformItemData, (value, key) => {
        this.initAdForm(value.key, value.value);
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
