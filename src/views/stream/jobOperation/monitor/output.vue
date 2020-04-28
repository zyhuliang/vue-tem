<template>
    <div>
        <section>
            <div class="qa-content">
                <!--内容显示列表页面-->
                <template>
                    <el-table :data="tableData.content"
                              tooltip-effect="dark"
                              class="class-table"
                              @selection-change="handleSelectionChange"
                              style="width: 100%" height="calc(100vh - 220px)">

                        <el-table-column label="名称" prop="name" sortable>
                            <template slot-scope="scope">
                                <a @click="datasetDialog(scope.row)">
                                    {{scope.row.name}}
                                </a>
                            </template>
                        </el-table-column>

                        <el-table-column :label="'Schema'| cn" prop="schema.name" sortable>
                            <template slot-scope="scope">
                                <a @click="schemaDialog(scope.row.schema)">
                                    {{scope.row.schema.name}}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="dataset.storage"
                                label="类型"
                                sortable="custom"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="dataset.path"
                                label="路径"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="dataset.version"
                                label="版本"
                                sortable="custom"
                                align="center"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="创建人" prop="dataset.creator" align="center" sortable>
                        </el-table-column>
                        <el-table-column label="修改时间" prop="dataset.lastModifiedTime" align="center" with="50" :formatter="dateFormat" sortable>
                        </el-table-column>
                        <el-table-column width="200" key= '1' label="操作" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button
                                        round
                                        type="primary"
                                        size="mini"
                                        @click="dataPreview(scope.row)"
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
        <!--dataset详情弹出框-->
        <el-dialog
                title="dataset 详情"
                :visible.sync="dialogDatasetVisible"
                :modal-append-to-body="false"
                width="50%"
                v-loading="loading"
                id="bm-stream-jobTemplate-monitor-table"
                class="el-body-padding">
            <el-form class="datasetDialog" id="bm-datasetd1-form">
                <el-form-item
                        class="item"
                        :label-width="formLabelWidth"
                        v-for="(item, index) in datasetEntity"
                        :key="item.name"
                        :label="item.name"
                        :prop="'datasetEntity.' + index + '.value'">
                    <el-input v-model="item.value" auto-complete="off" id="'datasetEntity.' + index + '.value'"
                              name="item.name" :readonly=true disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type='primary' @click="dialogDatasetVisible = false">确定</el-button>
                <el-button @click="dialogDatasetVisible = false">取消</el-button>
            </span>
        </el-dialog>
        <!--schema详情弹出框-->
        <el-dialog
                title="schema 详情"
                :visible.sync="dialogSchemaVisible"
                width="50%"
                :modal-append-to-body="false"
                class="el-body-padding">

            <div class='div-schema-bady' >
                <el-form :model="schemaEntity" ref="schemaEntity" id="bm-output-form">
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="schemaEntity.name" auto-complete="off" class="input-form" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                        <el-input v-model="schemaEntity.description" auto-complete="off" class="input-form"
                                  disabled></el-input>
                    </el-form-item>

                    <el-form-item :label="'Schema'| cn" :label-width="formLabelWidth" prop="fields">
                        <div class="div-fields-height">
                            <template v-for="(field,index) in schemaEntity.fields" >
                                <div class="field-grope">
                                    <el-input v-model="field.name" :placeholder="'fields1'"
                                              :class="(field.type).indexOf('decimal')== -1?'input':'input-selects'"
                                              class="input" disabled></el-input>
                                    <el-input v-model="field.type"
                                              :class="(field.type).indexOf('decimal')== -1?'selects-para':'selects-para'"
                                              disabled></el-input>
                                </div>
                            </template>
                        </div>

                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                        <el-button  type='primary' @click="dialogSchemaVisible = false">确定</el-button>
                        <el-button @click="dialogSchemaVisible = false">取消</el-button>
                    </span>
        </el-dialog>
        <!--数据预览 dialog-->
        <preview-data-set ref="dataset"></preview-data-set>
    </div>
</template>

