
var fieldObject = function () {
  var object = {
    fieldName: '',
    fieldValue: '',
    comparatorOperator: 'EQUAL', // value:{EQUAL, NOT_EQUAL, LIKE, LIKE_IGNORE_CASE, BETWEEN, GREATER_THAN, LESS_THAN, IN}
    logicalOperator: 'AND' // AND OR
  }
  return object
}
var getQueryObject = function () {
  var object = {
    fieldList: [],
    sortObject: {
      field: 'lastModifiedTime',
      orderDirection: 'DESC' // value:{ ASC, DESC }
    },
    offset: 0,
    limit: 8
  }
  return object
}

/** ************ export method *******************/
// var queryObject = () => {
//   return getQueryObject()
// }

exports.install = function (Vue) {
  Vue.prototype.serverApi = async function (options) {
    const config = Object.assign({
      params: undefined,
      successText: '恭喜你，操作成功！！！',
      errorText: '操作失败！！！',
      success () {},
      error () {},
      interface: '',
      tips: false
    }, options)
    if (!config.interface) {
      return console.error('必须输入接口方法')
    }
    try {
      const response = await this.$https[config.interface](config.params)
      if (response.status === 200) {
        // 判断是新接口还是旧接口
        // 通过 data中 没有没有 status 码
        if (response.data.status === undefined) {
          if (config.tips) {
            this.$message({
              showClose: true,
              message: config.successText,
              type: 'success'
            })
          }
          config.success(response.data)
        } else {
          if (response.data.status === 0) {
            if (config.tips) {
              this.$message({
                showClose: true,
                message: config.successText,
                type: 'success'
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: response.data.message,
              type: 'warning'
            })
          }
          config.success(response.data.content)
        }
      } else {
        this.$message({
          showClose: true,
          message: config.errorText,
          type: 'warning'
        })
        config.error(response)
      }
    } catch (err) {
      config.error(err)
    }
  }

  Vue.prototype.createParameter = function (fieldName, fieldValue, comparatorOperator, logicalOperator = 'AND') {
    var fieldList = []
    var queryObject = getQueryObject()
    var fb = fieldObject()

    if ((fieldName && fieldName !== null) || (comparatorOperator && comparatorOperator !== null)) {
      fb.fieldName = fieldName
      fb.fieldValue = fieldValue
      fb.comparatorOperator = comparatorOperator
      fb.logicalOperator = logicalOperator
      fieldList.push(fb)
    }
    var obj = {
      And: function (fieldName, fieldValue, comparatorOperator, logicalOperator) {
        fb = fieldObject()
        fb.fieldName = fieldName
        fb.fieldValue = fieldValue
        fb.comparatorOperator = comparatorOperator
        fb.logicalOperator = logicalOperator
        fieldList.push(fb)
        return obj
      },
      Sort: function (field, orderDirection) {
        queryObject.sortObject.field = field
        queryObject.sortObject.orderDirection = orderDirection
        return obj
      },
      Offset: function (offset) {
        queryObject.offset = offset
        return obj
      },
      Limit: function (limit) {
        queryObject.limit = limit
        return obj
      },
      GroupBy: function (fileName) {
        queryObject.groupBy = fileName
        return obj
      },
      /**
         *
         * @param object queryObject对象
         * @param paramValue boolean类型，true|null:使用参数里的limit,offset,sort,groupBy; false:使用新定义的limit,offset,sort,groupBy
         * @returns {*}
         * @constructor
         */
      Build: function (object, paramValue) {
        if (!object || object === null) {
          queryObject.fieldList = fieldList
          return queryObject
        } else {
          if (paramValue === false) {
            queryObject.fieldList = fieldList
            for (const li in object.fieldList) {
              queryObject.fieldList.push(object.fieldList[li])
            }
            return queryObject
          } else {
            for (const li in fieldList) {
              object.fieldList.push(fieldList[li])
            }
            return object
          }
        }
      }
    }
    return obj
  }
}
