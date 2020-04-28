<template>
    <div id="template">
        <!-- 表单 -->
        <info-from
            slot="left"
            :config="config"
            :modelData="parameter"
        />
        <!-- flow 列表弹窗 -->
        <info-flow 
            @handleCurrentChange="handleFlowChange"
            ref="infoFlow"
        />
        <!-- dataset 数据 弹窗 -->
        <info-dataset 
            @handleCurrentChange="handleDatasetChange"
            ref="infoDataset"
        />
    </div>
</template>
<script>
import infoFrom from '@components/infoFrom/infoFrom'
import infoFlow from '@components/infoFlow/infoFlow';
import infoDataset from '@components/infoResources/infoDataset';
export default {
    components: {
        infoFrom,
        infoFlow,
        infoDataset
    },
    data () {
        return {
            isEdit: false, // 是否可以编辑
            id: this.$route.params.id,
            parameter: {
                id: '',
                description: "",
                expiredPeriod: 0,
                name: "",
                preProcessFlowId: "",
                preProcessFlowName: "",
                processDataId: "",
                processDataType: "Dataset"
            },
            templateId: '',
            dialogFlowVisible: false,
            dialogDataVisible: false,
        }
    },
    async created () {
        // 配置 from
        this.config = {
            ref: 'ruleForm',
            size: 'small',
            lableWidth: '100px',
            labelPosition: 'top',
            validate: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                processDataId : [
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ]
            },
            rule: [{
                label: '',
                type: 'infoButton',
                model: 'locking',
                operation: [{
                    label: '锁定',
                    type: 'primary',
                    show: () => { return !this.isEdit},
                    icon: 'el-icon-ump-dakaiquanxian',
                    method: () => {
                        this.isEdit = !this.isEdit
                    }
                },{
                    label: '解锁',
                    type: 'primary',
                    show: () => { return this.isEdit},
                    icon: 'el-icon-ump-mima',
                    method: () => {
                        this.isEdit = !this.isEdit
                    }
                }]
            },{
                label: '名称',
                type: 'infoInput',
                model: 'name',
                disabled: () => {return this.isEdit},
                methods: (val) => {
                    this.parameter.name = val
                }
            },{
                label: '预处理Flow',
                type: 'infoInput',
                model: 'preProcessFlowName',
                disabled: () => {return this.isEdit},
                methods: (val) => {
                    this.parameter.preProcessFlowName = val
                },
                button: {
                    slot: 'append',
                    icon: 'el-icon-search',
                    disabled: () => {return this.isEdit},
                    methods: () => {
                        // 显示 flow 列表
                        // 调用的子组件 infoFlow 的方法
                        this.$refs.infoFlow.showDialog()
                    }
                }
            },{
                label: '请输入数据集',
                type: 'infoInput',
                model: 'processDataId',
                methods: (val) => {
                    this.parameter.processDataId = val
                },
                disabled: () => {return this.isEdit},
                button: {
                    slot: 'append',
                    icon: 'el-icon-search',
                    disabled: () => {return this.isEdit},
                    methods: () => {
                        // 显示 dataset
                        this.$refs.infoDataset.showDialog()
                    }
                }
            },{
                label: '描述',
                type: 'infoInput',
                model: 'description',
                disabled: () => {return this.isEdit},
                methods: (val) => {
                    this.parameter.description = val
                }
            }],
            // 因为 不管是编辑规则 和 确定 都需要保存模板
            operation: [{
                label: '编辑规则',
                type: 'default',
                 method: (vue, ref) => {
                    if (this.globalRuleForm(vue, ref)) {
                        this.saveTemplate('edit')
                    }
                }
            },{
                label: '确定',
                type: 'primary',
                method: (vue, ref) => {
                    if (this.globalRuleForm(vue, ref)) {
                        // 保存模板
                        this.saveTemplate('save')
                    }
                }
            },{
                label: '返回',
                type: 'default',
                method: (vue, ref) => {
                    this.$router.push({ name: 'analysisTemplate'});
                }
            }]
        }
        // 请求详情数据
        if (this.id === 'new') {
            return false
        }
        this.isEdit = true
        let tempDetail = await this.$https.tempDetail(this.id)
        try{
            this.parameter = tempDetail
        } catch (error) {
            this.$message.error(error.response.message);
        }
    },
    methods: {
        async saveTemplate (type) {
            try{
                // 判断是 编辑 还是 新建
                let data = null
                if (this.id === 'new') {
                    data = await this.$https.saveAddTemplate(this.parameter)
                } else {
                    data = await this.$https.saveEditTemplate(this.parameter, this.id)
                }
                this.$message({
                    message: '恭喜你，操作成功！',
                    type: 'success'
                });
                // 判断 是 点击的是确定 还是 编辑规则按钮， 跳转不同的路由
                if (type === 'save') {
                    this.$router.push({ name: 'analysisTemplate'});
                } else {

                }
            } catch (error) {
                this.$message.error(error.response.message);
            }
        },
        handleFlowChange (data) {
            this.$set(this.parameter, 'preProcessFlowId', data.id)
            this.$set(this.parameter, 'preProcessFlowName', data.name)
        },
        handleDatasetChange (data) {
            this.$set(this.parameter, 'processDataId', data.name)
        }
    }
}
</script>
<style lang="scss" scoped>
#template{
    width: 50%;
    margin: 50px auto;
}
</style>

