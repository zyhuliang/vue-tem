<template>
    <section class="add-resource " id='bm-ch-resMan-mongodbsource-tmp'>
        <div class="res-data" v-loading="loading">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew ? '新建 ' : '编辑 '}}{{'MONGODB' | cn}}数据源</h4>
                </div>
            </el-row>
            <el-form id="bm-ch-resourceMan-mongoDBsource-form" :model="entity" ref="entity" :rules="rules"
                     class="data-content">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input name="bm-ch-resourceMan-mongoDBsource-name-input" v-model="entity.name"
                              auto-complete="off" class="input-form" :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input name="bm-ch-resourceMan-mongoDBsource-description-input" v-model="entity.description"
                              auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <hr class="hr-res-form">

                <el-form-item label="地址" :label-width="formLabelWidth" prop="attributes.address">
                    <el-input name="bm-ch-resourceMan-mongoDBsource-attributes-address-input"
                              v-model="entity.attributes.address" auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <el-form-item label="端口" :label-width="formLabelWidth" prop="attributes.port">
                    <el-input name="bm-ch-resourceMan-mongoDBsource-attributes-port-input"
                              v-model="entity.attributes.port" auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <el-form-item label="用户名" :label-width="formLabelWidth" prop="attributes.username">
                    <el-input name="bm-ch-resourceMan-mongoDBsource-attributes-username-input"
                              v-model="entity.attributes.username" auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <el-form-item label="密码" :label-width="formLabelWidth" prop="attributes.password">
                    <el-input name="bm-ch-resourceMan-mongoDBsource-attributes-password-input" type="password"
                              v-model="entity.attributes.password" auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <el-form-item label="数据库" :label-width="formLabelWidth" prop="attributes.database">
                    <el-input name="bm-ch-resourceMan-mongoDBsource-attributes-database-input"
                              v-model="entity.attributes.database" auto-complete="off" class="input-form"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="data-footer">
                <el-button type="primary" @click="save()" name="bm-ch-resourceMan-mongoDBsource-save-ok">确定</el-button>
                <el-button @click="cancel()" name="bm-ch-resourceMan-mongoDBsource-cancel-cancel">取消</el-button>
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
                isNew: true,
                selectedNode: "",
                entity: {
                    id: "",
                    name: "",
                    type: "MONGODB",
                    description: "",
                    attributes: {
                        address: "",
                        port: "27017",
                        username: '',
                        password: "",
                        database: "",
                    },
                    owner: ""
                },
                rules: {
                    name: [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.address': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.port': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.database': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.username': [
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
                        //去掉tablename字段
                        if (this.entity.tableName)
                            delete this.entity.tableName;

                        var addOrEditDataSource = this.isNew ? postDatasource(this.entity) : putDatasource(this.entity.id, this.entity);
                        //提交 SOCKET datasource
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
