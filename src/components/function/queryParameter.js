var fieldObject = function () {
    var object = {
        fieldName: '',
        fieldValue: '',
        comparatorOperator: 'EQUAL',  //value:{EQUAL, NOT_EQUAL, LIKE, LIKE_IGNORE_CASE, BETWEEN, GREATER_THAN, LESS_THAN, IN}
        logicalOperator: 'AND' // AND OR
    }
    return object;
}
var getQueryObject = function () {
    var object = {
        fieldList: [],
        sortObject: {
            field: 'lastModifiedTime',
            orderDirection: 'DESC', //value:{ ASC, DESC }
        },
        offset: 0,
        limit: 8,
    }
    return object;
}

/************** export method *******************/
export const queryObject = () => {
    return getQueryObject();
};

export function createParameter(fieldName, fieldValue, comparatorOperator, logicalOperator = 'AND') {
    var fieldList = [];
    var queryObject = getQueryObject();
    var fb = fieldObject();

    if(fieldName && fieldName != null || comparatorOperator && comparatorOperator != null) {
        fb.fieldName = fieldName;
        fb.fieldValue = fieldValue;
        fb.comparatorOperator = comparatorOperator;
        fb.logicalOperator = logicalOperator
        fieldList.push(fb);
    }
    var obj = {
        And: function (fieldName, fieldValue, comparatorOperator, logicalOperator) {
            fb = fieldObject();
            fb.fieldName = fieldName;
            fb.fieldValue = fieldValue;
            fb.comparatorOperator = comparatorOperator;
            fb.logicalOperator = logicalOperator;
            fieldList.push(fb);
            return obj;
        },
        Sort: function (field, orderDirection) {
            queryObject.sortObject.field = field;
            queryObject.sortObject.orderDirection = orderDirection;
            return obj;
        },
        Offset: function (offset) {
            queryObject.offset = offset;
            return obj;
        },
        Limit: function (limit) {
            queryObject.limit = limit;
            return obj;
        },
        GroupBy:function(fileName){
            queryObject.groupBy=fileName;
            return obj;
        },
        /**
         *
         * @param object queryObject对象
         * @param paramValue boolean类型，true|null:使用参数里的limit,offset,sort,groupBy; false:使用新定义的limit,offset,sort,groupBy
         * @returns {*}
         * @constructor
         */
        Build: function (object,paramValue) {
            if (!object || object == null) {
                queryObject.fieldList = fieldList;
                return queryObject;
            } else {
                if(paramValue === false) {
                    queryObject.fieldList = fieldList;
                    for (var li in object.fieldList) {
                        queryObject.fieldList.push(object.fieldList[li])
                    }
                    return queryObject;
                } else {
                    for (var li in fieldList) {
                        object.fieldList.push(fieldList[li])
                    }
                    return object;
                }
            }
        }
    }
    return obj;
}
