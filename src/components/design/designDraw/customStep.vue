<!--  design 设置 参数声明 组件  -->
<template>
    <div>
        <el-dialog v-dialog-drag title="自定义组合节点" id="designSetDialog" :close-on-click-modal="false" :visible.sync="customDataSet.flowSetVisible"  @click="designSetNone" :modal-append-to-body="false">
            <el-form class="elForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" >
                <el-form-item label="节点名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitForm('ruleForm')" type="primary">确定</el-button>
                <el-button @click="designSetNone">取消</el-button>
            </div>
    </el-dialog>

    </div>
</template>

<script>
    import _ from "lodash";
    import customPackage from "@customPackage/customPackage.vue";
    import {deepCopy,transformArr,RandomUuid, createRandomTime} from "@function/comFunction";
    import { savestep} from "@api" //接口

    
    export default {
        components: {customPackage},
        data() {
            return {
                stepsData: [],
                multipleSelection: [],
                ruleForm:{
                     name: ''
                },
                 rules: {
                    name:  [{
                                required: true,
                                // pattern: /^[a-zA-Z]+$/,//可以写正则表达式呦呦呦
                                message: '请输入名称',
                                trigger: 'blur'
                            }],
                 },
                 changeStepsData:{},
                 stepsJson :{
                    "id": "custom", 
                    "tags": [
                        "custom", 
                        "dataflow"
                    ], 
                    "type": "custom", 
                    "name":"custom",
                    "inputConfigurations": [
                        {
                            "id": "", 
                            "fields": []
                        }
                    ], 
                    "outputConfigurations": [
                        {
                            "id": "", 
                            "fields": []
                        }
                    ], 
                    "otherConfigurations": {
                        "expressions": [],
                        "interceptor":"",
                        "sessionCache":""
                    }
                },
                definestep:{}
            }
        },
        props:["customDataSet","changeSteps"],
        watch: {
            customDataSet:{                                // 监听父级传的来的整体的data
              handler:function(newValue){
                  var _this = this;
                  var val = JSON.parse(JSON.stringify(newValue))      //深度拷贝一份传过来的值
                  this.stepsData = val.flowData.steps
                  if(val.flowSetVisible == true){
                        
                 }

              },
              deep:true
            },
            changeSteps:{
                handler: function(newValue){
                    var _this = this;
                    this.changeStepsData = JSON.parse(JSON.stringify(newValue))
                },
                deep: true
            }
        },
        methods: {
             findNode(data,val){
                return _.find(data,(item)=>{
                    return item.id==val;
                });
            },
            getLinks(checkNode,links){
                let result=[];
                _.forEach(checkNode,(item,index) => {
                    _.forEach(links,(subItem,subIndex)=>{
                        if(item.id==subItem.source&&this.findNode(checkNode,subItem.target)){
                            result.push(subItem);
                        }

                        if(item.id==subItem.target&&this.findNode(checkNode,subItem.source)){
                            result.push(subItem);
                        }
                    });
                    
                });

                return _.uniq(result);

            },
            designSetNone(){                  // 点击取消/关闭按钮
                this.customDataSet.flowSetVisible = false;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.changeStepsData.flowtype = sessionStorage.getItem('type')
                        this.changeStepsData.type = 'define'
                        this.changeStepsData.name = this.ruleForm.name
                        this.changeStepsData.id = ''
                        this.changeStepsData.regardinput = {}
                        this.changeStepsData.regardoutput = {}
                        this.checkSteps()
                        this.changeStepsData.changeLinksArr=this.getLinks(this.changeStepsData.changeStepsArr,this.customDataSet.flowData.links);
                        let changeStepsData={...this.changeStepsData,
                            changeLinksArr:_.map(this.changeSteps.changeLinksArr,item=>{
                                return {
                                    ...item,
                                    source:item.source+"_"+this.changeStepsData.type,
                                    target:item.target+"_"+this.changeStepsData.type
                                }
                            }),
                            changeStepsArr:_.map(this.changeSteps.changeStepsArr,item=>{
                                return {
                                    ...item,
                                    id:item.id+"_"+this.changeStepsData.type
                                }
                            })
                        };
                        this.definestep = {//自定义节点后台需要的数据
                                "id": "",
                                "groupCount": 0,
                                "groupFieldValue": "",
                                "name": this.ruleForm.name,
                                "creator": this.customDataSet.flowData.creator,
                                "createTime": createRandomTime(),
                                "lastModifier": this.customDataSet.flowData.lastModifier,
                                "lastModifiedTime": "",
                                "owner": this.customDataSet.flowData.owner,
                                "version": 0,
                                "moduleVersion": 0,
                                "enabled": 0,
                                "description": "",
                                "tenant": this.customDataSet.flowData.tenant,
                                "flowType": this.changeStepsData.flowtype,
                                "stepInfo": changeStepsData,
                                "expiredPeriod": 0
                        }
                        savestep(this.definestep).then( data =>{
                            var _this = this
                            if(data.list[0].code == 200){
                                this.customDataSet.flowSetVisible = false;
                                this.$emit('customStatus','false')
                                this.ruleForm.name = ''  
                            } else {
                                _this.$message({
                                        message: data.list[0].message,
                                        type: 'error'
                                    });
                            } 
                        })
                    }
                    
                });
            },
            checkSteps(){
                var _this = this
                let stepsArr = []         //保存节点的id
                let stepsInput = []       //保存流程输入的节点
                let stepsOutput = []      //保存流程输出的节点
                let linkSourceArr = []    //保存线的 source  
                let linkTargetArr = []    //保存线的 target
                // 提取流程节点的ID
                for(var m =0; m<_this.changeStepsData.changeStepsArr.length; m++){
                    stepsArr.push(_this.changeStepsData.changeStepsArr[m].id)
                }
                //过滤多余的线 （线里有targe节点，但是没有source节点）
                for(var k = 0; k<_this.changeStepsData.changeLinksArr.length;k++){
                    if(stepsArr.indexOf(_this.changeStepsData.changeLinksArr[k].source) < 0){
                        _this.changeStepsData.changeLinksArr.splice( k,1)
                    }
                }
            
                // 提取流程的输入
                for(var h = 0; h<_this.changeStepsData.changeLinksArr.length; h++){
                    linkSourceArr.push(_this.changeStepsData.changeLinksArr[h].source)
                    linkTargetArr.push(_this.changeStepsData.changeLinksArr[h].target)
                    if(stepsArr.indexOf(_this.changeStepsData.changeLinksArr[h].source)=='-1'){
                        stepsInput.push(_this.changeStepsData.changeLinksArr[h].target)
                    }
                }
                // 提取流程的输出节点
                for(var n=0; n<_this.changeStepsData.changeStepsArr.length; n++){
                    if(linkSourceArr.indexOf(_this.changeStepsData.changeStepsArr[n].id)=='-1'){
                        stepsOutput.push(_this.changeStepsData.changeStepsArr[n].id)
                    }
                    if(linkTargetArr.indexOf(_this.changeStepsData.changeStepsArr[n].id)=='-1'){
                        stepsInput.push(_this.changeStepsData.changeStepsArr[n].id)
                    }
                }
                // 过滤流程输入点不为source
                if(stepsInput.length!=0){
                            stepsInput = (Array.from(new Set(stepsInput)))
                            stepsInput = stepsInput.filter(_this.checkInput)
                }
                // 过滤流程输出点不为sink
                if(stepsOutput.length!=0){
                    stepsOutput = Array.from(new Set(stepsOutput))
                    stepsOutput = stepsOutput.filter(_this.checkOutput)
                } 
                _this.changeStepsData.stepsInput = stepsInput
                _this.changeStepsData.stepsOutput = stepsOutput
                _this.changeStepsData.stepsArr = stepsArr
            },
            //过滤输入没有source,输出没有sink
            checkInput(val){
                return val.indexOf('source') < 0
            },
            checkOutput(val){
                return val.indexOf('sink') < 0
            }
        }
           
    }
