<!--  数据源 查询 树状图组件  -->
<template>
    <li class="treeBox">
        <i @click="toggle(model)" class="icon"
           :class="[open ? 'icon iconfont icon-ir-nav-open navopen': 'icon iconfont icon-ir-nav-close navclose']"></i>
        <em @click="schemaNavStyle(model)" ref="flowTreeTreeDataCss" class="flowTreeTreeActive"
            :name="model.name | nameFilter">{{ model.name | nameFilter }}&nbsp;{{ model.children.length |
            lengthFilter}}</em>
        <ul class="ulC" v-show="open">
            <tree-menu v-for="(tree,index) in model.children" :key="index" :model="tree"></tree-menu>
        </ul>
    </li>
</template>

<script>
    import flowTreeJs from './flowTreeInq.js'

    export default {
        name: 'tree-menu',
        props: ['model'],
        data() {
            return {
                open: false,
            }
        },
        computed: {
            isFolder: function () {
                return this.model.children && this.model.children.length
            }
        },
        filters: {
            lengthFilter: function (value) {
                if (value == "0") {
                    return "";
                } else {
                    return "(" + value + ")";
                }
            },
            nameFilter: function (value) {
                if (value === "Flows") {
                    return "根目录";
                } else {
                    return value;
                }
            }
        },
        methods: {
            //点击文件夹图标调用事件，更新树
            toggle: function (data, open) {
                if (!open)
                    this.open = !this.open
            },
            //点击目录树节点名称图标调用事件，更新列表
            schemaNavStyle: function (node) {
                var arr = document.getElementsByClassName("flowTreeTreeActive");
                for (var i = 0; i < arr.length; i++) {
                    arr[i].style.color = '';
                }
                this.$refs.flowTreeTreeDataCss.style.color = '#3e98fe';
                //更新列表
                flowTreeJs.$emit('getNode', node);
            }
        }
    }
</script>

<style scoped>
    ul em {
        font-style: normal;
        cursor: pointer;
    }

    .icon.el-icon-tickets {
        color: #999999;
        font-size: 12px;
    }

    .tree-menu li {
        line-height: 1.5;
    }

    .treeBox {
        padding: 9px 5px 0 5px !important;
    }

    ul.ulC {
        margin: 0px 0 0px 15px;
        padding: 0;
    }

    ul.ulC div {
        line-height: 20px;
    }

    ul.ulC div span {

    }

    .activetrue {
        color: #3e98fe
    }
</style>