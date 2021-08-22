import * as actions from './actions';

export function JumperThink(ctx, room, jumper) {

  this.is = 'jumper';
  
  let t_life = ticks.second * 3;
  
  this.update = dt => {

    t_life -= dt;

    // let p = room.get_type(...jumper.body.cbox);

    // jumper.walk(actions.WalkRightAccel, 1);
    
    if (t_life < 0) {
      // jumper.dead = true;
    }
  };
  
}


export function PlayerThink(ctx, room, jumper) {

  this.is = 'player';
  
  let { input } = ctx;
  
  this.update = dt => {

    let i_x = 0,
        i_y = 0;

    if (input.btn('left') !== 0) {
      i_x = -1;
    } else if (input.btn('right') !== 0) {
      i_x = 1;
    }
    if (input.btn('c') !== 0) {
      i_y = 1;
    }

    if (i_x === -1) {
      jumper.walk(actions.WalkLeftAccel, i_x);
    } else {
      jumper.actions.cut([actions.WalkLeftAccel, actions.PaceLeft]);
    }
    if (i_x === 1) {
      jumper.walk(actions.WalkRightAccel, i_x);
    } else {
      jumper.actions.cut([actions.WalkRightAccel, actions.PaceRight]);
    }

    if (i_y === 1) {
      jumper.jump(i_x);
    }
    
  };

  
}
