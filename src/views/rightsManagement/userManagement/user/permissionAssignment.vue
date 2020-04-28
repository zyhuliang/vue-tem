<template>
  <info-from
    :config="permissionAssignmentConfig"
    :modelData="entity"
  />
</template>
<script>
import infoFrom from '@components/infoFrom/infoFrom'
export default {
  components: {
    infoFrom
  },
  props: {
    entity: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      permissionAssignmentConfig: {},
      checkboxData: [],
      checkboxMap: {}
    }
  },
  created () {
    // 权限分配配置
    this.permissionAssignmentConfig = {
      ref: 'permissionAssignmentMethods',
      size: 'small',
      lableWidth: '120px',
      validate: {
        'rolesId': [
          { type: 'array', required: true, message: '至少选择一个角色', trigger: 'change' }
        ]
      },
      rule: [
        { label: '角色',
          type: 'infoCheckbox',
          model: 'rolesId',
          checkbox: () => {
            return this.checkboxData
          },
          methods: (val) => {
            console.log(this.entity)
            console.log(val)
            this.$set(this.entity, 'rolesId', val)
          }
        }
      ],
      operation: [{
        label: '确定',
        type: 'primary',
          method: (vue, ref) => {
            if (this.globalRuleForm(vue, ref)) {
                this.$emit('updateUser', this.checkboxMap)
                this.$emit('closeDialog')
            }
        }
      },{
        label: '取消',
        type: 'primary',
        method: (vue, ref) => {
          this.$emit('closeDialog')
        }
      }]
    }
    // 请求 角色列表
    this.roleList()
  },
  methods: {
    roleList () {
      this.serverApi({
        interface: 'roleList',
        success: (response) => {
            for (let value of response) {
            this.checkboxData.push(value.name)
            this.checkboxMap[value.name] = value.id
          }
        }
      })

    }
  }

}
</script>
<style lang="scss" scoped>
</style>
