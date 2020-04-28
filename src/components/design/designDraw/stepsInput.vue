<template>
  <div>
    <el-dialog
      v-dialog-drag
      v-if="stepsinput.flowSetVisible"
      title="节点输入选择"
      id="stepsinput"
      :close-on-click-modal="false"
      :visible.sync="stepsinput.flowSetVisible"
      :modal-append-to-body="false"
      @opened="showDialog"
      @close="dialogCloseed"
    >
      <div id="checkInput">
        <p class="fl font">输入节点：</p>
        <el-select class="fl" v-model="value" placeholder="请选择" @change="setValue(value)">
          <el-option
            v-for="(item,index) in targetList"
            :key="index"
            :label="item.key"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="inputsteps" name="dialog-sure">确 定</el-button>
        <el-button @click="cancel" name="dialog-cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import {
  nodeIcon,
  nodeClass,
  specialNodeClass,
  nodeQuote,
  nodeCache,
  nodeLinks,
  noParme,
  datamining
} from "@function/nodeSet";
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  components: {},
  data() {
    return {
      value: "",
      valueData: {},
      targetList: [{ key: "请选择", value: "" }]
    };
  },
  props: ["stepsinput", "subflowSetVisible"],
  methods: {
    ...mapActions([
      "getAllLinks",
      "insertLinks",
      "inserSubtLinks",
      "setlinksId"
    ]),
    filterLinkData(data) {
      return _.map(data, value => {
        //过滤sourceOutput
        if (value.sourceOutput == "yes") {
          value.sourceOutput = "yes";
        } else if (value.sourceOutput == "no") {
          value.sourceOutput = "no";
        } else if (value.sourceOutput == "ok") {
          value.sourceOutput = "ok";
        } else if (value.sourceOutput == "error") {
          value.sourceOutput = "error";
        } else {
          value.sourceOutput = "output";
        }

        ////过滤targetInput

        if (nodeClass(value.targetInput) == "classD_C") {
          value.targetInput = value.source;
        } else if (value.input == "input1") {
          value.targetInput = "input1";
        } else if (value.input == "input2") {
          value.targetInput = "input2";
        } else if (value.input == "right") {
          value.targetInput = "right";
        } else if (value.input == "left") {
          value.targetInput = "left";
        } else {
          value.targetInput = "input";
        }

        ////过滤input

        if (value.input == "left") {
          value.input = "left";
        } else if (value.input == "right") {
          value.input = "right";
        } else if (value.input == "input1") {
          value.input = "input1";
        } else if (value.input == "input2") {
          value.input = "input2";
        } else {
          value.input = "input";
        }

        return value;
      });
    },
    setValue(val) {
      if (!val) {
        return;
      }
      if (this.pk.insertLinks.length > 1) {
        _.pull(this.pk.insertLinks, _.last(this.pk.insertLinks));
      }

      this.insertLinks(JSON.parse(val));
    },
    cancel() {
      this.stepsinput.flowSetVisible = false;
      this.dialogCloseed();
    },
    dialogCloseed() {
      this.$emit("delCurrentLinks");
      this.targetList = [{ key: "请选择", value: "" }];
    },
    inputsteps() {
      if (!this.value) {
        this.$message({
          message: "请选择输入节点",
          type: "warning"
        });
        return;
      }
      let insertNode = this.pk.insertLinks;
      let links = [
        {
          name: this.pk.linkID,
          source: insertNode[0].id,
          sourceOutput: insertNode[0].label,
          target: insertNode[1].id,
          targetInput: insertNode[1].type,
          input: insertNode[1].label
        }
      ];
      this.inserSubtLinks(this.filterLinkData(links)[0]);
      this.stepsinput.flowSetVisible = false;
      this.insertLinks([]);
      this.setlinksId("");
      this.targetList = [{ key: "请选择", value: "" }];
    },
    showDialog() {
      this.value = "";

      let allLinks = this.pk.allLinks;
      let subFlowData = this.stepsinput.flowData.changeStepsArr; //changeLinksArr

      let links = this.isEmptyLinks();

      console.log("isEmptyLinks", links);

      this.targetList = _.concat(
        this.targetList,
        ..._.map(links, item => {
          if (item.type == "join" || item.type == "productjoin") {
            return [
              {
                key: item.id + " left",
                value: JSON.stringify({
                  id: item.id,
                  type: item.type,
                  label: "left"
                })
              },
              {
                key: item.id + " right",
                value: JSON.stringify({
                  id: item.id,
                  type: item.type,
                  label: "right"
                })
              }
            ];
          }

          if (item.type == "minus") {
            return [
              {
                key: item.id + " input1",
                value: JSON.stringify({
                  id: item.id,
                  type: item.type,
                  label: "input1"
                })
              },
              {
                key: item.id + " input2",
                value: JSON.stringify({
                  id: item.id,
                  type: item.type,
                  label: "input2"
                })
              }
            ];
          }
          if (
            item.type == "transform" ||
            item.type == "validate" ||
            item.type == "lookup" ||
            item.type == "starjoin" ||
            item.type == "intersect" ||
            item.type == "split" ||
            item.type == "union" ||
            item.type == "decision"||
            item.type=="supplement" ||
            item.type == "cache" ||
            item.type =="aggregate" ||
            item.type == "top" ||
            item.type == "sample" ||
            item.type == "filter" ||
            item.type == "sql"  ||
            datamining(item.type) == "datamining"
          ) {
            return {
              key: item.id,
              value: JSON.stringify({
                id: item.id,
                type: item.type,
                label: ""
              })
            };
          }
        })
      );
    },

    // getTarget() {
    //    var evens = _.cloneDeep(this.pk.subFlowSteps);
    //     _.forEach(this.getSourceEle(), item => {
    //       _.remove(evens, function(n) {
    //         return n.id == item;
    //       });
    //   });
    //   console.log('this.getSourceEle()',this.getSourceEle());
    //   console.log("this.stepsinput.flowData.changeStepsArr",this.pk.subFlowSteps);
    //   console.log("evens",evens);
    //   return evens;
    // },
    // getSourceEle() {

    //    console.log("this.stepsinput.flowData.changeLinksArr",this.pk.subFlowLinks);
    //   return _.map(this.pk.subFlowLinks, item => {
    //     return item.target;
    //   });
    // },
    // isEmptyLinks() {
    //   // let result = _.cloneDeep(this.stepsinput.flowData.changeStepsArr);
    //   return this.getTarget();
    // }
    isEmptyLinks() {
      let result = _.cloneDeep(this.stepsinput.flowData.changeStepsArr);
      let targetList = [];
      //  _.forEach(this.stepsinput.flowData.changeLinksArr, (value, key)=> {
      //     _.remove(result,(item,index)=>{
      //        return item.id==value.target;
      //     });
      //  });

      // return result;
      return [_.head(this.stepsinput.flowData.changeStepsArr)];
    }
  },
  computed: {
    ...mapState(["pk"])
  }
};
</script>
<style scoped lang="scss">
#checkInput {
  width: 100%;
  height: 30px;
  // overflow: auto;
}
.fl {
  float: left;
}
.font {
  font-size: 16px;
  padding-top: 5px;
}
</style>

