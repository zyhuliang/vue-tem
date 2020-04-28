<!-- steps参数 dataFlow Set split -->
<template>
        <el-form class="stepTable" label-width="150px">
                <el-form-item :label="'columns'" >
                        <el-select class="selectClass" multiple filterable  allow-create  default-first-option v-model="nodeData.columns" placeholder="（必填）">
                            <p v-if="getSelFields[0]">
                                <el-option v-for="(lb,inputLb) in getSelFields[0].fields" :key="inputLb" :value="lb.alias"></el-option>
                            </p>
                        </el-select>
                </el-form-item>
                <el-form-item :label="'watermarkColumn'">
                        <el-select class="selectClass" filterable  allow-create  default-first-option v-model="nodeData.watermark.watermarkColumn" placeholder="（请选择）">
                                <el-option v-for="(lb,inputLb) in getSelFields[0].fields" :key="inputLb" :value="lb.alias"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item :label="'watermarkInterval'">
                        <el-input class="w48"  v-model="num"  @input="changeNum">
                        </el-input>
                        <el-select class="w48"  :value="name"  @input="changeName">
                            <p v-if="getSelFields[0]">
                                <el-option v-for="(lb,inputLb) in nameArr" :key="lb" :value="lb"></el-option>
                            </p>
                        </el-select>
                </el-form-item>
        </el-form>
</template>

<script>
    export default {

        data() {
            return {
                nodeData:{          //存放节点参数信息
                    watermark:{
                        watermarkColumn:''
                    },
                    columns:[]
                },  
                numArr:['1','2','3','4','5'],
                nameArr:['milliseconds','seconds','minutes','hours'],
                num: '',
                name: '',
                time:'',
                getSelFields:[
                    {
                        fields:''
                    }
                ]
            }
        },
        props:["nodeSetData", 'getSelFields'],
        //监听节点参数变化
        watch: {
            nodeSetData:{
                handler(newValue, oldValue){
                    this.nodeData = newValue;
                    this.deduplicationPam()
                },
                deep: true
            },
            getSelFields(newValue, oldValue){
                this.getSelFields = newValue
            },
            getSelFields(val){
               val[0].fields.unshift({
                                    alias: "",
                                    column: "",
                                    description: "",
                                    type: "string"
                            })
            },
        },
        filters:{

        },
        methods: {
            //默认加载input
            deduplicationPam(){
                this.watermarkColumn = this.nodeData.watermark.watermarkInterval.toString()
                if(this.nodeData.watermark.watermarkInterval!=""){
                        this.num =((this.nodeData.watermark.watermarkInterval).split(" "))[0]
                        this.name =  ((this.nodeData.watermark.watermarkInterval).split(" "))[1]
                } else {
                        this.num = ''
                        this.name = ''
                }
            },
            //获取时间数值
            changeNum: function(val){
                this.num = val.replace(/[^\d]/g,'')
                if(this.num==''){
                    this.name = ''
                }
                this.nodeData.watermark.watermarkInterval =  this.num  +" "+ this.name
            },
            //获取时间值的时分秒
            changeName: function(val){
               this.name = val
               this.nodeData.watermark.watermarkInterval = this.num +" "+ val
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;
            this.deduplicationPam()
        }
    }

</script>

<style scoped>
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
    .stepTable .el-form-item{
        margin-bottom: 0px !important;
        margin-top: 10px;
    }
    .w48{
        width: 48%;
    }
</style>