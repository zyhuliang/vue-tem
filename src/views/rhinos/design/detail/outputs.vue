<template>

    <div id="bm-rh-design-outputs">
        <section>
            <div class="irContent">
                <!--内容显示列表页面-->
                <template>
                    <el-table :data="tableData.content"
                              tooltip-effect="dark"
                              id="bm-rh-design-outputs-table"
                              @selection-change="handleSelectionChange"
                              style="width: 100%"
                              height="calc(100vh - 262px)"
                              v-loading="loading">
                        <el-table-column
                                type="selection">
                        </el-table-column>

                        <el-table-column label="名称" prop="name" sortable>
                            <template slot-scope="scope">
                                <a @click="datasetDialog(scope.row.dataset)">
                                    {{scope.row.name}}
                                </a>
                            </template>
                        </el-table-column>

                        <el-table-column :label="'schema'|cn" prop="schemaName" sortable>
                            <template slot-scope="scope">
                                <a @click="schemaDialog(scope.row.schema)">
                                    {{scope.row.schemaName}}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column :label="'outputSize'|cn" prop="outputSize" width="120" align="center">
                        </el-table-column>
                        <el-table-column :label="'outputRecords'|cn" prop="outputRecords" width="130" align="center">
                        </el-table-column>
                        <el-table-column :label="'action'|cn" prop="action" align="center">
                        </el-table-column>
                        <el-table-column :label="'processId'|cn" prop="flowId" align="center">
                        </el-table-column>
                        <el-table-column :label="'stepPath'|cn" prop="stepPath" align="center">
                        </el-table-column>
                        <el-table-column label="创建人" prop="creator" align="center" sortable>
                        </el-table-column>
                        <el-table-column label="修改时间" prop="lastModifiedTime" align="center" with="180"
                                         :formatter="dateFormat" sortable>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" with="80">
                            <template slot-scope="scope">
                                <el-button
                                        type="primary"
                                        size="mini"
                                        @click="dataPreviews(scope.row)"
                                >
                                    预览
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[8, 16, 50, 100]"
                            :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.totalElements">
                    </el-pagination>
                </template>
            </div>
        </section>
        <!--数据预览 dialog-->
        <preview-data-set-dialog ref="dataset"></preview-data-set-dialog>
        <!--dataset详情弹出框-->
        <el-dialog
                title="数据集详情"
                :visible.sync="dialogDatasetVisible"
                :modal-append-to-body="false"
                v-loading="loadingPreview"
                id="bm-rh-design-detail-output-table"
                class="el-body-padding">
            <el-form class="datasetDialog" id="bm-rh-ouput1-form">
                <el-form-item
                        class="item"
                        :label-width="formLabelWidth"
                        v-for="(item, index) in datasetEntity"
                        :key="item.name"
                        :label="item.name| cn"
                        :prop="'datasetEntity.' + index + '.value'">
                    <el-input v-model="item.value" auto-complete="off" id="'datasetEntity.' + index + '.value'"
                              name="item.name" :readonly=true disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type='primary' @click="dialogDatasetVisible = false" name="sureBtn">确定</el-button>
                <el-button @click="dialogDatasetVisible = false" name="cancelBtn">取消</el-button>
            </span>
        </el-dialog>
        <!--schema详情弹出框-->
        <el-dialog
                title="元数据详情"
                :visible.sync="dialogSchemaVisible"
                width="50%"
                :modal-append-to-body="false"
                class="el-body-padding">
            <el-form :model="schemaEntity" ref="schemaEntity" id="bm-rh-ouput2-form">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="schemaEntity.name" auto-complete="off" class="input-form" disabled
                              name="name"></el-input>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="schemaEntity.description" auto-complete="off" class="input-form"
                              disabled name="description"></el-input>
                </el-form-item>

                <el-form-item :label="'Schema'| cn" :label-width="formLabelWidth" prop="fields">
                    <template v-for="(field,index) in schemaEntity.fields">
                        <div class="field-grope">
                            <el-input v-model="field.name" :placeholder="'fields1'"
                                      :class="(field.type).indexOf('decimal')== -1?'input':'input-selects'"
                                      class="input" disabled name="input"></el-input>
                            <el-input v-model="field.type"
                                      :class="(field.type).indexOf('decimal')== -1?'selects-para':'selects-para'"
                                      disabled name="type"></el-input>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button type='primary'
                                   @click="dialogSchemaVisible = false" name="footer-sure">确定</el-button>
                <el-button @click="dialogSchemaVisible = false" name="footer-cancel">取消</el-button>
                    </span>
        </el-dialog>
    </div>
</template>

