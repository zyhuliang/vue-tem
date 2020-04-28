<template>
    <div class="div-refresh">
        <div class="button-refresh">
            <el-button @click="previewDataset()" :disabled="isquery">刷新</el-button>
            <el-button @click="terminationQuery()" :disabled="!isquery">终止查询</el-button>
            <span class="timer">{{ `已经等待：${formatSeconds(count)}, 可以手动关闭`}}</span>
        </div>
        <el-table :data="rowCollection" class="datasetPreview" height="calc(100vh - 240px)" v-loading="loading"
                  id="bm-ch-res-dataset-priview-table">
            <el-table-column v-for="col in cols" :key="col.id" :show-overflow-tooltip="false" :prop="col.name"
                             :label="col.name">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    // 把秒转成 时分秒
    import {formatSeconds} from "@function/comFunction";
    import {getSchema, postPreviewDataset, postPreviewresult, analyzeCancel} from '@api'

    export default {
        props: {
            entity: {
                type: Object,
                default: () => {
                }
            }
        },
        data() {
            return {
                loading: false,
                isquery: false,
                formatSeconds: formatSeconds,
                count: 0,
                statementId: '',
                clusterId:'',
                timer: null,
                timer2: null,
                rowCollection: [],
                cols: []
            }
        },
        methods: {
            // 终止查询
            terminationQuery() {
                analyzeCancel(this.statementId,this.clusterId)
                    .then((res) => {
                        this.loading = false;
                        clearTimeout(this.timer)
                        clearInterval(this.timer2)
                        this.timer = null
                        this.timer2 = null
                        this.isquery = false
                    })
                    .catch((err) => {
                        this.$message.error(err.response.data.detailMsg);
                    })
            },
            //预览数据集的数据
            previewDataset: function () {
                this.count = 0
                this.loading = true;
                // 查询 statement 的 ID
                this.timer2 = setInterval(() => {
                    this.count++
                }, 1000)
                let previewData = JSON.parse(JSON.stringify(this.entity))
                previewData.storageConfigurations.clusterId = this.entity.clusterId
                delete previewData.clusterId;
                postPreviewDataset(this.entity.id ? this.entity.id : 'new', previewData)
                    .then((res) => {
                        this.statementId = res.statementId
                        this.clusterId = res.clusterId
                        this.isquery = true
                        this._postPreviewresult()
                    }, (err) => {
                        this.loading = false;
                        this.$message.error(err.response.data.detailMsg);
                        clearInterval(this.timer2)
                        this.isquery = true
                    })
            },
            // 第二次查询接口
            _postPreviewresult() {
                this.timer = setTimeout(() => {
                    let previewData = JSON.parse(JSON.stringify(this.entity))
                     previewData.storageConfigurations.clusterId = this.entity.clusterId
                    delete previewData.clusterId;
                    postPreviewresult(this.entity.id ? this.entity.id : 'new', this.statementId,this.clusterId, previewData)
                        .then((res) => {
                            if (res.statement === 'available' || res.statement === 'error' || res.statement === 'cancelled') {
                                this.isquery = false
                                clearInterval(this.timer2)
                                clearTimeout(this.timer1)
                                //如果有schemaid就发请求更新字段
                                if (this.entity.schema.id) {
                                    getSchema(this.entity.schema.id).then((schemaEntity) => {
                                        this.loading = false;
                                        this.rowCollection = res.content;
                                        this.cols = schemaEntity.fields
                                    }, error => {
                                        this.loading = false;
                                        this.isquery = false
                                        this.rowCollection = [];
                                        this.cols = [];
                                        var _this = this;
                                        if (error.response.status == 500) {
                                            _this.$message({
                                                message: error.response.data.err,
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }
                                    })
                                } else {
                                    //没有schema，新建数据库类型数据集，就发送字段
                                    this.cols = this.entity.schema.fields
                                    this.rowCollection = res.content;
                                    this.loading = false;
                                }

                            } else {
                                this._postPreviewresult()
                            }
                        }, (err) => {
                            this.loading = false;
                            this.rowCollection = [];
                            this.cols = [];
                            clearInterval(this.timer2)
                            clearTimeout(this.timer1)
                            this.isquery = false
                            this.$message.error(err.response.data.detailMsg);
                        })
                }, 1000)
            },
        }
    }
</script>
<style lang="scss" scoped>
    .div-refresh {
        .timer {
            color: #409EFF;
            margin-left: 30px;
        }
        width: calc(100vw - 900px);
        overflow-x: auto;
        .button-refresh {
            /*button{*/
            /*margin-left: 45%;*/
            /*}*/
            align-content: center;
            line-height: 40px;
        }
    }
</style>

