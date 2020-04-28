<template>
	<section>
		<div class="search_sel">
			<el-select v-model="selVal"  placeholder="请选择" @change="currentSel">
				<el-option v-for="item in options"
						   :label="item.label"
						   :value="item.value"
						   :key="item.value">
				</el-option>
			</el-select>
		</div>
		<div>
			<router-view></router-view>
		</div>
	</section>
</template>

<script>
	import Bus from './bus.js'
	export default{
		name:'Search',
		data(){
			return{
				options: [{
		          value: '/dataImport',
		          label: '数据导入'
		        }, {
		          value: '/fileImport',
		          label: '文件导入'
		        },{
		          value: '/globalCollector',
		          label: '采集器'
		        },{
		          value: '/importTask',
		          label: '采集器导入任务'
		        },		        
		        {
		          value: '/datasets',
		          label: '数据集'
		        },
		        {
					value:'/datasource',
					label:'数据源'
				},
				{
					value:'/schemas',
					label:'元数据'
				},
				{
					value:'/flows',
					label:'Flows'
				},
				{
					value:'/globalTemp',
					label:'分析模板'
				},
				{
					value:'/globalRule',
					label:'分析规则'
				},
				{
					value:'/globalTaskCarry',
					label:'任务执行'
				},
				{
					value:'/configure',
					label:'配置'
				},
				
				],
		       // value4: '/dataImport',
		        selVal:'/dataImport',
		        index:0
			}
		},
		methods:{
			 currentSel(selVal){
		        this.selVal = selVal;
		        this.$router.push({path:this.selVal})
		        //console.log(this.selVal);
		      }
		},
		mounted(){
			//console.log(this.selVal);
			//this.$router.push({path:this.selVal})
			Bus.$on('selectVal',(data)=>{
				this.selVal=data;
			})
			//console.log(this.selVal);
		},
		beforeDestroy () {
		    Bus.$off('selectVal')
		  }
		
	}
</script>

<style lang="scss" scoped>
.search_sel{
	position: absolute;
	z-index: 999;
	width: 200px;
	top: 10px;
	left: 10px;
}
</style>