<template>
    <section>
        <div class="qa-content" id="bm-hippo-monitor">
            <ul id="bm-hippo-monitor-ul">
                <li v-for="(rtList,index) in rTabsList" @click="mountFun">
                    <router-link class="rLinkLi" :to="rtList.url">{{rtList.name}}({{rtList.count}})</router-link>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </section>
</template>
<script>
    import {executeList} from '@api'
    import {queryObject, createParameter} from '@components/function/queryParameter.js';

    export default {
        data() {
            return {
                rTabsList: [
                    {
                        "name": "运行中",
                        "url": "/hippo/monitor/RUNNING",
                        "count": 0
                    },
                    {
                        "name": "就绪",
                        "url": "/hippo/monitor/READY",
                        "count": 0
                    },
                    {
                        "name": "成功",
                        "url": "/hippo/monitor/SUCCEEDED",
                        "count": 0
                    },
                    {
                        "name": "失败",
                        "url": "/hippo/monitor/FAILED",
                        "count": 0
                    },
                    {
                        "name": "杀死",
                        "url": "/hippo/monitor/KILLED",
                        "count": 0
                    },
                    {
                        "name": "超时",
                        "url": "/hippo/monitor/TIMEOUT",
                        "count": 0
                    },
                    {
                        "name": "未知",
                        "url": "/hippo/monitor/UNKNOWN",
                        "count": 0
                    }
                ]
            }
        },
        methods: {
            getStatusCount: function () {
                var that = this
                var parameter = createParameter('name', "%", 'LIKE').Offset(0).Limit(8).Build();
                executeList(parameter).then(data => {
                        var status = data.facetContent;
                        for (var item in status) {
                            for (var bar in that.rTabsList) {
                                if (that.rTabsList[bar].url.indexOf(status[item].facet) != -1) {
                                    that.rTabsList[bar].count = status[item].count
                                }
                            }
                        }

                        var running = true
                        var ready = true
                        for (var item in status) {
                            if (that.rTabsList[0].count >= 0) {
                                if (status[item].facet == "RUNNING") {  // 不进行
                                    running = false
                                }
                            }
                            if (that.rTabsList[1].count >= 0) {
                                if (status[item].facet == "READY") {  // 不进行
                                    ready = false
                                }
                            }

                        }
                        if (running) {
                            that.rTabsList[0].count = 0
                        }
                        if (ready) {
                            that.rTabsList[1].count = 0
                        }

                    }, err => {
                        var _this = this;
                        if (err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    }
                )
            },
            mountFun: function () {
                var that = this
                var parameter = createParameter('name', "%", 'LIKE').Offset(0).Limit(8).Build();
                executeList(parameter).then(data => {
                    var status = data.facetContent;
                    for (var item in status) {
                        for (var bar in that.rTabsList) {
                            if (that.rTabsList[bar].url.indexOf(status[item].facet) != -1) {
                                that.rTabsList[bar].count = status[item].count
                            }
                        }
                    }
                })
            }
        },
        mounted() {
            this.mountFun();
            this.processTrigger = setInterval(this.mountFun, 30000);
        },
        beforeDestroy() {
            //切换页面时停止定时更新任务
            clearInterval(this.processTrigger);
        },
    };

</script>

<style lang="scss" scoped>
    .qa-content {
        float: left;
        width: 100%;
        margin-top: -10px;
        box-sizing: border-box;
        padding: 0 !important;
        ul {
            float: left;
            width: 100%;
            margin: 0;
            padding: 0;
            border-bottom: 1px solid #dddddd;
            .rLinkLi {
                text-decoration: none;
                float: left;
                margin: 0px 20px 0px 0px;
                color: #666666;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
            }
            .router-link-active {
                border-bottom: 2px solid #3e98fe;
                color: #3e98fe;
            }
        }
    }
</style>