<template>
    <div class="dataResources">
        <ul>
            <li>
                <div class="img"><img src="~@assets/visualization/system.png" alt=""></div>
                <p>
                    <b>系统数据源</b>
                    <span>{{datasource.dssCount}}</span><em>个</em>
                </p>
            </li>
            <li>
                <div class="img"><img src="~@assets/visualization/original.png" alt=""></div>
                <p>
                    <b>元数据集</b>
                    <span>{{datasource.schemaCount}}</span><em>个</em>
                </p>
            </li>
            <li>
                <div class="img"><img src="~@assets/visualization/dataSet.png" alt=""></div>
                <p>
                    <b>主数据集</b>
                    <span>{{ datasource.datasetCount  }}</span><em>个</em>
                </p>
            </li>
            <li>
                <div class="img"><img src="~@assets/visualization/capacity.png" alt=""></div>
                <p>
                    <b>数据资源容量</b>
                    <span>{{datasource.dfsUsed.amount}}</span><em>{{datasource.dfsUsed.unit}}</em>
                </p>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                datasource: {}
            }
        },
        created () {
            this.serverApi({
                interface: 'statisticsDatasource',
                success: (response) => {
                    this.datasource = response
                }
            })
        }
    }
</script>
<style lang="scss" scoped>
    .dataResources {
        $fontSize: 100px;
        position: absolute;
        left: 30px / $fontSize + rem;
        top: 15px / $fontSize + rem;
        width: 540px / $fontSize + rem;
        height: 253px / $fontSize + rem;
        background: url('~@assets/visualization/dataResources.png') no-repeat;
        background-size: 100%;
        b {
            font-weight: normal;
        }
        ul {
            width: 360px / $fontSize + rem;
            display: flex;
            flex-wrap: wrap;
            margin: 50px / $fontSize + rem 0 0 40px / $fontSize + rem;
            li {
                color: #afd3ec;
                width: 180px / $fontSize + rem;
                display: flex;
                margin-top: 15px / $fontSize + rem;
                .img img {
                    width: 46px / $fontSize + rem;
                    height: 46px / $fontSize + rem;
                    margin-right: 10px / $fontSize + rem;
                }
                b {
                    display: block;
                    font-size: 14px / $fontSize + rem;
                }
                span {
                    color: #0fffed;
                    font-size: 26px / $fontSize + rem;
                }
                em {
                    color: #0fffed;
                }
            }
        }
    }
</style>
