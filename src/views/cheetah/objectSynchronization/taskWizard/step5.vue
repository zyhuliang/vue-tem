<template>
    <div id='bm-ch-col-step5-tmp' class="step5">
        <!-- element表单组件 -->
        <el-form id="bm-ch-step5-form":model="step5Form" class="demo-step5" ref="step5Form" label-position="top">
            <el-form-item label="任务名称" :label-width="formLabelWidth"  prop="name">
                <el-input name="bm-ch-step5Form-name-input" type="text" v-model="step5Form.name" auto-complete="off" disabled ></el-input>
            </el-form-item>

            <el-form-item label="数据源选择" :label-width="formLabelWidth"  prop="dataSource.name">
                <el-input name="bm-ch-step5Form-dataSource-name-input" type="text" v-model="step5Form.dataSource.name" auto-complete="off" disabled ></el-input>
            </el-form-item>

            <el-form-item label="表选择" :label-width="formLabelWidth"  prop="dataSource.table">
                <el-input name="bm-ch-step5Form-dataSource-table-input" type="text" v-model="step5Form.dataSource.table" auto-complete="off" disabled ></el-input>
            </el-form-item>

            <el-form-item label="数据过滤" :label-width="formLabelWidth"  prop="dataSource.condition">
                <el-input name="bm-ch-step5Form-dataSource-selectSQL-input" type="text" v-model="step5Form.dataSource.condition" auto-complete="off" disabled ></el-input>
            </el-form-item>
            <!--  <el-form-item label="数据过滤" :label-width="formLabelWidth"  prop="dataSource.selectSQL">
                  <el-input name="bm-ch-step5Form-dataSource-selectSQL-input" type="text" v-model="step5Form.dataSource.selectSQL" auto-complete="off" disabled ></el-input>
              </el-form-item>

              <el-form-item label="扩展表" :label-width="formLabelWidth"  prop="dataSource.tableExt">
                  <el-input name="bm-ch-step5Form-dataSource-tableExt-input" type="text" v-model="step5Form.dataSource.tableExt" auto-complete="off" disabled ></el-input>
              </el-form-item>

              <el-form-item label="并行度" :label-width="formLabelWidth"  prop="parallelism">
                  <el-input name="bm-ch-step5Form-parallelism-input" type="text" v-model="step5Form.parallelism" auto-complete="off" disabled ></el-input>
              </el-form-item>

              <el-form-item label="错误记录上限数" :label-width="formLabelWidth"  prop="errorNumber">
                  <el-input name="bm-ch-step5Form-errorNumber-input" type="text" v-model="step5Form.errorNumber" auto-complete="off" disabled ></el-input>
              </el-form-item>
  -->
            <el-form-item label="采集字段" :label-width="formLabelWidth"  prop="masterKeys">
                <el-input name="bm-ch-step5Form-masterKeys-input" type="text" v-model="step5Form.masterKeys" auto-complete="off" disabled ></el-input>
            </el-form-item>

            <el-form-item label="拼接字段" :label-width="formLabelWidth"  prop="needCollectKeys">
                <el-input name="bm-ch-step5Form-needCollectKeys-input" type="text" v-model="step5Form.needCollectKeys" auto-complete="off" disabled ></el-input>
            </el-form-item>

            <el-form-item label="周期" :label-width="formLabelWidth"  prop="trigger" v-if="triggerType =='cron' " disabled>
                <el-input name="bm-ch-step5Form-trigger-input" type="text" v-model="step5Form.trigger" auto-complete="off" disabled ></el-input>
            </el-form-item>

            <el-form-item label="增量字段" :label-width="formLabelWidth"  prop="cursorCol" v-if="triggerType =='cron' ">
                <el-input name="bm-ch-step5Form-cursorCol-input" type="text" v-model="step5Form.cursorCol" auto-complete="off" disabled ></el-input>
            </el-form-item>

            <!--<el-form-item label="执行参数" :label-width="formLabelWidth"  prop="opts" >
                <el-input name="bm-ch-step5Form-opts-input" type="text" v-model="step5Form.opts" auto-complete="off" disabled ></el-input>
            </el-form-item>

            <el-form-item label="缓冲区大小" :label-width="formLabelWidth"  prop="bufferSize">
                <el-input name="bm-ch-step5Form-bufferSize-input" type="text" v-model="step5Form.bufferSize" auto-complete="off" disabled></el-input>
            </el-form-item>

            <el-form-item label="延时刷出时间(毫秒)" :label-width="formLabelWidth"  prop="flushPaddingTime">
                <el-input name="bm-ch-step5Form-flushPaddingTime-input" type="text" v-model="step5Form.flushPaddingTime" auto-complete="off" disabled></el-input>
            </el-form-item>-->
        </el-form>
    </div>
</template>
<script>
    import task  from '@jsTask/taskStep.js';

    export default {
        name:'step1',
        data: function () {
            return {
                formLabelWidth: "200px",
                triggerType:'',
                //是不是date类型的分区键
                isDate: false,
                step5Form: {
                    dataSource:{},
                }
            };
        },
        methods:{
            init: function () {
                //判断是不是周期执行
                this.triggerType =this.step5Form.trigger?'cron':''
                //判断选中的分区键是日期类型
                if(this.step5Form.partitionPattern)
                    this.isDate = true;
            }
        },
        mounted(){
            if(localStorage.taskEntity){
                //获取全局的entity
                this.step5Form = JSON.parse(localStorage.taskEntity);
                this.init();
            }
        },
        beforeRouteLeave: function (to, from, next) {
            if(localStorage.taskEntity){
                //获取全局的entity
                var entity = JSON.parse(localStorage.taskEntity);
                //将局部的entity合并到全局的entity中
                this.step5Form = this.copyObject(entity, this.step5Form)
                //保存全局的entity到storage
                localStorage.taskEntity = JSON.stringify(this.step5Form);
            }
            //如果在向导中跳转
            if(to.path.substr(0,22) == '/objectTaskWizard/step'){
                var fromStep = from.path.charAt(from.path.indexOf('objectTaskWizard/step')+21)
                var toStep = to.path.charAt(to.path.indexOf('objectTaskWizard/step')+21)
                if(fromStep>toStep){
                    next();
                } else
                //如果验证都通过才可以下一步
                    this.$refs.step5Form.validate((valid)=>{
                        if(valid){
                            next();
                        } else {
                            //获取从第几步到第几步
                            var fromStep = from.path.charAt(from.path.indexOf('objectTaskWizard/step')+21)
                            task.$emit('objectTaskNextStep', fromStep)
                            return false;
                        }
                    })
            }else {
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
