<!--  design 设置 参数声明 组件  -->
<template>
    <div>
        <el-dialog v-dialog-drag title="参数声明" id="designSetDialog" :close-on-click-modal="false" :visible.sync="flowSetData.flowSetVisible"  @click="designSetNone" :modal-append-to-body="false">
        <el-form class="elForm" ref="form" label-width="80px" :label-position="labelPosition">
            <el-tabs v-model="designSetTab" type="card" >
                <el-tab-pane v-for="(ns, index) in statementTab" :key="ns.key" :name="ns.name" :disabled="ns.close">
                    <span slot="label"><i :class="ns.icon"></i>{{ns.title}}</span>
                    <!-- 输入 -->
                    <div v-if="ns.name == 'input'">
                        <el-row>
                            <ul class="tableTitle">
                                <li class="nameLi">名称</li>
                                <li>引用</li>
                                <li>描述</li>
                            </ul>
                            <div class="setUi">
                                <div class="divUl" v-for="(ul, index) in statementTab[0].inputs" :key="index">
                                    <div class="nameLi">
                                        <el-input placeholder="名称（必填项）" v-model="ul.name"></el-input>
                                    </div>
                                    <div class="divLi">
                                        <div class="quote">
                                            <div class="quotePos" v-for="(qli, number) in ul.refs" :key="number">
                                                <el-select v-model="ul.refs[number]" placeholder="选择引用（必填项）" >
                                                    <el-option
                                                            v-for="(qs,index) in quote.inputs[index]"
                                                            :key="index"
                                                            :label="qs"
                                                            :value="qs">
                                                    </el-option>
                                                </el-select>
                                                <div class="quoteBtn" v-if="ul.refs.length > '1'">
                                                    <i @click="removeQuoteInputs(index,number)" class="i remove el-icon-remove-outline"></i>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="addQuote">
                                            <i @click="addQuoteInputs(index)" class="i el-icon-circle-plus-outline"></i>
                                        </div>
                                    </div>
                                    <div class="divLi">
                                        <el-input placeholder="描述" v-model="ul.description"></el-input>
                                        <i @click="removeUlInputs(index)" class="i remove el-icon-remove-outline"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="addUl">
                                <i @click="addUlInputs" class="el-icon-circle-plus"></i>
                            </div>
                        </el-row>
                        <br>
                        <el-row>
                            <el-col :span="24">提示：名称允许的字符包括字母,数字和下划线.</el-col>
                        </el-row>
                    </div>
                    <!-- 参数 -->
                    <div v-if="ns.name == 'parameter'">
                        <!-- 自定义变量 -->
                        <el-row v-if="thisParVar.length > '0'">
                            <h3>自定义变量</h3>
                            <ul class="parameterTableTitle">
                                <li class="parLi">名称<i class="status-class" v-if="bSk5">(名称不能为空)</i><i class="status-class" v-if="customName">(名称不能重复)</i></li>
                                <li>引用<i class="status-class" v-if="bSk8">(引用不能为空)</i></li>
                                <li>默认值<i class="status-class" v-if="bSk6">(默认值不能为空)</i></li>
                                <li>描述</li>
                            </ul>
                            <div class="setUi">
                                <div class="divUl" v-for="(ul, index) in varParameters" :key="index">
                                    <div class="parLi">
                                        <el-input placeholder="名称（必填项）" v-model="ul.name"></el-input>
                                    </div>
                                    <div class="parameterLi">
                                        <div class="quote">
                                            <div class="quotePos" v-for="(qli, number) in ul.refs" :key="number">
                                                <el-select v-model="ul.refs[number]" placeholder="选择引用（必填项）" @change="(value) => vselQuoteParameters(value,index)">
                                                    <el-option
                                                            v-for="(qs,index) in thisParVar"
                                                            :key="index"
                                                            :label="qs.name"
                                                            :value="qs.name">
                                                    </el-option>
                                                </el-select>
                                                <div class="quoteBtn" v-if="ul.refs.length > '1'">
                                                    <i @click="vremoveQuoteParameters(index,number)" class="i remove el-icon-remove-outline"></i>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="addQuote2">
                                            <i @click="vaddQuoteParameters(index)" class="i el-icon-circle-plus-outline"></i>
                                        </div>
                                    </div>
                                    <div class="parLi">
                                        <el-input placeholder="默认值（必填项）" v-model="ul.defaultVal"></el-input>
                                    </div>
                                    <div class="parLi removeUl">
                                        <el-input placeholder="描述" v-model="ul.description"></el-input>
                                        <i @click="vremoveUlParameters(index)" class="i remove el-icon-remove-outline"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="addUl">
                                <i @click="vaddUlParameters" class="el-icon-circle-plus"></i>
                            </div>
                        </el-row>
                        <!-- 参数变量 -->
                        <el-row>
                            <h3>参数变量</h3>
                            <ul class="parameterTableTitle">
                                <li class="parLi">名称<i class="status-class" v-if="bSk1">(名称不能为空)</i><i class="status-class" v-if="repeatName">(名称不能重复)</i></li>
                                <li>引用<i class="status-class" v-if="bSk4">(引用不能为空)</i></li>
                                <li>默认值<i class="status-class" v-if="bSk2">(默认值不能为空)</i></li>
                                <li>描述</li>
                            </ul>
                            <div class="setUi">
                                <div class="divUl" v-for="(ul, index) in refParameters" :key="index">
                                    <div class="parLi">
                                        <el-input placeholder="名称（必填项）" v-model="ul.name"></el-input>
                                    </div>
                                    <div class="parameterLi">
                                        <div class="quote">
                                            <div class="quotePos" v-for="(qli, number) in ul.refs" :key="number">
                                                <el-select v-model="ul.refs[number]" placeholder="选择引用（必填项）" @change="(value) => selQuoteParameters(value,index)">
                                                    <el-option
                                                            v-for="(qs,index) in allStepParameters"
                                                            :key="index"
                                                            :label="qs"
                                                            :value="qs">
                                                    </el-option>
                                                </el-select>
                                                <div class="quoteBtn" v-if="ul.refs.length > '1'">
                                                    <i @click="removeQuoteParameters(index,number)" class="i remove el-icon-remove-outline"></i>
                                                </div>
                                            </div>


                                        </div>
                                        <div class="addQuote2">
                                            <i @click="addQuoteParameters(index)" class="i el-icon-circle-plus-outline"></i>
                                        </div>
                                    </div>
                                    <div class="parLi">
                                        <el-input placeholder="默认值（必填项）" v-model="ul.defaultVal"></el-input>
                                    </div>
                                    <div class="parLi removeUl">
                                        <el-input placeholder="描述" v-model="ul.description"></el-input>
                                        <i @click="removeUlParameters(index)" class="i remove el-icon-remove-outline"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="addUl">
                                <i @click="addUlParameters" class="el-icon-circle-plus"></i>
                            </div>
                        </el-row>
                        <br>
                        <el-row>
                            <el-col :span="24">提示：名称允许的字符包括字母,数字和下划线.</el-col>
                        </el-row>
                    </div>
                    <!-- 输出 -->
                    <div v-if="ns.name == 'output'">
                        <el-row>
                            <ul class="tableTitle">
                                <li class="nameLi">名称</li>
                                <li>引用</li>
                                <li>描述</li>
                            </ul>
                            <div class="setUi">
                                <div class="divUl" v-for="(ul, index) in statementTab[2].outputs" :key="index">
                                    <div class="nameLi">
                                        <el-input placeholder="名称（必填项）" v-model="ul.name"></el-input>
                                    </div>
                                    <div class="divLi">
                                        <div class="quote">
                                            <div class="quotePos" v-for="(qli, number) in ul.refs" :key="number">
                                                <el-select v-model="ul.refs[number]" placeholder="选择引用（必填项）">
                                                    <el-option
                                                            v-for="(qs,index) in quote.outputs[index]"
                                                            :key="index"
                                                            :label="qs"
                                                            :value="qs">
                                                    </el-option>
                                                </el-select>
                                                <div class="quoteBtn" v-if="ul.refs.length > '1'">
                                                    <i @click="removeQuoteOutputs(index,number)" class="i remove el-icon-remove-outline"></i>
                                                </div>
                                            </div>


                                        </div>
                                        <div class="addQuote">
                                            <i @click="addQuoteOutputs(index)" class="i el-icon-circle-plus-outline"></i>
                                        </div>
                                    </div>
                                    <div class="divLi">
                                        <el-input placeholder="描述" v-model="ul.description"></el-input>
                                        <i @click="removeUlOutputs(index)" class="i remove el-icon-remove-outline"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="addUl">
                                <i @click="addUlOutputs" class="el-icon-circle-plus"></i>
                            </div>
                        </el-row>
                        <br>
                        <el-row>
                            <el-col :span="24">提示：名称允许的字符包括字母,数字和下划线.</el-col>
                        </el-row>
                    </div>
                    <div v-if="ns.name == 'dependencies'">
                        <el-row class="dependencies">
                            <h3>dependencies</h3>
                            <div class="divUl dedivClass" v-for="(de, index) in statementTab[3].dependencies" :key="index">
                                <el-input v-model="de.name" placeholder="请选择内容">
                                    <el-button slot="append" @click="depSel(index)" icon="icon iconfont icon-ir-search"></el-button>
                                </el-input>
                                <div class="remove">
                                    <i @click="removeDependencies(index)" class="i remove el-icon-remove-outline"></i>
                                </div>
                            </div>
                            <div class="addUl">
                                <i @click="addDependencies" class="el-icon-circle-plus"></i>
                            </div>
                        </el-row>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <!-- localJar 查询 -->
            <div class="nodeDialog"  v-if="dialogLocalJarVisible == true" >
                <div class="diHeader">
                    <h3>自定义包 查询</h3>
                    <span @click="dialogLocalJarVisible = false" class="el-icon-close"></span>
                </div>
                <div class="diContent">
                    <el-form class="elForm" ref="form" label-width="80px">
                        <!--<data-inquire @thisSelectDateVal="getSelectDateVal"></data-inquire>-->
                        <custom-package @thisSelectLocalJarVal="getSelectDataVal"></custom-package>
                    </el-form>
                </div>
                <div slot="footer" class="diFooter">
                    <el-button type="primary" @click="submitLocalJar">确定</el-button>
                    <el-button @click="dialogLocalJarVisible = false">取消</el-button>
                </div>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="desSetSubmit" type="primary">确定</el-button>
            <el-button @click="designSetNone">取消</el-button>
        </div>
    </el-dialog>

    </div>
