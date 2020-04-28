<template>
  <div class="sink-step">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item
        :label="'dataset'"
        :rules="[{ required: true, message: '', trigger: 'blur' }]"
      >
        <el-tooltip
          lass="item"
          effect="dark"
          content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合"
          placement="top"
        >
          <i class="parIcon el-icon-warning"></i>
        </el-tooltip>
        <el-input
          placeholder="请选择内容"
          v-model="form.datasetName"
          :model="form.datasetName"
          :disabled="true"
          name="dataset"
        >
          <el-button
            slot="append"
            icon="icon iconfont icon-ir-search"
            @click="selectDataset"
            name="dataSetInq"
          ></el-button>
        </el-input>
        <p class="sign" v-if="!form.datasetName">选择内容不能为空</p>
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
        <el-tooltip
          lass="item"
          effect="dark"
          :content="item.description ? item.description : item.name"
          placement="top"
        >
          <i class="parIcon el-icon-warning"></i>
        </el-tooltip>

        <el-select
          v-if="item.name == 'type'"
          v-model="form.type"
          placeholder="请选择"
          @change="getFormItemByType(form.type)"
        >
          <el-option v-for="(item, index) in item.values" :key="index" :label="item" :value="item"></el-option>
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
    <adItem
      :data="{ adformItemList: adformItemList, adformItemData: adformItemData }"
      @setfilterFormItem="setfilterFormItem"
    ></adItem>
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
  difference
} from "lodash";
import adItem from "./common/index";
import { setUpWatchersUtils, setFormDataUtils } from "@components/utils/index";
export default {
  watch: {
    "realtime.setStepData"(val) {
      this.setFormData(val);
    },
    "realtime.initParametData"(val) {
      this.initForm(val);
      //this.getFormItemByType(this.form.type);
    },
    //选择 dataset 时初始化表单 dataset id ,name
    "realtime.selectCheckedDataSet"(val) {
      this.initForm({
        datasetEntity:val,
        datasetName: val.datasetName,
        schemaId: val.schemaId,
        type: val.storage
      });
    },
    form(val) {
      this.setParamertData(val);
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
      form: {
        // type: "hdfs"
      },
      formatData: ["csv", "parquet"],
      typeData: ["HDFS", "kafka"], //kafka
      formItemList: [],
      adformItemList: [],
      allformItemList: [],
      formItemData: [],
      adformItemData: {},
      allformItemData: [],
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
  destroyed: function() {},
  methods: {
    ...mapActions([
      "openDialog",
      "setParamertData",
      "modifyLoadingStatus",
      "getStepConfiug"
    ]),

    selectDataset() {
      //this.dialogDataSetVisible = true;
      this.openDialog(true);
    },
    initForm(val) {
      this.form = val;
    },
    setfilterFormItem(newValue) {
      this.formItemList = this.filterFormItem(this.formItemList, newValue);
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
            this.setParamertData(formData);
            if (watchItem == "form.format") {
              this.setfilterFormItem(newValue);
            }
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
        (val.name == "nullValue" && format != "csv")
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
      stepsettings("sink_" + val).then(
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
.sink-step {
  .sign {
    margin: 0px;
    color: red;
    padding: 0px;
    font-size: 8px;
  }
}
</style>
