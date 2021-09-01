import Room from './room';
import Ending from './ending';

export default function Play(ctx) {
  let { g, a } = ctx;

  let trans_dur = ticks.half;
  
  this.room = new Room(this, ctx);

  this.ending = new Ending(this, ctx);

  let trans_on = 0,
      trans_off = 0,
      trans_hold = 0;

  let go_to_end;
  
  this.init = () => {
    go_to_end = false;
    // this.end_do();
    this.rst();
  };


  this.rst = () => {
    if (trans_on === 0) {
      trans_on = trans_dur*0.5;
    }
  };


  let ending = 0;
  this.end = () => {
    ending = ticks.second * 10;
  };

  this.end_do = () => {
    go_to_end = true;
    this.ending.init();    
  };
  
  this.update = (dt) => {

    if (ending > 0) {
      ending = appr(ending, 0, dt);
      if (ending === 0) {
        this.end_do();
        trans_on = trans_dur * 0.5;
      }
    }
    
    if (trans_on > 0) {
      trans_on = appr(trans_on, 0, dt);
      if (trans_on === 0) {
        trans_hold = ticks.sixth;
        this.room.init(a.level);
      }
    } else if (trans_hold > 0) {
      trans_hold = appr(trans_hold, 0, dt);
      if (trans_hold === 0) {
        trans_off = trans_dur;
      }
    } else if (trans_off > 0) {
      trans_off = appr(trans_off, 0, dt);
    }

    if (trans_on === 0) {
      if (go_to_end) {
        this.ending.update(dt);
      } else {
        this.room.update(dt);
      }
    }
  };

  this.draw = () => {
        
    g.cls();
    g.color(colors.dark);
    g.fr(0, 0, 320, 180);

    if (trans_on === 0 && trans_hold === 0) {
      if (go_to_end) {
        this.ending.draw();
      } else {
        this.room.draw();
      }
    }

    g.color(go_to_end?colors.blue:colors.red);
    if (trans_on > 0) {
      let t = 1-trans_on / (trans_dur * 0.5);
      t = t * t * t;
      g.fr(0, 0, t * 320, 180);
      g.color(colors.light);
      g.fr(t * 320, 0, 30 * (1-t), 180);
    } else if (trans_off > 0) {
      let t = (trans_off) / trans_dur;
      t = t * (2-t);
      g.fr((1-t)*320, 0, 320, 180);
      g.color(colors.light);
      g.fr((1-t) * 320, 0, 30 * t, 180);
      g.fr(1-t*320, 0, 30 * t, 180);
    } else if (trans_hold > 0) {
      let t = trans_hold / ticks.sixth;
      g.fr(0, 0, 320, 180);
      // g.color(colors.light);
      // g.fr(0, 70 + 20*(1-t), 320, 40*t);
      // g.color(colors.blue);
      // g.fr(t * 320, 88, 320, 4+4*t*t);
    }
  };
}
