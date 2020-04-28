<template>
  <el-form-item
    v-if="row.show === undefined ? true : row.show()"
    :label="row.label"
    :prop="row.model"
  >
    <el-input
      v-model="modelData[row.model]"
      :name="row.model"
      auto-complete="off"
      :placeholder="'请填写内容'"
      :clearable="row.clearable || false"
      :type="row.inputType"
      :disabled="typeof row.disabled === 'function' ? row.disabled() : row.disabled"
    >
      <el-button
        :slot="row.button.slot"
        :icon="row.button.icon"
        :disabled="typeof row.button.disabled === 'function' ? row.button.disabled() : row.button.disabled"
        @click="button"
      />
      <el-select
        :slot="row.select.slot"
        v-model="modelData[row.select.model]"
        placeholder="请选择"
      >
        <el-option
          v-for="item in row.select.options "
          :key="item.label"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <i
        v-if="row.icon"
        slot="suffix"
        :class="'el-icon-search'"
      />
    </el-input>
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
    }
  },
  created () {
    // 设置默认值, 不然会有找不到属性的报错
    if (!this.row.button) {
      this.row.button = {
        show: false,
        slot: '',
        icon: ''
      }
    }
    if (!this.row.select) {
      this.row.select = {
        show: false,
        slot: '',
        model: ''
      }
    }
  },
  methods: {
    // 点击button
    button () {
      this.row.button.methods()
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-select{
    .el-input {
        width: 130px;
    }
  }
</style>
