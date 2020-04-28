<template>
  <div class="criteria">
    <ul
      v-for="(item, index) in criteria"
      :key="index"
      class="add-line"
    >
      <li v-if="isShowDelete">
        <el-button
          icon="el-icon-delete"
          circle
          size="mini"
          @click="deleteTag(index)"
        />
      </li>
      <li
        v-if="index !== 0"
      >
        <el-switch
          v-model="item.logicalOperator"
          style="display: inline-block"
          disabled
          active-color="#67C23A"
          inactive-color="#ff4949"
          active-text="and"
          inactive-text="or"
        />
      </li>
      <li>
        <el-tag size="small">
          {{ item.title }}
        </el-tag>
      </li>
      <li
        v-if="item.label"
      >
        <el-button
          round
          size="mini"
        >
          {{ item.label }}
        </el-button>
      </li>
      <li
        v-for="(tags, i) in item.showInputTag"
        :key="i"
      >
        <el-tag size="small">
          {{ tags }}
        </el-tag>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    criteria: {
      type: Array,
      default: () => []
    },
    isShowDelete: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    deleteTag (index) {
      this.$emit('deleteTag', index)
    }
  }
}
</script>
<style lang="scss" scoped>
  .criteria{
    width: 80%;
    ul{
      display: flex;
      flex-direction: row;
      li{
        flex-grow: 1;
        height: 40px;
        line-height: 40px;
      }
    }
  }
</style>
