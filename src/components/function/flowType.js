﻿/**
 * flowType 流程类型
 * ------------------------------------------------------------------
 */

import dataflow from '../../views/rhinos/newdesigner/dataflow/editor/index.vue';
import workflow  from '../../views/rhinos/newdesigner/workflow/editor/index.vue';
import streamflow from '../../views/rhinos/newdesigner/stream/editor/index.vue';
//flowType 类型组件对象(需和导入链接生成的变量同步)
var flowTypeCom = {
    workflow,
    dataflow,
    streamflow
}

//组件函数
export function flowTypeComp() {
    return flowTypeCom;
}

