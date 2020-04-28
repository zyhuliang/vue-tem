<template>
    <el-collapse accordion>
		<el-collapse-item>
            <template slot="title">
                    <h3 class="advanced-options">高级选项</h3>
            </template>
            <el-form :label-width="formLabelWidth" id="bm-qa-analysisTemplate-form" class="demo-ruleForm" v-for="(value, key) in this.programForm" :key="key">
                <h4 class="adop-title">{{key}}</h4>
                <el-form-item :label="item.name | intercept" v-for="item in programForm[key]" :key="item.name" >
                    <el-input v-model="item.value" auto-complete="off" name="bm-qa-analysisTemplate-debug" v-if="typeof item.input === 'string'" ></el-input>
                    
                    <el-select v-model="item.value" placeholder="`请选择" v-else>
                        <el-option
                            v-for="value in item.input"
                            :key="value"
                            :label="value"
                            :value="value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
import { runtimeProperties } from '@api';
export default {
    props: {
        flowId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            programForm: {},
            formLabelWidth: '200px',
            result: [],
        }
    },
    filters: {
        intercept (val) {
            let index =  val.indexOf('.') + 1
            return val.substr(index, val.length -1)
        },
    },
    methods: {
        getRuntimeProperties () {
            return this.result
        },
        runtimeProperties () {
            runtimeProperties(this.flowId).then(data => {
                this.result = data
                this.getProgramForm()
            }, err => {
                    if(err.response.status == 500) {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                }
            )
        },
        getProgramForm () {
            for (let item of this.result) {
                let index =  item.name.indexOf('.')
                let key = item.name.substr(0, index)
                // 判断 value 是不是 数组 如果是数组取第一个值
                if (typeof item.value !== 'string') {
                    item.value = item.value[0]
                }
                if (!this.programForm[key]) {
                    this.$set(this.programForm, key, [])
                    this.programForm[key].push(item)
                } else {
                    this.programForm[key].push(item)
                }
            }
        }
    },
    created () {
        this.runtimeProperties()
    }
}
</script>
<style lang="scss" scoped>
.el-select{
    width: 100%;
}
</style>