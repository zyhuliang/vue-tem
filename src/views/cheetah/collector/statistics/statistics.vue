<template>
    <section >
        <div class="statisticsDialog" id="bm-ch-statistics-preview">
            <info-dialog
                title="统计"
                width="80%"
                :isShowBtn="false"
                :isShowDialog="isShowDialog"
                @closeDialog="closeDialog"
            >
                <ve-line
                    :data="chartData"
                    :settings="chartSettings"
                    :extend="extend"
                    :data-zoom="dataZoom"
                >
                </ve-line>
            </info-dialog>
        </div>
    </section>
</template>

<script>
    import infoDialog from '@components/infoDialog/dialog'
    import {getTaskExecuteMeterLog,getTasksStatus } from '@api'
    export default {
        components: {
            infoDialog
        },
        data() {
            return {
                params: {},
                timer: null,
                extend: {
                    series: {
                        label: {
                            normal: {
                                position: "top",
                                show: true
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        scale: true, //脱离0的束缚
                        axisLabel: {
                            formatter: '{value}',
                        },
                    },
                },
                dataZoom: [
                    {
                    type: 'slider',
                    start: 0,
                    end: 100
                    }
                ],
                chartSettings: {
                    showLine: ['mean'],
                    axisSite: { right: ['mean'] },
                    // yAxisType: ['normal', 'normal'],
                    yAxisName: ['记录数', '条/秒']
                },
                isShowDialog: false,
                chartData: {
                    columns: ['time', 'total', 'mean'],
                    rows: []
                }
            }
        },
        methods: {
            showStatisticsDialog (row) {
                // 查询 任务的状态， 根据状态  是否轮询接口
                getTasksStatus().then((res)=>{
                    if (res.status !== 1) {
                        this.params = {
                            id: row.id,
                            end: -1,
                            start: -1,
                            desc: true,
                            limit: 100
                        }
                        // 请求任务 数据量 和 速率
                        this.getTaskExecuteMeterLogs()
                       
                    }else {
                        // 先请求一次
                        this.params = {
                                id: row.id,
                                end: parseInt(new Date().getTime() / 1000 - 10 * 60),
                                start: -1,
                                desc: true,
                                limit: 10
                        }
                        this.getTaskExecuteMeterLogs()

                        this.timer = setInterval(() => {
                            this.params = {
                                id: row.id,
                                end: parseInt(new Date().getTime() / 1000 - 10 * 60),
                                start: -1,
                                desc: true,
                                limit: 1
                            }
                            this.getTaskExecuteMeterLogs()
                        }, 10000)
                    }
                },err =>{
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
                
                this.isShowDialog = true
            },
            closeDialog () {
                this.isShowDialog = false
            },
            getTaskExecuteMeterLogs () {
                getTaskExecuteMeterLog(this.params).then((res)=>{
                    if (this.chartData.rows.length > 10) {
                        this.chartData.rows.shift();
                    }
                    this.chartData.rows.push(...res.list)
                },err =>{
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            }
        },
        mounted () {
        },
        beforeDestroy(){
            clearInterval(this.timer);
        },
    }
</script>

<style lang="scss" scoped>

</style>