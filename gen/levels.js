const path = require('path');
const fs = require('fs');
const PNG = require('pngjs').PNG;

const src = 'level.png',
      dest = '../assets/level.dat';

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

function LevelPush(w, h) {

  let colorpush = colors.map((_, i) => new ColorPush(i));
  
  function ColorPush(idx_color) {
    let view = [w*h + idx_color];

    this.push = (x, y) => {
      let idx = y * w + x;
      view.push(idx);
    };

    this.view = () => view;  
  }

  this.push = (idx_color, x, y) => {
    colorpush[idx_color].push(x, y);
  };

  this.view = () => {
    let res = [w,h];

    colorpush.forEach(push => {
      res = res.concat(push.view());
    });
    return res;
  };
}

fs.createReadStream(path.join(__dirname, src))
  .pipe(new PNG())
  .on('parsed', function() {

    let level_width = this.width / 4,
        level_height = this.height / 4;

    let level_push = new LevelPush(level_width, level_height);

    for (let y = 0; y < this.height; y+=4) {
      for (let x = 0; x < this.width; x+=4) {
        let idx = (this.width * y + x) << 2;

        let color = [this.data[idx],
                     this.data[idx+1],
                     this.data[idx+2],
                     this.data[idx+3]];

        if (x === 4) {
          //console.log(x/4, y/4, idx, this.data[idx]);
        }

        let idx_color = colors.indexOf(rgbtostring(color));
        if (idx_color !== -1) {
          level_push.push(idx_color, x/4, y/4);
        }
      }
    }

    let res = new Uint16Array(level_push.view());
    fs.writeFileSync(path.join(__dirname, dest), res);

    console.log('written', res.length*2, 'bytes');
  });
