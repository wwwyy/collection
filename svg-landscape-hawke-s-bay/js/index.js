// Great animation script from @gryghostvisuals
// - adding this script makes me realise how messy the svg output was.

var tmax_opts = {
  delay: 0.5,
  repeat: -1,
  repeatDelay: 0.5,
  yoyo: true
};

var tmax_tl           = new TimelineMax(tmax_opts),
    polyland_shapes   = $('svg.landscape polygon'),
    polyland_stagger  = 0.00475,
    polyland_duration = 1.5;

CSSPlugin.useSVGTransformAttr = true; // Thanks Jack Doyle@GreenSock for the tip!

var polyland_staggerFrom = {
  scale: 0,
  opacity: 0,
  transformOrigin: 'center center',
  ease: Elastic.easeInOut,
  force3D: true
};

var polyland_staggerTo = {
  opacity: 1,
  scale: 1,
  ease: Elastic.easeInOut,
  force3D: true
};

tmax_tl.staggerFromTo(polyland_shapes, polyland_duration, polyland_staggerFrom, polyland_staggerTo, polyland_stagger, 0);