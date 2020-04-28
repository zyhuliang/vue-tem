<template>
    <el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search">
        <el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
    </el-input>
</template>

<script>
	import Bus from '@globalSearch/bus.js'
    import {queryObject,createParameter} from '@function/queryParameter.js';
    var parameter=queryObject();
    export default {
        name: 'searchTableData',
        props:['startTime','endTime','pagesize'],
        data() {
            return {
                searchInput:"",
            }
        },
        methods: {
            initParameter: function () {
                this.searchInput = ''
            },
            searchTable:function searchTable(){
                parameter = this.buildParameters(this.pagesize,1, this.startTime,this.endTime,this.searchInput)
                this.$emit('searchKey', parameter,'', this.startTime,this.endTime,this.searchInput,this.pagesize);
            },
            //监听查询回车事件
            searchKeyup:function () {
                this.searchTable(this.pagesize,1, this.startTime,this.endTime,this.searchInput);
            },
        },
        mounted(){
        	this.searchInput=this.$route.params.searchVal;
        	        	
        	//从全局搜索传递过来数据        	
    		Bus.$on('val',(data)=>{
    			
    			this.searchInput = data;
    			  			
    			setTimeout(() => {
				    this.searchTable();
				   }, 100)
    		})
        },
        beforeDestroy () {
		    Bus.$off('val')
		  }
    }

</script>

<style lang="scss" scoped>

</style>