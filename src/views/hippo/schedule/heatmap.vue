<template>
    <ve-heatmap :data="chartData" height="calc(100vh - 130px)" :settings="chartSettings"></ve-heatmap>
</template>
<script>
import moment from "moment"//时间格式化
export default {
    props: {
    },
    data () {
        return {
            chartSettings: {
                xAxisList: [],
                yAxisList: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            },
            chartData: {
                columns: ['日期', '时间', 'count'],
                rows: []
            },
        }
    },
    methods: {
        setHeatmapData(data){
            this.chartData.rows = []
            for (let item in data) {
                console.log(item)
                for (let value in data[item]) {
                    this.chartData.rows.push(
                        { '日期': item, '时间': value, 'count':  data[item][value]}
                    )
                }
            }
        },
        getHeatmapData (dateData, yAxisList) {
            // 首先获取 日期的不重复值
            this.chartSettings.xAxisList = this.removal(dateData)
            // 生成Y轴信息
            this.getYAxisList(this.getRepeatNum(yAxisList)) 
        },
        // 生成Y轴信息
        getYAxisList(yAxisList) {
            this.chartData.rows = []
            for (let item in yAxisList) {
                let date = item.substr(0, 10)
                let time = item.substr(11, 2)
                this.chartData.rows.push(
                    { '日期': date, '时间': time, 'count':  yAxisList[item]}
                )
            }
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
        },// 计算数组中元素重复出现的个数
        getRepeatNum(arr){
            var obj = {}; 
            for(var i= 0, l = arr.length; i< l; i++){ 
                var item = arr[i]; 
                obj[item] = (obj[item] +1 ) || 1; 
            } 
            return obj; 
        },
        
    }
}
</script>

<style lang="scss" scoped>