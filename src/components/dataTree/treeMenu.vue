<!--  nav2 树状图组件  -->
<template>

    <li class="treeBox">
        <i @click="toggle(model)" v-if="model.resType == 'user_dir' || model.resType == 'user'" :class="[model.open ? ' fa fa-user-circle navopen': ' fa fa-user-circle-o navclose']"></i>
        <i @click="toggle(model)" v-if="model.resType != 'user_dir' && model.resType != 'user'" class="icon" :class="[model.open ? 'fa fa-folder-open navopen': 'fa fa-folder navclose']"></i>
        <!--全选权限-->
        <em @click="dataNavStyle(model)" ref="dataTreeDataCss" class="dataTreeActive" v-if="model.halfSelect" style="color: #000000" :name="model.name | nameFilter">{{ model.name | nameFilter}}&nbsp;
            <b>{{ model.children.length | lengthFilter}}</b>
        </em>
        <!-- 半选权限-->
        <em @click="dataNavStyle(model)" ref="dataTreeDataCss" class="dataTreeActive1"  v-if="!model.halfSelect" style="color: #87939a" :name="model.name | nameFilter">{{ model.name | nameFilter}}&nbsp;
            <b>{{ model.children.length | lengthFilter}}</b>
        </em>
        <div class="clear"></div>
        <ul v-show="model.open">
            <tree-menu v-for="(tree,index) in model.children" :key="index" :model="tree" :name="tree.name"></tree-menu>
        </ul>
    </li>
</template>

<script>
    import resIn from './resNav.js'
    import { resDirTree} from '@api'

    export default {
        name: 'tree-menu',
        props: ['model'],
        data() {
            return {
            }
        },
        filters: {
            lengthFilter : function (value) {
                if(value == "0"){
                    return "";
                }else {
                    return "(" + value + ")";
                }
            },
            nameFilter: function (value) {
                if(value === "Datasets"){
                    return "数据集";
                }else if(value === "Standards"){
                    return "数据标准";
                }else if(value === "Datasources"){
                    return "数据源";
                }else if(value === "Schemas"){
                    return "元数据";
                }else if(value === "OtherUser"){
                    return "其他用户";
                }else {
                    return value;
                }
            },
        },
        methods: {
//            点击文件夹图标调用事件，更新树
            toggle: function(data) {
                this.$set(data, 'open', !this.model.open)
            },
//            点击目录树节点名称图标调用事件，更新列表
            dataNavStyle:function (dataNavId) {
                if(this.$refs.dataTreeDataCss.innerText=='Datasets'){
                	localStorage.setItem('datasets',JSON.stringify(dataNavId.id));
                }
                if(this.$refs.dataTreeDataCss.innerText=='Schemas'){
                	localStorage.setItem('schemas',JSON.stringify(dataNavId.id));
                }
                //点击之后清空其余节点的蓝色选中恢复全选的黑色
                var arr = document.getElementsByClassName("dataTreeActive");
                for(var i = 0 ; i< arr.length; i++){
                    arr[i].style.color = '';
                }
                //点击之后清空其余节点的蓝色选中恢复半选的灰色
                var arr1 = document.getElementsByClassName("dataTreeActive1");
                for(var i = 0 ; i< arr1.length; i++){
                    arr1[i].style.color = '#87939a';
                }
                this.$refs.dataTreeDataCss.style.color = '#3e98fe';
                this.$router.push({
                    path: '/resourceMan',
                    query: {
                        id: dataNavId.id,
                        resType: dataNavId.resType,
                        owner: dataNavId.owner
                    }
                })
                resIn.$emit('childMethod', dataNavId);
                this.getTreeChildren(dataNavId.id);
            },
            //根据id获取树结构的子节点
            getTreeChildren(id) {
                if(!id){
                    return ;
                }
            }
        },
        mounted(){
        }
    }
</script>

<style lang="scss" scoped>
    i.icon {
        display: inline-block;
        float: left;
        margin: 2px 3px 0px 0px;
        width: 14px;
        height: 14px;
        line-height: 14px;
        font-size: 14px!important;
        background-repeat: no-repeat;
        vertical-align: middle;
    }
    .treeBox{
        width: 100%;
          &::after{
                content: '';
                display: table;
                clear: both;
            }
        i{
            float: none!important;
            margin: 0px!important;
            line-height: 12px;
        }
        em{
            word-break: break-all;
            word-wrap: break-word;
            b{
                font-weight: normal;
                color: #999999;
            }
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
        & ul {
            padding-left: 15px;
        }
        & .clear{
            height: 0;
            clear: both;
        }
    }

</style>
