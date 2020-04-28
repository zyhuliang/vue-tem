<template>
    <div class="step2" id='bm-ch-filesys-step2-tmp' >
        <el-form id="bm-ch-file-step2-form" ref="step2Form" :model="step2Form" label-position="top" class="demo-step2 demo-step2Form" @submit.prevent="onSubmit">
            <el-form-item label="采集字段" :label-width="formLabelWidth"  prop="masterKeys"  required class="input-with-select-group">
                <el-select name='bm-ch-sys-syschronization-object-step2-masterKeys' style="width: calc(100% - 65px);" v-model="step2Form.masterKeys" multiple placeholder="选择字段">
                    <el-option
                            v-for="item in filterMasterKeys "
                            :key="item"
                            :name="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-button @click="step2Form.masterKeys =  filterMasterKeys">全选</el-button>
            </el-form-item>

            <el-form-item label="拼接字段" :label-width="formLabelWidth"  prop="needCollectKeys" required>
                <el-select name='bm-ch-sys-syschronization-object-step2-needCollectKeys' class="input-with-select" v-model="step2Form.needCollectKeys" multiple placeholder="选择字段">
                    <el-option
                            v-for="item in filterNeedCollectKeys"
                            :key="item"
                            :name="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
              <el-form-item label="namespace" :label-width="formLabelWidth"  prop="namespace" required>
                <el-input v-model="step2Form.namespace"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import task  from '@jsTask/taskStep.js';

    export default {
        name: 'step2',
        data: function () {
            return {
                filterMasterKeys:[],
                filterNeedCollectKeys:[],
                formLabelWidth:'200px',
                step2Form: {
                    masterKeys:[],
                    // needCollectKeys:[],
                    namespace:""
                },
            }
        },
        created(){
            if(localStorage.taskEntity){
                //获取全局的entity
                this.step2Form = JSON.parse(localStorage.taskEntity);
                // 根据sft转换出masterKeys，needCollectKeys
                this.filterMasterKeys = []
                this.filterNeedCollectKeys = []
                if(this.step2Form.fields && this.step2Form.fields.sft){
                    var that = this;
                    that.step2Form.fields.sft.forEach(function (item){
                        if(item.sourceType.toUpperCase().indexOf('BLOB')>-1  || item.sourceType.toUpperCase().indexOf('CLOB')>-1  || item.sourceType.toUpperCase().indexOf('NCLOB')>-1 ){
                            that.filterMasterKeys.push(item.sourceField)
                        }else if(
                            item.sourceType.toUpperCase().indexOf('VARCHAR2')>-1 ||
                            item.sourceType.toUpperCase().indexOf('VARCHAR')>-1  ||
                            item.sourceType.toUpperCase().indexOf('DATE')>-1 ||
                            item.sourceType.toUpperCase().indexOf('NUMBER')>-1 ||
                            item.sourceType.toUpperCase().indexOf('INT')>-1 ||
                            item.sourceType.toUpperCase().indexOf('INTEGER')>-1 ||
                            item.sourceType.toUpperCase().indexOf('DECIMAL')>-1){
                            that.filterNeedCollectKeys.push(item.sourceField)
                        }
                    })
                }
            }
        },
        beforeRouteLeave: function (to, from, next) {
            var that = this;
            if(localStorage.taskEntity){
                //获取全局的entity
                var entity = JSON.parse(localStorage.taskEntity);
                //将局部的entity合并到全局的entity中
                 console.log("that.step2Form ",that.step2Form );
                that.step2Form = that.copyObject(entity, that.step2Form);
                //保存全局的entity到storage
                localStorage.taskEntity = JSON.stringify(that.step2Form);
            }
            //如果在向导中跳转
            if(to.path.substr(0,22) == '/objectTaskWizard/step'){
                var fromStep = from.path.charAt(from.path.indexOf('objectTaskWizard/step')+21)
                var toStep = to.path.charAt(to.path.indexOf('objectTaskWizard/step')+21)
                if(fromStep>toStep){
                    next();
                } else
                //如果验证都通过才可以下一步
                    that.$refs.step2Form.validate((valid)=>{
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
        }
    }
</script>
<style scoped lang="scss">
    .step2{
        height: calc(100vh - 187px);
        overflow-y: auto;
        .input-with-select{
            width: 100%;
        }
        .demo-step2{
            margin-left: 25%;
            width: 50%;
        }
    }
</style>
