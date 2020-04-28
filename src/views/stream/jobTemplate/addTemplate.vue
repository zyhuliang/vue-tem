<template>
    <section class="add-template" id='bm-ch-stream-jobTemplate-add-tmp' >
        <div class="res-data">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew?'新建 ':'编辑 '}}作业模板</h4>
                </div>
            </el-row>
            <el-form id="bm-ch-stream-jobTemplate-add-form" :model="entity" ref="entity" :rules="rules" class="data-content">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="entity.name" auto-complete="off" class="input-form" :placeholder="'必填'"></el-input>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth" prop="desc">
                    <el-input v-model="entity.desc" auto-complete="off" class="input-form"></el-input>
                </el-form-item>

                <el-form-item label="内容" :label-width="formLabelWidth" prop="content">
                    <el-input v-model="entity.content" auto-complete="off" class="input-form" type="textarea" rows="10" :placeholder="'必填'" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="data-footer">
                <el-button type="primary" @click="save()">确定</el-button>
                <el-button @click="cancel()">取消</el-button>
            </div>
        </div>
    </section>
</template>

<script>
    import {postTemplate } from '@api'

    export default {
        name: 'addTemplate',
        data() {
            return {
                formLabelWidth: "200px",
                isNew: true,
                entity: {
                    "name": "",
                    "id": "",
                    "desc": "",
                    "content": ''
                },
                rules:{
                    name: [
                        { required: true, message: '请输入内容...', trigger: 'change' }
                    ],
                    'content':[
                        {  required: true, message: '请输入内容...', trigger: 'change' }
                    ],
                }
            }
        },
        methods: {
            //取消按钮
            cancel: function () {
                //刷新列表
                this.$router.push({ name: '作业模板'});
            },
            //确定回调
            save: function () {
                this.$refs.entity.validate((valid) => {
                    if (valid) {
                        postTemplate(this.entity).then(data => {
                            //提交之后获取列
                            this.$router.push({ name: '作业模板'});
                        },error =>{
                            var err = error.response.data.message
                            if(err.indexOf('name dup key') >-1)
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
            this.isNew = this.$route.params.id == 'new'? true :false;
            if(this.$route.query.row){
                this.entity = this.$route.query.row
            }
        }
    }
</script>

<style lang="scss" scoped>
    .btn-left{
        float: left;
        h4{
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
    .add-template {
        float: left;
        width: 100%;
        position: relative;
        box-sizing: border-box;
        height: calc(100vh - 50px);
        .res-data{

            .el-form{
                .el-form-item .el-select{
                    width: 350px;
                }
            }
        }
    }
</style>
