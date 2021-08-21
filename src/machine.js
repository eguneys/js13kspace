export default function Machine() {

  let allows = {},
      updates = {},
      begins = {},
      ends = {};

  this.i = 0;

  this.add = (state, allow, update, begin, end) => {
    allows[state] = allow;
    updates[state] = update;
    begins[state] = begin;
    ends[state] = end;
  };

  this.transition = (state, args) => {
    if (this.state && !allows[this.state].includes(state)) {
      return;
    }

    if (this.state && ends[this.state]) {
      ends[this.state]();
    }

    this.state = state;
    this.i = 0;
    if (begins[this.state]) {
      begins[this.state](args);
    }
  };

  this.update = (dt) => {
    this.i += dt;
    if (updates[this.state]) {
      updates[this.state](dt);
    }
  };
  
}
