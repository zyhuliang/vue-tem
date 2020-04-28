<template>
    <div class="step2" id='bm-ch-filesys-step2-tmp'>
        <el-form id="bm-ch-file-step2-form" ref="step2Form" :rules="rules" :model="step2Form" label-position="top"
                 class="demo-step2 demo-step2Form" @submit.prevent="onSubmit">

            <el-form-item label="path" :label-width="formLabelWidth" prop="dataStore.path">
                <el-input name="bm-ch-file-step2Form-dataStore-filename-path" type="input "
                          v-model="step2Form.dataStore.path" auto-complete="off" placeholder="请输入path"></el-input>
            </el-form-item>

            <el-form-item label="是否覆盖" :label-width="formLabelWidth">
                <el-radio-group name="bm-ch-file-step2Form-dataStore-filename-radio" v-model="overwrite">
                    <el-radio :label="false">否</el-radio>
                    <el-radio :label="true">是</el-radio>
                </el-radio-group>
            </el-form-item>

        </el-form>

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
                formLabelWidth: '200px',
                dialogDataVisible: false,
                getSelvalData: [],
                arrAttribute: [],
                step2Form: {
                    fieldMapping: [],
                    dataStore: {},
                },
                modeTmp: true,
                path: "",
                overwrite: false,
                rules: {
                    'dataStore.path': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                }
            }
        },
        watch: {
            step2Form: {
                handler: function () {
                    //          store.commit('setSignForm', this.step2Form);
                },
            }
        },
        methods: {
            //data查询
            dataInquire: function () {
                //弹出"data查询"层
                this.dialogDataVisible = true;
            },
            //获取子组件的data
            getSelectDatesetVal(data) {
                this.getSelvalData = data;
            },
            init: function () {
                var that = this;
                that.arrAttribute = [];
                //将object转换成array
                var obj = that.step2Form.dataStore;
                that.path = obj.path
                for (var key in obj) {
                    if (key != "mode" && key != "relativePath") {
                        if (that.step2Form.dataStore.format == "parquet" && (key == "separator" || key == "quoteChar" || key == "escapeChar")) {
                        }
                        else that.arrAttribute.unshift({name: key, value: obj[key]})
                    }
                }
                //判断modeTmp是覆盖还是追加
                /*if(that.step2Form.dataStore && that.step2Form.dataStore.mode == 'overwrite'){
                    that.modeTmp = false;
                }else  that.modeTmp = true;*/

                if (that.step2Form.dataStore && that.step2Form.dataStore.overwrite && that.step2Form.dataStore.overwrite == 'false') {
                    that.overwrite = false
                } else if (that.step2Form.dataStore && that.step2Form.dataStore.overwrite == 'true') {
                    that.overwrite = true
                }

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
                    that.arrAttribute = [];
                    this.step2Form.dataStore.name = this.getSelvalData.name;

                    //获取mapping的字段
                    var schemaId = this.getSelvalData.schemaId || this.getSelvalData.schema.id
                    getSchema(schemaId).then(e => {
                        if (e) {
                            that.step2Form.fieldMapping.length = 0;
                            that.step2Form.mappingTarget = [];
                            e.fields.forEach(function (field) {
                                that.step2Form.fieldMapping.push({
                                    sourceField: "",
                                    sourceType: "",
                                    targetField: field.name,
                                    targetType: field.type
                                })
                                that.step2Form.mappingTarget.push({targetField: field.name, targetType: field.type})
                            }, function (errResponse) {
                                alert(errResponse);
                            })
                        } else alert("获取目标数据字段失败，重新选择目标数据");
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })

                    //获取dataset的属性值
                    var datasetId = this.getSelvalData.id
                    //关闭"data查询"层
                    this.dialogDataVisible = false;
                    var datasetEntity = {};
                    getDataset(datasetId).then(results => {
                        datasetEntity = results;
                        //获取dataset需要的字段
                        if (datasetEntity) {
                            //获取数据集的类型
                            var store = results.storage;
                            store = store == "JDBC" ? "DB" : store == "HBASE" ? "KV" : store == "KAFKA" ? "MQ" : store;

                            that.step2Form.dataStore = Object.assign({}, datasetEntity.storageConfigurations)
                            //添加name,id,type
                            if (datasetEntity) {
                                that.step2Form.dataStore.type = store
                                that.step2Form.dataStore.name = datasetEntity.name
                                that.step2Form.dataStore.id = datasetEntity.id
                            }
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
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                    console.log(this.getSelvalData)
                }
            },
            onSubmit: function () {
                console.log('submit!');
            },

        },
        mounted() {
            if (localStorage.taskEntity) {
                //获取全局的entity
                this.step2Form = JSON.parse(localStorage.taskEntity);
                if (this.step2Form.dataStore.overwrite == true || this.step2Form.dataStore.overwrite == false) {
                    this.overwrite = this.step2Form.dataStore.overwrite
                }
                console.log(this.step2Form)
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
                /*if(that.path){
                    that.step2Form.dataStore.path = that.path
                }
               */
                if (that.overwrite == true || that.overwrite == false) {
                    that.step2Form.dataStore.overwrite = that.overwrite
                }
                //保存全局的entity到storage
                localStorage.taskEntity = JSON.stringify(that.step2Form);

            }

            if (to.path.substr(0, 16) != '/taskWizard/step' && to.path != '/synchronization' && '/collector'.indexOf(to.path) > -1) {
                localStorage.removeItem('taskEntity');
            } else if (to.path == '/fileSynchronization') {
                next();
            } else {
                //获取从第几步到第几步
                var fromStep = from.path.charAt(from.path.indexOf('fileTaskWizard/step') + 19)
                var toStep = to.path.charAt(to.path.indexOf('fileTaskWizard/step') + 19)
                if (fromStep > toStep) {
                    next();
                } else {
                    //如果验证都通过才可以下一步
                    that.$refs.step2Form.validate((valid) => {
                        if (valid) {
                            next();
                        } else {
                            //下一步
                            task.$emit('fileTaskNextStep', fromStep)
                            return false;
                        }
                    })
                }
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
