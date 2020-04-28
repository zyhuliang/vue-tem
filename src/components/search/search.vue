<template>
  <div class="query-builder">
    <rules-group
     :queryBuilder="queryBuilder"
     >
        <rule-container 
            v-if="queryBuilder.feilds"
            v-for="(list) in queryBuilder.feilds"
            :key="list.index"
            :parentdata="queryBuilder.feilds"
            :rule="list"
        >
        </rule-container>
    </rules-group>
  </div>
</template>
<script>
import rulesGroup from '@components/search/rulesGroup'
import ruleContainer from '@components/search/ruleContainer'
export default {
  provide: {
      delFeilds: (data, parent) => {
        let index = 0
        for (let i in parent) {
          if (parent[i].index === data.index) {
            index = i
          }
        }
        parent.splice(index, 1)
      },
      delGroup: (data, parent) => {
        let index = 0
        for (let i in parent) {
          if (parent[i].index === data.index) {
            index = i
          }
        }
        parent.splice(index, 1)
      },
      addFilter: (data, index) => {
        data.feilds.push({
          "andOr": "AND",
          "index": index,
          "name": "",
          "oper": "",
          "value": []
        })
      },
      addGroup: (that, data, index) => {
        let group = {
            "andOr": "AND",
            "feilds": [
              {
                "andOr": "AND",
                "index": 0,
                "name": "",
                "oper": "",
                "value": []
              }
            ],
            "index": index
          }
          data.fieldGroups ? data.fieldGroups.push(group) :
          that.$set(data, 'fieldGroups', [
            group
          ])
      }
  },
  components: {
    rulesGroup,
    ruleContainer
  },
  data () {
    return {
      that: this,
      queryBuilder: {
        "andOr": "AND",
        "feilds": [
          {
            "andOr": "AND",
            "index": 0,
            "name": "",
            "oper": "",
            "value": []
          }
        ],
        "index": 50
      }
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .query-builder{
    > dl {
      &:before, &:after{
        content: '';
        position: absolute;
        left: 0px;
        width: 0px;
        border-color: #fff;
        border-style: solid;
        border-radius: 0 0 0 0px;
        border-width: 0 0 0px 0px;
        height: 0;
        top: 0;
        z-index: 100
      }
    }
  }
</style>

