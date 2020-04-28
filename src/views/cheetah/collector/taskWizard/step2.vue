<template>
    <div class="step2" id='bm-ch-col-step2-tmp' v-loading="loading">
        <el-form ref="step2Form" id="bm-ch-step2-form" :model="step2Form" label-position="top" :rules="rules"
                 class="demo-step2 demo-step2Form" @submit.prevent="onSubmit">
            <el-form-item class="dataset" label="数据集" prop="dataStore.name" :label-width="formLabelWidth">
                <el-input name="bm-ch-step2Form-dataStore-name-input" v-model="step2Form.dataStore.name"
                          placeholder="请选择内容" class="input-with-select" @input="dataSourceInquire" disabled>
                    <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSourceInquire"></el-button>
                </el-input>
            </el-form-item>

            <el-form-item label="写入模式" :label-width="formLabelWidth" v-if="step2Form.dataStore.type == 'HDFS'" required>
                <el-radio-group prop="modeTmp" name="bm-ch-step2Form-dataStore-model-radio" v-model="modeTmp">
                    <el-radio :label="true">追加</el-radio>
                    <el-radio :label="false">覆盖</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item :label-width="formLabelWidth" label="数据集详情" >
                <el-table name="bm-ch-step2Form-dataStore-table" :data="arrAttribute" v-if="arrAttribute">
                    <el-table-column label="属性名" prop="name" sortable>
                    </el-table-column>
                    <el-table-column label="属性值" prop="value" sortable>
                    </el-table-column>
                </el-table>
            </el-form-item>

        </el-form>

        <!-- Dataset dialog-->
        <el-dialog title="数据集查询" :visible.sync="dialogDataVisible" :close-on-click-modal="false"
                   :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass" append-to-body>
            <el-form>
                <data-source-inquire ref="dataSourceInquire" @thisSelectDatasetVal="getSelectDatesetVal"
                                     rootName="dataset_dir"></data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataset" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                <el-button @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import {getSchema, getDataset} from '@api';
    import task from '@jsTask/taskStep.js';


    export default {
        components: {
            dataSourceInquire,
        },
        name: 'step2',
        data: function () {
            return {
                loading:false,//加载中添加遮罩
                encryptColumnsArray:[],//存放获取的数据集加密字段
                formLabelWidth: '200px',
                dialogDataVisible: false,
                getSelvalData: [],
                arrAttribute: [],
                step2Form: {
                    fieldMapping: [],
                    schemaId: '',
                    dataStore: {}
                },
                modeTmp: true,
                rules: {
                    'dataStore.name': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                }
            }
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog(){
                //关闭dialog
                this.dialogDataVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            //data查询
            dataSourceInquire: function () {
                //弹出"data查询"层
                this.dialogDataVisible = true;
            },
            //获取子组件的data
            getSelectDatesetVal(data) {
                this.getSelvalData = data;
            },
            //加载页面时候初始化数据
            init: function () {
                var that = this;
                that.arrAttribute = [];
                //判断modeTmp是覆盖还是追加
                if (that.step2Form.dataStore && that.step2Form.dataStore.mode == 'overwrite') {
                    that.modeTmp = false;
                } else that.modeTmp = true;
                //更新展示列表
                if (that.step2Form.dataStore.id) {
                    that.getDataset(that.step2Form.dataStore.id)
                }
            },
            //获取dataset需要的字段
            getDataset: function (datasetId) {
                var that = this;
                var datasetEntity = {};
                this.loading = true
                getDataset(datasetId).then(results => {
                    this.loading = false
                    datasetEntity = results;
                    //获取dataset需要的字段
                    if (datasetEntity) {
                        //获取数据集的类型
                        var store = results.storage;
                        store = store == "JDBC" ? "DB" : store == "HBASE" ? "KV" : store;
                        var tmpEncryptKey = that.step2Form.dataStore.encryptKey? that.step2Form.dataStore.encryptKey: ""
                            that.step2Form.dataStore = Object.assign({}, datasetEntity.storageConfigurations)
                        //在dataset中添加sliceFormat字段
                        this.step2Form.dataStore.sliceFormat = datasetEntity.sliceTime
                        //添加name,id,type
                        that.step2Form.dataStore.type = store
                        that.step2Form.dataStore.name = datasetEntity.name
                        that.step2Form.dataStore.id = datasetEntity.id
                        that.step2Form.dataStore.encryptKey = tmpEncryptKey? tmpEncryptKey: datasetEntity.storageConfigurations.encryptKey//如果原本又密钥就不用数据集同步回来的密钥
                        that.encryptColumnsArray =  datasetEntity.storageConfigurations.encryptColumns ? datasetEntity.storageConfigurations.encryptColumns.split(',') : []
                        that.step2Form.countCheckField = this.encryptColumnsArray.length//加密字段的个数
                    }
                    //将object转换成array
                    var obj = that.step2Form.dataStore;
                    for (var key in obj) {
                        if (key != "mode" && key != "relativePath") {
                            if (that.step2Form.dataStore.format == "parquet" && (key == "separator" || key == "quoteChar" || key == "escapeChar")) {
                            }
                            else that.arrAttribute.unshift({name: key, value: obj[key]})
                        }
                    }
                }, err => {
                    this.loading = false
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            getSchemaFields: function(schemaId){
                var that = this;
                this.loading = true
                getSchema(schemaId).then(e => {
                    this.loading = false
                    if (e) {
                        that.step2Form.fieldMapping.length = 0;
                        that.step2Form.mappingTarget = [];
                        e.fields.forEach(function (field) {
                            var encrypt = '';
                            if(that.step2Form.countCheckField > 0){
                                for(var i = 0; i < that.step2Form.countCheckField; i++){
                                    if(field.name ==  that.encryptColumnsArray[i]){
                                        encrypt = 'ENCRYPT'
                                    }
                                }
                            }
                            that.step2Form.fieldMapping.push({
                                sourceField: "",
                                sourceType: "",
                                targetField: field.name,
                                targetType: field.type,
                                "encrypt": encrypt
                            })
                            that.step2Form.mappingTarget.push({targetField: field.name, targetType: field.type})
                        }, function (errResponse) {
                            that.$message({
                                type:'error',
                                message: errResponse.required.data.err
                            });
                        })
                    } else {
                        that.$message({
                            type:'error',
                            message: "获取目标数据字段失败，重新选择目标数据"
                        });
                    }
                }, err => {
                    this.loading = false
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            //data查询数据提交
            submitDataset: function () {
                var that = this;
                if (this.getSelvalData === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
                    //获取dataset的属性值
                    var datasetId = this.getSelvalData.id
                    that.step2Form.dataStore.encryptKey = ''
                    that.getDataset(datasetId)
                    that.arrAttribute = [];
                    this.step2Form.dataStore.name = this.getSelvalData.name;
                    //获取mapping的字段
                    var schemaId = this.getSelvalData.schemaId || this.getSelvalData.schema.id
                    //将schemaId放入带入任务种存储取来
                    that.step2Form.schemaId = schemaId
                    setTimeout(()=>{
                        that.getSchemaFields(schemaId);
                    }, 100)
                    // //获取dataset的属性值
                    // var datasetId = this.getSelvalData.id
                    // that.getDataset(datasetId)
                    //关闭"data查询"层
                    this.cancelDatasetDialog();

                }
            },
        },
        mounted() {
            if (localStorage.taskEntity) {
                //获取全局的entity
                this.step2Form = JSON.parse(localStorage.taskEntity);
                //获取采集器的id
                var httpArr = window.location.href.split('/')
                this.step2Form.collecterId = httpArr[httpArr.indexOf('step2') + 1]
                this.step2Form.resourceId = httpArr[httpArr.indexOf('step2') + 2]
                this.init();
            }
        },
        beforeRouteLeave: function (to, from, next) {
            var that = this;
            if (localStorage.taskEntity) {
                //获取全局的entity
                var entity = JSON.parse(localStorage.taskEntity);
                //将局部的entity合并到全局的entity中
                that.step2Form = that.copyObject(entity, that.step2Form)
                if (that.modeTmp) {
                    that.step2Form.dataStore.mode = "append"
                } else that.step2Form.dataStore.mode = "overwrite";
                //保存全局的entity到storage
                localStorage.taskEntity = JSON.stringify(that.step2Form);

            }
            //如果在向导中跳转
            if (to.path.substr(0, 16) == '/taskWizard/step') {
                var fromStep = from.path.charAt(from.path.indexOf('taskWizard/step') + 15)
                var toStep = to.path.charAt(to.path.indexOf('taskWizard/step') + 15)
                if (fromStep > toStep) {
                    next();
                } else
                //如果验证都通过才可以下一步
                    that.$refs.step2Form.validate((valid) => {
                        if (valid) {
                            next();
                        } else {
                            //获取从第几步到第几步
                            var fromStep = from.path.charAt(from.path.indexOf('taskWizard/step') + 15)
                            task.$emit('taskNextStep', fromStep)
                            return false;
                        }
                    })
            } else {
                localStorage.removeItem('taskEntity');
                next();
            }
        },
    }
</script>
<style scoped lang="scss">
    .step2 {
        height: calc(100vh - 187px);
        overflow-y: auto;
        .demo-step2 {
            margin-left: 25%;
            width: 50%;
        }
    }
</style>