</template>

<script>
    //数组去重
    import { mapGetters, mapActions,mapState } from "vuex";
    import customPackage from "@customPackage/customPackage.vue";
    import {deepCopy,transformArr,isRepeat} from "@function/comFunction";
    import store from "@store/index"

    
    export default {
        components: {customPackage},
        data() {
            return {
                designSetTab: "input",                                      //tab切换的title
                quote: {                 
                    inputs:[],                                              //input   引用下拉菜单
                    parameters:[],                                          //参数     引用下拉菜单
                    outputs:[],                                             //output   引用下拉菜单
                    dependencies:[]                                         //依赖    
                },
                statementTab:[                                              //每个标签切换的数据
                    {         
                        title: '输入',
                        key:"1",
                        icon:'fa fa-sign-in',
                        name: 'input',
                        close:false,
                        inputs: []
                    },{
                        title: '参数',
                        key:"2",
                        icon:'fa fa-gear',
                        name: 'parameter',
                        close:false,
                        parameters:[]
                    },{
                        title: '输出',
                        key:"3",
                        icon:'fa fa-sign-out',
                        name: 'output',
                        close:false,
                        outputs:[]
                    },{
                        title: '依赖',
                        key:"4",
                        icon:'fa fa-exchange',
                        name: 'dependencies',
                        close:false,
                        dependencies:[]
                    }
                ],
                varParameters:[],                                           //初始化自定义变量的值
                refParameters:[],                                           //初始化参数变量的值
                allStepParameters:[],                                       //参数变量引用下拉
                thisParVar:[],                                              //自定义变量下拉
                bSk: false,                                                 //点击确定非空验证
                bSk1: false,
                bSk2: false,
                bSk4: false,
                bSk5: false,
                bSk6: false,
                bSk8: false,
                repeatName: false,                                          //参数名字重复验证
                customName:false,                                           //自定义名字重复验证
                dialogLocalJarVisible:false,                                //自定义包查询  显示/隐藏
                jarIndex:0,                                                 //自定义包查询 选中的值的index
                labelPosition: 'left',                                      //表单域标签的位置
                customNameArr:[],
                parametersNameArr:[],
                pamermsNameStatus: false
            }
        },
        computed:{
            ...mapState(['dataflow'])
        },
        props:["flowSetData"],
        watch: {
            flowSetData:{                                // 监听父级传的来的整体的data
              handler:function(newValue){
                  var val = JSON.parse(JSON.stringify(newValue))      //深度拷贝一份传过来的值
                  var _this = this;
                  if(val.flowSetVisible == true){
                        this.statementTab[0].inputs = val.flowData.inputs;
                        this.statementTab[1].parameters = val.flowData.parameters;
                        this.statementTab[2].outputs = val.flowData.outputs;
                        this.statementTab[3].dependencies = val.flowData.dependencies;
                        this.thisParVar = val.thisPamVar
                        _this.refParameters = []
                        _this.varParameters = []
                        if(this.statementTab[1].parameters != undefined){
                            for(var i =0 ; i < this.statementTab[1].parameters.length; i++){
                                if(this.statementTab[1].parameters[i].category =='ref'){
                                    _this.refParameters.push(_this.statementTab[1].parameters[i])
                                }else if(this.statementTab[1].parameters[i].category =='var'){
                                    _this.varParameters.push(_this.statementTab[1].parameters[i])
                                }
                            }
                        }

                        // 去掉 参数声明 -> 参数变量 -> 引用下拉列表带有interceptor和sessionCache 字段
                        var temp = this.getArr(val.referenceVariable)
                        for(var i=0;i<temp.length;i++){
                             if(temp[i].indexOf("interceptor") != -1  || temp[i].indexOf("sessionCache") != -1 || temp[i].indexOf("logFile") != -1 || temp[i].indexOf("logPattern") != -1){
                                 temp.splice(i,1)
                             }
                        }
                        this.allStepParameters = temp
                        this.quoteFunction();
                 }

              },
              deep:true
            },
            refParameters: {                             // 验证参数变量字段是否为非空
                handler: function(val){
                            if(typeof val == 'undefined') return false
                            var _this = this
                            var arr = val
                            var arr1 = []
                                for(var j=0; j<arr.length; j++){
                                    if(arr[j].name==''){
                                            _this.bSk1 = true
                                    }else if(arr[j].name!==''){
                                        _this.bSk1 = false
                                    }
                                    if(arr[j].defaultVal==''){
                                            _this.bSk2 = true
                                    }else if(arr[j].defaultVal!==''){
                                        _this.bSk2 = false
                                    }
                                    var refsArr = arr[j].refs
                                    for(var k=0; k < refsArr.length; k++){
                                        if(refsArr[k]==''){
                                            _this.bSk4 = true
                                        }else if(refsArr[k]!==''){
                                            _this.bSk4 = false
                                        }
                                    }
                                    arr1.push(arr[j].name)
                                    this.parametersNameArr = arr1
                            }
                            this.repeatName = isRepeat(arr1) 
                },
                deep: true
            },
            varParameters: {                             //验证自定义变量字段是否为空
                handler: function(val){
                            var _this = this
                            var arr = val
                            var arr1 = []
                                for(var j=0; j<arr.length; j++){
                                    if(arr[j].name==''){
                                            _this.bSk5 = true
                                    }else if(arr[j].name!==''){
                                        _this.bSk5 = false
                                    }
                                    if(arr[j].defaultVal==''){
                                            _this.bSk6 = true
                                    }else if(arr[j].defaultVal!==''){
                                        _this.bSk6 = false
                                    }
                                    var refsArr = arr[j].refs
                                    for(var k=0; k < refsArr.length; k++){
                                        if(refsArr[k]==''){
                                            _this.bSk8 = true
                                        }else if(refsArr[k]!==''){
                                            _this.bSk8 = false
                                        }
                                    }
                                    arr1.push(arr[j].name)
                                    this.customNameArr = arr1
                            }
                            this.customName = isRepeat(arr1)
                },
                deep: true
            }
        },
        methods: {
            ...mapActions(["setFlowPam"]),
            pamermsNameContrast(){
                if(this.customNameArr.length!==0 && this.parametersNameArr.length !==0 ){
                    for(var i = 0; i<this.customNameArr.length; i++){
                        if(this.parametersNameArr.indexOf(this.customNameArr[i]) !==-1){
                            this.pamermsNameStatus = true
                        }
                    }
                } 
            },
            pamermsOper: function() {                    //点击确定按钮验证
                var val = this.statementTab
                var _this = this
                var breanArr=[];
                for(var i=0; i<val.length; i++){
                    if(val[i].title==='参数'){
                        var arr = val[i].parameters
                        if(val[i].parameters!=undefined){
                            var arr = val[i].parameters
                        }else {
                            var arr = []
                        }
                        if(arr.length>0 ){
                            for(var j=0; j<arr.length; j++){
                                var arrRefs = arr[j].refs
                                for(var k=0; k<arrRefs.length; k++){
                                    if(arrRefs[k]==''||arr[j].name==''||arr[j].defaultVal==''){
                                        _this.bSk = false
                                        breanArr.push(false)

                                    }else if(arrRefs[k]!==''||arr[j].name!==''||arr[j].defaultVal!==''){
                                        _this.bSk = true
                                        breanArr.push(true)

                                    }
                                }
                            }
                        }

                    }
                }
                if(breanArr.indexOf(false)=='-1'){
                    this.bSk = true
                }else if(breanArr.indexOf(false)!=='-1'){
                    this.bSk = false
                }
            },
            designSetNone : function(){                  // 点击取消/关闭按钮
                this.flowSetData.flowSetVisible = false;
            },
            handleClose(done) {                         //禁止点击其他位置关闭当前的弹出层
                // var _this = this;
                // $(".el-dialog__close").bind("click",function (event) {
                //     _this.designSetNone()
                // })
                this.designSetNone()
            },
            desSetSubmit : function () {                //确认 参数声明
                var _this = this;
                _this.pamermsOper()
                if(this.customNameArr.length!==0 && this.parametersNameArr.length !==0 ){
                    for(var i = 0; i<this.customNameArr.length; i++){
                        if(this.parametersNameArr.indexOf(this.customNameArr[i]) !==-1){
                            _this.$message({
                                message: '提交失败，自定义变量与参数变量名称不能重复！',
                                type: 'error'
                            });
                            return false
                        }
                    }
                } 
                if(_this.bSk && _this.repeatName == false && _this.customName == false ){
                    _this.flowSetData.flowSetVisible = false;
                    this.designSetUp()
                } else if(_this.bSk&&(_this.repeatName==true||_this.customName==true)){
                    _this.$message({
                        message: '提交失败，名字不能重复！',
                        type: 'error'
                    });
                }else{
                    _this.$message({
                        message: '提交失败，内容不能为空！',
                        type: 'error'
                    });
                } 
            },
            quoteFunction : function () {               //table切换页是否可以点击
                var _this = this;
                var typeValue = this.flowSetData;
                if(typeValue.inputs == false && typeValue.outputs != false){
                    _this.statementTab[0].close = true;
                    _this.designSetTab = "parameter"
                }
                if(typeValue.outputs == false && typeValue.inputs != false){
                    _this.statementTab[2].close = true;
                    _this.designSetTab = "input"
                }
                if(typeValue.outputs == false && typeValue.inputs == false){
                    _this.statementTab[0].close = true;
                    _this.statementTab[2].close = true;
                    _this.designSetTab = "parameter"
                }
                if(typeValue.outputs != false && typeValue.inputs != false){
                    _this.statementTab[0].close = false;
                    _this.statementTab[2].close = false;
                    _this.designSetTab = "input"
                }

                var inputLength = this.statementTab[0].inputs;
                if(this.statementTab[1].parameters!=undefined){
                    var parametersLength = this.statementTab[1].parameters;
                }else {
                     var parametersLength = []
                }
                
                var outputLength = this.statementTab[2].outputs;
                for(var i = 0; i < inputLength.length; i++){
                    _this.quote.inputs[i] = _this.flowSetData.quoteDataInput;
                }
                for(var i = 0; i < parametersLength.length; i++){
                    _this.quote.parameters[i] = _this.flowSetData.quoteDataParameter;
                }
                for(var i = 0; i < outputLength.length; i++){
                    _this.quote.outputs[i] = _this.flowSetData.quoteDataOutput;
                }
            },
            /*-----------------------------------inputs  输入事件---------------------------------------*/
            
            addUlInputs : function () {                  //输入 添加ul
                var _this = this;
                this.statementTab[0].inputs.push({
                    category: "",
                    defaultVal: "",
                    description: "",
                    name: "",
                    refs: [""]
                });
                this.quote.inputs.push(this.flowSetData.quoteDataInput)
            },
            
            removeUlInputs : function (index) {            //输入 移除ul
                let tabs = this.statementTab[0].inputs;
                let inputs = this.quote.inputs;
                tabs.splice(index,1);
                inputs.splice(index,1);

            },
            
            addQuoteInputs : function (index) {             //输入 添加当前引用
                this.statementTab[0].inputs[index].refs.push("");
            },
            
            removeQuoteInputs : function (index,number) {   //输入 移除当前引用
                let stmInput = this.statementTab[0].inputs[index].refs;
                let quoInput = this.quote.inputs[index];
                stmInput.splice(number,1);
            },
            /*-----------------------------------parameters 参数事件---------------------------------------*/
            getParameters:function () {
                let a = this.refParameters;
                a = a.concat(this.varParameters);
                this.statementTab[1].parameters = a;
            },
            
            selQuoteParameters : function (val,index) {    //参数变量
                for(var i=0;i<this.flowSetData.referenceVariable.length;i++){
                    for(var key in this.flowSetData.referenceVariable[i]){
                        if(key == val){
                            this.refParameters[index].defaultVal = this.flowSetData.referenceVariable[i][val].toString()
                        }
                    }
                }
            },
            
            addUlParameters : function () {               //参数 添加ul
                if(!this.refParameters){
                    this.refParameters = []
                }
                this.refParameters.push({
                    category: "ref",
                    defaultVal: "",
                    description: "",
                    name: "",
                    refs: [""]
                });
                this.quote.parameters.push(this.flowSetData.quoteDataParameter)
                this.getParameters();
            },
            
            removeUlParameters : function (index) {             //参数 移除ul
                let tabs = this.refParameters;
                let parameters = this.quote.parameters;
                tabs.splice(index,1);
                parameters.splice(index,1);
                this.getParameters();

            },
            
            addQuoteParameters : function (index) {             //参数 添加当前引用
                this.refParameters[index].refs.push("");
                this.getParameters();
            },
            
            removeQuoteParameters : function (index,number) {    //参数 移除当前引用
                let stmParameter = this.refParameters[index].refs;
                let quoParameter = this.quote.parameters[index];
                stmParameter.splice(number,1);
                this.getParameters();
            },

            
            vselQuoteParameters : function (val,index) {            //自定义变量
                var _this = this;
                for(var i=0; i< _this.thisParVar.length; i++){
                    if(val == _this.thisParVar[i].name){
                        this.varParameters[index].defaultVal = _this.thisParVar[i].value;
                    }
                }
            },
            
            vaddUlParameters : function () {                        //自定义变量 添加ul
                this.varParameters.push({
                    category: "var",
                    defaultVal: "",
                    description: "",
                    name: "",
                    refs: [""]
                });
                this.quote.parameters.push(this.flowSetData.quoteDataParameter);
                this.getParameters();
            },
            
            vremoveUlParameters : function (index) {                //自定义变量 移除ul
                let tabs = this.varParameters;
                let parameters = this.quote.parameters;
                tabs.splice(index,1);
                parameters.splice(index,1);
                this.getParameters();

            },
            
            vaddQuoteParameters : function (index) {                //自定义变量 添加当前引用
                this.varParameters[index].refs.push("");
                this.getParameters();
            },
            
            vremoveQuoteParameters : function (index,number) {      //自定义变量 移除当前引用
                let stmParameter = this.varParameters[index].refs;
                let quoParameter = this.quote.parameters[index];
                stmParameter.splice(number,1);
                this.getParameters();
            },

            /*-----------------------------------outputs 输出事件---------------------------------------*/
            
            addUlOutputs : function () {                            //输出 添加ul
                this.statementTab[2].outputs.push({
                    category: "",
                    defaultVal: "",
                    description: "",
                    name: "",
                    refs: [""]
                });
                this.quote.outputs.push(this.flowSetData.quoteDataOutput)
            },
            
            removeUlOutputs (index) {                    //输出 移除ul
                let tabs = this.statementTab[2].outputs;
                let outputs = this.quote.outputs;
                tabs.splice(index,1);
                outputs.splice(index,1);

            },
            
            addQuoteOutputs : function (index) {                    //输出 添加当前引用
                this.statementTab[2].outputs[index].refs.push("");
            },
            
            removeQuoteOutputs : function (index,number) {          //输出 移除当前引用
                let stmOutput = this.statementTab[2].outputs[index].refs;
                let quoOutput = this.quote.outputs[index];
                stmOutput.splice(number,1);
            },

            /*-----------------------------------dependencies 依赖事件---------------------------------------*/
            addDependencies : function () {                         //添加依赖项
                this.statementTab[3].dependencies.push({
                    name:''
                });
            },
            removeDependencies: function (index) {                  //移除依赖项
                let stmDe = this.statementTab[3].dependencies;
                stmDe.splice(index,1);
            },      
            depSel:function (index) {                               //显示自定义包                       
                this.dialogLocalJarVisible = true;
                this.jarIndex = index
            },

            getArr:function (param) {                               //将allStepParameters对象数组变为纯数组
                var arr = []
                for(var i=0;i<param.length;i++){
                    for (var property in param[i]){
                        arr.push(property);
                    }
                }
                return arr;
            },
            
            designSetUp:function() {                            //存储修改的参数
                sessionStorage.setItem("parameters", JSON.stringify(this.refParameters));
                this.$emit('tableData',this.statementTab)
                this.setFlowPam(this.statementTab)
            },
            // 自定义包选择
            getSelectDataVal:function (data) {
                this.statementTab[3].dependencies[this.jarIndex].name = data[0].jarName
                /*for(var i=0;i<data.length;i++){
                    this.statementTab[3].dependencies[i] = {name:""}
                    this.statementTab[3].dependencies[i].name = data[i].jarpath
                }*/
            },
            // local jar callback
            submitLocalJar:function () {
                this.dialogLocalJarVisible = false
            },
        },
        mounted(){
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