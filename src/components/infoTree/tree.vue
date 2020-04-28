<template>
  <ul class="info-tree">
    <li
      v-for="(tree,key,index) in dataTree"
      :key="index"
    >
      <tree
        :model="tree"
        :interface-method="interfaceMethod"
      />
    </li>
  </ul>
</template>
<script>
import Tree from './treeItem.vue'
export default {
  name: 'Stree',
  components: {
    Tree
  },
  props: {
    dataTree: {
      type: Array,
      default: () => []
    },
    interfaceMethod: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>

</style>
