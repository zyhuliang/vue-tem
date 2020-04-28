<template>
  <div
    class="login"
    :style="{backgroundImage: 'url('+ formStyle.backgroundImage +')'}"
  >
    <div class="main">
      <div
        class="left"
        :style="{backgroundImage: `url(${formStyle.leftImage})`, float: `${formStyle.right}`}"
      />
      <div
        class="right"
        :style="{float: `${formStyle.right}`}"
      >
        <div class="warp-right">
          <div class="title">
            <span>修改密码</span>
          </div>
          <info-from
            :config="loginConfig"
            :modelData="entity"
          />
          <span
            class="cancel"
            @click="cancel"
          >取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import leftImage from '@images/changePassword.png'
import backgroundImage from '@images/login.png'
import infoFrom from '@components/infoFrom/infoFrom'
import { encrypt } from '@components/encryption/aes.js'
export default {
  name: 'Login',
  components: {
    infoFrom
  },
  data () {
    return {
      loginConfig: {
        ref: 'loginConfig',
        size: 'small',
        lableWidth: '80px',
        validate: {
          oldPass: [
            { required: true, message: '请输入至少6位密码', trigger: 'blur', pattern: /^\w{6,}$/ }
          ],
          newPass: [
            { required: true, message: '请输入至少6位密码', trigger: 'blur', pattern: /^\w{6,}$/ }
          ],
          newEqual: [
            { required: true, message: '请输入至少6位密码', trigger: 'blur', pattern: /^\w{6,}$/ }
          ]
        },
        rule: [
          {
            label: '旧密码',
            type: 'infoInput',
            model: 'oldPass',
            inputType: 'password'
          },
          {
            label: '新密码',
            type: 'infoInput',
            model: 'newPass',
            inputType: 'password'
          },
          {
            label: '确认密码',
            type: 'infoInput',
            model: 'newEqual',
            inputType: 'password'
          }
        ],
        operation: [{
          label: '确定',
          type: 'primary',
          method: (vue, ref) => {
            if (this.entity.newPass !== this.entity.newEqual) {
              this.$message({
                message: '密码不一致',
                type: 'error'
              })
              return false
            }
            if (this.globalRuleForm(vue, ref)) {
              this.handleSubmit()
            }
          }
        }]
      },
      entity: {
        oldPass: '',
        newPass: '',
        newEqual: ''
      },
      // 样式， 包括位置，图片
      formStyle: {
        left: 'left',
        right: 'right',
        backgroundImage: backgroundImage,
        leftImage: leftImage
      }
    }
  },
  mounted: function () {
  },
  methods: {
    // 登陆
    handleSubmit () {
      this.serverApi({
        params: {
          oldPass: encrypt(this.entity.oldPass),
          newPass: encrypt(this.entity.newPass)
        },
        interface: 'updateUserPassword',
        tips: true,
        success: () => {
          this.$router.push({ path: '/login' })
        }
      })
    },
    cancel () {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style lang="scss"  scoped>
.login{
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
    background-size: 100%;
}
.login .title{
    font-size: 26px;
    margin: 50px 0 30px 0;
    color: #3e98fe;
    font-weight: 400;
}
.main{
    width: 60%;
    height: 55%;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 0 100px #999;
    background: #fff;
}
.login .el-button{
    width: 100%;
    border-radius: 10px;
    font-size: 16px;
}
.left{
width: 60%;
height: 100%;
background-size: 70%;
background-repeat:no-repeat;
background-position: center center;
position: relative;
background-color: #23216a;
}
.right{
  height: 100%;
  width: 40%;
  padding:0 40px;
  background: #fff;
  display: flex;
  .warp-right{
    width: 100%;
  }
}
.el-form{
  ::v-deep .el-form-item{
    margin-bottom: 22px;
  }
  ::v-deep .el-button{
    margin-top: -0px;
    width: 100%;
  }
}
.cancel{
  float: right;
  cursor: pointer;
  color: #3e98fe;
}
</style>
