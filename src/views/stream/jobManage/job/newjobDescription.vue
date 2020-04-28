<template>
  <el-container class="newjobDescription" id="content">
    <el-header>
      <el-row type="flex" class="row-bg" justify="end" align="middle">
        <el-button type="info" id="drawRefresh" @click="addNode">
          <i class="icon iconfont icon-ir-refresh"></i>&nbsp;添加
        </el-button>
        <el-button type="info" id="designSet">
          <i class="icon iconfont icon-ir-set"></i>&nbsp;放大
        </el-button>
        <el-button type="info" id="drawRefresh">
          <i class="icon iconfont icon-ir-refresh"></i>&nbsp;缩小
        </el-button>
        <!-- <el-button type="info" id="designSet">
          <i class="icon iconfont icon-ir-set"></i>&nbsp;重置
        </el-button>
        <el-button type="info" id="drawReturn">
          <i class="icon iconfont icon-ir-left"></i>&nbsp;返回
        </el-button>

        <el-button type="info" id="designSave">
          <i class="icon iconfont icon-ir-save"></i>&nbsp;保存
        </el-button>
        <el-button type="info" class="submiterror">
          <i class="icon iconfont icon-ir-ok"></i>&nbsp;提交
        </el-button>
        <el-button type="info" id="designDelSave" @click="reset">
          <i class="fa fa-eraser"></i>&nbsp;清空
        </el-button>-->
        <el-button type="info" id="designDelSave" @click="fullScreen">
          <i class="fa fa-eraser"></i>&nbsp;全屏
        </el-button>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="220px">
        <leftaside></leftaside>
      </el-aside>
      <el-container>
        <el-main class="editor">
          <drop class="drop-workplace" @drop="handleDrop" id="workplace">
            <div class="canvas">
              <div
                v-for="(data,index) in flowData"
                :id="data.id"
                :key="index"
                :class="'designIconBig stepsItem '+setClass(nodeClass(data.type))"
                :data-sign="data.name"
                :data-type="data.type"
                :style="'left:'+data.x+'px;top:'+data.y+'px;position:absolute;margin:0'"
              >
                <i class="icon iconfont icon-ir-designIconBg designIconBg"></i>
                <i
                  id="changeSte"
                  :class="nodeIcon(data.type) == 'iconTrue'?'icon iconfont icon-ir-d-'+data.type:'icon iconfont icon-ir-d-default'"
                ></i>
                <h4 :title="data.name">{{data.name}}</h4>
                <h5>ID:{{data.id}}</h5>
                <!-- <em id="pitchOnDes" class="fa fa-square-o" title="选中"></em> -->
                <em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>
                <em id="removeDes" class="fa fa-trash-o" title="删除" @click="delNode(data.id)"></em>
              </div>
            </div>
          </drop>
        </el-main>
      </el-container>
      <el-aside width="270px" class="right-aside">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="数据表描述" name="first">数据表描述</el-tab-pane>
          <el-tab-pane label="自定义函数" name="second">自定义函数</el-tab-pane>
        </el-tabs>
      </el-aside>
    </el-container>
  </el-container>
</template>
    

<script>
import _ from "lodash";
import leftaside from "@/components/aside/left/index";
import { mapGetters, mapActions } from "vuex";

import getInstance from "@/components/utils/getInstance";

