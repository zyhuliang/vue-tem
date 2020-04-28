<template>
    <section class="add-resource " id='bm-ch-resMan-schema-tmp'>
        <div class="res-data" v-loading="loading">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew ? '新建 ' : '编辑 '}}元数据</h4>
                </div>
                <div class="btn-right">
                    <el-button type="info" @click="updateSchema()"><i class="fa fa-edit"></i>编辑字段</el-button>
                </div>
            </el-row>
            <el-form id="bm-ch-resourceMan-schema-form" :model="entity" :rules="rules" ref="entity"
                     class="data-content">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input name="bm-ch-resourceMan-schema-name-input" v-model="entity.name" auto-complete="off"
                              class="input-form"></el-input>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input name="bm-ch-resourceMan-schema-description-input" v-model="entity.description"
                              auto-complete="off" class="input-form"></el-input>
                </el-form-item>
                <el-form-item label="版本" :label-width="formLabelWidth" prop="version">
                    <el-input name="bm-ch-resourceMan-schema-description-input" disabled v-model="entity.version"
                              auto-complete="off" class="input-form"></el-input>
                </el-form-item>
                <div class="schemaData">
                    <el-form-item label="字段" :label-width="formLabelWidth" prop="fields"
                                  style="width: calc(100% - 200px)">
                        <!-- 模糊查询组件 -->
                        <fuzzy-matching
                                :totalData="entity.fields"
                                @getfuzzyMatching="searchSchemaData"
                        />
                        <el-table :data="schemaFuzzyMatching.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                                  style="width: 100%"
                                  max-height="500">
                            <el-table-column
                                    fixed
                                    type="index"
                                    width="60"
                                    :index="indexMethod">
                            </el-table-column>
                            <el-table-column prop="name" label="名称">
                                <template slot-scope="scope">
                                    <el-input :name="'bm-ch-resourceMan-schema-schema-name-input'+ scope.$index"
                                              :value="scope.row.name"
                                              @input="(value) => fieldsName(value,scope.$index,schemaFuzzyMatching)"
                                              :placeholder="'fields1'"
                                              :class="(scope.row.type).indexOf('decimal')== -1?'input':'input-selects'"
                                              class="input"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" label="数据类型">
                                <template slot-scope="scope">
                                    <el-select class="selectClass" :value="scope.row.type" placeholder=""
                                               @change="(value) => fieldsType(value,scope.$index,schemaFuzzyMatching)">
                                        <el-option value="string">string</el-option>
                                        <el-option value="byte">byte</el-option>
                                        <el-option value="short">short</el-option>
                                        <el-option value="bigint">bigint</el-option>
                                        <el-option value="int">int</el-option>
                                        <el-option value="float">float</el-option>
                                        <el-option value="double">double</el-option>
                                        <el-option value="boolean">boolean</el-option>
                                        <el-option value="date">date</el-option>
                                        <el-option value="timestamp">timestamp</el-option>
                                        <el-option value="binary">binary</el-option>
                                        <el-option value="decimal">decimal</el-option>
                                    </el-select>
                                    <span>
                                    <el-select
                                            v-if="(scope.row.type).indexOf('decimal')>-1"
                                            v-model="scope.row.wholeLength"
                                            :name="'bm-ch-resourceMan-schema-schema-wholeLength-select'+scope.$index"
                                            @change="onDecimalChange(scope.row,'wholeLength')"
                                            class='selects-para'>
                                        <el-option v-for="(a,key) in decimalFormat.allowArray()"
                                                   :key="key"
                                                   :name="key"
                                                   :value="a">{{a}}
                                        </el-option>
                                    </el-select>
                                    <el-select v-if="(scope.row.type).indexOf('decimal')>-1"
                                               style="margin-right: 5px;"
                                               v-model="scope.row.fractionLength"
                                               :name="'bm-ch-resourceMan-schema-schema-fractionLength-select'+scope.$index"
                                               @change="onDecimalChange(scope.row,'fractionLength')"
                                               class='selects-para'>
                                        <el-option v-for="(a,key) in decimalFormat.allowArray()"
                                                   :key="key"
                                                   :name="key"
                                                   :value="a">{{a}}
                                        </el-option>
                                    </el-select>
                                </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="description" label="描述">
                                <template slot-scope="scope">
                                    <el-input :value="scope.row.description" placeholder="描述"
                                              @input="(value) => fieldsDescription(value,scope.$index,schemaFuzzyMatching)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="80">
                                <template slot-scope="scope">
                                    <i :name="'bm-ch-resourceMan-schema-field-delete-icon'+scope.$index" title="移除当前对象"
                                       @click="removeField(scope.$index,scope.row)"
                                       v-if="schemaFuzzyMatching.length > 1 || (schemaFuzzyMatching.length == 1 && searchKey != '')"
                                       class="el-icon-delete"></i>
                                    <i :name="'bm-ch-resourceMan-schema-field-plus-input-row-icon-add'"
                                       @click="addField(scope.$index)"
                                       class="el-icon-circle-plus-outline data-add"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                       :current-page="currentPage"
                                       :page-sizes="[8, 16, 50, 100]" :page-size="pagesize"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       :total="schemaFuzzyMatching.length">
                        </el-pagination>
                        <i :name="'bm-ch-resourceMan-schema-field-plus-input-icon-add'" @click="addField()"
                           class="el-icon-circle-plus-outline data-add"></i>
                        <i name="bm-ch-resourceMan-schema-field-showBatchEntry-button" type="text" auto-complete="off"
                           class="i upload fa fa-upload" @click="showBatchEntry = ''"
                           v-if="showBatchEntry==undefined"></i>
                    </el-form-item>
                </div>

                <el-form-item :label-width="formLabelWidth" prop="batchEntry">
                    <div v-if="showBatchEntry!=undefined">
                        <el-input
                                name="bm-ch-resourceMan-schema-field-batchInput-button"
                                type="textarea"
                                auto-complete="off"
                                class="input-form"
                                v-model="batchInput"
                                rows="10"
                                placeholder="说明：一行两列，第一列为字段名，第二列为类型，中间用空格分开。举例：name type"
                        >

                        </el-input>
                        <el-button name="bm-ch-resourceMan-schema-field-addBatch-button" type="primary"
                                   @click="addBatch()">添加
                        </el-button>
                    </div>

                </el-form-item>
            </el-form>
            <div class="data-footer">
                <el-button type="primary" @click="save()" name="bm-ch-resourceMan-schema-form-save-ok">确定</el-button>
                <el-button @click="cancel()" name="bm-ch-resourceMan-schema-form-cancel-cancel">取消</el-button>
            </div>


            <!--制作flowJson 弹出框-->
            <el-dialog
                    title="编辑字段"
                    :visible.sync="dialogUpdateSchemaVisible"
                    width="50%"
                    class="el-body-padding">
                <el-form id="bm-ch-resourceMan-create-flowJson-form">
                    <el-form-item label="字段内容">
                        <el-input
                                name="bm-ch-resourceMan-schema-field-edit-input"
                                auto-complete="off"
                                type="textarea"
                                :rows="15"
                                placeholder="请输入Schema字段(Json类型)"
                                v-model="schemaFields">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="saveSchemaFields"
                               name="bm-ch-resourceMan-schema-saveSchemaFields-UpdateSchema-ok">确定</el-button>
                    <el-button @click="dialogUpdateSchemaVisible = false"
                               name="bm-ch-resourceMan-schema-saveSchemaFields-UpdateSchema-cancel">取消</el-button>
		        </span>
            </el-dialog>
        </div>
    </section>
