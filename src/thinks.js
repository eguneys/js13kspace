import * as actions from './actions';

export function PlayerThink(ctx, room, jumper) {

  this.is = 'player';
  
  let { input } = ctx;

  this.update = dt => {

    let i_x = 0,
        i_y = 0,
        i_c = 0;

    if (input.btn('left') !== 0) {
      i_x = -1;
    } else if (input.btn('right') !== 0) {
      i_x = 1;
    }
    if (input.btn('up') !== 0) {
      i_y = -1;
    } else if (input.btn('down') !== 0) {
      i_y = 1;
    }
    if (input.btn('x') > 0 && input.btn('x') < ticks.sixth) {
      i_c = 1;
    }

    if (input.btn('c') > 0 && input.btn('c') < ticks.sixth) {
      jumper.slash(i_x, i_y);
    }

    jumper.walk(i_x);
    jumper.jump(i_c);
  };

  
}
