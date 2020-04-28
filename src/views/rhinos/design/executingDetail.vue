<template>
    <section>
        <!-- content -->
        <div class="qa-content" id="bm-rh-design-detail">
        	<!--<el-button type="info" class="btn" @click="returnTask">
        		<i class="icon iconfont icon-ir-left"></i>返回
        	</el-button>-->
            <el-row class="btnClass"></el-row>
            
            <div class="executingDetail">
            	
                <el-tabs type="border-card" v-model="activeName">
                    <el-tab-pane v-for="(rtList,key) in rTabsList" :key="key" :name="rtList.name">
                        <router-link slot="label" class="rLinkLi" :to="rtList.url">{{rtList.name}}</router-link>                        
                    </el-tab-pane>
                    <router-view></router-view>
                </el-tabs>
            </div>            
        </div>
    </section>
</template>
<script>



    export default {

        data() {
            return {
                activeName: 0,
                flowId:"",
                rTabsList:[
                ],
            }
        },
        methods: {
        	/*returnTask(){
        		//返回质量分析-->任务执行信息列表
            	this.$router.push({path:'/qualityAnalysis/teInformation'});
        	},*/
            getFlowId:function () {
                var urlTrue = window.location.href.indexOf('/project')> -1;
                if(urlTrue === true){
                    if(this.jobId){
                        this.rTabsList = [
                            {
                                "name":"项目详细信息",
                                "url":"/project/design/executingDetail/"+this.flowId+ "/exection/" + this.jobId  + "/info",
                            },
                            {
                                "name":"项目Outputs",
                                "url":"/project/design/executingDetail/"+this.flowId+ "/exection/" + this.jobId  +"/outputs"
                            },
                            {
                                "name":"项目日志信息",
                                "url":"/project/design/executingDetail/"+this.flowId+ "/exection/" + this.jobId  +"/logInfo"
                            }
                        ]
                    }else{
                        this.rTabsList = [
                            {
                                "name":"项目详细信息 ",
                                "url":"/project/design/executingDetail/"+this.flowId+ "/info",
                            },
                            {
                                "name":"项目Outputs ",
                                "url":"/project/design/executingDetail/"+this.flowId+ "/outputs"
                            },
                            {
                                "name":"项目日志信息 ",
                                "url":"/project/design/executingDetail/"+this.flowId+ "/logInfo"
                            }
                        ]
                    }
                }else{
                    if(this.jobId){
                        this.rTabsList = [
                            {
                                "name":"详细信息",
                                "url":"/design/executingDetail/"+this.flowId+ "/exection/" + this.jobId  + "/info",
                            },
                            {
                                "name":"输出",
                                "url":"/design/executingDetail/"+this.flowId+ "/exection/" + this.jobId  +"/outputs"
                            },
                            {
                                "name":"日志信息",
                                "url":"/design/executingDetail/"+this.flowId+ "/exection/" + this.jobId  +"/logInfo"
                            }
                        ]
                    }else{
                        this.rTabsList = [
                            {
                                "name":"详细信息 ",
                                "url":"/design/executingDetail/"+this.flowId+ "/info",
                            },
                            {
                                "name":"输出 ",
                                "url":"/design/executingDetail/"+this.flowId+ "/outputs"
                            },
                            {
                                "name":"日志信息 ",
                                "url":"/design/executingDetail/"+this.flowId+ "/logInfo"
                            }
                        ]
                    }
                }

            }
        },
        mounted() {
            if(this.$route.query.type){
                sessionStorage.setItem("type",this.$route.query.type)
            }
            this.flowId = this.interceptedStr(this.$route.path)
            this.flowId = this.$route.params.id
            this.jobId = this.$route.params.jobId
            //console.log(this.flowId,"flowId")
            this.getFlowId();
        },
        watch:{
            $route(to,from){
                var that = this
                if(to.path.indexOf('/design/executingDetail/')>-1 && to.path.indexOf('/info')>-1) {
                    that.activeName ='0'
                }
            }
        }
    }

</script>

<style scoped lang="scss">
    .con-module{
        padding: 0px;
    }
    .rLinkLi{
        float: left;
        width: 100px;
        text-decoration: none;
        color: #333333;
        text-align: center;
        height: 100%;
    }
    .executingDetail{
        padding: 10px;
    }
    .btn{
    	position: absolute;
    	top: 6px;
    	right: 20px;
    	z-index: 9999;
    }
</style>