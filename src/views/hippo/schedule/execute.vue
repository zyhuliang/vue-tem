<template>
    <div class="execute">
        <operationPanel>
            <div class="search" slot="left">
                <info-from  :config="config" :modelData="parameter"/>
            </div>
            <div slot="right" class="operationListBtn">
                <el-button type="text" icon="el-icon-search" @click="details">详情</el-button>
            </div>
        </operationPanel>
         <heatmap ref="heatmap"></heatmap>
    </div>
</template>>
<script>
import operationPanel from "@components/layout/operationPanel";
import infoFrom from "@components/infoFrom/infoFrom";
import {executeStatistics} from '@api';
import {createParameter} from '@components/function/queryParameter.js';
import heatmap from './heatmap'
import moment from "moment"//时间格式化
export default {
    components: {
        operationPanel,
        infoFrom,
        heatmap
    },
    data () {
      return {
        parameter: {
            startDate: '',
            endDate: '',
            flowType: 'all',
        }, // 分页请求数据
        config: {
            ref: "ruleForm",
            size: "small",
            lableWidth: "80px",
            inline: true,
            rule: [
                {
                    label: "时间",
                    type: "infoDatePicker",
                    valueFormat: 'timestamp',
                    model: 'startDate, endDate',
                    methods: val => {
                        this.parameter.startDate = val[0]
                        this.parameter.endDate = val[1]
                        this.listTable()
                    }
                },
                {
                    label: "类型",
                    type: "infoSelect",
                    model: "flowType",
                    methods: val => {
                        this.parameter.flowType = val
                        this.listTable()
                    },
                    options: [{
                        value: 'all',
                        label: '全部类型'
                    }, {
                        value: 'dataflow',
                        label: 'dataflow'
                    }, {
                        value: 'workflow',
                        label: 'workflow'
                    }, {
                        value: 'streamflow',
                        label: 'streamflow'
                    }]
                }
            ]
        },
      }
    },
    created () {
        let date = this.GetDateStr(-3, 'yyyy-MM-dd')
        this.parameter.startDate = date[1]+ 86400000 -28800000 
        this.parameter.endDate = date[0] - 28800000

        console.log(this.parameter.startDate > this.parameter.endDate)
        this.listTable()
    },
    methods: {
        GetDateStr(AddDayCount, dateFormat) {
                var start = new Date();
                var end = new Date();
                let startDate = this.getAddDate(start, AddDayCount);
                let endDate = this.getAddDate(end);
                // 如果 起始时间大于 结束时间
                if (Date.parse(startDate) > Date.parse(endDate)) {
                    let temporary = null;
                    temporary = startDate;
                    startDate = endDate;
                    endDate = temporary
                }
                console.log(startDate)
                return [new Date(startDate).getTime(), new Date(endDate).getTime()]
            },
            // 获取时间 N天 前， 或者 N 天后 的日期
            getAddDate(dd, AddDayCount = 0) {
                // 获取 AddDayCount 天后的日期
                dd.setDate(dd.getDate() + AddDayCount)
                return this.dateFormat(dd)
            },
            dateFormat(dd) {
                var y = dd.getFullYear();
                var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
                var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
                return y + "-" + m + "-" + d;
            },

        //table list
        listTable: function () {
            executeStatistics(this.parameter).then(data => {
                 this.$refs.heatmap.setHeatmapData(data)
            }, err => {
                var _this = this;
                if (err.response.status == 500) {
                    _this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }
            })
        },
        details () {
            this.$router.push({path: '/hippo/execute'})
        }
    }
}
</script>
<style lang="scss" scoped>
.execute{
    margin-top: 30px;
}
</style>