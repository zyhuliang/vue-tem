<template>
	<div>
		<div class="dn-data">
			<el-row class="btnClass" :span="24">
				<div class="seach-left">
					<el-input placeholder="请输入名称" v-model="searchInput" @keyup.enter.native="searchKeyup" class="input-with-search">
						<el-button slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
					</el-input>
					<el-date-picker v-model="dateValue" type="daterange" @change="handledateValue" value-format="timestamp"
									range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
					<!--<div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
					<div v-show="endTime" ref="endTime">{{dateValue[1]}}</div>-->
				</div>
			</el-row>
			<el-row class="rf-swap">
				<el-table @sort-change="getOrder" tooltip-effect="dark" style="width: 100%" max-height="700" @selection-change="handleSelectionChange"
						  :data="table.content" v-loading="loading" id="bm-com-global-search-flow-table" height="calc(100vh - 200px)">
					<el-table-column prop="name" label="名称" sortable="custom">

					</el-table-column>
					<el-table-column prop="flowType" label="类型" sortable="custom">
					</el-table-column>
					<el-table-column prop="tenant.name" label="租户">
					</el-table-column>
					<el-table-column prop="owner" label="拥有者" sortable="custom">
					</el-table-column>
					<el-table-column prop="creator" label="创建人" sortable="custom">
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" sortable="custom" :formatter="dateFormat">
					</el-table-column>
					<el-table-column prop="lastModifier" label="修改人" sortable="custom">
					</el-table-column>
					<el-table-column prop="lastModifiedTime" label="修改时间" sortable="custom" :formatter="dateFormat">
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
							   :page-sizes="[8, 16, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="table.totalElements">
				</el-pagination>
			</el-row>
		</div>
	</div>

</template>
<script>
    import {
        designTableList,
        resDirTree
    } from '@api';
    import {
        createParameter
    } from '@function/queryParameter.js';
    import Bus from '../bus.js'
    export default {
        name: 'Flows',
        props: ['inputValue'],
        data() {
            return {
                dateValue: '',
                searchInput: '',
                currentPage: 1,
                pagesize: 8,
                table: [],
                flowType: 'all',
                startTime: false,
                endTime: false,
                multipleSelection: [],
                disId: '',
                prop: 'lastModifiedTime',
                orderDirection: 'DESC',
                parameter: '',
                loading: false
            }
        },
        methods: {
            searchKeyup() {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleSizeChange(size) {
                this.pagesize = size;
                var parameter = this.buildParameters();
                this.listTable(parameter)
            },
            handledateValue(val) {
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                var parameter = this.buildParameters();
                this.listTable(parameter)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            listTable(parameter) {
                this.loading = true;
                designTableList(parameter).then(data => {
                    this.loading = false;
                    this.table = data;
                    //console.log(this.table);
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                }).catch(() => {

                });
            },
            //列表排序
            getOrder: function(column) {
                var that = this
                if (column.order === 'ascending') {
                    this.orderDirection = 'ASC'
                } else {
                    this.orderDirection = 'DESC'
                }
                that.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                var parameter = this.buildParameters();
                that.listTable(parameter);
            },
            //传入的参数
            buildParameters: function() {
                var limit = this.pagesize;
                var offset = (this.currentPage - 1) * this.pagesize;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
                if (query != '%') {
                    parameter = createParameter('name', query, "LIKE").Build(parameter);
                }
                if (this.dateValue) {
                    if (this.dateValue != '' && this.dateValue.length != 0) {
                        parameter = createParameter('lastModifiedTime', Number(this.dateValue[0]), 'GREATER_THAN').
                        And('lastModifiedTime', Number(this.dateValue[1]), 'LESS_THAN').
                        Build(parameter);
                    }
                }
                parameter.sortObject.field = this.prop
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },
            searchTable: function searchTable() {
                this.currentPage = 1;
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
        },
        mounted() {
            //从全局搜索传递过来数据
            var _this = this;
            Bus.$on('val', (data) => {
                console.log(data);
                this.searchInput = data;
                this.searchTable();
            })
            var para = {
                excludes: "schema_dir;dataset_dir;datasource_dir;standard_dir",
                includes: "flow_dir;share_dir;user_dir",
                allUser: true,
                strict: true
            }
            resDirTree(para).then((data) => {
                this.disId = data[0].id;
                var parameter = createParameter("parentId", _this.disId, "EQUAL").Limit(8).Offset(0).Sort("lastModifiedTime",
                    "DESC").Build();
                _this.listTable(parameter);
            })
        },
        beforeDestroy() {
            Bus.$off('val')
        }
    }
</script>

<style lang="scss" scoped>
	.dn-content {
		float: left;
		width: 100%;
		position: relative;
		/*padding-left: 250px;*/
		box-sizing: border-box;
		height: 100%;

	.dn-data {
		position: relative;
		padding: 20px;

	.el-table {
		margin-top: 20px;

	.editName {
		color: #2182e4;
		cursor: pointer
	}

	.editName:hover {
		text-decoration: underline;
	}
	}

	.design-flowtype {
		float: left;
		width: 260px;
		height: 34px;
		line-height: 34px;

	h4 {
		margin: 0px;
		float: left;
	}

	.el-select {
		float: left;
		width: 180px;
		margin-left: 10px;
	}
	}
	}
	}

	.dn-content .dn-no-data {
		position: fixed;
		width: 100%;
		box-sizing: border-box;
		height: 100%;
		z-index: -1;
	}

	.dn-content .dn-no-data .noData {
		position: absolute;
		width: 200px;
		height: 200px;
		top: 50%;
		left: 50%;
		margin-left: -325px;
		margin-top: -150px;
		color: #cccccc;

	p {
		text-align: center;
		font-size: 16px;
		margin: 0px;
	}

	i {
		width: 100px;
		height: 100px;
		font-size: 80px;
	}
	}

	.iconStyle {
		font-size: 13px;
	}
</style>
