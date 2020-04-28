<template>
    <!--addDir dialog-->
    <el-dialog v-dialog-drag
               :visible.sync="dialogAddDirVisible"
               :close-on-click-modal="false"
               width="50%"
               :modal-append-to-body="false"
               title="输入目录名称"
               id='bm-ch-resMan-addDir-tmp'
    >
        <el-form id="bm-adddir-dialog-form" :model="dirForm" :rules="rules" ref="dirForm">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name" required>
                <el-input name="bm-adddir-dialog-name-input" v-model="dirForm.name" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" @click="ok()" name="bm-adddir-dialog-form-ok-ok">确定</el-button>
            <el-button @click="cancel()" name="bm-adddir-dialog-form-cancel-cancel">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {} from '@api'

    export default {
        name: 'addDirSource',
        data() {
            var checkName = (rule, value, callback) => {
                value = value.replace(/\s*/g,'')
                if (!value) {
                    return callback(new Error('目录名称不能为空'));
                }else{
                    callback();
                }
            };
            return {
                dialogAddDirVisible: false,
                dirForm: {name: ''},
                formLabelWidth: "",
                selectNode: {},
                isNew: true,
                rules: {
                    name: [
                        {validator: checkName, trigger: 'blur'},
                    ],
                }
            }
        },
        methods: {
            //打开dialog
            dialogAddDir: function (node) {
                if (node) {
                    this.isNew = false;
                    this.dirForm.name = node.name;
                    this.selectNode = node;
                } else {
                    this.isNew = true;
                    this.dirForm.name = "";
                }
                this.dialogAddDirVisible = true
            },
            //取消
            cancel: function () {
                this.$refs['dirForm'].resetFields();
                this.dialogAddDirVisible = false
            },
            //确定回调
            ok: function () {
                this.$refs.dirForm.validate((valid) => {
                    if (valid) {
                        if (!this.isNew) {
                            if (this.selectNode.name !== this.dirForm.name) {
                                this.selectNode.name = this.dirForm.name;
                                this.$emit('addDir', this.dirForm.name, this.selectNode);
                            }
                        } else {
                            this.$emit('addDir', this.dirForm.name);
                        }
                        this.$refs['dirForm'].resetFields();
                        this.dialogAddDirVisible = false
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
