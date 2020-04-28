<!--monitor模块查询input-->
<template>
    <section>
        <el-input placeholder="请输入名称" v-model="searchInput" @keyup.enter.native="searchKeyup" class="input-with-search">
            <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
        </el-input>
        <el-date-picker
                v-model="dateValue"
                type="daterange"
                value-format="timestamp"
                @change="handledateValue"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
        <div class="flowtype">
            <h4>流程类型</h4>
            <el-select id="bm-hippo-monitor-success-flowType" v-model="flowType" placeholder="all"
                       @change="flowTypeValue">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.value| cn"
                        :value="item.value">
                </el-option>
            </el-select>
        </div>
    </section>
</template>
<script>
    import {queryObject, createParameter} from '@function/queryParameter.js';
    import {executeList} from '@api'

    export default {
        props: ['params'],
        name: "searchInput",
        data() {
            return {
                searchInput: '',
                dateValue: '',
                flowType: "all",
                options: [{
                    value: 'all',
                    label: '所有类型'
                }, {
                    value: 'dataflow',
                    label: '批处理'
                }, {
                    value: 'workflow',
                    label: '工作流'
                }, {
                    value: 'streamflow',
                    label: '流处理'
                }],
            }
        },
        methods: {
            //flow类型选择
            flowTypeValue: function (val) {
                // var parameter = this.buildParameters()
                this.flowType = val
                this.searchTable();
            },
            //查询
            searchTable: function () {
                var params = this.buildParameters()
                executeList(params).then(data => {
                        var _this = this
                        _this.loading = false
                        //this.table = data
                        //this.$store.commit('changeResData',this.table)
                        _this.$emit('getData', data, params);
                    }, err => {
                        /* var _this = this;
                         if (err.response.status == 500) {
                             _this.$message({
                                 message: err.response.message,
                                 type: 'error',
                                 duration: 1500
                             });
                         }*/
                    }
                )
            },
            handledateValue: function (val) {
                if (val == null) {
                    this.dateValue = [];
                } else {
                    this.dateValue = [val[0], val[1] + 86399000];
                }
                //var parameter = this.buildParameters();
                //this.getTableList(parameter);
                this.searchTable();
            },
            //键盘回车事件
            searchKeyup: function () {
                this.searchTable();
            },
            buildParameters: function () {
                //var limit = this.pagesize;
                //var offset = (this.currentPage - 1) * this.pagesize;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                //var field = this.prop;
                //var orderDirection = this.orderDirection;
                //var parameter = createParameter('statusType', 'SUCCEEDED', 'EQUAL').Limit(limit).Offset(offset).Sort(field, orderDirection).Build();
                var parameter = this.params
                if (query != '%') {
                    parameter = createParameter('name', query, "LIKE").Build(this.params);
                }
                if (this.flowType != "all") {
                    parameter = createParameter('flowType', this.flowType, 'EQUAL').Build(parameter);
                }
                if (this.dateValue) {
                    if (this.dateValue.length == 0) {

                    } else {
                        parameter = createParameter('lastModifiedTime', Number(this.dateValue[0]), 'GREATER_THAN').And('lastModifiedTime', Number(this.dateValue[1]), 'LESS_THAN').Build(parameter);
                    }
                }
                return parameter;
            },
        }
    }
</script>
<style scoped>
    .el-table td, .el-table th {
        padding-right: 10px;
    }

    .con-module .el-row {
        float: left;
        width: 100%;
    }

    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .el-table {
        float: left;
        margin-top: 10px;
    }

    .detail-btn {
        padding: 0px;
    }

    .detail {
        margin-right: 10px;
    }
</style>
<style lang="scss" scoped>
    .flowtype {
        float: left;
        width: 260px;
        height: 34px;
        line-height: 34px;
        margin-top: 5px;
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
</style>