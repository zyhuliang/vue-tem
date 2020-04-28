<template>
  <el-aside width="630px" style="padding-left:10px">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="画布设置" name="first" height="100%">
        <el-form ref="form" :model="form" label-width="100px" :label-position="'left'">
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="连线样式">
            <el-select
              v-model="form.link"
              placeholder="请选择活动区域"
              style="width:100%"
              @change="setLinksStyle(form.link)"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                :key="index"
                v-for="(item,index) in selectOptionlinks"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="组">
            <el-input placeholder="请输入内容" v-model="groupname">
              <template slot="append">
                <el-button type="primary" @click="creatGroup">创建</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="节点设置" name="sec">
        <component
          style="height:500px;"
          v-loading="cepNodeItemList&&cepNodeItemList.length==0?true:false"
          element-loading-text="正在加载数据"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :is="setformtemplate(eventNodeType)"
          v-if="isSelectNode"
          :data="{cepNodeItemList:cepNodeItemList}"
          ref="nodesetting"
        ></component>
        <div v-else style="height:500px;line-height:500px">
          <h3>请双击选择节点</h3>
        </div>
        <!-- <div v-show="cepNodeItemList.length==0" style="height:500px;line-height:500px">
          <h3>正在加载数据</h3>
        </div>-->
      </el-tab-pane>
    </el-tabs>
  </el-aside>
</template>


<script>
import {
  getCepLinks,
  getCepSettings,
  getEventsSetting
} from "@/api/realtime/index.js";
import { mapGetters, mapActions, mapState } from "vuex";
import starform from "./nodeSetting/StartEvent/index";
import conditonform from "./nodeSetting/ConditionEvent/index";
import GroupPatternEvent from "./nodeSetting/GroupPatternEvent/index";
import _ from "lodash";
export default {
  watch: {
    "realtime.currentSelectStep"(val) {
      console.log(' "realtime.currentSelectStep"(val) {',val);
      if (_.isEmpty(val)) {
        this.isSelectNode = false;
        return;
      }
      this.eventNodeType = val ? val.eventType : val;
      if (!_.isEmpty(val)) {
        this.activeName = "sec";
        this.isSelectNode = true;
      } else {
        this.activeName = "first";
        this.isSelectNode = false;
      }

      if (this.eventNodeType) {
        this.cepNodeItemList = [];
        this.loading = true;
        getEventsSetting({ event: this.eventNodeType }).then(res => {
          this.cepNodeItemList = res.data;
          this.loading = false;
        });
      }
    },
    "form.name"(val) {
      //console.log('"form.name"(val) {', val);
      this.FLOW_CEP_DATA_ACTION({
        ...this.realtime.FLOW_CEP_DATA_STATA,
        name: val
      });
    },
    "realtime.FLOW_CEP_DATA_STATA"(val) {
      this.form = { ...this.form, name: val.name };
    },

    "realtime.FLOW_CEP_DATA_STATA"(val) {
      console.log(' "realtime.FLOW_CEP_DATA_STATA"(val) {',val);
      this.isAddGroupAction(val.events);
      this.flowData = val;
    },
    // flowData(val){
    //   let reslut=_.filter(val.events,item=>{
    //     return item.isSelected;
    //   });

    //   console.log("flowdata",reslut);

    //   if(_.isEmpty(reslut)){
    //     this.activeName="first"
    //   }else{
    //     //this.activeName="sec"
    //   }


    // }
  },
  props: {
    // data: {
    //   type: Object,
    //   default: false
    // }
  },
  components: {},
  data: function() {
    return {
      activeName: "first",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        link: "NEXT"
      },

      selectOptionlinks: [],
      isSelectNode: false,
      eventNodeType: "",
      cepNodeItemList: [],
      loading: false,
      isAddGroup: false,
      groupname: "",
      flowData: []
    };
  },
  computed: {
    ...mapState(["realtime"])
  },
  mounted() {
    getCepLinks().then(res => {
      this.selectOptionlinks = _.map(res.data, item => {
        return {
          label: this.setlabelOfLinks(item.linkStrategy),
          value: item.linkStrategy
        };
      });
    });

    //getCepSettings();
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    ...mapActions([
      "setFlowCepLinksStyleAction",
      "FLOW_CEP_DATA_ACTION",
      "SET_STEP_LIST_GROUP_ACTION",
      "SET_FLOW_DATA_GROUP_ACTION"
    ]),

    isAddGroupAction(val) {
      let result = _.filter(val, item => {
        return item.isSelected;
      });

      this.isAddGroup = result.length >= 2 ? false : true;
    },

    creatGroup() {
      if (this.isAddGroup) {
        this.$message({
          message: "至少选择两个节点",
          type: "warning"
        });
        return;
      }

      if (!this.groupname) {
        this.$message({
          message: "请输入组名称",
          type: "warning"
        });
        return;
      }
      let flowid = _.uniqueId("group_flow_");
      let GroupEvents = {
        eventType: "GroupPatternEvent",
        flowid: flowid,
        name: this.groupname,
        quantifier: {
          strategy: "ONE_OR_MORE"
        },
        loopingContiguity: "NONE",
        loopingGreedy: "NONE",
        groupPatternId: "cep_group_id"
      };

      let selectedSteps = _.filter(this.flowData.events, item => {
        return item.isSelected == true;
      });

      let events= _.map(_.cloneDeep(selectedSteps), item => {
          delete item.isSelected;
          return item;
      });

      let links=_.filter(this.flowData.links,item=>{
        let isSource= _.find(events,subitem=>{
          return subitem.id==item.source
        });

        let isTarget=_.find(events,subitem=>{
          return subitem.id==item.target
        });

        if(isSource&&isTarget){
          return item
        }

      });

      let GroupFlowData = {
        id: flowid,
        name: this.groupname,
        events: events,
        links: links
      };

      this.groupname="";
      let flowData=this.realtime.FLOW_CEP_DATA_STATA;
      this.FLOW_CEP_DATA_ACTION({
        ...flowData,
        cepGroups:[
          ...flowData.cepGroups,
          GroupFlowData
        ],
        events:_.map(flowData.events,item=>{
          delete item.isSelected;
          return item;
        })
      });
      this.SET_FLOW_DATA_GROUP_ACTION(GroupFlowData);
    },
    setLinksStyle(val) {
      this.setFlowCepLinksStyleAction(val);
    },
    async getFormItemData(eventNodeType) {
      return await getEventsSetting({ event: eventNodeType });
    },
    setformtemplate(val) {
      switch (val) {
        case "StartEvent":
          return starform;
        case "ConditionEvent":
          return conditonform;
        case "GroupPatternEvent":
        return GroupPatternEvent;
        default:
          "";
      }
    },
    handleClick() {},
    setlabelOfLinks(val) {
      let result = "";
      switch (val) {
        case "NEXT":
          result = "紧邻";
          break;
        case "FOLLOWED_BY":
          result = "相近";
          break;
        case "FOLLOWED_BY_ANY":
          result = "任意";
          break;
        case "NOT_NEXT":
          result = "不要紧邻";
          break;
        case "NOT_FOLLOWED_BY":
          result = "不要相近";
          break;
        default:
          "";
      }

      return result;
    }
  }
};
</script>

<style lang="scss">
</style>
