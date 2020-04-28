<template>
    <!--name dialog-->
	<el-dialog
			:visible.sync="dialogDatasourceVisible"
			:close-on-click-modal="false"
			:modal-append-to-body="false"
			title="数据源设置"
	>
		<el-form :model="dataSourceForm" id="bm-dataSource-dialog-form">
			<el-form-item label="名称" :label-width="formLabelWidth">
				<el-input v-model="dataSourceForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="concat-files" :label-width="formLabelWidth">
				<el-input v-model="dataSourceForm.description" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" >
			<el-button type="primary" @click="dialogDatasourceVisible = false">确定</el-button>
			<el-button @click="dialogDatasourceVisible = false">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
    import {getDatasource } from '@api'

    export default {
        name: 'previewDataSource',
        data() {
            return {
                dialogDatasourceVisible:false,
                dataSourceForm:{},
                formLabelWidth:""
            }
        },
        methods: {
//			数据预览 dataSource
            datasourceDialog: function (dataStoreId) {
//				获取datasource的entity
                getDatasource(dataStoreId).then((resourceEntity)=>{
                    if(resourceEntity.resType == 'DB'){

                    }else if(resourceEntity.resType == 'SOCKET'){
                        this.dataSourceForm = resourceEntity.attributes.storageConfigurations;
                        this.dataSourceForm.name = resourceEntity.name
                        this.dataSourceForm.description = resourceEntity.description
                    }
                    this.dialogDatasourceVisible = true
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            },
        },
        mounted() {
        }
    }
</script>


<style lang="scss" scoped>

</style>