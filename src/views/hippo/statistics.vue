<!-- 数据统计 -->
<template>
    <section class="statistics-container">
        <el-row class="btnClass">
            <div class="dateClass">
                <h4>历史统计记录:</h4>
                <el-date-picker
                        v-model="dateInq"
                        type="date"
                        @change="handledateValue"
                        placeholder="选择日期">
                </el-date-picker>
            </div>

            <div class="typeClass">
                <h4>业务:</h4>
                <el-select v-model="typeVal" placeholder="业务查询" @change="typeIuq">
                    <el-option
                            v-for="item2 in type"
                            :key="item2.value"
                            :label="item2.label"
                            :value="item2.value">
                    </el-option>
                </el-select>
            </div>

            <div class="departmentClass">
                <h4>部门/单位/其他:</h4>
                <el-select v-model="departmentVal" placeholder="部门/单位/其他 查询" @change="departmentIuq">
                    <el-option
                            v-for="item1 in department"
                            :key="item1.value"
                            :label="item1.label"
                            :value="item1.value">
                    </el-option>
                </el-select>
            </div>
            <div class="btn-right">
                <el-input placeholder="请输入系统名称" v-model="searchInput" @keyup.enter.native="searchKeyup"
                          class="input-with-search">
                    <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
                <el-button class="exportClass" type="info" @click="dataExport"><i class="fa fa-download"></i>数据导出
                </el-button>
            </div>
        </el-row>

        <div class="rf-swap">
            <el-table
                    :data="table.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                    tooltip-effect="dark"
                    v-loading="loading"
                    id="bm-hippo-statistics-table"
                    @sort-change="sortChange"
                    style="width: 100%;"
                    height="calc(100vh - 200px)">
                <el-table-column
                        prop="业务"
                        label="业务"
                        width="100">
                </el-table-column>
                <el-table-column
                        label="系统名称"
                        prop="系统名称">
                </el-table-column>
                <el-table-column
                        label="部门/单位/其他"
                        prop="部门">
                </el-table-column>
                <el-table-column
                        prop="今日记录"
                        label="今日记录"
                        sortable="custom"
                        width="160"
                        align="right">
                </el-table-column>
                <el-table-column
                        prop="昨日记录"
                        label="昨日记录"
                        sortable="custom"
                        width="160"
                        align="right">
                </el-table-column>
                <el-table-column
                        prop="增量记录"
                        label="增量记录"
                        sortable="custom"
                        width="160"
                        align="right">
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[8, 16, 50, 100]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="table.length">
            </el-pagination>
        </div>
    </section>
