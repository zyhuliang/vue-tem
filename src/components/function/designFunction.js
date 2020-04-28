/**
 * ------------------------------------------------------------------
 * design 函数
 * ------------------------------------------------------------------
 */

/**
 * steps根据对象name || x || y 过滤数组重复数据
 * ------------------------------------------------------------------
 */
export function stepsFilterObj(objcArray){
    for (var i = 0; i < objcArray.length; i++) {
        for (var j =i+1; j <objcArray.length; ) {
            if (objcArray[i].id == objcArray[j].id) {
                objcArray[i].x = objcArray[j].x;
                objcArray[i].y = objcArray[j].y;
                objcArray.splice(j, 1); //去除重复的对象；
            }else {
                j++;
            }
        }
    }
    return objcArray;
}
/**
 * 双点连接双点，steps根据对象id，fields过滤数组重复数据
 * ------------------------------------------------------------------
 */
export function lStepsFilterObj(lStepsArray){
    for (var i = 0; i < lStepsArray.length; i++) {
        for (var j =i+1; j <lStepsArray.length; ) {
            if (lStepsArray[i].name == lStepsArray[j].name) {
                lStepsArray[i].fields = lStepsArray[j].fields;
                lStepsArray.splice(j, 1); //去除重复的对象；
            }else {
                j++;
            }
        }
    }
    return lStepsArray;
}

/**
 * 对象获取keys
 * ------------------------------------------------------------------
 */
export function displayProp(obj){
    var keys = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p))
            keys.push(p);
    }
    return keys;
}

/**
 *
 * JSON排序 按照属性值排序
 * ------------------------------------------------------------------
 */
export function createComparisonFunction(propertyName) {//接收属性名
    return function(object1) {
        var value1 = object1[propertyName];

        //制定比较规则
        if (value1 == "IO") {
            return -8;
        }  else if (value1 == "Gateway") {
            return -7;
        } else if (value1 == "Transform") {
            return -6;
        } else if(value1 == "Datamining"){
            return -5;
        } else if(value1 == "Group"){
            return -4;
        }else if(value1 == "mapping"){
            return -3;
        }else if(value1 == "Set"){
            return -2;
        }else if(value1 == "Join"){
            return -1;
        }else {
            return 0;
        }
        
    }
}