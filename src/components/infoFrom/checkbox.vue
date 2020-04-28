<template>
  <el-form-item
    v-if="row.show === undefined ? true : row.show()"
    :label="row.label"
    :prop="row.model"
  >
    <el-checkbox
      v-if="row.allElection === undefined ? true : row.allElection"
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-checkbox-group
      v-model="modelData[row.model]"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox
        v-for="item in list"
        :key="item"
        :label="item"
      >
        {{ item }}
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>
<script>
export default {
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
      tmp:[],
      checkAll: false,
      checked: this.globalDynamicValue(this.row.model, this.modelData),
      list: typeof this.row.checkbox === 'function' ? this.row.checkbox() : this.row.checkbox,
      isIndeterminate: Boolean(this.globalDynamicValue(this.row.model, this.modelData).length)
    }
  },
  created () {
  },
  methods: {
    handleCheckAllChange (val) {
      this.checked = val ? this.list : []
      this.isIndeterminate = false
      this.row.methods(this.checked)
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.list.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
      this.row.methods(value)
    }
  }
}
</script>
