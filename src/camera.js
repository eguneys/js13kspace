export default function Camera(g) {

  let pos = [0, 0],
      target = [0,0],
      deadzone = [(320 - 60)  / 2, (180 - 40) / 2, 60, 40],
      last_target = [0, 0],
      bounds = undefined;

  this.bounds = (x, y, w, h) => {
    bounds = [x, y, w, h];
  };
  
  this.follow = xy => {
    target = xy;
    last_target = [...target];
  };
  
  this.attach = (sc_x = 1, sc_y = 1) => {
    g.ctx(ctx => {
      ctx.save();
      ctx.translate(Math.floor(-pos[0]*sc_x + 160),
                    Math.floor(-pos[1]*sc_y + 90));
    });    
  };

  this.detach = () => {
    g.ctx(ctx => {
      ctx.restore();
    });
  };

  this.update = dt => {

    let dx1 = deadzone[0],
        dy1 = deadzone[1],
        dx2 = deadzone[0] + deadzone[2],
        dy2 = deadzone[1] + deadzone[3];
    
    let [scroll_x,
         scroll_y] = [0, 0];
    
    let [target_x,
         target_y] = this.get_local(...target),
        [x, y] = this.get_local(...pos);

    if (target_x < x + (dx1 + dx2 - x)) {
      let d = target_x - dx1;
      if (d < 0) {
        scroll_x = d;
      }
    }

    if (target_x > x - (dx1 + dx2 - x)) {
      let d = target_x - dx2;
      if (d > 0) {
        scroll_x = d;
      }
    }

    if (target_y < y + (dy1 + dy2 - y)) {
      let d = target_y - dy1;
      if (d < 0) {
        scroll_y = d;
      }
    }

    if (target_y > y - (dy1 + dy2 - y)) {
      let d = target_y - dy2;
      if (d > 0) {
        scroll_y = d;
      }
    }

    scroll_x += target[0] - last_target[0];
    scroll_y += target[1] - last_target[1];

    last_target[0] = target[0];
    last_target[1] = target[1];
    
    pos[0] = lerp(0.5, pos[0], pos[0] + scroll_x);
    pos[1] = lerp(0.5, pos[1], pos[1] + scroll_y);

    if (bounds) {
      pos[0] = Math.min(Math.max(pos[0], bounds[0] + 160), bounds[0] + bounds[2] - 160);
      pos[1] = Math.min(Math.max(pos[1], bounds[1] + 90), bounds[1] + bounds[3] - 90);
    }
  };

  this.get_local = (x, y) => {
    return [x - pos[0] + 160,
            y - pos[1] + 90];
  };

  this.draw = () => {
    g.color(colors.light);
    g.r(...deadzone);
  };
  
}
