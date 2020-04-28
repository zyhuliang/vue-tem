<!-- steps参数 workFlow Gateway event -->
<template>
        <div>
                <el-form id="bm-nodeset-event-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item label="周期">
                                <el-tooltip  class="item" effect="dark" content="cron 表达式" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <span>执行周期：   {{nodeData.cron}}</span>
                                <i v-show="cronCl" @click="cronUpdate" title="更新周期" class="cronI el-icon-edit-outline"></i>
                                <i v-show="cronDis" @click="cronClosed" title="关闭周期选项" class="cronI el-icon-remove-outline"></i>
                                <div>
                                        <div id='cron' v-show="cronDis"></div>
                                        <div id="example1-result" hidden="true"></div>
                                </div>
                        </el-form-item>
                        <el-form-item :label="'filterClass'| cn">
                                <el-tooltip  class="item" effect="dark" content="添加自定函数中定义的workflow filterClass" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input placeholder="" :value="nodeData.filterClass" :disabled="true" name="filterClass">
                                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="filterClassSelect"></el-button>
                                </el-input>
                        </el-form-item>
                        <el-form-item label="参数">
                                <el-tooltip  class="item" effect="dark" content="参数" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input class="nodeTextArea" type="textarea" :value="nodeData.settings" placeholder="(必填)" @input="parameterVal" name="settings"></el-input>
                        </el-form-item>
                </el-form>

                <!-- filterClass 查询 -->
                <div v-if="dialogFilterClassVisible == true" class="nodeDialog">
                        <div class="diHeader">
                                <h3>filterClass 查询</h3>
                                <span @click="dialogFilterClassVisible = false" class="el-icon-close"></span>
                        </div>
                        <div class="diContent">
                                <el-form id="bm-filterclss-event-form" class="elForm" ref="form" label-width="80px" :label-position="labelPosition">
                                        <interceptor-inq  @thisSelectInterceptorVal="getSelectInterceptorVal"></interceptor-inq>
                                </el-form>
                        </div>
                        <div slot="footer" class="diFooter">
                                <el-button type="primary" @click="submitInterceptor" name="sureBtn">确定</el-button>
                                <el-button @click="dialogFilterClassVisible = false" name="cancelBtn">取消</el-button>
                        </div>
                </div>

        </div>
</template>

<script>

    import jqCronBuilderJs from '@static/jsLibrary/cronLibrary/cron-jqCronBuilder/jquery-cron-quartz'
    import jqCronBuilderCss from '@static/jsLibrary/cronLibrary/cron-jqCronBuilder/jquery-cron-quartz.css'
    import cronstrue from 'cronstrue';

    import interceptorInq from "@interceptorInq/interceptorInquire.vue"

    export default {
        components: {
            interceptorInq
        },
        data() {
            return {
                nodeData:{},   //存放节点参数
                cronCl:true,
                cronDis:false,
                dialogFilterClassVisible:false,
                labelPosition: 'left',
                bOk: 'true'
            }
        },
        props:["nodeSetData"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
                this.cronCl = true;
                this.cronDis = false;
            },
        },
        filters:{

        },
        methods: {
            /**
             * cron 绑定获取值
             * ------------------------------------------------------------------
             */
            init:function () {
                var that = this
                $(function() {
                    // Initialize DOM with cron builder with options
                    $('#cron').cronBuilder({
                        selectorLabel: "选择时间段:  ",
                        language: "zh_CN",
                        onChange: function(expression) {
                            if(that.bOk ==='true'){
                                that.bOk = 'false'
                                return false
                            }
                            $('#example1-result').text(expression);
                            var cron = expression.slice(0,expression.length-1);
                            that.nodeData.cron = cron
                        }
                    });
                });
            },
            cronUpdate : function () {
                if(this.nodeData.cron == ""){
                    this.nodeData.cron = " 0 * * * * ?"
                }
                this.cronCl = false;
                this.cronDis = true;
            },
            cronClosed : function () {
                this.cronCl = true;
                this.cronDis = false;
            },
            /**
             * filterClass （弹出层）绑定获取值
             * ------------------------------------------------------------------
             */
            filterClassSelect: function () {
                this.dialogFilterClassVisible = true;
            },
            //获取子组件的interceptor
            getSelectInterceptorVal(data){
                this.getSelValInterceptorId = data.id;
                this.getSelValInterceptorName = data.name;
                this.getSelValInterceptorfilterClassName = data.filterClassName;
            },
            submitInterceptor : function () {
                if(this.getSelValInterceptorName == ''){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                }else {
                    this.dialogFilterClassVisible = false;
                    this.nodeData.filterClass = this.getSelValInterceptorName;
                    this.nodeData.filterClassName = this.getSelValInterceptorfilterClassName
                }
            },
            /**
             * parameter 绑定获取值
             * ------------------------------------------------------------------
             */
            parameterVal : function (val) {
                this.nodeData.settings = val;
                delete this.nodeData.parameter
            }
        },
        mounted() {
            var _this = this
            this.nodeData = this.nodeSetData;
            this.init();
            
        }
    }

</script>

<style scoped>
        .cronI{
                margin-left: 10px;
                cursor: pointer;
                color: #3e98fe;
        }
</style>