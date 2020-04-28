<template>
    <dl class="rules-group-container">
      <dt class="rules-group-header">
        <div class="group-conditions">
            <info-button-group
                :config="check"
                @currentChange="currentChange"
            />
        </div>
        <div class="group-actions">
          <el-button
            type="primary"
            plain
            icon="el-icon-circle-plus"
            class="add-rule"
            size="mini"
            round
            @click="addFilter(queryBuilder, listIndex.fieldsIndex++)"
          >
            Add filter
          </el-button>
          <el-button
            type="primary"
            plain
            round
            icon="el-icon-circle-plus"
            class="add-rule"
            size="mini"
            @click="addGroup(that, queryBuilder, ++listIndex.groupIndex)"
          >
            Add group
          </el-button>
          <el-button
            type="warning"
            plain
            size="mini"
            round
            @click="delGroup(queryBuilder, parent)"
          >
            删除
        </el-button>
        </div>
      </dt>
      <dd class="rules-group-body">
        <ul class="rules-list">
          <slot></slot>
            <rules-group
              v-if="queryBuilder.fieldGroups"
              v-for="(item) in queryBuilder.fieldGroups"
              :queryBuilder="item"
              :parent="queryBuilder.fieldGroups"
              :key="item.index"
            >
              <rule-container 
                v-if="item.feilds"
                v-for="(list) in item.feilds"
                :key="list.index"
                :parentdata="item.feilds"
                :rule="list"
              >
              </rule-container>
            </rules-group>
        </ul>
      </dd>
    </dl>
</template>
<script>
import infoButtonGroup from '@components/infoButtonGroup/infoButtonGroup'
import ruleContainer from '@components/search/ruleContainer'
export default {
  name: 'rulesGroup',
  inject: ['addFilter', 'addGroup', 'delGroup'],
  components: {
    infoButtonGroup,
    ruleContainer,
  },
  props: {
    queryBuilder: {
      type: Object,
      default: () => {}
    },
    parent:{
      type: Array,
      default: () => [1,2,3]
    }
  },
  data () {
    return {
      listIndex: {
        fieldsIndex: 1,
        groupIndex: 50,
      },
      that: this,
      check: [
          {
              label: 'AND',
              value: 'AND'
          }, {
              label: 'OR',
              value: 'OR'
          }
      ]
    }
  },
    created () {
        this.type = 'countless'
        this.SQL = this.isContain
    },
  methods: {
    currentChange (value) {
      console.log(value)
    }
  }
}
</script>
<style lang="scss" scoped>
.rules-group-container{
    height: 100%;
    width: 100%;
    background: #fff;
    position: relative;
    &:before, &:after{
        content: '';
        position: absolute;
        left: 6px;
        width: 13px;
        border-color: #ccc;
        border-style: solid;
        border-radius: 0 0 0 4px;
        border-width: 0 0 2px 2px;
        height: calc(50% + 30px);
        top: -33px;
        z-index: 0
      }
      &:not(:last-of-type):after{
          border-width: 0 0 0 2px;
          top: 45%;
          height: calc(50% + 18px);
      }
    .rules-group-header{
        display: flex;
        margin-top: 10px;
        padding-left: 15px;
        position: relative;
        z-index: 1;
        .group-actions{
            margin-left: auto;
        }
    }
    // dl
    .rules-group-body{
      position: relative;
      // ul
      .rules-list{
          padding-left: 15px;
      }
    }
}
</style>
