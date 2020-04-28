<template>
    <el-dropdown @command="navRoute" trigger="click">
        <el-button type="primary" name="primaryBtn">
            <i class="el-icon-menu"></i>&nbsp;{{ navRouteValue }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,key) in nav" :key="key" :command="item.name" :name="item.name">
                <router-link class="dLinkLi" :to="item.url">{{item.name}}</router-link>
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>  
</template>
<script>
export default {
    data () {
        return {
            navRouteValue: '分析模板',
            nav:[
                {
                    "name":"分析模板",
                    "url":"/qiang_qualityAnalysis/analysisTemplate"
                },{
                    "name":"分析规则",
                    "url":"/qiang_qualityAnalysis/analysisRule"
                },{
                    "name":"任务执行信息",
                    "url":"/qiang_qualityAnalysis/executiveInformation"
                },{
                    "name":"评估结果统计",
                    "url":"/qiang_qualityAnalysis/statisticalResults"
                }
            ],
        }
    },
    methods: {
        navRoute : function(command){
            this.navRouteValue = command
        }
    }
}
</script>
<style lang="scss" scoped>
</style>