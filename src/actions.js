import Machine from './machine';

let genId = 1;
const Rest = genId++,
      Accel = genId++,
      Pace = genId++;

export function Walk(jumper, direction) {

  const velX = 4 * 12 / ticks.second;
  
  const restBegin = () => {
    jumper.body.dx = 0;
  };

  const accelUpdate = (dt) => {
    jumper.body.dx = lerp(0.1, jumper.body.dx, direction * velX);

    if (machine.i > ticks.third * 3) {
      machine.transition(Pace);
    }
  };

  const paceUpdate = dt => {
    jumper.body.dx = lerp(0.1, jumper.body.dx, 2 * direction * velX);
  };

  let machine = new Machine();
  machine.add(Rest, undefined, restBegin);
  machine.add(Accel, accelUpdate);
  machine.add(Pace, paceUpdate);
  machine.transition(Rest);
  
  this.req = () => {
    if (machine.state === Rest) {
      machine.transition(Accel);
    }
  };

  this.cut = () => {
    if (machine.state === Pace) {
      machine.transition(Rest);
    } else if (machine.state === Accel) {
      machine.transition(Rest);
    }
  };

  this.update = dt => {
    machine.update(dt);
  };
  
}

export const Hang = genId++;

export function Jump(jumper) {

  const velY = 4 * 12 / ticks.second;
  
  const restBegin = () => {
    jumper.body.dy = lerp(0.5, jumper.body.dy, velY * 2);
  };

  const accelBegin = () => {
  };
  
  const accelUpdate = (dt) => {
    if (machine.i < ticks.third * 3 * 0.5) {
      jumper.body.dy = lerp(1, jumper.body.dy, -velY);
    } else {
      jumper.body.dy = lerp(0.5, jumper.body.dy, 0);
    }

    if (machine.i > ticks.third * 3) {
      machine.transition(Hang);
    }
  };

  const hangUpdate = (dt) => {
    jumper.body.dy = 0;

    if (machine.i > ticks.sixth) {
      machine.transition(Rest);
    }
  };


  let machine = new Machine();
  machine.add(Rest, undefined, restBegin);
  machine.add(Accel, accelUpdate, accelBegin);
  machine.add(Hang, hangUpdate);
  machine.transition(Rest);
  
  this.req = () => {
    if (machine.state === Rest) {
      machine.transition(Accel);
    }
  };

  this.update = dt => {
    machine.update(dt);
  };
}
