<template>
    <section class="add-resource " id='bm-ch-resMan-ftpsource-tmp'>
        <div class="res-data" v-loading="loading">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew ? '新建 ' : '编辑 '}}{{'FTP' | cn}}数据源</h4>
                </div>
            </el-row>

            <el-form id="bm-ch-resourceMan-ftpsource-form" :model="entity" ref="entity" :rules="rules"
                     class="data-content">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input name='bm-ch-resMan-ftpsource-name-input' v-model="entity.name" auto-complete="off"
                              class="input-form" :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input name='bm-ch-resMan-ftpsource-description-input' v-model="entity.description"
                              auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <hr class="hr-res-form">

                <el-form-item label="主机" :label-width="formLabelWidth" prop="attributes.host">
                    <el-input name='bm-ch-resMan-ftpsource-attributes-host-input' v-model="entity.attributes.host"
                              auto-complete="off" class="input-form" :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item label="端口" :label-width="formLabelWidth" prop="attributes.port">
                    <el-input name='bm-ch-resMan-ftpsource-attributes-port-input' v-model="entity.attributes.port"
                              auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <el-form-item label="用户名" :label-width="formLabelWidth" prop="attributes.username">
                    <el-input name='bm-ch-resMan-ftpsource-attributes-username-input'
                              v-model="entity.attributes.username" auto-complete="off" class="input-form"
                              :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item label="密码" :label-width="formLabelWidth" prop="attributes.password">
                    <el-input name='bm-ch-resMan-ftpsource-attributes-password-input' type="password"
                              v-model="entity.attributes.password" auto-complete="off" class="input-form"
                              :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item :label="'dir'| cn" :label-width="formLabelWidth" prop="attributes.dir">
                    <el-input name='bm-ch-resMan-ftpsource-attributes-dir-input' v-model="entity.attributes.dir"
                              auto-complete="off" class="input-form" :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item label="字段分割符" :label-width="formLabelWidth" prop="attributes.fieldsSeparator">
                    <el-input name='bm-ch-resMan-ftpsource-attributes-fieldsSeparator-input'
                              v-model="entity.attributes.fieldsSeparator" auto-complete="off" class="input-form"
                              :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item label="目录递归" :label-width="formLabelWidth" prop="attributes.recursive">
                    <el-select name='bm-ch-resMan-ftpsource-attributes-recursive-input'
                               v-model="entity.attributes.recursive">
                        <el-option
                                v-for="item in ['true','false']"
                                :key="item"
                                :name="item"
                                :label="item | cn"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'secure'| cn" :label-width="formLabelWidth" prop="attributes.secure">
                    <el-select name='bm-ch-resMan-ftpsource-attributes-secure-input' v-model="entity.attributes.secure">
                        <el-option
                                v-for="item in ['true','false']"
                                :key="item"
                                :name="item"
                                :label="item | cn"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="跳过首行" :label-width="formLabelWidth" prop="attributes.skipHeader">
                    <el-select name='bm-ch-resMan-ftpsource-attributes-skipHeader-input'
                               v-model="entity.attributes.skipHeader">
                        <el-option
                                v-for="item in ['true','false']"
                                :key="item"
                                :name="item"
                                :label="item | cn"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="data-footer">
                <el-button type="primary" @click="save()" name="bm-ch-resourceMan-ftpsource-save-ok">确定</el-button>
                <el-button @click="cancel()" name="bm-ch-resourceMan-ftpsource-cancel-cancel">取消</el-button>
            </div>
        </div>
    </section>
</template>

<script>
    import {postDatasource, getDatasource, putDatasource} from '@api'
    import resIn from '@components/dataTree/resNav.js'
    import { encrypt,decrypt } from '@components/encryption/aes.js'

    export default {
        name: 'dataSource',
        data() {
            return {
                loading: false,
                formLabelWidth: "200px",
                selectNode: "",
                isNew: true,
                selectedNode: "",
                entity: {
                    id: "",
                    name: "",
                    type: "FTP",
                    description: "",
                    attributes: {
                        host: "",
                        port: "21",
                        username: "anonymous",
                        password: "",
                        recursive: 'true',
                        secure: 'false',
                        skipHeader: 'false',
                        dir: "",
                        fieldsSeparator: ","
                    },
                    owner: ""
                },
                rules: {
                    name: [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.host': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.port': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.username': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.password': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.dir': [
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
                    //assgin无法实现深度拷贝，所以将attributes单独赋值
                    var entityAttributes = Object.assign({}, this.entity.attributes, res.attributes)
                    this.entity = Object.assign({}, this.entity, res)
                    this.entity.attributes = entityAttributes
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
                        //去掉tablename字段
                        if (this.entity.tableName)
                            delete this.entity.tableName;
                        //ftp需要username字段而不是user字段
                        if (this.entity.attributes.user) {
                            this.entity.attributes.username = this.entity.attributes.user
                            delete this.entity.attributes.user;
                        }
                        //判断是更新还是新建
                        var addOrEditDataSource = this.isNew ? postDatasource(this.entity) : putDatasource(this.entity.id, this.entity);
                        
                        this.entity.attributes.password = encrypt(this.entity.attributes.password)?this.entity.attributes.password: encrypt(this.entity.attributes.password)
                        //提交 FTP datasource
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
            .el-form-item .el-select {
                width: 350px;
            }
        }
    }
</style>
