<template>
    <div class="trend">
        <span>{{ paths }}</span>
        <el-button-group>
            <el-button id="bm-hippo-visit-todaye" @click="GetDateStr(1, 'hour', 'HH')"> 今天</el-button>
            <el-button id="bm-hippo-visit-yesterday" @click="GetDateStr(-1, 'hour', 'HH')"> 昨天</el-button>
            <el-button id="bm-hippo-visit-seven" @click="GetDateStr(-7, 'hour', 'yyyy-MM-dd HH')"> 近7天</el-button>
            <!-- <el-button id="bm-hippo-visit-thirty" @click="GetDateStr(-30, 'day', 'yyyy-MM-dd')"> 近30天</el-button> -->
        </el-button-group>
        <ve-line 
            :data="chartData"
            :settings="chartSettings"
             height="3rem"
            width="100%"
            :extend="chartExtend"
            :data-zoom="dataZoom"
            ref="trend"
            ></ve-line>
    </div> 
</template>
<script>

export default {
    props: {
        'request': {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ''
        },
        paths: {
            type: String,
            default: ''
        },
        columns: {
            type: Array,
            default: () => []
        }
    },

    data () {
      return {
        dataZoom: [
            {
            type: 'slider',
            start: 0,
            end: 100
            }
      ],
        chartSettings: {
            area: true
        },
        chartExtend: {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    margin: 10,
                    color: '#035688'
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: true,
                    length: 25,
                    lineStyle: {
                        color: "#131925"
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#131925'
                    }
                }
            },
            yAxis: {
                type: 'value',
                position: 'left',
                axisLabel: {
                    margin: 30,
                    color: '#035688'
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: true,
                    length: 25,
                    lineStyle: {
                        color: "#131925"
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#131925'
                    }
                }
            },
            grid: {
                top: '25%',
                left: '0%',
                right: '5%',
                bottom: '15%',
                containLabel: true,
            },
            title: {  
                text:  this.title,    //标题  
                textStyle: {  
                    fontWeight: 'normal',              //标题颜色  
                    color: '#afd3ec'  
                },  
            
                    x:"left"      
            },
            legend: {
                textStyle: {
                    color: '#82858a',
                    fontSize: 12
                }
            }
        },
        chartData: {
          columns: this.columns,
          rows: () => this.request
        }
      }
    },
     methods: {
        GetDateStr(AddDayCount, group, dateFormat) {
            var start = new Date();
            var end = new Date();
            let startDate = this.getAddDate(start, AddDayCount);
            let endDate = this.getAddDate(end);
            // 如果 起始时间大于 结束时间
            if ( Date.parse(startDate) > Date.parse(endDate)) {
                let temporary = null;
                temporary = startDate;
                startDate = endDate;
                endDate = temporary
            }
            let getdiffdate = this.getdiffdate(startDate, endDate, dateFormat)
            this.$emit('data', {
                startDate: startDate,
                endDate: endDate,
                group: group,
                dateFormat: dateFormat,
                getdiffdate: getdiffdate
            })
        },
        // 获取时间 N天 前， 或者 N 天后 的日期 
        getAddDate (dd, AddDayCount = 0) {
            // 获取 AddDayCount 天后的日期
            dd.setDate(dd.getDate() + AddDayCount)
            return this.dateFormat(dd)
        },
        dateFormat (dd) {
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
            var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
            return y + "-" + m + "-" + d;
        },
    //获取两日期之间日期列表函数
        getdiffdate (startDate,endDate, dateFormat) {
            var diffdate = new Array();
            //开始日期小于等于结束日期,并循环
            var day;
            if (dateFormat === 'yyyy-MM-dd HH' || dateFormat === 'yyyy-MM-dd' ) {
            var day = 0
            }else {
            day = -1
            }
            for (var i = 0; startDate <= this.getAddDate(new Date(endDate), day); i++) {
            diffdate[i] = startDate;
            //获取开始日期时间戳
            var startDateMS = new Date(startDate).getTime();
            var nextDateMS = startDateMS + (24*60*60*1000)
            startDate = this.dateFormat(new Date(nextDateMS))
            }

            if (dateFormat === 'HH') {
            var diffDateHour = []
            for (var value in diffdate) {
                for (i = 0; i < 24; i++) {
                diffDateHour.push({
                    key: i < 10 ? '0' + i : i + ''
                })
                }
            }
            return diffDateHour
            }else if (dateFormat === 'yyyy-MM-dd HH') {
            var diffDateHour = []
            for (var value in diffdate) {
                for (i = 0; i < 24; i++) {
                diffDateHour.push({
                    key: diffdate[value] + ' ' + (i < 10 ? '0' + i : i + '')
                })
                }
            }
            return diffDateHour
            }else{
            var diffDateHour = []
            for (var value in diffdate) {
                diffDateHour.push({
                key: diffdate[value]
                })
            }
            return diffDateHour
            }
        }
    },
    mounted () {
         this.$nextTick(_ => {
          this.$refs[`trend`].echarts.resize()
        })
        this.GetDateStr(1, 'hour', 'HH')
    },
    watch: {
        request: {
            handler(newName, oldName) {
                this.$set(this.chartData,'rows', newName)
            },
            deep: true,
        }
    }
}
</script>
<style lang="scss" scoped>
.trend{
    $fontSize:100px;
    width: 80%;
    margin: 0 auto;
    height: 295px / $fontSize + rem;
    margin-top: 100px  / $fontSize + rem;
    color: #afd3ec;
    .ve-line{
        height: 350px / $fontSize + rem !important;
    }
    .el-button-group{
        position: relative;
        z-index: 100000;
        margin-bottom: 15px;
        float: right;
        margin-right: 60px / $fontSize + rem;
        .el-button{
            padding:5px 12px;
            font-size: 14px / $fontSize + rem !important;
        }
    }
}
</style>
