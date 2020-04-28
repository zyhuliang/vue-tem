<template>
  <div id="bm-home">
    <el-row class="frame">
      <!-- header -->
      <el-col :span="24" class="header" :class="{cab: META_DATA.systemName === 'Cab'}">
        <!-- left -->
        <aside>
          <div class="logo">
            <img :src="logo" class="img-square" />
            <!-- <h3>{{ systemConfig.systemTitle }}</h3> -->
            <h3>{{ META_DATA.systemName }} -管理系统</h3>
          </div>
          <!--导航菜单-->
          <div class="nav" id="bm-nav">
            <el-menu
              class="el-menu-demo"
              mode="horizontal"
              router
              background-color="#333"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <el-submenu :index="item.id" v-for="item in menu" :key="item.id">
                <!-- 第一层 -->
                <template slot="title" id="itemNav">
                  <span :test-id="item.id">{{ item.menuName }}</span>
                </template>

                <!-- 第二层 -->
                <template v-for="(first,index) in item.submenus">
                  <el-menu-item v-if="!first.submenus" :index="first.id" :key="index">
                    <!-- <span :test-id="first.id">{{first.menuName}}</span> -->
                    <span
                      :test-id="first.id"
                      v-if="first.id!='/license/activate'"
                    >{{first.menuName}}</span>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="webInforaation?'许可证过期时间: ' +webInforaation.notAfter:''"
                      placement="top"
                      v-else
                    >
                      <span :test-id="first.id">{{first.menuName}}</span>
                    </el-tooltip>
                  </el-menu-item>
                  <el-submenu :index="first.id" v-else id="childNav" :key="index">
                    <template slot="title">
                      <span :test-id="first.id">{{first.menuName}}</span>
                    </template>
                    <el-menu-item
                      v-for="second in first.submenus"
                      :key="second.id"
                      :index="second.id"
                    >
                      <span :test-id="second.id">{{second.menuName}}</span>
                    </el-menu-item>
                  </el-submenu>
                </template>
              </el-submenu>
            </el-menu>
          </div>
        </aside>

        <!-- user -->
        <div class="ir-user" id="bm-userinfo">
          <el-dropdown trigger="hover" @command="otherOperations">
            <span class="el-dropdown-link userinfo-inner">
              <em>{{ systemConfig.name }}</em>
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="ir-dropdown">
              <el-dropdown-item command="baseInformationEdit">
                <i class="icon iconfont icon-ir-password"></i> 修改信息
              </el-dropdown-item>
              <el-dropdown-item command="passwordEdit">
                <i class="icon iconfont icon-ir-password"></i> 修改密码
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">
                <i class="icon iconfont icon-ir-logout"></i> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>

      <el-col :span="24" class="main" id="bm-main">
        <!-- content -->
        <section class="content-container">
          <div class="grid-content bg-purple-light grid-content-home">
            <el-col :span="24" class="content-wrapper">
              <transition name="fade-transform" mode="out-in">
                <router-view />
              </transition>
            </el-col>
          </div>
        </section>
      </el-col>
    </el-row>
    <info-dialog
      title="编辑基本信息"
      width="60%"
      :isShowDialog="isShowDialog"
      @closeDialog="closeDialog"
      :isShowBtn="false"
    >
      <baseInformation
        :entity="baseInformationEntity"
        @updateUser="updateUser"
        @closeDialog="closeDialog"
      />
    </info-dialog>
  </div>
</template>

