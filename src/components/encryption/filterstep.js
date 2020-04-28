import { encrypt, addBase64 } from '@components/encryption/aes.js'
let addtBaseransform = val => {
  let arr = []
  for (let i = 0; i < val.length; i++) {
    arr.push(addBase64(val[i]))
  }
  return arr
}
let addValidateBase = val => {
  val.map(item => {
    item.expression = addBase64(item.expression)
  })
  return val
}
let filterBaseStepsOutput = params => {
  if (params.type == 'validate') {
    params.otherConfigurations.validationRules = addValidateBase(params.otherConfigurations.validationRules)
  }
  if (params.type == 'split' || params.type == 'filter') {
    params.otherConfigurations.condition = addBase64(params.otherConfigurations.condition)
  }
  if (params.type == 'sql' || params.type == 'sqlsource') {
    params.otherConfigurations.sql = addBase64(params.otherConfigurations.sql)
  }
  if (params.type == 'transform') {
    params.otherConfigurations.expressions = addtBaseransform(params.otherConfigurations.expressions)
  }
  if (params.type == 'sink') {
    if (params.otherConfigurations.password) {
      params.otherConfigurations.password = encrypt(params.otherConfigurations.password)
    }
  }
  return params
}

 let filterBaseFlow = params=>{
    params.steps.map(item=>{
        if(item.type=='sink'){
            if(item.otherConfigurations.password){
                item.otherConfigurations.password = encrypt(item.otherConfigurations.password)
            }
        }
        if(item.type=='sql'||item.type=='sqlsource'){
            if(item.otherConfigurations.sql!=undefined){
                item.otherConfigurations.sql = addBase64(item.otherConfigurations.sql)
            }
        }
        if(item.type == 'transform'){
            item.otherConfigurations.expressions = addtBaseransform(item.otherConfigurations.expressions)
        }
        if(item.type == 'validate'){
            item.otherConfigurations.validationRules =addValidateBase(item.otherConfigurations.validationRules)
        }
        if(item.type=='filter'||item.type =='split'){
            if(item.otherConfigurations.condition!= undefined){
                item.otherConfigurations.condition = addBase64(item.otherConfigurations.condition)
            }
        }
    })
    return params
}
export { addtBaseransform, addValidateBase, filterBaseStepsOutput, filterBaseFlow }