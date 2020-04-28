<template>
  <div class="info-tree-item">
    <span
      class="icon"
      @click="unfold(model, 'click')"
    >
      <i
        v-if="model.children.length"
        class="el-icon-arrow-right"
        :style="[model.open ? rotateDown: rotateRight]"
      />
      <i :class="['icon', model.open ? 'el-icon-ump-wenjianjiazhankai': 'el-icon-ump-file' , model.children.length ? 'el-icon-ump-file': 'el-icon-ump-file']" />
    </span>
    <span
      ref="active"
      class="active name"
      @click="infoCard(model)"
    >
      {{ model.name }}
    </span>
    <span
      v-if="model.children.length"
      class="length"
    >
      {{ `（${model.children.length}）` }}
    </span>
    <slot />
    <ul v-show="model.open">
      <tree-menu
        v-for="(tree,index) in model.children"
        :key="index"
        :model="tree"
        :interface-method="interfaceMethod"
      >
        <slot />
      </tree-menu>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'TreeMenu',
  inject: ['current'],
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    interfaceMethod: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      rotateDown: {
        transform: `rotate(${90}deg)`,
        transition: `transform 0.2s`
      },
      rotateRight: {
        transform: `rotate(${0}deg)`,
        transition: `transform 0.2s`
      },
      that: this
    }
  },
  mounted () {
  },
  methods: {
    async unfold (data, type) {
      this.$set(data, 'open', !this.model.open)
      // 指定类型调接口
      if (!data.resType.startsWith('user')) {
        // 只有展开才调接口
        if (data.open) {
          let childrenData = await this.$https[this.interfaceMethod](data.id)
          this.$set(this.model, 'children', childrenData.data.children)
        }
      }
    },
    infoCard (data) {
      // 判断类型 跳转不同的页面
      $('.active').css({ color: '' })
      this.$refs.active.style.color = '#3e98fe'
      if (data.resType.startsWith('user')) {
        this.$set(data, 'open', !this.model.open)
      }
      if (!data.resType.startsWith('user')) {
        // 返回 选中对象
        this.current(data)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.info-tree-item{
  .name{
    cursor: pointer;
  }
  padding-left: 15px;
  line-height: 30px;
  font-size: 12px;
  .icon{
    font-size: 14px;
    width: 14px;
  }
  .el-icon-arrow-right{
    font-size: 14px;
    width: 14px;
  }
  .el-icon-ump-wenjian1{
    margin-left: 18px;
    font-size: 14px;
    width: 14px;
  }
  .length{
    margin-left: 0px;
  }
}
</style>
