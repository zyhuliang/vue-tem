<template>
  <section class="con-module" id="bm-rh-design-container">
    <div class="dg-content" id="bm-rh-design-dg-content">
      <el-dropdown @command="navRoute" trigger="click">
        <el-button type="primary" name="primaryBtn">
          <i class="el-icon-menu"></i>
          &nbsp;{{navRouteValue | routeFilter}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(dgList,key) in dTabsList"
            :key="key"
            :command="dgList.name"
            :name="dgList.name"
            visible-change="false"
          >
            <router-link class="dLinkLi" :to="dgList.url">{{dgList.name}}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <router-view class="viewHeight" v-if="isRouterAlive"></router-view>
  </section>
</template>
<script>
import { listExecutingHistory } from "@api";
import { queryObject, createParameter } from "@function/queryParameter.js";

export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      id: this.$route.params.id,
      isRouterAlive: true,
      jobId: "",
      dTabsList: [],
      navRouteValue: this.$route.name
    };
  },
  filters: {
    routeFilter: function(value) {
      if (
        value == "项目Outputs " ||
        value == "项目详细信息 " ||
        value == "项目日志信息 " ||
        value == "详细信息 " ||
        value == "Outputs " ||
        value == "日志信息 "
      ) {
        return "执行详细";
      } else if (
        value == "workflow" ||
        value == "dataflow" ||
        value == "streamflow"
      ) {
        return "设计";
      } else {
        return value;
      }
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    navRoute: function(command) {
      this.navRouteValue = command;
    }
  },
  mounted() {},
  created() {
    var that = this;
    that.flowId = this.$route.params.id;
    var para = createParameter("flowId", that.flowId, "EQUAL")
      .Offset(0)
      .Limit(8)
      .Build();
    //根据flowId获取最近的一次executionId
    listExecutingHistory(para).then(
      res => {
        if (res.content[0] && res.content[0].id) {
          that.jobId = res.content[0].id;
        } else {
          that.jobId = 0;
        }

        var urlTrue = window.location.href.indexOf("/project") > -1;
        if (urlTrue === true) {
          that.dTabsList = [
            {
              name: "设计",
              url:
                "/project/design/designDrawing/" +
                that.$route.params.id +
                "?type=" +
                sessionStorage.type
            },
            {
              name: "计划",
              url:
                "/project/design/plan/" +
                that.$route.params.id +
                "?type=" +
                sessionStorage.type
            },
            {
              name: "执行历史",
              url:
                "/project/design/executingHistory/" +
                that.$route.params.id +
                "?type=" +
                sessionStorage.type
            },
            {
              name: "执行详细",
              url:
                "/project/design/executingDetail/" +
                that.$route.params.id +
                "/info" +
                "?type=" +
                sessionStorage.type
            }
          ];
        } else {
          that.dTabsList = [
            {
              //显示不同flow的画布页面
              name: "设计",
              url:
                `/${sessionStorage.type}?id=${that.$route.query.id}&type=${sessionStorage.type}`
            },
            {
              name: "计划",
              url:
                "/design/plan/" +
                that.$route.query.id +
                "?type=" +
                sessionStorage.type
            },
            {
              name: "执行历史",
              url:
                "/design/executingHistory/" +
                that.$route.query.id +
                "?type=" +
                sessionStorage.type
            },
            {
              name: "执行详细 ",
              url:
                "/design/executingDetail/" +
                that.$route.query.id +
                "/info" +
                "?type=" +
                sessionStorage.type
            }
          ];
        }
      });
  },
  activated: function() {},
  watch: {
    $route(to, from) {
      console.log('this.$route',this.$route)
      let nameRout = this.$route.name;
      if (
        nameRout == "详细信息" ||
        nameRout == "Outputs" ||
        nameRout == "日志信息" ||
        nameRout == "项目详细信息" ||
        nameRout == "项目Outputs" ||
        nameRout == "项目日志信息"
      ) {
        this.navRouteValue = "执行详细";
      } else {
        this.navRouteValue = nameRout;
      }

      var that = this;
      if (to.path.indexOf("/design/executingDetail/") != -1) {
        var para = createParameter("flowId", that.flowId, "EQUAL")
          .Offset(0)
          .Limit(8)
          .Build();
        //=========================================
        // listExecutingHistory(para).then(res => {
        //     if(res.content[0] && res.content[0].id){
        //         that.jobId = res.content[0].id;
        //     }else{
        //         //this.$router.push(from.path)
        //         //this.$alert('无最近执行历史', '提示', {
        //         //confirmButtonText: '确定',
        //         //callback: action => {
        //         //}
        //         //});
        //         this.$message({
        //             message: "无最近执行历史!",
        //             type: 'error',
        //             duration: 1500
        //         });
        //     }
        // }, err => {
        //     var _this = this;
        //     if(err.response.status == 500) {
        //         _this.$message({
        //             message: err.response.message,
        //             type: 'error',
        //             duration: 1500
        //         });
        //     }
        // })
        //=========================================
      }
      //                if(that.$route.query.fshId){
      //                    that.dTabsList[2] = {
      //                        "name":"执行历史",
      //                        "url":"/design/executingHistory/"+that.$route.params.id+"?fshId="+that.$route.query.fshId,
      //                    }
      //                }else{
      //                    that.dTabsList[2] = {
      //                        "name":"执行历史",
      //                        "url":"/design/executingHistory/"+that.$route.params.id+"?type="+sessionStorage.type,
      //                    }
      //                }
    }
  }
};
</script>

<style scoped lang="scss">
.con-module {
  width: 100%;
  .dg-content {
    position: absolute;
    width: 100px;
    height: 50px;
    padding: 10px 20px 0 35px;
    box-sizing: border-box;
    z-index: 11;
  }
  .viewHeight {
    width: 100%;
    background: #ffffff;
    height: calc(100vh - 65px);
  }
}
</style>