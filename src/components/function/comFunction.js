/**
 * ------------------------------------------------------------------
 * 通用函数
 * ------------------------------------------------------------------
 */

/**
 * 克隆数组
 * ------------------------------------------------------------------
 */

export function copyArr(arr) {
    let res = []
    for (let i = 0; i < arr.length; i++) {
        res.push(arr[i])
    }
    return res
}

/**
 * 克隆对象
 * ------------------------------------------------------------------
 */
export function deepCopy(p, c) {
    var c = c || {};
    for (var i in p) {
        if (!p.hasOwnProperty(i)) {
            continue;
        }
        if (typeof p[i] === 'object') {
            if(typeof p[i].constructor === null){
                return false
            }
            c[i] = (p[i].constructor === Array) ? [] : {};
            deepCopy(p[i], c[i]);
        } else {
            c[i] = p[i];
        }
    }
    return c;
}

/**
 * 数组字符串去重
 * ------------------------------------------------------------------
 */
export function unique(arr){
    // 遍历arr，把元素分别放入tmp数组(不存在才放)
    var tmp = new Array();
    for(var i in arr){
        //该元素在tmp内部不存在才允许追加
        if(tmp.indexOf(arr[i])==-1){
            tmp.push(arr[i]);
        }
    }
    return tmp;
}
/**
 * 判断数组有无重复的值
 * ------------------------------------------------------------------
 */
export function isRepeat(arr){
    var hash = {};
    for(var i in arr) {
        if(hash[arr[i]]) //hash 哈希
        return true;
        hash[arr[i]] = true;
    }
    return false;
}
/**
 * 根据对象name 过滤数组重复数据
 * ------------------------------------------------------------------
 */
export function filterObj(objcArray){
    for (var i = 0; i < objcArray.length; i++) {
        for (var j =i+1; j <objcArray.length; ) {
            if (objcArray[i].name == objcArray[j].name) {
                objcArray.splice(j, 1); //去除重复的对象；
            }else {
                j++;
            }
        }
    }
    return objcArray;
}

/**
 * 根据对象id 过滤数组重复数据
 * ------------------------------------------------------------------
 */
export function filterId(objId){
    for (var i = 0; i < objId.length; i++) {
        for (var j =i+1; j <objId.length; ) {
            if (objId[i].id == objId[j].id) {
                objId.splice(j, 1); //去除重复的对象；
            }else {
                j++;
            }
        }
    }
    return objId;
}

/**
 * 对象转换数组
 * ------------------------------------------------------------------
 */
export function transformArr(obj){
    var arr = [];
    for(var item in obj){
        arr.push(obj[item]);
    }
    return arr;
}

/**
 * 随机生成UUID
 * ------------------------------------------------------------------
 */
export function RandomUuid(uuid) {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("")
}

/**
 *  合并对象
 * ------------------------------------------------------------------
 */
export function extend(target, source) {
    for (var obj in source) {
        target[obj] = source[obj];
    }
    return target;
}

//是否被包含,是返回true,不是返回false
export function isContained(a, b){
    if(!(a instanceof Array) || !(b instanceof Array)) return false;
    if(a.length < b.length) return false;
    var aStr = a.toString();
    for(var i = 0, len = b.length; i < len; i++){
    if(aStr.indexOf(b[i]) == -1) return false;
    }
    return true;
}

// 把秒转成 时分秒
export function formatSeconds (value) {
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if(minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    var result = "" + parseInt(secondTime) + "秒";

    if(minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "分" + result;
    }
    if(hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
    }
    return result;
  }
//生产当前时间戳
  export function createRandomTime() {
    return (new Date()).getTime();
}