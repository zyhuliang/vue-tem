<template>
    <div class="visit" id="bm-hippo-visit">
        <div class="visit-list">
            <checkDate id="bm-hippo-taskcontrol-urlVisitNumber" title="请求数" @date="urlVisitNumber"/>
            <visitNumber :visitNumbnerData="visitNumbnerData"/>
        </div>
        <div class="visit-list">
            <checkDate id="bm-hippo-taskcontrol-visitSuccess" title="请求成功数" @date="visitSuccess"/>
            <visitSuccess :visitSuccessData="visitSuccessData"/>
        </div>
        <div class="visit-list">
            <checkDate id="bm-hippo-taskcontrol-urlVisitTop100" title="请求量前100" @date="urlVisitTop100"/>
            <urlTop100 :URLlist="URLlist"/>
        </div>
        <div class="visit-list">
            <checkDate id="bm-hippo-taskcontrol-timeVisitTop100" title="请求耗时前100" @date="timeVisitTop100"/>
            <timeTop100  :timeList="timeList"/>
        </div>
    </div>
</template>
<script>
    import VisitNumber from './visiitComponents/visitNumber.vue';
    import VisitSuccess from './visiitComponents/visitSuccess.vue';

    import CheckDate from './visiitComponents/checkDate.vue';
    import UrlTop100 from './visiitComponents/urlTop100.vue';
    import timeTop100 from './visiitComponents/timeTop100.vue';
    import {urlVisitNumber, urlVisitSuccess, urlVisitTop, timeVisitTop} from '@api'

    export default {
        components: {
            VisitNumber,
            VisitSuccess,
            CheckDate,
            UrlTop100,
            timeTop100
        },
        data() {
            return {
                URLlist: [],
                timeList: [],
                visitNumbnerData: {
                    columns: ['日期', '数量'],
                    rows: []
                },
                visitSuccessData: {
                    columns: ['日期', '成功', '成功率', '失败', '失败率'],
                    rows: []
                }
            }
        },
        methods: {
            urlVisitNumber(data) {

                urlVisitNumber({
                    startDate: data.startDate,
                    endDate: data.endDate,
                    group: data.group,
                    dateFormat: data.dateFormat,
                }).then((res) => {
                        this.visitNumbnerData.rows = [];
                        let getdiffdate = data.getdiffdate
                        var is_exist;
                        for (let value of getdiffdate) {
                            is_exist = 0;
                            for (let item of res) {
                                if (value.key === item.key_as_string) {
                                    this.visitNumbnerData.rows.push({
                                        '日期': item.key_as_string,
                                        '数量': item.count
                                    })
                                    is_exist = 1;
                                    break;
                                }
                            }
                            if (is_exist == 0) {
                                this.visitNumbnerData.rows.push({
                                    '日期': value.key,
                                    '数量': 0
                                })
                            }
                        }
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

            visitSuccess(data) {

                urlVisitSuccess({
                    startDate: data.startDate,
                    endDate: data.endDate,
                    group: data.group,
                    dateFormat: data.dateFormat,
                }).then((res) => {
                        this.visitSuccessData.rows = [];
                        let getdiffdate = data.getdiffdate
                        var is_exist;
                        for (let value of getdiffdate) {
                            is_exist = 0;
                            for (let item of res) {
                                if (value.key === item.key_as_string) {
                                    this.visitSuccessData.rows.push({
                                        '日期': item.key_as_string,
                                        '成功': item.success,
                                        '成功率': item.success_rate,
                                        '失败': item.fail,
                                        '失败率': item.fail_rate
                                    })
                                    is_exist = 1;
                                    break;
                                }
                            }
                            if (is_exist == 0) {
                                this.visitSuccessData.rows.push({
                                    '日期': value.key,
                                    '成功': 0,
                                    '成功率': 0,
                                    '失败': 0,
                                    '失败率': 0
                                })
                            }
                        }
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
            urlVisitTop100(data) {
                urlVisitTop({
                    startDate: data.startDate,
                    endDate: data.endDate,
                    limit: 100
                }).then((res) => {
                        this.URLlist = res
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
            timeVisitTop100(data) {
                timeVisitTop({
                    startDate: data.startDate,
                    endDate: data.endDate,
                    limit: 100
                }).then((res) => {
                    this.timeList = res
                })
            }

        }
    }
</script>
<style lang="scss">
    .visit {
        display: flex;
        padding-left: 30px;
        box-sizing: border-box;
        flex-wrap: wrap;
        .visit-list {
            width: 48%;
            box-sizing: border-box;
            background: #fff;
            margin-right: 2%;
            margin-top: 30px;
        }

    }
</style>
