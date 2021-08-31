import Room from './room';

export default function Play(ctx) {
  let { g, a } = ctx;

  let trans_dur = ticks.half;
  
  this.room = new Room(this, ctx);

  let trans_on = 0,
      trans_off = 0;
  
  this.init = () => {
    this.room.init(a.level);
    this.rst();
  };

  this.rst = () => {
    if (trans_on === 0) {
      trans_on = trans_dur*0.5;
    }
  };
  
  this.update = (dt) => {

    if (trans_on > 0) {
      trans_on = appr(trans_on, 0, dt);
      if (trans_on === 0) {
        trans_off = trans_dur;
        this.room.init(a.level);
      }
    }

    if (trans_off > 0) {
      trans_off = appr(trans_off, 0, dt);
    }
    
    this.room.update(dt);
  };

  this.draw = () => {
        
    g.cls();
    g.color(colors.dark);
    g.fr(0, 0, 320, 180);

    this.room.draw();

    g.color(colors.red);
    if (trans_on > 0) {
      let t = 1-trans_on / (trans_dur * 0.5);
      t = t * t * t;
      g.fr(0, 0, t * 320, 180);
      g.color(colors.light);
      g.fr(t * 320, 0, 30 * (1-t), 180);
    }
    if (trans_off > 0) {
      let t = (trans_off) / trans_dur;
      t = t * (2-t);
      g.fr((1-t)*320, 0, 320, 180);
      g.color(colors.light);
      g.fr((1-t) * 320, 0, 30 * t, 180);
      g.fr(1-t*320, 0, 30 * t, 180);
    }    
  };
}
