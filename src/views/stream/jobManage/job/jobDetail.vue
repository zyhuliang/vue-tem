<template>
    <section>
        <!-- content -->
        <div class="qa-content">
            <div class="streamDetail">
                <el-tabs type="border-card" v-model="activeName">
                    <el-tab-pane v-for="(rtList,key) in rTabsList" :key="key" :name="rtList.url">
                        <router-link slot="label" class="rLinkLi" :to="rtList.url">{{rtList.name}}</router-link>
                    </el-tab-pane>
                </el-tabs>
                <div class="primary-btn">
                    <el-button type="warning" @click="cancel()" class="primary-job ">返回</el-button>
                </div>
                <router-view></router-view>
            </div>
        </div>
    </section>
</template>
<script>
    export default {
        components: {},
        data() {
            return {
                activeName: '/jobManage/jobDetail/description/',
                flowId:"",
                rTabsList: [
                    {
                        "name":"作业描述 ",
                        "url":"/jobManage/jobDetail/description/",
                    },
                    {
                        "name":"作业配置 ",
                        "url":"/jobManage/jobDetail/configure/",
                    }
                ]
            }
        },
        methods:{
            cancel: function () {
                // 路由跳转到列表页
                this.$router.push({path: '/jobManage'})
            },
        },
        mounted() {
            if(this.$route.params.typeFlag=='CEP'){
                this.$router.push({path: '/jobManage/jobDetail/cepDesc'})
            	this.rTabsList=[
                    {
                        "name":"作业描述 ",
                        "url":"/jobManage/jobDetail/cepDesc/",
                    },
                    {
                        "name":"作业配置 ",
                        "url":"/jobManage/jobDetail/configure/",
                    }
                ]
            }else {
                this.$router.push({path: '/jobManage/jobDetail/description'})
            }
        }
    }

</script>

<style>
   .streamDetail .el-tabs__content{
        padding: 0;
   }
</style>

<style lang="scss" scoped>
    .qa-content{
        .rLinkLi{
            float: left;
            width: 100px;
            text-decoration: none;
            color: #333333;
            text-align: center;
            height: 100%;
        }
    }
    //右上角返回按钮样式
    .primary-btn{
        position: relative;
        width: 100%;
        .primary-job {
            position: absolute;
            right: 16px;
            top: -37px;
            z-index: 999;
        }
    }

</style>