<template>
    <section class="add-resource " id='bm-ch-resMan-dbsource-tmp'>
        <div class="res-data" v-loading="loading">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew ? '新建 ' : '编辑 '}}{{'JDBC' | cn}}数据源</h4>
                </div>
                <div class="btn-right">
                    <el-button type="info" id='bm-ch-resMan-dbsource-testConnection-button' @click="testConnection()"><i
                            class="fa fa-tachometer"></i>连接测试
                    </el-button>
                </div>
            </el-row>

            <el-row>
                <el-form id="bm-ch-resourceMan-DBsource-form" :model="entity" ref="entity" :rules="rules"
                         class="data-content">
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                        <el-input name='bm-ch-resMan-dbsource-name-input' v-model="entity.name" auto-complete="off"
                                  class="input-form"
                                  :placeholder="'必填'"></el-input>
                    </el-form-item>

                    <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                        <el-input name='bm-ch-resMan-dbsource-description-input' v-model="entity.description"
                                  auto-complete="off" class="input-form"></el-input>
                    </el-form-item>

                    <el-form-item label="中文名" :label-width="formLabelWidth" prop="attributes.chineseName">
                        <el-input name='bm-ch-resMan-dbsource-chineseName-input' v-model="entity.attributes.chineseName"
                                  auto-complete="off" class="input-form"></el-input>
                    </el-form-item>

                    <hr class="hr-res-form">

                    <el-form-item label="数据库类型" :label-width="formLabelWidth" prop="attributes.name" required>
                        <el-select name='bm-ch-resMan-dbsource-chineseName-select' v-model="entity.attributes.name"
                                   auto-complete="off" placeholder="请选择(必填)"
                                   @change="onDBTypeChanged">
                            <el-option
                                    v-for="item in DBTypes"
                                    :key="item.name"
                                    :name="item.name"
                                    :label="item.name | cn"
                                    :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="驱动" :label-width="formLabelWidth" prop="attributes.driver">
                        <el-input name='bm-ch-resMan-dbsource-attributes-driver-input'
                                  v-model="entity.attributes.driver" auto-complete="off" disabled class="input-form"
                                  :placeholder="'请先选择数据库驱动'"></el-input>
                    </el-form-item>
                    <el-form-item label="版本" :label-width="formLabelWidth" v-if="entity.attributes.version != undefined" prop="attributes.version">
                        <el-select name='bm-ch-resMan-dbsource-version-select' v-model="entity.attributes.version"
                                   auto-complete="off" placeholder="请选择数据库版本">
                            <el-option
                                    name=""
                                    label=""
                                    value="">
                            </el-option>
                            <el-option
                                    name="9i"
                                    label="9i"
                                    value="9i">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="服务器地址或名称" :label-width="formLabelWidth" prop="attributes.host"
                                  v-if="entity.attributes.DBType != 'HIVE'">
                        <el-input name='bm-ch-resMan-dbsource-attributes-host-input' v-model="entity.attributes.host"
                                  auto-complete="off" @input="updateUrl" class="input-form"
                                  :placeholder="'必填'"></el-input>
                    </el-form-item>

                    <el-form-item label="端口" :label-width="formLabelWidth" prop="attributes.port"
                                  v-if="entity.attributes.DBType != 'HIVE'" required>
                        <el-input name='bm-ch-resMan-dbsource-attributes-port-input' v-model="entity.attributes.port"
                                  auto-complete="off" @input="updateUrl" class="input-form"
                                  :placeholder="'请输入...'"></el-input>
                    </el-form-item>

                    <el-form-item label="数据库" :label-width="formLabelWidth" prop="attributes.database"
                                  v-if="entity.attributes.DBType != 'HIVE'">
                        <el-input name='bm-ch-resMan-dbsource-attributes-database-input'
                                  v-model="entity.attributes.database" auto-complete="off" @input="updateUrl"
                                  class="input-form" :placeholder="'必填'"></el-input>
                    </el-form-item>

                    <el-form-item label="用户名" :label-width="formLabelWidth" prop="attributes.user">
                        <el-input name='bm-ch-resMan-dbsource-attributes-user-input' v-model="entity.attributes.user"
                                  auto-complete="off" class="input-form"
                                  :placeholder="'必填'"></el-input>
                    </el-form-item>

                    <el-form-item label="密码" :label-width="formLabelWidth" prop="attributes.password">
                        <el-input name='bm-ch-resMan-dbsource-attributes-password-input' type="password"
                                  v-model="entity.attributes.password" auto-complete="off"
                                  class="input-form" :placeholder="'必填'"></el-input>
                    </el-form-item>

                    <el-form-item label="batchsize" :label-width="formLabelWidth" prop="attributes.batchsize">
                        <el-select v-model="entity.attributes.batchsize" placeholder="请选择">
                            <el-option
                                    v-for="item in batchsizeoptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <hr class="hr-res-form">
                    <el-form-item :label="'dateToTimestamp'| cn" :label-width="formLabelWidth"
                                  prop="attributes.dateToTimestamp">
                        <el-switch
                                name='bm-ch-resMan-dbsource-attributes-dateToTimestamp-switch'
                                v-model="entity.attributes.dateToTimestamp"
                                class="switch-style">
                        </el-switch>
                    </el-form-item>
                    <el-form-item :label="'catalog' | cn" :label-width="formLabelWidth" prop="attributes.catalog"
                                  v-if="entity.attributes.DBType != 'HIVE'">
                        <el-input name='bm-ch-resMan-dbsource-attributes-catalog-input'
                                  v-model="entity.attributes.catalog" auto-complete="off" class="input-form"
                                  :placeholder="'请输入...'"></el-input>
                    </el-form-item>

                    <el-form-item :label="'schema' | cn" :label-width="formLabelWidth" prop="attributes.schema"
                                  v-if="entity.attributes.DBType != 'HIVE'">
                        <el-input name='bm-ch-resMan-dbsource-attributes-schema-input'
                                  v-model="entity.attributes.schema" auto-complete="off" class="input-form"
                                  :placeholder="'请输入...'"></el-input>
                    </el-form-item>

                    <el-form-item label="其他参数" :label-width="formLabelWidth" prop="attributes.properties"
                                  v-if="entity.attributes.DBType != 'HIVE'">
                        <template v-for="(item,index) in entity.attributes.properties">
                            <div class="field-grope">
                                <el-input :name="'name'+item.name+index" v-model="item.name" :placeholder="'键名'"
                                          @input="onPropertiesChange()"
                                          class="input"></el-input>
                                <el-input :name="'value'+item.name+index" v-model="item.value" :placeholder="'键值'"
                                          @input="onPropertiesChange()"
                                          class="input"></el-input>
                                <i :name="'value-delete-icon'+item.name+index" @click.prevent="removeProperties(item)"
                                   v-if="entity.attributes.properties.length > 1"
                                   class="el-icon-delete"></i>
                                <i :name="'value-icon-add'+item.name+index" @click="addProperties"
                                   v-if="index === entity.attributes.properties.length - 1"
                                   class="el-icon-circle-plus-outline"></i>
                            </div>
                        </template>
                    </el-form-item>

                    <el-form-item :label="'URL' | cn" :label-width="formLabelWidth" prop="attributes.url">
                        <el-input name='bm-ch-resMan-dbsource-attributes-url-input' v-model="entity.attributes.url"
                                  auto-complete="off" class="input-form"></el-input>
                    </el-form-item>

                </el-form>
            </el-row>

            <div class="data-footer" slot="footer">
                <el-button type="primary" @click="save()" name="bm-ch-resMan-dbsource--save-ok">确定</el-button>
                <el-button @click="cancel()" name="bm-ch-resMan-dbsource--cancel-cancel">取消</el-button>
            </div>
        </div>
    </section>