<script>
import { map, forEach } from "lodash";
import Search from "@components/globalSearch/Search";
import Bus from "@components/globalSearch/bus.js";
import infoDialog from "@components/infoDialog/dialog";
export default {
  computed: {},
  components: {
    Search,
    infoDialog,
    baseInformation: () =>
      import("@views/rightsManagement/userManagement/user/baseInformation")
  },
  data() {
    return {
      webInforaation: "",
      META_DATA: this.$systemData,
      logo: "",
      // 基本信息数据
      baseInformationEntity: {
        name: "",
        loginId: "",
        phone: "",
        email: "",
        id: "",
        disable: true // 在点击基本信息的时候用户名不可以编辑
      },
      isShowDialog: false, // 编辑基本信息
      menu: [],
      keywords: "",
      systemConfig: {},
      timer: null,
      lastTime: new Date().getTime(), //最后鼠标点击时间
      currentTime: new Date().getTime(), //当前时间
      timeOut: 30 * 60 * 1000, //设置超时时间： 30分
      systemConfig: {} // 系统信息
    };
  },
  created() {
    // alert("  created () { home");
    // 获取目录
    this.loadMenus();
    // 获取用户的基本信息
    this.systemConfig = JSON.parse(this.__getItem("userInfo", "localStorage"));
    // 根据体统获取logo
    this.logo = require(`@images/${this.META_DATA.systemName || "Baymax"}.png`);

    this.webInforaation = JSON.parse(
      this.__getItem("webInforaation", "sessionStorage")
    );

    //console.log("this.webInforaation",this.webInforaation);
  },
  methods: {
    loadMenus() {
      // 获取 目录列表
      this.serverApi({
        interface: "loadMenus",
        success: data => {
          this.menu = data;
        }
      });
    },
    //  弹窗关闭
    closeDialog() {
      this.isShowDialog = false;
    },
    // 更新基本信息
    updateUser() {
      this.serverApi({
        params: this.baseInformationEntity,
        interface: "updateUser",
        tips: true
      });
    },

    // 根据用户id 请求基本信息
    infoByIdUser() {
      // 根据 id 获取 用户的详细信息
      let userId = JSON.parse(this.__getItem("userInfo", "localStorage"))
        .userId;
      this.serverApi({
        params: { id: userId },
        interface: "infoByIdUser",
        success: response => {
          if (response.status === 0) {
            this.$set(this, "baseInformationEntity", {
              name: response.content.name,
              loginId: response.content.loginId,
              phone: response.content.phone,
              email: response.content.email,
              id: response.content.id,
              disable: true // 在点击基本信息的时候用户名不可以编辑
            });
          }
        }
      });
    },
    // 刷新token
    renew() {
      // 是否退出登录
      this.currentTime = new Date().getTime(); //更新当前时间
      if (this.currentTime - this.lastTime > this.timeOut) {
        //判断是否超时
        this.revokeLogout();
        return false;
      }
      // 获取刷新 token
      let refreshToken = JSON.parse(this.__getItem("userInfo", "localStorage"))
        .refreshToken;
      // 调用刷新接口
      this.serverApi({
        params: refreshToken,
        interface: "refresh",
        success: data => {
          var xToken = data.tokenType + " " + data.accessToken;
          this.__setItem("x-auth-token", xToken);
        },
        error: err => {
          this.revokeLogout();
        }
      });
    },
    // 退出登录
    revokeLogout() {
      // 不管成不成功 都直接退出
      this.serverApi({
        interface: "revoke",
        success: () => {
          this.logoutSet();
        },
        error: () => {
          this.logoutSet();
        }
      });
    },
    logoutSet() {
      clearInterval(this.timer);
      this.__removeItem("x-auth-token");
      this.$router.push("/login");
    },
    //退出登录
    logout: function() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.revokeLogout();
      });
    },
    //有三级菜单的二级菜单点击事件（处理elementBug）
    childNav: function(path) {
      if (path === "/") {
        return false;
      }
      this.$router.push({ path: path });
    },
    //查询所有table
    toTableSearch() {
      this.$router.push({
        name: "dataImport",
        params: { searchVal: this.keywords }
      });
      Bus.$emit("selectVal", this.$route.path);
      Bus.$emit("val", this.keywords);
    },
    passwordEdit: function() {
      this.$router.push({ path: "/changePassword" });
    },
    baseInformationEdit() {
      this.isShowDialog = true;
    },
    otherOperations: function(type) {
      if (type == "passwordEdit") {
        this.passwordEdit();
      } else if (type === "baseInformationEdit") {
        this.baseInformationEdit();
        this.infoByIdUser();
      }
    },
    initData() {
      // 获取目录
      this.loadMenus();
      // 获取用户的基本信息
      this.systemConfig = JSON.parse(
        this.__getItem("userInfo", "localStorage")
      );
      // 根据体统获取logo
      this.logo = require(`@images/${this.META_DATA.systemName ||
        "Baymax"}.png`);
    }
  },
  async mounted() {
    $(document).mousedown(() => {
      this.lastTime = new Date().getTime(); //更新操作时间
    });
    //renew token
    this.$nextTick(() => {
      this.timer = setInterval(this.renew, 1000 * 60 * 5);
    });
  }
};
</script>


