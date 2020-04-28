import Vue from 'vue'
  Vue.directive('infoRectSelect', {
    bind (el, binding) {
      // 记录鼠标按下时的坐标
      var startX = 0
      var startY = 0
      // 记录鼠标抬起时候的坐标
      var endX = startX
      var endY = startY
      // 是否需要(允许)处理鼠标的移动事件,默认识不处理
      var select = false
      var rect = $(el.querySelector('.rect'))
      var elementDom = $(el.querySelector('.step-list'))
      rect.css('z-index', '1000000000')
      elementDom.on('mousemove', function (event) {
        /*
    这个部分,根据你鼠标按下的位置,和你拉框时鼠标松开的位置关系,可以把区域分为四个部分,根据四个部分的不同,
    我们可以分别来画框,否则的话,就只能向一个方向画框,也就是点的右下方画框.
    */
        if (select) {
        // 取得鼠标移动时的坐标位置
          endX = event.clientX - 200
          endY = event.clientY - 50
          // 设置拉框的大小
          rect.width(Math.abs(endX - startX))
          rect.height(Math.abs(endY - startY))
          rect.css('display', 'block')
          // A part
          if (endX < startX && endY < startY) {
            rect.css('left', endX)
            rect.css('top', endY)
          }
          // B part
          if (endX > startX && endY < startY) {
            rect.css('left', startX)
            rect.css('top', endY)
          }
          // C part
          if (endX < startX && endY > startY) {
            rect.css('left', endX)
            rect.css('top', startY)
          }
          // D part
          if (endX > startX && endY > startY) {
            rect.css('left', startX)
            rect.css('top', startY)
          }
          /*
        这两句代码是最重要的,没有这两句代码,你的拉框,就只能拉框,在鼠标松开的时候,
        拉框停止,但是不能相应鼠标的mouseup事件.那么你想做的处理就不能进行.
        这两句的作用是使当前的鼠标事件不在冒泡,也就是说,不向其父窗口传递,所以才可以相应鼠标抬起事件,
        这两行代码是拉框最核心的部分.
        */
          window.event.cancelBubble = true
          window.event.returnValue = false
        }
      })

      elementDom.on('mousedown', function (event) {
        rect.attr('style', 'position: absolute; background-color: rgb(195, 213, 237);opacity:0.6;border: 1px dashed rgb(0, 153, 255);')
        rect.empty()
        // 鼠标按下时才允许处理鼠标的移动事件
        select = true
        // 取得鼠标按下时的坐标位置
        startX = event.offsetX
        startY = event.offsetY

        // 设置你要画的矩形框的起点位置
        rect.offset().left = startX
        rect.offset().top = startY
      })

      elementDom.on('mouseup', function (event) {
        select = false
        var rectItems = []
        var childs = elementDom.children('.step-item')
        // 获取 rect 的 范围 left top right bottom
        var [rectLeft, rectTop] = [rect.offset().left, rect.offset().top]
        var [rectRight, rectBottom] = [rectLeft + rect.width(), rectTop + rect.height()]
        $('#rect').css('display', 'block')
        for (var i = 0; i < childs.length; i++) {
          var child = $(childs[i])
          var [childLeft, childTop] = [child.offset().left, child.offset().top]
          var [childRight, childBottom] = [childLeft + child.width(), childTop + child.height()]
          if (childLeft > rectLeft && childTop > rectTop && childRight < rectRight && childBottom < rectBottom) {
            rectItems.push(childs[i])
          }
        }
        console.log(rectItems)
      })
      console.log(binding)
    }
  })
