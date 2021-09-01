import Anim8 from './anim8';

export default function Ending(play, ctx) {
  let { g, a, input } = ctx;


  let e_dur = ticks.sixth;
  let a_ending = new Anim8(ctx.g,
                           [16, 16, 48, 48],
                           0, 0, [e_dur,
                                  e_dur,
                                  e_dur,
                                  e_dur]);


  
  let dt = ticks.second * 10;
  
  let t_scroll = 0;
  this.init = () => {
    t_scroll = dt;
  };

  this.update = dt => {
    t_scroll = appr(t_scroll, 0, dt);
    if (t_scroll > 0) {
      a_ending.update(dt);
    } else {
      a_ending.goto(0);
      if (input.btn('x') > 0) {
        play.init();
      }
    }
    
  };
  
  this.draw = () => {
    g.color(colors.light);
    g.fr(0, 0, 320, 180);

    let t = t_scroll / dt;
    g.color(colors.black);
    g.fr(80, 210 * t - 30, 160, 20);
    g.fr(80-20, 210 * t - 60, 140, 20);
    g.fr(80-40, 210 * t - 90, 120, 20);

    if (t_scroll === 0) {
      g.color(colors.red);
      g.fr(120, 20, 180, 20);
    }
    a_ending.draw(120 + 2 * 30 * t * Math.cos(t * Math.PI * 3), 20 + 30 * t * Math.sin(t * Math.PI * 4) * 3, -1, -1, 6);
  };
}
