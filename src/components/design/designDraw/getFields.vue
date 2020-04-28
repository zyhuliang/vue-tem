<!--  design 设置 参数声明 组件  -->
<template>
    <div>
        <div>
            <el-input placeholder="请输入内容" v-model="fieldSearch" v-on:keydown="keydown" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-table ref="multipleTable" :data="fieldDatas.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%;"
                      @row-click="selFields">
                <el-table-column fixed type="index" width="60" :index="indexMethod">
                </el-table-column>
                <el-table-column prop="alias" label="字段名">
                </el-table-column>
            </el-table>
            <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                           :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="fieldDatas.length">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                fieldDatas: [],
                fieldSearch: "",
                currentPage: 1,
                copyGetFields: [],
                pagesize: 10,
            }
        },
        props: ["getFields"],
        watch: {
            getFields: {
                handler: function(val) {
                    this.fieldDatas = JSON.parse(JSON.stringify(val))
                    this.copyGetFields = JSON.parse(JSON.stringify(val))
                    this.fieldSearch = ""
                    this.currentPage = 1;
                    this.pagesize = 10;
                },
                deep: true
            },
            fieldSearch: function() {
                this.keydown();
            },
        },
        methods: {
            indexMethod: function(index) {
                return (this.pagesize * (this.currentPage - 1) + index + 1);
            },
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            selFields: function(row) {
                console.log(row.alias)
                this.$emit('selFieldsVal', row.alias)
            },
            keydown: function() {
                this.currentPage = 1;
                this.pagesize = 10;
                if (this.fieldSearch != "") {
                    this.fieldDatas = JSON.parse(JSON.stringify(this.copyGetFields.filter(item => (~(item.alias.toLowerCase()).indexOf(
                        this.fieldSearch.toLowerCase())))));
                } else {
                    this.fieldDatas = JSON.parse(JSON.stringify(this.copyGetFields.filter(item => (~(item.alias.toLowerCase()).indexOf(
                        this.fieldSearch.toLowerCase())))));
                }
            }
        },
        mounted() {
            this.fieldDatas = JSON.parse(JSON.stringify(this.getFields))
            this.copyGetFields = JSON.parse(JSON.stringify(this.getFields))
            this.fieldSearch = ""
        }
    }
</script>

<style scoped lang="scss">

</style>
