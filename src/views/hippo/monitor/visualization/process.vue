<template>
    <div class="process" @click="jumpTaskControl">
        <div class="count">
            流程总数
            <span>{{ total }}<b>个</b></span>
        </div>
        <ve-ring
                :data="chartData"
                :settings="chartSettings"
                width="4rem"
                ref="process"
                height="2.15rem"
                :legend-visible="false"
        ></ve-ring>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                total: 0,
                resize: document.documentElement.clientWidth / 1920,
                chartSettings: {
                    dimension: '名称',
                    metrics: '访问用户',
                    radius: [10 * document.documentElement.clientWidth / 1920, 40 * document.documentElement.clientWidth / 1920],
                    offsetY: 50 * document.documentElement.clientWidth / 1920,
                    legendVisible: false,
                },
                chartData: {
                    columns: ['名称', '访问用户'],
                    rows: []
                }
            }
        },
        async created () {
            this.serverApi({
                interface: 'statisticsTaskinfo',
                success: (response) => {
                    this.total = response.total
                    this.$set(this.chartData, 'rows', [
                        {'名称': '成功率', '访问用户': response.succeeded},
                        {'名称': '失败率', '访问用户': response.failed},
                    ])
                }
            })
        },
        methods: {
            jumpTaskControl () {
                this.$router.push({
                    name: '任务监控'
                })
            }
        },
        mounted() {
            this.$nextTick(_ => {
                this.$refs[`process`].echarts.resize()
            })
        }
    }
</script>
<style lang="scss" scoped>
    .process {
        cursor: pointer;
        $fontSize: 100px;
        position: absolute;
        right: 30px / $fontSize + rem;
        top: 280px / $fontSize + rem;
        width: 400px / $fontSize + rem;
        height: 215px / $fontSize + rem;
        background: url('~@assets/visualization/process.png') no-repeat;
        background-size: 100%;
        padding-left: 40px / $fontSize + rem;
        b {
            font-weight: normal;
        }
        .count {
            position: relative;
            font-size: 16px / $fontSize + rem;
            color: #afd3ec;
            left: 44px / $fontSize + rem;
            top: 40px / $fontSize + rem;
            span {
                display: block;
                font-size: 26px / $fontSize + rem;
                color: #0fffed;
            }
            b {
                font-size: 16px / $fontSize + rem;
                color: #afd3ec;
            }
        }
    }
</style>
