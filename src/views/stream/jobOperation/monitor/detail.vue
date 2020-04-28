<template>
    <section>
        <!-- content -->
        <div class="qa-content">
            <div class="streamDetail">
                <el-tabs type="border-card" v-model="activeName">
                    <el-tab-pane v-for="(rtList,key) in rTabsList" :key="key" :name="rtList.url">
                        <router-link slot="label" class="rLinkLi" :to="{path: rtList.url}">{{rtList.name}}</router-link>
                    </el-tab-pane>
                </el-tabs>
                <div class="primary-btn">
                    <el-button type="warning" @click="back()" class="primary-job ">返回</el-button>
                </div>
                <router-view></router-view>

            </div>
        </div>
    </section>
</template>
<script>
    export default {
        components: {},
        data() {
            return {
                activeName: '/jobOperation/streamMonitor/board',
                flowId:"",
                rTabsList: [
                    {
                        "name":"概览 ",
                        "url":"/jobOperation/streamMonitor/board",
                    },
                    {
                        "name":"执行计划",
                        "url":"/jobOperation/streamMonitor/executerSchedule",
                    },
                    {
                        "name":"详情",
                        "url":"/jobOperation/streamMonitor/jobDetail",
                    },
                    {
                        "name":"日志 ",
                        "url":"/jobOperation/streamMonitor/log",
                    },
                    {
                        "name":"输  出",
                        "url":"/jobOperation/streamMonitor/output",
                    },
                ],
                row: {},
            }
        },
        methods:{
            back: function () {
                // 路由跳转到progress列表页
                this.$router.push({path: '/jobOperation'})
            },
        },
        mounted() {
            this.$router.push({path: '/jobOperation/streamMonitor/board'})
        }
    }

</script>

<style>
    .streamDetail .el-tabs__content{
        padding: 0;
    }
</style>

<style lang="scss" scoped>
    .qa-content{
        .primary-btn{
            position: relative;
            width: 100%;
            .primary-job {
                position: absolute;
                right: 16px;
                top: -37px;
                z-index: 999;
            }
        }
        .buttonJob{
            padding-top: 10px;
            float: right;
        }
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
    }
</style>