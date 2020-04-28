<template>
  <div class="step-dialog">
    <el-dialog
      title="设置"
      :visible.sync="data.dialogVisible"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-dialog-drag
      @opened="showDailog"
      class="designDialog"
    >
      <el-form
        class="elForm"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        :label-position="labelPosition"
      >
        <el-form-item label="节点ID" prop="newName">
          <el-tooltip class="priorityMes" placement="top" effect="dark">
            <div slot="content">节点ID</div>
            <i class="el-icon-info"></i>
          </el-tooltip>
          <el-input v-model="ruleForm.id" name="id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="节点名称" prop="newName">
          <el-tooltip class="priorityMes" placement="top" effect="dark">
            <div slot="content">["节点显示名称，最长100"]</div>
            <i class="el-icon-info"></i>
          </el-tooltip>
          <el-input v-model="ruleForm.newName" name="newName"></el-input>
        </el-form-item>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, key) in data.nodeSetTab"
            :key="key"
            :name="key.toString()"
            :label="item.lable"
          >
            <div slot="label">
              <i :class="item.icon"></i>
              {{ item.title }}
            </div>
            <component
              :is="setTabTemplate(item.name)"
              :data="{
                tab: item,
                step: step,
                targetInput: data.nodeSetTab[key].targetInput,
                activeName:activeName,
                tablabel:tablabel,
                nodeSetTab:data.nodeSetTab
              }"
              @modifyFlowDataShowDialog="modifyFlowDataShowDialog"
              @getCheckedOutData="getCheckedOutData"
              @modifyStepData="modifyStepData"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            ></component>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="setCurrentStep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import {
  steplist,
  stepsettings,
  outputStep,
  validate
} from "@server/realtime/index";
import input from "../tab/input";
import parameter from "../tab/parameter";
import output from "../tab/output";
import _ from "lodash";
export default {
  watch: {
    data(val) {
      this.ruleForm = {
        id: val.step.id,
        newName: val.step.name
      };

      this.step = val.step;
    },
    flowData(val) {
      if (!this.data.step || !this.currenStepData) {
        return;
      } else {
        this.currenStepData = "";
      }
      let currentStep = _.find(val, item => {
        return this.data.step.id == item.id;
      });
      validate(currentStep).then(
        data => {
          if (data.status == 200) {
            this.closeDialog();
          }
        },
        err => {
          //this.closeDialog();
          let errorMessages = err.response.data.errorMessages;
          var showErrorMessage = "";
          var msgCount = 1;
          _.forEach(
            errorMessages,
            errorMsg =>
              (showErrorMessage =
                showErrorMessage + msgCount++ + ". " + errorMsg + "<br/>")
          );
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: showErrorMessage,
            type: "error",
            duration: 3000
          });
        }
      );
    },
    "realtime.loadingStatus"(val) {
      this.loading = val;
    },
    "realtime.selectCheckedDataSet"(val) {
      if (this.step.type == "source" || this.step.type == "sink") {
        this.getDatasettype(val);
      }
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    flowData: {
      type: Array,
      default: []
    }
  },
  components: {},
  data: function() {
    return {
      currenStepData: "",
      configCepData: { dialogCepFormVisible: false },
      dialogCepFormVisible: false,
      activeName: "0",
      loading: false,
      labelPosition: "left", //表单域标签的位置
      ruleForm: {
        //定义表单验证字段
        newName: "" //节点名称
      },
      rules: {
        //节点表单验证
        newName: [
          //新名称验证
          {
            required: true,
            message: "节点名称不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            max: 100,
            message: "节点显示名称，最长100",
            trigger: "blur"
          }
        ]
      },
      splitEndpoint: [],
      tablabel: "input",
      outputDataChecked: {},
      step: {}
    };
  },
  computed: {
    ...mapState(["realtime"])
  },
  mounted() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    ...mapActions([
      "getStepConfiug",
      "openDialog",
      "setDataSetSelect",
      "setParamertData",
      "initParametData",
      "initOutCheckedData",
      "initInputCheckedData",
      "initInputData",
      "initOutInputData",
      "modifyLoadingStatus",
      "setFormItemList",
      "setAdList",
      "getSplitEndpoint",
      "setInputCheckedData",
      "FLOW_CEP_DATA_ACTION"
    ]),

    // step type join
    modifyStepData(val) {
      let item = _.cloneDeep(this.step),
        key = "";

      switch (val.step.type) {
        case "sql":
          key = val.tab.source;
          break;
        default:
          key = val.tab.targetInput;
      }
      let inputConfigurations = {
        ...item.inputConfigurations
      };
      inputConfigurations[key] = this.mapCheckedData(val.inputRightData);

      delete inputConfigurations.input;

      this.step = {
        ...item,
        inputConfigurations: inputConfigurations
      };
      this.setInputCheckedData(inputConfigurations);
    },
    modifyLodadingStatus() {
      this.loading = false;
    },
    getCheckedOutData(val) {
      if (val == "split") {
        let outputData = {};
        _.forEach(this.realtime.splitEndpoint, val => {
          outputData[val] = this.mapCheckedData(this.realtime.checkedOutData);
        });
        return outputData;
      } else {
        return {
          output: this.mapCheckedData(this.realtime.checkedOutData)
        };
      }
    },
    setCurrentStep() {
      this.currenStepData = {
        parametData: this.realtime.parametData,
        checkedOutData: this.getCheckedOutData(this.step.type),
        checkedinPUTData: this.realtime.checkedinPUTData
      };
      this.modifyFlowDataShowDialog({
        step: { ...this.step, name, name: this.ruleForm.newName },
        data: this.currenStepData
      });
    },
    modifyFlowDataShowDialog(data) {
      this.$emit("modifyFlowData", data);
    },
    mapCheckedData(val) {
      return _.map(val, item => {
        return {
          ...item,
          alias: item.alias,
          column: item.name
        };
      });
    },
    closeDialog() {
      this.activeName = "0";
      this.data.dialogVisible = false;
      this.setDataSetSelect({});
      this.initParametData({});
      this.initOutCheckedData([]);
      this.initInputCheckedData([]);
      this.initInputData([]);
      this.modifyLoadingStatus(false);
      this.setAdList([]);
      this.FLOW_CEP_DATA_ACTION({
        name: "",
        events: [],
        links: []
      });
      this.$emit("getSelectDateVal", {});
    },
    setTabTemplate(val) {
      switch (val) {
        case "input":
          return input;
          break;
        case "parameter":
          return parameter;
          break;
        case "output":
          return output;
          break;
        default:
          "";
      }
    },
    getinputConfigurations(step, checkedinPUTData) {
      if (step.type == "source_dummy") {
        return undefined;
      }

      if (
        (step.type == "join" &&
          checkedinPUTData.left &&
          !checkedinPUTData.right) ||
        (checkedinPUTData.right && !checkedinPUTData.left)
      ) {
        return step.inputConfigurations;
      }

      return checkedinPUTData;
    },
    handleClick(tab, event) {
      this.tablabel = tab.label;
      //输出 tab
      if (this.step.type == "source" || this.step.type == "sink") {
        if (this.realtime.checkedOutData.length != 0) {
          this.initOutCheckedData(
            _.map(this.realtime.checkedOutData, item => {
              return {
                alias: item.alias,
                description: item.description,
                column: item.name,
                type: item.type
              };
            })
          );
        }
        return;
      }
      if (tab.label == "output") {
        let inputConfigurations = {};
        this.initOutInputData([]);

        switch (this.step.type) {
          case "sql":
          case "join":
            if (
              _.keys(this.step.inputConfigurations).length >
              _.keys(inputConfigurations).length
            ) {
              inputConfigurations = this.step.inputConfigurations;
            } else {
              inputConfigurations = this.getinputConfigurations(
                this.step,
                this.realtime.checkedinPUTData
              );
            }

            if (this.step.type == "sql") {
              delete inputConfigurations.input;
            }
            break;
          case "lookup":
          case "lookup_redis":
          case "lookup_mapdb":
            inputConfigurations = this.getinputConfigurations(
              this.step,
              this.realtime.checkedinPUTData
            );
            break;
          default:
            inputConfigurations = this.getinputConfigurations(
              this.step,
              this.realtime.checkedinPUTData
            );
        }
        this.modifyLoadingStatus(true);
        this.getOutPutData(
          {
            ...this.step,
            stepSettings: this.realtime.parametData,
            inputConfigurations: inputConfigurations
          },
          () => {
            this.modifyLoadingStatus(false);
          }
        );
        return;
      }

      if (this.step.type == "join" && tab.label == "input") {
        let typeTab = this.data.nodeSetTab[parseInt(this.activeName)]
          .targetInput;
        this.initInputTab(this.step, typeTab, typeTab, "");
      }

      if (this.step.type == "sql" && tab.label == "input") {
        let nodeSetTab = this.data.nodeSetTab[parseInt(this.activeName)];
        let typeTab = nodeSetTab.targetInput;
        let inputKey = parseInt(this.activeName) + 1;
        this.initInputTab(
          this.step,
          typeTab,
          nodeSetTab.source,
          nodeSetTab.source
        );
      }

      this.modifyLoadingStatus(false);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          data.dialogVisible = false;
          done();
        })
        .catch(_ => {});
    },
    initInputTable(val, targetInput, input, source) {
      let leftlink = _.find(this.data.links, item => {
        if (val.type == "join") {
          return item.target == val.id && item.targetInput == targetInput;
        }

        if (val.type == "sql") {
          return (
            item.target == val.id &&
            item.targetInput == targetInput &&
            item.source == source
          );
        }
        return item.target == val.id;
      });
      let data = _.find(this.data.flowData, item => {
        return item.id == leftlink.source;
      }).outputConfigurations;

      let initInputData = data[leftlink.sourceOutput];

      this.initInputData(
        _.map(initInputData, item => {
          return {
            alias: "",
            description: "",
            column: item.alias || item.column,
            type: item.type
          };
        })
      ); //left table
    },
    //
    initOutTab(step) {
      this.initOutCheckedData(this.getInitOutCheckedData(step));
    },
    getInitOutCheckedData(step) {
      if (step.type == "split") {
        return _.map(
          this.getSplitOutputData(step.outputConfigurations).valueList,
          val => {
            return {
              ...val,
              column: val.column
            };
          }
        );
      } else {
        return step.outputConfigurations.output;
      }
    },
    initInputTab(step, targetInput, input, source) {
      //left table
      this.initInputTable(step, targetInput, input, source);

      // right tabel
      let result = "";
      switch (step.type) {
        case "sql":
          result = step.inputConfigurations;
          break;
        case "join":
          result = step.inputConfigurations;
          break;
        default:
          result = step.inputConfigurations
            ? step.inputConfigurations[input]
            : [];
      }

      this.initInputCheckedData(result);
    },

    initInputItem() {
      //paramete tab
      this.initParametData(this.step.stepSettings);

      switch (this.step.type) {
        case "source":
        case "source_dummy":
          this.initOutCheckedData(
            this.step.outputConfigurations
              ? this.step.outputConfigurations.output
              : []
          );
          return;
        case "filter":
        case "watermark":
        case "cep":
        case "interval_filter":
        case "aggregate":
        case "transform":
        case "lookup":
        case "split":
          //input tab
          this.initInputTab(
            this.step,
            this.data.nodeSetTab[0].targetInput,
            "input",
            ""
          );
          //out tab
          this.initOutTab(this.step);
          return;
        case "join":
          // console.log('  case "join":');
          let nodeSetTabJoin = this.data.nodeSetTab[0];
          console.log("nodeSetTab", nodeSetTabJoin);
          this.initInputTab(
            this.step,
            nodeSetTabJoin.targetInput,
            nodeSetTabJoin.targetInput,
            ""
          );
          //input tab
          // this.initInputTab(
          //   this.step,
          //   this.data.nodeSetTab[parseInt(this.activeName)].targetInput,
          //   this.data.nodeSetTab[parseInt(this.activeName)].targetInput,
          //   ""
          // );
          //out tab
          this.initOutTab(this.step);
          return;
        case "sink":
          this.initInputTab(
            this.step,
            this.data.nodeSetTab[0].targetInput,
            "input",
            ""
          );
          return;
        case "sql":
          let nodeSetTab = this.data.nodeSetTab[0];
          this.initInputTab(
            this.step,
            nodeSetTab.targetInput,
            nodeSetTab.source,
            nodeSetTab.source
          );

          this.initOutTab(this.step);
          return;
        default:
      }

      // if (this.step.type == "source" || this.step.type == "source_dummy") {
      //   this.initOutCheckedData(
      //     this.step.outputConfigurations
      //       ? this.step.outputConfigurations.output
      //       : []
      //   );

      //   return;
      // }

      // if (
      //   this.step.type == "filter" ||
      //   this.step.type == "watermark" ||
      //   this.step.type == "interval_filter" ||
      //   this.step.type == "aggregate" ||
      //   this.step.type == "transform" ||
      //   this.step.type == "lookup" ||
      //   this.step.type == "split" ||
      //   this.step.type == "cep"
      // ) {
      //   //input tab
      //   this.initInputTab(
      //     this.step,
      //     this.data.nodeSetTab[0].targetInput,
      //     "input",
      //     ""
      //   );
      //   //out tab
      //   this.initOutTab(this.step);
      // }

      // if (this.step.type == "join") {
      //   //input tab
      //   this.initInputTab(
      //     this.step,
      //     this.data.nodeSetTab[parseInt(this.activeName)].targetInput,
      //     this.data.nodeSetTab[parseInt(this.activeName)].targetInput,
      //     ""
      //   );
      //   //out tab
      //   this.initOutTab(this.step);
      // }

      // if (this.step.type == "sink") {
      //   this.initInputTab(
      //     this.step,
      //     this.data.nodeSetTab[0].targetInput,
      //     "input",
      //     ""
      //   );
      // }

      // if (this.step.type == "sql") {
      //   let nodeSetTab = this.data.nodeSetTab[0];
      //   this.initInputTab(
      //     this.step,
      //     nodeSetTab.targetInput,
      //     nodeSetTab.source,
      //     nodeSetTab.source
      //   );

      //   this.initOutTab(this.step);
      // }
    },
    showDailog() {
      this.activeName = "0";
      this.tablabel = "input";
      let val = this.step.type;
      let type = this.step.stepSettings.type;
      stepsettings(
        val == "sink" || val == "source" ? val + "_" + type : val
      ).then(
        data => {
          if (val == "join") {
            this.getStepConfiug({
              allformItemList: data,
              joinCondition: this.getJoinConditionData(
                this.data.filterLinks,
                this.data.preSteps
              )
            });
          } else {
            this.getStepConfiug(data);
          }
        },
        err => {}
      );

      // init input table left
      this.initInputItem();

      if (this.step.type == "split") {
        let output = this.getSplitOutputData(this.step.outputConfigurations);
        let valueList = output.valueList;
        let keyList = output.keyList;

        this.getSplitEndpoint(keyList);
      }
    },
    getJoinConditionData(filterLinks, preSteps) {
      let result = {};
      _.forEach(filterLinks, link => {
        _.forEach(preSteps, step => {
          if (link.source == step.id && link.targetInput == "right") {
            result = {
              ...result,
              right: _.map(step.outputConfigurations.output, val => {
                return val.column;
              })
            };
          }
          if (link.source == step.id && link.targetInput == "left") {
            result = {
              ...result,
              left: _.map(step.outputConfigurations.output, val => {
                return val.column;
              })
            };
          }
        });
      });
      return result;
    },
    getSplitOutputData(data) {
      let valueList = [];
      let keyList = [];
      _.forEach(data, (value, key) => {
        valueList = [...valueList, ...value];
        keyList = [...keyList, key];
      });

      return {
        valueList: _.map(
          _.uniq(
            _.map(valueList, val => {
              return JSON.stringify(val);
            })
          ),
          val => {
            return JSON.parse(val);
          }
        ),
        keyList: keyList
      };
    },
    getOutPutData(val, fn) {
      outputStep(val).then(
        data => {
          if (data.status == 200) {
            if (this.step.type == "split") {
              let output = this.getSplitOutputData(data.data);
              let valueList = output.valueList;
              let keyList = output.keyList;

              this.getSplitEndpoint(keyList);

              this.initOutInputData(valueList);
            } else {
              this.initOutInputData(data.data.output);
            }
            fn();
          } else {
            this.$message.error(data.message);
          }
        },
        err => {
          // console.log('  err => {',err);
          // console.log(err);
          this.$message({
            message: err.response.data.err,
            type: "error",
            duration: 1500
          });
        }
      );
    },
    getFormData(storageConfigurations, stepsettingsData) {
      _.forEach(stepsettingsData, function(value, key) {
        _.forEach(storageConfigurations, function(svalue, skey) {
          if (value.name == skey && svalue) {
            value.defaultValue = svalue;
          }
        });
      });

      return stepsettingsData;
    },
    getDatasettype(dataset) {
      if (typeof dataset.storage == "undefined") {
        return false;
      }
      let type = this.step.type;
      stepsettings(
        type == "sink" || type == "source" ? type + "_" + dataset.storage : type
      ).then(
        data => {
          this.getStepConfiug(
            this.getFormData(dataset.storageConfigurations, data)
          );
        },
        err => {
          // this.$message({
          //   message: err.response.message,
          //   type: "error",
          //   duration: 1500
          // });
        }
      );
      // this.initForm();
    }
  }
};
</script>

<style lang="scss">
.step-dialog {
  .el-dialog {
    overflow: hidden;
    max-height: 700px;
  }
  .el-dialog__body {
    overflow: auto;
    max-height: 500px;
  }
  .elForm {
    margin: 0px 0px 10px 0px;
  }
  .priorityMes {
    position: absolute;
    top: 13px;
    color: #333;
    left: -20px;
  }
}
</style>