</template>
<script>
    import {getStatistics} from '../../api/api';
    function deepCopy(p, c) {
        var c = c || {};
        for (var i in p) {
            if (!p.hasOwnProperty(i)) {
                continue;
            }
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                deepCopy(p[i], c[i]);
            } else {
                c[i] = p[i];
            }
        }
        return c;
    }

    function transformArr(obj) {
        var arr = [];
        for (var item in obj) {
            arr.push(obj[item]);
        }
        return arr;
    }

    export default {
        data() {
            return {
                table: [],
                copyTable: [],
                inqTable: [],
                filterTableDataEnd: [],
                dateInq: "",
                selDate: new Date().format("yyyymmdd"),
                currentPage: 1,
                pagesize: 8,
                searchInput: '',
                isActive: false,
                loading: true,
                department: [{
                    value: '全部',
                    label: '全部'
                }, {
                    value: '机关党委',
                    label: '机关党委'
                }, {
                    value: '中国国际科技交流中心',
                    label: '中国国际科技交流中心'
                }, {
                    value: '企业创新服务中心',
                    label: '企业创新服务中心'
                }, {
                    value: '科技导报社',
                    label: '科技导报社'
                }, {
                    value: '学会服务中心',
                    label: '学会服务中心'
                }, {
                    value: '学会部',
                    label: '学会部'
                }, {
                    value: '政务',
                    label: '政务'
                }, {
                    value: '创新战略研究院',
                    label: '创新战略研究院'
                }, {
                    value: '中国科协农村专业技术服务中心',
                    label: '中国科协农村专业技术服务中心'
                }, {
                    value: '中国科学技术出版社',
                    label: '中国科学技术出版社'
                }, {
                    value: '中国科普研究所',
                    label: '中国科普研究所'
                }, {
                    value: '科普部',
                    label: '科普部'
                }],
                departmentVal: '全部',
                type: [{
                    value: '全部',
                    label: '全部'
                }, {
                    value: '党建',
                    label: '党建'
                }, {
                    value: '学术',
                    label: '学术'
                }, {
                    value: '政务',
                    label: '政务'
                }, {
                    value: '智库',
                    label: '智库'
                }, {
                    value: '科普',
                    label: '科普'
                }],
                typeVal: "全部"
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            handledateValue(val) {
                var _this = this;
                if (val == null) {
                    _this.selDate = new Date().format("yyyymmdd");
                } else {
                    _this.selDate = val.format("yyyymmdd");
                }
                this.typeVal = "全部";
                this.departmentVal = "全部";
                this.searchInput = "";
                this.listTable(this.selDate, "", "")
            },
            //部门 查询
            departmentIuq: function (val) {
                var _this = this;
                this.table = transformArr(deepCopy(this.copyTable));
                if (val == "全部" && this.typeVal == "全部") {
                    this.table = transformArr(deepCopy(this.copyTable));
                    this.inqTable = transformArr(deepCopy(this.copyTable));
                } else {
                    if (_this.typeVal == "全部") {
                        var departmentData = transformArr(deepCopy(this.table)).filter(function (a) {
                            return a.部门 == val;
                        });
                        this.table = departmentData;
                        this.inqTable = departmentData;
                    } else {
                        if (val == "全部") {
                            var typeData = transformArr(deepCopy(this.copyTable)).filter(function (b) {
                                return b.业务 == _this.typeVal;
                            });
                            this.table = typeData;
                            this.inqTable = typeData;
                        } else {
                            var typeData = transformArr(deepCopy(this.copyTable)).filter(function (b) {
                                return b.业务 == _this.typeVal;
                            });
                            this.table = typeData;
                            var departmentData = this.table.filter(function (a) {
                                return a.部门 == val;
                            });
                            this.table = departmentData;
                            this.inqTable = departmentData;
                        }
                    }

                }
            },
            //业务查询
            typeIuq: function (val) {
                var _this = this;
                this.table = transformArr(deepCopy(this.copyTable));

                if (val == "全部" && this.departmentVal == "全部") {
                    this.table = transformArr(deepCopy(this.copyTable));
                    this.inqTable = transformArr(deepCopy(this.copyTable));
                } else {
                    if (_this.departmentVal == "全部") {
                        var typeData = this.table.filter(function (b) {
                            return b.业务 == val;
                        });
                        this.table = typeData;
                        this.inqTable = typeData;
                    } else {
                        if (val == "全部") {
                            var departmentData = transformArr(deepCopy(this.copyTable)).filter(function (a) {
                                return a.部门 == _this.departmentVal;
                            });
                            this.table = departmentData;
                            this.inqTable = departmentData;
                        } else {
                            var departmentData = transformArr(deepCopy(this.copyTable)).filter(function (a) {
                                return a.部门 == _this.departmentVal;
                            });
                            this.table = departmentData;
                            var typeData = this.table.filter(function (b) {
                                return b.业务 == val;
                            });
                            this.table = typeData;
                            this.inqTable = typeData;
                        }
                    }
                }
            },
            // table list
            listTable: function listTable(date, rank, updown) {
                this.loading = true;
                getStatistics(date, rank, updown).then(data => {
                        this.loading = false;
                        this.table = data;
                        this.copyTable = data;
                        this.inqTable = data;
                    }, err => {
                        this.table = [];
                        this.copyTable = [];
                        this.inqTable = [];
                        this.loading = false;
                    }
                )
            },
            //查询
            searchTable: function searchTable() {
                this.table = transformArr(deepCopy(this.inqTable));
                if (this.searchInput == "") {
                    this.table = transformArr(deepCopy(this.inqTable));
                } else {
                    this.filterTableDataEnd = []
                    this.table.forEach((value, index) => {
                        if (value.系统名称) {
                            if (value.系统名称.indexOf(this.searchInput) >= 0) {
                                this.filterTableDataEnd.push(value)
                            }
                        }
                    });
                    this.table = this.filterTableDataEnd;
                }
            },
            //监听查询回车事件
            searchKeyup: function () {
                this.searchTable();
            },
            //导出数据
            dataExport: function () {
                var jsonData = this.table;
                //列标题，逗号隔开，每一个逗号就是隔开一个单元格
                let str = `业务,系统名称,部门/单位/其他，今日记录，昨日记录，增量记录\n`;
                //增加\t为了不让表格显示科学计数法或者其他格式
                for (let i = 0; i < jsonData.length; i++) {
                    for (let item in jsonData[i]) {
                        str += `${jsonData[i][item] + '\t'},`;
                    }
                    str += '\n';
                }
                //encodeURIComponent解决中文乱码
                let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
                //通过创建a标签实现
                var link = document.createElement("a");
                link.href = uri;
                //对下载的文件命名
                link.download = "数据统计表-" + this.selDate + ".csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            //排序
            sortChange: function (data) {
                if (data.prop == '今日记录' && data.order == "ascending") {
                    this.listTable(this.selDate, "today_record", "asc")
                } else if (data.prop == '今日记录' && data.order == "descending") {
                    this.listTable(this.selDate, "today_record", "desc")
                } else if (data.prop == '昨日记录' && data.order == "ascending") {
                    this.listTable(this.selDate, "yesterday_record", "asc")
                } else if (data.prop == '昨日记录' && data.order == "descending") {
                    this.listTable(this.selDate, "yesterday_record", "desc")
                } else if (data.prop == '增量记录' && data.order == "ascending") {
                    this.listTable(this.selDate, "incremental_record", "asc")
                } else if (data.prop == '增量记录' && data.order == "descending") {
                    this.listTable(this.selDate, "incremental_record", "desc")
                }
            }
        },
        mounted() {
            this.listTable(this.selDate, "", "")
            this.dateInq = new Date();
        },
    };

</script>

<style lang="scss" scoped>

    .statistics-container {
        margin: 0px;
        .detail-btn {
            padding: 0px;
        }
        .el-row {
            .el-button i {
                font-size: 13px;
            }
        }
        .el-table {
            float: left;
        }
        .user-add {
            color: #ffffff;
            text-decoration: none;
            margin-right: 10px;
        }
    }

    .exportClass {
        float: right;
    }

    .dateClass {
        float: left;
        margin: 5px 0px 0px 10px;
        .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 140px;
        }
        h4 {
            float: left;
            color: #666666;
            height: 34px;
            line-height: 34px;
            margin: 0px 10px 0px 0px;
        }
    }

    .departmentClass {
        float: left;
        margin: 5px 0px 0px 10px;
        .el-select {
            width: 200px;
        }
        h4 {
            float: left;
            color: #666666;
            height: 34px;
            line-height: 34px;
            margin: 0px 10px 0px 0px;
        }
    }

    .typeClass {
        float: left;
        margin: 5px 0px 0px 10px;
        .el-select {
            width: 120px;
        }
        h4 {
            float: left;
            color: #666666;
            height: 34px;
            line-height: 34px;
            margin: 0px 10px 0px 0px;
        }
    }

</style>

