<template>
    <!--object dialog-->
    <el-dialog
            :visible.sync="dialogObjectVisible"
			:close-on-click-modal="false"
			:modal-append-to-body="false"
            title="数据源中的表预览"
			custom-class="dialogClass"
    >
				<div >
					<el-table :data="rowCollection" class="dialog-source-body" height="calc(80vh - 140px)">
						<tr v-for="(col, index) in cols">
							<el-table-column :prop="col[index]" :label="col">
								<template slot-scope="scope">
									{{scope.row[index]}}
								</template>
							</el-table-column>
						</tr>

                    </el-table>
				</div>
                <div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="dialogObjectVisible = false">确定</el-button>
					<el-button @click="dialogObjectVisible = false">取消</el-button>
				</div>
    </el-dialog>
</template>

<script>
    import {previewObject, previewObjectCollector ,taskPreviewData } from '@api'

    export default {
        name: 'previewObject',
        data() {
            return {
                dialogObjectVisible:false,
                rowCollection:[],
                cols:[],
            }
        },
        methods: {
//			数据预览
//			object编辑
            objectDialog: function (id,table,collectorId) {
                var params = 'limit:10;offset:0;rowCount:true'
                var sql = 'SELECT * FROM '+table
				taskPreviewData(id, sql, params).then((res)=>{
//                  用sql查看db类型的数据
					this.rowCollection = res.rows;
					this.cols = res.names
					this.dialogObjectVisible = true
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
	.dialog-source-body{
		height: calc(100vh - 400px);
		overflow-y: auto;
	}
</style>