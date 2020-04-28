<template>
    <div class="quality">
        <ve-histogram
                :data="chartData"
                :extend="chartExtend"
                height="3rem"
                width="6rem"
                ref="quality"
                :settings="chartSettings">
        </ve-histogram>
    </div>
</template>
<script>
    export default {
        data() {
            return {
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
                chartSettings: {
                    // showLine: ['数据']
                },
                chartData: {
                    columns: ['日期', '数据'],
                    rows: [
                        {'日期': '1月', '数据': 1393},
                        {'日期': '2月', '数据': 3530},
                        {'日期': '3月', '数据': 2923},
                        {'日期': '4月', '数据': 1723},
                        {'日期': '5月', '数据': 3792},
                        {'日期': '6月', '数据': 4593},
                        {'日期': '7月', '数据': 1393},
                        {'日期': '8月', '数据': 3530},
                        {'日期': '9月', '数据': 2923},
                        {'日期': '10月', '数据': 1723},
                        {'日期': '11月', '数据': 3792},
                        {'日期': '12月', '数据': 4593}
                    ]
                }
            }
        },
        mounted() {
            this.$nextTick(_ => {
                this.$refs[`quality`].echarts.resize()
            })
        }
    }
</script>
<style lang="scss" scoped>
    .quality {
        $fontSize: 100px;
        position: absolute;
        right: 30px / $fontSize + rem;
        top: 530px / $fontSize + rem;
        width: 600px / $fontSize + rem;
        height: 295px / $fontSize + rem;
        color: #afd3ec;
        .ve-histogram {
            canvas {
                height: 295px / $fontSize + rem !important;
            }
        }
    }
</style>
