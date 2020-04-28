
// 绑定事件 兼容处理
export const addEvent =  (nodeId, eventType, callback) => {
  if (nodeId.addEventListener){
    nodeId.addEventListener(eventType, callback, false);
  }else {
    nodeId.attachEvent('on' + eventType, callback);
  }
}

// 移除事件 兼容处理
export const  removeEvent = (nodeId, eventType, callback) => {
  if (nodeId.addEventListener){
    nodeId.removeEventListener(eventType, callback, false);
  }else {
    nodeId.detachEvent('on' + eventType, callback);
  }
}

// 判断 event 事件对象 不存在
export const prevent = (event) => {
  let e = event || window.event;
  if (e.preventDefault) {
		e.preventDefault();
  }
  return e;
}

// 添加滑轮事件 处理火狐浏览器的兼容性
export const addWheelEvent = (nodeId, callback) => {
  if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
    addEvent(nodeId, 'DOMMouseScroll', wheel);
  } else {
    addEvent(nodeId, 'mousewheel', wheel);
  }
  function wheel(ev) {
    var oEvent = prevent(ev),
    delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
    callback && callback.call(oEvent, delta);
    return false;
  }
}

export const appointElement = (appoint, gather) => {
  gather.forEach((value, index) => {
    if (appoint.source === value.source && appoint.target === value.target) {
      gather.splice(index, 1)
    }
  });
}






