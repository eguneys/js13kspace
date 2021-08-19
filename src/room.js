import tiles from './tiles';
import Grid from './grid';
import Body from './physics';
import * as actions from './actions';
import { JumperThink, PlayerThink } from './thinks';

export default function Room(ctx) {
  let { g, a } = ctx;

  this.init = (level) => {

    this.grid = new Grid(4, 4, level.width, level.height);

    this.objects = new Grid(16, 16, level.width, level.height, true);
    
    for (let i = 0; i < level.res.length; i++) {
      for (let j = 0; j < level.res[i].length; j++) {
        let [x, y] = level.res[i][j];
        let tile = tiles[i];

        if (tile) {
          tile(this, x * 4, y * 4, i);
        } else {
          console.warn(`notile ${i}`);
        }
      }
    }
  };

  this.is_solid = (x, y, w, h) => {
    return this.grid.collide(x,
                             y,
                             w, h);
  };
  
  this.solid = (x, y, i) => {
    this.grid.get(x, y, tile_colors[i]);
  };

  this.jumper = (x, y) => {
    let obj = new JumperSpawn(ctx, this);
    this.objects.get(x, y, obj);
    obj.init(x, y);
    return obj;
  };

  this.player = (x, y) => {
    let obj = new PlayerSpawn(ctx, this);
    this.objects.get(x, y, obj);
    obj.init(x, y);
    return obj;
  };

  this.removeJumper = (jumper) => {
    this.objects.remove(jumper);
  };

  this.f_collide = body => {
    return this.is_solid(...body.cbox);
  };

  this.update = dt => {
    for (let objs of this.objects.all()) {
      for (let obj of objs) {
        obj.update(dt);
      }
    }
  };

  this.draw = () => {
    this.grid.draw(g);

    for (let objs of this.objects.all()) {
      for (let obj of objs) {
        obj.draw();
      }
    }
  };
}

export function PlayerSpawn(ctx, room) {
  let { g, a } = ctx;

  this.init = (x, y) => {
    this.x = x;
    this.y = y;

    let obj = new Jumper(ctx, room);
    obj.init(this.x, this.y, new PlayerThink(ctx, room, obj));
    room.objects.get(this.x, this.y, obj);
  };

  this.update = dt => {

  };

  this.draw = () => {
    
  };
}

export function JumperSpawn(ctx, room) {
  let { g, a } = ctx;

  this.init = (x, y) => {
    this.x = x;
    this.y = y;
    this.t_delay = ticks.one;
  };

  this.update = dt => {

    if (this.t_delay >= 0) {
      this.t_delay -= dt;
      if (this.t_delay < 0) {
        let obj = new Jumper(ctx, room);
        obj.init(this.x, this.y, new JumperThink(ctx, room, obj));
        room.objects.get(this.x, this.y, obj);
        
        this.t_delay = ticks.second * 3;
      }
    }
  };

  this.draw = () => {
    
  };
}

export function Jumper(ctx, room) {
  let { g, a } = ctx;

  this.init = (x, y, think) => {

    this.think = think;
    
    this.body = new Body(x, y, 0, 0, 4, 4, room.f_collide);

    this.walkLeft = new actions.Walk(this, -1);
    this.walkRight = new actions.Walk(this, 1);
    this.jump = new actions.Jump(this);

    this.g_velocity = [this.walkLeft,
                       this.walkRight,
                       this.jump];
  };

  this.autoRemove = () => {
    room.removeJumper(this);
  };

  this.update = dt => {

    this.think.update(dt);

    this.g_velocity.forEach(_ => _.update(dt));
    
    this.body.move(dt);
  };

  this.draw = () => {
    this.body.draw(g, tile_colors[4]);
  };
}