</script>

<style scoped lang="scss">
    .tableTitle,.setUi,.parameterTableTitle{
        float: left;
        width: 100%;
        padding:0px;
    }
    .setUi .divUl{
        float: left;
        width: 100%;
        margin:10px 0px 0px 0px;
    }
    .setUi .divUl .divLi{
        float: left;
        position: relative;
        width: 28%;
        margin-right: 7%;
    }
    .setUi .divUl .parameterLi{
        float: left;
        position: relative;
        width: 20%;
        margin-right: 5%;
    }
    .nameLi{
        float: left;
        position: relative;
        width: 28%;
        margin-right: 1%;
    }
    .tableTitle li{
        float: left;
        position: relative;
        width: 28%;
        margin-right: 5%;
        text-align: center;
        color: #333333;
        font-weight: bold;
    }
    .parLi{
        float: left;
        position: relative;
        width: 23%;
        margin-right: 1%;
    }
    .parameterTableTitle li{
        float: left;
        position: relative;
        width: 22%;
        margin-right: 3%;
        text-align: center;
        color: #333333;
        font-weight: bold;
    }
    .quote{
        width: 100%;
        position: relative;
    }
    .quote .quotePos{
        float: left;
        width: 100%;
        position: relative;
    }
    .quoteBtn{
        position: absolute;
        top: 10px;
        right: -40px;
    }
    .quoteBtn .i{
        position: static;
        float: left;
        margin-left: 5px;
        font-size: 15px;
    }
    .divLi i{
        position: absolute;
        top: 10px;
        right: -20px;
        color: #ff4e4e;
        font-weight: bold;
        cursor: pointer;
    }
    .addQuote{
        position: absolute;
        right: 0px;
        bottom: 34px;
    }
    .addQuote i{
        color: #3e98fe;
        font-size: 15px;
    }
    .addUl{
        float: left;
        width: 100%;
        margin: 10px 0px 0px 0px;
        color: #3d464d;
        font-size: 18px;
    }
    .addUl i{
        cursor: pointer;
    }
    .addUl i:hover{
        color: #0070e0;
    }
    .removeUl i{
        position: absolute;
        top: 10px;
        right: -20px;
        color: #ff4e4e;
        font-weight: bold;
        cursor: pointer;
    }
    .addQuote2{
        position: absolute;
        right: -20px;
        bottom: 8px;
    }
    .addQuote2 i{
        color: #3e98fe;
        font-size: 15px;
    }
    h3{
        font-size: 14px;
        color: #000000;
    }
    .status-class {
        font-size: 12px;
        font-style: normal;
        color: red;
    }

    .dependencies h3{
        height: 30px;
        line-height: 30px;
    }
    .dependencies .dedivClass{
        margin: 10px 0px 0px 0px;
    }
    .dependencies .el-input-group{
        width: calc(100% - 30px);

    }

    .dependencies .dedivClass .remove{
        float: right;
        margin: 5px 0px 0px 0px;
    }
</style>