</template>

<script>
    import {postSchema, listData, getSchema, putSchema} from '@api'
    import resInPro from '@rhinos/projectDir/dataTree/resNav.js'
    import resIn from '@components/dataTree/resNav.js'
    import fuzzyMatching from '@components/fuzzyMatching/fuzzyMatching'
    import _ from "lodash";
    export default {
        name: 'schema',
        components: {
            fuzzyMatching
        },
        data() {
            return {
                loading: false,
                // 搜索基准
                schemaFuzzyMatching: [],
                searchKey: [],
                tempDecimal: '',
                fieldTypes: ["string", "byte", "short", "bigint", "int", "float", "double", "boolean", "date", "timestamp", "binary", "decimal"],
                formLabelWidth: "200px",
                selectedNode: "",
                entity: {
                    id: "",
                    name: "",
                    description: "",
                    fields: [{name: "field_1", type: "string", description: ''}],
                    owner: ""
                },
                isNew: true,
                schemaFields: "",
                showBatchEntry: undefined,
                batchInput: '',
                decimalFormat: {
                    allowArray: function () {
                        var a = [];
                        for (var i = 0; i < 39; i++) {
                            a.push(i)
                        }
                        return a;
                    },
                    wholePlaceHolder: "总长度",
                    fractionPlaceHolder: "小数长度"
                },
                dialogUpdateSchemaVisible: false,
                rules: {
                    name: [
                        {required: true, message: '请输入内容...', trigger: 'change'},
//                        {validator(rule, value, callback) {
//                            if (!/^[^-]+$/.test(value)) {
//                                callback("名称不能有'-'");
//                            } else {
//                                callback();
//                            }
//                        }}
                    ],
                },
                currentPage: 1,
                pagesize: 8,
            }
        },
        methods: {
            // 搜索
            searchSchemaData(data, searchKey) {
                this.searchKey = searchKey;
                this.schemaFuzzyMatching = data
                this.currentPage = 1
            },
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            indexMethod(index) {
                return (this.pagesize * (this.currentPage - 1)) + index + 1;
            },
            //将字符串拆分成单独的数据
            // str: decimal(10:2)
            stringToDecimalObj: function (str) {
                if (str.indexOf('decimal') > -1) {
                    var reg = /[(),]/;
                    var c = str.split(reg);
                    var obj = {};
                    obj.type = c[0];
                    obj.wholeLength = c[1];
                    obj.fractionLength = c[2];
                    return obj;
                }
            },
            //批量录入
            addBatch: function () {
                var that = this;
                //批量添加文本框内的字符串
                var batchInput = that.batchInput;
                if (batchInput) {
                    var error = ""

                    function addError(e) {
                        if (error)
                            error += ";"
                        error += e;
                    }

                    //将每一行作为数组的一个元素
                    var lines = batchInput.split(/\r?\n/);
                    var fs = [];
                    //decimal的正则表达式
                    var reg = /decimal\(\d+,\d+\)/;
                    var go = true;
                    //循环每行数据
                    lines.forEach(function (line, i) {
                        var ss = line.split(/\s+/);
                        var ss1 = [];
                        //根据空格将一行切分称三个数据的数组name type des
                        ss.forEach(function (e) {
                            if (e)
                                ss1.push(e)
                        })
                        ss = ss1;
                        if (ss.length == 3) {
                            var name = ss[0];
                            var type = ss[1];
                            var description = ss[2];

                            if (reg.test(type)) {
                                var f = {name: name, type: "", description: description}
                                //将type经过decimal转换
                                f = Object.assign({}, f, that.stringToDecimalObj(type))
                                var type1 = that.onDecimalChange(f, 'fractionLength')
                                fs.push(f);
                            } else if (that.fieldTypes.indexOf(type) >= 0) {
                                fs.push({name: name, type: type, description: description});
                            } else {
                                // fs.push({name: name, type:"", description: description});
                                addError(name + ": 不支持的类型" + type)
                            }
                        } else if (ss.length == 2) {
                            var name = ss[0];
                            var type = ss[1]
                            if (reg.test(type)) {
                                var f = {name: name, type: ""}
                                f = Object.assign({}, f, that.stringToDecimalObj(type))
                                var type1 = that.onDecimalChange(f, 'fractionLength')
                                fs.push(f);

                            } else if (that.fieldTypes.indexOf(type) >= 0) {
                                fs.push({name: name, type: type});
                            } else {
                                //fs.push({name: name, type:""});
                                addError(name + ": 不支持的类型" + type)
                            }
                        } else if (ss.length == 0) {
                        } else if (ss.length === 1) {
                            fs.push({name: ss[0], type: ""});
                        } else if (ss.length > 3) {
                            that.$confirm("第" + (i + 1) + "行格式有误！", "错误", {
                                type: "error"
                            })
                            go = false;
                            return false;
                        }
                    })
                    if (go) {
                        fs.forEach(function (e) {
                            var index = that.entity.fields.length - 1;
                            that.entity.fields.splice(index + 1, 0, e)
                        })
                        that.schemaFuzzyMatching = that.entity.fields

                        if (error) {
                            that.$confirm(error, "提示", {
                                type: "warning"
                            })
                        }
                        that.showBatchEntry = undefined;
                    }
                }
            },
            //将精度转化成字符串
            decimalObjToString: function (obj) {
                var wholeLength = obj.wholeLength ? obj.wholeLength : '0'
                var fractionLength = obj.fractionLength ? obj.fractionLength : '0'
                return "decimal(" + wholeLength + "," + fractionLength + ")";
            },
            //改变精度
            onDecimalChange: function (item, name) {
                if (item.type.indexOf('decimal') > -1) {
                    this.tempDecimal = this.decimalObjToString(item)
                }
                var wholeLength = item.wholeLength ? item.wholeLength * 1 : 10;
                var fractionLength = item.fractionLength ? item.fractionLength * 1 : 0;
                if (fractionLength > wholeLength) {
                    if (name === 'wholeLength')
                        item.fractionLength = item.wholeLength;
                    else
                        item.wholeLength = item.fractionLength;
                    this.tempDecimal = this.decimalObjToString(item)
                }
                return this.tempDecimal;
            },
            //fieldsName
            fieldsName: function (val, index, row) {
                row[((this.currentPage - 1) * this.pagesize) + index].name = val;
            },
            fieldsType: function (val, index, row) {
                row[((this.currentPage - 1) * this.pagesize) + index].type = val;
            },
            fieldsDescription: function (val, index, row) {
                row[((this.currentPage - 1) * this.pagesize) + index].description = val;
            },
            //删除字段
            removeField(index, row) {
                // 删除视图的数据
                this.schemaFuzzyMatching.splice(((this.currentPage - 1) * this.pagesize) + index, 1);
                // 删除视图数据的同时需要删除基准数据
                this.deleteObject(row.name, this.entity.fields, "name");

            },
            //添加字段
            addField(index) {
                /*
                * 如果有指定索引
                * 在索引行下方添加数据
                * 没有索引默认在数组最后添加数据
                * 新添加数据默认值是数组长度+1
                * */
                var i = index != undefined ? (((this.currentPage - 1) * this.pagesize) + index + 1) * 1 : (this.entity.fields.length + 1)
                var addField = {
                    name: 'field_' + (this.entity.fields.length * 1 + 1),
                    type: 'string',
                    description: "",
                }
                this.entity.fields.splice(i, 0, addField)
                this.schemaFuzzyMatching = this.entity.fields
            },
            //初始化
            init: function () {
                var that = this;
                that.entity.id = that.$route.params.id
                that.isNew = false;
                that.loading = true;
                getSchema(that.entity.id).then(res => {
                    that.loading = false;
                    that.entity = Object.assign({}, that.entity, res)
                    var TF = that.entity.fields;
                    that.entity.fields = []
                    TF.forEach(function (e) {
                        var field = {name: e.name, type: e.type, description: e.description}
                        if (e.type.indexOf('decimal') > -1) { // format: decimal(10,2)
                            Object.assign(field, that.stringToDecimalObj(e.type))
                            //angular.extend(field, stringToDecimalObj(e.type))
                            field.type = "decimal"
                        }
                        that.entity.fields.push(field)
                    })
                    this.schemaFuzzyMatching = that.entity.fields
                    if (that.$route.query.isCopy == 'copy') {
                        var urlTrue = window.location.href.indexOf('/project') > -1;
                        if (urlTrue === true) {
                            var data = {projectEntity: {id: that.$route.params.projectId}}
                        } else {
                            var data = {resource: {id: that.$route.params.parentId}}
                        }
                        that.entity = Object.assign({}, that.entity, data)
                        that.selectedNode = that.$route.params.node
                        that.entity.owner = that.selectedNode ? that.selectedNode.owner : ''
                        that.entity.name = that.entity.name + '_copy'
                        that.entity.id = ''
                        delete that.entity.createTime
                        delete that.entity.lastModifiedTime
                        that.isNew = true;
                    }
                }, err => {
                    that.loading = false;
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            //取消
            cancel: function () {
                var urlTrue = window.location.href.indexOf('/project') > -1;
                if (urlTrue === true) {
                    resInPro.$emit('refreshList', false, 'schema');
                } else {
                    this.$router.push('/resourceMan')
                    resIn.$emit('refreshList', false, 'schema');
                }

            },
            //保存
            save: function () {
                this.$refs.entity.validate((valid) => {
                    if (valid) {
                        var that = this;
                        //将字段做修改
                        var TF = that.entity.fields;
                        that.entity.fields = []
                        TF.forEach(function (e) {
                            var field = {name: e.name, type: e.type, description: e.description}
                            if (e.type === 'decimal') {
                                field.type = that.decimalObjToString(e)
                            }
                            field.name = e.name.trim()
                            that.entity.fields.push(field)
                        })
                        //去掉tablename字段
                        if (that.entity.tableName) {
                            delete that.entity.tableName;
                        }
                        //判断数组中有没有重复的值
                        let nameArr = _.map(JSON.parse(JSON.stringify(that.entity.fields)), 'name')
                        let status = _.some(nameArr, function (elt, index) {
                            return nameArr.indexOf(elt) !== index;
                        });
                        if (status) {
                            this.$message({
                                message: '字段名称重复',
                                type: 'error'
                            })
                            that.entity.fields = this.schemaFuzzyMatching
                        } else {
                            var addOrEditSchema = that.isNew ? postSchema(that.entity) : putSchema(that.entity.id, that.entity);
                            //提交 schema
                            addOrEditSchema.then(data => {
                                //提交之后获取列
                                var urlTrue = window.location.href.indexOf('/project') > -1;
                                if (urlTrue === true) {
                                    that.$router.push({path: '/resourceManProject'});
                                    resInPro.$emit('refreshList', false, 'schema');
                                } else {
                                    that.$router.push({path: '/resourceMan'});
                                    resIn.$emit('refreshList', false, 'schema');
                                }
                            }, error => {
                                var err = error.response.data.err
                                if (err.indexOf('Duplicate') > -1)
                                    err = '保存失败，此名称已存在'
                                if (err.indexOf('Arguments error') > -1)
                                    err = '参数错误'
                                //保存失败后将原有的decimal类型恢复
                                var TF = that.entity.fields
                                that.entity.fields = []
                                TF.forEach(function (e) {
                                    var field = {name: e.name, type: e.type, description: e.description}
                                    if (e.type.indexOf('decimal') > -1) { // format: decimal(10,2)
                                        Object.assign(field, that.stringToDecimalObj(e.type))
                                        //angular.extend(field, stringToDecimalObj(e.type))
                                        field.type = "decimal"
                                    }
                                    that.entity.fields.push(field)
                                })
                                //将fields数据同步
                                that.schemaFuzzyMatching = that.entity.fields
                                if (error.response.status == 500 || error.response.status == 501 || error.response.status == 400) {
                                    that.$message({
                                        message: err,
                                        type: 'error',
                                        duration: 1500
                                    });
                                }
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            //编辑Schema Json
            updateSchema: function () {
                this.dialogUpdateSchemaVisible = true;
                this.schemaFields = JSON.stringify(this.entity.fields)
            },
            //保存Schema 字段json
            saveSchemaFields: function () {
                try {
                    this.entity.fields = JSON.parse(this.schemaFields)
                    this.schemaFuzzyMatching = this.entity.fields
                } catch (err) {
                    this.$message({
                        message: err.message,
                        type: 'error',
                        duration: 1500
                    });
                }
                this.dialogUpdateSchemaVisible = false;
            }
        },
        mounted() {
            var that = this;
            // 调用schema的页面
            if (that.$route.params.id == 'new') {
                var urlTrue = window.location.href.indexOf('/project') > -1;
                if (urlTrue === true) {
                    var data = {projectEntity: {id: that.$route.params.projectId}}
                } else {
                    var data = {resource: {id: that.$route.params.parentId}}
                }
                that.entity = Object.assign({}, that.entity, data)
                //新建时候初始化元数据字段
                that.schemaFuzzyMatching = that.entity.fields
                that.selectedNode = that.$route.params.node
                that.entity.owner = that.selectedNode ? that.selectedNode.owner : ''
            } else that.init();
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
        width: calc(100% - 200px);
    }

    .index-field {
        font-weight: bold;
    }

    .data-add {
        cursor: pointer;
        color: #3e98fe;
    }

    .upload {
        margin-left: 10px;
        cursor: pointer;
        color: #67C23A;
    }
</style>