</template>

<script>
    import {postDatasource, getDatasource, putDatasource, DBConnection, confList} from '@api'
    import resIn from '@components/dataTree/resNav.js'
    import {createParameter} from '@components/function/queryParameter.js';
    export default {
        name: 'dataSource',
        data() {
            return {
                loading: false,
                //0， 500， 1000， 3000，10000， 50000， 100000， 默认选择10000，
                batchsizeoptions: [{
                    value: 0,
                    label: '0'
                }, {
                    value: 500,
                    label: '500'
                }, {
                    value: 1000,
                    label: '1000'
                }, {
                    value: 3000,
                    label: '3000'
                }, {
                    value: 10000,
                    label: '10000'
                }, {
                    value: 50000,
                    label: '50000'
                }, {
                    value: 100000,
                    label: '100000'
                }],
                DBTypes: [],
                formLabelWidth: "200px",
                backHippo: false,
                DBMetaMap: {},
                currentDBMeta: null,
                isNew: true,
                selectedNode: "",
                entity: {
                    id: "",
                    name: "",
                    type: "DB",
                    description: "",
                    owner: "",
                    attributes: {
                        jarPath: '',
                        DBType: "",
                        host: "",
                        port: "",
                        database: "",
                        user: "",
                        password: "",
                        driver: "",
                        properties: [{name: "", value: ""}],
                        url: "",
                        chineseName: "",
                        dateToTimestamp: false,
                        catalog: "",
                        schema: "",
                        batchsize: 10000//0， 500， 1000， 3000，10000， 50000， 100000， 默认选择10000，
                    }
                },
                rules: {
                    name: [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.host': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.database': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.user': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'attributes.url': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],

                }
            }
        },
        methods: {
            //其他参数的添加按钮
            addProperties: function () {
                this.entity.attributes.properties.push({
                    name: '',
                    value: '',
                })
            },
            //其他参数的删除按钮
            removeProperties: function (item) {
                var index = this.entity.attributes.properties.indexOf(item)
                if (index !== -1) {
                    this.entity.attributes.properties.splice(index, 1)
                }
            },
            //改变数据库类型时调用
            onDBTypeChanged: function () {
                var that = this;
                if (that.entity.attributes.name) {
                    that.currentDBMeta = that.DBMetaMap[that.entity.attributes.name];
                    that.entity.attributes.jarPath = that.currentDBMeta.jarPath
                    if (that.currentDBMeta.driver){
                        that.entity.attributes.driver = that.currentDBMeta.driver;
                        if (that.entity.attributes.driver.toLowerCase().indexOf('oracle')> -1){
                            this.$set(that.entity.attributes, 'version', '')
                        }else{
                            that.entity.attributes.version = undefined
                        }
                    }
                    if (that.currentDBMeta.defaultPort)
                        that.entity.attributes.port = that.currentDBMeta.defaultPort;
                    if (that.currentDBMeta.DBType)
                        that.entity.attributes.DBType = that.currentDBMeta.DBType;
                }
                else {
                    that.currentDBMeta = null;
                }
                that.updateUrl()
            },
            //更改properties时调用
            onPropertiesChange: function () {
                var that = this;
                var v = that.entity.attributes.port;
                if (v != undefined) {
                    that.entity.attributes.port = v + "";
                }
                var go = true;
                var noMatch = /[^a-zA-Z0-9_]/g
                that.entity.attributes.properties.forEach(function (e) {
                    if (e.name) {
                        var v2 = e.name.replace(noMatch, '')
                        if (v !== v2) {
                            e.name = v2;
                            go = false;
                        }
                    }
                    if (e.value) {
                        var v2 = e.value.replace(noMatch, '')
                        if (v !== v2) {
                            e.value = v2;
                            go = false;
                        }
                    }
                })
                that.updateUrl();
            },
            //自动更新url字段
            updateUrl: function () {
                var that = this;
                var dbMeta = that.currentDBMeta;
                if (!dbMeta)
                    return;

                var url = dbMeta.url;
                if (that.entity.attributes.host)
                    url = url.replace("[HOST]", that.entity.attributes.host);
                if (that.entity.attributes.port)
                    url = url.replace("[PORT]", that.entity.attributes.port);
                if (that.entity.attributes.database)
                    url = url.replace("[DB]", that.entity.attributes.database);

                if (that.entity.attributes.properties) {
                    var p = [];
                    that.entity.attributes.properties.forEach(function (e) {
                        if (e.name && e.value) {
                            p.push(e.name + "=" + e.value)
                        }
                    })
                    if (p.length)
                        url = url + (dbMeta.paraPrefix ? dbMeta.paraPrefix : '?') + p.join(dbMeta.paraSep ? dbMeta.paraSep : "&")
                }
                that.entity.attributes.url = url;
            },
            //初始化
            init: function (node) {
                var that = this;
                that.loading = true;
                that.entity.id = that.$route.params.id
                that.isNew = false;
                that.DBTypes.forEach(function (e) {
                    if (!e.id)
                        e.id = e.name;
                    if (!e.value)
                        e.value = e.id;
                    that.DBMetaMap[e.id] = e;
                })
                getDatasource(that.entity.id).then(res => {
                        that.loading = false;
                        that.entity = Object.assign({}, that.entity, res)
                        //获取数据之后再判断type
                        if (that.entity.attributes.name) {
                            that.currentDBMeta = that.DBMetaMap[that.entity.attributes.name];
                            if (!that.entity.attributes.driver)
                                that.entity.attributes.driver = that.currentDBMeta.driver;
                            if (that.entity.attributes.driver.toLowerCase().indexOf('oracle')> -1){
                                that.entity.attributes.version ?that.entity.attributes.version :this.$set(that.entity.attributes, 'version', '')
                            }else{
                                that.entity.attributes.version = undefined
                            }
                        }
                        //that.updateUrl()
                    }, err => {
                        this.loading = false;
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            },
            //取消按钮
            cancel: function () {
                if (!this.backHippo) {
                    this.$router.push('/resourceMan')
                    resIn.$emit('refreshList', false, 'datasource');
                } else {
                    this.backHippo = false;
                    window.history.back();
                }
            },
            //测试链接按钮
            testConnection: function () {
                var that = this;
                if (that.entity.attributes.name && that.entity.attributes.url) {
                    DBConnection(that.entity).then(res => {
                        that.$message({
                            message: '恭喜你，连接成功！',
                            type: 'success'
                        });
                    }, error => {
                        var connectErr = 'Communications link failure'
                        var err = error.response.data.err
                        if (err.indexOf(connectErr) > 0)
                            err = '连接失败，请确认信息！'
                        this.$message({
                            message: err,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            },
            //确定回调
            save: function () {
                this.$refs.entity.validate((valid) => {
                    if (valid) {
                        var that = this;
                        //去掉tablename字段
                        if (that.entity.tableName)
                            delete that.entity.tableName;
                        //以前版本没有这个字段的就给个默认值false，有的就用现在填写的
                        that.entity.attributes.dateToTimestamp = that.entity.attributes.dateToTimestamp ? that.entity.attributes.dateToTimestamp : false;
                        var addOrEditDataSource = that.isNew ? postDatasource(that.entity) : putDatasource(that.entity.id, that.entity);

                        //提交 DB datasource

                        addOrEditDataSource.then(data => {
                            //提交之后获取列
                            that.$router.push({path: '/resourceMan'});
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
            var that = this;
            //判断是不是hippo监控端跳转过来的
            if (that.$route.params.parentId == 'hippo') {
                this.backHippo = true;
            }
            //调用接口，获取数据库类型数据
            this.loading = true;
            var parameter = createParameter('processConfigType', "jdbc driver", 'EQUAL').Limit(1000).Offset(0).Build();
            confList(parameter).then(data => {
                this.loading = false;
                var content = []
                for (var i = 0; i < data.content.length; i++) {
                    var par = JSON.parse(data.content[i].parameterlist);
                    content.push({
                        "name": data.content[i].name,
                        "DBType": data.content[i].dbType,
                        "driver": data.content[i].className,
                        "url": par.url,
                        "defaultPort": par.defaultPort,
                        "paraPrefix": par.paraPrefix,
                        "paraSep": par.paraSep,
                        "jarPath": data.content[i].jarName
                    })
                }
                this.DBTypes = content;
                //判断是新建
                if (that.$route.params.id == 'new') {
                    //this.$refs[entity].resetFields();
                    var data = {resource: {id: that.$route.params.parentId}}
                    that.entity = Object.assign({}, that.entity, data)
                    //将array转换成object
                    that.DBTypes.forEach(function (e) {
                        if (!e.id)
                            e.id = e.name;
                        if (!e.value)
                            e.value = e.id;
                        that.DBMetaMap[e.id] = e;
                    })

                    if (that.entity.attributes.name) {
                        that.currentDBMeta = that.DBMetaMap[that.entity.attributes.name];
                        if (!that.entity.attributes.driver)
                            that.entity.attributes.driver = that.currentDBMeta.driver;
                        if (that.entity.attributes.driver.toLowerCase().indexOf('oracle')> -1){
                            this.$set(that.entity.attributes, 'version', '')
                        }else{
                            that.entity.attributes.version = undefined
                        }
                    }
                    that.selectedNode = that.$route.params.node
                    that.entity.owner = that.selectedNode ? that.selectedNode.owner : ''
                } else that.init();
            }, err => {
                this.loading = false;
                this.$message({
                    message: err.response.message,
                    type: 'error',
                    duration: 1500
                });
            })
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

    .el-form {
        .el-form-item .el-select {
            width: 350px;
        }
    }
</style>
