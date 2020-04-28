<template>
  <div
    class="login"
    :style="{ backgroundImage: `url(${formStyle.backgroundImage})` }"
  >
    <div class="main">
      <div
        class="left"
        :style="{
          width: `${formStyle.leftWidth}`,
          backgroundImage: `url(${formStyle.leftImage})`,
          float: `${formStyle.right}`
        }"
      >
        <div class="box-information">
          <div class="web-information">
            <p>
              <b>版本:&nbsp;</b>
              <!-- <span>{{ webInforaation.versions }}</span> -->
              <span>{{ systemData.systemName }} {{ systemData.systemVersion }}</span>
            </p>
            <p>
              <b>SID:&nbsp;</b>
              <span>{{ webInforaation.sid }}</span>
            </p>
            <p>
              <b>许可证过期时间:&nbsp;</b>
              <span>{{ webInforaation.notAfter }}</span>
            </p>
          </div>
        </div>
      </div>
      <div
        class="right"
        :style="{
          float: `${formStyle.right}` ,
          width: `${formStyle.rightWidth}`
        }"
      >
        <div class="warp-right" v-loading="loading">
          <div class="title">
            <!-- <span>{{ systemConfig.systemTitle }}</span> -->
            <span>{{ systemData.systemTitle }}</span>
          </div>
          <info-from
            :config="loginConfig"
            :modelData="entity"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import congfigData from '@config/data/index.json'
import infoFrom from '@components/infoFrom/infoFrom'
import moment from 'moment' // 时间格式化
import Base64 from 'js-base64'
import { encrypt, decrypt } from '@components/encryption/aes.js'
import Qs from 'qs'
import { requestLogin } from '@/api/api.js'
var backgroundImage, leftImage, formStyle

