appr = (val, target, max) => {
  return val < target ?
    Math.min(val + max, target) :
    Math.max(val - max, target);
};

lerp = (t, src, target) => {
  return (1-t) * src + target * t;
};

inters = (r1, r2) => {

  return !(r1[0] > r2[0] + r2[2] ||
           r2[0] > r1[0] + r1[2] ||
           r1[1] > r2[1] + r2[3] ||
           r2[1] > r1[1] + r1[3]);
};
