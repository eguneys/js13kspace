import leveldat from '../assets/level.dat';

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

export default function Assets() {
  return Promise.all([
    fetch(leveldat)
      .then(res => res.blob())
      .then(blob => blob.arrayBuffer())
      .then(buf => new LevelData(buf))
  ]).then(([level]) => {
    return {
      level
    };
  });
}



