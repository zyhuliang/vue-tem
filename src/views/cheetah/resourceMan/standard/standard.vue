<template>
    <section class="add-resource " id='bm-ch-resMan-standard-tmp'>
        <div class="res-data" v-loading="loading">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew ? '新建 ' : '编辑 '}}数据标准</h4>
                </div>
            </el-row>

            <info-from
                    :config="standardConfig"
                    :modelData="entity"
            />
            <el-form ref="formimport" :model="formimport" label-width="120px">
                <el-form-item label="导入" :label-width="lableWidth" v-if="entity.name!==''">
                    <el-button type="primary" size="small" :disabled="disabled"  round @click="importExc()">导入文件</el-button>
                </el-form-item>
                <el-form-item label="增加并列项" :label-width="lableWidth">
                    <el-button type="primary" size="small"  round :disabled="entity.name==''"  @click="append('add')">增加</el-button>
                </el-form-item>
            </el-form>
            <el-scrollbar style="height: calc(100vh - 430px)">
                <div class="standardContent">
                    <div class="standard-name-code">
                        <span class="standard-code">编号</span>
                        <span class="standard-name">名字</span>
                    </div>
                    <div class="custom-tree-container">
                        <div class="block">
                            <el-tree :data="standardsData" node-key="code" :expand-on-click-node="false"
                                     ref="treeParent">
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ data.code }}</span>
                                <span class="treeBox">
                                    <span class="standardsName">{{  data.name }}</span>
                                    <el-button :name="'bm-ch-resourceMan-standard-append-button'+data.name" type="text"
                                               size="mini" @click="append(data)">
                                    <i class="el-icon-circle-plus-outline"></i>
                                    </el-button>
                                    <el-button :name="'bm-ch-resourceMan-standard-remove-button'+data.name" type="text"
                                               size="mini" @click="remove(node, data)">
                                    <i class="el-icon-delete"></i>
                                    </el-button>
                                    <el-button :name="'bm-ch-resourceMan-standard-edit-button'+data.name" type="text"
                                               size="mini" @click="edit(node, data)">
                                    <i class="el-icon-edit"></i>
                                    </el-button>

                                </span>
                                </span>
                            </el-tree>
                            <div id="pagination">
                                 <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-sizes="[15, 20, 60, 80]"
                                    :page-size="pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="total">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <!-- import dialog-->
        <el-dialog v-dialog-drag
                   title="导入"
                   :visible.sync="dialogImportVisible"
                   width="50%"
                   class="el-body-padding">
            <template>
                <el-form id="bm-ch-resourceMan-standardImportFile-form" name="fileinfo" method="post"
                         enctype="multipart/form-data">
                    <el-form-item>选择上传的文件</el-form-item>
                    <el-upload
                            :show-file-list="true"
                            ref="uploadStandard"
                            action="api/woven/upload/read/excel?maxSheet=1&maxRow=10000&maxColumn=3"
                            class="upload-demo"
                            :on-success="uploadSuccess"
                            :on-change="handleChange"
                            :file-list="fileList"
                            :data ="entity"
                            accept=".xls"
                            :auto-upload="false"
                            :headers="{'X-AUTH-TOKEN':xToken}"
                    >
                        <el-button slot="trigger" class="button-file" size="small">浏览</el-button>
                    </el-upload>
                </el-form>
                <el-checkbox v-model="entity.isTree" class="isTree">树形结构</el-checkbox>
            </template>

            <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="uploadFile"
                           name="bm-ch-resourceMan-standard-uploadFile-ok">确定</el-button>
                <el-button @click="dialogImportVisible = false"
                           name="bm-ch-resourceMan-standard-uploadFile-cancel">取消</el-button>
		  </span>
        </el-dialog>
    </section>
</template>

