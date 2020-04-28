<template>
  <div class="parameter">
    <!-- {{data.tab.title}} -->
    <component :is="setTemplate(data.step.type)" :data="data.step"></component>
    <!-- <adItem></adItem> -->
  </div>
</template>

a
<script>
import { mapGetters, mapActions, mapState } from "vuex";
import adItem from "./parameter/common/index";
import sink from "./parameter/sink";
import filter from "./parameter/filter";
import source from "./parameter/source"; //source_dummy
import source_dummy from "./parameter/source_dummy";
import aggregate from "./parameter/aggregate";
import sql from "./parameter/sql";
import transform from "./parameter/transform";
import join from "./parameter/join";
import lookup from "./parameter/lookup";
import split from "./parameter/split";
import cep from "./parameter/cep";
import watermark from "./parameter/watermark";
import interval_filter from "./parameter/interval_filter";

export default {
  watch: {},
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: {
    adItem
  },
  data: function() {
    return {};
  },

  mounted() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    setTemplate(val) {
      switch (val) {
        case "sink":
          return sink;
        case "filter":
          return filter;
        case "source":
          return source;
        case "source_dummy":
          return source_dummy;
        case "aggregate":
          return aggregate;
        case "sql":
          return sql;
        case "transform":
          return transform;
        case "join":
          return join;
        case "lookup":
        case "lookup_redis":
        case "lookup_mapdb":
          return lookup;
        case "split":
          return split;
        case "cep":
          return cep;
        case "watermark":
          return watermark;
        case "interval_filter":
          return interval_filter;
        default:
          "";
      }
    }
  }
};
</script>

<style lang="scss">
.parameter {
  .advanced-options {
    width: 100%;
    text-align: left;
    color: #3e98fe;
    margin: 0px;
    height: 40px;
    line-height: 40px;
  }
  .adop-title {
    width: 100%;
    text-align: center;
    font-weight: normal;
    font-size: 20px;
    margin: 0px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
