export default function Grid(celw, celh, nbtilesx, nbtilesy, _a) {

  let width = nbtilesx * celw,
      height = nbtilesy * celh;

  this.data = new Map();

  this.all = () => {
    return this.data.values();
  };

  this.collide = (x, y, w, h) => {
    if (!_a) {
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          if (this.get(x + i, y + i)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  this._getA = (x_w, y_w, value) => {
    let res = this._get(x_w, y_w);
    if (value) {
      if (!res) {
        res = [];
        this._get(x_w, y_w, res);
      }
      this._get(x_w, y_w).push(value);
    }
    return res;
  };
  
  this._get = (x_w, y_w, value) => {
    let [x, y] = [Math.floor(x_w/celw), Math.floor(y_w/celh)];
    if (value !== undefined) {
      this.data.set(y * width + x, value);
    }
    return this.data.get(y * width + x);
  };

  this.get = (x_w, y_w, value) => {
    return _a ? this._getA(x_w, y_w, value):
      this._get(x_w, y_w, value);
  };

  this.remove = (obj) => {
    if (_a) {
      for (let key of this.data.keys()) {
        this.data.set(key,
                      this.data.get(key)
                      .filter(_ => _ !== obj));
      }
    }
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
