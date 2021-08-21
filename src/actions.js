import Machine from './machine';

export const Rest = 0,
WalkLeftAccel = 1,
WalkRightAccel = 2,
Ledge = 51,
LedgeHang = 53,
PaceLeft = 3,
PaceRight = 4,
Anticipate = 5,
JumpAccel = 6,
KnockAccel = 7,
Hang = 8,
Fall = 9;

export const ShortJumpAccel = 10,
LongJumpAccel = 11;

export const FixLedge = 13;


export function Actions(jumper) {

  const walkVelX = 4 * 12 / ticks.second,
        jumpVelY = 4 * 12 / ticks.half,
        shortJumpVelY = 4 * 12 / ticks.third,
        longJumpVelY = 4 * 12 / ticks.half,
        knockVelY = 4 * 12 / (ticks.sixth * 3);

  let machine = new Machine();

  this.facing = 1;

  const fallUpdate = () => {
    jumper.body.dy = lerp(0.5, jumper.body.dy, jumpVelY);
  };
  
  const restUpdate = () => {
  };
  
  const restBegin = () => {
    jumper.body.dx = 0;
    jumper.body.dy = 0;
  };

  const walkAccelBegin = (direction) => {
    this.facing = direction;
  };
  
  const walkAccelLeftUpdate = (dt) => {
    jumper.body.dx = lerp(0.1, jumper.body.dx, this.facing * walkVelX);

    if (machine.i > ticks.second) {
      machine.transition(PaceLeft);
    }
  };

  const walkAccelRightUpdate = (dt) => {
    jumper.body.dx = lerp(0.1, jumper.body.dx, this.facing * walkVelX);

    if (machine.i > ticks.second) {
      machine.transition(PaceRight);
    }
  };

  const paceUpdate = dt => {
    jumper.body.dx = lerp(0.1, jumper.body.dx, 2 * this.facing * walkVelX);
  };
  
  const jumpAccelUpdate = (dt) => {
    if (machine.i < ticks.half * 0.5) {
      jumper.body.dy = lerp(0.5, jumper.body.dy, -jumpVelY);
    } else {
      jumper.body.dy = lerp(0.5, jumper.body.dy, -jumpVelY*0.5);
    }

    if (machine.i > ticks.half) {
      machine.transition(Hang);
    }
  };

  const shortJumpAccelUpdate = (dt) => {
    if (machine.i < ticks.third * 0.5) {
      jumper.body.dy = lerp(0.5, jumper.body.dy, -shortJumpVelY);
    } else {
      jumper.body.dy = lerp(0.5, jumper.body.dy, -shortJumpVelY*0.5);
    }

    if (machine.i > ticks.third) {
      machine.transition(Hang);
    }    
  };

  const longJumpAccelUpdate = (dt) => {
    if (machine.i < ticks.half * 0.5) {
      jumper.body.dy = lerp(0.5, jumper.body.dy, -longJumpVelY);
    } else {
      jumper.body.dy = lerp(0.5, jumper.body.dy, -longJumpVelY*0.5);
    }

    if (machine.i > ticks.half) {
      machine.transition(Hang);
    }
  };

  const hangUpdate = (dt) => {
    jumper.body.dy = 0;

    if (machine.i > ticks.sixth) {
      machine.transition(Fall);
    }
  };

  const anticipateUpdate = () => {
    if (machine.i > ticks.third) {
      machine.transition(JumpAccel);
    }
  };

  const knockAccelUpdate = (dt) => {

    jumper.body.dx = lerp(0.8, jumper.body.dx, - velY);
    jumper.body.dy = lerp(0.8, jumper.body.dy, - velY * 0.5);

    if (machine.i > ticks.sixth * 3) {
      machine.transition(Hang);
    }
  };

  let ledgex,
      ledgey;
  const ledgeBegin = (direction, _ledgeoffset) => {
    this.facing = direction;
    ledgex = jumper.body.x + 10 * this.facing;
    ledgey = jumper.body.y + 25;
    jumper.bodyanim = true;
  };

    const ledgeUpdate = (dt) => {
    if (machine.i > ticks.half) {
      machine.transition(LedgeHang);
    }
  };

  const ledgeEnd = () => {
  };

  const ledgeHangBegin = () => {
    
  };

  const ledgeHangUpdate = (dt) => {
    if (machine.i > ticks.half) {
      machine.transition(Fall);
    }
  };

  const ledgeHangEnd = () => {
    jumper.body.manual(ledgex,
                       ledgey + 3);
    jumper.bodyanim = false;
  };

  const fixLedgeBegin = (direction) => {
    ledgex = jumper.body.x + this.facing * 10;
    ledgey = jumper.body.y - 20;
    this.facing = direction;
    jumper.bodyanim = true;
  };
  
  const fixLedgeUpdate = (dt) => {
    jumper.body.manual(lerp(0.3, jumper.body.x, ledgex),
                       lerp(0.3, jumper.body.y, ledgey));

    if (machine.i > ticks.sixth) {
      machine.transition(Fall);
    }    
  };


  const fixLedgeEnd = () => {
    jumper.bodyanim = false;
    
  };
  
  
  machine.add(WalkLeftAccel, [ShortJumpAccel, WalkRightAccel, PaceLeft, Rest, Ledge],
              walkAccelLeftUpdate, walkAccelBegin);
  machine.add(WalkRightAccel, [ShortJumpAccel, WalkLeftAccel, PaceRight, Rest, Ledge],
              walkAccelRightUpdate, walkAccelBegin);
  machine.add(PaceLeft, [Rest, LongJumpAccel, Ledge], paceUpdate);
  machine.add(PaceRight, [Rest, LongJumpAccel, Ledge], paceUpdate);
  machine.add(Rest, [Ledge, WalkLeftAccel, WalkRightAccel, Anticipate], restUpdate, restBegin);
  machine.add(Anticipate, [JumpAccel], anticipateUpdate);
  machine.add(JumpAccel, [Hang, FixLedge], jumpAccelUpdate);
  machine.add(Hang, [Fall, FixLedge], hangUpdate);
  machine.add(KnockAccel, [], knockAccelUpdate);

  machine.add(ShortJumpAccel, [Hang, FixLedge], shortJumpAccelUpdate);
  machine.add(LongJumpAccel, [Hang, FixLedge], longJumpAccelUpdate);
  machine.add(Fall, [Rest], fallUpdate);

  machine.add(Ledge, [LedgeHang], ledgeUpdate, ledgeBegin, ledgeEnd);
  machine.add(LedgeHang, [Fall], ledgeHangUpdate, ledgeHangBegin, ledgeHangEnd);

  machine.add(FixLedge, [Fall], fixLedgeUpdate, fixLedgeBegin, fixLedgeEnd);
  
  machine.transition(Rest);



  this.state = () => machine.state;
  
  this.req = (state, args) => {
    machine.transition(state, args);
  };

  this.cut = (states) => {
    if (states.includes(machine.state)) {
      machine.transition(Rest);
    }
  };

  this.update = dt => {
    machine.update(dt);
  };
}
