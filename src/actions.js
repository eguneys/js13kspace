import { slashFx } from './fxs';

export const maxV = 70 / ticks.second;
export const runAccel = (2 * maxV) / ticks.lengths;
const runReduce = runAccel / 2;

const maxRun = 90 / ticks.second;
const maxFall = 30 / ticks.third,
      gravity = maxFall / ticks.lengths;

const jumpHBoost = 16 / ticks.second,
      liftBoost = 16 / ticks.second,
      jumpSpeed = 90 / ticks.third;

const dashSpeed = 60 / ticks.third;

export default function Actions(jumper) {

  let jumpGrace = 0;
  

  const jump = () => {

    jumpGrace = 0;
    
    jumper.body.dx += jumpHBoost * jumper.move_x;
    jumper.body.dy = -jumpSpeed;
    jumper.body.dx += liftBoost;
    jumper.body.dy -= liftBoost;
  };
  
  this.update = (dt) => {

    if (Math.abs(jumper.body.dx) > maxRun) {
      jumper.body.dx = appr(jumper.body.dx, jumper.move_x * maxV, runReduce * dt);
    } else {
      jumper.body.dx = appr(jumper.body.dx, jumper.move_x * maxV, runAccel * dt);
    }

    if (jumper.move_x !== 0) {
      jumper.facing = jumper.move_x;
    }

    if (jumper.grounded) {
      jumpGrace = ticks.lengths;
    } else {
      if (jumpGrace > 0) {
        jumpGrace -= dt;
      }
      jumper.body.dy = appr(jumper.body.dy, maxFall, gravity * dt);
    }

    if (jumper.slashing > 0) {
      jumper.body.dx = dashSpeed * ((jumper.sdir[0] === 0 && jumper.sdir[1] === 0)
                                    ? jumper.facing : jumper.sdir[0]);
      jumper.body.dy = dashSpeed * jumper.sdir[1];
    }

        if (jumper.move_y !== 0) {
      if (jumpGrace > 0) {
        jump();
      }
    }
    
  };
  
}
