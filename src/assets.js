import leveldat from '../assets/level.dat';
import sprites from '../assets/sprites.png';

export function LevelData(buff) {

  buff = new Uint16Array(buff);
  let w = buff[0],
      h = buff[1],
      _rs = w * h;

  let res = [];
  let col_idx = 0;
  let i = 2;

  while (i < buff.length) {
    i++;
    let coords = [];
    while(i < buff.length && buff[i] < _rs) {
      coords.push([
        buff[i]%w, Math.floor(buff[i]/w)
      ]);
      i++;
    }
    res.push(coords);
  }

  this.width = w;
  this.height = h;
  this.res = res;
}

function image(path) {
  let res = new Image();
  return new Promise(resolve => {
    res.onload = function() {
      resolve(res);
    };
    res.src = path;
  });
}

export default function Assets() {
  return Promise.all([
    image(sprites),
    fetch(leveldat)
      .then(res => res.blob())
      .then(blob => blob.arrayBuffer())
      .then(buf => new LevelData(buf))
  ]).then(([sprites, level]) => {
    return {
      sprites,
      level
    };
  });
}



