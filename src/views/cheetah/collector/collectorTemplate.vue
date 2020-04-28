<template>
    <section class="con-module" id='bm-ch-col-template-tmp'>
        <!--操作按钮-->
        <el-row class="btnClass">
            <div class="btnLeft">
                <search-table-data ref="refSearchTable" @searchKey="searchListTable" :pagesize="pagesize"
                                   :startTime="startTime" :endTime="endTime"></search-table-data>
                <search-date-data ref="refSearchDate" @searchDate="searchListTable" :pagesize="pagesize"
                                  :searchInput="searchInput"></search-date-data>
            </div>
            <div class="btn-right">
                <el-button type="info" id='bm-ch-col-template-create-button' @click="collectorEditCom()"><i
                        class="icon iconfont icon-ir-add iconStyle"></i>创建
                </el-button>
                <!--<el-button type="info" id='bm-ch-col-template-upload-button' @click="upload()"-->
                           <!--:disabled="multipleSelection.length != 1"><i class="el-icon-upload2"></i>升级-->
                <!--</el-button>-->
                <el-button type="info" id='bm-ch-col-template-edit-button'
                           @click="collectorEditCom(multipleSelection[0])" :disabled="multipleSelection.length != 1"><i
                        class="el-icon-edit"></i>编辑
                </el-button>
                <el-button type="info" id='bm-ch-col-template-delete-button' @click="delTable"
                           :disabled="multipleSelection.length == 0"><i
                        class="icon iconfont icon-ir-directory-delete"></i>删除
                </el-button>
            </div>
        </el-row>
        <!--内容显示列表页面-->
        <template>
            <el-row class="rf-swap">
                <el-table id="bm-ch-collector-template-table" :data="tableData.content"
                          tooltip-effect="dark"
                          @selection-change="handleSelectionChange"
                          @sort-change="getOrder"
                          v-loading="loading"
                          height="calc(100vh - 175px)"
                          style="width: 100%;">
                    <el-table-column
                            type="selection">
                    </el-table-column>
                    <el-table-column prop="id" label="主键" sortable="custom">
                        <template slot-scope="scope">
                            <router-link v-if="scope.row.status == 1"
                                         :to="{ path:'/collector/'+scope.row.id+'/view/'+scope.row.resourceId}">
                                <el-button type="text" class="detail-btn">{{scope.row.id}}</el-button>
                            </router-link>
                            <span v-else>{{scope.row.id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="ip" label="主机地址" align="center">
                    </el-table-column>
                    <el-table-column prop="hostname" label="主机名" align="center">
                    </el-table-column>
                    <el-table-column prop="startedTime" label="启动时间" min-width="120" align="center"
                                     :formatter="startedTimeFormat">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" min-width="120" :formatter="dateFormat"
                                     align="center" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" width="80" align="center" sortable="custom">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status == 0" class="status-div-stop">离线</div>
                            <div v-else-if="scope.row.status == 1" class="status-div-deploy">在线</div>
                            <div v-else-if="scope.row.status == -1" class="status-div-noauth">未授权</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        name="bm-ch-8-el-pagination"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[8, 16, 50, 100]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.totalElements">
                </el-pagination>
            </el-row>
        </template>
        <!--查看日志的dialog-->
        <dialog-log ref="log"></dialog-log>
        <!--升级采集器的dialog-->
        <collector-edit ref="editDialog" @getList="getCollector"></collector-edit>
        <!--升级采集器的dialog-->
        <upload-collector ref="uploadDialog"></upload-collector>

        <router-view></router-view>
    </section>
</template>

<script>
    import {getCollectorList, deleteCollectors} from '@api'
    import searchDateData from '@collectorSearch/searchDateData.vue'
    import searchTableData from '@collectorSearch/searchTableData.vue'
    import collectorEdit from './collectorEdit.vue'
    import uploadCollector from './collectorupload.vue'
    import dialogLog from '@collector/collectorLog.vue'
    import {createParameter} from '@function/queryParameter.js';
    import moment from "moment"//时间格式化

    export default {
        components: {
            searchDateData,
            searchTableData,
            collectorEdit,
            uploadCollector,
            dialogLog,
        },
        data() {
            return {
                dateValue: '',
                show: false,
                currentPage: 1,
                pagesize: 8,
                startTime: '',
                endTime: '',
                searchInput: '',
                parameter: "",
                tableData: {},
                multipleSelection: [],
                option: "layout",
                loading: true,
                collectorDetail: [
                    {name: 'name', disName: '节点名称', value: ''},
                    {name: 'id', disName: '主键', value: ''},
                    {name: 'hostname', disName: 'Hostname', value: ''},
                    {name: 'ip', disName: 'IP地址', value: ''},
                    {name: 'startedTime', disName: '启动时间', value: ''},
                    {name: 'owner', disName: '所有者', value: ''},
                    {name: 'createTime', disName: '创建时间', value: ''},
                    {name: 'status', disName: '节点状态', value: ''},
                ],
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getCollector(this.parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput)
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.getCollector(this.parameter)
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //根据过期时间过滤结果
            startedTimeFormat: function (row, column) {
                let time = row.startedTime;
                if (time == 0) {
                    return "未启动";
                } else {
                    return moment(time).format("YYYY-MM-DD HH:mm:ss");
                }
            },
            //table查询的列表
            searchListTable: function (parameter, type, startTime, endTime, searchInput, pagesize) {
                this.currentPage = 1
                if (pagesize) this.pagesize = pagesize;
                this.startTime = startTime;
                this.endTime = endTime;
                if (searchInput != undefined) this.searchInput = searchInput;
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
                this.parameter = createParameter().Sort(this.prop, this.orderDirection).Limit(this.pagesize).Build(this.parameter, false)
                this.getCollector(this.parameter)
            },
            //获取采集器列表
            getCollector: function (para) {
                if (!para) {
                    para = this.parameter;
                }
                this.loading = true;
                getCollectorList(para).then((res) => {
                    this.tableData = res;
                    this.loading = false;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                });
            },
            //删除采集器
            delTable: function delTable() {
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdId = i.id;
                    tbIds.push(tdId);
                });
                that.$confirm('真的要删除' + tbIds.length + '个采集器?', '提示', {}).then(() => {
                    deleteCollectors(tbIds).then(data => {
                        that.getCollector(that.parameter);
                        that.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    }, error => {

                        that.$message({
                            message: '删除失败！',
                            type: 'error'
                        });
                    })
                }).catch(() => {
                });
            },
            //编辑采集器
            collectorEditCom: function (multipleSelection) {
                this.$refs.editDialog.getCollector(multipleSelection);
            },
            //升级采集器
            upload: function () {
                this.$refs.uploadDialog.uploadFiles(this.multipleSelection);
            },
            //查看日志
            viewLog: function (id) {
                this.$refs.log.viewLog(id)
            },
            //列表排序
            getOrder: function (column) {
                if (column.order === 'ascending') {
                    this.orderDirection = 'ASC'
                } else {
                    this.orderDirection = 'DESC'
                }
                this.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                this.parameter = createParameter().Limit(this.pagesize).Sort(column.prop, this.orderDirection).Build(this.parameter, false);
                this.getCollector(this.parameter);
            }
        },
        mounted() {
            if (JSON.parse(localStorage.getItem("parameter"))) {
                this.parameter = JSON.parse(localStorage.getItem("parameter"));
                this.currentPage = (this.parameter.offset / this.parameter.limit) + 1;
                this.pagesize = this.parameter.limit;
            } else {
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
            }
            //this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
            this.getCollector(this.parameter);
        },
        watch: {
            parameter() {
                localStorage.setItem("parameter", JSON.stringify(this.parameter));
            }
        }
    };

</script>

<style scoped>
    .topContent {
        float: left;
        position: relative;
        width: 100%;

        box-sizing: border-box;
        padding-top: 10px;
    }

    .con-module .el-row {
        float: left;
        width: 100%;
    }

    .btnLeft {
        padding-left: 120px;
    }

    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .el-table {
        float: left;
    }

    .status-div-stop {
        background-color: #d9534f;
        padding: 4px;
        text-align: center;
        font-size: 12px;
        color: white;
    }

    .status-div-deploy {
        background-color: #5cb85c;
        padding: 4px;
        text-align: center;
        font-size: 12px;
        color: white;
    }

    .status-div-noauth {
        background-color: #337ab7;
        width: 60px;
        height: 25px;
        line-height: 16px;
        border-radius: 0.25rem;
        padding: 4px;
        text-align: center;
        font-size: 12px;
        color: white;
    }

</style>