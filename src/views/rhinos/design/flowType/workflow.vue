<template>
    <section class="con-module">
        <div class="child-content" id="bm-designdrawing-form">
            <div class="btnClass" v-if="!id">
                <!-- 左侧功能区 -->
                <div class="desLeft">
                    <el-input class="flowNameInput" placeholder="" name="名称" :title="flowName" v-model="flowName" readonly="readonly">
                        <template slot="prepend">名称</template>
                    </el-input>
                    <el-tooltip placement="top" effect="light">
                        <div slot="content">最新版本为工作版本，如果需要从历史中恢复，<br/>请选择一个版本，（编辑）保存后即为新版本</div>
                        <el-dropdown class="drawSelHis" split-button type="primary" trigger="click" @command="disVersion">
                            <i class="icon iconfont icon-ir-operation-history drawHisBut"></i>&nbsp;历史&nbsp;V{{flowVersion}}
                            <el-dropdown-menu slot="dropdown" class="drawHisSel">
                                <el-dropdown-item v-if="item.version != '0'" v-for="item in flowHistory" :key="item.version" :command="item.version">【{{item.version}}】&nbsp;{{item.lastModifiedTime | updateTimeFilter}}&nbsp;&nbsp;</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-tooltip>
                </div>
                <!-- 右侧功能区 -->
                <div class="btn-right">
                    <el-button v-if="changeSteps.changeStepsArr.length > 0" type="info" @click="customStep" id="designSet"><i class="icon iconfont icon-ir-set"></i>&nbsp;自定义</el-button>
                    <el-button type="info" @click="drawRefresh" id="drawRefresh"><i class="icon iconfont icon-ir-refresh"></i>&nbsp;重置</el-button>
                    <el-button type="info" @click="drawReturn" id="drawReturn"><i class="icon iconfont icon-ir-left"></i>&nbsp;返回</el-button>
                    <el-button type="info" @click="designSet" id="designSet"><i class="icon iconfont icon-ir-set"></i>&nbsp;设置</el-button>
                    <el-button type="info" :disabled="!designStepLength" @click="designSave" id="designSave"><i class="icon iconfont icon-ir-save"></i>&nbsp;保存 workflow</el-button>
                    <el-button v-if="submitState==0" type="info" :disabled="!designStepLength" id="designSubmit1" @click="designSubmiterror" class="submiterror"><i class="icon iconfont icon-ir-ok "></i>&nbsp;提交</el-button>
                    <el-button v-if="submitState==1" type="info" :disabled="!designStepLength" id="designSubmit" @click="designSubmit"><i class="icon iconfont icon-ir-ok"></i>&nbsp;提交</el-button>
                    <el-button type="info" :disabled="!designStepLength" @click="designSchedule" id="designSchedule"><i class="icon iconfont icon-ir-add"></i>&nbsp;调度</el-button>
                    <el-button type="info" @click="designDelSave" id="designDelSave"><i class="fa fa-eraser"></i>&nbsp;清空</el-button>
                </div>
            </div>
            <div class="rf-content">
                <el-row class="drawingCanvas" id="drawingCanvas" element-loading-background="#f6f6f6">
                    <!-- 右侧节点区 -->
                    <div id="right">
                        <el-collapse accordion>
                            <el-collapse-item 
                             v-for="(drawNav,index) in common.commonStepData.workflow"
                            track-by="$index" v-if="drawNav.thisIcon.length != '0'" :key="index" :name="index">
                                <template slot="title">
                                    <i class="icon iconfont icon-ir-supply-chain"></i>&nbsp;{{drawNav.group | cn}}<span class="iconNavNub">({{drawNav.thisIcon.length}})</span>
                                </template>
                                <div class="designIcon" v-for="(drawIcon,key,index) in drawNav.thisIcon" :key="index" :data-index="index" :data-type="drawIcon.type">
                                    <el-tooltip class="item" effect="dark" :content="drawIcon.name| cn" placement="top">
                                        <div>
                                            <i class="icon iconfont icon-ir-designIconBg designIconBg"></i>
                                            <i :class="drawIcon.name | iconFilter"></i>
                                            <h4>{{drawIcon.name | cn}}</h4>
                                        </div>
                                    </el-tooltip>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                    <!-- <div id="designMaindesign" style="width:80%; height: 100%"></div> -->
                    <!-- 画布 -->
                    <div id="designMain"  ></div>
                </el-row>
            </div>

            <!-- 节点设置 弹出层 -->
            <!-- <node-set ref="nodeData" :nodeSet = "nodeSet"  @getWorkDataflowName="getStepDataflowName" ></node-set> -->
            <component :is="flowNodeTypes" ref="nodeData" :nodeSet = "nodeSet"  @getWorkDataflowName="getStepDataflowName" ></component>
            <!-- 参数声明 弹出层 -->
            <design-set :flowSetData="flowSet"  ref="desSetReData"  @tableData = "tableData"></design-set>
            <!-- 执行计划设置 弹出层 -->
            <design-submit :flowSubData = "flowSubData"></design-submit>
            <!-- 自定义step 弹出层 -->
            <custom-step :customDataSet = "customData" :changeSteps = "changeSteps" @customStatus = "customStatus"></custom-step>
            <!-- 自定义组合step内容 弹出层 -->
            <custom-content :customDataSet = "customContentStep"  @customDataContentSet = "customDataContentSet"></custom-content>
        </div>
    </section>
