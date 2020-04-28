<template>
    <section class="clearBox" id="bm-qa-tasks-seeResult">
        <div class="title">
            <span>分析结果</span>
            <el-button @click="backPage">返回</el-button>
        </div>
        <el-table :data="rowCollection" v-loading="loading" id="bm-qa-tasks-seeResult-table">
            <el-table-column v-for="col in cols" :key="col.name" :show-overflow-tooltip="true" :prop="col.name"
                             :label="col.name"
            >
                <template slot-scope="scope">
			  		<span>
			  			{{scope.row[col.name]}}
			  		</span>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
    import {seeData, formHeadr} from '@api'

    export default {
        data() {
            return {
                id: this.$route.params.row.outputId,
                cols: [],
                loading: false,
                rowCollection: []
            }
        },
        methods: {
            getData() {
                this.id = this.id.replace(/\//g, '%252F')
                seeData(this.id).then(res => {
                })
            },

            getFormData() {
                this.id = this.id.replace(/\//g, '%252F')
                //获取表头数据
                formHeadr(this.id).then(res => {
                    this.cols = res.fields;
                    //获取表格数据
                    this.loading = true;
                    seeData(this.id).then(res => {
                        this.rowCollection = res;
                        this.loading = false;
                    })
                })
            },
            backPage() {
                history.back(-1)
            }
        },
        mounted() {
            this.getFormData();
        }
    }
</script>

<style lang="scss" scoped>
    .title {
        padding: 20px 0 20px 20px;
    }

    .see {
        cursor: pointer;
    }

    .clearBox {
        padding: 0 20px;
    }
</style>
