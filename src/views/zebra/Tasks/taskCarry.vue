<template>
    <section class="clearBox" id="bm-qa-tasks-taskCarry">
        <el-form :model="addForm" status-icon ref="addForm" label-width="100px" class="demo-ruleForm"
                 label-position="top" id="bm-qa-tasks-taskCarry-form">
            <el-form-item label="模板">
                <el-input type="text" auto-complete="off" v-model="addForm.modelName" readonly
                          name="modelName"></el-input>
            </el-form-item>
            <el-form-item label="分析模板主键">
                <el-input type="text" auto-complete="off" v-model="addForm.modelId" readonly name="modelId"></el-input>
            </el-form-item>
            <el-form-item label="流程主键">
                <el-input type="text" auto-complete="off" v-model="addForm.flowId" readonly name="flowId"></el-input>
            </el-form-item>
            <el-form-item label="执行任务名">
                <el-input type="text" auto-complete="off" v-model="addForm.name" readonly name="name"></el-input>
            </el-form-item>
            <el-form-item label="任务状态">
                <el-input type="text" auto-complete="off" v-model="addForm.flowStatus" readonly
                          name="flowStatus"></el-input>
            </el-form-item>
            <el-form-item label="输入数据">
                <el-input type="text" auto-complete="off" v-model="addForm.processDataId" readonly
                          name="processDataId"></el-input>
            </el-form-item>
            <el-form-item label="分片类型">
                <el-input type="text" auto-complete="off" v-model="addForm.sliceType" readonly
                          name="sliceType"></el-input>
            </el-form-item>
            <el-form-item label="数据时间片">
                <el-input type="text" auto-complete="off" v-model="addForm.sliceTime" readonly
                          name="sliceTime"></el-input>
            </el-form-item>
            <el-form-item label="执行任务主键">
                <el-input type="text" auto-complete="off" v-model="addForm.id" readonly name="id"></el-input>
            </el-form-item>
            <el-form-item label="输出数据">
                <el-input type="text" auto-complete="off" v-model="addForm.outputDataId" readonly
                          name="outputDataId"></el-input>
            </el-form-item>
            <el-form-item label="数据质量等级">
                <el-input type="text" auto-complete="off" v-model="addForm.qualityRank" readonly
                          name="qualityRank"></el-input>
            </el-form-item>
            <el-form-item label="坏数据占比">
                <el-input type="text" auto-complete="off" v-model="addForm.badRatio" readonly
                          name="badRatio"></el-input>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input type="text" auto-complete="off" v-model="addForm.owner" readonly name="owner"></el-input>
            </el-form-item>
            <el-form-item label="修改时间">
                <el-input type="text" auto-complete="off" v-model="addForm.lastModifiedTime" readonly
                          name="lastModifiedTime"></el-input>
            </el-form-item>
        </el-form>
        <el-button @click="goBack" name="goBack">返回</el-button>
    </section>
</template>

<script>
    import {taskCarry} from '@api'
    import moment from "moment"//时间格式化
    export default {
        name: 'taskcarry',
        data() {
            return {
                row: this.$route.params.row,
                modelId: this.$route.params.row.modelId,
                id: this.$route.query.id,
                addForm: {
                    modelName: '',
                    modelId: '',
                    flowId: '',
                    name: '',
                    flowStatus: '',
                    processDataId: '',
                    sliceType: '',
                    sliceTime: '',
                    id: '',
                    outputDataId: '',
                    qualityRank: '',
                    badRatio: 0,
                    owner: '',
                    lastModifiedTime: 0
                }
            }
        },
        methods: {
            getFormContent() {
                taskCarry(this.modelId, this.id).then(data => {
                    this.addForm.modelName = data.modelName;
                    this.addForm.modelId = data.modelId;
                    this.addForm.flowId = data.flowId;
                    this.addForm.name = data.name;
                    this.addForm.flowStatus = data.flowStatus;
                    this.addForm.processDataId = data.processDataId;
                    this.addForm.sliceType = data.sliceType;
                    this.addForm.sliceTime = data.sliceTime;
                    this.addForm.id = data.id;
                    this.addForm.outputDataId = data.outputDataId;
                    this.addForm.qualityRank = data.qualityRank;
                    this.addForm.badRatio = data.badRatio;
                    this.addForm.owner = data.owner;
                    this.addForm.lastModifiedTime = moment(data.lastModifiedTime).format("YYYY-MM-DD HH:mm:ss");
                })
            },
            goBack() {
                this.$router.push({name: '任务执行信息'});
            }
        },
        mounted() {
            this.getFormContent();
        }
    }
</script>

<style scoped>
    .clearBox {
        padding-left: 20px;
    }

    .demo-ruleForm {
        width: 50%;
    }

</style>
