<template>
    <div class="taskControl" id="bm-hippo-taskcontrol">
        <div v-if="this.$route.path == '/hippo/taskControl'">
            <!--任务完成情况监控-->
            <el-container class="top">
                <el-header class="header">
                    <div class="title">任务完成情况监控</div>
                    <div class="detail">
                        <router-link to="/hippo/tasks">查看详情分析</router-link>
                    </div>
                </el-header>
                <el-main class="main">
                    <div style="width: 100%">
                        <div style="float: top" align="center">
                            <el-button id="bm-hippo-taskcontrol-run" class="has-margin" @click="gotoMonitor('RUNNING')">
                                运行中({{RUNNING}})
                            </el-button>
                            <el-button id="bm-hippo-taskcontrol-ready" class="has-margin" @click="gotoMonitor('READY')">
                                等待({{READY}})
                            </el-button>
                            <el-button id="bm-hippo-taskcontrol-success" class="has-margin"
                                       @click="gotoMonitor('SUCCEEDED')">成功({{SUCCEEDED}})
                            </el-button>
                            <el-button id="bm-hippo-taskcontrol-fail" class="has-margin" @click="gotoMonitor('FAILED')">
                                失败({{FAILED}})
                            </el-button>
                            <el-button id="bm-hippo-taskcontrol-kill" class="has-margin" @click="gotoMonitor('KILLED')">
                                杀死({{KILLED}})
                            </el-button>
                            <el-button id="bm-hippo-taskcontrol-timeout" class="has-margin"
                                       @click="gotoMonitor('TIMEOUT')">超时({{TIMEOUT}})
                            </el-button>
                            <el-button id="bm-hippo-taskcontrol-unknow" class="has-margin"
                                       @click="gotoMonitor('UNKNOWN')">未知({{UNKNOWN}})
                            </el-button>
                        </div>
                        <div class="draw" id="finishMonitor">
                        </div>
                    </div>
                </el-main>
            </el-container>
            <!--任务调度-->
            <el-container class="left">
                <el-header class="header">
                    <div class="title">任务调度</div>
                    <div class="detail">
                        <el-button id="bm-hippo-taskcontrol-detail" @click="gotoSchedule" type="text" size="medium  sepcial" round>
                            详情列表
                        </el-button>
                        <span>|</span>
                        <el-button id="bm-hippo-taskcontrol-detail-ana" @click="gotoAnalyze" type="text"  size="medium  sepcial"
                                   round>详细分析
                        </el-button>
                    </div>
                </el-header>
                <el-main class="main">
                    <div class="main-container" id="monitor">
                    </div>
                </el-main>
            </el-container>
            <!--任务警告-->
            <el-container class="right">
                <el-header class="header">
                    <div class="title">任务警告</div>
                    <div class="detail">
                        <el-button id="bm-hippo-taskcontrol-warning" class="change" @click="gotoAlarm" size="medium"
                                   round>详情列表
                        </el-button>
                    </div>
                </el-header>
                <el-main class="main">
                    <div class="main-container" id="alarm_id"></div>
                </el-main>
            </el-container>
        </div>
        <router-view v-else></router-view>
    </div>
