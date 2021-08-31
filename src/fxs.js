import Anim8 from './anim8';

export function starFx(g) {

  return new Anim8(g,
                   [7, 12, 24, 48],
                   0, 0, [ticks.sixth,
                          ticks.sixth,
                          ticks.sixth], [
                            1,
                            0,
                            -1], [
                              0,
                              -1,
                              0]);
}

export function slashFx(g) {
  return new Anim8(g,
                   [89, 32, 0, 97],
                   0, 0, [ticks.three,
                          ticks.sixth/2,
                          ticks.sixth/2,
                          ticks.lengths], [
                            0,
                            -4,
                            4,
                            2
                          ], [
                            0,
                            2,
                            -2,
                            0
                          ]);
}

export function group(ctx, room, makefx, facing) {
  let iss;
  let x, y;
  this.init = (_x, _y) => {
    iss = [];
    x = _x;
    y = _y;

    for (let i = 0; i < 10; i++) {
      let angle = Math.random() * Math.PI * 2;
      iss.push(makefx(ctx, room,
                      x + Math.cos(angle) * 10,
                      y + Math.sin(angle) * 10,
                      facing));
    }
    
  };

  this.update = dt => {
    iss = iss.filter(_ => _.update(dt));

    if (iss.length === 0) {
      room.remove(this);
    }
  };

  this.draw = () => {
    iss.forEach(_ => _.draw());
  };
}

export const makeBlood = (ctx, room, x, y, facing) => {
  let res = new blood(ctx, room);
  res.init(x, y, facing);
  return res;
};

export function blood(ctx, room) {

  let { g, a } = ctx;

  let dx, dy, x, y,
      l, rate,
      dir;
  this.init = (_x, _y, _dir) => {
    x = _x;
    y = _y;
    l = ticks.half + Math.random() * ticks.half;
    rate = 1 + Math.random() * 2;
    dx = _dir * Math.random() * 2 - 1 * _dir;
    dy = _dir * Math.random() * 2 - 1 * _dir;
    dir = _dir;
  };

  this.update = dt => {
    l = appr(l, 0, dt);

    dx = appr(dx, dir, dt * rate);
    dy = appr(dy, dir, dt * rate);
    
    x = x + dx * l;
    y = y + dy * l;
    
    if (l === 0) {
      return false;
    }
    return true;
  };

  this.draw = () => {
    let color = l > ticks.half?colors.red:l>ticks.half * 0.5?colors.darkred:colors.light;
    g.color(color);
    g.fr(x, y, l * 16 * Math.sin(rate), l * l * 8 * rate * Math.cos(rate));
  };
  
}
