     /**
     * 
     * jsPlumb设计器 设置参数
     * ------------------------------------------------------------------
     */
  export var connectorPaintStyle = { //基本连接线样式
        strokeWidth: 2,
        stroke: "#4e5568",
        joinstyle: "round",
        outlineColor: "white",
        outlineWidth: 0
    };
    export var connectorHoverStyle = { // 鼠标悬浮在连接线上的样式
        strokeWidth: 3,
        stroke: "#ff4e4e",
        outlineColor: "white",
        outlineWidth: 0,
    };
    export var origin = {  //起点
        endpoint: ["Dot", {radius: 8}],  //端点的形状
        connectorStyle: connectorPaintStyle,//连接线的颜色，大小样式
        connectorHoverStyle: connectorHoverStyle,
        paintStyle: {
            stroke: "#4e5568",
            fill: "transparent",
            radius: 6,
            lineWidth: 6
        },        //端点的颜色样式
        //anchor: "AutoDefault",
        isSource: true,    //是否可以拖动（作为连线起点）
        connector: ["Flowchart", {stub: [5, 5], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        isTarget: false,    //是否可以放置（连线终点）
        maxConnections: 1,    // 设置连接点最多可以连接几条线,-1表示无限大
        connectorOverlays: [["Arrow", {width: 10, length: 10, location: 1}]]
    };
    export var destination = {     //终点
        endpoint: ["Dot", {radius: 6}],  //端点的形状
        connectorStyle: connectorPaintStyle,//连接线的颜色，大小样式
        connectorHoverStyle: connectorHoverStyle,
        paintStyle: {fill: "#4e5568",},        //端点的颜色样式
        isSource: false,    //是否可以拖动（作为连线起点）
        connector: ["Straight", {stub: [5, 5], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
        isTarget: true,    //是否可以放置（连线终点）
        maxConnections: 1,    // 设置连接点最多可以连接几条线,-1表示无限大
        connectorOverlays: [["Arrow", {width: 10, length: 10, location: 1}]],
    };
    /**
     * 获取steps
     * ------------------------------------------------------------------
     */
    export function getSteps() {
        var steps = [];//存储元素的数组
        $("#designMain .designIconBig").each(function () {
            steps.push({
                id: $(this).attr("data-index"),
                name: $(this).attr("data-sign"),
                type: $(this).attr("data-type"),
                x:$(this).position().left + $("#designMain")[0].scrollLeft,
                y:$(this).position().top + $("#designMain")[0].scrollTop,
                inputConfigurations:[],
                otherConfigurations:{},
                outputConfigurations:[]
            });
        });
        sessionStorage.setItem("steps", JSON.stringify(steps));
    }
    /**
     * 随机时间
     * ------------------------------------------------------------------
     */
    export function createRandomTime() {
        return (new Date()).getTime();
    }
