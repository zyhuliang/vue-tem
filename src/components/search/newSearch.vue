<template>
  <div class="search">
    <div class="top">
      <el-form
        :inline="true"
        class="demo-form-inline"
        size="small"
      >
        <el-form-item>
          <el-select
            v-model="title"
            placeholder="请选择"
            @change="titleChange"
          >
            <el-option
              v-for="item in tableTitle"
              :key="item.prop"
              :label="item.label"
              :value="item.prop"
              @click="changeOptions(item)"
            >
              <span
                style=" display: block;width: 100%;position: absolute;left: 0;right: 0;padding: 0 20px"
                @click="changeOptions(item)"
              >
                {{ item.label }}
              </span>
              <span style="position: absolute; right: 20px;top: 0;color: #8492a6; font-size: 13px">
                {{ item.prop }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- SQL -->
        <el-form-item>
          <el-select
            v-if="type !== 'date'"
            v-model="contain"
            placeholder="请选择"
          >
            <el-option
              v-for="item in SQL"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span
                style=" display: block;width: 100%;position: absolute;left: 0;right: 0;padding: 0 20px"
                @click="changeSQL(item.label, item.value)"
              >
                {{ item.label }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-if="type === 'countless'"
            v-model="inputTag"
            class="select-multiple"
            style="display: block"
            placeholder="请选择"
            multiple
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="item in inputOption"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <!-- 下拉框多选 -->
        <el-form-item>
          <el-select
            v-if="type === 'enumerable'"
            v-model="inputTag"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in inputOption"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <!-- 日期选择 -->
        <el-form-item>
          <el-date-picker
            v-if="type === 'date'"
            v-model="inputTag"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="btn">
        <el-switch
          v-model="logicalOperator"
          style="display: inline-block"
          active-color="#67C23A"
          inactive-color="#ff4949"
          active-text="与"
          inactive-text="或"
        /> 
        <el-button
          type="primary"
          plain
          icon="el-icon-circle-plus"
          class="add-rule"
          size="mini"
          @click="addRule"
        >
          添加规则
        </el-button>
        <el-button
          type="danger"
          plain
          icon="el-icon-remove"
          class="add-rule"
          size="mini"
          @click="empty"
        >
          清空
        </el-button>
        <el-button
          type="success"
          icon="el-icon-search"
          class="add-rule"
          size="mini"
          @click="search"
        >
          搜索
        </el-button>
      </div>
    </div>

    <!-- 显示 -->
    <criteria
      :criteria="tag"
      @deleteTag="deleteTag"
    />
  </div>
</template>
<script>
import { createParameter, queryObject } from '@components/function/queryParameter.js'
import Criteria from '@components/search/criteria'
import { tableSearch } from '@api'
import moment from "moment"//时间格式化

export default {
  name: 'Search',
  components: {
    Criteria
  },
  props: {
    tableTitle: {
      type: Array,
      default: () => []
    },
    interFace: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: '',
      title: '',
      contain: '',
      SQL: '',
      isEqual: [
        {
          value: 'EQUAL',
          label: '等于'
        },
        {
          value: 'NOT_EQUAL',
          label: '不等于'
        }
      ],
      isContain: [
        {
          value: 'LIKE',
          label: '包含'
        },
        {
          value: 'NOT_LIKE',
          label: '不包含'
        }
      ],

      inputTag: [],
      inputOption: [
      ],
      tag: [],
      logicalOperator: true,
      parameter: queryObject()
    }
  },
  created () {
    this.type = 'countless'
    this.SQL = this.isContain
  },
  methods: {
    titleChange () {
      // 清空 select 的值
      this.contain = ''
      this.inputTag = []
      tableSearch(this.interFace, {field: this.title})
      .then( (res) => {
        // 可枚举
        if ((res.type === 'class java.lang.String' || res.type === 'int' || res.type === 'long') &&  res.values) {
          this.inputOption = res.values
          this.type = 'enumerable';
          this.SQL = this.isEqual;
        // 不可枚举 需要输入
        }else if((res.type === 'class java.lang.String' || res.type === 'int' || res.type === 'long') && !res.values){
          this.type = 'countless';
          this.SQL = this.isContain;
        // 日期
        }else if (res.type === 'class java.util.Date') {
          this.type = 'date'
        }
      })
    },

    // 查看是可枚举的
    changeOptions (item) {
      if (item.options) {
        this.inputOption = item.options
      } else {
        this.inputOption = []
      }
    },
    deleteTag (index) {
      this.tag.splice(index, 1)
    },
    changeSQL (label, value) {
      this.label = label
      this.value = value
    },
    addRule () {
      // 可枚举 和 不可枚举 值
      if (this.title && this.contain && this.inputTag.length) {
        this.tag.push({
          title: this.title,
          contain: this.contain,
          label: this.label,
          value: this.value,
          inputTag: this.inputTag,
          showInputTag: this.inputTag,
          logicalOperator: this.logicalOperator
        })
        this.title = ''
        this.inputTag = []
      } else if (this.title && this.inputTag.length) { // 日期
        this.tag.push({
          title: this.title,
          inputTag: this.inputTag,
          showInputTag: [moment(this.inputTag[0]).format("YYYY-MM-DD"), moment(this.inputTag[1]).format("YYYY-MM-DD")],
          logicalOperator: this.logicalOperator
        })
      }
      this.title = ''
      this.inputTag = []
      this.contain = ''
    },
    // 清空
    empty () {
      this.tag = []
    },

    async search () {
      this.addRule()
      this.parameter = queryObject()
      if (!this.tag.length) {
        this.$message.error('都是必填不能为空！！！')
        return
      }
      for (let item of this.tag) {
        let logicalOperator = item.logicalOperator ? 'AND' : 'OR'
        for (let value of item.inputTag) {
          // 如果 是输入的值 需要添加 百分号
          if (item.contain === 'LIKE' || item.contain ==='NOT_LIKE') {
            this.parameter = createParameter(item.title, `%${value}%`, item.contain, logicalOperator).Build(this.parameter)
          } else if (!item.contain) {
            // 如果不存在说明是日期
            this.parameter = createParameter(item.title, item.inputTag[0], 'GREATER_THAN', logicalOperator).Build(this.parameter)
            this.parameter = createParameter(item.title, item.inputTag[1]+86399000, 'LESS_THAN', logicalOperator).Build(this.parameter)
            break
          } else {
            // 多选的时候是 or
            let logicalOperator =  item.inputTag.length > 1 ? 'OR' : 'AND'
            this.parameter = createParameter(item.title, value, item.contain, logicalOperator).Build(this.parameter)
          }
        }
      }
      this.$emit('searchTag', this.tag, this.parameter, this.empty)
    }
  }
}
</script>
<style lang="scss" scoped>
.search{
  .top{
    display:flex;
    align-items: center;
  }
  .select-multiple{
    width: 350px;
    .el-select{
      display: block;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
