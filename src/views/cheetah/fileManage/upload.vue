<template>
    <section id='bm-ch-file-container-tmp'>
        <!--操作按钮-->
        <el-row class="btn btnClass">
            <div class="btn-right">
                <el-button type="info" id="select-files"
                           :disabled="resumable.isLoading || resumable.loadStatus == 1 || resumable.loadStatus == 2">
                    <i class="icon icon iconfont icon-ir-nav-close navclose"></i>浏览文件
                </el-button>
                <el-button type="info" id='bm-ch-file-container-upload-button' v-show="!isLoading"
                           @click="upload"><i class="icon iconfont icon-ir-text-up"></i>上传
                </el-button>
                <el-button type="info" id='bm-ch-file-container-stop-button' v-show="isLoading" @click="stop"><i
                        class="icon iconfont icon-ir-stop"></i>停止
                </el-button>
            </div>
        </el-row>
        <!--内容显示列表页面-->
        <el-table
                tooltip-effect="dark"
                :data="files"
                v-loading="loading"
                id="bm-ch-filemanage-container-table"
                style="width: 100%"
                height="calc(100vh - 130px)">
            <el-table-column
                    prop="fileName"
                    label="文件名">
            </el-table-column>
            <el-table-column
                    prop="size"
                    label="大小">
            </el-table-column>
            <el-table-column
                    label="进度"
                    width="400">
                <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage=scope.row.progressNum
                                 status="success">{{scope.row.progressNum}}
                    </el-progress>
                </template>

            </el-table-column>
            <el-table-column
                    width="100">
                <template slot-scope="scope">
                    <el-button v-show="!resumable.isLoading && resumable" @click="removeItem(scope.row)"
                               type="text" size="small">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--路径提示框-->
        <el-dialog v-dialog-drag
                   title="提示"
                   width="30%"
                   :visible.sync="dialogVisible">
            <span>上传路径为{{currentPath}},确定要上传么？</span>
            <span slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="centerUpload"
                                       name="bm-ch-file-container-upload-ok">确定</el-button>
                            <el-button @click="dialogVisible = false"
                                       name="bm-ch-file-container-upload-cancel">取消</el-button>
                      </span>
        </el-dialog>
    </section>
</template>
<script>
    import {getFileList, setUpOss, hasPermission} from '@api'
    import * as fileResumable from '@static/jsLibrary/resumable'

    export default {
        components: {},
        data() {
            return {
                rootPath: "",
                currentPath: "",
                tableData: [],
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
            // 上传文件
            upload: function () {
                // 判断上传文件个数
                if (this.files.length == 0) {
                    this.$message({
                        message: '请选择上传文件',
                        type: 'warning'
                    });
                    return false
                }
                if (this.resumable.loadStatus == 2) {
                    this.resumable.upload();
                    this.resumable.isLoading = true
                    this.isLoading = true
                    this.resumable.loadStatus = 1
                    return false
                }
                var that = this
                hasPermission(that.currentPath).then(data => {
                    if (data.write) {
                        that.dialogVisible = true
                    } else {
                        that.$message({
                            message: '当前目录无权限',
                            type: 'warning'
                        });
                    }
                }, err => {
                    that.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }).catch(function (error) {
                    that.dstPath = that.currentPath
                })
            },
            // 停止文件上传
            stop: function () {
                this.resumable.pause()
                this.resumable.isLoading = false
                this.isLoading = false
                this.resumable.loadStatus = 2;
            },
            // 删除上传文件
            removeItem: function (row) {
                var index = this.resumable.files.indexOf(row);
                if (index !== -1) {
                    this.resumable.files.splice(index, 1);
                }
                this.files = this.resumable.files
                if (this.resumable.files.length == 0) {
                    this.resumable.loadStatus = 3
                }
            },
            //选中文件时候调用
            centerUpload: function () {
                this.dialogVisible = false
                resumable.updateQuery({
                    dstPath: this.currentPath
                })
                this.dstPath = this.currentPath
                this.resumable.upload();
                this.resumable.isLoading = true
                this.isLoading = true
                this.resumable.loadStatus = 1
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