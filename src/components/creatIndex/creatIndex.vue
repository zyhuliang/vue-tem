<template>
    <div id="creatIndex">
        <el-form ref="form" :model="form" >
            <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="任务类型" :label-width="formLabelWidth">
                <el-select v-model="form.type" placeholder="请选择">
                    <el-option 
                      v-for="item in [{label:'index',value:'index'},{label:'count',value:'count'}]" 
                      :key="item.value" 
                      :label="item.label" 
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="对象类型" :label-width="formLabelWidth">
                <el-input v-model="form.objType"></el-input>
            </el-form-item>
            <el-form-item label="对象ID" :label-width="formLabelWidth">
                <el-input v-model="form.objId"></el-input>
            </el-form-item>
            <el-form-item label="对象名称" :label-width="formLabelWidth">
                <el-input v-model="form.objName"></el-input>
            </el-form-item>
            <el-form-item label="调度类型" :label-width="formLabelWidth">
                <el-select v-model="form.scheduleType" placeholder="请选择" @change="changeCron">
                    <el-option 
                      v-for="item in ['once','cron']" 
                      :key="item" 
                      :label="item" 
                      :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <div v-show="form.scheduleType=='cron'">
                <el-form-item label="执行参数" :label-width="formLabelWidth" >
                    <el-input v-model="form.configuration.cron"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" >
                    <div id='cron'></div>
                    <div id="example1-result" hidden="true"></div>
                </el-form-item>
                <el-form-item label="开始时间"  :label-width="formLabelWidth">
                    <el-date-picker
                        id="bm-hippo-schedule-timepicker-start"
                        type="date"
                        @change="startTimeChange"
                        format="yyyy/MM/dd"
                        v-model="startTime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间"  :label-width="formLabelWidth">
                    <el-date-picker
                        id="bm-hippo-schedule-timepicker-end"
                        v-model="endTime"
                        type="date"
                        @change="endTimeChange"
                        format="yyyy/MM/dd"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </div>
            
        </el-form>
    </div>
</template>
<script>

import jqCronBuilderJs from '@static/jsLibrary/cronLibrary/cron-jqCronBuilder/jquery-cron-quartz'
import jqCronBuilderCss from '@static/jsLibrary/cronLibrary/cron-jqCronBuilder/jquery-cron-quartz.css'
import {clusterinfo} from "@/api/cluster/index.js";
import { mapActions,mapState } from 'vuex';
export default {
    components:{
    },
    props:['creatIndexData'],
    data(){
        return {
            formLabelWidth: "120px",
            form:{
                name:'',
                type:'',
                objType: '',
                objId: '',
                objName: '',
                scheduleType:'',
                configuration:{
                    cron: "0 0 12 * * ? ", 
                    cronType: "simple", 
                    endTime: '',
                    startTime:''
                }
            },
            startTime: '',
            endTime:'',
            dialogDataSetVisible: false,
            clusterIdArr:[]
        }
    },
    watch:{
        creatIndexData:{
            handler(newVal,oldVal){
                console.log('newVal',newVal)
                this.form.objId = newVal.objId
                this.form.objName = newVal.objName
                this.form.objType = newVal.objType
            },
            deep: true,
            immediate: true
        }
    },
    computed:{
        ...mapState(['musestatus'])
    },
    methods:{
        cancelDatasetDialog(){
            //关闭dialog
            this.dialogDataSetVisible = false
            //调用子组件的方法清空子组件的值
            this.$refs.dataSourceInquire.clearSelectionRow();
        },
        startTimeChange() {
            this.form.configuration.startTime = (new Date( this.startTime).getTime()).toString()
        },
        endTimeChange(){
            this.form.configuration.endTime = (new Date(this.endTime).getTime()).toString()
        },
        changeCron(){
            // this.init()
        },
        //初始化周期数据
        init() {
            var _this = this
            _this.form.configuration.cron = ''
            $(function () {
                $('#cron').cronBuilder({
                    selectorLabel: "选择时间段:  ",
                    language: "zh_CN",
                    onChange: function (expression) {
                    $('#example1-result').text(expression);
                    _this.form.configuration.cron = expression.slice(0, expression.length - 1)
                    }
                });
            });
        }
    },
    mounted(){
        this.init()
        // this.form.objType = this.musestatus
    }
}
</script>
<style >
    #creatIndex .el-form-item__label {
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 25px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }
</style>