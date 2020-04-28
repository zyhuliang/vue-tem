<template>
    <el-dialog
			:title="clusterData.colonyTitle"
			:visible.sync="clusterData.dialogVisibleExport"
			class="el-body-padding">
			<el-form >
                <el-col :span="24">
                    <el-divider content-position="left"></el-divider>
                    <el-form-item label="clusterName" :label-width="formLabelWidth">
                    <el-select v-model="clusterData.clusterName" placeholder="请选择clusterName">
                        <el-option
                        :label="item.name"
                        :value="item.name"
                        v-for="(item, index) in selectOption"
                        :key="index"
                        ></el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
        </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="clusterData.dialogVisibleExport = false">取 消</el-button>
				<el-button type="primary" @click="exportSteps()">确 定</el-button>
			</span>
		</el-dialog>
</template>
<script>
    import {clusterAll} from '@/api/cluster/index.js'
     export default {
         props:{
             clusterData:{
                 type: Object,
                 default: function(){
                    return {
                                colonyTitle:'上载',
                                dialogVisibleExport:false,
                                formLabelWidth: "120px",
                                clusterName:'',
                                selectOption: [],
                                changRow: [],
                                ids:[]
                            }
                 }
             }
         },
         components:{

         },
         watch:{
             clusterData:{
                 handler(val){
                     if(val.dialogVisibleExport == true){
                         this.create()
                     }
                 },
                 deep: true
             }
         },
         data(){
             return {
                 formLabelWidth: '200px',
                 selectOption:[],
                 clusterData:{
                    colonyTitle:'上载',
                    dialogVisibleExport:false,
                    formLabelWidth: "120px",
                    clusterName:'',
                    selectOption: [],
                    changRow: [],
                    ids:[]
                  }
             }
         },
         methods:{
             exportSteps(){

             },
             create(){
				clusterAll().then(res=>{
					this.selectOption = res.data
				})
			},
         },
         mounted(){
         }
     }
</script>
