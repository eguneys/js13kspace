import tiles from './tiles';
import Grid from './grid';
import Body from './physics';
import { JumperThink, PlayerThink } from './thinks';
import { JumperDraw } from './draws';
import Camera from './camera';
import Actions from './actions';

export default function Room(ctx) {
  let { g, a } = ctx;

  this.init = (level) => {

    this.camera = new Camera(g);
    this.camera.bounds(0, 0, level.width * 4, level.height * 4);

    this.grid = new Grid(4, 4, level.width, level.height);

    this.objects = new Grid(16, 16, level.width, level.height);
    
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

  this.is_solid = (x, y, w, h, ox, oy) => {
    return this.grid.collide(x,
                             y,
                             w, h, ox, oy);
  };
  
  this.solid = (x, y, i) => {
    this.grid.get(x, y, tile_colors[i]);
  };

  this.player = (x, y) => {
    let obj = new PlayerSpawn(ctx, this);
    this.objects.get(x, y, obj);
    obj.init(x, y);
    return obj;
  };

  this.rmv = (obj) => {
    this.objects.remove(obj);
  };

  this.f_collide = body => {
    return !!this.is_solid(...body.cbox);
  };

  this.update = dt => {
    this.camera.update(dt);
    for (let obj of this.objects.all()) {
      obj.update(dt);
    }
  };

  this.draw = () => {

    this.camera.draw();
    
    this.camera.attach();
    
    this.grid.draw(g);
    
    for (let obj of this.objects.all()) {
      obj.draw();
    }

    this.camera.detach();
  };
}

export function PlayerSpawn(ctx, room) {
  let { g, a } = ctx;

  this.init = (x, y) => {
    this.x = x;
    this.y = y;

    let obj = new Jumper(ctx, room);
    obj.init(this.x, this.y,
             new PlayerThink(ctx, room, obj),
             new JumperDraw(ctx, room, obj));
    
    room.objects.get(this.x, this.y, obj);
    room.camera.follow(obj.ctarget);
  };

  this.update = dt => {};

  this.draw = () => {};
}

export function Jumper(ctx, room) {

  let { g, a } = ctx;

  this.ctarget = [0, 0];
  
  const getctarget = () => {
    this.ctarget[0] = this.body.cbox[0] + this.body.cbox[2] * 0.5;
    this.ctarget[1] = this.body.cbox[1] + this.body.cbox[3] * 0.5;
  };

  this.init = (x, y, think, anim) => {

    this.anim = anim;
    
    this.think = think;
    this.is = this.think.is;
    
    this.body = new Body(x, y-25+4, 4, 4, 21 - 6, 25 -4, room.f_collide);

    this.actions = new Actions(this);

    this.facing = 1;
    this.grounded = false;

    this.move_x = 0;
    this.move_y = 0;
    
    getctarget();
  };

  this.walk = dx => this.move_x = dx;
  this.jump = dy => this.move_y = dy;
  
  this.update = dt => {
    getctarget();

    this.grounded = room.is_solid(...this.body.cbox, 0, 1);
    
    this.think.update(dt);
    this.actions.update(dt);
    this.body.move(dt);
    this.anim.update(dt);
    
    if (this.dead) {
      room.rmv(this);
    }
  };

  this.draw = () => {
    //this.body.draw(g, tile_colors[4]);
    this.anim.draw();
  };
}
