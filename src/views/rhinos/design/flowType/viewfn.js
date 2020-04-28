
/**
             * design设计器
             * ------------------------------------------------------------------
             */
            export function design() {
                //标志元素唯一性
                var elementSign = 0;
                var _this = this;
                var _that = jsPlumb;
                jsPlumb.ready(function() {
                    $("#right").children().find(".designIcon").draggable({
                        helper: "clone",
                        scope: "ss",
                        zIndex: 10
                    });
                    $("#designMain").droppable({
                        scope: "ss",
                        drop: function (event, ui) {//在目标(target)容器上释放鼠标 ,ui.draggable[0]为开始拖拽的元素
                            var type = $(ui.helper)[0].dataset.type;
                            if(type !== 'definestep' || type =='undefined'){
                                //流程节点
                                _that.setContainer($("#designMain"));
                                var randomId = createRandomId();
                                var left = parseInt(ui.offset.left - $(this).offset().left) + $(this).scrollLeft(); //添加左侧滚动条的距离
                                var top = parseInt(ui.offset.top - $(this).offset().top) + $(this).scrollTop(); //添加右侧滚动条的距离
                                var type = $(ui.helper)[0].dataset.type;
                                var name = ($(ui.helper)[0].textContent).replace(/ /g,'');
                                if(nodeIcon(type) == "iconTrue"){
                                    var iconType = type
                                }else {
                                    var iconType = "default"
                                }
                                
                                var ele = $('<div class="designIconBig t2Style" data-sign="'+ name + "_" + randomId + '" data-index="'+ type + "_" +  randomId + '"  data-type="' + type + '">' +
                                    '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-'+iconType+'"></i><h4 title="'+name+'_'+randomId+'">'+name+'_'+randomId+'</h4><h5>ID:'+type+'_'+randomId+'</h5><em id="pitchOnDes" class="fa fa-square-o" title="选中"></em><em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em><em id="removeDes" class="fa fa-trash-o" title="删除"></em>'+'</div>'+ '</div>');
                                if (nodeClass(type) == "classD_A"){
                                    var ele = $('<div class="designIconBig t1Style" data-sign="'+ name + "_" + randomId + '" data-index="'+ type + "_" +  randomId + '"  data-type="' + type + '">' +
                                        '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-'+iconType+'"></i><h4 title="'+type+'_'+randomId+'">'+name+'_'+randomId+'</h4><h5>ID:'+type+'_'+randomId+'</h5><em id="pitchOnDes" class="fa fa-square-o" title="选中"></em><em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em><em id="removeDes" class="fa fa-trash-o" title="删除"></em>'+'</div>'+ '</div>');
                                    _that.addEndpoint(ele, {anchors: "RightMiddle",maxConnections: -1}, origin);//起点
                                }else if(nodeClass(type) == "classD_B"){
                                    var ele = $('<div class="designIconBig t3Style" data-sign="'+ name + "_" + randomId + '" data-index="'+ type + "_" +  randomId + '"  data-type="' + type + '">' +
                                        '<div><i class="icon iconfont icon-ir-designIconBg designIconBg"></i><i id="changeSte" class="icon iconfont icon-ir-d-'+iconType+'"></i><h4 title="'+type+'_'+randomId+'">'+name+'_'+randomId+'</h4><h5>ID:'+type+'_'+randomId+'</h5><em id="pitchOnDes" class="fa fa-square-o" title="选中"></em><em id="copeDes" class="icon iconfont icon-ir-copy" title="复制"></em><em id="removeDes" class="fa fa-trash-o" title="删除"></em>'+'</div>'+ '</div>');
                                    _that.addEndpoint(ele, {anchors: "LeftMiddle"}, destination);
                                }else if(nodeClass(type) == "classD_C" || nodeClass(type) == "classW_C") {
                                    _that.addEndpoint(ele, {anchors: "RightMiddle", maxConnections: -1}, origin);//起点
                                    _that.addEndpoint(ele, {anchors: "LeftMiddle", maxConnections: -1}, destination);//终点
                                }else if(specialNodeClass(type) == "classD_D1"){
                                    _that.addEndpoint(ele, {anchors: [1, 0.3, 0, 0],maxConnections: -1, overlays:[["Label", {location:[1.5, -0.5],label:"yes",cssClass:"endpointSourceLabel"}]]}, origin);
                                    _that.addEndpoint(ele, {anchors: [1, 0.7, 0, 0],maxConnections: -1, overlays:[["Label", {location:[1.5, 1.3],label:"no",cssClass:"endpointSourceLabel"}]]}, origin);
                                    _that.addEndpoint(ele, {anchors: "LeftMiddle"}, destination);//终点
                                }else if(specialNodeClass(type) == "classD_D2"){
                                    _that.addEndpoint(ele, {anchors: [1, 0.3, 0, 0],maxConnections: -1, overlays:[["Label", {location:[1.5, -0.5],label:"ok",cssClass:"endpointSourceLabel"}]]}, origin);
                                    _that.addEndpoint(ele, {anchors: [1, 0.7, 0, 0],maxConnections: -1, overlays:[["Label", {location:[1.5, 1.3],label:"error",cssClass:"endpointSourceLabel"}]]}, origin);
                                    _that.addEndpoint(ele, {anchors: "LeftMiddle"}, destination);//终点
                                }else if(specialNodeClass(type) == "classD_E1"){
                                    _that.addEndpoint(ele, {anchors: "RightMiddle",maxConnections: -1}, origin);
                                    _that.addEndpoint(ele, {anchors: [0, 0.3, 0, 0] , overlays:[["Label", {location:[-1, -0.5],label:"left",cssClass:"endpointSourceLabel"}]]}, destination);
                                    _that.addEndpoint(ele, {anchors: [0, 0.7, 0, 0] , overlays:[["Label", {location:[-1, 1.5],label:"right",cssClass:"endpointSourceLabel"}]]}, destination);
                                }else if(specialNodeClass(type) == "classD_E2"){
                                    _that.addEndpoint(ele, {anchors: "RightMiddle",maxConnections: -1}, origin);
                                    _that.addEndpoint(ele, {anchors: [0, 0.3, 0, 0] , overlays:[["Label", {location:[-1, -0.5],label:"input1",cssClass:"endpointSourceLabel"}]]}, destination);
                                    _that.addEndpoint(ele, {anchors: [0, 0.7, 0, 0] , overlays:[["Label", {location:[-1, 1.5],label:"input2",cssClass:"endpointSourceLabel"}]]}, destination);
                                }else {
                                    _that.addEndpoint(ele, {anchors: "RightMiddle",maxConnections: -1}, origin);//起点
                                    _that.addEndpoint(ele, {anchors: "LeftMiddle"}, destination);//终点
                                }
                                ele.css({"left": left, "top": top, position: "absolute", margin: 0});
                                //_that.draggable(ele, {containment: "parent"});//端点可以拖动设置,并且将端点限制在父级内
                                $(this).append(ele);
                                jsPlumb.repaintEverything();
                                _that.draggable(ele);
                                ele.draggable({
                                    containment: $("#designMain")
                                });
                                if($("#designMain").find(".designIconBig").length == 0){
                                    _this.designStepLength ="";
                                }else{
                                    _this.designStepLength = $("#designMain").find(".designIconBig").length;
                                }
                                //参数声明 引用读取
                                _this.flowSet.inputs = false;
                                _this.flowSet.outputs = false;
                                $("#designMain").find(".designIconBig").each(function () {
                                    var dataType = $(this).attr("data-type");
                                    if(nodeQuote(dataType) === 'quoteA'){
                                        _this.flowSet.quoteDataInput.push($(this).find("h4").text())
                                        _this.flowSet.inputs = true;
                                    }
                                    if(nodeQuote(dataType) === 'quoteB'){
                                        _this.flowSet.quoteDataOutput.push($(this).find("h4").text())
                                        _this.flowSet.outputs = true;
                                    }
                                    _this.flowSet.quoteDataParameter.push($(this).find("h4").text());
                                })
                                _this.flowSet.quoteDataInput = unique(_this.flowSet.quoteDataInput);
                                _this.flowSet.quoteDataParameter = unique(_this.flowSet.quoteDataParameter);
                                _this.flowSet.quoteDataOutput = unique(_this.flowSet.quoteDataOutput);
                            }else {
                                //自定义流程节点
                                _this.customContentList()
                            }
                        }
                    });
                    jsPlumb.fire("addEndpoint", origin);
                })
            }