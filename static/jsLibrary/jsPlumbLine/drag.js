import {addEvent, removeEvent, prevent} from './util'
	/*拖拽功能*/
export default (nodeId) => {
  var oParent = nodeId.parentNode;
  addEvent(oParent, 'mousedown', function(ev) {
    var oEvent = prevent(ev);
    if(oEvent.target.nodeName.toLowerCase() === 'input'){ //如果目标元素是input则跳出滑动事件
      oEvent.target.focus()
      return;
    }
    // 默认坐标的位置
   var disX = oEvent.clientX - nodeId.offsetLeft,
    disY = oEvent.clientY - nodeId.offsetTop,
    startMove = function(ev) {
      if (oParent.setCapture) {
        oParent.setCapture();
      }
      var oEvent = ev || window.event,
      // 鼠标的位置-默认位置 = 移动的距离
      l = oEvent.clientX - disX,
      t = oEvent.clientY - disY;
      nodeId.style.left = l +'px';
      nodeId.style.top = t +'px';
      oParent.onselectstart = function() {
        return false;
      }
    },
    endMove = function(ev) {
      if (oParent.releaseCapture) {
        oParent.releaseCapture();
      }
      oParent.onselectstart = null;
      removeEvent(oParent, 'mousemove', startMove);
      removeEvent(oParent, 'mouseup', endMove);
    };
    addEvent(oParent, 'mousemove', startMove);
    addEvent(oParent, 'mouseup', endMove);
    return false;
  });
}