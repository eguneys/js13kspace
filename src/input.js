export default function Input() {

  this._btn = new Map();

  const press = (key) => {
    if (!this._btn.has(key) || this._btn.get(key) === 0) {
      this._btn.set(key, ticks.one);
    }
  };

  const release = (key) => {
    this._btn.set(key, -ticks.sixth);
  };

  this.btn = (key) => {
    return this._btn.get(key) || 0;
  };

  this.update = dt => {

    for (let [key, t] of this._btn) {
      let sign = Math.sign(t);
      if (t !== 0) {
        t += dt;
        if (Math.sign(t) !== sign) {
          t = 0;
        }
      }
      this._btn.set(key, t);
    }
  };
  
  document.addEventListener('keydown', e => {
    switch(e.key) {
    case 'ArrowUp':
      press('up');
      break;
    case 'ArrowDown':
      press('down');
      break;
    case 'ArrowLeft':
      press('left');
      break;
    case 'ArrowRight':
      press('right');
      break;
    case 'x':
      press('x');
      break;
    case 'c':
      press('c');
      break;
    }
  });

  document.addEventListener('keyup', e => {
    switch(e.key) {
    case 'ArrowUp':
      release('up');
      break;
    case 'ArrowDown':
      release('down');
      break;
    case 'ArrowLeft':
      release('left');
      break;
    case 'ArrowRight':
      release('right');
      break;
    case 'c':
      release('c');
      break;
    case 'x':
      release('x');
      break;      
    }
  });

  
}
