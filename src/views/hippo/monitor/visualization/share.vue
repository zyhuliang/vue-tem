<template>
    <div class="share">
        <ul>
            <li @click="jumpVisit">
                <div class="img"><img src="~@assets/visualization/inc-column.png" alt=""></div>
                <p>
                    <span>{{requestIncrease.count}}</span>
                    <b>次</b>
                    <em>访问接口</em>
                </p>
                <div class="decline" v-if="requestIncrease.ratio < 0"><img src="~@assets/visualization/decline.png" alt=""></div>
                <div class="increase" v-else><img src="~@assets/visualization/increase.png" alt=""></div>
                <span class="young">{{ requestIncrease.ratio < 0 ? -requestIncrease.ratio : requestIncrease.ratio}}%</span>
            </li>
            <li>
                <div class="img"><img src="~@assets/visualization/dec-column.png" alt=""></div>
                <p>
                    <span>48000</span>
                    <b>条</b>
                    <em>数据交换</em>
                </p>
                <div class="decline" v-if="requestIncrease.ratio < 0"><img src="~@assets/visualization/decline.png" alt=""></div>
                <div class="increase" v-else><img src="~@assets/visualization/increase.png" alt=""></div>
                <span class="yellow">20%</span>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                requestIncrease: {}
            }
        },
        created () {
            this.serverApi({
                interface: 'requestIncrease',
                success: (response) => {
                    this.requestIncrease = response.requestCount
                }
            })
        },
        methods: {
            jumpVisit () {
                this.$router.push({
                    name: '访问监控'
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .share {
        $fontSize: 100px;
        position: absolute;
        left: 30px / $fontSize + rem;
        top: 280px / $fontSize + rem;
        width: 400px / $fontSize + rem;
        height: 215px / $fontSize + rem;
        background: url('~@assets/visualization/share.png') no-repeat;
        background-size: 100%;
        color: #afd3ec;
        b {
            font-weight: normal;
        }
        ul {
            width: 280px / $fontSize + rem;
            padding: 20px / $fontSize + rem 0 0 12px / $fontSize + rem;
            li {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: url('~@assets/visualization/share-list-bg.png') no-repeat;
                background-size: 100%;
                margin-top: 15px / $fontSize + rem;
                padding-left: 20px / $fontSize + rem;
                .img img {
                    width: 48px / $fontSize + rem;
                    height: 27px / $fontSize + rem;
                }
                p {
                    span {
                        color: #0fffed;
                        font-size: 26px / $fontSize + rem;
                    }
                    em {
                        display: block;
                    }
                }
                .young {
                    color: #0fffed;
                }
                .yellow {
                    color: #bfaf3b;
                }
            }
        }
    }
</style>
