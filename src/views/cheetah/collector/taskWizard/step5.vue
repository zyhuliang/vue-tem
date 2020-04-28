<template>
    <div id='bm-ch-col-step5-tmp' class="step5">
        <!-- element表单组件 -->
        <el-form id="bm-ch-step5-form" :model="step5Form" class="demo-step5" ref="step5Form" :rules="rules"
                 label-position="top">
            <el-form-item label="任务名称" :label-width="formLabelWidth" prop="name">
                <el-input name="bm-ch-step5Form-name-input" type="text" v-model="step5Form.name" auto-complete="off"
                          disabled></el-input>
            </el-form-item>

            <el-form-item label="数据源选择" :label-width="formLabelWidth" prop="dataSource.name">
                <el-input name="bm-ch-step5Form-dataSource-name-input" type="text" v-model="step5Form.dataSource.name"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="表选择" :label-width="formLabelWidth" prop="dataSource.table" v-if="statusType == 'DB'">
                <el-input name="bm-ch-step5Form-dataSource-table-input" type="text" v-model="step5Form.dataSource.table"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="操作类型" :label-width="formLabelWidth" prop="dataSource.operateType"
                          v-if="statusType == 'SOCKET'">
                <el-input name="bm-ch-step5Form-dataSource-operateType-input" type="text"
                          v-model="step5Form.dataSource.operateType== 0? '原样' : step5Form.dataSource.operateType == 1? '抽取' :step5Form.dataSource.operateType == 2? '分割' : '过滤'"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item :label="'Schema'| cn" :label-width="formLabelWidth" prop="dataSource.schemaName"
                          v-if="statusType == 'HTTP' || statusType == 'FTP' || statusType == 'SOCKET'">
                <el-input name="bm-ch-step5Form-dataSource-schemaName-input" type="text"
                          v-model="step5Form.dataSource.schemaName" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="数据过滤" :label-width="formLabelWidth" prop="dataSource.parameters"
                          v-if="statusType == 'HTTP'">
                <el-input name="bm-ch-step5Form-dataSource-parameters-input" type="text"
                          v-model="step5Form.dataSource.parameters" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="正则表达式" :label-width="formLabelWidth" prop="dataSource.regex"
                          v-if="statusType == 'SOCKET'">
                <el-input name="bm-ch-step5Form-dataSource-regex-input" type="text" v-model="step5Form.dataSource.regex"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="文件名" :label-width="formLabelWidth" prop="dataSource.filename"
                          v-if="statusType == 'FTP'">
                <el-input name="bm-ch-step5Form-dataSource-filename-input" type="text"
                          v-model="step5Form.dataSource.filename" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="数据过滤" :label-width="formLabelWidth" prop="dataSource.selectSQL"
                          v-if="statusType == 'DB'">
                <el-input name="bm-ch-step5Form-dataSource-selectSQL-input" type="text"
                          v-model="step5Form.dataSource.selectSQL" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="数据存储" :label-width="formLabelWidth" prop="dataStore.name">
                <el-input name="bm-ch-step5Form-dataSource-name-input" type="text" v-model="step5Form.dataStore.name"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="写入模式" :label-width="formLabelWidth" prop="modeTmp" v-if="tfType == 'HDFS'">
                <el-input name="bm-ch-step5Form-dataSource-modeTmp-input" type="text" v-model="modeTmp"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="扩展表" :label-width="formLabelWidth" prop="dataSource.tableExt"
                          v-if="statusType == 'DB'">
                <el-input name="bm-ch-step5Form-dataSource-tableExt-input" type="text"
                          v-model="step5Form.dataSource.tableExt" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="游标批量大小" :label-width="formLabelWidth" prop="dataSource.fetchSize"
                          v-if="statusType =='DB'">
                <el-input name="bm-ch-step1Form-datasource-fetchSize-input" type="text"
                          v-model="step5Form.dataSource.fetchSize" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="查询超时" :label-width="formLabelWidth" prop="dataSource.queryTimeout"
                          v-if="statusType =='DB'">
                <el-input name="bm-ch-step1Form-datasource-queryTimeout-input" type="text"
                          v-model="step5Form.dataSource.queryTimeout" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="并行度" :label-width="formLabelWidth" prop="parallelism">
                <el-input name="bm-ch-step5Form-parallelism-input" type="text" v-model="step5Form.parallelism"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="错误记录上限数" :label-width="formLabelWidth" prop="errorNumber">
                <el-input name="bm-ch-step5Form-errorNumber-input" type="text" v-model="step5Form.errorNumber"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="Schema发生改变后，此任务将会" :label-width="formLabelWidth" prop="stopOnSchemaChanged"
                          v-if="CollectorID && CollectorID!='WOVEN-SERVER'">
                <el-input name="bm-ch-step5Form-stopOnSchemaChanged-input" type="text" v-model="stopOnSchemaChanged"
                          auto-complete="off" disabled :value="stopOnSchemaChanged?'停止':'继续'"></el-input>
            </el-form-item>

            <el-form-item label="周期" :label-width="formLabelWidth"
                          v-if="triggerType =='cron' && statusType != 'SOCKET'" disabled>
                <el-input name="bm-ch-step5Form-trigger-input" type="text" v-model="trigger"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="增量字段" :label-width="formLabelWidth" prop="cursorCol"
                          v-if="triggerType =='cron' && statusType != 'SOCKET'">
                <el-input name="bm-ch-step5Form-cursorCol-input" type="text" v-model="step5Form.cursorCol"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="分区键" :label-width="formLabelWidth" prop="partitionKey">
                <el-input name="bm-ch-step5Form-partitionKey-input" type="text" v-model="step5Form.partitionKey"
                          auto-complete="off" disabled placeholder="根据此字段进行分区"></el-input>
            </el-form-item>

            <el-form-item label="分区键格式" :label-width="formLabelWidth" prop="partitionPattern" v-if="isDate">
                <el-input name="bm-ch-step5Form-partitionPattern-input" type="text" v-model="step5Form.partitionPattern"
                          auto-complete="off" disabled placeholder="yyyy-mm-dd"></el-input>
            </el-form-item>

            <el-form-item label="执行参数" :label-width="formLabelWidth" prop="opts">
                <el-input name="bm-ch-step5Form-opts-input" type="text" v-model="step5Form.opts" auto-complete="off"
                          disabled></el-input>
            </el-form-item>

            <el-form-item label="缓冲区大小" :label-width="formLabelWidth" prop="bufferSize">
                <el-input name="bm-ch-step5Form-bufferSize-input" type="text" v-model="step5Form.bufferSize"
                          auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="延时刷出时间(毫秒)" :label-width="formLabelWidth" prop="flushPaddingTime">
                <el-input name="bm-ch-step5Form-flushPaddingTime-input" type="text" v-model="step5Form.flushPaddingTime"
                          auto-complete="off" disabled></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import task from '@jsTask/taskStep.js';
    import cronstrue from 'cronstrue';
    export default {
        name: 'step5',
        components: {cronstrue},
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
                rules: {},
                trigger: '',//存放cron表达式的翻译
            };
        },
        methods: {
            //初始化页面数据
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
            }
        },
        mounted() {
            if (localStorage.taskEntity) {
                var that = this;
                //获取全局的entity
                that.step5Form = JSON.parse(localStorage.taskEntity);
                this.trigger = this.step5Form.trigger? cronstrue.toString(this.step5Form.trigger, {locale: "zh_CN"}): '单次执行'
                //获取采集器的id
                var httpArr = window.location.href.split('/')
                that.step5Form.collecterId = httpArr[httpArr.indexOf('step5') + 1]
                that.step5Form.collecterId = httpArr[httpArr.indexOf('step5') + 2]

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
            //如果在向导中跳转
            if (to.path.substr(0, 16) == '/taskWizard/step') {
                var fromStep = from.path.charAt(from.path.indexOf('taskWizard/step') + 15)
                var toStep = to.path.charAt(to.path.indexOf('taskWizard/step') + 15)
                if (fromStep > toStep) {
                    next();
                } else
                //如果验证都通过才可以下一步
                    that.$refs.step5Form.validate((valid) => {
                        if (valid) {
                            next();
                        } else {
                            //获取从第几步到第几步
                            var fromStep = from.path.charAt(from.path.indexOf('taskWizard/step') + 15)
                            task.$emit('taskNextStep', fromStep)
                            return false;
                        }
                    })
            } else {
                localStorage.removeItem('taskEntity');
                next();
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
