<!--  nav2 树状图组件  -->
<template>
    <li class="treeBox">
        <i @click="toggle(model)"  class="icon" :class="[open ? 'icon iconfont icon-ir-nav-open navopen': 'icon iconfont icon-ir-nav-close navclose']"></i>
        <em @click="dataNavStyle(model)" ref="analysisRulesTreeDataCss" class="analysisRulesTreeActive" :name="model.name">{{ model.name | cn}}</em>
        <ul v-show="open" >
            <tree-menu v-for="(tree,index) in model.children" :key="index" :model="tree"></tree-menu>
        </ul>
    </li>
</template>

<script>
    import ruleNav from './ruleNav.js'

    export default {
        name: 'tree-menu',
        props: ['model'],
        data() {
            return {
                open: false
            }
        },
        methods: {
//            点击文件夹图标调用事件，更新树
            toggle: function(data,open) {

                if(!open)
                    this.open = !this.open
            },
//            点击目录树节点名称图标调用事件，更新列表
            dataNavStyle:function (dataNav) {
                //console.log(dataNav);
                var arr = document.getElementsByClassName("analysisRulesTreeActive");
                for(var i = 0 ; i< arr.length; i++){
                    arr[i].style.color = '';
                }
                this.$refs.analysisRulesTreeDataCss.style.color = '#3e98fe';
                ruleNav.$emit('childMethod',dataNav);
              // alert('111');
            }
        }
    }
</script>

<style scoped>
    ul {
        list-style: none;
    }
    i.icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        background-repeat: no-repeat;
        vertical-align: middle;
    }
    .icon.navclose {
        font-size: 12px;
        color: #58595f;
    }
    .icon.navopen {
        font-size: 12px;
        color: #58595f;
    }
    .icon.el-icon-tickets {
        color: #999999;
        font-size: 12px;
    }
    .tree-menu li {
        line-height: 1.5;
    }
    .treeBox ul{
        padding-left: 15px;
    }
</style>