<template>
    <section id='bm-ch-col-detailRouter-tmp'>
        <!-- 采集器详情的tab路由页面 -->
        <div class="qa-content">
            <el-dropdown @command="navRoute" trigger="click">
                <el-button type="primary">
                    <i class="el-icon-menu"></i>&nbsp;{{navRouteValue}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(rList,key,index) in rTabsList" :key="key" :name="key"
                                      :command="rList.name">
                        <router-link class="dLinkLi" :to="rList.url">{{rList.name}}</router-link>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <router-view></router-view>
    </section>
</template>
<script>
    export default {
        components: {},
        data() {
            var id = this.$route.params.id
            var parentId = this.$route.params.resourceId
            return {
                rTabsList: [
                    {
                        "name": "采集器详细信息",
                        "url": "/collector/" + id + "/view/" + parentId
                    },
                    {
                        "name": "采集器任务列表",
                        "url": "/collector/" + id + "/taskList/" + parentId
                    },
                    {
                        "name": "采集器资源目录",
                        "url": "/collector/" + id + "/dir/" + parentId
                    }
                ],
                navRouteValue: this.$route.name
            }
        },
        methods: {
            navRoute: function (command) {
                this.navRouteValue = command
            }
        },
        updated: function () {
            this.navRouteValue = this.$route.name;
        }
    };
</script>

<style lang="scss" scoped>
    .qa-content {
        position: absolute;
        width: 160px;
        height: 50px;
        padding: 10px 10px 0 10px;
        z-index: 11;
        box-sizing: border-box;
    }
</style>