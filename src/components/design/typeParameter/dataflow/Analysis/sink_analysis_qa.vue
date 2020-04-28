<!-- steps参数 dataFlow Gateway sink_analysis_qa -->
<template>
        <div>
                <el-form id="bm-nodeset-sinkanalysisqa-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="'storage' | cn">
                                <el-tooltip  class="item" effect="dark" :content="'storage' | cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input name="storage" :value="nodeData.storage" :placeholder="storage | cn + '（必填）'" @input="storageVal"></el-input>
                        </el-form-item>
                        <el-form-item label="format">
                                <el-tooltip  class="item" effect="dark" content="format" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input name="format" :value="nodeData.format" placeholder="format（必填）" @input="formatVal"></el-input>
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
            }
        },
        props:["nodeSetData"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
        },
        filters:{

        },
        methods: {
            /**
             * storage 绑定获取值
             * ------------------------------------------------------------------
             */
            storageVal : function (val) {
                this.nodeData.storage = val;
            },
            /**
             * format 绑定获取值
             * ------------------------------------------------------------------
             */
            formatVal : function (val) {
                this.nodeData.format = val;
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;
        }
    }

</script>

<style scoped>

</style>