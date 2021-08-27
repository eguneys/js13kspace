import Room from './room';

export default function Play(ctx) {
  let { g, a } = ctx;

  this.room = new Room(ctx);
  
  this.init = () => {
    this.room.init(a.level);
  };
  
  this.update = (dt) => {
    this.room.update(dt);
  };

  this.draw = () => {
        
    g.cls();
    g.color(colors.dark);
    g.fr(0, 0, 320, 180);
    this.room.draw();
  };
}
