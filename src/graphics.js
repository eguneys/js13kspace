export default function Graphics(element, sprites) {
  let canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  canvas.width = 320;
  canvas.height = 180;
  element.appendChild(canvas);

  this.cls = () => {
    ctx.clearRect(0, 0, 320, 180);
  };

  this.ctx = fn => fn(ctx);

  this.color = (color) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
  };

  this.fr = (x, y, w, h) => {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    
    ctx.fillRect(x, y, w, h);
  };

  this.r = (x, y, w, h) => {
    x = Math.round(x);
    y = Math.round(y);

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
  };


  this.spr = (dx, dy, sx, sy, sw, sh, flipH, flipV) => {
    dx = Math.round(dx);
    dy = Math.round(dy);

    ctx.save();

    ctx.translate(dx, dy);
    
    if (flipH) {
      ctx.translate(sw, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(sprites, sx, sy, sw, sh, 0, 0, sw, sh);
    ctx.restore();
  };
}
