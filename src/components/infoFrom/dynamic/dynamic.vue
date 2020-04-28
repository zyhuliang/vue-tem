<template>
  <el-form-item
    :label="row.label"
    :prop="row.model"
  >
    <el-form
      ref="dynamicValidateForm"
      :model="dynamicValidateForm"
      size="small"
      label-width="0"
      class="demo-dynamic"
    >
      <div
        v-for="(domain, index) in dynamicValidateForm.fields"
        :key="index"
        class="dynamic"
      >
        <div
          v-for="(rule) in row.dynamic.rule"
          :key="rule.key"
        >
          <el-form-item
            :prop="rule.key"
          >
            <component
              :is="rule.type"
              :row="rule"
              :model="domain[rule.key]"
              :index="index"
              @update="update"
            />
          </el-form-item>
        </div>
        <div class="operation">
          <i
            class="el-icon-delete"
            @click="remove(index)"
          />
          <i
            v-if="index === dynamicValidateForm.fields.length-1"
            class="el-icon-circle-plus-outline"
            @click="add"
          />
        </div>
      </div>
    </el-form>
  </el-form-item>
</template>
<script>
export default {
  components: {
    infoInput: () => import('@components/infoFrom/dynamic/input'),
    infoSelect: () => import('@components/infoFrom/dynamic/select')
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    modelData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      fieldsRow: {},
      key: [],
      dynamicValidateForm: {
        fields: []
      }
    }
  },
  // 初始化字段
  created () {
    // globalDynamicValue 获取数据
    this.dynamicValidateForm.fields = this.globalDynamicValue(this.row.model, this.modelData) || this.dynamicValidateForm.fields
    this.dynamicValidateForm.fields.push(this.init())
  },
  methods: {
    // change 是子组件发出的事件，index, 修改的坐标，key 修改 key 值， val 对应的 key
    update (index, key, val) {
      this.dynamicValidateForm.fields[index][key] = val
      // 每次更新都需要改变父组件数据
      this.row.methods(this.dynamicValidateForm.fields, this, '')
      this.globalRuleForm(this, 'dynamicValidateForm')
    },
    // 初始化字段
    init () {
      var obj = {}
      for (let item of this.row.dynamic.rule) {
        obj[item.key] = ''
        obj['key'] = Date.now()
      }
      return obj
    },
    // 添加的时候 push init() 初始化的字段
    add () {
      this.dynamicValidateForm.fields.push(this.init())
      this.globalRuleForm(this, 'dynamicValidateForm')
    },
    remove (j) {
      console.log(j)
      if (this.dynamicValidateForm.fields.length !== 1) {
        this.dynamicValidateForm.fields.splice(j, 1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  // @import'@css/element.scss';
  .dynamic{
    display: flex;
    flex-direction: row;
    height: 62px;
    .operation{
      width: 100px;
      cursor: pointer;
      position: absolute;
      i{
        margin-left: 10px;
      }
      right: -100px;
    }
    > div {
      flex-grow:1
    }
    &:last-child{
      height: 35px;
    }
  }
</style>
