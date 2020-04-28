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
    >
      <el-form ref="form" :model="form" label-width="150px">
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
          v-if="item.isshow"
        >
          <el-tooltip lass="item" effect="dark" :content="item.name" placement="top">
            <i class="parIcon el-icon-warning"></i>
          </el-tooltip>

          <el-select
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
          </el-select>

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
  difference
} from "lodash";
import moment from "moment";
export default {
  watch: {
    data(val) {
      this.form = { ...this.form, name: val.flowName + moment().format() };
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
      allformItemList: []
    };
  },
  computed: {
    // ...mapState(["realtime"])
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
    // ...mapActions([]),
    setCurrentStep() {
      this.closeDialog();

      this.$emit("setRuntimeSettingsdialogOption", {
        ...this.data,
        itemList: this.itemList,
        name: this.form.name
      });
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
          console.log(data.data);
          //   this.itemList = [...this.itemList, ...data.data.runtime];
          //   delete data.data.runtime;
          //   this.adFormDdata = _.map(data.data, (value, key) => {
          //     return { key: key, value: value };
          //   });
          //   let allformIitem = [...this.itemList];
          //   _.forEach(data.data, (value, key) => {
          //     //_.concat(allformIitem, value);
          //     allformIitem = [...allformIitem, ...value];
          //   });
          //   _.forEach(allformIitem, val => {
          //     this.form[val.name] = val.value;
          //   });
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
      //表单全部项
      this.allformItemList = this.filterFormItem(val, "");
      //表单高级选项
      this.adformItemList = filter(this.allformItemList, item => {
        return item.advanced;
      });
      //表单基本项
      this.formItemList = difference(this.allformItemList, this.adformItemList);

      let data = {};

      this.allformItemData = this.setallformItemData(data);

      this.adformItemData = this.getFormItemData(
        this.adformItemList,
        this.allformItemData
      );

      //初始化表单数据
      this.initForm({
        ...this.setallformItemData(data),
        ...this.form
      });

      //针对 form format item,动态控制显示与format数据
      this.formItemList = this.filterFormItem(
        this.formItemList,
        this.form.format
      );

      //add dynamic watched

      let formkeys = mapKeys(this.form, function(value, key) {
        return "form." + key;
      });

      //注销 watch
      forEach(this.unWatchlist, unWatch => {
        unWatch();
      });
      this.unWatchlist = [];

      setUpWatchersUtils(
        keys(formkeys),
        keys(this.form),
        this.unWatchlist,
        this.form,
        (watchItem, newValue, formData) => {
            console.log("formData",formData);
          //this.setParamertData(formData);
        },
        this
      );
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
