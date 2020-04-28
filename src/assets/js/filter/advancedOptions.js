/**
 * ------------------------------------------------------------------
 * advancedOptions 中文转义
 * ------------------------------------------------------------------
 */
var obj = {}
/* var obj = {
    /!*
        nodeset
    *!/
    //数据分析-step-高级
    interceptor:'拦截器',
    sessionCache:'会话缓存',

    nullValue:'nullValue-',
    maxFileSize:'maxFileSize-',
    maxFileNumber:'maxFileNumber-',
    expiredTime:'expiredTime-',
    sliceTimeColumn:'sliceTimeColumn-',
    sliceType:'sliceType-',
    singleRowCache:'singleRowCache-',
    countWrittenRecord:'countWrittenRecord-',
    //designSubmit.vue
    debug:'debug-',
    master:'master-',
    'deploy-mode':'deploy-mode-',
    'local-external-jarfile':'local-external-jarfile-',
    /!*
        计划
    *!/
    //schedule-add.vue
    'dataset-nullable':'dataset-nullable-',
    'lineage.enable':'lineage.enable-',
    'debug-rows':'debug-rows-',
    'sink.concat-files':'sink.concat-files-',

    /!*
        质量分析
    *!/
    Schedule名称:'计划名称',
    Flow名称:'流程名称',
    'notify-output':'notify-output-',
    'queue':'queue-',
    'num-executors':'num-executors-',
    'driver-memory':'driver-memory-',
    'executor-memory':'executor-memory-',
    'executor-cores':'executor-cores-',
    'verbose':'verbose-',
    'local-dirs':'local-dirs-',
    'concat-files':'concat-files-',
    all:'all-',

} */

let adv = value => {
  for (var i in obj) {
    if (value == i) {
      return obj[i]
    }
  }
  return value
}
export { adv }
