<template>
	<section class="con-module">
		<el-row class="btnClass xbtnClass">
			<div class="marTop">
				<el-input v-model="addForm.dataset" placeholder="请选择内容" name="bm-ch-zebra-kinship-input" class="input-with-select" disabled>
					<el-button slot="append" icon="icon iconfont icon-ir-search" name="bm-ch-zebra-kinship-choose"  @click="dataInquire"></el-button>
				</el-input>
				<!-- 数据集查询 dialog-->
				<el-dialog title="数据集查询" :visible.sync="dialogDataSetVisible" :close-on-click-modal="false"
						   :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass" append-to-body>
					<el-form>
						<data-source-inquire ref="dataSourceInquire" @thisSelectDatasetVal="getSelectDateVal"
											 rootName="dataset_dir"></data-source-inquire>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="submitDataSet" name="bm-ch-step2Form-dataset-ok">确定</el-button>
						<el-button @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
					</div>
				</el-dialog>
			</div>
		</el-row>
        <relation :relationId="relationId"></relation>
	</section>
</template>
<script>
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import Relation from '@cheetah/resourceMan/relation/relation.vue'
    export default {
        components: {dataSourceInquire, Relation},
        data() {
            return {
                relationId: 'test_标准',
                getSelvalDataName:"",
                dataSetId:"",
                dialogDataSetVisible:false,
                id:"",
                addForm: {
                    name: '',
                    dataset: '',
                    flowID:'',
                    flowName:'',
                    description:''
                },
                value: 1,
            }
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog(){
                //关闭dialog
                this.dialogDataSetVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            //data查询
            dataInquire:function () {
                //弹出"data查询"层
                this.dialogDataSetVisible = true;
            },
            //获取子组件的data
            getSelectDateVal(data){
                this.getSelvalDataName = data.name;
                this.id = this.dataSetId = data.id;
                // 初次选中时 默认展示数据集级别
                this.value == 1
            },
            //data查询数据提交
            submitDataSet:function () {
                if(this.getSelvalDataName === ''){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                }else {
                    this.addForm.dataset = this.getSelvalDataName;
                    this.cancelDatasetDialog();
                    this.relationId = this.addForm.dataset
                }
            },
        },
        mounted() {
        }
    };

</script>

<style scoped>
	.con-module .el-row .el-input{
		width: 220px;
		margin-right: 10px;
	}
	.con-module .el-row .marTop{
		padding: 4px 0px 0px 0px;
	}
	.con-module .canvas{
		width: 100%;
		height: 500px;
		background-color: #fefefe;
		box-sizing: border-box;
		border: 1px solid #dcdfe6;
	}
	.xbtnClass{
		z-index: 98;
	}
</style>