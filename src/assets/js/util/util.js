// 处理缓存的 容错处理
function checkStorage (name, type) {
  if (!name) {
    console.error('缓存名字不存在')
  }
  if (type !== 'sessionStorage' && type !== 'localStorage') {
    console.error('当使用 type字段时 不传默认为 sessionStorage进行缓存， 使用type 字段时 必须以 sessionStorage 或者 localStorage 作为参数')
  }
}
/**
  * 容错处理
  * @value 字符串
  * @array 查找的数组对象
 */
export const checkfiled = (filed, array) => {
  if (filed === undefined || filed.__proto__.constructor !== String) {
    console.error(`参数一 输入的值是${filed}， 需要的是字符串`)
    return false
  }
  if (array === undefined || array.__proto__.constructor !== Array) {
    console.error(`参数二 输入的值是${array}， 需要的是数组`)
    return false
  }
  return true
}

exports.install = function (Vue) {
  /**
   * 存储 sessionStorage localStorage
   */
  Vue.prototype.__setItem = (name, content, type = 'sessionStorage') => {
    checkStorage(name, type)
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    return type === 'sessionStorage'
      ? window.sessionStorage.setItem(name, content)
      : window.localStorage.setItem(name, content)
  }

  /**
   * 获取 sessionStorage localStorage
   */
  Vue.prototype.__getItem = (name, type = 'sessionStorage') => {
    checkStorage(name, type)
    return type === 'sessionStorage'
      ? window.sessionStorage.getItem(name)
      : window.localStorage.getItem(name)
  }
  /**
   * 删除 sessionStorage localStorage
   */
  Vue.prototype.__removeItem = (name, type = 'sessionStorage') => {
    checkStorage(name, type)
    return type === 'sessionStorage'
      ? window.sessionStorage.removeItem(name)
      : window.localStorage.removeItem(name)
  }
  /**
 * Example
 * let array =[
 *    { name: 'zhangsan', age: '20'}
 *    { name: 'lisi', age: '23'}
 *  ]
 * 根据 filed = zhangsan， array = array， attr = name , 能把array[0] 的数据返回
 * @param {String} filed
 * @param {Array} array
 * @param {String} attr
 */

  Vue.prototype.globalCheckFiledExistInArray = (filed, array, attr) => {
    if (!checkfiled(filed, array)) {
      return
    }
    for (const item of array) {
      if (!item[attr]) {
        console.error('attr 不存在 object 中')
      }
      if (item[attr] === filed) {
        return item
      }
    }
  }

  /**
 * 通过属性动态深层取对象的值
 * entity: {
        id: '1',
        attributes: {
          host: 'www.baidu.com',
        }
    },
  * @param {String} filed 一级需要传入字符串 "id" 二级的话：需要传入字符串 "attributes.host" 以此类
  * @param {Object} obj
  * 动态取 entiry['id'] 或者 entiry['attributes']['host']
  */
  Vue.prototype.globalDynamicValue = (filed, obj) => {
    const key = filed.split('.')
    // 声明临时变量
    var tmp = obj
    // 循环 key 知道多少层级
    for (const value of key) {
      tmp = tmp[value]
    }
    return tmp
  }
  /**
  * 判断一个值，是否是对象指定属性的值
  * @ value 要对比的值
  * @array 查找的数组对象
  * @attr 要在 object 中和哪个属性的值做比较
  */
  Vue.prototype.deleteObject = (value, array, attr) => {
    const key = []
    let i = 0
    checkfiled(value, array)
    array.forEach((item, index) => {
      if (!item[attr]) {
        console.error('attr 不存在 object 中')
      }
      if (item[attr] === value) {
        key.push(index)
      }
    })
    key.forEach((j) => {
      array.splice(j - i, 1)
      i++
    })
  }
  /**
  * 判断一个字符串在一个数组对象中是否是某一个对象属性的值
  * @filed 要对比的字段
  * @array 查找的数组对象
  * @attr 要在 object 中和哪个属性的值做比较
 */
  Vue.prototype.isExist = (filed, array, attr) => {
    checkfiled(filed, array)
    return array.every((value) => {
      if (value[attr] === filed) {
        return false
      }
      return true
    })
  }

  // 表单验证
  Vue.prototype.globalRuleForm = (vue, formName) => {
    var status = false
    vue.$refs[formName].validate((valid) => {
      if (valid) {
        vue.$emit('event')
        status = true
      } else {
        status = false
      }
    })
    return status
  }
  // 清空验证
  Vue.prototype.globalResetForm = (vue, formName) => {
    vue.$refs[formName].resetFields()
  }
}
