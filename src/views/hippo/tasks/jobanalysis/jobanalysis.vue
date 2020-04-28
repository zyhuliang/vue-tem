<template>
    <div class="jobanalysis" id="bm-hippo-task-jobanalysis">
        <div class="wrapper-box">
            <el-date-picker
                    id="bm-hippo-task-jobanalysis-timepicker"
                    v-model="dateValue"
                    type="daterange"
                    @change="handledateValue"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <!-- <div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
            <div v-show="endTime" ref="endTime">{{dateValue[1]}}</div> -->
            <el-input id="bm-hippo-task-jobanalysis-searchInput" placeholder="请输入流程名称" v-model="searchInput"
                      @keyup.enter.native="searchKeyup" class="input-with-search">
                <el-button id="bm-hippo-task-jobanalysis-searchInput-value" slot="append" @click="searchTable"
                           icon="icon iconfont icon-ir-search"></el-button>
            </el-input>
            <div class="one-column">
                 <span class="flowtype">
                    流程类型：
                    <el-select id="bm-hippo-task-jobanalysis-flowType" v-model="flowType" placeholder="all"
                               @change="flowTypeValue">
                        <el-option
                                id="bm-hippo-task-jobanalysis-flowTypeValue"
                                v-for="item in options"
                                :key="item.value"
                                :label="item.value| cn"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </span>
                <span class="analyze-flowtype">
                    分组类型：
                    <el-select id="bm-hippo-task-jobanalysis-groupType" v-model="groupType" placeholder="day"
                               @change="groupTypeValue">
                        <el-option
                                id="bm-hippo-task-jobanalysis-groupTypeValue"
                                v-for="item in groupTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </span>
            </div>
        </div>

        <!-- 图形 -->
        <div id="jobanalysis_id" class="canvas"></div>
    </div>
</template>
<script>
    import {getTaskJobanalysis} from '@api';
    import {createParameter, queryObject} from "@components/function/queryParameter";

    var parameter = queryObject();
    export default {
        data() {
            return {
                startTime: false,
                endTime: false,
                days: [],
                schedules: [],
                weeks: this.getWeek(),
                dateValue: '',
                searchInput: '',
                flowType: 'all',
                options: [{
                    value: 'all',
                    label: '全部类型'
                }, {
                    value: 'dataflow',
                    label: '批处理'
                }, {
                    value: 'workflow',
                    label: '工作流'
                },{
                    value: 'streaming',
                    label: 'streaming'
                }],
                groupTypeOptions: [{
                    value: 'day',
                    label: '按天'
                }, {
                    value: 'hour',
                    label: '按小时'
                }],
                groupType: "day",
                // 趋势图 基本数据
                jobanalysis_option: {
                    title: {
                        text: '',
                        //subtext: '测试'
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
                        data: ['5月1日', '5月2日', '5月3日', '5月4日', '5月5日', '5月6日', '5月7日']
                    },
                    yAxis: {
                        type: 'value',
                        name: '',
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            xAxisIndex: 0,
                            filterMode: 'empty'
                        },
                        {
                            type: 'inside',
                            xAxisIndex: 0,
                            filterMode: 'empty'
                        }
                    ],
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
                }
            }
        },
        methods: {
            handledateValue: function (val) {
                if (val == null) {
                    this.dateValue = [];
                } else {
                    this.dateValue = [val[0], val[1] + 86399000];
                }
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //查询
            searchTable: function () {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup: function () {
                this.searchTable(parameter);
            },
            //flow类型选择
            flowTypeValue: function (val) {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            groupTypeValue: function (val) {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            buildParameters: function () {
                var parameter = createParameter().GroupBy(this.groupType).Build();
                if (this.flowType != "all") {
                    parameter = createParameter('flowType', this.flowType, 'EQUAL').Build(parameter);
                }
                if (this.searchInput) {
                    parameter = createParameter('flowName', this.searchInput, 'EQUAL').Build(parameter);
                }
                if (this.dateValue.length > 0) {
                    parameter = createParameter('createTime', new Date(this.dateValue[0]).getTime(), 'GREATER_THAN')
                        .And('createTime', new Date(this.dateValue[1].slice(0, 10)).getTime(), 'LESS_THAN').Build(parameter);
                    this.days = this.getAll(this.dateValue[0], this.dateValue[1].slice(0, 10));
                } else {
                    parameter = createParameter('createTime', new Date(this.weeks[0]).getTime(), 'GREATER_THAN')
                        .And('createTime', new Date(this.weeks[7]).getTime(), 'LESS_THAN').Build(parameter);
                    this.days = this.getAll(this.weeks[0], this.weeks[7]);
                }
                if (this.groupType == 'hour') {
                    this.days = this.getHours(this.days);
                }
                return parameter
            },
            listTable: function listTable(parameter) {
                getTaskJobanalysis(parameter).then(data => {
                        this.schedules = this.InitializeData(this.days.length);
                        this.schedules = this.getTaskHistoryData(this.days, data.sort(this.byField("name")), this.schedules);
                        var legend = ['趋势分析'];
                        this.drawing_jobanalysis(this.jobanalysis_option, 'jobanalysis_id', this.days, legend, this.schedules);
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
            drawing_jobanalysis: function (option, id, xAxis, legend, datas, yName) {
                var myChart = this.$echarts.init(document.getElementById(id));
                option.legend.data = legend;
                option.xAxis.data = this.Dataformate(xAxis);
                option.yAxis.name = yName;
                option.series[0].name = legend[0];
                option.series[0].data = datas;
                myChart.setOption(option);
                window.onresize = myChart.resize;
            }
        },
        mounted() {
            this.days = this.getAll(this.weeks[0], this.weeks[7]);
            var parameter = createParameter('createTime', new Date(this.weeks[0]).getTime(), 'GREATER_THAN')
                .And('createTime', new Date(this.weeks[7]).getTime(), 'LESS_THAN')
                .GroupBy('day')
                .Build();
            this.listTable(parameter);
        }
    }
</script>
<style lang="scss" scoped>
    .one-column {
        padding-top: 5px;
        float: left;
    }

    .canvas {
        float: left;
        width: 100%;
        height: 500px;
        margin: 50px auto;
        background-color: white;
        border: 1px solid #dcdfe6;
    }
</style>