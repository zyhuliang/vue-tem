<template>
    <div class="center">
       <div class="main">
           <div class="step1">
               <ul>
                    <li 
                        v-for="(item, index) in instances[0].instances"
                        :key="index"
                       :style="{
                           marginTop: (stepMap[instances[0].instances.length]+ (index * 40)) / 100 + 'rem'
                        }"
                        :class="item.status === 'UP' ? 'spot' : 'downspot'"
                        @click="detail(item, 0, $event)"
                    >
                        <el-popover
                            placement="top-start"
                            title="服务"
                            width="200"
                            trigger="hover"
                            :content="item.uri">
                            <div class="temp"  slot="reference"></div>
                        </el-popover>
                        <b>{{ item.appName }}</b>
                    </li>
               </ul>
           </div>
           <div class="step2">
               <ul>
                    <li
                        v-for="(item, index) in instances[1].instances"
                        :key="index"
                       :style="{marginTop: (stepMap[instances[1].instances.length]+ (index * 40)) / 100 + 'rem'}"
                       :class="item.status === 'UP' ? 'spot' : 'downspot'"
                        @click="detail(item, 1,  $event)"
                    >
                        <el-popover
                            placement="top-start"
                            title="服务"
                            width="200"
                            trigger="hover"
                            :content="item.uri">
                            <div class="temp"  slot="reference"></div>
                        </el-popover>
                        <b>{{ item.appName }}</b>
                        <div class="vertical"  v-if="instances[2].instances.length"></div>
                        <div class="line"  v-if="instances[2].instances.length"></div>
                    </li>
               </ul>
           </div>
            <div class="step3" v-if="instances[2].instances.length">
               <ul>
                    <li
                        v-for="(item, index) in instances[2].instances"
                        :key="index"
                        :style="{marginTop: (stepMap[instances[2].instances.length]+ (index * 40)) / 100 + 'rem'}"
                        :class="item.status === 'UP' ? 'spot' : 'downspot'"
                         @click="detail(item, 2, $event)"
                    >
                        <el-popover
                            placement="top-start"
                            title="服务"
                            width="200"
                            trigger="hover"
                            :content="item.uri">
                            <div class="temp"  slot="reference"></div>
                        </el-popover>
                        <b>{{ item.appName }}</b>
                    </li>
               </ul>
           </div>
       </div>
        <div class="dialog" v-if="isShowDialog">
            <i class="el-icon-close" @click="closeDialog"></i>
            <div class="box">
                <trend class="center-trend"  @data="logsClusterSpot" :request="spot" title="总任务量" :paths="''" :columns="['time_format', 'running', 'waiting' ]"/>
                <div class="wrap">
                    <div v-for="item in ArrUrl" :key="item" class="wrap-item">
                        <trend  @data="logsClusterRequest" :request="request[item]" title="http负载" :paths="item" :columns="['key_as_string', 'count']" />
                    </div>
                </div>
            </div>
        </div>
    </div> 
