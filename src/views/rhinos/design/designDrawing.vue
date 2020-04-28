<template>
        <component ref="flowData" :is="flowTypes"></component>
</template>
<script>
    import { flowTypeComp } from "@function/flowType" //流程类型组件

    export default {
        data() {
            return {
                flowId: this.$route.params.id, //流程ID
                flowType: this.$route.query.type, //流程类型
                flowTypes: '', //流程类型组件
                reload: this.reload
            }
        },

        methods: {

        },
        computed: {

        },
        beforeRouteLeave: function(to, from, next) {
            if (this.$refs.flowData && this.$refs.flowData.routeTrue == true) {
                this.$confirm('当前的修改会被重置，确定要继续吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    next()
                }).catch(() => {

                });
            } else {
                next()
            }
            sessionStorage.setItem("parameters", []);
        },
        mounted() {
            let comp = flowTypeComp(); //节点组件
            this.flowTypes = comp[this.$route.query.type];
            this.$router.push(`/${this.flowType}?id=${this.flowId}&type=${this.flowType}`)
        },
    }
</script>

<style scoped lang="scss">

</style>
