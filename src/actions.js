import Machine from './machine';

let genId = 1;
export const Rest = genId++,
Accel = genId++,
Pace = genId++,
Anticipate = genId++;

export function Walk(jumper, direction) {

  const velX = 4 * 12 / ticks.second;

  let machine = new Machine();
  
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

  machine.add(Rest, undefined, restBegin);
  machine.add(Accel, accelUpdate);
  machine.add(Pace, paceUpdate);
  machine.transition(Rest);

  this.state = () => machine.state;
  
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

  let machine = new Machine();
  
  const restUpdate = () => {
    jumper.body.dy = lerp(0.5, jumper.body.dy, velY * 2);
  };

  const accelBegin = () => {
  };

  const accelUpdate = (dt) => {
    if (machine.i < ticks.third * 3 * 0.5) {
      jumper.body.dy = lerp(0.5, jumper.body.dy, -velY);
    } else {
      jumper.body.dy = lerp(0.5, jumper.body.dy, -velY*0.5);
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

  const anticipateUpdate = () => {
    
    if (machine.i > ticks.sixth) {
      machine.transition(Accel);
    }    
  };


  machine.add(Rest, restUpdate);
  machine.add(Anticipate, anticipateUpdate);
  machine.add(Accel, accelUpdate, accelBegin);
  machine.add(Hang, hangUpdate);
  machine.transition(Rest);

  this.state = () => machine.state;
  
  this.req = () => {
    if (machine.state === Rest) {
      machine.transition(Anticipate);
    }
  };

  this.update = dt => {
    machine.update(dt);
  };
}

export function Knock(jumper) {

  const velY = 4 * 12 / (ticks.sixth * 3);

  let machine = new Machine();
  
  const restBegin = () => {
    jumper.body.dx = 0;
    jumper.body.dy = 0;
  };

  const accelUpdate = (dt) => {

    jumper.body.dx = lerp(0.8, jumper.body.dx, - velY);
    jumper.body.dy = lerp(0.8, jumper.body.dy, - velY * 0.5);

    if (machine.i > ticks.sixth * 3) {
      machine.transition(Hang);
    }
  };
  
  const hangUpdate = () => {
    jumper.body.dx = lerp(0.5, jumper.body.dx, 0);
    jumper.body.dy = lerp(0.5, jumper.body.dy, 0);    
    
    if (machine.i > ticks.sixth * 3) {
      machine.transition(Rest);
    }    
  };
  
  machine.add(Rest, undefined, restBegin);
  machine.add(Accel, accelUpdate);
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
