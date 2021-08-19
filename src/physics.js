export default function Body(_x, _y, _ox, _oy, _w, _h, f_collide) {

  this.x = _x;
  this.y = _y;

  this.ox = _ox;
  this.oy = _oy;
  this.w = _w;
  this.h = _h;

  this.cbox = [this.x+this.ox,
               this.y+this.oy,
               this.w, this.h];
  
  this.dx = 0;
  this.dy = 0;
  this.remx = 0;
  this.remy = 0;

  this._get_body = () => {
    this.cbox[0] = this.x + this.ox;
    this.cbox[1] = this.y + this.oy;
    this.cbox[2] = this.w;
    this.cbox[3] = this.h;
  };

  this.move = (dt) => {

    this.remx += this.dx * dt;
    let amount = Math.floor(this.remx);
    this._move_x(amount);
    this.remx -= amount;
    
    // this.move_y(amount);
  };

  this._move_x = amount => {
    let step = Math.sign(amount);
    for (let i = 0; i < Math.abs(amount); i++) {
      this.x += step;
      this._get_body();
      if (f_collide(this)) {
        this.x -= step;
        this.dx = 0;
        this._get_body();
        return;
      }
    }
  };
  
  

  this.draw = (g, color) => {
    g.color(color);
    g.fr(this.cbox[0],
         this.cbox[1],
         this.cbox[2],
         this.cbox[3]);
  };
}
