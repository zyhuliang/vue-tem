<!--  design 提交 执行计划设置 组件  -->
<template>
    <el-dialog  :close-on-click-modal="false"  v-dialog-drag title="执行计划设置" id="designSubmitDialog" class="designDialog" v-if="flowSubData.flowSubmitVisible" :visible.sync="flowSubData.flowSubmitVisible" :modal-append-to-body="false" custom-class="dialog2Class">
        <el-form ref="form" :model="form" id="bm-designSubmit-form" label-width="125px" class="elForm" :label-position="labelPosition">
            <div class="elForm-box">
                <el-form-item label="名称">
                    <el-input v-model="form.designSubName" name="designSubName"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <div class="designSubBegin">
                        <el-date-picker
                                type="date"
                                format="yyyy/MM/dd HH:mm:ss"
                                v-model="form.beginTime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="当前历史版本">
                    <el-input v-model="flowSubData.flowHisVersion" :disabled="true" name="flowHisVersion"></el-input>
                </el-form-item>
                <!--flow设置->参数声明的变量-->
                <el-form-item :label="par.name" :key="key" v-for="(par,key,index) in form.arguments">
                    <el-tooltip class="item" effect="dark" :content="par.description" placement="top">
                        <i class="parIcon el-icon-warning"></i>
                    </el-tooltip>
                    <el-input v-model="par.defaultVal" name="defaultVal"></el-input>
                </el-form-item>
                <!--依赖jar包-->
                <el-form-item label="dependencies" v-if="form.dependencies.length > 0">
                    <el-tooltip class="item" effect="dark" content="依赖配置" placement="top">
                        <i class="parIcon el-icon-warning"></i>
                    </el-tooltip>
                    <el-input v-model="de.name" :key="key" v-for="(de,key,index) in form.dependencies" placeholder="请选择内容" name="de.name" :disabled="true">
                        <!-- <el-button slot="append" @click="depSel(key)" icon="icon iconfont icon-ir-search" name="depSel"></el-button> -->
                    </el-input>
                </el-form-item>
                <!--高级选项-->
                <implement :flowId="form.id" ref="implement"></implement>
            </div>
        </el-form>
        <!-- 依赖配置 查询 -->
        <div class="nodeDialog"  v-if="dialogLocalJarVisible == true" >
            <div class="diHeader">
                <h3>自定义包 查询</h3>
                <span @click="dialogLocalJarVisible = false" class="el-icon-close"></span>
            </div>
            <div class="diContent">
                <el-form class="elForm" ref="form" label-width="80px" id="bm-designSubmit-diContent-form">
                    <custom-package @thisSelectLocalJarVal="getSelectDataVal"></custom-package>
                </el-form>
            </div>
            <div slot="footer" class="diFooter">
                <el-button type="primary" @click="dialogLocalJarVisible = false" name="diFooter-sure">确定</el-button>
                <el-button @click="dialogLocalJarVisible = false" name="diFooter-cancel">取消</el-button>
            </div>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="desSubSubmit" type="primary" name="footer-sure">确定</el-button>
            <el-button @click="flowSubData.flowSubmitVisible = false" name="footer-cancel">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import customPackage from "@customPackage/customPackage.vue" //自定义查询组件
    import {runtimeProperties,createSchedule} from "@api"
    import {deepCopy,transformArr} from "@function/comFunction";
    import implement from '@components/implement/implement'

    export default {
        components: {customPackage,implement},
        data() {
            return {
                form: {
                    id:'',                //flow ID
                    type:'',              //flow类型
                    name:'',              //流程名称
                    designSubName:'',    //提交名称
                    designFlowData:'',   //整个flow的数据
                    beginTime:'',         //flow的创建时间
                    arguments:[],         //flow的参数
                    dependencies:[],      //高级选项下拉的数组
                    advancedData:[],      //高级选项数据来源
                    deployModeValue:'',  //dataflow deployModeValue 字段
                    deployModes: [],      // dataflow deployModeValue 下拉框数据
                    deployMode: 0,        // dataflow deployModeValue 字段 索引
                    clusterIdValue:'',    //all clusterIdValue 字段
                    clusterIds: [],       // all clusterIdValue  下拉框数据
                    clusterId: 0,         // all clusterIdValue 字段 索引
                    queueValue:'',       // dataflow queue 字段
                    queue: 0,             // dataflow queue 字段 索引
                    queues: [],           // dataflow queue 下拉框数据
                    localJar:[]          // dependencies
                },
                jarArr:[{}],                     //自定义包数据
                jarArrIndex:0,                  //当前操作的jar包索引
                dialogLocalJarVisible:false, //自定义查询开关
                labelPosition: 'left',        //表单域标签的位置
            }
        },
        props:["flowSubData"],                // designDrawing页面传过来的数据
        watch: {
            flowSubData:{
              handler(newValue,oldValue){
                  if(newValue.flowSubmitVisible == true){
                      this.form.id = this.flowSubData.flowId;
                      this.form.name = this.flowSubData.flowName;
                      this.form.type = this.flowSubData.flowType;

                      this.form.arguments = deepCopy(this.flowSubData.flowData.parameters);
                      // 深拷贝，以免在提交中重新选值影响到设置中的值
                      this.form.dependencies = transformArr(deepCopy(this.flowSubData.flowData.dependencies));
                    //   this.runTimeProperties();
                      this.form.designSubName = this.flowSubData.dSubName;
                      this.form.beginTime = this.flowSubData.dSubTime;
                      this.form.designFlowData = this.flowSubData.flowData;
                  }
              },
              deep:true
            },
        },
        methods: {
            // 确认 计划执行情况设置接口
            desSubSubmit : function () {
                var desSubAgData = []
                for(var i in this.form.arguments){
                    var cc = {};
                    cc.category = this.form.arguments[i].category;
                    cc.value = this.form.arguments[i].defaultVal;
                    cc.description = this.form.arguments[i].description;
                    cc.name = this.form.arguments[i].name;
                    cc.refs = this.form.arguments[i].refs;
                    desSubAgData.push(cc);
                }
                var depenVal = [];
                for(var d=0; d < transformArr(this.form.dependencies).length; d++){
                    depenVal.push(this.form.dependencies[d].name)
                }
                if(depenVal == undefined){
                    depenVal = [];
                }
                if(desSubAgData == undefined){
                    desSubAgData = [];
                }
                var parameter = {
                    configurations:{
                        arguments:desSubAgData,
                        properties:this.$refs.implement.getRuntimeProperties(),
                        dependencies:depenVal.toString(),
                        extraConfigurations:{},
                        startTime:Date.parse(this.form.beginTime),
                    },
                    flowId:this.form.id,
                    flowName:this.form.name,
                    flowType:this.form.type,
                    flowVersion:this.flowVersion,
                    name:this.form.designSubName,
                    schedulerId:"once",
                    source:'rhinos'
                }
                createSchedule(parameter).then(data => {
                    this.flowSubData.flowSubmitVisible = false;
                    this.$message({
                        message: '提交成功！',
                        type: 'success'
                    });
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }).catch(() => {

                });
            },
            // 特殊处理高级选项所有下拉框字段 dataflow中的queue和deploy-mode
            runTimeProperties : function () {
                //运行flow交互的数据
                runtimeProperties(this.form.id).then(data => {
                    this.form.advancedData = data;
                    for (var i = 0; i < data.length; i++){
                        if(data[i].name == "dataflow.queue"){
                            this.queue = i
                            this.queues = [];
                            for(var j = 0; j < data[i].value.length; j++){
                                this.queues[j] = {value: data[i].value[j]}
                            }
                            this.selectGetQueue(this.queues[0].value)

                        }
                        if(data[i].name == "streamflow.queue"){
                            this.queue = i
                            this.queues = [];
                            for(var j = 0; j < data[i].value.length; j++){
                                this.queues[j] = {value: data[i].value[j]}
                            }
                            this.selectGetQueue(this.queues[0].value)

                        }
                        if(data[i].name == "streamflow.deploy-mode"){
                            this.deployMode = i
                            this.deployModes = [];
                            for(var j = 0; j < data[i].value.length; j++){
                                this.deployModes[j] = {value: data[i].value[j]}
                            }
                            this.selectGetDeployModeValue(this.deployModes[0].value)
                        }
                        if(data[i].name == "dataflow.deploy-mode"){
                            this.deployMode = i
                            this.deployModes = [];
                            for(var j = 0; j < data[i].value.length; j++){
                                this.deployModes[j] = {value: data[i].value[j]}
                            }
                            this.selectGetDeployModeValue(this.deployModes[0].value)
                        }
                        if(data[i].name == "dataflow.runtime.cluster-id"){
                            this.clusterId = i
                            this.clusterIds = [];
                            for(var j = 0; j < data[i].value.length; j++){
                                this.clusterIds[j] = {value: data[i].value[j]}
                            }
                            this.selectGetClusterIdValue(this.clusterIds[0].value)
                        }
                    }
                }, err => {
                        this.$message({
                            message: err.response.err,
                            type: 'error',
                            duration: 1500
                        });
                    }
                ).catch(() => {});
            },
            //获取提交设置dataflow queue字段返回的数据
            selectGetQueue: function (val) {
                this.form.queueValue = val
                this.form.advancedData[this.queue].value = val
            },
            // 获取提交设置dataflow deployModeValue字段返回的数据
            selectGetDeployModeValue: function (val) {
                this.form.deployModeValue = val
                this.form.advancedData[this.deployMode].value = val
            },
            // 获取提交设置all runtime.cluster-id字段返回的数据
            selectGetClusterIdValue: function (val) {
                this.form.clusterIdValue = val
                this.form.advancedData[this.clusterId].value = val
            },
            // 自定义包选择
            getSelectDataVal:function (data) {
                this.jarArr[this.jarArrIndex] = data[0]
                this.form.dependencies[this.jarArrIndex].name = data[0].jarName
            },
            //dependencies选择框触发的事件，重新选择值
            depSel:function (index) {
                this.dialogLocalJarVisible = true;
                this.jarArrIndex = index
            }
        },
        mounted() {

        }
    }
</script>
<style scoped lang="scss">
    .nodeDialog{
        h3{
            margin: 0px;
            font-size: 16px;
            height: 50px;
            line-height: 50px;
            text-decoration: none;
        }
    }
    h3{
        margin: 0px;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        text-decoration: underline;
    }
    .parIcon{
        position: absolute;
        left: -20px;
        top: 14px;
    }
</style>
