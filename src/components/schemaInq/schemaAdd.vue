<template>
    <section class="add-resource ">
        <div class="res-data">
            <el-form id="bm-schemaadd-form" :model="entity" :rules="rules" ref="entity" >
                <el-form-item label="名称" :label-width="formLabelWidth"  prop="name" required>
                    <el-input v-model="entity.name" auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="entity.description" auto-complete="off" class="input-form"></el-input>
                </el-form-item>
                <div class="schemaData">
                    <el-form-item label="字段" :label-width="formLabelWidth" prop="fields" style="width: calc(100% - 100px)">
                        <el-table :data="entity.fields.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%"
                                  max-height="500">
                            <el-table-column
                                    fixed
                                    type="index"
                                    width="60"
                                    :index="indexMethod">
                            </el-table-column>
                            <el-table-column prop="name" label="名称">
                                <template slot-scope="scope">
                                    <el-input :name="'bm-ch-resourceMan-schema-schema-name-input'+ scope.$index" :value="scope.row.name" @input="(value) => fieldsName(value,scope.$index,entity.fields)" :placeholder="'fields1'" :class="(scope.row.type).indexOf('decimal')== -1?'input':'input-selects'" class="input"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" label="数据类型">
                                <template slot-scope="scope">
                                    <el-select class="selectClass" :value="scope.row.type" placeholder="" @change="(value) => fieldsType(value,scope.$index,entity.fields)">
                                        <el-option value ="string">string</el-option>
                                        <el-option value ="byte">byte</el-option>
                                        <el-option value ="short">short</el-option>
                                        <el-option value ="bigint">bigint</el-option>
                                        <el-option value ="int">int</el-option>
                                        <el-option value ="float">float</el-option>
                                        <el-option value ="double">double</el-option>
                                        <el-option value ="boolean">boolean</el-option>
                                        <el-option value ="date">date</el-option>
                                        <el-option value ="timestamp">timestamp</el-option>
                                        <el-option value ="binary">binary</el-option>
                                        <el-option value ="decimal">decimal</el-option>
                                    </el-select>
                                    <span >
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
                                    <el-input :value="scope.row.description" placeholder="描述" @input="(value) => fieldsDescription(value,scope.$index,entity.fields)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="80">
                                <template slot-scope="scope">
                                    <i :name="'bm-ch-resourceMan-schema-field-delete-icon'+scope.$index" title="移除当前对象" @click="removeField(scope.$index,entity.fields)" v-if="entity.fields.length > 1" class="el-icon-delete"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                                       :page-sizes="[8, 16, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="entity.fields.length">
                        </el-pagination>
                        <i :name="'bm-ch-resourceMan-schema-field-plus-input-icon-add'" @click="addField" class="el-icon-circle-plus-outline data-add" ></i>
                        <i name="bm-ch-resourceMan-schema-field-showBatchEntry-button" type="text" auto-complete="off" class="i upload fa fa-upload" @click="showBatchEntry = ''" v-if="showBatchEntry==undefined"></i>
                    </el-form-item>
                    <!--<el-form-item label="字段" :label-width="formLabelWidth" prop="fields">-->
                        <!--<template v-for="(field,index) in entity.fields">-->
                            <!--<div class="field-grope">-->
                                <!--<span class="index-field">{{index+1}}.</span>-->
                                <!--<el-input :name="'bm-ch-resourceMan-schema-schema-name-input'+index" v-model="field.name" :placeholder="'fields1'" :class="(field.type).indexOf('decimal')== -1?'input':'input-selects'" class="input"></el-input>-->
                                <!--<select :name="'bm-ch-resourceMan-schema-schema-name-select'+index"  v-model="field.type" value="field.type" :class="(field.type).indexOf('decimal')== -1?'select':'selects'" >-->
                                    <!--<option value ="string">string</option>-->
                                    <!--<option value ="byte">byte</option>-->
                                    <!--<option value ="short">short</option>-->
                                    <!--<option value ="bigint">bigint</option>-->
                                    <!--<option value ="int">int</option>-->
                                    <!--<option value ="float">float</option>-->
                                    <!--<option value ="double">double</option>-->
                                    <!--<option value ="boolean">boolean</option>-->
                                    <!--<option value ="date">date</option>-->
                                    <!--<option value ="timestamp">timestamp</option>-->
                                    <!--<option value ="binary">binary</option>-->
                                    <!--<option value ="decimal">decimal</option>-->
                                <!--</select>-->
                                <!--<span >-->
                                    <!--<el-select-->
                                            <!--v-if="(field.type).indexOf('decimal')>-1"-->
                                            <!--v-model="field.wholeLength"-->
                                            <!--:name="'bm-ch-resourceMan-schema-schema-wholeLength-select'+index"-->
                                            <!--@change="onDecimalChange(field,'wholeLength')"-->
                                            <!--class='selects-para'>-->
                                        <!--<el-option v-for="(a,key) in decimalFormat.allowArray()"-->
                                                   <!--:key="key"-->
                                                   <!--:name="key"-->
                                                   <!--:value="a">{{a}}-->
                                        <!--</el-option>-->
                                    <!--</el-select>-->
                                    <!--<el-select v-if="(field.type).indexOf('decimal')>-1"-->
                                               <!--style="margin-right: 5px;"-->
                                               <!--v-model="field.fractionLength"-->
                                               <!--:name="'bm-ch-resourceMan-schema-schema-fractionLength-select'+index"-->
                                               <!--@change="onDecimalChange(field,'fractionLength')"-->
                                               <!--class='selects-para'>-->
                                        <!--<el-option v-for="(a,key) in decimalFormat.allowArray()"-->
                                                   <!--:key="key"-->
                                                   <!--:name="key"-->
                                                   <!--:value="a">{{a}}-->
                                        <!--</el-option>-->
                                    <!--</el-select>-->
                                <!--</span>-->

                                <!--<i :name="'bm-ch-resourceMan-schema-field-delete-icon'+index" @click.prevent="removeField(field)" v-if="entity.fields.length > 1" class="el-icon-delete"></i>-->
                                <!--<i :name="'bm-ch-resourceMan-schema-field-plus-input-icon'+index" @click="addField" v-if="index === entity.fields.length - 1" class="el-icon-circle-plus-outline" ></i>-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</el-form-item>-->
                </div>

                <el-form-item  :label-width="formLabelWidth" prop="batchEntry" >
                    <div v-if="showBatchEntry!=undefined">
                        <el-input
                                type="textarea"
                                auto-complete="off"
                                class="input-form"
                                v-model="batchInput"
                                rows="10"
                                placeholder="说明：一行两列，第一列为字段名，第二列为类型，中间用空格分开。举例：name type"
                        >

                        </el-input>
                        <el-button type="primary" @click="addBatch()">添加</el-button>
                    </div>

                </el-form-item>

                <el-form-item  label="存放位置" :label-width="formLabelWidth" prop="parentId" v-if="fields">
                    <el-input placeholder="默认路径为根目录" v-model="schemaResource" class="input-form-width">
                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dialogSchemaTreeVisible=true"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
            <hr class="hr-res">

            <div >
                <el-button type="primary" @click="save()">确定</el-button>
                <el-button @click="cancel()">取消</el-button>
            </div>
        </div>
        <!-- SchemaTree dialog-->
        <div v-if="dialogSchemaTreeVisible == true" class="schemaTree">
            <div class="diHeader">
                <h3>schemaTree 查询</h3>
                <span @click="dialogSchemaTreeVisible = false" class="el-icon-close"></span>
            </div>
            <div class="diContent">
                <el-form id="bm-schematree1-form" class="elForm" label-width="80px">
                    <schema-tree class="elFormSelect" ref="schematree"></schema-tree>
                </el-form>
            </div>
            <div slot="footer" class="diFooter">
                <el-button @click="dialogSchemaTreeVisible = false">取消</el-button>
                <el-button type="primary" @click="submitSchemaTree">确定</el-button>
            </div>
        </div>
    </section>
