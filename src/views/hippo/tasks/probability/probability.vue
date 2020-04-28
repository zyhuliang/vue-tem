<template>
    <div class="probaility" id="bm-hippo-task-probability">
        <div>
            <el-date-picker
                    id="bm-hippo-task-probability-timepicker"
                    v-model="dateValue"
                    type="daterange"
                    @change="handledateValue"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <el-input id="bm-hippo-task-probability-searchInput" placeholder="请输入历史执行任务名称或流程名称检索词" v-model="searchInput"
                      @keyup.enter.native="searchKeyup" class="input-with-search">
                <el-button id="bm-hippo-task-probability-searchTable" slot="append" @click="searchTable"
                           icon="icon iconfont icon-ir-search"></el-button>
            </el-input>
            <div class="one-column">
                 <span class="flowtype">
                    流程类型：
                    <el-select id="bm-hippo-task-probability-flowType" v-model="flowType" placeholder="all"
                               @change="flowTypeValue">
                        <el-option
                                id="bm-hippo-task-probability-flowTypeValue"
                                v-for="item in options"
                                :key="item.value"
                                :label="item.value| cn"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </span>
            </div>
        </div>
        <div id="taskprobablility_id" style="width:90%;height: 450px;top: 75px"></div>
    </div>
</template>
<script>
    import {
        createParameter,
        queryObject
    } from "@components/function/queryParameter";

    var parameter = queryObject();
    import {executeList} from "@api";

    export default {
        data() {
            return {
                startTime: false,
                endTime: false,
                days: [],
                schedules: [],
                weeks: this.getWeek(),
                dateValue: "",
                searchInput: "",
                flowType: "all",
                options: [
                    {
                        value: "all",
                        label: "all"
                    },
                    {
                        value: "dataflow",
                        label: "批处理"
                    },
                    {
                        value: "workflow",
                        label: "工作流"
                    },{
                        value: 'streaming',
                        label: 'streaming'
                    }
                ],
                taskprobability_option: {
                    title: {
                        text: "任务执行情况统计",
                        subtext: "",
                        x: "center"
                    },
                    color: ["#32CD32", "#BB0000", "#641152"],
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: "vertical",
                        left: "left",
                        data: ["成功", "失败", "杀死"]
                    },
                    series: [
                        {
                            name: "运行情况",
                            type: "pie",
                            radius: "55%",
                            center: ["50%", "60%"],
                            data: [],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                }
            };
        },
        methods: {
            handledateValue: function (val) {
                var parameter = this.buildParameters();
                this.jobanalysis(parameter);
            },
            //查询
            searchTable: function () {
                var parameter = this.buildParameters();
                this.jobanalysis(parameter);
            },
            //监听查询回车事件
            searchKeyup: function () {
            },
            //flow类型选择
            flowTypeValue: function (val) {
                var parameter = this.buildParameters();
                this.jobanalysis(parameter);
            },
            getProbabilityData(result) {
                var SUCCESS = 0;
                var FAILED = 0;
                var KILLED = 0;
                for (let str in result.facetContent) {
                    if (result.facetContent[str].facet === "SUCCEEDED") {
                        SUCCESS = result.facetContent[str].count;
                    } else if (result.facetContent[str].facet === "FAILED") {
                        FAILED = result.facetContent[str].count;
                    } else if (result.facetContent[str].facet === "KILLED") {
                        KILLED = result.facetContent[str].count;
                    }
                }
                var data = [
                    {name: "成功", value: SUCCESS},
                    {name: "失败", value: FAILED},
                    {name: "杀死", value: KILLED}
                ];
                return data;
            },
            drawing_taskprobability(option, id, datas) {
                var myChart = this.$echarts.init(document.getElementById(id));
                option.series[0].data = datas;
                //使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                window.onresize = myChart.resize;
            },
            jobanalysis: function jobanalysis(parameter) {
                executeList(parameter).then(data => {
                        let relust = this.getProbabilityData(data);
                        this.drawing_taskprobability(
                            this.taskprobability_option,
                            "taskprobablility_id",
                            relust
                        );
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
                );
            },
            buildParameters: function () {
                var parameter = createParameter()
                    .GroupBy(this.groupType)
                    .Build();
                if (this.flowType != "all") {
                    parameter = createParameter("flowType", this.flowType, "EQUAL").Build(
                        parameter
                    );
                }
                if (this.searchInput) {
                    parameter = createParameter(
                        "flowName",
                        this.searchInput,
                        "EQUAL"
                    ).Build(parameter);
                }
                if (this.dateValue != null) {
                    if (this.dateValue.length > 0) {
                        parameter = createParameter(
                            "createTime",
                            new Date(this.dateValue[0]).getTime(),
                            "GREATER_THAN"
                        )
                            .And(
                                "createTime",
                                new Date(this.dateValue[1]).getTime(),
                                "LESS_THAN"
                            )
                            .Build(parameter);
                        this.days = this.getAll(
                            this.dateValue[0],
                            this.dateValue[1]
                        );
                    } else {
                        parameter = createParameter(
                            "createTime",
                            new Date(this.weeks[0]).getTime(), "GREATER_THAN")
                            .And("createTime", new Date(this.weeks[7]).getTime(), "LESS_THAN")
                            .Build(parameter);
                        this.days = this.getAll(this.weeks[0], this.weeks[7]);
                    }
                } else {
                    parameter = createParameter(
                        "createTime",
                        new Date(this.weeks[0]).getTime(), "GREATER_THAN")
                        .And("createTime", new Date(this.weeks[7]).getTime(), "LESS_THAN")
                        .Build(parameter);
                    this.days = this.getAll(this.weeks[0], this.weeks[7]);
                }

                return parameter;
            }
        },
        mounted() {
            this.days = this.getAll(this.weeks[0], this.weeks[7]);
            var parameter = createParameter(
                "createTime",
                new Date(this.weeks[0]).getTime(),
                "GREATER_THAN"
            )
                .And("createTime", new Date(this.weeks[7]).getTime(), "LESS_THAN")
                .Build();
            this.jobanalysis(parameter);
        }
    };
</script>
<style lang="scss" scoped>
    .one-column {
        padding-top: 5px;
        float: left;
    }
</style>