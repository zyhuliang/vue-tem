<template>
  <info-from
    :config="baseInformationConfig"
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
      baseInformationConfig: {},
      resourceQueues: []
    }
  },
  created () {
    // 请求资源队列
    this.getResourceQueues()
    // 基本信息配置
    this.baseInformationConfig = {
      ref: 'baseInformationMethods',
      size: 'small',
      lableWidth: '120px',
      validate: {
        'name': [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        'loginId': [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        'phone': [
          { required: true, message: '请输入正确的手机号', trigger: 'blur',  pattern: /^1[34578]\d{9}$/}
        ],
        'email': [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        'password': [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        'confirmPassword': [
          { required: true, message: '请确认密码', trigger: 'blur' }
        ],
        'resourceQueues': [
          {type: 'array', required: true, message: '请选择资源队列', trigger: 'change' }
        ]
      },
      rule: [
        { label: '姓名',
          type: 'infoInput',
          model: 'name',
          methods: (val) => {
            this.entity.name = val
          }
        },
        { label: '登录名',
          type: 'infoInput',
          model: 'loginId',
          disabled: () => { return this.entity.disable},
          methods: (val) => {
            this.entity.loginId = val
          }
        },
        { label: '手机号',
          type: 'infoInput',
          model: 'phone',
          methods: (val) => {
            this.entity.phone = val
          }
        },
        { label: '邮箱',
          type: 'infoInput',
          model: 'email',
          methods: (val) => {
            this.entity.email = val
          }
        },
        { label: '密码',
          type: 'infoInput',
          model: 'password',
          inputType: 'password',
          show: () => {
            return this.entity.password === undefined ? false : true
          },
          methods: (val) => {
            this.entity.password = val
          }
        },
        { label: '确认密码',
          type: 'infoInput',
          inputType: 'password',
          model: 'confirmPassword',
          show: () => {
            return this.entity.confirmPassword === undefined ? false : true
          },
          methods: (val) => {
            this.entity.confirmPassword = val
            if (this.entity.confirmPassword !== this.entity.password) {
               this.$message({
                message: '密码不一致',
                type: 'error'
              });
            }
          }
        },
        {
          label: "资源队列",
          type: "infoSelect",
          model: "resourceQueues",
          multiple: true,
          methods: val => {
            this.entity.resourceQueues = val
          },
          show: () => {
            return this.entity.resourceQueues === undefined ? false : true
          },
          options: () => {return this.resourceQueues}
        }
      ],
      operation: [{
        label: '确定',
        type: 'primary',
          method: (vue, ref) => {
            if (this.globalRuleForm(vue, ref)) {
              if (this.entity.confirmPassword !== this.entity.password) {
               this.$message({
                message: '密码不一致',
                type: 'error'
              });
              return false
            }
              this.$emit('updateUser')
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
  },
  methods: {
    getResourceQueues () {
      this.serverApi({
        interface: 'getResourceQueues',
        success: (response) => {
          for (let value of response) {
            this.resourceQueues.push({
              label: value,
              value: value
            })
          }
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
</style>
