<template>
    <div class="distribution">
        <ve-ring
                :data="chartData"
                :settings="chartSettings"
                height="2.53rem"
                width="5.4rem"
                ref="distribution"
                :legend-visible="false">
        </ve-ring>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                chartSettings: {
                    dimension: '名称',
                    metrics: '访问用户',
                    radius: [20 * document.documentElement.clientWidth / 1920, 60 * document.documentElement.clientWidth / 1920],
                    offsetY: 135 * document.documentElement.clientWidth / 1920,
                    itemStyle: {}
                },
                chartData: {
                    columns: ['名称', '访问用户'],
                    rows: [
                        {'名称': '电力', '访问用户': 1393},
                        {'名称': '实时状态', '访问用户': 3530},
                        {'名称': '报警数据', '访问用户': 2923},
                        {'名称': '时间数据', '访问用户': 1723}
                    ]
                }
            }
        },
        mounted() {
            this.$nextTick(_ => {
                this.$refs[`distribution`].echarts.resize()
            })
        }
    }
</script>
<style lang="scss" scoped>
    .distribution {
        $fontSize: 100px;
        position: absolute;
        right: 30px / $fontSize + rem;
        top: 15px / $fontSize + rem;
        width: 540px / $fontSize + rem;
        height: 253px / $fontSize + rem;
        background: url('~@assets/visualization/distribution.png') no-repeat;
        background-size: 100%;
        b {
            font-weight: normal;
        }
    }
</style>
