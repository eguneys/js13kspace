export default function Anim8(g, grid, fx, fy, durations, xoffsets = [], yoffsets = []) {

  this.w = grid[0];
  this.h = grid[1];
  
  let frames = durations.map((_,i) => [
    (grid[2] || 0) + (fx+i) * grid[0],
    (grid[3] || 0) + fy * grid[1],
    grid[0],
    grid[1]
  ]);

  let i = 0,
      ox = 0,
      oy = 0,
      frame = 0;
  this.ri = 0;
  
  function _frame() {
    return frames[frame];
  }

  this.o_x = () => ox;
  this.o_y = () => oy;

  this.is_ok = () => frame < 1;

  this.goto = (_frame) => {
    frame = _frame;
    i = 0;
    ox = 0;
    oy = 0;
    this.ri = 0;
  };
  
  this.update = (dt) => {
    i += dt;
    if (i >= durations[frame]) {
      frame = (frame + 1) % durations.length;
      i=0;
      if (frame === 0) {
        this.ri++;
      }
    }
    ox = lerp(0.3, ox, xoffsets[frame] || 0);
    oy = lerp(0.3, oy, yoffsets[frame] || 0);
  };
  
  this.draw = (x, y, flipH, flipV) => {
    let fdirh = flipH ? -1: 1,
        fdirv = flipV ? -1: 1;
    let frame = _frame();
    g.spr(x + ox * fdirh, y + oy * fdirv, ...frame, flipH, flipV);
  };
  
}
