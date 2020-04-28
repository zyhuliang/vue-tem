<template>
    <!--采集器升级页面-->
    <el-dialog
            :visible.sync="dialogUploadCollectorVisible"
            width="50%"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            title="升级"
            id='bm-ch-col-collectorupload-tmp'
    >
        <template>
            <el-form id="bm-ch-fileinfo-form" name="fileinfo" method="post" enctype="multipart/form-data"
                     class="bm-ch-fileinfo-form">
                <el-form-item>
                    <span><strong>存放路径</strong><input name="bm-ch-destination-input" type="text"
                                                      style="margin-left:45px;padding:6px 12px;border-radius:4px;border: 1px solid #ccc;width:70%;"
                                                      v-model="destination" id="destination"></span><br><br>
                </el-form-item>
                <el-form-item>
                    <span><strong>执行命令</strong><input name="bm-ch-executeCmd-input" type="text"
                                                      style="margin-left:45px;padding:6px 12px;border-radius:4px;border: 1px solid #ccc;width:70%;"
                                                      v-model="executeCmd" id="executeCmd"></span><br><br>
                </el-form-item>
                <el-form-item>
                    是否重启
                    <label style="margin-left:45px"><input type="radio" name="restart" @click="isRestart()" id="yes"
                                                           value="是">是</label>
                    <label style="margin-left:45px"><input type="radio" name="restart" @click="isRestart()" id="no"
                                                           value="否" checked>否</label>
                </el-form-item>
                <!--上传文件-->
                <el-form-item>
                    <el-upload
                            name="bm-ch-uploadCollector-upload"
                            class="upload-demo upload-collector"
                            ref="uploadCollector"
                            :action="'api/woven/collectors/'+ id +'/upload'"
                            :headers="{'X-AUTH-TOKEN':xToken}"
                            accept=".zip,.jar"
                            :on-success="handleSuccess"
                            :data="{restart: restart, destination: destination, executeCmd: executeCmd}"
                            :file-list="fileList"
                            :auto-upload="false">
                        <el-button name="bm-ch-selectFile-button" slot="trigger" size="small" type="primary">选取文件
                        </el-button>
                        <div slot="tip" class="el-upload__tip">只能上传zip/jar文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </template>
        <div slot="footer">
            <el-button size="small" type="primary" @click="submitUpload" name="bm-ch-selectFile-schema-ok">确定
            </el-button>
            <el-button size="small" @click="dialogUploadCollectorVisible=false" name="bm-ch-selectFile-schema-cancel">
                取消
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {createCollector, updataCollector} from '@api'

    export default {
        name: 'uploadCollector',
        data() {
            return {
                fileList: [],
                dialogUploadCollectorVisible: false,
                id: "",
                destination: "",
                executeCmd: "",
                restart: false,
                xToken: sessionStorage['x-auth-token'],
            }
        },
        methods: {
            //上传成功提示，错误就显示错误
            handleSuccess(res, file) {
                if (res.msg === '上传成功！') {
                    this.$message.success(res.msg);
                    this.dialogUploadCollectorVisible = false;

                } else {
                    this.$message.error(res.msg)
                }
            },
            //点击确定按钮提交升级信息
            submitUpload() {
                this.$refs.uploadCollector.submit();
            },
            //升级采集器
            uploadFiles: function (multipleSelection) {
                this.dialogUploadCollectorVisible = true
                this.id = multipleSelection[0].id
            },
            //是否重启
            isRestart: function () {
                var obj = document.getElementsByName("restart");
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].checked) {
                        if (obj[i].value == '是') {
                            this.restart = true;
                        }
                        if (obj[i].value == '否') {
                            this.restart = false;
                        }
                        return this.restart;
                    }
                }
                return "undefined";
            }
        }
    }
</script>

<style lang="scss">
    .bm-ch-fileinfo-form {
        .el-form-item__content {
            line-height: 10px;
            position: relative;
            font-size: 14px;
        }
    }
</style>