<template>
    <div id="previewDataset">
         <info-dialog
            title="数据集预览"
            width="80%"
            :dialogOperates="dialogOperates"
            :isShowDialog="isShowDialog"
            @closeDialog="closeDialog"
        >
            <table-btn
                :columns="columns"
                :list="list"
                :options="tableOption"
            />
            <span class="timer">{{ `已经等待：${formatSeconds(count)}, 可以手动关闭`}}</span>
        </info-dialog>
    </div>
</template>
<script>
import infoDialog from '@components/infoDialog/dialog'
import tableBtn from '@components/table/tableList-btn'
import {formatSeconds} from "@function/comFunction";
export default {
    components: {
        infoDialog,
        tableBtn
    },
    data () {
        return {
            row: null,
            termination: true,
            count: 0,
            formatSeconds: formatSeconds,    // 秒转 时分秒
            tableOption: { // 列表配置
                height: '550px',
                loading: false
            },
            isShowDialog: false, // 预览弹框
            columns: [ // 需要展示的列
            ],
            list: [],
            // 弹框按钮
            dialogOperates:[{
                label: '终止查询',
                type: 'primary',
                plain: true,
                disabled: () => {return this.termination},
                method: () => {
                    this.analyzeCancel()
                }
            },{
                label: '刷新',
                type: 'primary',
                plain: true,
                disabled: () => {return !this.termination},
                method: () => {
                    this.previewinit(this.row)
                }
            },{
                label: '取消',
                type: 'primary',
                plain: true,
                method: () => {
                    this.closeDialog(this.row)
                }
            }],
            statementId: null,
            clusterId:null,
            countTimer: null,
            queryTimer: null,
        }
    },
    methods: {
        closeDialog () {
            this.isShowDialog = false
        },
        // 请求表头
        async querySchema (schemaId) {
            this.serverApi({
                params: schemaId,
                interface: 'querySchema',
                success: (data) => {
                    for (let value of data.fields) {
                        this.columns.push({
                            prop: value.name,
                            label:  value.name,
                        })
                    }
                },
                error: () => {
                this.licenseActivate()
                }
            }) 
        },
        // 终止查询
        async analyzeCancel () {
            try{
                if (!this.statementId) {
                    return false
                }
                await this.$https.analyzeCancel(this.statementId,this.clusterId)
                this.queryError()
            } catch (err) {
                // this.$message.error(error.response.message);
                this.queryError()
            }
        },
        // 请求错误
        queryError () {
            this.count = 0
            clearTimeout(this.countTimer)
            clearInterval(this.queryTimer)
            this.countTimer = null
            this.queryTimer = null
            this.tableOption.loading = false
            this.termination = true
        },
        async previewinit (row) {
            this.row = row
            // 每次请求请求都要把定时器清空， 避免同时执行多个定时器， 是时间会走的很很快
            this.queryError()
            this.termination = false
            this.tableOption.loading = true
            this.countTimer = setInterval(() => {
                this.count++
            }, 1000)
            this.isShowDialog = true
            let [id , tenantId, schemaId] = [row.id, row.tenantId, row.schema.id]
            try{
                let data = await this.$https.previewinit(id, tenantId, 50)
                this.statementId = data.statementId
                this.clusterId = data.clusterId
                this.previewresult(id, tenantId,this.statementId,this.clusterId, schemaId)
            }
            catch (error) {
                // this.$message.error(error.response.message);
                this.queryError()
            }
        },
        previewresult (id, tenantId, statementId,clusterId, schemaId) {
            
            this.queryTimer = setTimeout( async () => {
                try{
                    let data = await this.$https.previewresult(id, tenantId, statementId,clusterId)
                    if (data.statement === 'available' || data.statement === 'error' || data.statement === 'cancelled') {
                        // 请求表头
                        this.querySchema(schemaId)
                        this.list = data.content
                        this.queryError()
                    } else {
                        // 等数据回来之后再轮询接口
                        this.previewresult(id, tenantId, statementId,clusterId, schemaId)
                    }
                }
                catch (error) {
                    // this.$message.error(error.response.message);
                    this.queryError()
                }
            }, 1000)
        },
    }
}
</script>
<style lang="scss" scoped>
#previewDataset{
    position: relative;
    .timer{
        position: absolute;
        bottom: 23px;
        right: 350px;
        color: #409EFF;
    }

}
</style>
