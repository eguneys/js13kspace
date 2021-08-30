import Anim8 from './anim8';
import { maxV, runAccel } from './actions';

export function JumperDraw(ctx, room, jumper, isblue) {

  let dt = (ticks.lengths + ticks.three);

  let a_sword_idle = new Anim8(ctx.g,
                               [21, 15, 128, 26],
                               0, 0, [dt,
                                      dt], [
                                        1,
                                        -1], [
                                          -2,
                                          0,
                                        ]);

  let a_sword_slash = new Anim8(ctx.g,
                                [21, 15, 128, 26],
                                2, 0, [ticks.sixth/3+ticks.sixth*0.3,
                                       ticks.sixth/3-ticks.sixth*0.1,
                                       ticks.second], [
                                         12,
                                         14,
                                         24], [
                                           -8,
                                           -8,
                                           -8
                                         ]);
  
  let a_head = new Anim8(ctx.g,
                         [21, 14, 0, 25],
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
                         3, 0, [
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
                        6, 0, [
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

  let a_jumpaccel = new Anim8(ctx.g,
                              [21, 25],
                              10, 0, [
                                ticks.sixth,
                              ]);

  let a_hang = new Anim8(ctx.g,
                         [21, 25],
                         8, 0, [
                           ticks.sixth,
                         ]);

  let a_fall = new Anim8(ctx.g,
                         [21, 25],
                         12, 0, [
                           ticks.sixth,
                           ticks.second * 30
                         ]);

  let a_slash = new Anim8(ctx.g,
                          [21, 25],
                          18, 0, [
                            (ticks.sixth+ticks.lengths)/3,
                            (ticks.sixth+ticks.lengths)/3,
                            ticks.third
                          ]);  

  let a_current = a_run,
      a_tocurrent;

  let a_sword_c = a_sword_idle,
      a_sword_toc;

  const tosa = a_ => {
    if (a_sword_toc !== a_) {
      a_sword_toc = a_;
      a_sword_toc.goto(0);
    }
  };
  
  const toa = a_ => {
    if (a_tocurrent !== a_) {
      a_tocurrent = a_;
      a_tocurrent.goto(0);
    }
  };
  
  this.update = (dt) => {

    if (jumper.slashing !== 0) {
      tosa(a_sword_slash);
    } else {
      tosa(a_sword_idle);
    }

    if (jumper.slashing > 0) {
      toa(a_slash);
    } else if (jumper.grounded) {
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

    if (a_sword_toc && a_sword_toc !== a_sword_c) {
      a_sword_c = a_sword_toc;
      a_sword_toc = undefined;
    }
    
    a_current.update(dt);
    a_head.update(dt);

    a_sword_c.update(dt);
  };
  
  this.draw = () => {
    a_current.draw(jumper.body.x, jumper.body.y, jumper.facing === -1);
    a_head.draw(jumper.body.x + jumper.facing * a_current.o_x(), jumper.body.y + a_current.o_y(), jumper.facing === -1);

    if (jumper.dslash >= 0) {
      a_sword_c.draw(-jumper.facing * 10 + jumper.body.x + jumper.facing * a_current.o_x(),
                     16 + jumper.body.y + jumper.facing * a_current.o_y(), jumper.facing === -1);
    }
  };
  
}
