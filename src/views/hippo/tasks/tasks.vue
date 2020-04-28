<template>
    <div class="tasks" id="bm-hippo-task-task">
        <div class="qa-content">
            <ul>
                <li v-for="(rtList) in rTabsList" :key="rtList.name">
                    <router-link class="rLinkLi" :to="rtList.url">{{rtList.name}}</router-link>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {

        data() {
            return {
                rTabsList: [
                    {
                        name: "趋势分析",
                        url: "/hippo/tasks/jobanalysis"
                    },
                    {
                        name: "归类信息",
                        url: "/hippo/tasks/history"
                    },
                    {
                        name: "概率分析",
                        url: "/hippo/tasks/probability"
                    }
                ]
            };
        }
    };
</script>
<style lang="scss" scoped>
    .qa-content {
        float: left;
        width: 100%;
        margin-top: -10px;
        box-sizing: border-box;
        padding: 0 !important;
        ul {
            float: left;
            width: 100%;
            margin: 0;
            padding: 0;
            border-bottom: 1px solid #dddddd;
            .rLinkLi {
                text-decoration: none;
                float: left;
                margin: 0px 20px 0px 0px;
                color: #666666;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
            }
            .router-link-active {
                border-bottom: 2px solid #3e98fe;
                color: #3e98fe;
            }
        }
    }
</style>

