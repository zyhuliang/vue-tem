<template>
    <div class="step5" id='bm-ch-filesys-step5-tmp'>
        <!-- element表单组件 -->
        <el-form id="bm-ch-file-step5-form" :model="step5Form" class="demo-step5 demo-step5Form" ref="step5Form"
                 :rules="rules" label-position="top">
            <el-form-item label="任务名称" :label-width="formLabelWidth" prop="name">
                <el-input name="bm-ch-file-step5Form-name-input" type="text" v-model="step5Form.name"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="数据源选择" :label-width="formLabelWidth" prop="dataSource.name">
                <el-input name="bm-ch-file-step5Form-dataSource-name-input" type="text"
                          v-model="step5Form.dataSource.name" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="文件名正则表达式" :label-width="formLabelWidth" prop="dataSource.filename"
                          v-if="statusType == 'FTP'">
                <el-input name="bm-ch-file-step5Form-dataSource-filename-input" type="text"
                          v-model="step5Form.dataSource.filename" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="path" :label-width="formLabelWidth" prop="dataStore.path" v-if="statusType == 'FTP'">
                <el-input name="bm-ch-file-step5Form-dataSource-path-input" type="text"
                          v-model="step5Form.dataStore.path" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="是否覆盖" :label-width="formLabelWidth" prop="dataStore.overwrite"
                          v-if="statusType == 'FTP'">
                <el-input name="bm-ch-file-step5Form-dataSource-overwrite-input" type="text"
                          v-model="step5Form.dataStore.overwrite == 'true'?'是':'否'" auto-complete="off"
                          disabled></el-input>
            </el-form-item>

            <el-form-item label="并行度" :label-width="formLabelWidth" prop="parallelism">
                <el-input name="bm-ch-file-step5Form-parallelism-input" type="text" v-model="step5Form.parallelism"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="错误记录上限数" :label-width="formLabelWidth" prop="errorNumber">
                <el-input name="bm-ch-file-step5Form-errorNumber-input" type="text" v-model="step5Form.errorNumber"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="周期" :label-width="formLabelWidth" prop="trigger"
                          v-if="triggerType =='cron' && statusType != 'SOCKET'" disabled>
                <el-input name="bm-ch-file-step5Form-trigger-input" type="text" v-model="step5Form.trigger"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

        </el-form>
    </div>
</template>
<script>
    import task from '@jsTask/taskStep.js';

    export default {
        name: 'step1',
        components: {},
        data: function () {
            return {
                formLabelWidth: "200px",
                triggerType: '',
                CollectorID: false,
                //数据源的类型
                tfType: "HDFS",
                //目标数据的类型
                statusType: "DB",
                //目标文件写入方式
                modeTmp: '追加',
                //是不是date类型的分区键
                isDate: false,
                step5Form: {
                    dataSource: {},
                    dataStore: {},
                },
                rules: {}
            };
        },
        methods: {
            init: function () {
                var that = this;
                //判断是不是周期执行
                that.triggerType = that.step5Form.trigger ? 'cron' : ''
                //获取数据源的类型
                that.statusType = (that.step5Form.dataSource.type == 'JDBC') ? 'DB' : that.step5Form.dataSource.type
                that.statusType = that.statusType.toUpperCase();
                //获取目标数据的类型
                that.tfType = that.step5Form.dataStore.type
                that.modeTmp = that.step5Form.dataStore.mode == 'append' ? '追加' : '覆盖'
                //判断选中的分区键是日期类型
                if (that.step5Form.partitionPattern)
                    that.isDate = true;
                if (that.step5Form.dataStore.overwrite == true) {
                    that.step5Form.dataStore.overwrite = "true"
                } else if (that.step5Form.dataStore.overwrite == false) {
                    that.step5Form.dataStore.overwrite = "false"
                }
            }
        },
        mounted() {
            if (localStorage.taskEntity) {
                var that = this;
                //获取全局的entity
                that.step5Form = JSON.parse(localStorage.taskEntity);
                console.log(that.step5Form)
                that.init();
            }
        },
        beforeRouteLeave: function (to, from, next) {
            var that = this;
            if (localStorage.taskEntity) {
                //获取全局的entity
                var entity = JSON.parse(localStorage.taskEntity);
                //将局部的entity合并到全局的entity中
                that.step5Form = that.copyObject(entity, that.step5Form)
                //保存全局的entity到storage
                localStorage.taskEntity = JSON.stringify(that.step5Form);
            }

            if (to.path.substr(0, 16) != '/taskWizard/step' && to.path != '/synchronization' && '/collector'.indexOf(to.path) > -1) {
                localStorage.removeItem('taskEntity');
            } else if (to.path == '/synchronization' || '/collector'.indexOf(to.path) > -1) {
                next();
            } else {
                //获取从第几步到第几步
                var fromStep = from.path.charAt(from.path.indexOf('fileTaskWizard/step') + 19)
                var toStep = to.path.charAt(to.path.indexOf('fileTaskWizard/step') + 19)
                if (fromStep > toStep) {
                    next();
                } else {
                    //如果验证都通过才可以下一步
                    that.$refs.step5Form.validate((valid) => {
                        if (valid) {
                            next();
                        } else {
                            //下一步
                            task.$emit('fileTaskNextStep', fromStep)
                            return false;
                        }
                    })
                }
            }
        },
    }
</script>
<style scoped lang="scss">
    .step5 {
        height: calc(100vh - 187px);
        overflow-y: auto;
        .demo-step5 {
            margin-left: 25%;
            width: 50%;
        }
    }
</style>
