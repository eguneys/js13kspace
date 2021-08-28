//import leveldat from '../assets/level.dat';
import sprites from '../assets/sprites.png';
import levelpng from '../assets/level.png';

// export function LevelData(buff) {

//   buff = new Uint16Array(buff);
//   let w = buff[0],
//       h = buff[1],
//       _rs = w * h;

//   let res = [];
//   let col_idx = 0;
//   let i = 2;

//   while (i < buff.length) {
//     i++;
//     let coords = [];
//     while(i < buff.length && buff[i] < _rs) {
//       coords.push([
//         buff[i]%w, Math.floor(buff[i]/w)
//       ]);
//       i++;
//     }
//     res.push(coords);
//   }

//   this.width = w;
//   this.height = h;
//   this.res = res;
// }

export function LevelData(image) {

  const colors = [
    '#754665',
    '#ff6e59',
    '#f3ef7d',
    '#ffccaa',
    '#7e2553',
    '#ff004d',
    '#fff1e8'
  ];

  const rgbtostring = (color) => {
    const atohex = a => (a.toString(16).length === 1 ? '0':'')+a.toString(16);
    return `#` + color.slice(0,3).map(_ => atohex(_)).join('').toLowerCase();
  };

  
  let canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

  this.width = image.width/ 4;
  this.height = image.height / 4;
  this.res = colors.map(_ => []);
  
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);

  let { data } = ctx.getImageData(0, 0, image.width, image.height);

  for (let y = 0; y < image.height; y+=4) {
    for (let x = 0; x < image.width; x+=4) {
      let idx = (image.width * y + x) << 2;

      let color = [data[idx],
                   data[idx+1],
                   data[idx+2],
                   data[idx+3]];

      let idx_color = colors.indexOf(rgbtostring(color));
      if (idx_color !== -1) {
        this.res[idx_color].push([x/4, y/4]);
      }
    }
  }
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
    image(levelpng)
      .then(level =>
        new LevelData(level))
    // fetch(leveldat)
    //   .then(res => res.blob())
    //   .then(blob => blob.arrayBuffer())
    //   .then(buf => new LevelData(buf))
  ]).then(([sprites, level]) => {
    return {
      sprites,
      level
    };
  });
}



