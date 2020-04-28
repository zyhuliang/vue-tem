<template>

	<section class="con-module">
		<el-row class="btnClass xbtnClass">
			<div class="marTop">
				<el-input v-model="addForm.dataset" placeholder="请选择内容" class="input-with-select"  name="bm-ch-zebra-schemaAnalysis-input" disabled>
					<el-button slot="append" icon="icon iconfont icon-ir-search" name="bm-ch-zebra-schemaAnalysis-choose"  @click="schemaInquire"></el-button>
				</el-input>
				<!-- Dataset -->
				<el-dialog title="元数据查询" :visible.sync="dialogDataVisible" :modal-append-to-body="false" custom-class="dialogClass">
					<el-form>
						<schema-inquire @thisSelectSchemaVal="getSelectDateSchemaVal" :multipleTable="true"></schema-inquire>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="submitSchemaData">确定</el-button>
						<el-button @click="dialogDataVisible = false">取消</el-button>
					</div>
				</el-dialog>
			</div>
		</el-row>
		<analysis></analysis>
	</section>
</template>
<script>
	import { bloodAnalysisDataset,bloodAnalysisFields,bloodAnalysisFieldsDetail} from '@api';
	import ElInput from "@node_modules/element-ui/packages/input/src/input.vue";
	import schemaInquire  from '@schemaInq/schemaInquire.vue';
	import {createParameter} from '@components/function/queryParameter.js';
	import Analysis from '@cheetah/resourceMan/analysis/analysis.vue'
	export default {
		components: {ElInput,schemaInquire, Analysis},
		data() {
			return {
				getSelValDataSchema: [],
				dialogDataVisible:false,
				multipleSelection: [],
				addForm: {
					name: '',
					dataset: '',
				},
				analysisId: ''
			}
		},
		methods: {
			//Schema查询数据提交
			submitSchemaData:function () {
				if(this.getSelValDataSchema.length == 0){
					this.$message({
						type:'error',
						message:'请先选择至少一条元数据！'
					})
				}else{
					this.dialogDataVisible = false
					var analysis = {};
					if (!Array.isArray(this.getSelValDataSchema)) {
						let arr = []
						arr.push(this.getSelValDataSchema)
						this.getSelValDataSchema = arr
					}
					if (this.getSelValDataSchema.length === 0) {
						analysis.parentId = this.analysisId
					} else {
						// 根据ids 判断点击是不是目录
						let ids = []
						this.getSelValDataSchema.forEach((item) => {
							ids.push(item.id);
						})
						analysis.parentId = this.analysisId
						analysis.ids = ids
					}
					this.$router.push({ path: '/schemaAnalysis/id', query:{id: JSON.stringify(analysis)}});
				}
			},
			//获取子组件的DateSchema  entity
			getSelectDateSchemaVal(data, parentId){
				this.getSelValDataSchema = data;
				this.analysisId = parentId
			},
			//data查询
			schemaInquire:function () {
				//弹出"data查询"层
				this.dialogDataVisible = true;
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
