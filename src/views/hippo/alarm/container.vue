<template>
    <section>
        <!-- content -->
        <div class="qa-content" id="bm-hippo-alarm-container">
            <el-tabs v-model="active" @tab-click="handleClick">
                <el-tab-pane label="告警信息" name="taskWarningsList">
                    <taskWarningsList />
                </el-tab-pane>
                <el-tab-pane label="告警规则" name="taskWarningsRule">
                    <taskWarningsRule />
                </el-tab-pane>
            </el-tabs>
        </div>
    </section>
</template>
<script>

    var parameter = {filter: "", limit: "8", offset: "0", query: "", sorts: "-lastModifiedTime"};
    import taskWarningsList from '@views/hippo/alarm/alarm'
    import taskWarningsRule from '@views/hippo/alarm/rule'
    export default {
        components: {
            taskWarningsList,
            taskWarningsRule
        },
        data() {
            return {
                active: 'taskWarningsList',
            }
        },
        methods: {
            handleClick (val) {
                // console.log(val)
                // this.active = val
            }
        },
        mounted() {

        }
    };

</script>

<style lang="scss" scoped>
    .qa-content {
        position: relative;
        z-index: 0;
        margin-top: -40px;
        float: left;
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
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