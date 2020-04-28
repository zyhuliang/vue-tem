<template>
    <div class="checkDate" id="bm-hippo-visit-checkDate">
        <div id="bm-hippo-visit-title">{{title}}</div>
        <el-button-group>
            <el-button id="bm-hippo-visit-todaye" @click="GetDateStr(1, 'hour', 'HH')"> 今天</el-button>
            <el-button id="bm-hippo-visit-yesterday" @click="GetDateStr(-1, 'hour', 'HH')"> 昨天</el-button>
            <el-button id="bm-hippo-visit-seven" @click="GetDateStr(-7, 'hour', 'yyyy-MM-dd HH')"> 近7天</el-button>
            <el-button id="bm-hippo-visit-thirty" @click="GetDateStr(-30, 'day', 'yyyy-MM-dd')"> 近30天</el-button>
        </el-button-group>
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
                default: ""
            },
        },
        methods: {
            GetDateStr(AddDayCount, group, dateFormat) {
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
                let getdiffdate = this.getdiffdate(startDate, endDate, dateFormat)

                this.$emit("date", {
                    startDate: startDate,
                    endDate: endDate,
                    group: group,
                    dateFormat: dateFormat,
                    getdiffdate: getdiffdate
                })
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
            //获取两日期之间日期列表函数
            getdiffdate(startDate, endDate, dateFormat) {
                var diffdate = new Array();
                //开始日期小于等于结束日期,并循环
                var day;
                if (dateFormat === 'yyyy-MM-dd HH' || dateFormat === 'yyyy-MM-dd') {
                    var day = 0
                } else {
                    day = -1
                }
                for (var i = 0; startDate <= this.getAddDate(new Date(endDate), day); i++) {
                    diffdate[i] = startDate;
                    //获取开始日期时间戳
                    var startDateMS = new Date(startDate).getTime();
                    var nextDateMS = startDateMS + (24 * 60 * 60 * 1000)
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
                } else if (dateFormat === 'yyyy-MM-dd HH') {
                    var diffDateHour = []
                    for (var value in diffdate) {
                        for (i = 0; i < 24; i++) {
                            diffDateHour.push({
                                key: diffdate[value] + ' ' + (i < 10 ? '0' + i : i + '')
                            })
                        }
                    }
                    return diffDateHour
                } else {
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
        created() {
            this.GetDateStr(1, 'hour', 'HH')
        }

    };
</script>
<style lang="scss" scoped>
    .checkDate {
        display: flex;
        padding: 30px;
        > div {
            margin-right: auto;
        }
        .el-button-group {
            margin: 0;
        }
    }
</style>