<script>
    import infoFrom from '@components/infoFrom/infoFrom'

    let id = 1000;
    import {getStandard, postStandard, putStandard, getStandards, deleteStandardId,
        editorStandard,
        creatStandard
    } from "@api";
    import resInPro from "@rhinos/projectDir/dataTree/resNav.js";
    import resIn from "@components/dataTree/resNav.js";
    import {queryObject, createParameter} from '@components/function/queryParameter.js';
    import {globalRuleForm} from '@js/util/util'

    export default {
        name: "standard",
        components: {
            infoFrom
        },
        watch:{
        },
        data() {
            return {
                loading: false,
                isTree: false,
                standard: {
                    code: '',
                    name: ''
                },
                dialogCode: false,
                code: '',
                formLabelWidth: "200",
                selectNode: "",
                entity: {
                    id: "",
                    name: "",
                    type: "standard",
                    description: "",
                    attributes: {chineseName: ""},
                    isTree: false
                },
                isNew: true,
                standardsData: [],
                importData: [],
                dialogImportVisible: false,
                rules: {},
                data: [[]],
                treeMode: true,
                uploading: false,
                f: "",
                errFile: "",
                dlgStatus: null,
                fileList: [],
                appendData: {},
                allLength: 0,
                xToken: sessionStorage['x-auth-token'],
                rules: {
                    name: [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                },
                tableData:[],
                 currentPage: 0,
                 pageSize: 15,
                 total:10,
                 sid: '',
                 sname: '',
                 lableWidth: '120px',
                 formimport:{},
                 dialogAddVisible:false,
                 disabled: false
            };
        },
        methods: {
            append(data) {
                // 先清空
                // this.dialogAddVisible = true
                this.standard = {
                    code: '',
                    name: ''
                };
                const h = this.$createElement;
                this.$msgbox({
                    title: '标准配置',
                    message: h('p', null, [
                        h('input', {
                            style: {
                                width: '100%',
                                height: '35px',
                                border: '1px solid #ccc',
                                marginBottom: '20px',
                                paddingLeft: '15px',
                                boxSizing: 'border-box'
                            },
                            domProps: {
                                placeholder: 'Name',
                                value: ''
                            },
                            on: {
                                input: (event) => {
                                    this.standard.name = event.target.value
                                }
                            }
                        },),
                        h('input', {
                            style: {
                                width: '100%',
                                height: '35px',
                                border: '1px solid #ccc',
                                paddingLeft: '15px',
                                boxSizing: 'border-box'
                            },
                            domProps: {
                                placeholder: '编号',
                                value: data.parentCode?data.parentCode:""
                            },
                            on: {
                                input: (event) => {
                                    this.standard.code = event.target.value
                                }
                            }
                        },)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        var that = this
                        if (action === 'confirm') {
                            if (!this.standard.code || !this.standard.name) {
                                this.$message.error('编号和名字必填');
                                return
                            }
                            let entityStandards = that.buildArray(that.standardsData, {
                                childrenList: "children",
                                needDelete: true
                            })
                            for (var i = 0; i < entityStandards.length; i++) {
                                if (entityStandards[i].code === that.standard.code) {
                                    that.$message.error('编码不能一致');
                                    return
                                }
                            }

                            if (data === 'add') {
                                // debugger
                                // postStandard(that.entity).then(res=>{
                                //     this.entity.sid = res.id
                                //     this.sname = res.name
                                // })
                                var that = this;
                                var addOrEditStandard = that.isNew
                                    ? postStandard(that.entity)
                                    : putStandard(that.entity.id, that.entity);
                                addOrEditStandard.then(res => {
                                    that.sid = res.id
                                    that.entity.sid = res.id
                                    that.sname = res.name
                                        let addData = {
                                            code: that.standard.code,
                                            name: that.standard.name,
                                            sid: that.entity.sid,
                                            sname: that.sname
                                        }
                                        creatStandard(addData).then(res=>{
                                            that.getTreeData()
                                        })
                                    }, error => {
                                        that.$message({
                                            message: error.response.data.err,
                                            type: 'error',
                                            duration: 1500
                                        });
                                    })   
                            } else {
                                let addData = {
                                    id: '',
                                    code: that.standard.code,
                                    name: that.standard.name,
                                    parentCode: data.code,
                                    sid: that.sid,
                                    aname: that.sname
                                }
                                creatStandard(addData).then(res=>{
                                    that.getTreeData();
                                })
                                // if (!data.children) {
                                //     data.children = []
                                // }
                                // data.children.push({
                                //     code: that.standard.code,
                                //     name: that.standard.name,
                                //     id: '',
                                //     parentCode: data.code
                                // });

                                // that.standardsData = that.buildArray(that.standardsData, {
                                //     childrenList: "children",
                                //     needDelete: true
                                // })
                                // that.allLength = that.standardsData.length
                                // that.standardsData = that.buildTree(that.standardsData, {
                                //     code: 'code',
                                //     parentCode: 'parentCode',
                                //     children: 'children'
                                // })
                            }
                            done();
                        } else {
                            done();
                        }
                    }
                }).then(action => {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                });
            },
            remove(store, data) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // console.log('删除成功')
                    console.log('store',store)
                    console.log('data',data)
                    store.remove(data);
                    deleteStandardId(data.id).then(res=>{
                            this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTreeData()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 编辑标准名
            edit(node, data) {
                let inputName = ''
                const h = this.$createElement;
                this.$msgbox({
                    title: '编辑标准名',
                    message: h('p', null, [
                        h('input', {
                            style: {
                                width: '100%',
                                height: '35px',
                                border: '1px solid #ccc',
                                marginBottom: '20px',
                                paddingLeft: '15px',
                                boxSizing: 'border-box'
                            },
                            domProps: {
                                placeholder: 'Name',
                                value: data.name
                            },
                            on: {
                                input: (event) => {
                                    inputName = event.target.value
                                }
                            }
                        },)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            if (!inputName) {
                                this.$message.error('名字不能为空');
                                return
                            }
                            data.name = inputName
                            editorStandard(data.id,data).then(res=>{
                                this.$message({
                                    type: 'success',
                                    message: '编辑成功!'
                                });
                            })
                            done();
                        } else {
                            done();
                        }
                    }
                }).then(action => {
                        
                });
            },
            init: function (data) {
                var that = this;
                that.loading = true;
                that.entity.id = that.$route.params.id;
                that.isNew = false;
                //如果是编辑，获取data数据
                getStandard(that.entity.id, that.$route.params.parentId).then(res => {
                    that.loading = false;
                    this.sid = res.id
                    this.sname = res.name
                    that.entity = Object.assign({}, that.entity, res);
                    //获取StandardsMap的数组
                    var para = createParameter("sid", that.entity.id, "EQUAL").Limit(that.pageSize).Offset(that.pageSize*that.currentPage).Sort('lastModifiedTime', 'DESC').Build();
                    that.entity.attributes.standards = []
                    
                    getStandards(para).then(res => {
                        that.loading = false;
                        this.standardsData = res.content
                        that.allLength = res.totalElements;
                        that.total = res.totalElements
                    });
                }, err => {
                    that.loading = false;
                    this.$message({
                        message: err.response.message,
                        type: "error",
                        duration: 1500
                    });
                });
            },
            //导入excel表的数据
            importExc: function () {
                var that = this;
                var addOrEditStandard = that.isNew
                    ? postStandard(that.entity)
                    : putStandard(that.entity.id, that.entity);
                addOrEditStandard.then(
                    data => {
                        that.entity.sid = data.id
                        this.sid = data.id
                        that.dialogImportVisible = true;
                    }, error => {
                        var err = error.response.data.err
                        if (err.indexOf('Duplicate') > -1) {
                        }
                        err = '保存失败，此名称已存在'
                        this.$message({
                            message: err,
                            type: 'error',
                            duration: 1500
                        });
                    })
            },
            //成功上传后返回数据
            uploadSuccess: function (res) {
                this.disabled = true
                this.loading = false;
                this.$message({
                        message: `上传成功`,
                        type: 'success',
                        duration: 1500
                    });
                this.getTreeData()
                this.dialogImportVisible = false
            },
            //点击确定上传文件
            uploadFile: function (data) {
                this.$refs.uploadStandard.submit();
                this.dialogImportVisible = false
                this.loading = true
            },
            //取消
            cancel: function () {
                var urlTrue = window.location.href.indexOf("/project") > -1;
                if (urlTrue === true) {
                    resInPro.$emit("refreshList", false, "standard");
                } else {
                    resIn.$emit("refreshList", false, "standard");
                }
            },
            //保存
            save: function () {
                // 把树形结构转成数组
                var that = this;
                // if (!that.standardsData.length) {
                //     that.$message.error('标准不能为空');
                //     return
                // }
                // that.$set(that.entity.attributes, 'standards', that.buildArray(that.standardsData, {
                //     childrenList: "children",
                //     needDelete: true
                // }))
                var addOrEditStandard = that.isNew
                    ? postStandard(that.entity)
                    : putStandard(that.entity.id, that.entity);
                //提交 schema
                addOrEditStandard.then(
                    data => {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            onClose: () => {
                                //提交之后获取列
                                that.$router.push({path: "/resourceMan"});
                                resIn.$emit("refreshList", false, "standard");
                            }
                        });
                    }, error => {
                        var err = error.response.data.err
                        if (err.indexOf('Duplicate') > -1) {
                        }
                        err = '保存失败，此名称已存在'
                        this.$message({
                            message: err,
                            type: 'error',
                            duration: 1500
                        });
                    })

            },
            //确定回调
            ok: function () {
                this.$emit("standard", this.entity);
                this.dialogStandardVisible = false;
            },
            handleChange(file, fileList) {
                this.fileList = fileList.slice(-1);
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val
                 this.getTreeData();
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.currentPage = val
                 this.getTreeData();
            },
            getTreeData(){
                const that = this
                var para = createParameter("sid", that.sid, "EQUAL").Limit(that.pageSize).Offset(that.pageSize*that.currentPage).Sort('lastModifiedTime', 'DESC').Build();
                    that.entity.attributes.standards = []
                    
                    getStandards(para).then(res => {
                        that.loading = false;
                        this.standardsData = res.content
                        that.total = res.totalElements
                    });
            }
        },
        created() {
            this.standardConfig = {
                operationFixed: true,
                ref: 'entity',
                size: 'small',
                lableWidth: '120px',
                validate: {
                    'name': [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                rule: [
                    {
                        label: '名称',
                        type: 'infoInput',
                        model: 'name',
                        methods: (val) => {
                            this.entity.name = val
                        }
                    },
                    {
                        label: '中文名',
                        type: 'infoInput',
                        model: 'attributes.chineseName',
                        methods: (val) => {
                            this.entity.attributes.chineseName = val
                        }
                    },
                    {
                        label: '描述',
                        type: 'infoInput',
                        model: 'description',
                        methods: (val) => {
                            this.entity.description = val
                        }
                    },
                    // {
                    //     label: '导入',
                    //     type: 'infoButton',
                    //     model: 'import',
                    //     size: 'small',
                    //     operation: [{
                    //         label: '导入文件',
                    //         type: 'primary',
                    //         plain: true,
                    //         disabled: false,
                    //         method: (vue, ref) => {
                    //             this.importExc()
                    //         }
                    //     }]
                    // },
                    // {
                    //     label: '增加并列项',
                    //     type: 'infoButton',
                    //     model: 'increase',
                    //     size: 'small',
                    //     operation: [{
                    //         label: '增加',
                    //         type: 'primary',
                    //         plain: true,
                    //         disabled: false,
                    //         method: (vue, ref) => {
                    //             this.append('add')
                    //         }
                    //     }]
                    // }
                    ],
                operation: [{
                    label: '确定',
                    type: 'primary',
                    plain: true,
                    method: (vue, ref) => {
                        if (globalRuleForm(vue, ref)) {
                            this.save()
                        }
                    }
                },
                    {
                        label: '取消',
                        type: 'primary',
                        plain: true,
                        method: (vue, ref) => {
                            this.cancel()
                        }
                    }
                ]
            }
        },
        mounted() {
            var that = this;
            // 调用schema的页面
            if (that.$route.params.id == "new") {
                var data = {resourceId: that.$route.params.parentId};
                that.entity = Object.assign({}, that.entity, data);
            } else {
                this.disabled = true
                that.init();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .el-scrollbar__wrap {
        overflow-x: hidden !important;;
    }

    .res-data {
        position: relative;
    }

    #bm-ch-resourceMan-standard-form {
        height: auto;
    }

    .isTree {
        margin: 10px 0
    }

    .btn-left {
        float: left;
        h4 {
            margin: 10px 0px 0px 10px;
        }
    }

    .field-grope {
        width: 390px;
        .input {
            width: 200px;
        }
        .input-selects {
            width: 125px;
        }
        .select {
            width: 147px;
        }
        .selects {
            width: 90px;
        }
        .selects-para {
            width: 60px;
        }
    }

    .tree-table-form {
        width: 57%;
    }

    .input-form {
        width: 50%;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .treeBox {
        width: 450px;
        .standardsName {
            display: inline-block;
            margin-right: 50px;
            /*height: 40px;*/
            /*line-height: 40px;*/
            width: 250px;
            text-overflow: ellipsis;
            white-space: nowrap
        }
    }

    .button-file {
        margin-left: 10px
    }

    .standard-code {
        padding-left: 24px;
        font-size: 16px;
        margin-right: auto;
    }

    .standard-name {
        padding-right: 427px;
    }

    .standard-name-code {
        display: flex;
        width: 100%;
        font-size: 16px;
        margin-bottom: 10px;
        padding-left: 100px;
    }

    .custom-tree-container {
        width: 100%;
        padding-left: 100px;
        > div {
            width: 100%
        }
    }
</style>
<style >
.res-data .el-scrollbar__bar {
    width: 13px !important;
}
</style>