</template>
<script>
    import {indexData, collectors} from '@api'
    import {createParameter} from '@components/function/queryParameter.js';

    export default {
        data() {
            return {
                ishow: true,
                week: "",
                weeks: "",
                days: "",
                flowexecution: [],
                today: "",
                yestoday: "",
                schedulers: "",
                //不同状态个数
                RUNNING: 0,
                READY: 0,
                SUCCEEDED: 0,
                FAILED: 0,
                KILLED: 0,
                TIMEOUT: 0,
                UNKNOWN: 0,
                // 任务完成情况图
                task_finished_option: {
                    title: {
                        text: '',
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['今天', '昨天']
                    },
                    toolbox: {
                        show: true,
                        right: '2%',
                        feature: {
                            dataView: {readOnly: true},
                            magicType: {type: ['line', 'bar']},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                    series: [
                        {
                            name: '今天',
                            type: 'line',
                            data: [],
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },

                        }, {
                            name: '昨天',
                            type: 'line',
                            data: [],
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: []
                            }
                        }
                    ]
                },
                //概览页执行分析趋势图
                indexSchudule_option: {
                    title: {
                        text: '调度趋势',
                    },
                    color: ['#00CD32'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['执行']
                    },
                    toolbox: {
                        show: true,
                        right: '3%',
                        feature: {
                            dataView: {readOnly: true},
                            magicType: {type: ['line', 'bar']},
                            //restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['5月1日', '5月2日', '5月3日', '5月4日', '5月5日', '5月6日', '5月7日']
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                    series: [
                        {
                            name: '执行',
                            type: 'line',
                            areaStyle: {normal: {}},
                            data: [10, 9, 10, 13, 16, 14, 12],
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                },
                // 概览页任务告警情况图
                alarm_option: {
                    title: {
                        text: '告警信息'
                    },
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '5%',
                        right: '5%',
                        bottom: '10%',
                        containLabel: true
                    }, toolbox: {
                        show: true,
                        right: '3%',
                        feature: {
                            dataView: {readOnly: true},
                            saveAsImage: {}
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['致命', '严重', '警告'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            itemStyle: {
                                normal: {
                                    //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                                    color: function (params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B', '#FFE42A', '#29AAE3'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                    //以下为是否显示，显示位置和显示格式的设置了
                                    label: {
                                        show: true,
                                        position: 'top',
                                        // formatter: '{b}\n{c}'
                                        formatter: '{c}'
                                    }
                                }
                            },
                            name: '告警信息量(条)',
                            type: 'bar',
                            barWidth: '60%',
                            data: []
                        }
                    ]
                },
            }
        },
        watch: {
            $route(to, from) {
                if (to.path == "/hippo/taskControl") {
                    this.getInitData();
                }
            }
        },
        mounted() {
            this.getInitData();
        },
        methods: {
            gotoMonitor: function (value) {
                this.ishow = false;
                this.$router.push({"path": "/hippo/monitor/" + value});
            },
            getInitData: function () {
                this.week = this.getWeek();
                this.days = this.getAll(this.week[5], this.week[this.week.length - 1]);
                var that = this;
                indexData().then(data => {
                        this.getAllState(data.stats[0]);  //获取flowexecution的不同状态个数数据
                        //昨天，今天每个小时执行任务数画图
                        this.flowexecution = data.flowexecution;
                        this.today = this.getTotalArray(this.flowexecution, (this.days[1].indexOf("T") > 0) ? (this.days[2].split("T")[0]) : this.days[1]);
                        this.yestoday = this.getTotalArray(this.flowexecution, (this.days[0].indexOf("T") > 0) ? (this.days[1].split("T")[0]) : this.days[0]);
                        this.drawing(this.task_finished_option, 'finishMonitor', this.today, this.yestoday);
                        //按天取前一周任务调度数据画图
                        this.weeks = this.getAll(this.week[0], this.week[this.week.length - 1]);
                        this.schedulers = this.InitializeData(this.weeks.length);
                        this.schedulers = this.getTaskHistoryData(this.weeks, data.schedulers.sort(this.byField("name")), this.schedulers);
                        var legend = ['计划'];
                        this.drawingJobAnalysis(this.indexSchudule_option, 'monitor', this.weeks, legend, this.schedulers);
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
                        this.drawing_alert(this.alarm_option, 'alarm_id', alarm_data);
                        //数据源状态监控
                        this.dataStatus = data.datastatus.slice(0, 4);
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
                var param = createParameter().Limit(5).Build();
                collectors(param).then(data => {
                        this.collectors = data.content;
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
            //获取flowexecution的不同状态个数数据
            getAllState: function (allState) {
                this.RUNNING = allState["executions-RUNNING"] || 0;
                this.READY = allState["executions-READY"] || 0;
                this.SUCCEEDED = allState["executions-SUCCEEDED"] || 0;
                this.FAILED = allState["executions-FAILED"] || 0;
                this.KILLED = allState["executions-KILLED"] || 0;
                this.UNKNOWN = allState["executions-UNKNOWN"] || 0;
                this.TIMEOUT = allState["executions-TIMEOUT"] || 0;
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
            //概览页任务完成情况图根据数据画图
            drawing: function (option, id, today_date, yesterday_date) {
                var myChart = this.$echarts.init(document.getElementById(id));
                this.task_finished_option.series[0].data = today_date;
                this.task_finished_option.series[1].data = yesterday_date;
                //使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                window.onresize = myChart.resize;
            },
            //任务趋势分析画图
            drawingJobAnalysis: function (option, id, xAxis, legend, datas, yName) {
                var myChart = this.$echarts.init(document.getElementById(id));
                option.legend.data = legend;
                option.xAxis.data = this.Dataformate(xAxis);
                option.yAxis.name = yName;
                option.series[0].name = legend[0];
                option.series[0].data = datas;
                myChart.setOption(option);
                window.onresize = myChart.resize;
            },
            gotoSchedule: function () {
                this.$router.push({"path": "/hippo/schedule"})
            },
            gotoAnalyze: function () {
                this.$router.push({"path": "/hippo/analyze"})
            },
            gotoAlarm: function () {
                this.$router.push({"path": "/hippo/alarm/list"})
            },
            //概览页任务告警根据数据画图
            drawing_alert: function (option, id, alarm_data) {
                var myChart = this.$echarts.init(document.getElementById(id));
                this.alarm_option.series[0].data = alarm_data;
                //使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                window.onresize = myChart.resize;
            },
        }
    }
</script>
<style lang="scss" scoped>
    .taskControl {
        padding: 10px;
    }

    .top {
        .header {
            height: 40px !important;
            line-height: 40px !important;
            background-color: #8cb6bc;
            box-shadow: 0px 12px 10px 0px rgba(6, 0, 1, 0.02);
            border-radius: 10px 10px 0px 1px;
            display: flex;
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
                margin-left: auto;
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
        .header {
            float: left;
            width: calc(100% - 20px);
            height: 40px !important;
            line-height: 40px !important;
            background-color: #ff9d6a;
            box-shadow: 0px 12px 10px 0px rgba(6, 0, 1, 0.02);
            border-radius: 10px 10px 0px 1px;
            display: flex;
        }
        .resource {
            background-color: #50bcbd;
        }
        .node {
            background-color: #fecc4c;
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
            margin-left: auto;
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
                // background-color: #ff9d6a;
                border: none;
                padding: 0px;
            }
        }
        .nodeDetail {
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
                // background-color: #fecc4c;
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
        width: 50%;
        margin-bottom: 20px;
        .header {
            height: 40px !important;
            line-height: 40px !important;
            background-color: #8fbcd8;
            box-shadow: 0px 12px 10px 0px rgba(6, 0, 1, 0.02);
            border-radius: 10px 10px 0px 1px;
            display: flex;
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
            margin-left: auto;
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
</style>


