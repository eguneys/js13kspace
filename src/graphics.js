export default function Graphics(element) {
  let canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  canvas.width = 320;
  canvas.height = 180;
  element.appendChild(canvas);

  this.cls = () => {
    ctx.clearRect(0, 0, 320, 180);
  };

  this.color = (color) => {
    ctx.fillStyle = color;
  };

  this.fr = (x, y, w, h) => {
    x = Math.round(x);
    y = Math.round(y);
    
    ctx.fillRect(x, y, w, h);
  };
}