</template>

<script>
    import { postSchema, listData, getSchema, putSchema, resDirTree } from '@api'
    import schemaIn from '@components/schemaInq/schemaInq.js'
    import schemaTree  from '@components/schemaTree/schemaTree.vue';


    export default {
        name: 'schemaAdd',
        props:['parentId', 'fields'],
        components: {
            schemaTree,
        },
        data() {
            var validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入名称'));
                }else {
                    callback();
                }
            };
            return {
                tempDecimal:'',
                fieldTypes: ["string", "byte", "short", "bigint", "int", "float", "double", "boolean", "date", "timestamp", "binary", "decimal"],
                formLabelWidth: "100px",
                selectNode: "",
                parameter:"",
                entity: {
                    id: "",
                    name :"",
                    description: "",
                    fields: [{name: "field_1", type: "string"}],
                    resource: {id:''},
                },
                decimalFormat: {
                    allowArray: function () {
                        var a = [];
                        for(var i=0;i<39;i++) {
                            a.push(i)
                        }
                        return a;
                    },
                    wholePlaceHolder: "总长度",
                    fractionPlaceHolder: "小数长度"
                },
                isNew: true,
                showBatchEntry: undefined,
                batchInput: '',
                rules: {

                },
                schemaResource:'',
                dialogSchemaTreeVisible: false,
                currentPage: 1,
                pagesize: 8,
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            indexMethod(index){
                return (this.pagesize * (this.currentPage - 1)) + index + 1;
            },
            //获取schema的id
            submitSchemaTree:function () {
                //获取schema的node
                var schemaNode = this.$refs.schematree.selectedNode;
                var that = this;
                if(schemaNode === ''){
                    that.$message({
                        message: '请选择一个目录！',
                        type: 'error'
                    });
                    return false;
                }else {
                    that.schemaResource = schemaNode.name
                    that.entity.resource.id = schemaNode.id
                    that.dialogSchemaTreeVisible = false;
                }
            },
            //将字符串拆分成单独的数据
            // str: decimal(10:2)
            stringToDecimalObj: function (str) {
                if(str.indexOf('decimal')>-1) {
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
                var batchInput = that.batchInput;
                if(batchInput) {
                    var error = ""

                    function addError(e) {
                        if(error)
                            error += ";"
                        error += e;
                    }
                    var lines = batchInput.split(/\r?\n/);
                    var fs = [];
                    var reg = /decimal\(\d+,\d+\)/;
                    var go = true;
                    lines.forEach(function (line, i ) {
                        var ss = line.split(/\s+/);
                        var ss1 = [];
                        ss.forEach(function (e) {
                            if(e)
                                ss1.push(e)
                        })
                        ss = ss1;
                        if(ss.length == 3) {
                            var name = ss[0];
                            var type = ss[1];

                            if(reg.test(type)){
                                var f = {name: name, type:""}
                                f = Object.assign({},f, that.stringToDecimalObj(type))
                                fs.push(f);
                            } else if (that.fieldTypes.indexOf(type)>=0) {
                                fs.push({name: name, type: type});
                            } else {
                                fs.push({name: name, type:""});
                                addError(name + ": 不支持的类型" + type)
                            }
                        } else if(ss.length == 2) {
                            var name = ss[0];
                            var type = ss[1]
                            if(reg.test(type)){
                                var f = {name: name, type:""}
                                f = Object.assign({},f, that.stringToDecimalObj(type))
                                fs.push(f);

                            } else if (that.fieldTypes.indexOf(type)>=0) {
                                fs.push({name: name, type: type});
                            } else {
                                fs.push({name: name, type:""});
                                addError(name + ": 不支持的类型" + type)
                            }
                        } else if(ss.length == 0) {
                        } else if(ss.length === 1){
                            fs.push({name: ss[0], type:""});
                        } else if(ss.length > 2) {
                            this.$message({
                                message: "第" + (i+1) + "行格式有误！",
                                type: 'error',
                                duration: 1500
                            });
                            go = false;
                            return false;
                        }
                    })
                    if(go) {
                        fs.forEach(function (e) {
                            var index = that.entity.fields.length - 1;
                            that.entity.fields.splice(index+1, 0,  e)
                        })

                        if(error) {
                            this.$message({
                                message: "error",
                                type: 'warning',
                                duration: 1500
                            });
                        }
                        that.showBatchEntry = undefined;
                    }
                }
            },
            //将精度转化成字符串
            decimalObjToString: function (obj) {
                var wholeLength = obj.wholeLength? obj.wholeLength: '0'
                var fractionLength = obj.fractionLength? obj.fractionLength: '0'
                return "decimal(" + wholeLength +"," + fractionLength + ")";
            },
            //改变精度
            onDecimalChange : function (item, name) {
                if(item.type.indexOf('decimal')>-1) {
                    this.tempDecimal = this.decimalObjToString(item)
                }
                var wholeLength = item.wholeLength?item.wholeLength*1:10;
                var fractionLength = item.fractionLength?item.fractionLength*1:0;
                if(fractionLength > wholeLength) {
                    if(name === 'wholeLength')
                        item.fractionLength = item.wholeLength;
                    else
                        item.wholeLength = item.fractionLength;
                    this.tempDecimal = this.decimalObjToString(item)
                }
            },
            //fieldsName
            fieldsName: function(val,index,row){
                row[((this.currentPage - 1) * this.pagesize) + index].name = val;
            },
            fieldsType: function(val,index,row){
                row[((this.currentPage - 1) * this.pagesize) + index].type = val;
            },
            fieldsDescription: function(val,index,row){
                row[((this.currentPage - 1) * this.pagesize) + index].description = val;
            },
            //删除字段
            removeField(index,rows) {
                rows.splice(((this.currentPage - 1) * this.pagesize) + index, 1);
            },
            //添加字段
            addField() {
                this.entity.fields.push({
                    name: 'field_'+ (this.entity.fields.length*1+1),
                    type: 'string',
                })
            },
            //初始化
            init: function () {
                var that = this;
                that.entity.id = that.$route.params.id
                that.isNew = false;
                getSchema(that.entity.id).then(res =>{
                    that.entity = Object.assign({}, that.entity, res)
                },error =>{
                    this.$message({
                        message: error.response.data.err,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            //取消
            cancel: function () {
                if(this.fields){
                    this.$emit('closeSchema')
                }else{
                    schemaIn.$emit('refreshList',false,'schema');

                }
            },
            //保存
            save : function () {
                this.$refs.entity.validate((valid) => {
                    if (valid) {
                        var that = this;
                        //将字段做修改
                        var TF = that.entity.fields;
                        that.entity.fields = []
                        TF.forEach(function (e) {
                            var field = {name: e.name, type: e.type, description: e.description}
                            if(e.type === 'decimal') {
                                field.type = that.decimalObjToString(e)
                            }
                            field.name = e.name.trim()
                            that.entity.fields.push(field)
                        })
                        //去掉tablename字段
                        if(that.entity.tableName)
                            delete that.entity.tableName;

                        var addOrEditSchema = that.isNew ? postSchema( that.entity):  putSchema(that.entity.id,  that.entity);
                        //提交 schema
                        addOrEditSchema.then(data => {
                            //提交之后获取列
//                            that.$router.push({ path: '/resourceMan' });
                            if(this.fields){
                                this.$emit('closeSchema')
                            }else{
                                schemaIn.$emit('refreshList',false,'schema');
                            }
                        },  error => {
                            var err = error.response.data.err
                            if(err.indexOf('Duplicated') >-1)
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
            //如果是传递过来的字段，就要保存
            if(that.fields){
                that.entity.fields = that.fields;
                var TF = that.entity.fields;
                that.entity.fields = []
                TF.forEach(function (e) {
                    var field = {name: e.name, type: e.type}
                    if(e.type.indexOf('decimal')>-1) { // format: decimal(10,2)
                        Object.assign(field, that.stringToDecimalObj(e.type))
                        //angular.extend(field, stringToDecimalObj(e.type))
                        field.type = "decimal"
                    }
                    that.entity.fields.push(field)
                })
                if(that.parentId){
                    var data = {resource: {id:that.parentId}}
                }else {
                    var parameter = { excludes: "", includes: 'schema_dir', strict:true};
                    resDirTree(parameter).then(data => {
                        this.entity.resource.id = data[0].id;
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
            }else{
                // 调用schema的页面
                if(that.parentId){
                    var data = {resource: {id:that.parentId}}
                    that.entity = Object.assign({},that.entity, data)
                }else that.init()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .hr-res{
        border: 0px;
        background-color: rgb(234, 234, 238);
        height: 2px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .field-grope {
        width: 650px;
        .input {
            width: 200px
        }
        .input-selects{
            width: 125px
        }
        .select {
            width: 147px;
            padding: 1px 10px;
            height: 32px;
            line-height: 32px;
            border-radius: 5px;
            border-width: 0.5px;
            border-color: #b4bccc;
        }
        .selects{
            width: 90px;
            padding: 1px 10px;
            height: 32px;
            line-height: 32px;
            border-radius: 5px;
            border-width: 0.5px;
            border-color: #b4bccc;
        }
        .selects-para{
            width: 60px
        }
    }
    .input-form {
        width: 555px;
    }
    .index-field{
        font-weight: inherit;
    }
    .add-resource{
        float: left;
        width: 100%;
        position: relative;
        padding-left: 150px;
        box-sizing:border-box;
        height: 90%;
        overflow-y: auto;
        .res-data{
            position: relative;
            padding: 20px;
            /*.el-form{*/
                /*width: 80%;*/
                /*margin-top: 20px;*/
            /*}*/
        }
    }

    .schemaTree{
        position: fixed;
        left: 50%;
        top: 10%;
        width: 80%;
        height: calc(80vh);
        margin-left: -40%;
        background-color: #ffffff;
        z-index: 2002
    }
    .schemaTree .diHeader {
        z-index: 100;
        float: left;
        width: 100%;
        height: 45px;
        line-height: 45px;
        background-color: #4c4c51;
    }
    .schemaTree .diHeader h3{
        float: left;
        margin: 0px;
        width: 60%;
        padding: 0px 0px 0px 20px;
        font-weight: normal;
        color: #ffffff;
    }
    .elFormSelect {
        width: 350px;
    }
    .schemaTree .diHeader span{
        color: #ffffff;
        float: right;
        margin-right: 20px;
        margin-top: 14px;
        font-size: 16px;
        cursor: pointer;
    }
    .schemaTree .diFooter{
        float: left;
        width: 100%;
        height: 90px;
        border-top: 1px solid #eeeeee;
        line-height: 30px;
        padding: 15px;
        box-sizing: border-box;
        text-align: right;
        bottom: 0px;
    }
    .schemaTree .diFooter .el-button{
        float: right;
        margin-right: 15px;
    }
    .schemaTree .diContent{
        float: left;
        width: 100%;
        height: 82%;
        padding: 10px;
        overflow-y: auto;
        box-sizing: border-box;
    }
    .input-form-width{
        width: 400px;
    }
    .data-add{
        margin-top: 18px;
        cursor: pointer;
        color: #3e98fe;
    }
    .upload{
        margin-left: 10px;
        cursor: pointer;
        color: #67C23A;
    }
</style>

