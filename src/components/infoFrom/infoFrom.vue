<template>
  <el-form
    :ref="config.ref"
    :label-width="config.lableWidth"
    :size="config.size"
    :label-position="config.labelPosition || 'right'"
    :model="modelData"
    :inline="config.inline || false"
    :rules="config['validate']"
  >
    <component
      :is="item.type"
      v-for="item in config.rule"
      :key="item.model"
      :row="item"
      :modelData="modelData"
    />
    <el-form-item v-if="!config.operationFixed">
      <el-button
          v-for="(item, index) in config.operation"
          :key="index"
          v-if="item.show === undefined ? true : item.show()"
          :name="item.label"
          :type="item.type || 'text'"
          :size="config.size"
          :icon="item.icon"
          :disabled="typeof item.disabled === 'function' ? item.disabled() : item.disabled"
          :plain="item.plain || true"
          round
          @click="item.method(that, config.ref)"
        >
          {{ typeof item.label === 'function' ? item.label() : item.label }}
        </el-button>
    </el-form-item>
    <panel v-else>
      <el-button
        v-for="(item, index) in config.operation"
        :key="index"
        :name="item.label"
        :type="item.type || 'text'"
        :size="config.size"
        :icon="item.icon"
        :disabled="typeof item.disabled === 'function' ? item.disabled() : item.disabled"
        :plain="item.plain"
        round
        @click="item.method(that, config.ref)"
      >
        {{ typeof item.label === 'function' ? item.label() : item.label }}
      </el-button>
    </panel>
  </el-form>
</template>
<script>
import Panel from '@components/layout/panel'
export default {
  components: {
    infoInput: () => import('@components/infoFrom/input'),
    infoSelect: () => import('@components/infoFrom/select'),
    infoDatePicker: () => import('@components/infoFrom/datePicker'),
    infoDynamic: () => import('@components/infoFrom/dynamic/dynamic'),
    infoLinkage: () => import('@components/infoFrom/linkage/linkage'),
    infoCheckbox: () => import('@components/infoFrom/checkbox'),
    infoButton: () => import('@components/infoFrom/button'),
    Panel
  },
  props: {
    config: {
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
      that: this
    }
  },
  methods: {
    RuleForm () {
      return this.globalRuleForm(this, this.config.ref)
    }
  }
}
</script>
<style lang="scss">
  .info-from{
  }
</style>