</template>
<script>
import { logsCluster } from '@api';
import infoDialog from '@components/infoDialog/dialog'
import trend from './centerDialog/trend.vue'
import { logsClusterRequest ,logsClusterSpot, actuatorHealth} from '@api';
export default {
    components: {
        infoDialog,
        trend,
    },
     data () {
        return {
            interface: '',
            spot: [],
            request: [],
            url: '',
            isShowDialog: false,
            step1:[1,2],
            stepMap: {
                1: 135,
                2: 115,
                3: 95,
                4: 75,
                5: 55,
                6: 35,
                7: 15,
            },
            step2:[1,2],
            step3:[1,2,3],
            instancesCopy: [],
            instances: [{
                instances: []
            },{
                instances: []
            },{
                instances: []
            }]
        }
    },
    methods: {
        closeDialog () {
            this.isShowDialog = false
        },
        // 点击方框事件
        detail (item, index, event) {
            this.url = []
            this.ArrUrl = []
            for (let value of this.instancesCopy[index].instances)  {
                this.url.push(value.uri)
                this.ArrUrl.push(value.uri)
            }

            this.url = this.url.toString()
            var parent = $(event.target).parent().parent()
            parent.addClass("toggleClass")
            this.interface = item.appName.toLowerCase()
            this.jump(this.interface)
            // 判断是否跳转
            setTimeout(function () {
                parent.removeClass("toggleClass")
            }, 50)
        },
        // 判断是否跳转，跳转到什么地方
        jump (appName) {
            if (appName === 'platform' || appName === 'pipeline' || appName === 'df-executor') {
                this.isShowDialog = true
            } else if (appName === 'woven-app') {
                return false
            }else if (appName === 'script-executor') {
                return false
            }else if (appName === 'woven-gateway') {
                this.$router.push({
                    name: '访问监控'
                })
            }
        },
        // 拷贝 数组对象
        deepCopy (o) {
            if (o instanceof Array) {
                let n = [];
                for (let i = 0; i < o.length; ++i) {
                    n[i] = this.deepCopy(o[i]);
                }
                return n;

            } else if (o instanceof Object) {
                let n = {};
                for (let i in o) {
                    n[i] = this.deepCopy(o[i]);
                }
                return n;
            } else {
                return o;
            }
        },
        // 列表请求
        logsCluster () {
            var that = this
            logsCluster().then(data => {
                this.instancesCopy = this.deepCopy(data)
                that.instances = data
                this.actuatorHealth()
                for (let item of that.instances) {
                    if (item.name === 'WOVEN-APP' || item.name === 'WOVEN-GATEWAY') {
                        that.instances[0].instances.push(...item.instances)
                    }
                    if (item.name === 'MySQL') {
                        return false
                    }
                    if (item.name === 'SCRIPT-EXECUTOR') {
                        that.instances[2].instances.push(...item.instances)
                    }
                }
            }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }
            )
        },
        logsClusterRequest (params) {
            params.uri = this.url
            logsClusterRequest(params).then(data => {
                this.request = data
            }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }
            )
        },
        logsClusterSpot (params) {
            params.interface = this.interface
            params.uri = this.url
            logsClusterSpot(params).then(data => {
                this.spot = data.content
            }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }
            )
        },
        // 请求sql数据
        actuatorHealth () {
            actuatorHealth().then(data => {
                this.instances[1].instances.push({
                    appName: data.details.database,
                    status: data.status
                })
            }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }
            )
        }
    },
    created () {
        this.logsCluster()
    }
}
</script>
<style lang="scss" scoped>
.center{
    $fontSize:100px;
    position: absolute;
    left: 390px / $fontSize + rem;
    top: 44px / $fontSize + rem;
    width: 1120px / $fontSize + rem;
    height: 615px / $fontSize + rem;
    .center-trend{
        margin-top: 50px / $fontSize + rem;
    }
    .box{
        overflow-y: scroll;
        margin-bottom: 40px / $fontSize + rem;
    }
    .wrap {
        display: flex;
        width: 80%;
        margin: 0 auto;
        flex-wrap: wrap ;
        height: 615px / $fontSize + rem;
    }
    .wrap-item {
        width: 50%;
    }
    .dialog{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: #000;
        z-index: 3000;
        .el-icon-close{
            cursor: pointer;
            position: fixed;
            top: 40px / $fontSize + rem;
            right: 40px / $fontSize + rem;
            color: #fff;
            z-index: 3001;
            font-size: 30px / $fontSize + rem
        }
    }
    .spot{
        background:url('~@assets/visualization/spot.png') no-repeat;
    }
    .downspot{
        background:url('~@assets/visualization/downspot.png') no-repeat;
    }
    .main{
        width: 1120px / $fontSize + rem;
        height: 615px / $fontSize + rem;
        position: relative;
        left: 70px;
        li {
            position: relative;
            .temp{
                position: absolute;
                width: 76px / $fontSize + rem;
                height: 76px / $fontSize + rem;
                z-index: 99999;
                top:0;
                background:url('~@assets/visualization/spot-temp.gif') no-repeat;
            }
            b{
                display: block;
                position: absolute;
                font-size: 12px / $fontSize + rem;
                left: 35px / $fontSize + rem;
                top: -8px / $fontSize + rem;
                transform: rotate(20deg) skew(21deg,6deg);
                color: #fff;
            }
        }
        .step1{
            position: absolute;
            left: -8px / $fontSize + rem;
            bottom: 4px / $fontSize + rem;
            width: 703px / $fontSize + rem;
            height: 374px / $fontSize + rem;
            background:url('~@assets/visualization/step1.png');
            background-size: 100%;
            ul{
                display: flex;
                justify-content:center;
                li{
                    z-index: 105;
                    cursor: pointer;
                    width: 76px / $fontSize + rem;
                    height: 76px / $fontSize + rem;
                    margin: 0 5px / $fontSize + rem;
                    background-size: 100%;
                    &::after{
                        content: '';
                        display: block;
                        width: 1px;
                        height: 53px / $fontSize + rem;
                        background: #41b6ef;
                        transform: rotate(65deg);
                        position: relative;
                        left: 96px / $fontSize + rem;
                        top: -97px / $fontSize + rem;
                        z-index: 1000;
                    }
                    &:before{
                        content: '';
                        display: block;
                        width: 1px;
                        height: 95px / $fontSize + rem;
                        background: #41b6ef;
                        transform: rotate(115deg);
                        position: relative;
                        left: 163px / $fontSize + rem;
                        top: -15px / $fontSize + rem;
                        z-index: 1002;
                    }
                    &:last-child:before{
                        background:transparent;
                    }
                }
            }
            &.toggleClass{
                z-index: 10000;
                background:url('~@assets/visualization/step2.png');
            }
        }
        .step2{
            position: absolute;
            left: 121px / $fontSize + rem;
            bottom: 72px / $fontSize + rem;
            width: 703px / $fontSize + rem;
            height: 374px / $fontSize + rem;
            background:url('~@assets/visualization/step1.png');
            background-size: 100%;
            ul{
                display: flex;
                justify-content:center;
                li{
                    cursor: pointer;
                    width: 76px / $fontSize + rem;
                    height: 76px / $fontSize + rem;
                    margin: 0 5px / $fontSize + rem;
                    background-size: 100%;
                    position: relative;
                    z-index: 105;
                    &::after{
                        content: '';
                        display: block;
                        width: 1px;
                        height: 31px / $fontSize + rem;
                        background: #41b6ef;
                        transform: rotate(65deg);
                        position: absolute;
                        left: 5px / $fontSize + rem;
                        top: 59px / $fontSize + rem;
                        z-index: 1000;
                    }
                    &:before{
                        content: '';
                        display: block;
                        width: 1px;
                        height: 95px / $fontSize + rem;
                        background: #41b6ef;
                        transform: rotate(115deg);
                        position: absolute;
                        left: 36px / $fontSize + rem;
                        top: 54px / $fontSize + rem;
                        z-index: 1002;
                    }
                    .vertical{
                        content: '';
                        display: block;
                        width: 1px;
                        height: 95px / $fontSize + rem;
                        background: #41b6ef;
                        transform: rotate(115deg);
                        position: absolute;
                        left: 161px / $fontSize + rem;
                        top: -11px / $fontSize + rem;
                        z-index: 1002;
                    }
                    .line{
                        content: '';
                        display: block;
                        width: 1px;
                        height: 53px / $fontSize + rem;
                        background: #41b6ef;
                        transform: rotate(65deg);
                        position: absolute;
                        left: 95px / $fontSize + rem;
                        top: 1px / $fontSize + rem;
                        z-index: 1000;
                    }
                    &:last-child:before{
                        background:transparent;
                    }
                    &:last-child{
                        .vertical{
                            background:transparent;
                        }
                    }
                }
            }
             &.toggleClass{
                z-index: 10000;
                background:url('~@assets/visualization/step2.png');
            }
        }
        
        .step3{
            position: absolute;
            left: 248px / $fontSize + rem;
            bottom: 136px / $fontSize + rem;
            width: 703px / $fontSize + rem;
            height: 374px / $fontSize + rem;
            background:url('~@assets/visualization/step1.png');
            background-size: 100%;
            ul{
                display: flex;
                justify-content:center;
                li{
                    z-index: 105;
                    cursor: pointer;
                    width: 76px / $fontSize + rem;
                    height: 76px / $fontSize + rem;
                    margin: 0 5px / $fontSize + rem;
                    background-size: 100%;
                    position: relative;
                    &::after{
                        content: '';
                        display: block;
                        width: 1px;
                        height: 31px / $fontSize + rem;
                        background: #41b6ef;
                        transform: rotate(65deg);
                        position: absolute;
                        left: 5px / $fontSize + rem;
                        top: 59px / $fontSize + rem;
                        z-index: 1000;
                    }
                    &:before{
                        content: '';
                        display: block;
                        width: 1px;
                        height: 95px / $fontSize + rem;
                        background: #41b6ef;
                        transform: rotate(115deg);
                        position: absolute;
                        left: 36px / $fontSize + rem;
                        top: 54px / $fontSize + rem;
                        z-index: 1002;
                    }
                    &:last-child:before{
                        background:transparent;
                    }
                    &:last-child{
                        .vertical{
                            background:transparent;
                        }
                    }
                }
            }
             &.toggleClass{
                z-index: 10000;
                background:url('~@assets/visualization/step2.png');
            }
        }
    }
}
</style>
