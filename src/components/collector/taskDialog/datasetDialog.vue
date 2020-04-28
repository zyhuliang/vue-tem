<template>
    <section >
        <div class="previewDatasetDialog" id="bm-ch-dataset-preview">
            <!--数据集预览 dialog-->
            <el-dialog
                    :visible.sync="previewVisible"
                    width="80%"
                    id="bm-com-collTask-dataset-dialog"
                    :close-on-click-modal="false"
                    :before-close="handleClose"
                    title = "数据集预览"
                    tooltip-effect="dark"
                    custom-class="dialogClass"
                    append-to-body
                    
                    @closed="closedDialog"
            >
                <div class="dialog-preview-body" v-loading="loading" id="bm-com-collector-table-dialog-dataset-table">
                    <div id="comCollTaskDatasetDialogDiv">
                        <el-table :data="rowCollection" class="datasetPreview table-width" height="calc(80vh - 130px)">
                            <el-table-column  v-for="col in cols" :key="col.id" :show-overflow-tooltip="false" :prop="col.name" :label="col.name" :name="col.name">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <div slot="footer" class="dialog-footer">
                    <span class="timer">{{ `已经等待：${formatSeconds(count)}, 可以手动关闭`}}</span>
                    <el-button name="bm-com-collTask-dataset-detial-button" v-if="!haveData && !more" @click="more = !more">详情</el-button>
                    <el-button name="bm-com-collTask-dataset-simple-button" v-if="!haveData && more" @click="more = !more">简述</el-button>
                    <el-button name="bm-com-collTask-dataset-stop-refresh-button" @click="terminationQuery" :disabled="!isquery">终止查询</el-button>
                    <el-button name="bm-com-collTask-dataset-refresh-button" @click="dataPreview(id, tenantId, schemaId)" :disabled="isquery">刷新</el-button>
                    <el-button name="bm-com-collTask-dataset-cancle-button" @click="cancle">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </section>
</template>

<script>
    // 把秒转成 时分秒
    import {formatSeconds} from "@function/comFunction";
    import {getSchema ,previewinit, previewresult, analyzeCancel} from '@api'
    export default {
        name: 'previewDataSet',
        data() {
            return {
                formatSeconds: formatSeconds,
                previewVisible:false,
                rowCollection:[],
                loading: false,
                cols:[],
                id:"",
                schemaId: '',
                tenantId:"",
                haveData: true,
                errorMessage:"",
                more: false,
                timer: null,
                count: 0,
                isquery: true,
            }
        },
        methods: {
            closedDialog(){
                document.getElementsByClassName("v-modal")[0].remove();
            },
            // 点击 弹框 叉号关闭回调
            handleClose () {
                this.previewVisible = false
                this.terminationQuery()

              
            },
            cancle () {
                this.previewVisible = false
                this.terminationQuery()
                 this.$emit('hiedeDialog',true)
            },
            // 终止查询
            terminationQuery () {
                if (!this.statementId) {
                    return false
                }
                analyzeCancel(this.statementId,this.clusterId)
                    .then(() => {
                        this.loading = false;
                        clearTimeout(this.timer)
                        clearInterval(this.timer2)
                        this.timer = null
                        this.timer2 = null
                        this.isquery = false
                    })
            },
//			数据预览
            dataPreview: function (id, tenantId, schemaId) {
                this.id = id
                this.tenantId = tenantId
                this.schemaId = schemaId
                this.previewVisible = true;
                this.refreshData(id, tenantId, schemaId)
            },
            refreshData: function (id, tenantId, schemaId) {
                setTimeout( () => {
                    $('#comCollTaskDatasetDialogDiv .el-table').css('width', '99%')
                    $('#comCollTaskDatasetDialogDiv .el-table__body-wrapper ').css('overflow', 'hidden')
                }, 10)
                this.count = 0
                this.rowCollection = [];
                this.cols = [];
                this.errorMessage = ''
                this.loading = true;
                let row = 50;
                this.timer2 = setInterval( () => {
                    this.count++
                }, 1000)
                // 预览需要查询两次接口
                previewinit(id, tenantId, row)
                    .then( (res) => {
                        this.isquery = true
                        this.statementId = res.statementId
                        this.clusterId = res.clusterId
                        // 轮询
                        this._previewresult(id, tenantId,this.statementId, this.clusterId)
                    })
                    .catch( (err) => {
                        this.isquery = false
                        this.loading = false;
                        this.$message.error(err.response.data.detailMsg);
                        clearInterval(this.timer2)
                    })
            },
            // 第2次调用接口
            _previewresult (id, tenantId,statementId,clusterId) {
                var that = this;
                this.timer = setTimeout(() => {
                    previewresult(id, tenantId,statementId,clusterId)
                        .then( (res) => {
                            if (res.statement === 'available' || res.statement === 'error' || res.statement === 'cancelled') {
                                clearTimeout(this.timer)
                                clearInterval(this.timer2)
                                getSchema(this.schemaId).then((schemaEntity) => {
                                    that.loading = false;
                                    this.$set(this, 'rowCollection', res.content)
                                    this.$set(this, 'cols', schemaEntity.fields)
                                    that.haveData = true
                                    this.isquery = false
                                    //获取table上级div的大小，设置他bled的大小，然后加上滚动条
                                    setTimeout(()=>{
                                        let dialogWidth = $('#comCollTaskDatasetDialogDiv').width()
                                        let headerWidth = $('#comCollTaskDatasetDialogDiv .el-table__header-wrapper .el-table__header').width()
                                        let elementWidth = headerWidth< dialogWidth ? dialogWidth: headerWidth

                                        $('#comCollTaskDatasetDialogDiv .el-table').width(elementWidth + 10).css('maxWidth', elementWidth + 10)
                                        $('#comCollTaskDatasetDialogDiv .el-table__body-wrapper').width(elementWidth + 10).css('overflow', 'hidden')
                                    }, 0)
                                }, error => {
                                    that.loading = false;
                                    that.haveData = false
                                    this.isquery = false
                                    this.$message.error(err.response.data.detailMsg);
                                })
                            } else {
                                this._previewresult(this.id, this.tenantId,this.statementId,this.clusterId)
                            }
                        }, err => {
                            clearTimeout(this.timer)
                            clearInterval(this.timer2)
                            that.loading = false;
                            this.isquery = false
                            this.$message.error(err.response.data.detailMsg);
                        })
                }, 1000)
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss">
    .dialog-preview-body{
        .el-table__body-wrapper {
            overflow: auto !important;
        }
    }
</style>

<style lang="scss" scoped>
    .timer{
        color: #409EFF;
        margin-right: 30px;
    }
    .dialog-preview-body{
        width: 100%;
    }
    #comCollTaskDatasetDialogDiv{
        width: 100%;
        overflow-x: auto;
    }
</style>
