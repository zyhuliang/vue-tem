<template>
    <div id="log" ref="timeline" >
        <div class="timeline">
            <div class="timeline-row" v-for="(item,index) in dataList" :key="index">
                <div class="timeline-time">
                    <span>{{ item.time | formatDate }} </span>
                </div>
                <div class="timeline-img">
                    <avatar style="border-radius: 50%; " username="Info" :src="item.img" :size="60" ></avatar>
                </div>
                    <div class="timeline-content">
                        <div class="content-body">
                            <h2>{{ item.title }}</h2>
                            <!--<el-popover-->
                                    <!--placement="top-start"-->
                                    <!--title="errorLog详情"-->
                                    <!--width="800"-->
                                    <!--trigger="hover"-->
                                    <!--:content='item.contentTooltip'-->
                                    <!--v-if='!item.disabledTootip'>-->
                                <!--<el-button slot="reference" @click="viewDetails(item.contentTooltip)" >查看详情</el-button>-->
                            <!--</el-popover>-->
                            <el-button v-if='!item.disabledTootip || item.content.length>200' @click="viewDetails(item.contentTooltip)" >查看详情</el-button>
                            <div style="overflow: auto;" v-if='!item.disabledTootip || item.content.length>200'>
                                {{ item.content.substr(0,50)+'......' }}
                            </div>
                            <div style="overflow: auto;" v-else>
                                {{ item.content }}
                            </div>
                        </div>
                    </div>

            </div>
        </div>
        <!--log dialog-->
        <el-dialog
                :visible.sync="detailLogVisible"
                width="50%"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                title="查看日志"
        >
            <p>{{dialogContent}}</p>
            <span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="detailLogVisible = false">确 定</el-button>
		</span>
        </el-dialog>
    </div>
</template>

<script>
    import { parseTime } from './index'
    import Avatar from 'vue-avatar'
    export default {
        name: 'log-vue-timeline',
        components: {
            Avatar
        },
        data() {
            return {
                timeItemList:[
                    {
                        time: '1522372393000',
                        img: 'static/touxiang.jpeg',
                        title: 'log.com',
                        content: '这是衡钊清的个人博客',
                        disabledTootip: false,
                        contentTooltip:'',
                    }
                ],
                dialogContent:"",
                detailLogVisible : false,
            }
        },
        props: ['dataList', 'timelineColor', 'timeContentColor'],

        filters: {
            formatDate(time) {
                return parseTime(time, '{y}年{m}月{d} {h}:{i}')
            }
        },
        methods:{
            viewDetails: function (text) {
                this.detailLogVisible = true
                this.dialogContent = text
            }
        },
        mounted() {
            const timeline = this.$refs.timeline
            timeline.style.setProperty('--timelineColor', this.timelineColor)
            timeline.style.setProperty('--timeContentColor', this.timeContentColor)
        }
    }
</script>

<style lang="scss">
    #log{
        list-style: none;
        position: relative;
        padding: 20px;
        margin: 0 auto;
        background: var(--timelineColor);
        font-family: "微软雅黑", Arial, Helvetica, sans-serif;
        .timeline-row{
            padding-left: 50%;
            z-index: 10;
            position: relative;
            .timeline-time{
                position: absolute;
                right: 50%;
                text-align: right;
                margin-right: 60px;
                font-size: 17px;
                line-height: 35px;
                top: 40px;
            }
            .timeline-img{
                position: absolute;
                top: 30px;
                left: 49%;
                margin-left: -15px;
                width: 60px;
                height: 60px;
                text-align: center;
                overflow: hidden;
                padding: 3px;
                font-size: 14px;
                z-index: 100;
            }
            .timeline-content{
                position: relative;
                background: var(--timeContentColor);
                color: #333333;
                border-radius: 5px;
                margin-right: 0px;
                margin-left: 60px;
                margin-bottom: 20px;
                min-height: 80px;
                .content-body{
                    padding: 15px 15px 2px;
                    position: relative;
                    z-index: 10;
                    h2{
                        font-size: 20px;
                        margin-bottom: 12px;
                        margin-top: 0;
                        line-height: 15px;
                        font-weight: 600;
                    }
                    p{
                        margin: 0px 0px 15px;
                    }
                }
            }
            .timeline-content:after{
                content: "";
                position: absolute;
                top: 60px;
                left: -60px;
                height: 4px;
                width: 80px;
                background-color: rgba(0, 0, 0, 0.2);
                z-index: -1;
            }
        }
        .timeline-row:nth-child(odd){ // 奇数样式
            .timeline-time{
                right: auto;
                left: 50%;
                text-align: left;
                margin-right: 0;
                margin-left: 60px;
            }
            .timeline-content{
                margin-right: 60px;
                margin-left: 0px;
            }
            .timeline-content:after{
                left: auto;
                right: -60px;
            }
        }
        @media screen and (max-width:1200px){
            .timeline{
                .timeline-row {
                    position: relative;
                    right: auto;
                    top: 0;
                    margin: 0 0 6px 56px;
                    padding: 0;
                    margin-bottom: 16px;
                }
                .timeline-row:nth-child(odd){
                    padding-right: 0;
                    .timeline-content{
                        margin-right: 0px;
                        margin-left: 40px;
                    }
                    .timeline-time {
                        position: relative;
                        right: auto;
                        left: auto;
                        top: 0;
                        text-align: left;
                        margin: 0 0 0px 40px;
                    }
                }
                .timeline-img{
                    top: 40px;
                    left: -55px;
                    margin-left: 0;
                    padding: 0px;
                }
                .timeline-time {
                    position: relative;
                    right: auto;
                    left: auto;
                    top: 0;
                    text-align: left;
                    font-size: 15px;
                    margin: 0 0 0px 40px;
                }
                .timeline-content{
                    margin-left: 40px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    position: relative;
                }
                .timeline-content:after{
                    right: auto !important;
                    left: -65px !important;
                    top: 30px;
                }
            }
            .timeline:after{
                left: 50px;
            }

        }
    }

    .timeline:after{
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        background-color: rgba(0, 0, 0, 0.2);
        height: 100%;
        width: 4px;
        border-radius: 2px;
        margin-left: -2px;
        display: block;
    }

</style>
