<template>
    <div class="chart">
        <operationPanel>
            <div class="search" slot="left">
                <info-from  :config="config" :modelData="parameter"/>
            </div>
        </operationPanel>
        <ve-line :data="chartData" :settings="chartSettings"></ve-line>
        <taskList></taskList>
    </div>
</template>>
<script>
import operationPanel from "@components/layout/operationPanel";
import infoFrom from "@components/infoFrom/infoFrom";
import { getAlarmList } from '@api';
import {createParameter} from '@components/function/queryParameter.js';
import taskList from '@views/hippo/alarm/container'
import moment from "moment"//时间格式化
export default {
    components: {
        operationPanel,
        infoFrom,
        taskList
    },
    data () {
        this.chartSettings = {
            area: true
        }
      return {
        chartData: {
            area: true,
            columns: ['日期', 'deadly', 'serious', 'warning'],
            rows: [
            ]
        },
        parameter: {
            limit: 1000,
            offset:0,
            startDate: '',
            endDate: '',
            sortObject: {
                orderDirection: 'ASC'
            }
        },
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
            parameter.sortObject.field = 'lastModifiedTime'
            parameter.sortObject.orderDirection = 'ASC'
            return parameter
        },

         // table list
        listTable: function listTable(parameter) {
            var parameter = this.buildParameters()
            getAlarmList(parameter).then(data => {
                for (let item of data.content) {
                    item.xAxisList = moment(Number(item.createTime)).format("YYYY-MM-DD")
                }
                this.getRepeatDate(data.content)
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
            // 获取 不是重复的数组
            removal (arr) {
                var obj = {};
                var result = [];
                for(var i=0;i<arr.length;i++){
                    obj[arr[i]]=arr[i];
                }
                for(var i in obj){
                    result.push(i);
                }
                return result
            },
            // 计算数组中元素重复出现的个数
            getRepeatDate(arr){
                var obj = {}; 
                var l ;
                for(var i= 0, l = arr.length; i< l; i++){ 
                    var item = arr[i].xAxisList; 
                    if ( obj[item] instanceof Array !== true) {
                        obj[item] = []
                    }
                    obj[item].push(arr[i]); 
                }
                for (let item in obj) {
                    this.getRepeatCount(item, obj[item])
                }
                return obj; 
            },
            getRepeatCount(val, arr){
                var obj = {}; 
                for(var i= 0, l = arr.length; i< l; i++){ 
                    var item = arr[i].type; 
                    obj[item] = (obj[item] +1 ) || 1; 
                }
                obj['日期'] = val
                this.chartData.rows.push(obj)
            }
    }
}
</script>
<style lang="scss" scoped>
.chart{
    .ve-line{
        margin-top: 15px;
    }
}
</style>