<style lang="scss" scoped>
@import "~scss_vars";
.frame {
  position: absolute;
  top: 0px;
  bottom: 0px;
  /*z优化：最小宽度改为1280，小于该值时x轴出现滚动条*/
  min-width: 1280px;
  /*min-width: 1300px;*/
  width: 100%;
  .header {
    position: absolute;
    z-index: 99;
    line-height: 50px;
    background: #333;
    color: #fff;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #333333;
    box-shadow: 0px 0px 10px 0px #333333;
    .logo {
      float: left;
      margin: 0px 20px 0px 0px;
      height: 50px;
      font-size: 22px;
      cursor: pointer;
      img {
        text-align: center;
        width: 30px !important;
        float: left;
        margin: 10px 15px 10px 15px;
      }
      h3 {
        float: left;
        margin: 0px;
        font-size: 20px;
      }
    }
    .nav {
      float: left;
      height: 29px;
      line-height: 28px;
      font-size: 0.6rem;
      ui {
        margin: 0px;
      }
      i {
        color: #ffffff;
        font-size: 14px;
      }
    }

    .ir-user {
      position: absolute;
      right: 10px;
      height: 50px;
      margin: 0px 0px 0px 0px;
      line-height: 50px;

      .set-language {
        float: left !important;
        margin-right: 20px !important;
      }

      .seachAll {
        float: right;
        width: 180px;
        margin-right: 20px;

        .el-input__prefix {
          i {
            color: #ffffff;
          }
        }

        input {
          position: inherit;
          color: #ffffff;
          background-color: #333333;
          border-radius: 4px;
          height: 30px;
          text-align: center;
        }
      }
      .userinfo-inner {
        float: right;
        color: #ffffff;
        width: 120px;
        border-left: 1px solid #f5f5f5;
        border-right: 1px solid #f5f5f5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        em {
          float: left;
          width: 80px;
          margin-left: 10px;
          font-style: normal;
        }
        i {
          float: right;
          margin-right: 5px;
          line-height: 50px;
        }
      }

      .el-dropdown {
        float: right;
        cursor: pointer;
        color: #666666;
        height: 50px;
        font-size: 0.8rem;
        margin: 0px;
      }
    }
  }
  .main {
    display: flex;
    height: 100%;
    padding-top: 50px;
    box-sizing: border-box;
    bottom: 0px;

    .content-container {
      position: relative;
      flex: 1;
      overflow-y: auto;
      .grid-content-home {
        height: 100%;
      }
      .content-wrapper {
        box-sizing: border-box;
        height: 100%;
      }
    }
  }
}

i.nav {
  margin-right: 5px;
  font-size: 13px;
  width: 16px !important;
  line-height: 12px;
}
.dialogClosed {
  position: absolute;
  right: 20px;
  top: 15px;
  color: #ffffff;
  cursor: pointer;
}
.dialogClosed:hover {
  color: #3e98fe;
}
.cab {
  background: #00b9fc !important;
  border-bottom: 1px solid #00b9fc !important;
  .el-menu-demo {
    background: #00b9fc !important;
    border-bottom: 1px solid #00b9fc !important;
  }
  ::v-deep .el-submenu__title {
    height: 30px;
    line-height: 30px;
    background-color: #00b9fc !important;
    color: #fff !important;
    i {
      color: #fff !important;
    }
  }
  ::v-deep .nav .is-active .el-submenu__title {
    height: 30px;
    line-height: 30px;
    color: #333 !important;
    background-color: #fff !important;
    border: 0;

    i {
      color: #333 !important;
    }
  }
}
</style>
