<template>
    <li class="rule-container">
        <el-form
            :inline="true"
            class="demo-form-inline"
            size="small"
            :model="rule"
        >
            <el-form-item>
                <el-select
                  v-model="rule.name"
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
                v-model="rule.oper"
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
                v-model="rule.value"
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
                v-model="rule.value"
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
                v-model="rule.value"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                />
            </el-form-item>
        </el-form>
        <el-button
            type="warning"
            plain
            size="mini"
            round
            @click="delFeilds(rule, parentdata)"
        >
            删除
        </el-button>
    </li>
</template>
<script>
export default {
  inject: ['delFeilds'],
  props: {
    tableTitle: {
      type: Array,
      default: () => [
        {
            prop: 'name',
            label: '名称',
        }, {
            prop: 'storage',
            label: '类型',
        }, {
            prop: 'recordNumber',
            label: '记录数',
        }, {
            prop: 'lastModifiedTime',
            label: '修改时间',
            align: 'left'
        }
      ]
    },
    interFace: {
      type: String,
      default: '/api/datasets'
    },
    rule: {
      type: Object,
      default: () => {}
    },
    parentdata:{
      type: Array,
      default: () => [1,2,3]
    }
  },
  data () {
    return {
      check: [
            {
                label: 'AND',
                value: 'AND'
            }, {
                label: 'OR',
                value: 'OR'
            }
      ],
      logicalOperator: true,
      type: '',
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
        inputOption: [
        ],
      }
  },
    created () {
        this.type = 'countless'
        this.SQL = this.isContain
    },
  methods: {
    changeSQL (label, value) {
      this.label = label
      this.value = value
    },
    async titleChange () {
        // 清空 select 的值
        this.rule.oper = ''
        this.rule.value = []
        let res = await this.$https.search(this.interFace, {field: this.rule.name})
        // 可枚举
        // 可枚举
        if ((res.type === 'class java.lang.String' || res.type === 'int' || res.type === 'long') &&  res.values) {
            this.inputOption = res.values
            this.type = 'enumerable';
            this.SQL = this.isEqual;
            this.$set(this.rule, 'oper', 'EQUAL')
        // 不可枚举 需要输入
        }else if((res.type === 'class java.lang.String' || res.type === 'int' || res.type === 'long') && !res.values){
            this.type = 'countless';
            this.SQL = this.isContain;
            this.$set(this.rule, 'oper', 'LIKE')
        // 日期
        }else if (res.type === 'class java.util.Date') {
            this.type = 'date'
        }
    },
    // 查看是可枚举的
    changeOptions (item) {
      if (item.options) {
        this.inputOption = item.options
      } else {
        this.inputOption = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    .rule-container{
        display: flex;
        position: relative;
        margin-top: 10px;
        margin-left: 12px;
        border-radius: 5px;
        padding: 5px;
        border: 1px solid #EEE;
        &::before, &:not(:last-of-type):after{
            content: '';
            position: absolute;
            left: -7px;
            width: 10px;
            border-color: #CCC;
            border-style: solid;
            border-radius: 0 0 0 4px;
            border-width: 0 0 2px 2px;
            height: calc(50% + 11px);
            top: -12px;
        }
        &:not(:last-of-type):after{
            border-width: 0 0 0 2px;
            top: 50%;;
            height: calc(50% + 3px);
        }
        .el-form{
            margin-right: auto;
        }
        .el-form-item {
            margin-bottom: 0;
        }
    }
</style>
