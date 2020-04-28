<template>
    <section>
        <!-- content -->
        <div class="qa-content">
            <!--展示图形-->
            <iframe :src="src"  class="iframe-style" name="stream_job_detail"></iframe>
        </div>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                src:'',
                row:{}
            }
        },
        methods: {
        },
        created() {
            this.row = JSON.parse(sessionStorage.getItem('streamProgressRow'))
            var appInfo = this.row.appInfo
            if(appInfo){
                var applicationId = appInfo.appId
                var flinkJobId = appInfo.jobId
                this.src = "/proxy/"+ applicationId + "/#/jobs/"+flinkJobId
            }else{
                this.$message({
                    message:'页面加载失败',
                    type:'error'
                })
            }
        },
    }
</script>

<style scoped lang="scss">
    .iframe-style{
        min-height: 750px;
        width: 100%;
    }
</style>