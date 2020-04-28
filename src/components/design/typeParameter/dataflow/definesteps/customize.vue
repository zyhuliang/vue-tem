<!-- steps参数 dataFlow Datamining clusteringkmeans_predict -->
<template>
    <div class="stepTable">
        <!-- <div v-for="(item,key) in nodeData">
            <el-form-item :label="key">
                <el-tooltip  class="item" effect="dark" :content="key" placement="top">
                            <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input v-if="key!=='num'&&key!=='check'&&key!='stepClassName'&&key!='customJarFileName'"   v-model="nodeData[key]"  ></el-input>
                <el-input v-if="key=='stepClassName'||key=='customJarFileName'" disabled  v-model="nodeData[key]"  ></el-input>
            </el-form-item>
        </div> -->
        <div v-for="(item,key) in formData">
            <el-form-item :label="item.fileName">
                <el-tooltip   class="item" effect="dark" :content="item.descrip" placement="top">
                            <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-select class="selectClass" v-if="item.check==true&&item.fileType=='boolean'" v-model="nodeData[item.fileName]">
                    <el-option v-for="item in item.values"
                        :key="item"
                        :label="item"
                        :value="item"
                    >
                    </el-option>
                </el-select>
                <!-- <div v-if="item.check==false&&item.fileType=='String[]'"> -->
                <div  v-if="item.check==false&&item.fileType=='String[]'">
                    <div v-for="(item,index) in sqlData" >
                        <el-input class="sqlinput fl" v-model="sqlData[index]" :key="1" @input="(value)=>setSqlData(value,index,item.fileName)"></el-input>
                        <div @click="removeParam(index)" class="removeItem fr" >
                            <i class="i remove el-icon-remove-outline"></i>
                        </div>
                    </div>
                    <div @click="addParam()" class="addItem">
                        <i class="i el-icon-circle-plus-outline"></i>
                    </div> 
                </div>
                <el-select class="selectClass" v-if="item.check==true&&item.fileType=='String'" v-model="nodeData[item.fileName]">
                    <el-option v-for="(item,input) in inputData" :key="input" :value="item.alias"></el-option>
                </el-select>
                <el-input v-if="item.check==false&&item.fileType=='String'"   v-model="nodeData[item.fileName]"  ></el-input>
                <el-select class="selectClass" v-if="item.check==true&&item.fileType!=='boolean'&&item.values" v-model="nodeData[item.fileName]">
                    <el-option v-for="item in item.values"
                        :key="item"
                        :label="item"
                        :value="item"
                    >
                    </el-option>
                </el-select>
                 <el-select class="selectClass" v-if="item.check==true&&item.valueSource=='input'&&item.fileType=='List'" multiple filterable allow-create default-first-option v-model="nodeData[item.fileName]"  placeholder="请选择（多选）">                   
                    <el-option v-for="(item,input) in inputData" :key="input" :value="item.alias"></el-option>
                     <!-- <el-option v-for="(la,inputLa,index) in getSelFieldData[0].fields" :key="inputLa" :value="la.alias"></el-option> -->
                 </el-select>
            </el-form-item>
        </div>
        <div v-for="(item,key) in nodeData">
            <el-form-item :label="key" v-if="key=='sessionCache'||key=='interceptor'||key=='stepClassName'||key=='customJarFileName'">
                <el-tooltip  class="item" effect="dark" :content="key" placement="top">
                            <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-input v-if="key=='sessionCache'||key=='interceptor'"   v-model="nodeData[key]"  ></el-input>
                <el-input v-if="key=='stepClassName'||key=='customJarFileName'" disabled  v-model="nodeData[key]"  ></el-input>
            </el-form-item>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions,mapState } from "vuex";
    export default {
        components: {

        },
        data() {
            return {
                nodeData:{},
                defineData:'',
                inputData:[],
                formData: [
                   {
                        "fileName": "condition",
                        "fileType": "String",
                        "nullAble": false,
                        "descrip": "filter condition.",
                        "check": false
                    }
                ],
                sqlData: [''],
                fileName: ''
            }
        },
        computed:{
            ...mapState(['dataflow'])
        },
        props:["nodeSetData","getSelFields"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
                // this.formData = sessionStorage.getItem('setting')
            },
            getSelFields(newValue,oldValue){
                if(newValue.length>1){
                    for(var i=0;i<newValue.length;i++){
                        for(var j=0;j<newValue[i].fields.length;j++){
                            this.inputData.push({'alias':newValue[i].id+'_'+newValue[i].fields[j].alias})
                        }
                    }
                }else {
                    this.inputData = newValue[0].fields
                }
            },
            defineData(newValue,oldValue){
                this.nodeData = newValue
            },
            'dataflow.setting'(newValue,oldValue){
                this.formData = newValue
                for(var i=0;i<this.formData.length;i++){
                    if(this.formData[i].fileType=='String[]'){
                        this.fileName = this.formData[i].fileName
                        if(typeof this.nodeData[this.fileName]!='undefined'){
                             this.sqlData = this.nodeData[this.fileName]
                        }
                        
                    }
                }
            },
            sqlData:{
                handler(newValue,oldValue){
                     var _this = this
                     this.$set(this.nodeData,_this.fileName,newValue)
                },
                deep: true
            }
        },
        filters:{

        },
        methods: {
            addParam(){
                this.sqlData.push('')
            },
            removeParam(index){
                this.sqlData.splice(index,1)
            },
            setSqlData(val,index){
                var _this = this
                _this.sqlData[index]  = val
            }
        },
        mounted() {
        }
    }

</script>

<style scoped>
    .stepTable .el-form-item{
        margin-bottom: 0px !important;
        margin-top: 10px;
    }
    .selectClass{
        width: 100%;
    }
    .sign{
        margin-left: 150px;
        color: red;
        padding:0px;
        font-size:8px;
        font-style:normal;
    }
    .sqlinput{
        width: 90%;
    }
    .removeItem{
        width: 8%;
    }
    .addItem{
        width: 80%;
    }
    .fl{
        float: left;
    }
    .fr{
        float: right;
    }
</style>