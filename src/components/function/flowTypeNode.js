//nodeset 根据类型加载

// 根据类型判断加载 nodeset
import dataflow from '@design/designDraw/nodeSetDataflow.vue';
import workflow  from '@design/designDraw/nodeSetWorkflow.vue';
import streamflow from '@design/designDraw/nodeSetStreamflow.vue';




//flowType 类型组件对象(需和导入链接生成的变量同步)
var flowNodeTypeCom = {
    workflow,
    dataflow,
    streamflow
}

//组件函数
export function flowNodeTypeComp() {
    return flowNodeTypeCom;
}

