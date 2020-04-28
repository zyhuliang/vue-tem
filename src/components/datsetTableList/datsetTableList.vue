<template>
    <div>
        <section>
            <div  class="irContent">
                <el-row class="btnClass">
                    <div class="btn-right">
                        <el-button type="info" id='bm-com-datsetTableList-datsetTableList-delete-button' @click="delTable" :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-directory-delete"></i>删除</el-button>
                    </div>
                </el-row>
                <!--内容显示列表页面-->
                <template>
                    <el-table :data="tableData.content"
                              tooltip-effect="dark"
                              @selection-change="handleSelectionChange"
                              style="width: 100%"
                              height="calc(100vh - 399px)"
                              id='bm-com-datsetTableList-datsetTableList-table'
                              v-loading="loading">
                        <el-table-column
                                type="selection">
                        </el-table-column>

                        <el-table-column label="名称" prop="name" >
                            <template slot-scope="scope">
                                <a @click="datasetDialog(scope.row)">
                                    {{scope.row.name}}
                                </a>
                            </template>
                        </el-table-column>

                        <el-table-column :label="'schema'|cn" prop="dataset.schema.name" >
                            <template slot-scope="scope">
                                <a @click="schemaDialog(scope.row.schema)">
                                    {{scope.row.schema.name}}
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column  label="创建人" prop="creator" align="center" >
                        </el-table-column>
                        <el-table-column label="修改时间" prop="lastModifiedTime" align="center" min-with="140" :formatter="dateFormat" >
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[8, 16, 50, 100]"
                            :page-size="limit"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.totalElements">
                    </el-pagination>
                </template>
            </div>
        </section>

        <!--dataset详情弹出框-->
        <div v-if="dialogDatasetVisible == true" class="dialogInterceptor" id="bm-com-dataset-table-datset-dal-dialog">
            <div class="diHeader">
                <h3>dataset 详情</h3>
                <span @click="dialogDatasetVisible = false" class="el-icon-close"></span>
            </div>
            <div class="diContent">
                <el-form class="datasetDialog" id="bm-com-dataset-table-datset-dal-form">
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
                    <el-form-item class="content-center item">
                        <el-button
                                round
                                type="primary"
                                size="mini"
