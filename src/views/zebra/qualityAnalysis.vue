<template>

  <section id="bm-qa-qualityAnalysis">

      <!-- content -->
      <div class="qa-content" id="bm-qa-qualityAnalysis-content">
          <el-dropdown @command="navRoute" trigger="click">
              <el-button type="primary" name="primaryBtn">
                  <i class="el-icon-menu"></i>&nbsp;{{navRouteValue}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(rtList,key,index) in rTabsList" :key="key" :command="rtList.name" :name="rtList.name">
                      <router-link class="dLinkLi" :to="rtList.url">{{rtList.name}}</router-link>
                  </el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
      </div>
      <router-view></router-view>


  </section>
</template>
<script>
    import secondNav from '@components/dataTree/secondNav.vue'
		import Bus from './bus.js' 
    export default {
        components: {
            secondNav
        },
        data() {
            return {
                rTabsList:[
                    {
                        "name":"分析模板",
                        "url":"/qualityAnalysis/analysisTemplate"
                    },
                    {
                        "name":"分析规则",
                        "url":"/qualityAnalysis/analysisRules"
                    },
                    {
                        "name":"任务执行信息",
                        "url":"/qualityAnalysis/teInformation"
                    },
                    {
                        "name":"评估结果统计",
                        "url":"/qualityAnalysis/erStatistics"
                    }
                ],
                navRouteValue:this.$route.name
            }
        },
        methods: {

            navRoute : function(command){
                this.navRouteValue = command
            }
        },
        mounted() {
						Bus.$on('menuSet',(data)=>{
            	this.navRouteValue=data;
            	//console.log('kkkk')
            })
						Bus.$on('backMenuSet',(data)=>{
							this.navRouteValue=data;
						})
        },
        updated:function () {
            this.navRouteValue = this.$route.name;
        },
        beforeDestroy () {
		    	Bus.$off('menuSet');
		    	Bus.$off('backMenuSet');
		  	}
        
    };

</script>

<style lang="scss" scoped>
  .qa-content{
      position: absolute;
      width: 100px;
      height: 50px;
      padding: 10px 20px 0 10px;
      box-sizing: border-box;
      z-index: 11;
  }


</style>