<script>
    //导入预览组件
    import previewDataSetDialog from '@components/collector/taskDialog/datasetDialog.vue'
    import {
        getExecutionOutputsList,
        listExecutingHistory,
        deleteTasks,
        getSchema
    } from '@api'
    import {queryObject, createParameter} from '@function/queryParameter.js';

    var parameter = queryObject();
    export default {
        components: {
            previewDataSetDialog
        },
        data() {
            return {
                multipleSelection: [],
                tableData: {},
                currentPage: 1,
                pagesize: 8,
                searchInput: "",
                loading: false,
                loadingPreview: false,
                flowId: '',
                executionId: "",
                parameter: '',
                formLabelWidth: "200px",
                schemaEntity: {},
                datasetEntity: [],
                dialogDatasetVisible: false,
                dialogSchemaVisible: false,
            }
        },
        methods: {
            //数据预览
            dataPreviews: function (row) {
                this.$refs.dataset.dataPreview(row.dataset.id, row.tenantId, row.schema)
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                var parameter = createParameter('name', query, 'LIKE').And('executionId', this.executionId, "EQUAL").Offset(0).Limit(this.pagesize).Build();
                this.getTableList(parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                var limit = this.pagesize;
                var offset = (currentPage - 1) * this.pagesize;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                var parameter = createParameter('name', query, 'LIKE').And('executionId', this.executionId, "EQUAL").Offset(offset).Limit(limit).Build();
                this.getTableList(parameter)
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
//			获取同步任务列表
            getTableList: function (para) {
                var that = this
                if (!para) {
                    para = parameter
                }
                this.loading = true;
//                getExecutionOutputs(that.executionId).then((res) => {
                getExecutionOutputsList(para).then((res) => {
                    this.tableData = res;
                    this.loading = false;
                }, error => {
                    if (error.response.status == 500) {
                        _this.$message({
                            message: error.response.data.err,
                            type: 'error',
                            duration: 1500
                        });
                    }
                });
            },
//			删除同步任务
            delTable: function delTable() {
                var tableRefresh = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                tableRefresh.$confirm('真的要删除' + tbIds.length + '个数据导入任务?', '提示', {}).then(() => {
                    deleteTasks(tbIds).then(data => {
                        tableRefresh.getTableList(parameter);
                        tableRefresh.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    }, error => {
                        if (error.response.status == 500) {
                            _this.$message({
                                message: error.response.data.err,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    })
                }).catch(() => {

                });
            },

//			name查看任务详情
            nameDialog: function (id) {
                this.$refs.taskName.nameDialog(id)
            },

            //schema 详情弹框
            schemaDialog: function (schemaId) {
                var that = this;
                //自己构建schema要展示的数据
                getSchema(schemaId).then(entity => {
                    this.dialogSchemaVisible = true
                    this.schemaEntity.name = entity.name;
                    this.schemaEntity.description = entity.description;
                    this.schemaEntity.fields = entity.fields;
                }, err => {
                    this.$message({
                        type: 'error',
                        message: err.response.data.err
                    })
                })


            },
            //dataset 详情弹框
            datasetDialog: function (entity) {
                var that = this;
                //dataset部分赋值
                that.datasetEntity = [];
                that.tmpEntity = entity;
                var objStore = entity.storageConfigurations;
                //  构造dataset显示数据
                for (var key in entity) {
                    if (typeof(entity[key]) !== 'object') {
                        that.datasetEntity.push({name: key, value: entity[key]})
                    }
                }
                for (var key in objStore) {
                    that.datasetEntity.push({name: key, value: objStore[key]})
                }
                //显示弹出框
                that.dialogDatasetVisible = true
            }
        },
        mounted() {
            var that = this;
            that.flowId = this.$route.params.id;
            if (this.$route.params.id && this.$route.params.jobId) {
                // 从监控跳过来
                var para = createParameter('flowId', this.flowId, "EQUAL").And('jobId', this.$route.params.jobId, "EQUAL").Offset(0).Limit(8).Build();
            } else {
                //根据flowId获取最近的一次executionId
                var para = createParameter('flowId', that.flowId, "EQUAL").Offset(0).Limit(8).Build();
            }
            listExecutingHistory(para).then(res => {
                that.executionId = res.content[0].id;
                var parameter = createParameter('executionId', that.executionId, 'EQUAL').Build();
                this.getTableList(parameter);
            }, error => {
                if (error.response.status == 500) {
                    _this.$message({
                        message: error.response.data.err,
                        type: 'error',
                        duration: 1500
                    });
                }
            });
        }
    };

</script>

<style lang="scss" scoped>
    .input-form {
        width: 350px;
    }

    .irContent {
        float: left;
        position: relative;
        width: 99%;
        height: 100%;
        padding: 0px 0px 0px 0px;
    }

    .field-grope {
        width: 350px;
        .input {
            width: 200px
        }
        .selects-para {
            width: 145px
        }
    }

    .content-center {
        text-align: center
    }

    .datasetDialog {
        max-height: calc(100vh - 330px);
        overflow-y: auto;
        .item {
            height: 50%;
        }
    }

</style>