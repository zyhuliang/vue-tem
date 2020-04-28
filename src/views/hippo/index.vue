<template>
    <section class="irContent bg" id="bm-hippo-index">
        <div v-if="this.$route.path == '/hippo/index'">
            <!--节点状态监控-->
            <el-container class="left" v-loading="loadingNode">
                <el-header class="header node">
                    <div class="title">节点状态监控</div>
                    <div class="nodeDetail">
                        <el-button @click="gotoNode" size="medium  sepcial" round>集群服务组件详情</el-button>
                        <span>|</span>
                        <el-button @click="gotoCollecter" size="medium  sepcial" round>详细分析</el-button>
                    </div>
                </el-header>
                <el-main class="main">
                    <div class="main-container">
                        <template>
                            <el-table
                                    id="bm-hippo-index-nodetable"
                                    :data="collectors"
                                    style="width: 100%">
                                <el-table-column
                                        prop="id"
                                        label="主键"
                                        show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="节点名称">
                                </el-table-column>
                                <el-table-column
                                        prop="ip"
                                        label="服务器地址">
                                </el-table-column>
                                <el-table-column
                                        prop="status"
                                        label="状态">
                                    <template slot-scope="scope">
                                        <span class="red-bg" v-show="scope.row.status == 0">离线</span>
                                        <span class="green-bg" v-show="scope.row.status != 0">在线</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </div>
                </el-main>
            </el-container>
            <!--数据源状态监控-->
            <el-container class="right" v-loading="loadingIndex">
                <el-header class="header state">
                    <div class="title">数据源状态监控</div>
                    <div class="detail">
                        <el-button class="change2" @click="gotoSource" size="medium" round>查看全部</el-button>
                    </div>
                </el-header>
                <el-main class="main">
                    <div class="main-container">
                        <template>
                            <el-table
                                    id="bm-hippo-index-datasourcenode"
                                    :data="dataStatus"
                                    style="width: 100%">
                                <el-table-column
                                        prop="name"
                                        label="数据源">
                                </el-table-column>
                                <el-table-column
                                        prop="owner"
                                        :label="'OWNER'|cn"
                                        show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                        prop="status"
                                        label="连接状态"
                                        width="130px">
                                    <template slot-scope="scope">
                                        <span class="red-bg" v-show="scope.row.status == 'FAILED'">失败</span>
                                        <span class="green-bg" v-show="scope.row.status != 'FAILED'">成功</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </div>
                </el-main>
            </el-container>
        </div>
        <router-view></router-view>
    </section>
