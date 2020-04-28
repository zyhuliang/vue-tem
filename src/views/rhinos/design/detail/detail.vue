<template>
    <section class="irContent">
        <el-form ref="form" :model="form" label-width="80px" id="bm-rh-design-detail-detailForm">
            <el-form-item :label="'ID'|cn" class="item" prop="id">
               <el-input v-model="form.id" disabled name="id">{{form.id}}</el-input>
            </el-form-item>
            <el-form-item label="名称" class="item" prop="name">
               <el-input v-model="form.name" disabled name="name">{{form.name}}</el-input>
            </el-form-item>
            <el-form-item :label="'EID'|cn" class="item" prop="externalId">
               <el-input v-model="form.externalId" disabled name="externalId">{{form.externalId}}</el-input>
            </el-form-item>
            <el-form-item label="耗时(秒)" class="item" prop="cost">
                <el-input v-model="form.cost/1000" disabled name="cost"></el-input>
            </el-form-item>
            <el-form-item label="状态" class="item" prop="status">
                <el-tag class="processedClass" v-model="form.percentage" :formatter="pTypeFilter(form.status)" :type="form.status.color">{{form.status.processed}}/{{form.status.estimateTotal}}</el-tag>
            </el-form-item>
            <el-form-item label="流程主键" class="item" prop="flowId">
               <el-input v-model="form.flowId" disabled name="flowId">{{form.flowId}}</el-input>
            </el-form-item>
            <el-form-item label="流程名称" class="item" prop="flowName">
                <el-input v-model="form.flowName" disabled name="flowName">{{form.flowName}}</el-input>
            </el-form-item>
            <el-form-item label="调度主键" class="item" prop="flowSchedulerId">
               <el-input v-model="form.flowSchedulerId" disabled name="flowSchedulerId">{{form.flowSchedulerId}}</el-input>
            </el-form-item>
            <el-form-item label="调度名称" class="item" prop="flowSchedulerName">
               <el-input v-model="form.flowSchedulerName" disabled name="flowSchedulerName">{{form.flowSchedulerName}}</el-input>
            </el-form-item>
            <el-form-item label="APPID" class="item" prop="appId" v-if="form.appId !== undefined && form.appId !== ''">
                <el-input v-model="form.appId" disabled name="appId">{{form.appId}}</el-input>
            </el-form-item>
            <el-form-item label="FID" class="item" prop="fid" v-if="form.fid !== undefined && form.fid !== ''">
                <el-input v-model="form.fid" disabled name="fid">{{form.fid}}</el-input>
            </el-form-item>
            <el-form-item label="进程PID" class="item" prop="pid" v-if="form.pid !== undefined && form.pid !== ''">
                <el-input v-model="form.pid" disabled name="pid">{{form.pid}}</el-input>
            </el-form-item>
            <el-form-item label="创建时间" class="item" prop="createTime" >
               <el-input v-model="form.createTime" disabled :formatter="formatterTime('createTime', form.createTime)" name="createTime">{{form.createTime}}</el-input>
            </el-form-item>
            <el-form-item label="创建人" class="item" prop="creator">
               <el-input v-model="form.creator" disabled name="creator">{{form.creator}}</el-input>
            </el-form-item>
            <el-form-item label="修改人" class="item" prop="lastModifier">
               <el-input v-model="form.lastModifier" disabled name="lastModifier">{{form.lastModifier}}</el-input>
            </el-form-item>
            <el-form-item label="修改时间" class="item" prop="lastModifiedTime">
               <el-input v-model="form.lastModifiedTime" disabled name="lastModifiedTime" :formatter="formatterTime('lastModifiedTime', form.lastModifiedTime)">{{form.lastModifiedTime}}</el-input>
            </el-form-item>
            <el-form-item label="详细配置" class="item" prop="lastModifiedTime">
               <VueJsonPretty
                        :path="'res'"
                        :data="form.properties">
                        </VueJsonPretty>
                
            </el-form-item>
        </el-form>
    </section>
