<template>
    <!--log dialog-->
	<el-dialog
			:visible.sync="dialogLogVisible"
			:close-on-click-modal="false"
			:modal-append-to-body="false"
			title="查看日志"
	>
		<el-tabs type="border-card" v-model="activeTabIndex" v-loading="loading" id="bm-com-collector-log-tab"@tab-click="refreshData({name:activeTabIndex},'refresh')">
			<el-tab-pane label="信息日志" name='0' >
				<div  class="log-tab">
					<div v-model="logs" class="log-content" v-for="(log) in logs " >{{log}}</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="错误日志" name='1'>
				<div  class="log-tab">
					<div v-model="logs" class="log-content" v-for="(log) in logs " >{{log}}</div>
				</div>
			</el-tab-pane>
		</el-tabs>
		<span slot="footer" class="dialog-footer">
			<span class="span-log">
				<!--正序反序-->
				<el-radio v-model="desc" label="true" @change="refreshData({name:activeTabIndex},'refresh')">反序</el-radio>
				<el-radio v-model="desc" label="false" @change="refreshData({name:activeTabIndex},'refresh')">正序</el-radio>

				<!--limit-->
				<el-select v-model="limit" class="select-log" @change="refreshData({name:activeTabIndex},'more')">
					<el-option
							v-for="item in [100,200,500]"
							:key="item"
							:value="item"
							:lable="item"
					>

					</el-option>
				</el-select>

			</span>
			<!--加载更多-->
			<el-button type="primary" @click="refreshData({name:activeTabIndex},'more')">加载更多......</el-button>
			<el-button type="primary" @click="refreshData({name:activeTabIndex},'refresh')">刷新</el-button>
			<el-button type="primary" @click="dialogLogVisible = false">确定</el-button>
			<el-button @click="dialogLogVisible = false">取消</el-button>
		</span>
	</el-dialog>
</template>

<script>
    import {getTaskExecuteJobLog } from '@api'

    export default {
        name: 'dialogTaskLog',
        data() {
            return {
                dialogLogVisible:false,
              	logs:[],
                taskId:"",
                activeTabIndex:'0',
                loading:false,
				start: -1,
				limit: 200,
                desc: "true",
                earliest: '',
				latest: ''
            }
        },
        methods: {
//			查看日志
            viewLog: function (row) {
                if(row) {
                    this.dialogLogVisible = true
                    this.taskId = row.id;
                    this.refreshData({name:'0'}, 'refresh');
                }
            },
            //更新数据
            refreshData: function(tab, type){
			    var that = this;
                that.activeTabIndex = tab.name
                that.loading = true;
                if(type === 'more'){
                    if(this.desc === 'true'){
                        //如果是反向日志加载更多，就要传递earliest
                        that.start = that.earliest
                    }else {
                        //如果是正向日志的加载更多，就要传递latest
                        that.start = that.latest
                    }
                } else{
                    that.start = -1
                    that.logs = []
                }
                getTaskExecuteJobLog(that.taskId,that.activeTabIndex, that.start, that.limit, this.desc).then((res)=>{
                    that.loading = false;
					that.earliest = res.earliest
					that.latest = res.latest
                    that.logs = that.logs.concat(res.list)
                },err =>{
                    that.loading = false;
                    that.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })

			}

        },
        mounted() {
        }
    }
</script>


<style lang="scss" scoped>
	.log-tab{
		width: 100%;
		/*height: 450px;*/
		height: calc(100vh - 400px);
		overflow: auto;
		border: 1px;
		.log-content{
			padding-top: 5px;
			padding-bottom: 2px
		}
		.more-button{
			text-align: center;
		}
	}
	.span-log{
		float: left;
		.select-log{
			width: 100px;
			margin-left: 50px;
		}
	}

</style>