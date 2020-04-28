<template>
    <div class="chart">
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
import {scheduleList} from '@api';
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
            limit: 1000,
            offset:0,
            startDate: '',
            endDate: '',
            scheduler: 'all',
            sortObject: {
                orderDirection: 'ASC'
            }
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
                        this.parameter.limit = 1000
                        this.parameter.offset = 0
                        this.listTable()
                    }
                },
                {
                    label: "周期情况",
                    type: "infoSelect",
                    model: "scheduler",
                    methods: val => {
                        this.parameter.scheduler = val
                        this.parameter.limit = 1000
                        this.parameter.offset = 0
                        this.listTable()
                    },
                    options:  [{
                        label: '全部',
                        value: 'all'
                    },{
                        label: '周期',
                        value: 'cron'
                    }, {
                        label: '一次性',
                        value: 'once'
                    }]
                }
            ]
        },
      }
    },
    created () {
        this.listTable(this.parameter)
    },
    methods: {
        buildParameters: function () {
            var parameter = createParameter().Limit(this.parameter.limit).Offset(this.parameter.offset).Build();
            if(this.parameter.startDate) {
                parameter = createParameter('lastModifiedTime', Number(this.parameter.startDate), 'GREATER_THAN').And('lastModifiedTime', this.parameter.endDate, 'LESS_THAN').Build(parameter);
            }
            if(this.parameter.scheduler !== 'all') {
                parameter = createParameter('schedulerId',this.parameter.scheduler, 'EQUAL').Build(parameter);
            }
            parameter.sortObject.field = 'startTime'
            parameter.sortObject.orderDirection = 'ASC'
            return parameter
        },

        //table list
        listTable: function listTable() {
            var parameter = this.buildParameters()
            scheduleList(parameter).then(data => {
                let dateData = []
                let yAxisList = []
                for (let item of data.content) {
                    if (this.parameter.scheduler === 'all') {
                        dateData.push(moment(Number(item.configurations.startTime)).format("YYYY-MM-DD"))
                        yAxisList.push(moment(Number(item.configurations.startTime)).format("YYYY-MM-DD HH"))
                    } else {
                        if (item.schedulerId === this.parameter.scheduler) {
                            dateData.push(moment(Number(item.configurations.startTime)).format("YYYY-MM-DD"))
                            yAxisList.push(moment(Number(item.configurations.startTime)).format("YYYY-MM-DD HH"))
                        }
                    }
                }
                console.log(dateData, yAxisList)
                this.$refs.heatmap.getHeatmapData(dateData, yAxisList)
                }, err => {
                    var _this = this;
                    if (err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                }
            )
        },
        details () {
            this.$router.push({path: '/hippoScheduleList'})
        }
    }
}
</script>
<style lang="scss" scoped>
.chart{
    margin-top: 30px;
}
</style>