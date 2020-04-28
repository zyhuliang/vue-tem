<template>
  <info-from
    :config="securityManagementConfig"
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
      securityManagementConfig: {},
    }
  },
  created () {
    // 安全管理配置
    this.securityManagementConfig = {
      ref: 'securityManagementMethods',
      size: 'small',
      lableWidth: '120px',
      validate: {
        'accountExpiredTime': [
          { required: true, message: '请选择有效期', trigger: 'change' }
        ],
        'pwdExpiredTime': [
          { required: true, message: '请选择有效期', trigger: 'change' }
        ]
      },
      rule: [
        { 
          type: 'infoDatePicker',
          label: '用户有效期',
          dateType: 'date',
          model: 'accountExpiredTime',
          methods: (val) => {
            this.entity.accountExpiredTime = val
          }
        },{ 
          type: 'infoDatePicker',
          label: '密码有效期',
          dateType: 'date',
          model: 'pwdExpiredTime',
          methods: (val) => {
              this.entity.pwdExpiredTime = val
          }
        }
      ],
      operation: [{
          label: '确定',
          type: 'primary',
            method: (vue, ref) => {
              if (this.globalRuleForm(vue, ref)) {
                  this.$emit('updateUser')
                  this.$emit('closeDialog')
              }
          }
        },
        {
          label: '取消',
          type: 'primary',
          method: (vue, ref) => {
            this.$emit('closeDialog')
          }
        }]
    }
  },
  methods: {
  }

}
</script>
<style lang="scss" scoped>
</style>
