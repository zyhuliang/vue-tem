<!--  数据源 查询 树状图组件  -->
<template>
    <li class="treeBox">
        <i @click="toggle(model)"  class="icon" :class="[open ? 'fa fa-folder-open navopen': 'fa fa-folder navclose']"></i>
        <em @click="dataNavStyle(model)" ref="datasetInqDataCss" class="datasetInqActive" :name="model.name | filterName">{{ model.name | filterName }}</em>
        <ul class="ulC" v-show="open" v-if="isFolder">
            <tree-menu v-for="(tree,index) in model.children"  :key="index" :model="tree"></tree-menu>
        </ul>
    </li>
</template>

<script>
    import daIn from './dataInq.js'
    import {  } from '@api'

    export default {
        name: 'tree-menu',
        props: ['model','mondex'],
        data() {
            return {
                isActive: false,
                open: false,
                dataClass:'',
                setClass:['activetrue','']
            }
        },
        filters:{
            filterName:function (val) {
                if(val == "Datasets"){
                    return "数据集";
                }else if(val == "OtherUser"){
                    return "其他用户"
                }else{
                    return val;
                }
            }
        },
        watch:{

        },
        computed: {
            isFolder: function() {
                return this.model.children && this.model.children.length
            }
        },
        methods: {
            toggle: function(data,open) {
                if(data.id) {
                }
                if(!open)
                    this.open = !this.open
            },
            dataNavStyle:function (dataNavId) {
                var _this = this
                var arr = document.getElementsByClassName("datasetInqActive");
                    for(var i = 0 ; i< arr.length; i++){
                        arr[i].style.color = '';
                    }

                    this.$refs.datasetInqDataCss.style.color = '#3e98fe';
                    daIn.$emit('childMethod',dataNavId);

            }
        }
    }
</script>

<style scoped>
    ul em{
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
    .treeBox{
        padding: 9px 5px 0 5px!important;
    }
    ul.ulC{
        margin: 0px 0 0px 15px;
        padding: 0;
    }
    ul.ulC div{
        line-height: 20px;
    }
    ul.ulC div span{

    }
    .activetrue{
        color: #3e98fe
    }
</style>