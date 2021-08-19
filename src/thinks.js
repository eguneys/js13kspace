export function JumperThink(ctx, room, jumper) {

  let t_life = ticks.second * 3;
  
  this.update = dt => {

    t_life -= dt;

    
    jumper.walkRight.req();
    
    if (t_life < 0) {
      jumper.autoRemove();
    }
  };
  
}


export function PlayerThink(ctx, room, jumper) {

  let { input } = ctx;
  
  this.update = dt => {

    let i_x = 0,
        i_y = 0;
    
    if (input.btn('left') > 0) {
      i_x = -1;
    } else if (input.btn('right') > 0) {
      i_x = 1;
    }
    if (input.btn('c') > 0) {
      i_y = 1;
    }

    if (i_x === -1) {
      jumper.walkLeft.req();
    } else {
      jumper.walkLeft.cut();
    }
    if (i_x === 1) {
      jumper.walkRight.req();
    } else {
      jumper.walkRight.cut();
    }

    if (i_y === 1) {
      jumper.jump.req();
    }
    
  };

  
}
