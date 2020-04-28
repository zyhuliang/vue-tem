<template>
    <!--log dialog-->
	<el-dialog v-dialog-drag
			:visible.sync="dialogLogVisible"
			:close-on-click-modal="false"
			:modal-append-to-body="false"
			title="查看日志"
			custom-class="dialogClass"
	>
				<span >
				    <div  style="width:100%; padding: 10px; overflow-y:hidden; border:1px;">
						<div v-model="logs" style="padding-top:5px;padding-bottom:2px" v-for="(log) in logs " >{{log}}</div>
					</div>
				</span>
		<span slot="footer" class="dialog-footer">
					<el-button type="success" @click="viewLog()">刷新</el-button>
					<el-button type="primary" @click="dialogLogVisible = false">确定</el-button>
					<el-button @click="dialogLogVisible = false">取消</el-button>
				</span>
	</el-dialog>
</template>

<script>
    import {previewObject,previewObjectCollector,getCollectorDetialLog } from '@api'

    export default {
        name: 'dialogLog',
        data() {
            return {
                dialogLogVisible:false,
              	logs:[],
            }
        },
        methods: {
//			查看日志
            viewLog: function (id) {
                if(id){
                    this.collectorId = id
                }
                getCollectorDetialLog(this.collectorId).then((res)=>{
                    this.logs = res.length !=0 ? res : ['暂无数据']
                    this.dialogLogVisible = true
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