export function GridO(celw, celh, nbtilesx, nbtilesy) {
  let width = nbtilesx * celw,
      height = nbtilesy * celh;

  this.data = [];

  this.all = () => this.data;

  
}

export default function Grid(celw, celh, nbtilesx, nbtilesy) {

  let width = nbtilesx * celw,
      height = nbtilesy * celh;

  this.data = new Map();

  this.all = () => {
    return this.data.values();
  };

  this.collide = (x, y, w, h) => {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (this.get(x+i,y+j)) {
          return true;
        }
      }
    }
    return false;
  };
  
  this.get = (x_w, y_w, value) => {
    let [x, y] = [Math.floor(x_w/celw), Math.floor(y_w/celh)];
    if (value !== undefined) {
      this.data.set(y * width + x, value);
    }
    return this.data.get(y * width + x);
  };

  this.draw = (g) => {
    for (let i = 0; i < nbtilesx; i++) {
      for (let j = 0; j < nbtilesy; j++) {
        let t = this.get(i*celw, j*celh);
        if (t) {
          g.color(t);
          g.fr(i * celw, j * celh, celw, celh);
        }
      }
    }
  };
  
}