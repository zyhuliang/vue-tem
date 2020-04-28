<template>
  <div class="lookup-card">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      editable
      @edit="handleTabsEdit"
      ref="cardTabs"
      @tab-click="clickCurrentTab(editableTabsValue)"
    >
      <el-tab-pane
        :key="editableTabsIndex"
        v-for="(editableTabsItem, editableTabsIndex) in data.editableTabs"
        :label="editableTabsItem.title"
        :name="editableTabsItem.name"
        closable
      >
        <el-form ref="form" :model="editableTabsItem.form" label-width="150px">
          <el-form-item
            :label="'dataset'"
            :rules="[
              { required: true, message: '', trigger: 'blur' }
            ]"
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
              v-model="editableTabsItem.form['datasetName']"
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
            <p class="sign" v-if="!editableTabsItem.form['datasetName']">选择内容不能为空</p>
          </el-form-item>

          <!-- <el-form-item
            :prop="subitem.name"
            :label="subitem.name"
            v-for="(subitem,index) in  data.cardFormItemList"
            :key="index"
            :rules="{
                required: true, message: '', trigger: 'blur'
              }"
          >
            <el-tooltip
              lass="item"
              effect="dark"
              :content="subitem.description ? subitem.description : subitem.name"
              placement="top"
            >
              <i class="parIcon el-icon-warning"></i>
            </el-tooltip>
            <el-select
              v-model="editableTabsItem.form[subitem.name]"
              placeholder="请选择"
              @change="getCardData(subitem.name,editableTabsItem.form[subitem.name])"
              :disabled="!editableTabsItem.form['datasetName']"
            >
              <el-option
                v-for="(subselectitem,subselectitemindex) in subitem.values"
                :key="subselectitemindex"
                :label="subselectitem"
                :value="subselectitem"
              ></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item
            :prop="subitem.name"
            :label="subitem.name"
            v-for="(subitem,index) in data.cardFormItemList"
            :key="index+editableTabsValue"
            :rules="{
                required: true, message: '', trigger: 'blur'
              }"
          >
            <el-tooltip
              lass="item"
              effect="dark"
              :content="subitem.description ? subitem.description : subitem.name"
              placement="top"
            >
              <i class="parIcon el-icon-warning"></i>
            </el-tooltip>
            <el-input
              v-if="(subitem.type=='String'||subitem.type=='long'||subitem.type=='char')&&!subitem.values&&subitem.name!='key'"
              v-model="editableTabsItem.form[subitem.name]"
              :validate-event="false"
              @keyup.native="getCardData(subitem.name,editableTabsItem.form[subitem.name])"
              :disabled="subitem.name=='rule'"
            ></el-input>
            <el-select
              v-if="subitem.name=='key'"
              v-model="editableTabsItem.form[subitem.name]"
              placeholder="请选择"
              @change="getCardData(subitem.name,editableTabsItem.form[subitem.name])"
            >
              <el-option
                v-for="(subselectitem,subselectitemindex) in data.KeyData"
                :key="subselectitemindex"
                :label="subselectitem.key"
                :value="subselectitem.value"
              ></el-option>
            </el-select>
            <el-switch v-if="subitem.type=='boolean'" v-model="editableTabsItem.form[subitem.name]"></el-switch>
            <vtable
              v-if="subitem.name=='values'"
              :data="{type:subitem.type,editableTabsValue:editableTabsValue,editableTabs:data.editableTabs,schemaData:schemaData}"
              @modifyEditableTabs="modifyEditableTabs"
            ></vtable>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
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
  differencem,
  find
} from "lodash";
import { setUpWatchersUtils, setFormDataUtils } from "@components/utils/index";
import vtable from "./table.vue";
import { throwStatement, thisExpression } from "@babel/types";
export default {
  computed: {
    ...mapState(["realtime"])
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  components: { vtable },
  data: function() {
    return {
      cardFormItemList: [],
      schemaData: [],
      labelPosition: "left", //表单域标签的位置
      commFormItem: [
        {
          label: "mode",
          prop: "mode",
          mode: "ruleForm.mode",
          selectData: [
            { label: "mapping", value: "mapping" },
            { label: "chain", value: "chain" }
          ]
        }
      ],
      rules: {
        //节点表单验证
        mode: [
          {
            required: true
          }
        ],
        cachengine: [
          {
            required: true
          }
        ]
      },
      form: {
        url: this.data.ruleUrl
      },

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
      tabIndex: 0
    };
  },
  mounted() {
    this.tabIndex = this.data.editableTabs.length - 1;
    // this.getschemaData(this.editableTabsValue);
    console.log("mounted ", this.schemaData);
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {
    this.$nextTick(() => {
      //console.log(" this.$nextTick(() => { card",this.data.editableTabs);
      this.$emit(
        "modifyParameData",
        this.data.parentForm,
        this.data.editableTabs
      );

      this.getschemaData(this.editableTabsValue);
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
      "initParametData"
    ]),
    clickCurrentTab(val) {},
    getschemaData(val) {
      let result = find(this.data.editableTabs, item => {
        return item.name == val;
      });
      this.schemaData = result ? result.form.fields : [];
    },
    getCardData(key, value) {
      this.$emit("modifyEditableTabs", this.data.editableTabs);

      if (key == "type") {
        this.$emit("getFormItemByType", value);
      }
    },
    modifyEditableTabs(val) {
      this.$emit("moodifyeditableTabsData", val);
    },
    handleTabsEdit(targetName, action) {
      let editableTabs = [];
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        let editableTabsTotal = this.data.editableTabs.length;
        editableTabs = [
          ...this.data.editableTabs,
          {
            title:
              editableTabsTotal == 0 ? "Rules" : "Rules" + editableTabsTotal,
            name: newTabName,
            form: {
              ...cloneDeep(this.data.cardForm),
              rule:
                editableTabsTotal == 0 ? "Rules" : "Rules" + editableTabsTotal,
              ...this.data.ruleFormData,
              datasetName: "",
              type: ""
            }
          }
        ];
        this.$emit("moodifyeditableTabsData", editableTabs);
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        --this.tabIndex;
        let tabs = this.data.editableTabs;
        editableTabs = tabs.filter(tab => tab.name !== targetName);
        let activeName = editableTabs.length - 1;

        this.editableTabsValue = activeName.toString();

        this.$emit(
          "moodifyeditableTabsData",
          map(editableTabs, (value, key) => {
            return {
              ...value,
              title: key == 0 ? "Rules" : "Rules" + key,
              name: key.toString(),
              form: {
                ...value.form,
                rule: key == 0 ? "Rules" : "Rules" + key
              }
            };
          })
        );
      }

      this.getschemaData(this.editableTabsValue);
    },
    selectDataset() {
      this.openDialog(true);
    },
    initForm(val) {
      this.form = { ...this.form, ...val };
      //this.form = val;
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
        err => {}
      );
    }
  }
};
</script>

<style lang="scss">
.lookup-card {
  .elForm {
    margin: 0px 0px 10px 0px;
  }
  .sign {
    margin: 0px;
    color: red;
    padding: 0px;
    font-size: 8px;
  }
}
</style>
