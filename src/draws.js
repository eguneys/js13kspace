import Anim8 from './anim8';
import * as actions from './actions';

export function JumperDraw(ctx, room, jumper) {

  let dt = (ticks.lengths + ticks.three);
  
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

  let a_current = a_walk,
      a_tocurrent;

  this.update = (dt) => {

    if (jumper.jump.state() === actions.Anticipate) {
      if (a_current !== a_anticipate) {
        a_tocurrent = a_anticipate;
      }      
    } else if (jumper.jump.state() === actions.Accel) {
      if (a_current !== a_jumpaccel) {
        a_tocurrent = a_jumpaccel;
      }
    } else if (jumper.jump.state() === actions.Hang) {
      if (a_current !== a_hang) {
        a_tocurrent = a_hang;
      }    
    } else if (jumper.walking === actions.Pace) {
      if (a_current !== a_run) {
        a_tocurrent = a_run;
      }
    } else if (jumper.walking === actions.Accel) {
      if (a_current !== a_walk) {
        a_tocurrent = a_walk;
      }
    } else {
      if (a_current !== a_idle) {
        a_tocurrent = a_idle;
      }
    }

    a_current.update(dt);
    
    if (a_tocurrent) {
      if (a_current.is_ok()) {
        a_current = a_tocurrent;
        a_tocurrent = undefined;
        a_current.goto(0);
      }
    }
  };
  
  this.draw = () => {
    a_current.draw(jumper.body.x, jumper.body.y, jumper.facing === -1);
  };
  
}