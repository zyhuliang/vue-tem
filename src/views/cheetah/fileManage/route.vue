<template>
    <section id='bm-ch-fm-router-tmp'>
        <!-- 文件管理的tab路由页面 -->
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
            return {
                rTabsList: [
                    {
                        "name": "文件列表",
                        "url": "/dataMan/fileList"
                    },
                    {
                        "name": "文件上传",
                        "url": "/dataMan/fileUpload"
                    },
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