</template>
<script>
    import {indexData, collectors} from '@api'
    import {createParameter} from '@components/function/queryParameter.js';

    export default {
        data() {
            return {
                loadingIndex:false,//数据源状态监控
                loadingNode:false,//节点状态监控加载
                //不同状态个数
                RUNNING: 0,
                READY: 0,
                SUCCEEDED: 0,
                FAILED: 0,
                KILLED: 0,
                UNKNOWN: 0,
                week: "",
                weeks: "",
                days: "",
                flowexecution: [],
                today: "",
                yestoday: "",
                schedulers: "",
                dataStatus: [],
                collectors: []
            }
        },
        methods: {
            gotoNode: function () {
                this.$router.push({"path": "/hippo/nodeMonitor"})
            },
            gotoCollecter: function () {
                this.$router.push({"path": "/collector"})
            },
            getInitData: function () {
                this.week = this.getWeek();
                this.days = this.getAll(this.week[5], this.week[this.week.length - 1]);
                var that = this;
                // 数据源状态监控加载
                this.loadingIndex = true
                indexData().then(data => {
                    this.loadingIndex = false
                    this.getAllState(data.stats[0]);  //获取flowexecution的不同状态个数数据
                        //昨天，今天每个小时执行任务数画图
                        this.flowexecution = data.flowexecution;
                        this.today = this.getTotalArray(this.flowexecution, (this.days[1].indexOf("T") > 0) ? (this.days[2].split("T")[0]) : this.days[1]);
                        this.yestoday = this.getTotalArray(this.flowexecution, (this.days[0].indexOf("T") > 0) ? (this.days[1].split("T")[0]) : this.days[0]);
                        //按天取前一周任务调度数据画图
                        this.weeks = this.getAll(this.week[0], this.week[this.week.length - 1]);
                        this.schedulers = this.InitializeData(this.weeks.length);
                        this.schedulers = this.getTaskHistoryData(this.weeks, data.schedulers.sort(this.byField("name")), this.schedulers);
                        var legend = ['计划'];
                        //获取任务告警数据画图
                        var arr = data.alarms;
                        var alarm_data = [0, 0, 0];
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].name === 'deadly') {
                                alarm_data[0] = arr[i].count;
                            } else if (arr[i].name === 'serious') {
                                alarm_data[1] = arr[i].count;
                            }
                            if (arr[i].name === 'warning') {
                                alarm_data[2] = arr[i].count;
                            }
                        }
                        //数据源状态监控
                        this.dataStatus = data.datastatus.slice(0, 4);
                    }, err => {
                        var _this = this;
                        _this.loadingIndex = false
                        if (err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    }
                )
                // 节点状态监控加载
                var param = createParameter().Limit(5).Build();
                this.loadingNode = true
                collectors(param).then(data => {
                    this.loadingNode = false
                    this.collectors = data.content;
                    }, err => {
                    this.loadingNode = false
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
            //获取flowexecution的不同状态个数数据
            getAllState: function (allState) {
                this.RUNNING = allState["executions-RUNNING"] || 0;
                this.READY = allState["executions-READY"] || 0;
                this.SUCCEEDED = allState["executions-SUCCEEDED"] || 0;
                this.FAILED = allState["executions-FAILED"] || 0;
                this.KILLED = allState["executions-KILLED"] || 0;
                this.UNKNOWN = allState["executions-UNKNOWN"] || 0;
            },
            getTotalArray: function (arr, day) {
                var Array = [];
                var days = [];
                var date = new Date();
                var now = date.getFullYear();
                ((date.getMonth() + 1) < 10) ? now = now + "0" + (date.getMonth() + 1) : now = now + "" + (date.getMonth() + 1);
                (date.getDate() < 10) ? now = now + "0" + date.getDate() : now = now + "" + date.getDate();
                (date.getHours() < 10) ? now = now + '0' + date.getHours() : now = now + '' + date.getHours();
                for (var i = 0; i < 24; i++) {
                    (i < 10) ? days[i] = day + '0' + i : days[i] = day + '' + i;
                    for (var r = 0; r < arr.length; r++) {
                        if (i < 10 && day + '0' + i === arr[r].name) {
                            Array[i] = arr[r].count;
                            break;
                        } else if (i >= 10 && day + '' + i === arr[r].name) {
                            Array[i] = arr[r].count;
                            break;
                        }
                    }
                    if (r >= arr.length) {
                        Array[i] = 0;
                    }
                }
                for (var i = 23; i >= 0; i--) {
                    if (days[i] > now) {
                        Array[i] = null;
                    } else {
                        break;
                    }
                }
                return Array;
            },
            gotoSource: function () {
                this.$router.push({"path": "/hippo/data/status/"})
            },
        },
        mounted() {
            this.getInitData();
        },
    };
</script>

<style lang="scss" scoped>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
    }

    .el-main {
        background-color: white;
        color: #333;
        text-align: center;
    }

    .router-sc {
        position: absolute;
        top: 20px;
        box-sizing: content-box;
        width: 100%;
        z-index: 100;
    }

    .bg {
        background-color: #FFF;
        min-width: 900px;
        padding: 10px;
        .top {
            .header {
                width: calc(100% - 20px);
                height: 40px !important;
                line-height: 40px !important;
                background-color: #8cb6bc;
                box-shadow: 0px 12px 10px 0px rgba(6, 0, 1, 0.02);
                border-radius: 10px 10px 0px 1px;
                .title {
                    float: left;
                    height: 25px;
                    font-size: 16px;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #ffffff;
                }
                .detail {
                    right: 20px;
                    position: absolute;
                    clear: both;
                    font-size: 13px;
                    color: #fff;
                    a {
                        color: #fff;
                        text-decoration: none;
                    }
                }
                .icon {
                    float: right;
                }
            }
            .main {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                background-color: #E9EEF3;
                .has-margin {
                    margin-right: 15px;
                    margin-left: 0px;
                }
                .draw {
                    float: left;
                    height: 250px;
                    width: 100%;
                }
            }
        }
    }

    .main-container {
        width: 100%;
        height: 250px;
        .red-bg {
            background-color: red;
            color: white;
            padding: 10px 5px
        }
        .green-bg {
            background-color: green;
            color: white;
            padding: 10px 5px
        }
    }

    .left {
        float: left;
        width: 50%;
        position: relative;
        .header {
            float: left;
            width: calc(49% - 10px);
            height: 40px !important;
            line-height: 40px !important;
            background-color: #ff9d6a;
            box-shadow: 0px 12px 10px 0px rgba(6, 0, 1, 0.02);
            border-radius: 10px 10px 0px 1px;
        }
        .resource {
            background-color: #50bcbd;
        }
        .node {
            background-color: #fecc4c;
            width: 98%;
        }
        .title {
            float: left;
            height: 25px;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #ffffff;
        }
        .detail {
            float: right;
            margin-top: -15px;
            color: #fff;
            top: 20px;
            clear: both;
            font-size: 13px;
            .el-button {
                color: #fff;
            }
            a {
                color: #fff;
                text-decoration: none;
            }
            .sepcial {
                background-color: #ff9d6a;
                border: none;
                padding: 0px;
            }
        }
        .nodeDetail {
            position: absolute;
            right: 50px;
            color: #fff;
            clear: both;
            font-size: 13px;
            .el-button {
                color: #fff;
            }
            a {
                color: #fff;
                text-decoration: none;
            }
            .sepcial {
                background-color: #fecc4c;
                border: none;
                padding: 0px;
            }
        }
        .icon {
            float: right;
        }
        .main {
            width: 98%;
            padding: 10px;
            text-align: inherit;
            background-color: #E9EEF3;
            .has-margin {
                margin-right: 15px;
                margin-left: 0px;
            }
        }
    }

    .right {
        float: left;
        width: 49.5%;
        margin-bottom: 20px;
        .header {
            height: 40px !important;
            line-height: 40px !important;
            background-color: #8fbcd8;
            box-shadow: 0px 12px 10px 0px rgba(6, 0, 1, 0.02);
            border-radius: 10px 10px 0px 1px;
        }
        .state {
            background-color: #4ead8d;
        }
        .title {
            float: left;
            height: 25px;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #ffffff;
        }
        .detail {
            position: absolute;
            right: 50px;
            color: #fff;
            clear: both;
            font-size: 13px;
            .el-button {
                color: #fff;
            }
            .change {
                background-color: #8fbcd8;
                border: none;
                padding: 0px;
            }
            .change2 {
                background-color: #4ead8d;
                border: none;
                padding: 0px;
            }
        }
        .icon {
            float: right;
        }
        .main {
            padding: 10px;
            text-align: inherit;
            background-color: #E9EEF3;
            .has-margin {
                margin-right: 15px;
                margin-left: 0px;
            }
        }
    }

    /*card的样式设置*/
    .card-dashboard {
        width: 100%;

        .card-button {
            font-weight: bold;
            float: right;
        }
        .dead {
            color: #f56c6c;
        }

        .run {
            color: #2ac06d;
        }

        .wait {
            color: #4a9ff9;
        }

        .text {
            font-size: 14px;
            float: left;
            height: 40px;
            width: 100%;
        }

        .clearfix:before,
        .clearfix:after {
            display: table;
            content: "";
        }
        .clearfix:after {
            clear: both
        }

        .box-card {
            width: 23%;
            float: left;
            margin-left: 1%;
            margin-right: 1%;
            min-height: 220px;
            /*max-height: 220px;*/
        }
    }
</style>