import {
  nodeClass,
  nodeIcon,
  specialNodeClass,
  origin,
  destination,
  addEndpointToNode,
  getNodeType,
  setClass,
  connect
} from "@/components/utils/flowchart";
import { steplist } from "@server/realtime/index";
export default {
  components: {
    leftaside
  },
  data: function() {
    return {
      activeName: "second",
      jsplumbInstance: getInstance("workplace", jsPlumb),
      flowType: "",
      flowData: {},
      nodeClass: nodeClass,
      nodeIcon: nodeIcon,
      links: [],
      self: this,
      dialogVisible: false,
      dialogComponent: "",
      nodeType: "",
      setClass: setClass,
      toolkit: ""
      // getInstance:getInstance
    };
  },
  computed: {},
  mounted() {
    this.initData();
    //this.initJsPlumbToolkit();

      steplist().then(
        data => {
          console.log(data)
        },
        err => {
          //   this.$message({
          //     message: err.response.message,
          //     type: "error",
          //     duration: 1500
          //   });
        }
      );
  },
  beforeCreate() {},
  created() {
    // this.jsplumbInstance = getInstance("workplace");
    // console.log("create",this.jsplumbInstance);
    // console.log("created");
    // console.log("jsPlumb",jsPlumb);
    // console.log("jsPlumbToolkit",jsPlumbToolkit);
  },
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    modifyFlowData(val) {
      return _.filter(_.cloneDeep(this.flowData), item => {
        return item.id != val;
      });
    },
    addNode() {},
    delNode(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.flowData = this.modifyFlowData(val);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    drawJsplumbChart(data) {
      addEndpointToNode(data.jsplumbInstance, data.self, data.flowData, {
        panzoom: "",
        draggablefn: "",
        container: $(".drop-workplace")
      });
      connect(
        data.jsplumbInstance,
        data.self,
        data.links
      );
    },
    initData() {
      //this.reset();
      setTimeout(() => {
        let data = {
          id: "20053ae4-8134-47e4-bdee-d168437d9de5",
          name: "tc_df_oo",
          flowType: "dataflow",
          steps: [
            {
              id: "source_2",
              name: "source_2",
              type: "source",
              x: 84,
              y: 81,
              otherConfigurations: {},
              inputConfigurations: [],
              outputConfigurations: []
            },
            {
              id: "sink_3",
              name: "sink_3",
              type: "sink",
              x: 457,
              y: 98,
              otherConfigurations: {},
              inputConfigurations: [],
              outputConfigurations: []
            }
            // {
            //   id: "sink_4",
            //   name: "sink_4 ",
            //   type: "sink",
            //   x: 400,
            //   y: 158,
            //   otherConfigurations: {},
            //   inputConfigurations: [],
            //   outputConfigurations: []
            // }
          ],
          links: [
            {
              name: "con_128",
              source: "source_2",
              sourceOutput: "output",
              target: "sink_3",
              targetInput: "input",
              input: "input"
            }
          ],
          oid: "$null",
          creator: "admin",
          createTime: 1559501740000,
          lastModifier: "admin",
          lastModifiedTime: 1561020270000,
          owner: "601a71e6-d6af-491c-ae3c-f70a939385de",
          version: 2,
          enabled: 0,
          moduleVersion: 0,
          tenant: {
            id: "55f7f910-b1c9-41d2-9771-e734e6b8285f",
            name: "default",
            creator: "root",
            createTime: 1559138723000,
            lastModifier: "root",
            lastModifiedTime: 1559731815000,
            owner: "af9b0954-51ef-40c9-aac6-39390b91bcc9",
            version: 1,
            moduleVersion: 0,
            enabled: 1,
            resourceQueues: ["default", "merce.normal"],
            hdfsSpaceQuota: 0,
            zid: "",
            expiredPeriod: 0
          },
          tableName: "merce_flow",
          isHide: 0,
          expiredPeriod: 0
        };

        this.flowData = data.steps;
        this.flowType = data.flowType;
        this.links = data.links;
        this.drawJsplumbChart({
          jsplumbInstance: this.jsplumbInstance,
          self: this,
          flowData: this.flowData,
          links: this.links
        });
      }, 100);
    },
    reset() {
      this.flowData = [];
      this.jsplumbInstance.deleteEveryEndpoint("workplace");
    },
    handleDrop(data, event) {
      // return;
      //console.log("handleDrop",handleDrop);
      let node = {
        id: data.drawIcon.id + "_" + (this.flowData.length + 1),
        name: data.drawIcon.name,
        type: data.drawIcon.type,
        x: event.offsetX,
        y: event.offsetY,
        otherConfigurations: data.drawIcon.otherConfigurations,
        inputConfigurations: data.drawIcon.inputConfigurations,
        outputConfigurations: data.drawIcon.outputConfigurations
      };
      this.flowData.push(node);
      addEndpointToNode(this.jsplumbInstance, this, this.flowData, {
        panzoom: "",
        draggablefn: "",
        container: $(".drop-workplace")
      });
    },
    handleClick(tab, event) {},
    fullScreen() {
      let el = document.getElementById("content");
      var rfs =
          el.requestFullScreen ||
          el.webkitRequestFullScreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullScreen,
        wscript;

      if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
      }

      if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript) {
          wscript.SendKeys("{F11}");
        }
      }
    }
  }
};
</script>

<style lang="scss">
.newjobDescription {
  background: #fff;
  //   width: 100%;
  position: fixed;
  top: 50px;
  left: 0;
  bottom: 0;
  right: 0;
  .editor {
    background: url("../../../../assets/design/designBg.png");
  }

  .right-aside {
    padding: 0 10px;
  }

  .row-bg {
    height: 100%;
  }

  .el-main {
    padding: 0;
  }

  .drop-workplace,
  .canvas {
    width: 100%;
    height: 100%;
    position: relative;

    //  .stepsItem:hover {
    //     border: 3px solid #48c038;
    //   }
  }
}
</style>