</template>
<script>
    import { mapGetters, mapActions, mapState } from "vuex";
    import $ from "jquery";                                //jquery库
    import * as jQul from "@static/jsLibrary/jquery-ui.min.js"; //jquery-ui库
    import moment from "moment"//时间格式化
    import { drawFlowData,drawGquery,drawHistoryData,drawHistoryVersion,drawSaveData,outputDataFlow,getSchema,getDataset} from "@api" //接口
    // import nodeSet from '@design/designDraw/nodeSetDataflow.vue';   //节点设置 组件
    import { flowNodeTypeComp } from "@function/flowTypeNode"                     //参数类型
    import designSet from '@design/designDraw/designSet.vue';           //参数声明 组件
    import designSubmit from '@design/designDraw/designSubmit.vue';     //执行计划设置 组件
    import {copyArr,deepCopy,unique,filterObj,filterId,transformArr} from "@function/comFunction.js";   //引入公用函数
    import {stepsFilterObj,lStepsFilterObj,displayProp,createComparisonFunction} from "@function/designFunction.js";             //引入design专用函数
    import {nodeIcon,nodeClass,specialNodeClass,nodeQuote,nodeCache,nodeLinks,noParme} from "@function/nodeSet"
    import customStep from '@design/designDraw/customStep.vue';
    import customContent from '@design/designDraw/customContent.vue';
    import rectSelect from '@function/rectSelect.js'
    import {steps, links} from "@components/mock/mockSteps"
    import {connectorPaintStyle,connectorHoverStyle,origin,destination,getSteps,createRandomTime} from './flowStyle'
    import { compileFunction } from 'vm';
    import jsPlumb from "jsplumb"; //"jsPlumb": "^2.11.2",

    var int = parseInt(0)

    function createRandomId(){
        int++
        var thisId = []
        $("#designMain .designIconBig").each(function () {
            thisId.push($(this).attr("data-index"))
        })
        var thisIfArr = [];
        for(var i =0; i <thisId.length; i++){
            var str = thisId[i];
            var index = str .lastIndexOf("\_");
            str  = str .substring(index + 1, str .length);
            if(str == int){
                thisIfArr.push(true)
            }else{
                thisIfArr.push(false)
            }
        }
        if(thisIfArr.indexOf(true) == -1){
            return int;
        }else if(thisIfArr.indexOf(true) != -1){
            return createRandomId();
        }
    }
    export default {
         computed: {
            ...mapState(["pk", "common"])
        },
        components: {
            jQul,
            designSet,
            designSubmit,
            customStep,
            customContent
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        inject:  ['reload'],
        data() {
            return {
                loading:false,
                flowId:this.$route.params.id,           //流程ID
                flowType:this.$route.query.type,        //流程类型
                flowName:'',                            //流程名称
                flowData:[],                            //流程数据
                flowHistory:[],                         //流程历史数据
                flowVersion:'',                         //流程历史版本值
                statementTab:[],                        //流程设置 参数申明 的tab切换数据
                schemaId:'',                            //存储schemaId 验证
                datasetIdArr:[],                        //存储 datasetIdArr 验证
                saveFlowData:{},                        //流程保存 保存接口的传参对象
                nodeLength:"",                          //初始化时，获取流程节点的数量
                nodeStepsData:[],                       //存储gquery 当前流程类型的节点数据
                flowSet:{                               //流程设置 参数声明 传参
                    referenceVariable:[],               //存储当前流程所有参数 存入的引用变量
                    thisPamVar:[],                      //流程设置 存入的自定义变量
                    quoteDataInput:[],                  //存储当前流程内的所有 source 节点  quoteDataMsg
                    quoteDataParameter:[],              //存储当前流程内有节点的名称
                    quoteDataOutput:[],                 //存储当前流程内的所有 sink 节点
                    quoteDataDependencies:[],           //参数声明设置 依赖项
                    inputs: false,                      //显示设置内的输入项
                    outputs: false,                     //显示设置内的输出项
                    // quoteAllDataMsg: {                  //流程设置 数据
                    //     inputs: [],                     //流程设置 输入
                    //     parameters: [],                 //流程设置 参数
                    //     outputs: [],                    //流程设置 输出
                    //     dependencies:[]                 //流程设置 依赖
                    // },
                    flowData:{
                        inputs: [],                     //流程设置 输入
                        parameters: [],                 //流程设置 参数
                        outputs: [],                    //流程设置 输出
                        dependencies:[]                 //流程设置 依赖
                    },
                    flowSetVisible:false,                   //设置 参数声明 弹出框 显示/隐藏
                },
                customData: {
                    flowSetVisible : false,
                    flowData:[]
                },
                flowSubData:{                           //流程提交 传参
                    flowId:"",                          //流程ID
                    flowName:"",                        //流程名称
                    flowType:"",                        //流程类型
                    dSubName:"",                        //name
                    dSubTime:"",                        //时间
                    flowHisVersion: "",                 //当前流程历史版本值
                    flowData:[],                        //流程数据
                    flowSubmitVisible:false,            //提交 执行计划设置 显示/隐藏
                },
                copySteps:[],                           //复制 需要的当前的流程数据
                thisStepId:"",                          //复制 需要的当前流程的ID
                thisObj:{},                             //复制 存储深度拷贝数据
                thisLinksData:[],                       //双击获取当前流程的所有连接线
                gQuery:[],                              //根据流程类型获取相对应的节点
                flowCanvasLoading: true,                //流程画布 加载状态
                gQueryLoading: true,                    //右侧节点 加载状态
                nodeSet: {                              //节点详细信息
                    newName: '',                        //新名称
                    inputData:[],                       //存储当前节点上一个的输入数据
                    outputData:[],                      //存储输出数据
                    nodeSetTab:[],                      //存储 节点信息 弹出框的tab切换
                    thisNodeData:[],                    //双击节点 获取当前节点数据
                    nodeLine:{                          //当前节点的 输入输出线
                        inputLine:[],
                        outputLine:[]
                    },
                    datasetType:'',                     // source 数据集类型
                    flowData:[],                        //流程数据
                    nodeSetVisible:false,               //节点设置 组件 弹出框 显示/隐藏
                    dbStatus:"0"                        //节点双击状态
                },
                designStepLength:'',                    //当前流程的 节点数量
                labelPosition: 'left',                  //表单域标签的位置
                bSk: false,                             //验证 参数声明 流程设置 的参数内有无数据 ??
                submitState:1,                          //提交按钮状态
                //id: this.id,
                flowNodeTypes:'',                        //节点类型组件
                routeTrue:false,                         //离开路由监听状态
                changeSteps:{
                    changeStepsArr: [],
                    changeLinksArr: []
                },
                customContentStep: {
                    flowSetVisible : false,
                    flowData:[]
                },
            }
        },
        filters: {
            //过滤右侧图标
            iconFilter: function (value) {
                if(nodeIcon(value) == "iconTrue"){
                    return 'icon iconfont icon-ir-d-'+value
                }else {
                    return 'icon iconfont icon-ir-d-default'
                }
            },
            //过滤历史版本下拉内容的时间，返回 YYYY-MM-DD HH:mm:ss 格式
            updateTimeFilter : function (val) {
                return moment(val).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        watch: {
            $route(to,from){}
        },
        created:function(){
        },
        methods: {
            ...mapActions([
            "getCommonStepData"
            ]),
            //获取自定义steps状态
            customStatus(val){
                $("#designMain .designIconBig").removeClass("redStyle")
                $("#designMain .designIconBig #pitchOnDes").removeClass("fa-square").css('color','#b9c0d')
                this.changeSteps.changeStepsArr = []                        //提交后清空多选steps
                this.changeSteps.changeLinksArr = []
            },
            customContentList(){
                    this.customContentStep.flowSetVisible = true
            },
            customDataContentSet:function(val){
                console.log(val)
                this.customStepsLoad(val[0].stepInfo)
                
            },
            //流程参数不完整 提交
            designSubmiterror(){
                this.$message({
                    message: '当前流程还没有保存,请修改后保存！！',
                    type: 'error',
                    duration: 1500
                });
            },
            /**
             * 加载当前ID的设计视图
             * ------------------------------------------------------------------
             */
            readDesign : function (data) {
                this.flowData = data;
                //名称
                this.flowName = data.name;
                this.nodeLength = data.steps.length;
                //显示当前设计
                var elementSign = 0;
                var _this = this;
                var _that = jsPlumb.jsPlumb;
                // 连线初始化配置
                jsPlumb.jsPlumb.ready(function () {
                    _that.setContainer($("#designMain"));
                    var mainHTML=""
                    for(var i=0;i<data.steps.length;i++){
                        if(elementSign<data.steps[i].sign){//如果已经保存过,即将标记更新
                            elementSign=data.steps[i].sign;
                        }
                        var type = data.steps[i].type;
                        if(nodeIcon(type) == "iconTrue"){
                            var designType = type
                        }else {
                            var designType = "default"
                        }
                        function frameDesign(css){
                            mainHTML+='<div class="designIconBig '+css+'" data-sign="'+data.steps[i].name+'" data-index="'+data.steps[i].id+'" data-type="'+ data.steps[i].type +'" style="left:'+data.steps[i].x+'px;top:'+data.steps[i].y+'px;position:absolute;margin:0" >'
                                + '<div>'
                                + '<i class="icon iconfont icon-ir-designIconBg designIconBg"></i>'
                                + '<i id="changeSte" class="icon iconfont icon-ir-d-'+designType+'"></i>'
                                + '<h4 title="'+data.steps[i].name+'">'+data.steps[i].name+ '</h4>'
                                + '<h5>ID:'+data.steps[i].id+ '</h5>'
                                + '<em id="pitchOnDes" class="fa fa-square-o" title="选中"></em>'
                                + '<em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>'
                                + '<em id="removeDes" class="fa fa-trash-o" title="删除"></em>'
                                + '</div>'
                                + '</div>';
                        }
                        if(nodeClass(type) == "classD_A"){
                            frameDesign("t1Style");
                        }else if(nodeClass(type) == "classD_B"){
                            frameDesign("t3Style");
                        }else {
                            frameDesign("t2Style");
                        }
                    };
                    $("#designMain").append(mainHTML);
                    $("#designMain .designIconBig").each(function(){
                        var drawType = $(this).attr("data-type");
                        //左侧无，右侧一个起点
                        if(drawType == "parallel"){
                            _that.addEndpoint(this, {anchors: "LeftMiddle",maxConnections: -1 }, deepCopy(destination, {uuid: $(this).attr("data-index") + "input" + "destination"}));
                            _that.addEndpoint(this, { anchors: "RightMiddle" ,maxConnections: -1}, deepCopy(origin, {uuid:$(this).attr("data-index")+"output"+"origin"}));
                        }else{
                            _that.addEndpoint(this, { anchors: "RightMiddle",maxConnections: -1}, deepCopy(origin, {uuid:$(this).attr("data-index")+"output"+"origin"}));
                            _that.addEndpoint(this, { anchors: "LeftMiddle"},  deepCopy(destination, {uuid:$(this).attr("data-index")+"input"+"destination"}));
                        }
                        jsPlumb.jsPlumb.repaintEverything();
                        _that.draggable($(this));
                        $(this).draggable({
                            containment: $("#designMain")
                        });
                    });
                    if($("#designMain").find(".designIconBig").length == 0){
                        _this.designStepLength ="";
                    }else{
                        _this.designStepLength = $("#designMain").find(".designIconBig").length;
                    }
                    //固定连线
                    if (data.links == undefined || data.links == ""){
                    }else {
                        for(var i=0;i<data.links.length;i++){
                            var sourceOutputName = data.links[i].sourceOutput;
                            var targtInputName = data.links[i].input;
                            jsPlumb.jsPlumb.connect({uuids:[data.links[i].source+sourceOutputName+"origin",data.links[i].target+targtInputName+"destination"]})
                        };
                    }
                    //参数声明 引用读取
                    $("#designMain").find(".designIconBig").each(function () {
                        var dataType = $(this).attr("data-type");
                        if(nodeQuote(dataType) === 'quoteA'){
                            _this.flowSet.quoteDataInput.push($(this).find("h4").text())
                            _this.flowSet.inputs = true;
                        }
                        if(nodeQuote(dataType) === 'quoteB'){
                            _this.flowSet.quoteDataOutput.push($(this).find("h4").text())
                            _this.flowSet.outputs = true;
                        }
                        _this.flowSet.quoteDataParameter.push($(this).find("h4").text());
                    })
                    _this.flowSet.quoteDataInput = unique(_this.flowSet.quoteDataInput);
                    _this.flowSet.quoteDataParameter = unique(_this.flowSet.quoteDataParameter);
                    _this.flowSet.quoteDataOutput = unique(_this.flowSet.quoteDataOutput);
                    let nodeId = document.getElementById("designMain");
                })
            },
            getStepListByType(data, flowType) {
                var dataTitle = [];
                var dataIcon = [];
                var _this = this;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name == "analyzeStats") {
                    data.splice(i, 1);
                    }
                    if (data[i].tags[1] == flowType) {
                    dataIcon.push(data[i]);
                    dataTitle.push(data[i].group);
                    }
                }
                var dataT = unique(dataTitle);
                var dataI = [];
                dataT.map(function(value, index, arr) {
                    dataI.push({ group: dataT[index], dataIcon });
                });
                var pIcon = [];
                for (var i = 0; i < dataI.length; i++) {
                    var thisIcon = [];
                    for (var j = 0; j < dataI[i].dataIcon.length; j++) {
                    if (dataI[i].dataIcon[j].tags[0] == dataI[i].group) {
                        thisIcon.push(dataI[i].dataIcon[j]);
                    }
                    }
                    pIcon.push({ group: dataT[i], thisIcon });
                }
                let result = pIcon.sort(createComparisonFunction("group")),
                    nodeStep = [];
                if (!sessionStorage.getItem("nodeStep")) {
                    for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].thisIcon.length; j++) {
                        nodeStep.push(result[i].thisIcon[j]);
                    }
                    }
                    sessionStorage.setItem("nodeStep", JSON.stringify(nodeStep));
                }
                return result;
                },
            /**
             * gQuery接口查询 根据类型过滤展示steps
             * ------------------------------------------------------------------
             */
            drawGqueryList : function (flowId) {
               
                drawGquery(flowId).then(data => {
                    //============
                    data.forEach((item,index) =>{
                        if(
                        (item.name == "analyzeStats" ||
                        item.name == "productjoin" ||
                        item.name == "lookup" ||
                        item.name == "split")&&(item.tags[1] =='streamflow')
                        ){
                        data.splice(index, 1)
                        }
                    })
                    this.getCommonStepData({
                        dataflow: this.getStepListByType(data, "dataflow"),
                        workflow: this.getStepListByType(data, "workflow"),
                        streamflow: this.getStepListByType(data, "streamflow")
                    });
                    //============
                    var dataTitle = [];
                    var dataIcon = [];
                    var _this = this;
                    for(var i = 0; i < data.length; i++){
                        if(data[i].name == "analyzeStats"){
                            data.splice(i, 1);
                        }
                        if(data[i].tags[1] == this.flowType){
                            dataIcon.push(data[i]);
                            dataTitle.push(data[i].group);
                        }
                    }
                    var dataT = unique(dataTitle);
                    var dataI = [];
                    dataT.map(function (value,index,arr) {
                        dataI.push({group:dataT[index],dataIcon});
                    })
                    var pIcon = [];
                    for(var i =0 ; i < dataI.length; i++){
                        var thisIcon = [];
                        for(var j = 0; j < dataI[i].dataIcon.length; j++){
                            if(dataI[i].dataIcon[j].tags[0] == dataI[i].group){
                                thisIcon.push(dataI[i].dataIcon[j])
                            }
                        }
                        pIcon.push({group:dataT[i],thisIcon})
                    }
                    this.gQuery = pIcon.sort(createComparisonFunction("group"));
                    for(var i = 0; i < _this.gQuery.length; i++){
                        for(var j =0; j < _this.gQuery[i].thisIcon.length; j++){
                            _this.nodeStepsData.push(_this.gQuery[i].thisIcon[j])
                        }
                    }
                    sessionStorage.setItem("nodeStep", JSON.stringify(_this.nodeStepsData));
                    this.gQueryLoading = false;
                }, err => {
                    this.gQueryLoading = true;
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            /**
             * flow接口查询 历史版本接口查询
             * ------------------------------------------------------------------
             */
            listTable:function listTable(flowId){
                this.loading=true;
                // GET /someUrl
                drawFlowData(flowId).then(data => {
                    this.flowType = data.flowType;
                    this.flowData = data;
                    this.submitState = data.enabled;
                    this.flowCanvasLoading = false;
                    this.readDesign(data);
                    this.copySteps = transformArr(deepCopy(data.steps));
                    this.loading=false;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }).catch(() => {
                    this.flowCanvasLoading = true;
                });
                drawHistoryData(flowId).then(data => {
                    this.flowHistory = data;
                    // this.flowVersion = data[0].version;
                    this.flowVersion = data.length-1;
                    this.flowSubData.flowHisVersion =  data.length-1;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            /**
             * btnClick：刷新当前路由 重置
             * ------------------------------------------------------------------
             */
            drawRefresh : function () {
                if($("#designMain").find(".designIconBig").length > this.nodeLength){
                    this.$confirm('当前的修改会被重置，确定要继续吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.reload();
                    }).catch(() => {
                    });
                }else {
                    this.reload();
                }
                //sessionStorage.setItem('status','oldData'); // 设置design 返回时显示正常数据
            },
            /**
             * btnClick：返回上一页
             * ------------------------------------------------------------------
             */
            drawReturn : function () {
                let urlTrue = window.location.href.indexOf('/project')!= -1;
                if(urlTrue === true){
                    this.$router.push({ path: '/resourceManProject' });
                }else{
                    this.$router.push({ path: '/design' });
                }
            },
            /**
             * selClick：选择历史版本
             * ------------------------------------------------------------------
             */
            disVersion : function(command){
                this.flowVersion = command;
                this.flowSubData.flowHisVersion = command;
                drawHistoryVersion(this.flowId+'/'+this.flowVersion+"?latestName=true").then(data => {
                    this.flowCanvasLoading = false;
                    jsPlumb.jsPlumb.deleteEveryEndpoint();
                    $("#designMain .designIconBig").each(function () {
                        this.remove();
                    });
                    this.readDesign(data);
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }).catch(() => {
                    this.flowCanvasLoading = true;
                });
            },
            /**
             * btnClick：设置 参数声明
             * ------------------------------------------------------------------
             */
            designSet : function () {
                var _this = this;
                $(document).off('keydown') //解绑键盘复制事件
                //获取当前的steps
                _this.getDesignSteps();
                this.flowSet.flowData = this.flowData
                let flowStep = transformArr(copyArr(_this.flowData.steps));
                let flowStepArr = [];
                //参数变量
                for(var qi = 0; qi < flowStep.length; qi++){
                    if(specialNodeClass(flowStep[qi].type) === "classW_A"){
                        for(var qj = 0; qj < displayProp(flowStep[qi].otherConfigurations).length; qj++){
                            let fsVal = displayProp(flowStep[qi].otherConfigurations)[qj];
                            if(fsVal === 'schemaId' || fsVal === 'datasetId' || fsVal === 'dataflowId$'){
                            }else{
                                //flowStepArr.push(flowStep[qi].name + "." + displayProp(flowStep[qi].otherConfigurations)[qj])
                                var tempParam = {}
                                var paramKey = flowStep[qi].id + "." + displayProp(flowStep[qi].otherConfigurations)[qj];
                                var paramValue = flowStep[qi].otherConfigurations[displayProp(flowStep[qi].otherConfigurations)[qj]];
                                tempParam[paramKey] = paramValue
                                flowStepArr.push(tempParam)
                            }
                        }
                    }else{
                        for(var qj = 0; qj < displayProp(flowStep[qi].otherConfigurations).length; qj++){
                            let fsVal = displayProp(flowStep[qi].otherConfigurations)[qj];
                            if(fsVal === 'schemaId' || fsVal === 'datasetId'){
                            }else{
                                //flowStepArr.push(flowStep[qi].name + "." + displayProp(flowStep[qi].otherConfigurations)[qj])
                                var tempParam = {}
                                var paramKey = flowStep[qi].id + "." + displayProp(flowStep[qi].otherConfigurations)[qj];
                                var paramValue = flowStep[qi].otherConfigurations[displayProp(flowStep[qi].otherConfigurations)[qj]];
                                tempParam[paramKey] = paramValue
                                flowStepArr.push(tempParam)
                            }
                        }
                    }
                }
                //自定义变量
                _this.flowSet.thisPamVar = [];
                for(var vi = 0; vi < flowStep.length; vi++){
                    for(var vj = 0; vj < transformArr(flowStep[vi].otherConfigurations).length; vj++){
                        let str = transformArr(flowStep[vi].otherConfigurations)[vj];
                        if(typeof str === "string"){
                            var patt = new RegExp("#\{[^}]+:[^}]+\}","g");
                            var result;
                            while ((result = patt.exec(str)) != null)  {
                                var index = result[0].indexOf(':')
                                var name = result[0].substr(2,index-2).replace(/^\s*/,'').replace(/\s*$/,'')
                                var value = result[0].substr(index+1).replace(/^\s*/,'').replace(/\s*\}$/,'')
                                _this.flowSet.thisPamVar.push({name: name, value: value})
                            }
                        }
                        if(typeof str === "object"){
                            var patt = new RegExp("#\{[^}]+:[^}]+\}","g");
                            for(var vk = 0; vk<str.length; vk++){
                                var result;
                                while ((result = patt.exec(str[vk])) != null)  {
                                    var index = result[0].indexOf(':')
                                    var name = result[0].substr(2,index-2).replace(/^\s*/,'').replace(/\s*$/,'')
                                    var value = result[0].substr(index+1).replace(/^\s*/,'').replace(/\s*\}$/,'')
                                    _this.flowSet.thisPamVar.push({name: name, value: value})
                                }
                            }
                        }
                    }
                }
                _this.flowSet.referenceVariable = flowStepArr;
                if(_this.flowData.inputs == undefined){
                    _this.flowSet.flowData.inputs = []
                }else {
                    _this.flowSet.flowData.inputs = transformArr(deepCopy(_this.flowData.inputs))
                }
                if(_this.flowData.parameters == undefined){
                    _this.flowSet.flowData.inputs = []
                }else {
                    _this.flowSet.flowData.parameters = _this.flowData.parameters;
                    if(sessionStorage.getItem("parameters") =='') {
                        sessionStorage.setItem("parameters", JSON.stringify(_this.flowSet.flowData.parameters));
                    }
                }
                if(_this.flowData.outputs == undefined){
                    _this.flowSet.flowData.outputs = []
                }else {
                    _this.flowSet.flowData.outputs = transformArr(deepCopy(_this.flowData.outputs));
                }
                if(_this.flowData.dependencies == undefined){
                    _this.flowSet.flowData.dependencies = []
                }else {
                    _this.flowSet.flowData.dependencies = transformArr(deepCopy(_this.flowData.dependencies));
                }
                _this.flowSet.flowSetVisible = true;
            },
            /**
             * btnClick：提交 计划执行设置
             * ------------------------------------------------------------------
             */
            designSubmit : function () {
                this.flowSubData.flowData = JSON.parse(JSON.stringify(this.flowData))
                $(document).off('keydown') //解绑键盘复制事件
                if($("#designMain").find(".designIconBig").length > this.nodeLength){
                    this.$confirm('当前的修改会被重置，确定要继续吗?', '提示', {
                        type: 'warning'
                    }).then(() => {}).catch(() => {});
                }else{
                    this.flowSubData.flowSubmitVisible = true;
                    this.flowSubData.flowName = this.flowName;
                    this.flowSubData.dSubName = this.flowName + " " + moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.flowSubData.dSubTime = moment(new Date(new Date().toLocaleDateString()).getTime()).format("YYYY-MM-DD HH:mm:ss");
                    this.flowSubData.flowId = this.flowId;
                    this.flowSubData.flowType = this.flowType;
                }
            },
            /**
             * btnClick：调度计划
             * ------------------------------------------------------------------
             */
            designSchedule: function () {
                this.$router.push({ path: "/hippo/schedule/add",query: { pid: this.flowId}});
            },
            /**
             * 确认 节点设置
             * ------------------------------------------------------------------
             */
            getStepDataflowName(name){
                this.nodeSet.newName = name;
            },
            /**
             * 自定义 节点设置
             * ------------------------------------------------------------------
             */
            customStep(){
                this.customData.flowSetVisible = true
                //获取当前的steps
                this.getDesignSteps();
                this.customData.flowData = this.flowData
            },
            /**
             * design设计器
             * ------------------------------------------------------------------
             */
            design : function () {
                //标志元素唯一性
                var elementSign = 0;
                var _this = this;
                var _that = jsPlumb.jsPlumb;
                jsPlumb.jsPlumb.ready(function() {
                    $("#right").children().find(".designIcon").draggable({
                        helper: "clone",
                        scope: "ss",
                        zIndex: 10
                    });
                    $("#designMain").droppable({
                            scope: "ss",
                            drop: function (event, ui) {//在目标(target)容器上释放鼠标 ,ui.draggable[0]为开始拖拽的元素
                                var type = $(ui.helper)[0].dataset.type;
                                if(type !== 'definestep' || type =='undefined'){
                                _that.setContainer($("#designMain"));
                                var randomId = createRandomId();
                                var left = parseInt(ui.offset.left - $(this).offset().left) + $(this).scrollLeft(); //添加左侧滚动条的距离
                                var top = parseInt(ui.offset.top - $(this).offset().top) + $(this).scrollTop(); //添加右侧滚动条的距离
                                var type = $(ui.helper)[0].dataset.type;
                                var name = ($(ui.helper)[0].textContent).replace(/ /g,'');
                                if(nodeIcon(type) == "iconTrue"){
                                    var iconType = type
                                }else {
                                    var iconType = "default"
                                }
                                var ele = $('<div class="designIconBig t2Style" data-sign="'+ name + "_" + randomId + '" data-index="'+ type + "_" +  randomId + '"  data-type="' + type + '">' +
                                    '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-'+iconType+'"></i><h4 title="'+name+'_'+randomId+'">'+name+'_'+randomId+'</h4><h5>ID:'+type+'_'+randomId+'</h5><em id="pitchOnDes" class="fa fa-square-o" title="选中"></em><em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em><em id="removeDes" class="fa fa-trash-o" title="删除"></em>'+'</div>'+ '</div>');
                                if(type == "parallel"){
                                    _that.addEndpoint(ele, {anchors: "RightMiddle", maxConnections: -1}, origin);//起点
                                    _that.addEndpoint(ele, {anchors: "LeftMiddle", maxConnections: -1}, destination);//终点
                                }else{
                                    _that.addEndpoint(ele, {anchors: "RightMiddle",maxConnections: -1}, origin);//起点
                                    _that.addEndpoint(ele, {anchors: "LeftMiddle"}, destination);//终点
                                }
                                ele.css({"left": left, "top": top, position: "absolute", margin: 0});
                                //_that.draggable(ele, {containment: "parent"});//端点可以拖动设置,并且将端点限制在父级内
                                $(this).append(ele);
                                jsPlumb.jsPlumb.repaintEverything();
                                _that.draggable(ele);
                                ele.draggable({
                                    containment: $("#designMain")
                                });
                                if($("#designMain").find(".designIconBig").length == 0){
                                    _this.designStepLength ="";
                                }else{
                                    _this.designStepLength = $("#designMain").find(".designIconBig").length;
                                }
                                //参数声明 引用读取
                                _this.flowSet.inputs = false;
                                _this.flowSet.outputs = false;
                                $("#designMain").find(".designIconBig").each(function () {
                                    var dataType = $(this).attr("data-type");
                                    if(nodeQuote(dataType) === 'quoteA'){
                                        _this.flowSet.quoteDataInput.push($(this).find("h4").text())
                                        _this.flowSet.inputs = true;
                                    }
                                    if(nodeQuote(dataType) === 'quoteB'){
                                        _this.flowSet.quoteDataOutput.push($(this).find("h4").text())
                                        _this.flowSet.outputs = true;
                                    }
                                    _this.flowSet.quoteDataParameter.push($(this).find("h4").text());
                                })
                                _this.flowSet.quoteDataInput = unique(_this.flowSet.quoteDataInput);
                                _this.flowSet.quoteDataParameter = unique(_this.flowSet.quoteDataParameter);
                                _this.flowSet.quoteDataOutput = unique(_this.flowSet.quoteDataOutput);
                                }else {
                                    //自定义流程节点
                                    _this.customContentList()
                                    // _this.customStepsLoad()
                                }
                            }
                        }
                    );
                    jsPlumb.jsPlumb.fire("addEndpoint", origin);
                })
            },
            /**
             * Function：获取当前的连接线
             * ------------------------------------------------------------------
             */
            getDesignLinks:function () {
                var _this =this;
                var links = [];
                $.each(jsPlumb.jsPlumb.getAllConnections(), function (idx,connection) {
                    links.push({
                        name:connection.id,
                        source:connection.source.dataset.index,
                        sourceOutput:connection.endpoints[0].canvas.nextSibling.textContent,
                        target:connection.target.dataset.index,
                        targetInput:connection.target.dataset.type,
                        input:connection.endpoints[1].canvas.nextSibling.textContent,
                    });
                });
                //过滤sourceOutput
                $.each(links, function (key,value) {
                    return value.sourceOutput = "output"
                });
                //过滤targetInput
                $.each(links, function (key,value) {
                    return value.targetInput = "input"
                });
                //过滤input
                $.each(links, function (key,value) {
                    return value.input = "input"
                });
                _this.thisLinksData = filterObj(links);
                sessionStorage.setItem("links",JSON.stringify(_this.thisLinksData));
            },
            /**
             * Function：获取当前的节点
             * ------------------------------------------------------------------
             */
            getDesignSteps:function () {
                getSteps();
                var sessionStorageSteps = JSON.parse(sessionStorage.getItem('steps'));
                var allSteps =  this.flowData.steps.concat(sessionStorageSteps);
                stepsFilterObj(allSteps)
                this.flowData.steps = allSteps;
                // 判断是否拖拽新的steps 新的就添加到copySteps中深拷贝
                var arr =[]
                if(this.copySteps.length == 0) return false
                if(sessionStorageSteps.length == 0) return false
                for(var i=0;i<this.copySteps.length;i++){
                    if(this.copySteps[i].id==sessionStorageSteps[sessionStorageSteps.length-1].id){
                        arr.push(true)
                    }else {
                        arr.push(false)
                    }
                }
                if(arr.indexOf(true)=='-1'){
                    this.copySteps.push(sessionStorageSteps[sessionStorageSteps.length-1])
                }
            },
            /**
             * btnClick：执行 保存
             * ------------------------------------------------------------------
             */
            designSave : function () {
                var _this = this;
                //获取steps
                this.getDesignSteps();
                //循环step 更改input
                for(var i=0; i<this.flowData.steps.length; i++){
                    if(this.flowData.steps[i].type =='dataflow'|| this.flowData.steps[i].type =='shell'){
                        this.flowData.steps[i].inputConfigurations = []
                        this.flowData.steps[i].outputConfigurations = []
                    }
                }
                //获取links
                this.getDesignLinks();
                var pStatement =  this.$refs.desSetReData;
                if(pStatement == undefined){
                    if(_this.flowData.inputs == undefined){
                        var saveInputs = []
                    }else {
                        var saveInputs = _this.flowData.inputs
                    }
                    if(_this.flowData.parameters == undefined){
                        var saveParameters = []
                    }else {
                        var saveParameters = _this.flowData.parameters
                    }
                    if(_this.flowData.outputs == undefined){
                        var saveOutputs = []
                    }else {
                        var saveOutputs = _this.flowData.outputs
                    }
                }else {
                    var saveInputs = this.flowData.inputs
                    var saveParameters = this.flowData.parameters
                    var saveOutputs = this.flowData.outputs;
                    var saveDependencies = this.flowData.dependencies;
                }
                //获取All参数
                this.saveFlowData = {
                    id:this.flowData.id,
                    name:this.flowData.name,
                    flowType:this.flowData.flowType,
                    nameDuplicatable:this.flowData.nameDuplicatable,
                    creator:this.flowData.creator,
                    createTime:this.flowData.createTime,
                    lastModifier:this.flowData.lastModifier,
                    lastModifiedTime:createRandomTime(),
                    inputs:saveInputs,
                    parameters:saveParameters,
                    outputs:saveOutputs,
                    dependencies:saveDependencies,
                    oid:this.flowData.oid,
                    owner:this.flowData.owner,
                    source:this.flowData.source,
                    tenant:this.flowData.tenant,
                    solrdocVersion:this.flowData.solrdocVersion,
                    version:this.flowData.version,
                    enabled:this.flowData.enabled,
                    moduleVersion:this.flowData.moduleVersion,
                    idPrefix:this.flowData.idPrefix,
                    expiredPeriod:this.flowData.expiredPeriod,
                    steps:this.flowData.steps,
                    links:JSON.parse(sessionStorage.getItem('links'))
                }
                if(sessionStorage.getItem('projectId')){ //判断是不是项目目录的flow
                        let projectId = {
                        id: sessionStorage.getItem('projectId')
                        }
                        this.saveFlowData.projectEntity = projectId
                }
                
                drawSaveData(_this.saveFlowData.id,_this.saveFlowData).then(data => {
                    _this.$message({
                        message: 'success，保存成功！',
                        type: 'success'
                    });
                    _this.reload();
                }, err => {
                    let errMesList = JSON.parse(err.response.data.detailMsg);
                    let mes = err.response.message;
                    let meslist=document.createElement("ol");
                    for(var i = 0; i < errMesList.length; i++){
                        meslist.appendChild(document.createTextNode("<li>"+errMesList[i].message+"</li>"));
                    }
                    if(errMesList != ""){
                        this.$message({
                            dangerouslyUseHTMLString: true,
                            message: "参数错误<br/><br/>"+meslist.innerText,
                            type: 'error',
                            duration: 1500
                        });
                    }else{
                        this.$message({
                            message: mes,
                            type: 'error',
                            duration: 1500
                        });
                    }
                    _this.reload();
                });
            },
            /**
             * btnClick：执行 清空所有设计
             * ------------------------------------------------------------------
             */
            designDelSave : function () {
                //标志元素唯一性
                var _this = this;
                var _that = jsPlumb.jsPlumb;
                _this.$confirm('确认要清理所有执行设计吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    _that.deleteEveryEndpoint();
                    $("#designMain .designIconBig").each(function () {
                        this.remove();
                    });
                    if($("#designMain").find(".designIconBig").length == 0){
                        _this.designStepLength ="";
                    }else{
                        _this.designStepLength = $("#designMain").find(".designIconBig").length;
                    }
                    //参数声明 引用读取
                    _this.flowSet.quoteDataInput = [];
                    _this.flowSet.quoteDataParameter = [];
                    _this.flowSet.quoteDataOutput = [];
                    _this.flowSet.quoteDataDependencies = [];
                    _this.flowSet.inputs = false;
                    _this.flowSet.outputs = false;
                    //清空 sessionStorage
                    sessionStorage.setItem("steps", []);
                    _this.flowData.steps=[];
                    sessionStorage.setItem("links", []);
                    //获取steps
                    _this.getDesignSteps();
                    _this.$message({
                        message: '恭喜你，删除已成功！',
                        type: 'success'
                    });
                }).catch(() => {
                });
            },
            /**
             * 组件：参数设置声明 传参
             * ------------------------------------------------------------------
             */
            tableData : function(val) {
                this.statementTab = val
                this.flowData.inputs = this.statementTab[0].inputs;
                this.flowData.parameters = this.statementTab[1].parameters
                this.flowData.outputs = this.statementTab[2].outputs
                this.flowData.dependencies = this.statementTab[3].dependencies
            },
            /**
             * 多个steps
             * ------------------------------------------------------------------
             */
            customStepsLoad: function (val) {
                 this.getDesignSteps();
                 this.getDesignLinks()
                 var Links = JSON.parse(sessionStorage.getItem('links'))
                 var data = {
                        steps: [],
                        links: []
                    }
                 var newSteps = JSON.parse(JSON.stringify(val.changeStepsArr))
                 var newLinks = JSON.parse(JSON.stringify(val.changeLinksArr))
                //  for(var h = 0; h<newLinks.length; h++){
                //      let arr = []
                //      for(var s=0; s<newSteps.length; s++){
                //          // 线的source 中查找step id有没有与之匹配的，没有找到就删除该条线
                //          if(newSteps[s].id == newLinks[h].source){
                //              arr.push(true)
                //          }else {
                //              arr.push(false)
                //          }
                //      }
                //      if(arr.indexOf(false)>0){
                //          newLinks.splice(h-1,1)
                //          val.changeLinksArr.splice(h-1,1)
                //          h--
                //      }
                //  }
                for(var i=0; i<val.changeStepsArr.length; i++){
                    for(var  k = 0; k<this.flowData.steps.length; k++){
                        if(val.changeStepsArr[i].id === this.flowData.steps[k].id){
                                var randomId = createRandomId();
                            for(var j=0; j<val.changeLinksArr.length; j++){
                                
                                if(val.changeStepsArr[i].id === val.changeLinksArr[j].source ){
                                    newLinks[j].source = newSteps[i].type + '_' + randomId
                                }
                                if(val.changeStepsArr[i].id === val.changeLinksArr[j].target){
                                    newLinks[j].target = newSteps[i].type + '_' + randomId
                                }
                                newSteps[i].name = newSteps[i].type + '_' + randomId
                                newSteps[i].id = newSteps[i].type + '_' + randomId
                            }
                        }
                    }
                }
                console.log(newLinks)
                // for(var i=0; i<json.steps.length; i++){
                //     for(var  k = 0; k<this.flowData.steps.length; k++){
                //         if(json.steps[i].id === this.flowData.steps[k].id){
                //                 var randomId = createRandomId();
                //             for(var j=0; j<json.links.length; j++){
                                
                //                 if(json.steps[i].id == json.links[j].source){
                //                     newLinks[j].source = newSteps[i].type + '_' + randomId
                //                 }
                //                 if(json.steps[i].id == json.links[j].target){
                //                     newLinks[j].target = newSteps[i].type + '_' + randomId
                //                 }
                //                 newSteps[i].name = newSteps[i].type + '_' + randomId
                //                 newSteps[i].id = newSteps[i].type + '_' + randomId
                //             }
                //         }
                //     }
                // }
                this.flowData.links = this.flowData.links.concat(newLinks)
                 this.flowData.steps = this.flowData.steps.concat(newSteps)
                 data.steps = newSteps
                 data.links = newLinks
                 this.customStepsPaste(data)
            },
            customStepsPaste: function(data){
                let n = 0
                var _this = this
                var _that = jsPlumb.jsPlumb;
                var elementSign = 0;
                jsPlumb.jsPlumb.ready(function () {
                    _that.setContainer($("#designMain"));
                    var mainHTML=""
                    for(var i=0;i<data.steps.length;i++){
                        if(elementSign<data.steps[i].sign){//如果已经保存过,即将标记更新
                            elementSign=data.steps[i].sign;
                        }
                        var type = data.steps[i].type;
                        if(nodeIcon(type) == "iconTrue"){
                            var designType = type
                        }else {
                            var designType = "default"
                        }
                        data.steps[i].x = data.steps[i].x + 50
                        data.steps[i].y = data.steps[i].y + 50
                        // data.steps[i].x = n++ * 20
                        // data.steps[i].y = n++ * 20
                        function frameDesign(css){
                            mainHTML+='<div class="designIconBig '+css+'" data-sign="'+data.steps[i].name+'" data-index="'+data.steps[i].id+'" data-type="'+ data.steps[i].type +'" style="left:'+data.steps[i].x+'px;top:'+data.steps[i].y+'px;position:absolute;margin:0" >'
                                + '<div>'
                                + '<i class="icon iconfont icon-ir-designIconBg designIconBg"></i>'
                                + '<i id="changeSte" class="icon iconfont icon-ir-d-'+designType+'"></i>'
                                + '<h4 title="'+data.steps[i].name+'">'+data.steps[i].name+ '</h4>'
                                + '<h5>ID:'+data.steps[i].id+ '</h5>'
                                + '<em id="pitchOnDes" class="fa fa-square-o" title="选中"></em>'
                                + '<em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em>'
                                + '<em id="removeDes" class="fa fa-trash-o" title="删除"></em>'
                                + '</div>'
                                + '</div>';
                        }
                        if(nodeClass(type) == "classD_A"){
                            frameDesign("t1Style");
                        }else if(nodeClass(type) == "classD_B"){
                            frameDesign("t3Style");
                        }else {
                            frameDesign("t2Style");
                        }
                    };
                    $("#designMain").append(mainHTML);
                    $("#designMain .designIconBig").each(function(){
                        var drawType = $(this).attr("data-type");
                        //左侧无，右侧一个起点
                        if (nodeClass(drawType) == "classD_A"){
                            _that.addEndpoint(this, { anchors: "RightMiddle",maxConnections: 100 }, deepCopy(origin, {uuid:$(this).attr("data-index")+"output"+"origin"}));
                        }else if(nodeClass(drawType) == "classD_B"){
                            _that.addEndpoint(this, { anchors: "LeftMiddle" },  deepCopy(destination, {uuid:$(this).attr("data-index")+"input"+"destination"}));
                        }else if(nodeClass(drawType) == "classD_C" || nodeClass(type) == "classW_C") {
                            _that.addEndpoint(this, {anchors: "LeftMiddle",maxConnections: -1 }, deepCopy(destination, {uuid: $(this).attr("data-index") + "input" + "destination"}));
                            _that.addEndpoint(this, { anchors: "RightMiddle" ,maxConnections: -1}, deepCopy(origin, {uuid:$(this).attr("data-index")+"output"+"origin"}));
                        }else if(specialNodeClass(drawType) == "classD_D1"){
                            _that.addEndpoint(this, { anchors: [1, 0.3, 0, 0],maxConnections: -1, overlays:[["Label", {location:[1.5, -0.5],label:"yes",cssClass:"endpointSourceLabel"}]]}, deepCopy(origin, {uuid:$(this).attr("data-index")+"yes"+"origin"}));
                            _that.addEndpoint(this, { anchors: [1, 0.7, 0, 0],maxConnections: -1, overlays:[["Label", {location:[1.5, 1.3],label:"no",cssClass:"endpointSourceLabel"}]]}, deepCopy(origin, {uuid:$(this).attr("data-index")+"no"+"origin"}));
                            _that.addEndpoint(this, { anchors: "LeftMiddle" },  deepCopy(destination, {uuid:$(this).attr("data-index")+"input"+"destination"}));
                        }else if(specialNodeClass(drawType) == "classD_D2"){
                            _that.addEndpoint(this, { anchors: [1, 0.3, 0, 0],maxConnections: -1, overlays:[["Label", {location:[1.5, -0.5],label:"ok",cssClass:"endpointSourceLabel"}]]}, deepCopy(origin, {uuid:$(this).attr("data-index")+"ok"+"origin"}));
                            _that.addEndpoint(this, { anchors: [1, 0.7, 0, 0],maxConnections: -1, overlays:[["Label", {location:[1.5, 1.3],label:"error",cssClass:"endpointSourceLabel"}]]}, deepCopy(origin, {uuid:$(this).attr("data-index")+"error"+"origin"}));
                            _that.addEndpoint(this, { anchors: "LeftMiddle" },  deepCopy(destination, {uuid:$(this).attr("data-index")+"input"+"destination"}));
                        }else if(specialNodeClass(drawType) == "classD_E1"){
                            _that.addEndpoint(this, { anchors: "RightMiddle",maxConnections: -1 }, deepCopy(origin, {uuid:$(this).attr("data-index")+"output"+"origin"}));
                            _that.addEndpoint(this, { anchors: [0, 0.3, 0, 0] , overlays:[["Label", {location:[-1, -0.5],label:"left",cssClass:"endpointSourceLabel"}]]},  deepCopy(destination, {uuid:$(this).attr("data-index")+"left"+"destination"}));
                            _that.addEndpoint(this, { anchors: [0, 0.7, 0, 0] , overlays:[["Label", {location:[-1, 1.5],label:"right",cssClass:"endpointSourceLabel"}]]},  deepCopy(destination, {uuid:$(this).attr("data-index")+"right"+"destination"}));
                        }else if(specialNodeClass(drawType) == "classD_E2"){
                            _that.addEndpoint(this, { anchors: "RightMiddle",maxConnections: -1 }, deepCopy(origin, {uuid:$(this).attr("data-index")+"output"+"origin"}));
                            _that.addEndpoint(this, { anchors: [0, 0.3, 0, 0] , overlays:[["Label", {location:[-1, -0.5],label:"input1",cssClass:"endpointSourceLabel"}]]},  deepCopy(destination, {uuid:$(this).attr("data-index")+"input1"+"destination"}));
                            _that.addEndpoint(this, { anchors: [0, 0.7, 0, 0] , overlays:[["Label", {location:[-1, 1.5],label:"input2",cssClass:"endpointSourceLabel"}]]},  deepCopy(destination, {uuid:$(this).attr("data-index")+"input2"+"destination"}));
                        }else {
                            _that.addEndpoint(this, { anchors: "RightMiddle",maxConnections: -1}, deepCopy(origin, {uuid:$(this).attr("data-index")+"output"+"origin"}));
                            _that.addEndpoint(this, { anchors: "LeftMiddle"},  deepCopy(destination, {uuid:$(this).attr("data-index")+"input"+"destination"}));
                        }
                        jsPlumb.jsPlumb.repaintEverything();
                        _that.draggable($(this));
                        $(this).draggable({
                            containment: $("#designMain")
                        });
                    });
                    if($("#designMain").find(".designIconBig").length == 0){
                        _this.designStepLength ="";
                    }else{
                        _this.designStepLength = $("#designMain").find(".designIconBig").length;
                    }
                    //固定连线
                    if (data.links == undefined || data.links == ""){
                    }else {
                        for(var i=0;i<data.links.length;i++){
                            var sourceOutputName = data.links[i].sourceOutput;
                            var targtInputName = data.links[i].input;
                            jsPlumb.jsPlumb.connect({uuids:[data.links[i].source+sourceOutputName+"origin",data.links[i].target+targtInputName+"destination"]})
                        };
                    }
                })
            }
        },
        mounted() {
            var _this = this
            sessionStorage.setItem("type",this.$route.query.type)
            // 资源目录跳转入传值
            // this.flowId = this.$route.params.id ? this.$route.params.id : this.id
            if (this.id) {
                this.flowId = this.id
            }
            this.listTable(this.flowId);
            this.drawGqueryList(this.flowId);
            var _this = this;
            var _that = jsPlumb.jsPlumb;
            /**
             * jsPlumb：点击线段删除
             * ------------------------------------------------------------------
             */
            jsPlumb.jsPlumb.bind("click", function (conn, originalEvent) {
                _this.$confirm('真的要删除当前点击的连接线?', '提示', {
                    type: 'warning'
                }).then(() => {
                    _that.deleteConnection(conn);
                    _this.$message({
                        message: '恭喜你，删除已成功！',
                        type: 'success'
                    });
                }).catch(() => {
                });
            });
            /**
             * jsPlumb：连接对象是自己的管控
             * ------------------------------------------------------------------
             */
            jsPlumb.jsPlumb.bind("connection", function (connInfo, originalEvent) {
                if (connInfo.connection.sourceId == connInfo.connection.targetId) {
                    _this.$message({
                        message: '不能连接自己！',
                        type: 'error'
                    });
                    _that.deleteConnection(connInfo.connection);
                }else {
                }
            });
            /**
             * btnClick：删除当前的节点
             * ------------------------------------------------------------------
             */
            $("#designMain").on("click",".designIconBig #removeDes",function(e){
                var _jqThis = $(this).parent().parent();
                let thisId = _jqThis.attr("data-index");
                _this.$confirm('真的要删除当前design?', '提示', {
                    type: 'warning'
                }).then(() => {
                    _that.removeAllEndpoints(_jqThis.attr("id"));
                    _jqThis.remove();
                    //获取steps
                    _this.getDesignSteps();
                    if($("#designMain").find(".designIconBig").length == 0){
                        _this.designStepLength ="";
                    }else{
                        _this.designStepLength = $("#designMain").find(".designIconBig").length;
                    }
                    for(var i =0; i<_this.flowData.steps.length; i++){
                        if(_this.flowData.steps[i].id == thisId){
                            _this.flowData.steps.splice(i,1);
                        }
                    }
                    //参数声明 引用读取
                    _this.flowSet.quoteDataInput = [];
                    _this.flowSet.quoteDataOutput = [];
                    _this.flowSet.quoteDataParameters = [];
                    _this.flowSet.inputs = false;
                    _this.flowSet.outputs = false;
                    $("#designMain").find(".designIconBig").each(function () {
                        var dataType = $(this).attr("data-type");
                        if(nodeQuote(dataType) === 'quoteA'){
                            _this.flowSet.quoteDataInput.push($(this).find("h4").text())
                            _this.flowSet.inputs = true;
                        }
                        if(nodeQuote(dataType) === 'quoteB'){
                            _this.flowSet.quoteDataOutput.push($(this).find("h4").text())
                            _this.flowSet.outputs = true;
                        }
                        _this.flowSet.quoteDataParameter.push($(this).find("h4").text());
                    })
                    _this.flowSet.quoteDataInput = unique(_this.flowSet.quoteDataInput);
                    _this.flowSet.quoteDataParameter = unique(_this.flowSet.quoteDataParameter);
                    _this.flowSet.quoteDataOutput = unique(_this.flowSet.quoteDataOutput);
                    _this.$message({
                        message: '恭喜你，删除已成功！',
                        type: 'success'
                    });
                }).catch(() => {
                });
                e.stopPropagation();  //阻止事件冒泡
            })
            /**
             * btnClick：复制当前的节点
             * ------------------------------------------------------------------
             */
            $("#designMain").on("click",".designIconBig #copeDes",function(e){
                var thisStepsName = $(this).parent().parent().attr("data-sign")
                $(this).addClass("pitchOn").siblings().removeClass("pitchOn");
                $(document).unbind('keydown').bind('keydown', function(e){
                    if(e.ctrlKey && e.keyCode  == 86) {
                        //触发粘贴函数
                        stepsPaste();
                        // 返回false, 防止重复触发copy事件
                        return false;
                    }
                })
                //Funciton：复制
                function stepsCope(){
                    getSteps()
                    var Steps = JSON.parse(sessionStorage.getItem("steps"))
                    var stepbOk = false
                    for(var i =0; i < _this.flowData.steps.length; i++){
                        if(thisStepsName === _this.flowData.steps[i].name){
                            _this.thisObj = JSON.parse(JSON.stringify(_this.flowData.steps[i]));
                            stepbOk = true
                        }
                    }
                    if(stepbOk == false){
                        for(var j =0; j < Steps.length; j++){
                            if(thisStepsName === Steps[j].name){
                                //_this.thisObj = deepCopy(Steps[j])
                                _this.thisObj = JSON.parse(JSON.stringify(Steps[j]))
                            }
                        }
                    }
                    _this.$message({
                        message: '复制成功，请操作 Ctrl+v 进行粘贴！',
                        type: 'success'
                    });
                }
                //触发复制函数
                stepsCope();
                //Funciton：粘贴
                function stepsPaste(){
                    var randomId = createRandomId();
                    _this.thisObj.id = _this.thisObj.type + "_" + randomId;
                    _this.thisObj.name = _this.thisObj.type + "_" + randomId;
                    _this.thisObj.x = _this.thisObj.x + 50;
                    _this.thisObj.y = _this.thisObj.y + 50;
                    _this.flowData.steps.push(JSON.parse(JSON.stringify(_this.thisObj)));
                    var type = _this.thisObj.type;
                    if(nodeIcon(type) == "iconTrue"){
                        var iconType = type
                    }else {
                        var iconType = "default"
                    }
                    var ele = $('<div class="designIconBig t2Style" data-sign="'+ _this.thisObj.name + '" data-index="'+  _this.thisObj.id + '"  data-type="' + type + '">' +
                        '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-'+iconType+'"></i><h4 title="'+_this.thisObj.name+'">'+_this.thisObj.name+'</h4><h5>ID:'+_this.thisObj.id+'</h5><em id="pitchOnDes" class="fa fa-square-o" title="选中"></em><em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em><em id="removeDes" class="fa fa-trash-o" title="删除"></em>'+'</div>'+ '</div>');
                    if(type == "parallel"){
                        _that.addEndpoint(ele, {anchors: "RightMiddle", maxConnections: -1}, origin);//起点
                        _that.addEndpoint(ele, {anchors: "LeftMiddle", maxConnections: -1}, destination);//终点
                    }else{
                        _that.addEndpoint(ele, {anchors: "RightMiddle",maxConnections: -1}, origin);//起点
                        _that.addEndpoint(ele, {anchors: "LeftMiddle"}, destination);//终点
                    }
                    ele.css({"left": _this.thisObj.x, "top": _this.thisObj.y, position: "absolute", margin: 0});
                    $("#designMain").append(ele);
                    _that.draggable(ele);
                    ele.draggable({
                        containment: "parent"
                    });
                    jsPlumb.jsPlumb.repaintEverything();
                }
                e.stopPropagation();  //阻止事件冒泡
            });
            /**
             * btn-dbClick：节点设置
             * ------------------------------------------------------------------
             */
            $("#designMain").on("dblclick",".designIconBig",function(event){
                _this.changeSteps.changeStepsArr = []
                $('#designMain .designIconBig').removeClass("stepBorder")
                $(document).off('keydown')
                var left = event.currentTarget.offsetLeft;
                var top = event.currentTarget.offsetTop;
                var designType = $(this).attr("data-type");
                var designId = $(this).attr("data-index");
                var designText = $(this).find("h4").text();
                _this.thisStepId = $(this).attr("data-index");
                //双击节点时 把流程数据 赋给 节点设置上的flowData变量
                _this.nodeSet.flowData = _this.flowData;
                _this.nodeSet.dbStatus = "1";                   //节点弹出框状态
                _this.getDesignSteps();
                _this.getDesignLinks();
                var ouputData = [];
                for(var i=0; i<_this.flowData.steps.length;i++){
                    if(_this.flowData.steps[i].id == designId){
                        ouputData=_this.flowData.steps[i].outputConfigurations
                        if(nodeQuote(_this.flowData.steps[i].type) =='quoteB'){
                            this.datasetPath = false
                        }
                        if (nodeQuote(_this.flowData.steps[i].type) =='quoteA') {
                            if (_this.flowData.steps[i].otherConfigurations.datasetId) {
                                var tenantIdTmp = _this.flowData.tenantId
                                getDataset(_this.flowData.steps[i].otherConfigurations.datasetId,tenantIdTmp).then(data => {
                                    _this.nodeSet.datasetType = data.storage
                                }, err => {
                                    this.$message({
                                        message: err.response.message,
                                        type: 'error',
                                        duration: 1500
                                    });
                                })
                            }
                        }
                        //获取当前点击节点schemaId的ID
                        if(_this.flowData.steps[i].otherConfigurations.schemaId){
                            _this.schemaId = _this.flowData.steps[i].otherConfigurations.schemaId
                            sessionStorage.setItem("schemaId",_this.schemaId)
                        }
                        //获取当前点击节点dataset的ID
                        var lookupschemaIdArr = []
                        if(_this.flowData.steps[i].otherConfigurations.ruleSettings && _this.flowData.steps[i].otherConfigurations.ruleSettings.length != 0 &&_this.flowData.steps[i].otherConfigurations.ruleSettings[0].datasetId){
                            _this.datasetIdArr = _this.flowData.steps[i].otherConfigurations.ruleSettings
                            lookupschemaIdArr = _this.datasetIdArr.map(function(i){
                                return i.schemaId
                            })
                            sessionStorage.setItem("datasetIdArr",JSON.stringify(lookupschemaIdArr))
                        } else {
                            sessionStorage.setItem("datasetIdArr",JSON.stringify(lookupschemaIdArr))
                        }
                        //designType为dataflow时获取其输出字段
                        let dataflowId = ''
                        if(specialNodeClass(_this.flowData.steps[i].type) =='classW_A'&&JSON.stringify(_this.flowData.steps[i].otherConfigurations) != '{}' ){
                            dataflowId = _this.flowData.steps[i].otherConfigurations.dataflowId$
                            sessionStorage.setItem("dataflowId",dataflowId);
                        }else {
                            sessionStorage.setItem("dataflowId",'');
                        }
                    }
                }
                if(ouputData == ""){
                    ouputData.push({
                        id:'output',
                        fields:[]
                    })
                }
                //获取当前输出的Name
                _this.nodeSet.nodeSetTab = [];
                _this.nodeSet.inputData = [];
                var thisIndividualTypeLinks =[];
                //获取当前steps的ID
                var thisDesignID = $(this).attr("id");
                var thisEndif = false;
                //根据当前ID 获取当前steps的所有点
                var thisStepsEndpoints = jsPlumb.jsPlumb.getEndpoints(thisDesignID);
                var sessionInputVal = [];
                if(specialNodeClass(designType) == 'classW_A') {
                    //遍历当前steps的点
                    for (var ei = 0; ei < thisStepsEndpoints.length; ei++) {
                        //遍历当前steps的点绑定的线
                        for (var ej = 0; ej < thisStepsEndpoints[ei].connections.length; ej++) {
                            if (thisStepsEndpoints[ei].canvas.width == 12) {
                                _this.nodeSet.nodeSetTab.push({
                                    title: '输入（' + thisStepsEndpoints[ei].connections[ej].source.dataset.sign + '）',
                                    name: 'input',
                                    icon: 'fa fa-sign-in',
                                });
                                var getlinks = JSON.parse(sessionStorage.getItem('links'));
                                var linkLength;
                                for(var i =0 ; i < getlinks.length; i++){
                                    if(getlinks[i].target === designId && getlinks[i].source === thisStepsEndpoints[ei].connections[ej].source.dataset.index){
                                        linkLength = i;
                                    }
                                }
                                if(getlinks[linkLength].target === designId){
                                    for(var s=0; s<_this.flowData.steps.length; s++){
                                        if(_this.flowData.steps[s].id === getlinks[linkLength].source){
                                            for(var o=0; o<_this.flowData.steps[s].outputConfigurations.length; o++){
                                                for(var l =0; l< getlinks.length; l++){
                                                    if(getlinks[l].sourceOutput === _this.flowData.steps[s].outputConfigurations[o].id && getlinks[l].target === designId){
                                                        sessionStorage.setItem("outputConfig",JSON.stringify(_this.flowData.steps[s].outputConfigurations[o]));
                                                        var sessionStorageSteps = JSON.parse(sessionStorage.getItem('outputConfig'));
                                                        sessionStorageSteps.id = "input"
                                                        for (var sj =0; sj <sessionStorageSteps.fields.length; sj++){
                                                            if(sessionStorageSteps.fields[sj].alias == "" || !sessionStorageSteps.fields[sj].alias){
                                                                sessionStorageSteps.fields.splice(sj,1)
                                                            }else{
                                                                sessionStorageSteps.fields[sj].column = thisStepsEndpoints[ei].connections[ej].source.dataset.sign+'.'+sessionStorageSteps.fields[sj].alias;
                                                                sessionStorageSteps.fields[sj].alias = ""
                                                            }
                                                        }
                                                        _this.nodeSet.inputData.push(sessionStorageSteps)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                filterId(_this.nodeSet.inputData)
                            } else {
                            }
                            //获取 当连线连接终点 == steps的ID 时，thisEndif为true，否则为false
                            if (thisStepsEndpoints[ei].connections[ej].targetId == thisDesignID) {
                                thisIndividualTypeLinks.push(thisStepsEndpoints[ei].connections[ej].targetId);
                                thisEndif = true;
                            }
                        }
                    }
                    if(nodeClass(designType) == "classD_E" && thisIndividualTypeLinks.length != 2){
                        thisEndif = false;
                    }
                    //Tab 参数
                    if (noParme(designType) == "classN_P") {
                    } else {
                        _this.nodeSet.nodeSetTab.push({
                            title: '参数',
                            name: 'parameter',
                            icon: 'fa fa-gear',
                        });
                    }
                }else{
                    if(specialNodeClass(designType) == "classW_A"){
                        _this.nodeSet.inputData = []
                        _this.nodeSet.nodeSetTab.push(
                            // {
                            //     title: '输入',
                            //     name: 'input',
                            //     icon: 'fa fa-sign-in',
                            // },
                            {
                                title: '参数',
                                name: 'parameter',
                                icon: 'fa fa-gear',
                            })
                    } else {
                        _this.nodeSet.nodeSetTab.push({
                            title: '参数',
                            name: 'parameter',
                            icon: 'fa fa-gear',
                        })
                    }
                }
                //传值 当前steps的所有line
                _this.nodeSet.nodeLine.inputLine = [];
                _this.nodeSet.nodeLine.outputLine = [];
                for (var iLine = 0; iLine < thisStepsEndpoints.length; iLine++) {
                    for (var jLine = 0; jLine < thisStepsEndpoints[iLine].connections.length; jLine++) {
                        if (thisStepsEndpoints[iLine].canvas.width == 12) {
                            _this.nodeSet.nodeLine.inputLine.push({
                                lineNameSource:thisStepsEndpoints[iLine].connections[jLine].source.dataset.index.replace(/(^\s*)|(\s*$)/g, "")
                            })
                        }else{
                            _this.nodeSet.nodeLine.outputLine.push({
                                lineNameTarget:thisStepsEndpoints[iLine].connections[jLine].target.dataset.index.replace(/(^\s*)|(\s*$)/g, "")
                            })
                        }
                    }
                }
                //判断 连接提示  注:workflow所有step无连接提示
                if(nodeClass(designType) == "classW_C"){
                    _this.nodeSet.nodeSetVisible = true;
                    /*--------------------------------------------------------------------------*/
                    $("#nodeSetDialog .el-dialog__title").text(designType + " 设置");
                    _this.nodeSet.oldName = designText;
                    _this.nodeSet.newName = designText;
                    var flowSteps = _this.flowData.steps;
                    var newFlow = flowSteps.filter(function(flow){
                        return flow.name === designText;
                    });
                    _this.nodeSet.thisNodeData = newFlow;
                    var inpData = [];
                    for(var i=0; i<_this.flowData.steps.length;i++){
                        if(_this.flowData.steps[i].name ==_this.nodeSet.newName){
                            if(specialNodeClass(_this.flowData.steps[i].type) == "classW_A"){
                                inpData=_this.flowData.steps[i].inputConfigurations
                            }else {
                            }
                        }
                        if(_this.flowData.steps[i].inputConfigurations == ""){
                            inpData = [{
                                id:"input",
                                fields:[]
                            }]
                        }
                    }
                    var setNameTrue = false;
                    //根据对象的id直接从对象数组中获取该对象
                    if(nodeClass(designType) == "classD_A"){
                        for(var i =0; i < flowSteps.length; i++){
                            if(designText == flowSteps[i].name){
                                _this.nodeSet.thisNodeData = flowSteps[i];
                                setNameTrue = true;
                                var b = Object.keys(flowSteps[i].otherConfigurations)
                            }
                        }
                    }else{
                        for(var i =0; i < flowSteps.length; i++){
                            if(designText == flowSteps[i].name){
                                _this.nodeSet.thisNodeData = flowSteps[i];
                                _this.nodeSet.thisNodeData.inputConfigurations = inpData
                                setNameTrue = true;
                                var b = Object.keys(flowSteps[i].otherConfigurations)
                            }
                        }
                    }
                    //判断接口内没有该step，根据false并添加一个新的step
                    if(setNameTrue == false || b.length == 0){
                        var pData = JSON.parse(sessionStorage.getItem('nodeStep'));
                        for(var i = 0; i <pData.length; i++){
                            if(pData[i].type == designType){
                                _this.nodeSet.thisNodeData = {
                                    id:designId,
                                    name:designText,
                                    type:designType,
                                    inputConfigurations:transformArr(inpData),
                                    outputConfigurations:ouputData,
                                    otherConfigurations:pData[i].otherConfigurations,
                                    x:left,
                                    y:top
                                }
                            }
                        }
                    }
                }else{
                    _this.nodeSet.thisNodeData = {
                        id:designId,
                        name:designText,
                        type:designType,
                        inputConfigurations:[{
                            id:'input',
                            fields:[]
                        }],
                        outputConfigurations:[],
                        otherConfigurations:{},
                        x:left,
                        y:top
                    }
                    _this.nodeSet.nodeSetVisible = false;
                    _this.$message({
                        message: '请建立正确的连接！',
                        type: 'error'
                    });
                }
            })
                //多选steps
            $("#designMain").on("click",".designIconBig #pitchOnDes",function(e){
                var thisStepsName = $(this).parent().parent().attr("data-sign")
                var thisStepsId = $(this).parent().parent().attr("data-index")
                //console.log($(this).parent())
                 var str = $(this).parent().parent().attr("class").toString()
                if(str.match(/\bredStyle\b/gi) == 'redStyle'){
                    $(this).parent().parent().removeClass("redStyle")
                    changeRemoveSteps(thisStepsName, thisStepsId)
                    $(this).removeClass("fa-square").css('color','#b9c0d')
                }else {
                    $(this).parent().parent().addClass("redStyle")
                    $(this).addClass("fa-square").css('color','red')
                    changeSteps(thisStepsName,thisStepsId)
                }  
                //选中多个steps 提取选中的steps的json格式
                function changeSteps(thisStepsName,thisStepsId){
                     _this.getDesignSteps()              //获取画布steps
                     _this.getDesignLinks()              //获取画布连线
                    var getlinks = JSON.parse(sessionStorage.getItem('links'));
                    var Steps = JSON.parse(sessionStorage.getItem("steps"))
                    for(var i =0; i < _this.flowData.steps.length; i++){
                        if(thisStepsName === _this.flowData.steps[i].name){
                            _this.changeSteps.changeStepsArr.push(JSON.parse(JSON.stringify(_this.flowData.steps[i])));
                            
                        }
                    }
                    for(var j = 0; j<getlinks.length;j++){
                        if(thisStepsId === getlinks[j].target){
                            _this.changeSteps.changeLinksArr.push(JSON.parse(JSON.stringify(getlinks[j])));
                        }
                    }
                }
                //取消选中的steps 
                function changeRemoveSteps(thisStepsName, thisStepsId){
                    for(var j=0; j<_this.changeSteps.changeStepsArr.length; j++){
                        if(thisStepsName === _this.changeSteps.changeStepsArr[j].name){
                             _this.changeSteps.changeStepsArr.splice(j,1)
                             j--
                        }
                    }
                    for(var k = 0; k< _this.changeSteps.changeLinksArr.length;k++){
                        if(thisStepsId === _this.changeSteps.changeLinksArr[k].target){
                            _this.changeSteps.changeLinksArr.splice(k,1)
                            k--
                        }
                    }
                }
                e.stopPropagation();  //阻止事件冒泡
            })
            let comp = flowNodeTypeComp(); //节点组件
            _this.flowNodeTypes = comp[_this.flowType];
        },
        updated(){
            this.design();
            this.routeTrue = $("#designMain").find(".designIconBig").length > this.nodeLength;
        },
        destroyed:function(){
            jsPlumb.jsPlumb.deleteEveryEndpoint($("#designMain"))
            $(document).off('keydown') //解绑键盘复制事件
        }
    }
</script>

<style scoped lang="scss">
    .con-module{
        margin:0px;
    .child-content {
        padding: 0px;
        height:-webkit-calc(100% - 40px);
        height:-moz-calc(100% - 40px);
        height:calc(100% - 40px);
    .drawSelHis {
        float: left;
        margin: 1px 0px 0px 0px;
    .drawHisBut {
        font-size: 12px;
        height: 0px;
        line-height: 0px;
    }
    }
    i {
        font-size: 13px;
    }
    .desLeft{
        float: left;
        padding: 5px 0px 0px 120px;
    }
    .flowNameInput {
        float: left;
        margin-right: 10px;
        width: 230px;
    }
    .drawingCanvas{
        position: relative;
        z-index: 100;
        float: left;
        margin: 0px;
        width: 100%;
    }
    }
    }
    .drawingCanvas {
        height:100%;
        min-height: 500px;
    }
    #designMain{
        background: url("../../../../assets/design/designBg.png");
    }
    .btn-right .submiterror {
        border: 0;
        border-radius: 0;
        background-clip: padding-box;
        font-size: 14px;
        outline: none;
        padding: 3px 0!important;
        white-space: normal;
        border-left: 1px solid #999999;
        border-right: 1px solid #999999;
        transition: all .2s ease;
        width: 60px;
        color: #999999;
        background-color: #ffffff !important;
        border-color: #c8c9cc;
    }
</style>