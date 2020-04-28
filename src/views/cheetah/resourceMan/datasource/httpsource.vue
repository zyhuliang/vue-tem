<template>
    <section class="add-resource " id='bm-ch-resMan-httpsource-tmp'>
        <div class="res-data" v-loading="loading">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew ? '新建 ' : '编辑 '}}{{'HTTP' | cn}}数据源</h4>
                </div>
            </el-row>
            <el-form id="bm-ch-resourceMan-httpsource-form" :model="entity" ref="entity" :rules="rules"
                     class="data-content">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input name="bm-ch-resourceMan-httpsource-name-input" v-model="entity.name" auto-complete="off"
                              class="input-form" :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input name="bm-ch-resourceMan-httpsource-description-input" v-model="entity.description"
                              auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <hr class="hr-res-form">

                <el-form-item label="根目录" :label-width="formLabelWidth" prop="attributes.rootPath">
                    <el-input name="bm-ch-resourceMan-httpsource-attributes-rootPath-input"
                              v-model="entity.attributes.rootPath" auto-complete="off" class="input-form"
                              :placeholder="'根目录'"></el-input>
                </el-form-item>

                <el-form-item label="获取类型" :label-width="formLabelWidth" prop="attributes.method">
                    <el-select name="bm-ch-resourceMan-httpsource-attributes-method-select"
                               v-model="entity.attributes.method">
                        <el-option
                                v-for="item in ['GET','POST']"
                                :key="item"
                                :name="item"
                                :label="item | cn"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'url'| cn" :label-width="formLabelWidth" prop="attributes.url">
                    <el-input name="bm-ch-resourceMan-httpsource-attributes-url-input" v-model="entity.attributes.url"
                              auto-complete="off" class="input-form" :placeholder="'必填'"></el-input>
                </el-form-item>

                <hr class="hr-res-form">

                <el-form-item label="其他参数" :label-width="formLabelWidth" prop="attributes.properties">
                    <template v-for="(item,index) in entity.attributes.properties">
                        <div class="field-grope">
                            <el-input :name="item.name+index" v-model="item.name" :placeholder="'键名'"
                                      @input="onPropertiesChange()" class="input"></el-input>
                            <el-input :name="item.value+index" v-model="item.value" :placeholder="'键值'"
                                      @input="onPropertiesChange()" class="input"></el-input>
                            <i :name="'value-delete-icon'+item.value+index" @click.prevent="editProperties(index,'del')"
                               v-if="entity.attributes.properties.length > 1" class="el-icon-delete"></i>
                            <i :name="'value-delete-icon'+item.value+index" @click="editProperties(index,'add')"
                               v-if="index === entity.attributes.properties.length - 1"
                               class="el-icon-circle-plus-outline"></i>
                        </div>
                    </template>
                </el-form-item>

            </el-form>
            <div slot="footer" class="data-footer">
                <el-button type="primary" @click="save()" name="bm-ch-resourceMan-httpsource-save-ok">确定</el-button>
                <el-button @click="cancel()" name="bm-ch-resourceMan-httpsource-cancel-cancel">取消</el-button>
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
                    type: "HTTP",
                    description: "",
                    attributes: {
                        method: "GET",
                        rootPath: "",
                        parameters: "",
                        url: "",
                        properties: [{name: "", value: ""}]
                    },
                    owner: ""
                },
                rules: {
                    name: [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.url': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                }
            }
        },
        methods: {
            //其他参数的添加或者删除按钮
            editProperties: function (index, type) {
                var properties = type == 'del' ? undefined : {
                    name: '',
                    type: '',
                }
                this.entity.attributes.properties = this.arrayAddOrRemoreElement(this.entity.attributes.properties, index, properties)
            },
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

    .field-grope {
        width: 390px;
        .input {
            width: 170px
        }
        .select {
            width: 147px
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
