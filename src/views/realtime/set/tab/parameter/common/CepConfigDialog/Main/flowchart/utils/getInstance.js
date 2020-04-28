// import plumbGather from "jsplumb";

export default function(options) {
	// let instance = plumbGather.jsPlumb.getInstance({
	//   Container: options.container
	// });

	//console.log('初始化 jsplumb instance');

	let instance = options.jsPlumb.getInstance({
		// ConnectionOverlays: [ [ 'Label', { label: 'FOO', id: 'label', cssClass: 'aLabel' } ] ],
		ConnectionOverlays: [ [ 'Label', { id: 'label', cssClass: 'aLabel' } ] ],
		Container: options.container
	});

	instance.bind('click', function(c) {
		//console.log(' instance.bind("click", function(c) {');
		// instance.deleteConnection(c); //instance
		options.delConnections(c, () => {
			//instance.deleteConnection(c); //instance
			instance.detach(c);
		});
	});

	instance.bind('connection', function(c) {
    options.completedConnect(c);
    //  console.log('c.connection connection',c.connection);
	
	});

	instance.bind('connectionDrag', function(c) {
    // console.log("instance.bind('connectionDrag', function(c) {", c);
    // console.log('c.connection connectionDrag',c.connection);
		//connectionDrag
		//c.canvas.classList.add('jtk-connector-path');
		options.connectionDrag(c);
	});

	// 连接线删除时触发
	//instance.bind("connectionDetached", function(c) {});

	return instance;
}
