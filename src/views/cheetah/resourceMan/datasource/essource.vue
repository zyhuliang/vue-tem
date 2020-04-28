<template>
    <section class="add-resource " id='bm-ch-resMan-essource-tmp'>
        <div class="res-data" v-loading="loading">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew ? '新建 ' : '编辑 '}}{{'ElasticSearch' | cn}}数据源</h4>
                </div>
            </el-row>
            <el-form id="bm-ch-resourceMan-essource-form" :model="entity" ref="entity" :rules="rules"
                     class="data-content">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input name="bm-ch-resourceMan-essource-name-input" v-model="entity.name" auto-complete="off"
                              class="input-form" :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input name="bm-ch-resourceMan-essource-description-input" v-model="entity.description"
                              auto-complete="off" class="input-form"></el-input>
                </el-form-item>
                <hr class="hr-res-form">
                <el-form-item label="集群名称" :label-width="formLabelWidth" prop="attributes.clusterName">
                    <el-input name="bm-ch-resourceMan-essource-attributes-clusterName-input"
                              v-model="entity.attributes.clusterName" auto-complete="off" class="input-form"
                              :placeholder="'必填'"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth" prop="attributes.ipAddresses">
                    <el-input name="bm-ch-resourceMan-essource-attributes-ipAddresses-input"
                              v-model="entity.attributes.ipAddresses" auto-complete="off" class="input-form"
                              :placeholder="'必填'"></el-input>
                </el-form-item>
                <el-form-item label="索引" :label-width="formLabelWidth" prop="attributes.index">
                    <el-input name="bm-ch-resourceMan-essource-attributes-index-input" v-model="entity.attributes.index"
                              auto-complete="off" class="input-form" :placeholder="'必填'"></el-input>
                </el-form-item>
                <el-form-item label="索引类型" :label-width="formLabelWidth" prop="attributes.indexType">
                    <el-input name="bm-ch-resourceMan-essource-attributes-indexType-input"
                              v-model="entity.attributes.indexType" auto-complete="off" class="input-form"
                              :placeholder="'必填'"></el-input>
                </el-form-item>
                <el-form-item label="版本号" :label-width="formLabelWidth" prop="attributes.version">
                    <el-select name="bm-ch-resourceMan-essource-attributes-version-select"
                               v-model="entity.attributes.version" auto-complete="off" placeholder="请选择(必填)">
                        <el-option
                                v-for="item in ['5.x']"
                                :key="item"
                                :name="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <hr class="hr-res">
            <div slot="footer" class="data-footer">
                <el-button type="primary" @click="save()" name="bm-ch-resourceMan-essource-save-ok">确定</el-button>
                <el-button @click="cancel()" name="bm-ch-resourceMan-essource-cancel-cancel">取消</el-button>
            </div>
        </div>
    </section>
</template>

<script>
    import {postDatasource, getDatasource, putDatasource} from '@api'
    import resIn from '@components/dataTree/resNav.js'

    export default {
        name: 'dataSource',
        data() {
            return {
                loading: false,
                formLabelWidth: "200px",
                isNew: true,
                selectedNode: "",
                entity: {
                    id: "",
                    name: "",
                    type: "ES",
                    description: "",
                    attributes: {
                        clusterName: "",
                        ipAddresses: "",
                        index: "",
                        indexType: "",
                        version: "5.x"
                    },
                    owner: ""
                },
                rules: {
                    name: [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.clusterName': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.ipAddresses': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.index': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.indexType': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],

                }
            }
        },
        methods: {
            //初始化
            init: function (node) {
                this.loading = true;
                this.entity.id = this.$route.params.id
                this.isNew = false;
                getDatasource(this.entity.id).then(res => {
                    this.loading = false;
                    this.entity = Object.assign({}, this.entity, res)
                }, err => {
                    this.loading = false;
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            //取消按钮
            cancel: function () {
                this.$router.push('/resourceMan')
                resIn.$emit('refreshList', false, 'datasource');
            },
            //确定回调
            save: function () {
                this.$refs.entity.validate((valid) => {
                    if (valid) {
                        var addOrEditDataSource = this.isNew ? postDatasource(this.entity) : putDatasource(this.entity.id, this.entity);
                        //提交 HTTP datasource
                        addOrEditDataSource.then(data => {
                            //提交之后获取列
                            this.$router.push({path: '/resourceMan'});
                            resIn.$emit('refreshList', false, 'datasource');
                        }, error => {
                            var err = error.response.data.err
                            if (err.indexOf('Duplicate') > -1)
                                err = '保存失败，此名称已存在'
                            this.$message({
                                message: err,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted() {
            //判断是新建
            if (this.$route.params.id == 'new') {
                var data = {resource: {id: this.$route.params.parentId}}
                this.entity = Object.assign({}, this.entity, data)
                this.selectedNode = this.$route.params.node
                this.entity.owner = this.selectedNode ? this.selectedNode.owner : ''
            } else this.init();
        }
    }
</script>

<style lang="scss" scoped>
    .btn-left {
        float: left;
        h4 {
            margin: 10px 0px 0px 10px;
        }
    }

    .input-form {
        width: 350px;
    }

    .add-resource {

        .res-data {

            .el-form {
                .el-form-item .el-select {
                    width: 350px;
                }
            }
        }
    }
</style>
