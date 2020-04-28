<!-- steps参数 workFlow Gateway exclusive -->
<template>
        <div>
                <el-form id="bm-nodeset-exclusive-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item label="conditions">
                                <el-tooltip class="item" effect="dark" :content="'conditions'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <div>
                                        <ul class="tableTitle">
                                                <li>输出</li>
                                                <li class="updateWidth">条件</li>
                                        </ul>
                                        <ul class="tableTitle" v-for="(ct,key1,index) in nodeData.conditions" :key="key1">
                                                <li>
                                                        <el-select class="selectClass" :value="ct.output" placeholder="请选择" @change="(value) => ctOutput(value, key1)">
                                                                <el-option v-for="(la,inputLa,index) in lineData.outputLine" :key="inputLa" :value="la.lineNameTarget"></el-option>
                                                        </el-select>
                                                </li>
                                                <li class="updateWidth">
                                                        <el-input :value="ct.condition" placeholder="条件表达式" @input="(value) => ctCondition(value, key1)" name="condition"></el-input>
                                                </li>
                                                <div class="removeCondition" v-if="nodeData.conditions.length > '1'">
                                                        <i @click="removeCondition(key1)" class="i remove el-icon-remove-outline"></i>
                                                </div>
                                        </ul>
                                        <div class="adCondition">
                                                <i @click="addCondition" class="i el-icon-circle-plus-outline"></i>
                                        </div>
                                        <div class="cdPrompt">提示：排他控制节点，第一个满足条件的输出节点将执行！</div>
                                </div>
                                <!--<el-input v-else class="noParameter" value="未绑定动态值的参数！"></el-input>-->
                        </el-form-item>
                </el-form>

        </div>
</template>

<script>

    export default {
        components: {

        },
        data() {
            return {
                nodeData:{},
                lineData:{},
            }
        },
        props:["nodeSetData","nodeSetLine"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
            nodeSetLine(newValue, oldValue) {
                this.lineData = newValue;
            },
        },
        filters:{

        },
        methods: {
            /**
             * conditions table 新增数据
             * ------------------------------------------------------------------
             */
            addCondition : function () {
                this.nodeData.conditions.push({ "output": "", "condition": ""})
            },
            /**
             * 移除 conditions
             * ------------------------------------------------------------------
             */
            removeCondition:function (index) {
                this.nodeData.conditions.splice(index,1);
            },
            /**
             * conditions output 左（字段）绑定值
             * ------------------------------------------------------------------
             */
            ctOutput:function (val,index) {
                this.nodeData.conditions[index].output=val;
            },
            /**
             * conditions condition 运算符 绑定值
             * ------------------------------------------------------------------
             */
            ctCondition:function (val,index) {
                this.nodeData.conditions[index].condition=val;
            },
        },
        mounted() {
            this.nodeData = this.nodeSetData;
            this.lineData = this.nodeSetLine;
            console.log(this.nodeData);
        }
    }

</script>

<style scoped>
        .selectClass{
                width: 100%;
        }
        .tableTitle{
                float: left;
                width: 100%;
                height: 30px;
                margin: 10px 0px 0px 0px;
                padding:0px;
        }
        .tableTitle li{
                float: left;
                width: 30%;
                margin-right: 1%;
                text-align: center;
        }
        .tableTitle li.updateWidth{
                width: 60%;
        }
        .adCondition{
                float: left;
        }
        .adCondition i{
                color: #3e98fe;
        }
        .removeCondition i{
                color: #ff4949;
        }
        .cdPrompt{
                float: left;
                width: 100%;
                color: #ff4949;
        }
</style>