·                                @click="dataPreview(tmpEntity.id, tmpEntity.tenantId)"
                        >
                            刷新数据
                        </el-button>
                        <!--数据预览 dialog-->
                        <span v-if="haveData">
                             <el-table :data="rowCollection" height="calc(100vh - 400px)">
                                <el-table-column v-for="(col, i) in cols" :key="col+i" :show-overflow-tooltip="true"
                                                 :prop="col.name" :label="col.name">
                                </el-table-column>
                            </el-table>
                        </span>
                        <span v-if="!haveData">
                        <div>
                            {{errorMessage}}
                        </div>
                    </span>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="diFooter">
                <el-button type="primary" @click="dialogDatasetVisible = false">确定</el-button>
                <el-button @click="dialogDatasetVisible = false">取消</el-button>
            </div>
        </div>
        <!--schema详情弹出框-->
        <div v-if="dialogSchemaVisible == true" class="dialogInterceptor" id="bm-com-dataset-table-schema-dal-dialog">
            <div class="diHeader">
                <h3>schema 详情</h3>
                <span @click="dialogSchemaVisible = false" class="el-icon-close"></span>
            </div>
            <div class="diContent">
                <el-form class="datasetDialog" :model="schemaEntity" ref="schemaEntity" id="bm-com-dataset-table-schame-dal-form">
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="schemaEntity.name" auto-complete="off" class="input-form" disabled></el-input>
                    </el-form-item>

                    <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                        <el-input v-model="schemaEntity.description" auto-complete="off" class="input-form"
                                  disabled></el-input>
                    </el-form-item>

                    <el-form-item :label="'Schema'| cn" :label-width="formLabelWidth" prop="fields">
                        <template v-for="(field,index) in schemaEntity.fields">
                            <div class="field-grope">
                                <el-input v-model="field.name" :placeholder="'fields1'"
                                          :class="(field.type).indexOf('decimal')== -1?'input':'input-selects'"
                                          class="input" disabled></el-input>
                                <el-input v-model="field.type"
                                          :class="(field.type).indexOf('decimal')== -1?'selects-para':'selects-para'"
                                          disabled></el-input>
                            </div>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="diFooter">
                <el-button type="primary" @click="dialogSchemaVisible = false">确定</el-button>
                <el-button @click="dialogSchemaVisible = false">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    import {usedContentSchema,deleteDataset,getDataset,previewDataset,getSchema } from '@api'
    export default {
        props:['data', 'resourceId'],
        watch: {
            data(newValue, oldValue) {
                this.tableData = newValue;
            },
        },
        data() {
            return {
                cols: [],
                multipleSelection: [],
                tableData: {},
                limit:8,
                offset:0,
                currentPage: 1,
                loading: false,
                loadingPreview: false,
                formLabelWidth: "200px",
                fieldTypes: ["string", "byte", "short", "bigint", "int", "float", "double", "boolean", "date", "timestamp", "binary", "decimal"],
                schemaEntity: {},
                datasetEntity: [],
                dialogDatasetVisible: false,
                dialogSchemaVisible: false,
                rowCollection:[],
                id:"",
                tenantId:"",
                haveData: true,
                errorMessage:"",
                previewDataSet:''
            }
        },
        methods: {
            handleSizeChange: function (size) {
                this.limit = size;
                this.getTableList()
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.offset = (currentPage - 1) * this.limit;
                this.getTableList()
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
//			获取同步任务列表
            getTableList: function () {
                this.loading = true;
                usedContentSchema(this.resourceId, this.limit, this.offset).then((res) => {
                    this.tableData = res;
                    this.loading = false;
                }, error => {
                    this.loading = false;
                    if(error.response.status == 500) {
                        _this.$message({
                            message: error.response.data.err,
                            type: 'error',
                            duration: 1500
                        });
                    }
                });
            },
            //删除
            delTable: function delTable() {
                var tableRefresh = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                tableRefresh.$confirm('真的要删除' + tbIds.length + '个数据集?', '提示', {}).then(() => {
                    deleteDataset(tbIds).then(data => {
                        tableRefresh.getTableList();
                        tableRefresh.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    }, error => {
                        if(error.response.status == 500) {
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

			//name查看任务详情
            nameDialog: function (id) {
                this.$refs.taskName.nameDialog(id)
            },

            //schema 详情弹框
            schemaDialog: function (entity) {
                var that = this;
                that.dialogSchemaVisible = true
                //自己构建schema要展示的数据
                that.schemaEntity.name = entity.name;
                that.schemaEntity.description = entity.description;
                that.schemaEntity.fields = entity.fields;
            },
            //数据预览
            dataPreview: function (id, tenantId) {
                var that = this ;
                that.loadingPreview = true;
                that.id = id
                that.tenantId = tenantId
//				获取resource的entity
                getDataset(id, tenantId).then((resourceEntity)=>{
                    var datasetId = resourceEntity.id
                    var schemaId = resourceEntity.schema?resourceEntity.schemaId || resourceEntity.schema.id:""
//                    预览dataset的data
                    var para = {'rows':'50', 'tenant': tenantId}
                    previewDataset(datasetId,para).then((datasetEntity)=>{
                        getSchema(schemaId).then((schemaEntity)=>{
                            that.loadingPreview = false;
                            that.rowCollection = datasetEntity;
                            that.cols = schemaEntity.fields
                            that.dialogPreviewVisible = true;
                            that.haveData = true
                        },error =>{
                            that.loadingPreview = false;
                            that.dialogPreviewVisible = true;
                            that.haveData = false
                            that.errorMessage = error.response.data.err
                        })
                    },error =>{
                        that.loadingPreview = false;
                        that.dialogPreviewVisible = true;
                        that.haveData = false
                        that.errorMessage = error.response.data.err
                    })
                },error =>{
                    that.loadingPreview = false;
                    that.dialogPreviewVisible = true;
                    that.haveData = false
                    that.errorMessage = error.response.data.err
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
                    if(typeof(entity[key]) !== 'object'){
                        that.datasetEntity.push({name: key, value: entity[key]})
                    }
                }
                for (var key in objStore) {
                    that.datasetEntity.push({name: 'source.'+key, value: objStore[key]})
                }
                that.dataPreview(that.tmpEntity.id, that.tmpEntity.tenantId);
                //显示弹出框
                that.dialogDatasetVisible = true
            }
        },
        created() {
            this.tableData = this.data;
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
        width: 100%;
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
    .dialogInterceptor{
        position: fixed;
        left: 50%;
        top: 10%;
        width: 80%;
        height: calc(80vh);
        margin-left: -40%;
        background-color: #ffffff;
        z-index: 2002
    }
    .dialogInterceptor .diHeader {
        z-index: 100;
        float: left;
        width: 100%;
        height: 45px;
        line-height: 45px;
        background-color: #4c4c51;
    }
    .dialogInterceptor .diHeader h3{
        float: left;
        margin: 0px;
        width: 60%;
        padding: 0px 0px 0px 20px;
        font-weight: normal;
        color: #ffffff;
    }
    .dialogInterceptor .diHeader span{
        color: #ffffff;
        float: right;
        margin-right: 20px;
        margin-top: 14px;
        font-size: 16px;
        cursor: pointer;
    }
    .dialogInterceptor .diFooter{
        float: right;
        width: 100%;
        border-top: 1px solid #eeeeee;
        padding: 15px;
        box-sizing: border-box;
        text-align: right;
        bottom: 0px;
    }
    .dialogInterceptor .diContent{
        float: left;
        width: 100%;
        height: calc(90% - 50px);
        padding-top: 5px;
        box-sizing: border-box;
    }

</style>
