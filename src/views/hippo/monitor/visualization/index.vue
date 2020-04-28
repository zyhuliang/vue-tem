<template>
    <div class="visualization">
        <!-- 数据资源 -->
        <dataResources/>
        <!-- 数据共享 -->
        <share/>

        <trend/>
        <distribution/>
        <centerMain/>
        <!-- 数据流程 -->
        <process/>
        <quality/>
    </div>
</template>
<script>
    var eventFunction = function () {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 1920 * 100 + 'px';
    }
    import dataResources from './dataResources.vue'
    import share from './share.vue'
    import trend from './trend.vue'
    import distribution from './distribution.vue'
    import process from './process.vue'
    import quality from './quality.vue'
    import centerMain from './center'

    distribution
    export default {
        components: {
            dataResources,
            share,
            trend,
            distribution,
            process,
            quality,
            centerMain
        },
        mounted() {
            if (window.addEventListener) {
                window.addEventListener('resize', eventFunction, false)
            }
            document.documentElement.style.fontSize = document.documentElement.clientWidth / 1920 * 100 + 'px';
        },
        destroyed() {
            document.documentElement.style.fontSize = 12 + 'px';
            window.removeEventListener('resize',eventFunction,false)
        }
    }
</script>
<style lang="scss" scoped>
    .visualization {
        width: 100%;
        height: calc(100vh - 50px);
        background: url('~@assets/visualization/bg.png');
        position: relative;
        overflow: hidden;
    }
</style>
