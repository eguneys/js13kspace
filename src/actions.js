export const maxV = 70 / ticks.second;
export const runAccel = maxV / ticks.lengths;

const maxFall = 30 / ticks.third,
      gravity = maxFall / ticks.lengths;

const jumpHBoost = 16 / ticks.second,
      liftBoost = 16 / ticks.second,
      jumpSpeed = 90 / ticks.third;

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

    jumper.body.dx = appr(jumper.body.dx, jumper.move_x * maxV, runAccel * dt);

    if (jumper.move_x !== 0) {
      jumper.facing = jumper.move_x;
    }

    if (jumper.move_y !== 0) {
      if (jumpGrace > 0) {
        jump();
      }
    }

    if (jumper.grounded) {
      jumpGrace = ticks.lengths;
    } else {
      if (jumpGrace > 0) {
        jumpGrace -= dt;
      }
      jumper.body.dy = appr(jumper.body.dy, maxFall, gravity * dt);
    }
    
  };
  
}
