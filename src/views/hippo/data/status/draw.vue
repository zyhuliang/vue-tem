<template>
    <section class="con-module" id="bm-hippo-data-status-draw">
        <el-row class="btnClass">
            <div class="btn-left">
                <el-date-picker
                        id="bm-hippo-data-status-draw-timepicker"
                        v-model="dateValue"
                        type="daterange"
                        @change="handledateValue"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-input id="bm-hippo-data-status-draw-datasource-input" placeholder="请选DB数据源"
                          v-model="datasource.name" class="input-with-search" @input="dataSourceInquire" disabled>
                    <el-button id="bm-hippo-data-status-draw-datasource-btn" slot="append"
                               icon="icon iconfont icon-ir-search" @click="dataSourceInquire"></el-button>
                </el-input>
            </div>
            <div class="btn-right">
                <el-button id="bm-hippo-data-status-draw-datasource-detail" type="info" @click="searchList"><i
                        class="icon iconfont icon-ir-text-label"></i>详情
                </el-button>
            </div>
            <!-- DataSource dialog-->
            <el-dialog title="数据源查询" :visible.sync="dialogDataSourceVisible" :close-on-click-modal="false"
                       :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass">
                <el-form id="bm-draw-dialog-form">
                    <data-source-inquire ref="dataSourceInquire" @thisSelectDateSourceVal="getSelectDateSourceVal"
                                         rootName="datasource_dir"></data-source-inquire>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button id="bm-hippo-data-status-draw-ok" type="primary" @click="submitDataSource">确定</el-button>
                    <el-button @click="cancelDatasetDialog" id="bm-hippo-data-status-draw-cancel">取消
                    </el-button>
                </div>
            </el-dialog>
        </el-row>
        <div id="datastatus_id" class="canvas"></div>
    </section>
</template>
<script>
    import {getDataStatusDraw} from '@api';
    import dataSourceInquire from '@components/dataSourceInq/dataSourceInquire.vue';
    import {createParameter, queryObject} from "@components/function/queryParameter";
    import {getTwoLineOption} from "@components/echarts/EchartsOptions"

    var parameter = queryObject();
    export default {
        components: {
            dataSourceInquire,
        },
        data() {
            return {
                weeks: this.getWeek(),
                dialogDataSourceVisible: false,
                formLabelWidth: "200px",
                datasource: {id: '', name: ''},
                getSelValDataSource: {},
                table: [],
                multipleSelection: [],
                dateValue: '',
                searchInput: '',
                show: false,
                currentPage: 1,
                pagesize: 8,
            }
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog(){
                //关闭dialog
                this.dialogDataSourceVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            //获取子组件的dataSource entity
            getSelectDateSourceVal(data) {
                this.getSelValDataSource = data;
            },
            //dataSource查询数据提交
            submitDataSource: function () {
                if (this.getSelValDataSource === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
                    this.datasource = this.getSelValDataSource;
                    this.cancelDatasetDialog();
                    this.listTable(this.buildParameters());
                }
            },
            handledateValue: function (val) {
                if (val == null) {
                    this.dateValue = [];
                } else {
                    this.dateValue = [val[0], val[1]];
                }
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            searchList: function () {
                this.$router.push({"path": "/hippo/data/statuslist"})
            },
            //查询
            searchTable: function () {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup: function () {
                this.searchTable(parameter);
            },
            groupTypeValue: function (val) {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //弹出"dataSource查询"层
            dataSourceInquire: function () {
                this.dialogDataSourceVisible = true;
            },
            buildParameters: function () {
                var parameter = createParameter().GroupBy("testTime").Build();
                if (this.datasource.id != null && this.datasource.id.length > 1) {
                    parameter = createParameter('dataSourceId', this.datasource.id, 'EQUAL').Build(parameter);
                }
                if (this.searchInput) {
                    parameter = createParameter('flowName', this.searchInput, 'EQUAL').Build(parameter);
                }
                if (this.dateValue && this.dateValue.length != 0) {
                    parameter = createParameter('createTime', new Date(this.dateValue[0]).getTime(), 'GREATER_THAN')
                        .And('createTime', new Date(this.dateValue[1]).getTime() + 86399000, 'LESS_THAN').Build(parameter);
                } else {
                    parameter = createParameter('createTime', new Date(this.weeks[0]).getTime(), 'GREATER_THAN')
                        .And('createTime', new Date(this.weeks[7]).getTime(), 'LESS_THAN').Build(parameter);
                }
                return parameter
            },
            listTable: function listTable(parameter) {
                getDataStatusDraw(parameter).then(data => {
                    var suX = [];
                    var faX = [];
                    var rt_success = data.SUCCEEDED;
                    var rt_failed = data.FAILED;
                    for (var r in rt_success) {
                        suX[r] = rt_success[r].name;
                    }
                    for (var r in rt_failed) {
                        faX[r] = rt_failed[r].name;
                    }
                    var res = $.unique($.merge(suX, faX))
                    var xAxis = res.sort(function (a, b) {
                        return a - b;
                    });
                    var success = this.InitializeData(xAxis.length);
                    var failed = this.InitializeData(xAxis.length);
                    success = this.getTaskHistoryData(xAxis, data.SUCCEEDED, success);
                    failed = this.getTaskHistoryData(xAxis, data.FAILED, failed);
                    var legend = ['SUCCESSED', 'FAILED'];
                    if (xAxis.length > 0) {
                        this.drawing_line(getTwoLineOption(), 'datastatus_id', xAxis, legend, success, failed);
                    } else {
                        if (this.dateValue != '' && this.dateValue.length != 0) {
                            var days = this.getAll(this.dateValue[0], this.dateValue[1]);
                            xAxis = [days[0] + '0000', days[days.length - 1] + '2359'];
                        } else {
                            xAxis[0] = 'yyyyMMddHHmm'
                        }
                        for (var i in xAxis)
                            success[i] = failed[i] = 0;
                        this.drawing_line(getTwoLineOption(), 'datastatus_id', xAxis, legend, success, failed);
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
                })
            },
            //画折线图
            drawing_line: function (option, id, xAxis, legend, schedule, execute) {
                var myChart = this.$echarts.init(document.getElementById(id));
                option.legend.data = legend;
                xAxis = this.Dataformate(xAxis);
                option.xAxis.data = xAxis;
                option.series[0].name = legend[0];
                option.series[0].data = schedule;
                option.series[1].name = legend[1];
                option.series[1].data = execute;
                //使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                window.onresize = myChart.resize;
            }
        },
        mounted() {
            this.days = this.getAll(this.weeks[0], this.weeks[7]);
            var parameter = createParameter('createTime', new Date(this.weeks[0]).getTime(), 'GREATER_THAN')
                .And('createTime', new Date(this.weeks[7]).getTime(), 'LESS_THAN')
                .GroupBy('testTime')
                .Build();
            this.listTable(parameter);
        }
    };

</script>

<style lang="scss" scoped>
    .el-table td, .el-table th {
        padding-right: 10px;
    }

    .con-module .el-row {
        float: left;
        width: 100%;
    }

    .analyze-flowtype {
        float: right;
        width: 260px;
        height: 34px;
        line-height: 34px;
        h4 {
            margin: 0px;
            float: left;
        }
        .el-select {
            float: left;
            width: 180px;
            margin-left: 10px;
        }
    }

    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .con-module .canvas {
        width: 100%;
        height: 500px;
        margin: 50px auto;
        background-color: white;
        border: 1px solid #dcdfe6;
    }
</style>