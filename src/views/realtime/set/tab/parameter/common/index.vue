<template>
  <div>
    <el-collapse accordion v-show="isShowAd">
      <el-collapse-item>
        <template slot="title">
          <h3 class="advanced-options">
            <i class="fa fa-sort-amount-asc"></i>&nbsp;&nbsp;高级选项
          </h3>
        </template>
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
            <!-- 计数器 -->
            <el-input-number
              v-if="item.type == 'int'"
              v-model="form[item.name]"
              :min="1"
              :max="100"
              @change="changeFormItem(item, form[item.name])"
            ></el-input-number>
            <!-- <el-input
              v-if="(item.type=='String'||item.type=='char')&&!item.values"
              v-model="form[item.name]"
              @change="changeFormItem(item,form[item.name])"
            ></el-input>-->

            <el-input
              v-if="
                (item.type == 'String' || item.type == 'char') && !item.values
              "
              v-model="form[item.name]"
              @keyup.native="changeFormItem(item, form[item.name])"
            ></el-input>
            <el-select
              v-if="item.type == 'String' && item.values"
              v-model="form[item.name]"
              placeholder="请选择"
              @change="changeFormItem(item, form[item.name])"
            >
              <el-option
                v-for="(subitem, subindex) in item.values ? item.values : ''"
                :key="subindex"
                :label="subitem"
                :value="subitem"
              ></el-option>
            </el-select>
            <el-switch
              v-if="item.type == 'boolean'"
              v-model="form[item.name]"
              @change="changeFormItem(item, form[item.name])"
            ></el-switch>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
  watch: {
    "data.adformItemList"(val) {
      this.formItemList = val;
      if (val.length == 0) {
        this.isShowAd = false;
      } else {
        this.isShowAd = true;
      }
    },
    "data.adformItemData"(val) {
      this.form = val;
      this.setfilterFormItem();
    }
    // "form.parallelism"(val) {
    //   // this.setParamertData({
    //   //   ...this.form,
    //   //   parallelism: val
    //   // });
    // }
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
      isShowAd: true,
      form: {},
      formItemList: []
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
    filterFormItem(val) {
      return _.map(val, item => {
        return {
          ...item,
          isshow: this.scopeBind(this.realtime.setStepData, item)
        };
      });
    },
    setfilterFormItem() {
      this.formItemList = this.filterFormItem(this.formItemList);
    },
    changeFormItem(item, val) {
      this.setParamertData(
        this.getParamertData(this.realtime.parametData, val, item.name)
      );

      console.log("item.name", item.name);
      this.setfilterFormItem(val);
    },
    getParamertData(data, val, key) {
      let result = {};
      _.forEach(data, (subvalue, subkey) => {
        result[subkey] = subkey == key ? val : subvalue;
      });
      return result;
    },
    /*
    * 根据参数作用域与绑定值判断该参数是否显示
    * */
    scopeBind: function(stepSettings, item) {
      if (!item.scope) {
        return true;
      }
      let settingScope = item.scope;
      let scopeKeyValue = this.form[settingScope] ? this.form[settingScope] : this.$parent.form[settingScope];
      if (scopeKeyValue === item.bind) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss"></style>