</template>
<script>
    import VueJsonPretty from 'vue-json-pretty'
    import moment from "moment"//时间格式化
    import { listExecutingHistory} from '@api'
    import {createParameter} from '@function/queryParameter.js';
    export default{
        data(){
            return{
                form: {
                    name: '',
                    externalId: '',
                    cost: '',
                    status: '',
                    flowId: '',
                    flowName: '',
                    flowSchedulerId: '',
                    flowSchedulerName: '',
                    createTime: '',
                    creator: '',
                    lastModifier: '',
                    lastModifiedTime: '',
                    percentage:0
                },
                cols:[
                    {
                        prop:"nullable",
                        label:""
                    },
                    {
                        prop:"debug",
                        label:""
                    },
                    {
                        prop:"rows",
                        label:""
                    },
                    {
                        prop:"enable",
                        label:""
                    },
                     {
                        prop:"loginId",
                        label:""
                    },
                    {
                        prop:"mode",
                        label:""
                    },
                    {
                        prop:"drivermemory",
                        label:""
                    },
                    {
                        prop:"cores",
                        label:""
                    },
                     {
                        prop:"memory",
                        label:""
                    },
                    {
                        prop:"dirs",
                        label:""
                    },
                    {
                        prop:"master",
                        label:""
                    },
                    {
                        prop:"executors",
                        label:""
                    },
                     {
                        prop:"queue",
                        label:""
                    },
                    {
                        prop:"files",
                        label:""
                    },
                    {
                        prop:"usertenant",
                        label:""
                    },
                    {
                        prop:"verbose",
                        label:""
                    }
                
                ],
                 activeNames: ['1']
            }
        },
        methods: {
            getConfigData(data){

                return[
                   { 
                       nullable:data["all.dataset-nullable"],
                       debug:data["all.debug"],
                       rows:data["all.debug-rows"],
                       enable:data["all.lineage.enable"],
                        loginId:data["all.user-loginId"],
                       mode:data["dataflow.deploy-mode"],
                       drivermemory:data["dataflow.driver-memory"],
                       cores:data["dataflow.executor-cores"],
                        memory:data["dataflow.executor-memory"],
                       dirs:data["dataflow.local-dirs"],
                       master:data["dataflow.master"],
                       executors:data["dataflow.num-executors"],
                        queue:data["dataflow.queue"],
                       files:data["dataflow.sink.concat-files"],
                       usertenant:data["all.user-tenant"],
                       verbose:data["dataflow.verbose"],
                   }
                ]

            },
            //			时间格式
            formatterTime:function(field, date) {
                if (!date) {
                    return "";
                }
                this.form[field] = moment(date).format("YYYY-MM-DD HH:mm:ss");
            },
            //过滤列表状态
            pTypeFilter:function(status) {
                if(status.estimateTotal !=0)
                this.form.percentage = status.processed/status.estimateTotal*100
                if(status.type == "SUCCEEDED"){
                    return status.color = "success";
                }else if(status.type == "KILLED"){
                    return status.color = "warning";
                }else if(status.type == "FAILED"){
                    return status.color = "danger";
                }
            },
            onSubmit() {
                console.log('submit!');
            }
        },
        mounted(){
            this.flowId = this.$route.params.id;
            if(this.$route.params.id && this.$route.params.jobId){
                // 从监控跳过来
                var para = createParameter('flowId',this.flowId,"EQUAL").And('jobId',this.$route.params.jobId,"EQUAL").Offset(0).Limit(8).Build();
            }else{
                //根据flowId获取最近的一次executionId
                var para = createParameter('flowId',this.flowId,"EQUAL").Offset(0).Limit(8).Build();
            }
            var that = this
            listExecutingHistory(para).then(res => {
                Object.assign(that.form , res.content[0])

                console.log(that.form);
            },error =>{
                // this.$confirm(error.response.data.err,"错误", {
                //     type: "error"
                // })
            });
        },
        components: {
            VueJsonPretty
        }
    }

</script>
<style lang="scss" scoped>
    .processedClass{
        width: 100%;
        text-align:center;
    }
    .irContent{
        float: left;
        position: relative;
        width: 100%;
        padding: 0px 0px 0px 0px;
        min-height: 550px;
        box-sizing: border-box;
        height: calc(100vh - 234px);
        overflow-y: auto;
    }
</style>
