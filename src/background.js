import { starFx } from './fxs';

export default function Bg(room, g, w, h) {

  let target;

  let objs = [];

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 12; i++) {
      let y = ((j-1)/2) * h - Math.random() * 30,
          x = ((i-1)/12) * w + Math.random() * 20;

      objs.push([x, y, Math.floor(Math.random()*5),
                 Math.random()< 0.5, Math.random()< 0.5]);
    }
  }

  this.follow = _target => {
    target = _target;
  };

  this.update = dt => {
    if (Math.random()< 0.1) {
    room.fx(starFx(g),
            target[0] - 160 + 320 * Math.random(),
            target[1] - 90 + 180 * Math.random(), 0, 0);
    }
  };

  this.draw = () => {
    objs.forEach(_ => {
      if (_[0] > target[0]-640/0.2 &&
          _[0] < target[0] + 640 / 0.2) {
        g.spr(_[0], _[1], 352 + _[2] * 16, 32, 16, 16, _[3], _[4], _[4]?20:10);
      }
    });
  };
  
}
