<template>
    <!--add template dialog-->
    <el-dialog v-dialog-drag
            :visible.sync="dialogAddTempVisible"
            :close-on-click-modal="false"
            width="50%"
            :modal-append-to-body="false"
            title="输入模板名称"
            id='bm-ch-stream-jobTemplate-addTemp-tmp'
    >
        <el-form id="bm-addTemp-dialog-form" :model="tempForm" :rules="rules"  ref="tempForm">
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name" required>
                <el-input name="bm-addTemp-dialog-name-input" v-model="tempForm.name" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" >
            <el-button type="primary" @click="ok()" name="bm-adddir-dialog-form-ok-ok">确定</el-button>
            <el-button @click="cancel()" name="bm-adddir-dialog-form-cancel-cancel">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { } from '@api'

    export default {
        name: 'addTempSource',
        data() {
            return {
                dialogAddTempVisible:false,
                tempForm: {name: ''},
                formLabelWidth:"",
                rules:{
                    name: [
                        { required: true, message: '请输入模板名称', trigger: 'change' },
                    ],
                }
            }
        },
        methods: {
//			打开dialog
            dialogAddTemp: function (node) {
                this.dialogAddTempVisible = true
            },
            //取消
            cancel: function () {
                this.$refs['tempForm'].resetFields();
                this.dialogAddTempVisible = false
            },
//            确定回调
            ok: function () {
                this.$refs.tempForm.validate((valid)=>{
                    if(valid){
                        this.$emit('addTempName', this.tempForm.name);
                        this.$refs['tempForm'].resetFields();
                        this.dialogAddTempVisible = false
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
