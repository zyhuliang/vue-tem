<template>
<div class="visualization">
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
     <el-form-item label="X 轴: ">
      <el-autocomplete
        v-model="state1"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        clearable
        @select="handleSelectX"
      ></el-autocomplete>
    </el-form-item>
     <el-form-item label="Y 轴: ">
       <el-autocomplete
        v-model="state2"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        clearable
        @select="handleSelectY"
      ></el-autocomplete>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="generate('histogram')">柱状图</el-button>
      <el-button type="primary" plain @click="generate('line')">折线图</el-button>
      <el-button type="primary" plain @click="generate('pie')">饼图</el-button>
    </el-form-item>
  </el-form>
  <ve-histogram :data="visitNumbnerData" :data-zoom="dataZoom" v-if="histogram"></ve-histogram>
  <ve-line :data="visitNumbnerData" v-if="line"></ve-line>
  <ve-pie :data="visitNumbnerData" v-if="pie"></ve-pie>
</div>
</template>
<script>
export default {
  props: {
    restaurants: {
      type: Array,
      default: []
    },
    tableData: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      histogram: false,
      line: false,
      pie: false,
      XData: [],
      YData: [],
      dataZoom: {},
      visitNumbnerData: {
        columns: ['', ''],
        rows: [
        ]
      },
      form: {
        value: ''
      },
      // 这两个参数没有用到
      state1: '',
      state2: '',
      timeout:  null
    }
  },
   methods: {
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(results);
      },
      createStateFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectX(item) {
        let data = item.prop
        // 给 X 轴赋值
        this.tableData.forEach( (value, key) => {
          this.$set(this.XData, key, value[data])
        });
      },
      handleSelectY(item) {
        // 给 Y 轴赋值
        let data = item.prop
        this.tableData.forEach( (value, key) => {
          this.$set(this.YData, key, value[data])
        });
      },
      // 生成表
      generate (type) {
        if (type === 'pie') {
          this.pie = true
          this.line = false
          this.histogram = false
        }else if(type === 'line'){
          this.pie = false
          this.line = true
          this.histogram = false
        } else {  // histogram
          this.pie = false
          this.line = false
          this.histogram = true
        }
        this.dataZoom = {
          type: 'slider',
          start: 0,
          end: 100
        }
        this.visitNumbnerData.rows = []
        this.visitNumbnerData.columns = [this.state1, this.state2]
        for (let value in this.tableData) {
          this.visitNumbnerData.rows.push({
            [this.state1]:  this.XData[value],
            [this.state2]: this.YData[value]
          })
        }
      }
    },
    mounted() {
    }
}
</script>
<style lang="scss" scoped>

</style>
