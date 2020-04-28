<template>
    <div class="trend">
        <ve-line
                :data="chartData"
                :settings="chartSettings"
                height="3rem"
                width="6.5rem"
                :extend="chartExtend"
                ref="trend"
        ></ve-line>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                chartSettings: {
                    stack: {'用户': ['数据', '消息']},
                    area: true
                },
                chartExtend: {
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            margin: 30,
                            color: '#035688'
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: true,
                            length: 25,
                            lineStyle: {
                                color: "#131925"
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#131925'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        position: 'left',
                        axisLabel: {
                            margin: 30,
                            color: '#035688'
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: true,
                            length: 25,
                            lineStyle: {
                                color: "#131925"
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#131925'
                            }
                        }
                    },
                    grid: {
                        top: '25%',
                        left: '0%',
                        right: '10%',
                        bottom: '0%',
                        containLabel: true,
                    },
                    title: {
                        text: '数据趋势 ',    //标题
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#afd3ec'
                        },

                        x: "left"
                    },
                    legend: {
                        textStyle: {
                            color: '#82858a',
                            fontSize: 12
                        }
                    }
                },
                chartData: {
                    columns: ['日期', '数据', '消息', '文件'],
                    rows: [
                        {'日期': '1月', '数据': 1393, '消息': 1093, '文件': 0.32},
                        {'日期': '2月', '数据': 3530, '消息': 3230, '文件': 0.26},
                        {'日期': '3月', '数据': 2923, '消息': 2623, '文件': 0.76},
                        {'日期': '4月', '数据': 1723, '消息': 1423, '文件': 0.49},
                        {'日期': '5月', '数据': 3792, '消息': 3492, '文件': 0.323},
                        {'日期': '6月', '数据': 4593, '消息': 4293, '文件': 0.8},
                        {'日期': '7月', '数据': 1393, '消息': 1093, '文件': 0.32},
                        {'日期': '8月', '数据': 3530, '消息': 3230, '文件': 0.26},
                        {'日期': '9月', '数据': 2923, '消息': 2623, '文件': 0.76},
                        {'日期': '10月', '数据': 1723, '消息': 1423, '文件': 0.49},
                        {'日期': '11月', '数据': 3792, '消息': 3492, '文件': 0.323},
                        {'日期': '12月', '数据': 4593, '消息': 4293, '文件': 0.10}
                    ]
                }
            }
        },
        mounted() {
            this.$nextTick(_ => {
                this.$refs[`trend`].echarts.resize()
            })
        }
    }
</script>
<style lang="scss" scoped>
    .trend {
        $fontSize: 100px;
        position: absolute;
        left: 30px / $fontSize + rem;
        top: 530px / $fontSize + rem;
        width: 650px / $fontSize + rem;
        height: 295px / $fontSize + rem;
        color: #afd3ec;
        .ve-line {
            height: 350px / $fontSize + rem !important;
        }
    }
</style>
