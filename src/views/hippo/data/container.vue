<template>
    <section id="bm-hippo-data">
        <!-- content -->
        <div class="qa-content">
            <ul id="bm-hippo-data-ul">
                <li v-for="(rtList) in rTabsList">
                    <router-link class="rLinkLi" :to="rtList.url">{{rtList.name}}</router-link>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </section>
</template>
<script>
    import secondNav from '@components/dataTree/secondNav.vue'

    var parameter = {filter: "", limit: "8", offset: "0", query: "", sorts: "-lastModifiedTime"};
    export default {
        components: {
            secondNav
        },
        data() {
            return {
                rTabsList: [
                    {
                        "name": "",
                        "url": "/hippo/data/status"
                    },
                ]
            }
        },
        methods: {},
        mounted() {

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