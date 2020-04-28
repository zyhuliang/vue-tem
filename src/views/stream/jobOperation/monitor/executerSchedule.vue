<template>
    <section>
        <!-- content -->
        <div class="qa-content">
            <!--展示图形-->
            <iframe src="/static/jsLibrary/visualizer/index.html" class="iframe-style" name="stream_job_execution_plan"></iframe>
        </div>
    </section>
</template>
<script>
    export default {
        data() {
            return {
                row:{}
            }
        },
        methods: {
            // 加载图片
            showDraw: function (row) {
                var draw = function(json){
                    setTimeout(function () {
                        //如果没有准备好ifream就等待100ms递归调用
                        var isReady =  stream_job_execution_plan.window.isReady
                        if(isReady){
                            stream_job_execution_plan.window.draw(json);
                        }else{
                            draw(json)
                        }
                    }, 100)
                }
                //构建要展示的数据
                var json = JSON.parse(row.appInfo.executionPlan)
                if(json != undefined){
                    draw(json)
                }
            },
        },
        created() {
            this.row = JSON.parse(sessionStorage.getItem('streamProgressRow'))
            this.showDraw(this.row);
        },
    }
</script>

<style scoped lang="scss">
    .iframe-style{
        min-height: 750px;
        width: 100%;
    }
</style>