if (congfigData[process.env.BASE_PROJECT].systemName === 'Cab') {
    backgroundImage = require('@images/cabLogin.png')
    leftImage = require('@images/cabLoginLeft.png')
    formStyle = {
    left: 'right',
    right: 'left',
    leftWidth: '31%',
    rightWidth: '69%',
    backgroundImage: backgroundImage,
    leftImage: leftImage
  }
} else {
  backgroundImage = require('@images/login.png')
  leftImage = require('@images/login-img.jpg')
  formStyle = {
    left: 'left',
    right: 'right',
    backgroundImage: backgroundImage,
    leftImage: leftImage
  }
}
export default {
  name: 'Login',
  components: {
    infoFrom
  },
  data () {
    return {
      loading:false,
      systemData:this.$systemData,
      isOverdue: false, // 是否过期
      systemConfig: {}, // 系统信息
      localStorageTenant: ['default'], // 需要存储的租户
      tenant: ['default'], // 下拉框 租户
      loginConfig: {
        ref: 'loginConfig',
        size: 'small',
        lableWidth: '0px',
        validate: {
          name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          tenant: [{ required: true, message: '请输入租户', trigger: 'blur' }]
        },
        rule: [
          {
            label: '',
            type: 'infoSelect',
            model: 'tenant',
            filterable: true,
            options: () => {
              return this.tenant
            }
          },
          {
            label: '',
            type: 'infoInput',
            model: 'name'
          },
          {
            label: '',
            type: 'infoInput',
            inputType: 'password',
            model: 'password'
          },
          {
            label: '',
            type: 'infoCheckbox',
            model: 'remember',
            allElection: false,
            checkbox: ['记住密码'],
            methods: val => {}
          }
        ],
        operation: [
          {
            label: '确定',
            type: 'primary',
            method: (vue, ref) => {
              if (this.globalRuleForm(vue, ref)) {
                this.handleSubmit()
              }
            }
          },
          {
            label: '激活许可证',
            type: 'warning',
            show: () => this.isOverdue,
            method: (vue, ref) => {
              if (this.globalRuleForm(vue, ref)) {
                this.licenseActivate()
              }
            }
          }
        ]
      },
      webInforaation: {
        versions: 'Baymax-3.0.8.11 - 201904xx',
        sid: '未激活',
        notAfter: '未激活'
      },
      entity: {
        version: 'Baymax-3.0.0.23-20180606',
        tenant: '',
        name: '',
        password: '',
        remember: false // 密码记住密码
      },
      // 样式， 包括位置，图片
      formStyle: formStyle,
      META_DATA: congfigData[process.env.BASE_PROJECT]
    }
  },
  created () {
    // this.systemInfo()
    this.getLicenseInfo()
    this.getTenant()
    // 如果缓存有用户信息， 进行获取
    const userInfo = JSON.parse(this.__getItem('userInfo', 'localStorage'))
    // 说明保存密码了
    if (userInfo && userInfo.remember === true) {
      for (const item in this.entity) {
        this.entity[item] = userInfo[item] || ''
      }
      this.entity.password = decrypt(userInfo.password)
    }


    
  },
  methods: {
    requestLogin (params) {
      this.loading = true
      this.serverApi({
        params: Qs.stringify(params),
        interface: 'requestLogin',
        success: data => {
          this.loading = false
          this.systemConfig.userId = data.userId
          this.systemConfig.refreshToken = data.refreshToken
          // 密码保存的时候进行加密
          this.systemConfig.password = encrypt(this.entity.password)
          // 保存用户信息 是否保存密码
          const user = this.entity.remember ? this.entity : { name: data.username }

          // user 和  systemConfig 位置不能调换
          Object.assign(user, this.systemConfig)
          this.__setItem('userInfo', user, 'localStorage')
          // 保存是否是admin，判断是否可以操作目录
          this.__setItem('isAdmin', data.admin)
          // 说明没有登陆过 跳转到设置密码的页面
          if (data.pwdInfo.needChange === true) {
            this.$router.push({ path: '/changePassword' })
            return false
          }
          var xToken = data.tokenType + ' ' + data.accessToken
          this.__setItem('x-auth-token', xToken)
          // 保存租户
          this.setTenant()
          // 判断是不是 root 用户
          if (data.username === 'root') {
            this.$router.push({ path: '/tenants' })
          } else {
            // 查询版本号在具体看跳到哪个页面
            this.queryVersion()
          }
        },
        error: err =>{
          this.loading = false
          $message({
            type:'error',
            message:err.response.message
          })
        }
      })
    },
    // 登陆
    handleSubmit () {
      const base64 = Base64.Base64
      // 在点击登陆的时候进行拷贝一份数据
      const params = JSON.parse(JSON.stringify(this.entity))
      for (const item in params) {
        params[item] = encrypt(base64.encode(params[item]))
      }
      this.requestLogin(params)
    },
    //  监听登录许可证过期
    getLicenseInfo () {
      this.serverApi({
        interface: 'getLicenseInfo',
        success: data => {
          data.notAfter = moment(data.notAfter).format('YYYY-MM-DD HH:mm:ss')
          this.__setItem('webInforaation', this.webInforaation, 'sessionStorage')
        },
        error: (err) => {
          if (!err.response.status === 511) {
            this.isOverdue = true
            return false
          }
          this.licenseActivate()
        }
      })
    },
    // 激活按钮跳转“激活许可证”
    licenseActivate: function () {
      this.$router.push({ path: '/license/activate' })
    },
    // 获取是什么系统 Baymax ， Cab， PCI佳都,  北软， ShuBo , YinPao, Dam
    systemInfo () {
      this.serverApi({
        interface: 'systemInfo',
        success: data => {
          this.systemConfig = data
        }
      })
    },
    // 本地存储租户
    setTenant: function () {
      this.localStorageTenant.unshift(this.entity.tenant)
      this.__setItem(
        'lessee',
        this.localStorageTenant.toString(),
        'localStorage'
      )
    },
    // 获取本地缓存的租户
    getTenant: function () {
      const lessee = this.__getItem('lessee', 'localStorage')
      if (!lessee) return false
      // 获取没有重复的 租户
      this.localStorageTenant = Array.from(new Set(lessee.split(',')))
      // 设置下拉框需要的租户
      for (const item of this.localStorageTenant) {
        this.tenant.push({
          value: item,
          label: item
        })
      }
    },
    // 查询版本号
    queryVersion () {
      this.loading = true
       this.serverApi({
        interface: 'queryVersion',
        success: data => {
          this.loading = false
          // 先取
          let lastVersion = this.__getItem('version', 'localStorage')
          // 后存
          this.__setItem('version', data.version, 'localStorage')
          // 上一次和这一次做比较
          if (lastVersion === data.version) {
            this.$router.push({ path: '/resourceMan' })
          } else {
            this.$router.push({ path: '/releaseNote' })
          }
        }
      })
    }
  },
  metaInfo: {
    title: congfigData[process.env.BASE_PROJECT].systemTitle
  }
}
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
  background-size: 100%;
  background-repeat: no-repeat;
}
.login .title {
  font-size: 26px;
  margin: 50px 0 30px 0;
  color: #3e98fe;
  font-weight: 400;
}

.main{
    width: 60%;
    height: 65%;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 0 100px #999;
    background: #fff;
}
.login .el-button {
  width: 100%;
  border-radius: 10px;
  font-size: 16px;
}
.left {
  width: 60%;
  height: 100%;
  background-size: 100%;
  position: relative;
  .box-information {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .web-information {
    position: absolute;
    right: 30px;
    bottom: 20px;
    color: #dddddd;
    font-size: 14px;

    p {
      b {
        font-weight: normal;
      }

      text-align: right;
      line-height: 25px;
    }
  }
}
.right {
  height: 100%;
  width: 40%;
  padding: 0 40px;
  background: #fff;
  display: flex;
  .warp-right {
    width: 100%;
  }
}
.el-form {
  ::v-deep .el-form-item {
    margin-bottom: 22px;
  }
  ::v-deep .el-button {
    margin: 0px;
    margin-bottom: 20px;
    width: 100%;
  }
}
</style>