<script>
    import moment from "moment"//时间格式化
    //导入查询组件
    import searchDateData from '@components/collectorSearch/searchDateData.vue'
    import searchTableData from '@components/collectorSearch/searchTableData.vue'
    import {queryObject, createParameter} from '@components/function/queryParameter.js';
    //导入预览组件
    import previewDataSet from '@components/collector/taskDialog/datasetDialog.vue'

    var parameter = queryObject();
    export default {
        components: {
            searchDateData,
            searchTableData,
            previewDataSet
        },
        data() {
            return {
                multipleSelection: [],
                tableData: {},
                currentPage: 1,
                pagesize: 8,
                searchInput: "",
                loading: false,
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
            handleSizeChange: function (size) {
                this.pagesize = size;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                var parameter = createParameter('name', query, 'LIKE').And('executionId', this.executionId, "EQUAL").Offset(0).Limit(this.pagesize).Build();
                //this.getTableList(parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                var limit = this.pagesize;
                var offset = (currentPage - 1) * this.pagesize;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                var parameter = createParameter('name', query, 'LIKE').And('executionId', this.executionId, "EQUAL").Offset(offset).Limit(limit).Build();
                //this.getTableList(parameter)
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
			//获取同步任务列表
            getTableList: function (para) {
                //通过session获取当前sink的dataset
                this.row = JSON.parse(sessionStorage.getItem('streamProgressRow'))
                var datasets = []
                //将dataset变成map
                for(var i = 0;  i < this.row.jobDesc.tableProfiles.length; i++){
                    if(this.row.jobDesc.tableProfiles[i].tableType == 'result'){
                        datasets.push(this.row.jobDesc.tableProfiles[i])
                    }
                }
                this.tableData.content = datasets
            },

			//name查看任务详情
            nameDialog: function (id) {
                this.$refs.taskName.nameDialog(id)
            },

            //dataset 详情弹框
            datasetDialog: function (entity) {
                //dataset部分赋值
                this.datasetEntity = [];
                entity = entity.dataset;
                this.tmpEntity = entity;
                var objStore = entity.storageConfigurations;
                //  构造dataset显示数据
                for (var key in entity) {
                    if(typeof(entity[key]) !== 'object'){
                        this.datasetEntity.push({name: key, value: entity[key]})
                    }
                }
                for (var key in objStore) {
                    this.datasetEntity.push({name: key, value: objStore[key]})
                }
                //显示弹出框
                this.dialogDatasetVisible = true
            },

            //schema 详情弹框
            schemaDialog: function (entity) {
                this.dialogSchemaVisible = true
                //自己构建schema要展示的数据
                this.schemaEntity.name = entity.name;
                this.schemaEntity.description = entity.description;
                this.schemaEntity.fields = entity.fields;
            },

            //数据预览
            dataPreview: function (row) {
                this.$refs.dataset.dataPreview(row.dataset.id, row.dataset.tenantId, row.schemaId || row.schema.id)
            },

			//时间格式
            dateFormat: function (row, column) {
                var properys = [];
                var date = '';
                //如果返回的是个字符串带有.分割的，就要做处理
                if(column.property.indexOf('.') > -1){
                    properys = column.property.split('.')
                    date = row[properys[0]][properys[1]];
                }else{
                    date = row[column.property];
                }
                if (date == undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD HH:mm:ss");
            },
        },
        created() {
            //在创建之后就获取row的值
            this.row = JSON.parse(sessionStorage.getItem('streamProgressRow'))
            this.getTableList();
        },
    };

</script>

<style lang="scss" scoped>
    .input-form {
        width: 350px;
    }

    .irContent {
        float: left;
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0px 0px 0px 0px;
    }

    .div-fields-height{
        height: calc(80vh - 350px);
        overflow-y: auto;
        .field-grope {
            width: 350px;
            .input {
                width: 200px
            }
            .selects-para {
                width: 145px
            }
        }
    }
    .content-center{
        text-align: center
    }
    .datasetDialog{
        max-height: calc(100vh - 330px);
        overflow-y: auto;
        .item{
            height: 50%;
        }
    }
    .div-schema-bady {
        height: calc(100vh - 400px);
    }
    .class-table {
        width: calc(100vw - 20px);
        height: calc(100vh - 160px);
        margin: 10px;
    }

</style>
