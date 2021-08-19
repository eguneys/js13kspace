export default function Machine() {

  let updates = {},
      begins = {},
      ends = {};

  this.i = 0;

  this.add = (state, update, begin, end) => {
    updates[state] = update;
    begins[state] = begin;
    ends[state] = end;
  };

  this.transition = (state) => {
    if (this.state && ends[this.state]) {
      ends[this.state]();
    }

    this.state = state;
    this.i = 0;
    if (begins[this.state]) {
      begins[this.state]();
    }
  };

  this.update = (dt) => {
    this.i += dt;
    if (updates[this.state]) {
      updates[this.state](dt);
    }
  };
  
}
