<template>
    <section>
        <!--操作按钮-->
        <el-row class="btnClass">
            <div class="btn-right">
                <el-button type="info" id='bm-ch-file-container-create-button'
                           @click="dialogFormVisible = true"><i class="icon iconfont icon-ir-text-add"></i>创建
                </el-button>
                <el-button type="info" id='bm-ch-file-container-refresh-button' @click="refresh()"><i
                        class="icon iconfont icon-ir-refresh"></i>刷新
                </el-button>
                <el-button type="info" id='bm-ch-file-container-delete-button' @click="delTable"
                           :disabled="multipleSelection.length == 0"><i
                        class="icon iconfont icon-ir-directory-delete"></i>删除
                </el-button>
                <el-button type="info" id='bm-ch-file-container-downLoad-button' @click="downLoad"
                           :disabled="multipleSelection.length == 0"><i
                        class="icon iconfont icon-ir-download"></i>下载
                </el-button>
                <el-button type="info" id='bm-ch-file-container-gotoDir-button' @click="gotoDir('')"><i
                        class="icon iconfont icon-ir-home"></i>根目录
                </el-button>
                <el-button type="info" id='bm-ch-file-container-lastLevel-button' @click="lastLevel()"><i
                        class="icon iconfont icon-ir-text-up"></i>上一级
                </el-button>
            </div>
        </el-row>
        <el-row class="crumbs">
            <span><strong>&nbsp; &nbsp; 当前路径（HDFS）： {{currentPath == "" ? "/" : currentPath}}</strong></span>
        </el-row>
        <!--内容显示列表页面-->
        <el-table
                ref="multipleTable"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                :data="tableData"
                style="width: 100%"
                height="calc(100vh - 160px)">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="名称">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.dir == true" @click="gotoDir(scope.row.path)" type="text">
                        {{scope.row.name}}
                    </el-button>
                    <el-button v-else-if="scope.row.dir == false" class="no-link" type="text" disabled>
                        {{scope.row.name}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="len"
                    label="大小(字节)">
            </el-table-column>
            <el-table-column
                    prop="owner"
                    label="所有者">
            </el-table-column>
            <el-table-column
                    prop="modificationTime"
                    label="最后修改时间"
                    :formatter="dateFormat">
            </el-table-column>
        </el-table>
        <el-dialog v-dialog-drag title="创建目录" :visible.sync="dialogFormVisible" width="50%">
            <el-form id="bm-ch-container-form">
                <el-form-item label="目录名称" prop="dirName">
                    <el-input name="bm-ch-container-dirName-input" v-model="dirName"
                              auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm()" name="bm-ch-step1Form-schema-ok">确定</el-button>
                <el-button @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
    import {getFileList, makeDir, delDir, setUpOss, fileDownload} from '@api'
    import * as fileResumable from '@static/jsLibrary/resumable'

    export default {
        components: {},
        data() {
            return {
                rootPath: "",
                currentPath: "",
                multipleSelection: [],
                tableData: [],
                dialogFormVisible: false,
                dirName: "",
                oss_url: "",
                files: [],
                resumable: {},
                dialogVisible: false,
                dstPath: "",
                isLoading: false,
                loading: true
            }
        },
        methods: {
            // 下载
            downLoad: function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.path;
                    tbIds.push(tdIds);
                });
                var xToken = sessionStorage.getItem('x-auth-token');
                fileDownload(tbIds).then(data => {
                    if (data.success) {
                        location.href = this.oss_url + '/file/download?download_token=' + data['download_token'] + '&&X-AUTH-TOKEN=' + xToken
                    }
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 删除
            delTable: function () {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var that = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.path;
                    tbIds.push(tdIds);
                });
                that.$confirm('真的要删除' + tbIds.length + '个么?', '提示', {}).then(() => {
                    delDir(tbIds).then(data => {
                        that.fileList(that.currentPath);
                        that.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    }, error => {
                        this.$confirm("无权限", "错误", {
                            type: "error"
                        })
                    })
                }).catch(() => {

                });
            },
            // 预览文件目录——查看目录下内容
            gotoDir: function (path) {
                var that = this
                getFileList(path).then(data => {
                    this.currentPath = path
                    that.tableData = data
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }).catch(function (error) {
                    // 由网络或者服务器抛出的错误
                    that.$confirm("无权限", "错误", {
                        type: "error"
                    })
                })
            },
            // 创建目录回调按钮
            confirm: function () {
                this.dialogFormVisible = false;
                var param = {
                    parentPath: this.currentPath,
                    name: this.dirName
                }
                if (param.name == '') {
                    this.$confirm("目录不可为空", "错误", {
                        type: "error"
                    })
                    return false;
                }
                var that = this
                makeDir(param).then(data => {
                    this.fileList(this.currentPath);
                    that.dirName = ""
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }).catch(function (error) {
                    if (error.response) {
                        that.$confirm(error.response.data.message, "错误", {
                            type: "error"
                        })
                    }
                })
            },
            // 刷新
            refresh: function () {
                this.fileList(this.currentPath);
            },
            //返回上一级
            lastLevel: function () {
                var arr = this.currentPath.split("/")
                if (arr.length >= 2 && this.currentPath.split("/").length - 1 != 1) {
                    var index = this.currentPath.lastIndexOf("/");
                    var path = this.currentPath.substring(0, index);
                    this.currentPath = path
                    this.fileList(path);
                } else {
                    this.rootPath = ""
                    this.currentPath = ""
                    this.fileList();
                }
            },
            // 获取文件列表
            fileList: function (path) {
                var path = path ? path : this.rootPath
                var that = this;
                getFileList(path).then(data => {
                    this.loading = false
                    that.tableData = data
                }, error => {
                    that.$message({
                        message: '获取列表失败！',
                        type: 'error'
                    });
                })
            },

            initResumable: function (el) {
                var that = this
                var resumable
                if (!window['resumable']) {
                    resumable = new fileResumable({
                        //target: this.oss_url + '/upload',
                        target: "/api/oss/upload",
                        chunkSize: 3 * 1024 * 1024,
                        simultaneousUploads: 4,
                        testChunks: true,
                        throttleProgressCallbacks: 1,
                        method: "octet",
                        generateUniqueIdentifier: function (f, e) {
                            return f.name + '-' + f.lastModified + '-' + +f.size;
                        },
                        isLoading: false,
                        loadStatus: 0
                    });
                    window['resumable'] = resumable
                } else {
                    resumable = window['resumable']
                    that.dstPath = resumable.getOpt('query').dstPath
                }

                resumable.assignBrowse(el)

                resumable.clearEvents();
                resumable.on('fileAdded', function (file) {
                    that.files = resumable.files
                });
                resumable.on('fileSuccess', function (file, message) {
                    that.$message({
                        message: '恭喜你，文件上传已成功！',
                        type: 'success'
                    });
                    var index = that.files.indexOf(file);
                    if (index > -1) {
                        that.files.splice(index, 1);
                    }
                });
                resumable.on('fileError', function (file, message) {
                    that.$message({
                        message: '文件上传失败！',
                        type: 'failed'
                    });
                });
                resumable.on('fileProgress', function (file) {
                    that.files = resumable.files
                });
                resumable.on("complete", function () {
                    resumable.isLoading = false
                    that.isLoading = false
                    resumable.loadStatus = 3
                    that.dstPath = ""
                })
                resumable.on('progress', function () {
                    for (var item in that.files) {
                        that.files[item].progressNum = Math.round(resumable.files[item].progress() * 100)
                        // 由于element-ui progress进度条无效，利用size改变刷新页面
                        that.files[item].size = that.files[item].size + 1
                        that.files[item].size = that.files[item].size - 1
                        //that.fileList(that.currentPath)
                    }
                })
                this.files = resumable.files
                this.resumable = resumable
                //this.isUploading = resumable.isUploading
            },
            //初始化，绑定dom节点
            init: function () {
                // 获取dom，并绑定
                var el;
                var that = this
                var selectEl = function () {
                    el = document.getElementById("select-files")
                    if (!el) {
                        setTimeout(function () {
                            selectEl()
                        }, 100)
                    } else {
                        console.log('el = ', el)
                        if (that.currentPath == "") {
                            that.currentPath = that.rootPath = ''
                        }
                        setUpOss().then(data => {
                            console.log('oss = ', data)
                            that.oss_url = data['oss_url']
                            that.initResumable(el)
                            that.isLoading = resumable.isLoading
                        }, err => {
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    }
                }
                selectEl()
            },
        },
        mounted() {
            this.fileList();
            this.init();
        },
    };

</script>

<style>
    .btn {
        margin-bottom: 15px;
    }

    .crumbs {
        margin: 15px 0px;
    }

    .no-link {
        color: black !important;
    }
</style>