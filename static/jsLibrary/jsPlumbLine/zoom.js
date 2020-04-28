import {addWheelEvent} from './util'
	/*以鼠标位置为中心的滑轮放大功能*/
export default (nodeId, callback) => {
	var size = 1;
	let parentNode = nodeId.parentNode;
	addWheelEvent(parentNode, function(delta) {
		if (delta) {
			size += 0.01;
			size = size > 3 ? 3 : size
		}else {
			size -= 0.01;
			size = size < 0.3 ? 0.3 : size
		}
	
		// var ratioL = (this.clientX - nodeId.offsetLeft) / nodeId.offsetWidth,
		// ratioT = (this.clientY - nodeId.offsetTop) / nodeId.offsetHeight;


		$(nodeId).css({
			"transform": `scale(${size})`,
			// "transform-origin": `${ratioL* 100}% ${ratioT * 100}%`,
		})

		callback(size)
	});
}