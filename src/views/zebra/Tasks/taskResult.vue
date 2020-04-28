<template>
    <section class="outBox" id="bm-qa-tasks-taskResult">
        <div class="title">
            <span class="qaResult">分析结果</span>
            <el-button @click="backPage">返回</el-button>
        </div>
        <el-table :data="rowCollection"
                  style="width: 100%"
                  height="calc(100vh - 200px)"
                  v-loading="loading"
                  id="bm-qa-tasks-taskResult-table"
        >
            <el-table-column prop="modelName" label="模板名称"></el-table-column>
            <el-table-column prop="name" label="模板规则名称" min-width="110">
                <template slot-scope="scope">
                    <a class="see" @click="toRulebind(scope.row)">{{scope.row.name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="processDataType" label="处理数据类型" min-width="110"></el-table-column>
            <el-table-column prop="processDataId" label="数据字段"></el-table-column>
            <el-table-column prop="ruleId" label="基准规则">
                <template slot-scope="scope">
                    <a class="see" @click="handleEdit(scope.row.id, scope.$index, scope.row)">
                        {{scope.row.ruleId}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="outputLimit" label="结果阈值"></el-table-column>
            <el-table-column prop="qualityType" label="质量计算类型" min-width="110"></el-table-column>
            <el-table-column prop="qualityRank" label="质量等级"></el-table-column>
            <el-table-column prop="badRatio" label="坏数据百分比(%)" min-width="110"></el-table-column>
            <el-table-column prop="priority" label="权重"></el-table-column>
            <el-table-column prop="analysisRowCount" label="分析数据条数" min-width="110"></el-table-column>
            <el-table-column prop="rowCount" label="坏数据条数" min-width="110"></el-table-column>
            <el-table-column prop="outputId" label="结果路径"></el-table-column>
            <el-table-column prop="outputData" label="操作">
                <template slot-scope="scope">
                    <div v-if="scope.row.outputId!=='' && scope.row.outputId!=='null'">
                        <a class="see" @click="seeResult(scope.row)">查看</a>
                        <a class="see" @click="downloadResult(scope.row)">下载</a>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <router-view></router-view>

        <!--数据预览 dialog-->
        <preview-data-set ref="dataset"></preview-data-set>
    </section>
</template>

<script>
    import previewDataSet from '@components/collector/taskDialog/datasetDialog.vue'
    import {previewinit, previewresult, getPathParams} from '@api'

    export default {
        components: {
            previewDataSet
        },
        data() {
            return {
                timer: null,
                timer2: null,
                id: this.$route.query.id,
                rowCollection: [],
                loading: false,
                tenantId: this.$route.query.tenantId,
                showCol: true,
                outputId: '',
                outputLimit: ''
            }
        },
        methods: {
            // 第2次调用接口
            _previewresult(id, tenantId, statementId, clusterId, type) {
                var that = this;
                this.timer = setTimeout(() => {
                    previewresult(id, tenantId, statementId, clusterId)
                        .then((res) => {
                            if (res.statement === 'available' || res.statement === 'error' || res.statement === 'cancelled') {
                                clearTimeout(this.timer)
                                clearInterval(this.timer2)
                                that.loading = false;
                                if (type === 'download') {
                                    this.exportCSV(res.content)
                                } else {
                                    that.rowCollection = res.content;
                                }
                            } else {
                                this._previewresult(id, tenantId, statementId, clusterId, type)
                            }
                        }, err => {
                            clearTimeout(this.timer)
                            clearInterval(this.timer2)
                            that.loading = false;
                            this.$message.error(err.response.data.detailMsg);
                        })
                }, 1000)
            },
            getFormData(id, tenantId, row, type) {
                //获取表格数据
                this.loading = true;
                // 预览需要查询两次接口
                row = type != 'download' ? 50 : 200
                previewinit(id, tenantId, row).then((res) => {
                    // 轮询
                    this._previewresult(id, tenantId, res.statementId, res.clusterId, type)
                }, ((err) => {
                    this.loading = false;
                    this.$message.error(err.response.data.detailMsg);
                    clearInterval(this.timer2)
                }))
            },
            backPage() {
                history.back(-1)
            },
            toRulebind(row) {
                //注意此处有公用的子路由，必须是当前路由的子路由才可以正常回退到上一页
                this.$router.push({name: "规则绑定2", params: {row: row, ruleId: row.detailId}, query: {id: row.modelId}});
            },
            //查看分析规则
            handleEdit(id, index, row) {
                this.$router.push({name: "查看规则模板2", params: {addForm: row}});
            },
            seeResult(row) {
                let outputId = row.outputId.substring(row.outputId.lastIndexOf('/') + 1)
                getPathParams(outputId).then(res => {
                    this.$refs.dataset.dataPreview(res.datasetId, res.tenantId, res.schemaId)
                })
            },
            downloadResult(row) {
                let outputId = row.outputId.substring(row.outputId.lastIndexOf('/') + 1)
                getPathParams(outputId).then(res => {
                    this.getFormData(res.datasetId, res.tenantId, 2147483647, 'download');
                })
            },
        },
        mounted() {
            this.getFormData(this.id, this.tenantId, 50, 'preview');
        }
    }
</script>

<style lang="scss" scoped>
    .outBox {
        background: #fff;
        position: absolute;
        z-index: 100;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .title {
        margin-bottom: 20px;
        padding-left: 20px;
        margin-top: 20px;
    }

    .see {
        cursor: pointer;
    }

    .qaResult {
        font-weight: bold;
        margin-right: 8px;
    }
</style>
