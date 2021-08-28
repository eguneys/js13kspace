import Anim8 from './anim8';
import { maxV, runAccel } from './actions';

export function JumperDraw(ctx, room, jumper, isblue) {

  let dt = (ticks.lengths + ticks.three);

  let a_head = new Anim8(ctx.g,
                         [21, 14, 64, 0],
                         0, 0, [dt,
                                dt,
                                dt], [
                                  1,
                                  -1,
                                  1
                                ], [
                                  -3,
                                  -2,
                                  -1
                                ]);

  let a_idle = new Anim8(ctx.g,
                         [21, 25],
                         0, 0, [dt,
                                dt,
                                dt], [
                                  -1,
                                  0,
                                  1
                                ]);

  let a_walk = new Anim8(ctx.g,
                         [21, 25],
                         0, 1, [
                           dt,
                           dt * 1.3,
                           dt
                         ],
                         [
                           3,
                          0,
                           -2
                         ]);

  let a_run = new Anim8(ctx.g,
                        [21, 25],
                        0, 2, [
                          -dt*0.5 + dt,
                          -dt*0.5 + dt * 1.3,
                          -dt*0.5 + dt
                        ], [
                          2,
                          0,
                          -2
                        ],
                        [
                          -2,
                          0,
                          -1
                        ]);

  let a_anticipate = new Anim8(ctx.g,
                               [21, 25],
                               0, 3, [
                                 ticks.sixth,
                               ]);

  let a_jumpaccel = new Anim8(ctx.g,
                              [21, 25],
                              1, 3, [
                                ticks.sixth,
                              ]);

  let a_hang = new Anim8(ctx.g,
                         [21, 25],
                         2, 3, [
                           ticks.sixth,
                         ]);

  let a_fall = new Anim8(ctx.g,
                         [21, 25],
                         0, 4, [
                           ticks.sixth,
                           ticks.second * 30
                         ]);

  let a_current = a_run,
      a_tocurrent;

  const toa = a_ => {
    if (a_tocurrent !== a_) {
      a_tocurrent = a_;
      a_tocurrent.goto(0);
    }
  };
  
  this.update = (dt) => {

    if (jumper.grounded) {
      if (Math.abs(jumper.body.dx) < runAccel && jumper.move_x === 0) {
        toa(a_idle);
      } else {
        if (Math.abs(jumper.body.dx) < maxV *0.5) {
          toa(a_walk);
        } else {
          toa(a_run);
        }
      }
    } else {
      if (jumper.body.dy < 0) {
        toa(a_jumpaccel);
      } else if (Math.abs(jumper.body.dy) < maxV * 0.1) {
        toa(a_hang);
      } else {
        toa(a_fall);
      }
    }

    if (a_tocurrent && a_tocurrent !== a_current) {
      a_current = a_tocurrent;
      a_tocurrent = undefined;
    }
    
    a_current.update(dt);
    a_head.update(dt);
  };
  
  this.draw = () => {
    a_current.draw(jumper.body.x, jumper.body.y, jumper.facing === -1);
    a_head.draw(jumper.body.x + jumper.facing * a_current.o_x(), jumper.body.y + a_current.o_y(), jumper.facing === -1);
  };
  
}
