"use strict";

var initPaths = {
  topWave: "M-12,348.3c12-8.7,36.3-30,76.3-23.6c40.3,0.7,103.2,17.6,152.5-15.8c26.1-17.7,48.5-49.6,61.5-105.6	c9.3-40,34.7-55.3,41.7-55.3s67.5-16.1,64.3-65.8C381,30,263.7-174.7,196-187c-17.7-5.7-32.3,15.3-41.7,55.3	c-13.1,56-35.4,87.9-61.5,105.6C43.5,7.3-19.4-9.7-59.7-10.3c-47.3-0.8-50.7,29.7-52.4,53C-113.7,64.9-96.4,229-82.3,275C-64.3,334-33.3,364.3-12,348.3z",
  botWave: "M0,521.6c61.5,4.4,76.9-47.4,157.4-34.4c95.3,15.4,150.5-9,168.9-57.7c15.6-41.3,32.1-271.6,20.1-316.6	c-8.1-30.3-29-18.2-29-18.2s-32.5,24.5-50.7,61.3c-27.9,56.6-35.3,79.3-78.5,103.1c-52.2,28.7-79.5,4.8-123.5,3.3	c-47.3-1.6-67.7,10-85.3,30c-25.5,29-42,53.8-41.5,94.8c0.3,28.8-2.6,82.6,7,113C-53.6,505-71.7,516.5,0,521.6z"
};
var dragPaths = {
  topWave: "M-10.5,342c42.5-4.5,43-26.5,77-19.5c39.5,8.1,187.2,137.3,236.5,104c36.1-24.4-22-132.5-21-207.5	c0.5-41.1,31-71,38-71s67.5-16.1,64.3-65.8C381,30,263.7-174.7,196-187c-17.7-5.7-32.3,15.3-41.7,55.3c-13.1,56,47.8,171,21.7,188.7	C126.7,90.4-19.4-9.7-59.7-10.3c-47.3-0.8-50.7,29.7-52.4,53C-113.7,64.9-96.4,229-82.3,275C-64.3,334-57.3,347-10.5,342z",
  botWave: "M0,531.5c28.7-60.7,160.8-38.1,217.7-6.8c74,40.7,80,70,116,55.3c38.8-15.8,30.3-409.5,18.3-454.5c-8.1-30.3-29-18.2-29-18.2s-32.5,24.5-50.7,61.3C244.5,225.2,296.2,295.3,253,319c-52.2,28.7-138.7-42.5-182.7-44	C23,273.4,2.6,285-15,305c-25.5,29-25.5,70-25,111c0.3,28.8,15.4,119.6,25,150C-13.5,570.8,0,531.5,0,531.5z"
};

var dragParams = {
  maxDrag: 160 // y distance
};

var newDragTL = function newDragTL() {
  var tLine = new TimelineMax();
  tLine.to("#pTop", 1, {
    morphSVG: dragPaths.topWave
  }).to("#pBot", 1, {
    morphSVG: dragPaths.botWave
  }, "-=1");
  tLine.pause();
  return tLine;
};

var adjustDrag = function adjustDrag(curY, maxDrag, timeLine) {
  if (curY <= 0) curY = 0;
  var progress = curY / maxDrag;
  timeLine.progress(progress);
};

var tweenBack = function tweenBack() {
  TweenMax.to("#pTop", 0.4, {
    morphSVG: initPaths.topWave,
    ease: Elastic.easeOut.config(1.2, 0.4)
  });
  TweenMax.to("#pBot", 0.4, {
    morphSVG: initPaths.botWave,
    ease: Elastic.easeOut.config(1.2, 0.4)
  });
};

var tweenForward = function tweenForward() {
  var curTL = new TimelineMax();
  var step1 = 0.2,
      step2 = 0.2,
      step3 = 0.7;
  curTL.to("#pTop", step1, {
    x: 160, y: 600
  }).to("#pBot", step1, {
    x: 160, y: 600
  }, "-=" + step1).set("#pTop", {
    x: -160, y: -600
  }).set("#pBot", {
    x: -160, y: -600
  }).to("#pBot", step2, {
    x: 0, y: 0
  }).to("#pTop", step2, {
    x: 0, y: 0
  }, "=-" + step2 * 0.99).to("#pBot", step3, {
    morphSVG: initPaths.botWave,
    ease: Elastic.easeOut.config(1.2, 0.4)
  }, "-=" + step2).to("#pTop", step3, {
    morphSVG: initPaths.topWave,
    ease: Elastic.easeOut.config(1.2, 0.4)
  }, "-=" + step3);
};

var texts = {
  counter: 0,
  objects: [$(".text-1"), $(".text-2"), $(".text-3")],
  next: function next() {
    var _this = this;

    this.objects[this.counter].removeClass("fadeIn").addClass("hide");
    if (++this.counter > 2) this.counter = 0;
    setTimeout(function () {
      _this.objects[_this.counter].removeClass("hide").addClass("fadeIn");
    }, 200);
  }
};

$(document).on("mousedown touchstart", ".slider", function (e) {
  var startY = e.pageY || e.originalEvent.touches[0].pageY;
  var curDy = 0;
  var dragTL = newDragTL();

  $(document).on("mousemove touchmove", function (e) {
    e.preventDefault();
    var curY = e.pageY || e.originalEvent.touches[0].pageY;
    curDy = curY - startY;
    adjustDrag(curDy, dragParams.maxDrag, dragTL);
  });

  $(document).on("mouseup touchend", function (e) {
    $(document).off("mousemove touchmove mouseup touchend");
    if (curDy < dragParams.maxDrag) {
      tweenBack();
    } else {
      tweenForward();
      texts.next();
    }
  });
});

TweenMax.to("#pTop", 1, {
  morphSVG: dragPaths.topWave
});
TweenMax.to("#pBot", 1, {
  morphSVG: dragPaths.botWave
});

TweenMax.to("#pTop", 0.4, {
  morphSVG: initPaths.topWave,
  ease: Elastic.easeOut.config(1.2, 0.4),
  delay: 1.2
});
TweenMax.to("#pBot", 0.4, {
  morphSVG: initPaths.botWave,
  ease: Elastic.easeOut.config(1.2, 0.4),
  delay: 1.2
});