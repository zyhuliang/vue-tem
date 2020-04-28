<template>
    <!--数据集成-采集器模块-路由切换标签页面-->
    <section id='bm-ch-col-collector-tmp'>
        <!-- content -->
        <div class="qa-content">
            <el-dropdown @command="navRoute" trigger="click">
                <el-button type="primary">
                    <i class="el-icon-menu"></i>&nbsp;{{navRouteValue}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(rList,key,index) in rTabsLists" :key="key" :name="key"
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
        data() {
            return {
                rTabsLists: [
                    {
                        "name": "采集器",
                        "url": "/collector/collectorTemplate"
                    },
                    {
                        "name": "导入任务",
                        "url": "/collector/importData"
                    },

                ],
                navRouteValue: this.$route.name
            }
        },
        methods: {
            //点击切换tab调用方法，更改tab名称
            navRoute: function (command) {
                this.navRouteValue = command
            }
        },
        updated: function () {
            // 下拉面板切换时显示的文字与路由同步更新
            this.navRouteValue = this.$route.name;
        }
    };
</script>

<style lang="scss" scoped>
    .qa-content {
        position: absolute;
        width: 100px;
        height: 50px;
        padding: 10px 10px 0 10px;
        box-sizing: border-box;
        z-index: 11;
    }
</style>