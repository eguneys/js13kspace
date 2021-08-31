import Anim8 from './anim8';
import tiles from './tiles';
import Grid from './grid';
import Body from './physics';
import { JumperThink, PlayerThink } from './thinks';
import { JumperDraw } from './draws';
import Camera from './camera';
import Actions from './actions';
import { group, makeBlood, slashFx } from './fxs';
import Background from './background';

export default function Room(play, ctx) {
  let { g, a } = ctx;

  this.init = (level) => {

    this.play = play;
    
    this.camera = new Camera(g);
    this.camera.bounds(0, 0, level.width * 4, level.height * 4);

    this.grid = new Grid(4, 4, level.width, level.height);

    this.width = level.width * 4;
    this.height = level.height * 4;

    this.bg = new Background(this, g, this.width, this.height);

    this.objects = [];
    this.fxs = [];
    
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

    let r = Array(8).fill(0);
    for (let i = 0; i < level.width; i+=(1+Math.random()*10)) {
      for (let j = 0; j < level.height; j++) {
        if (r.every((_, k) =>
          this.grid.get((i + k) * 4, j * 4))) {
          this.grid.get(i*4, j*4, 33);
          i+= 60/4;
        }
      }
    }
    
  };

  this.is_solid = (x, y, w, h, ox, oy) => {
    return this.grid.collide(x,
                             y,
                             w, h, ox, oy);
  };

  this.get = (type) => {
    return this.objects
      .filter(_ => _.is === type);
  };

  this.collide_check = (type, x, y, w, h, ox, oy) => {
    return this.objects
      .filter(_ => _.is === type && _.body)
      .find(obj =>
        inters(obj.body.cbox,
               [x + ox, y + oy, w, h]));
  };
  
  this.solid = (x, y, i) => {
    this.grid.get(x, y, tile_colors[i]);
  };

  this.player = (x, y) => {
    let obj = new PlayerSpawn(ctx, this);
    this.objects.push(obj);
    obj.init(x, y);
    return obj;
  };

  this.sword = (x, y) => {
    let obj = new SwordSpawn(ctx, this);
    this.objects.push(obj);
    obj.init(x, y);
    return obj;    
  };

  this.enemy = (x, y) => {
    let obj = new Enemy(ctx, this);
    this.objects.push(obj);
    obj.init(x, y);
    return obj;
  };

  this.fx = (fx, x, y, dx, dy) => {
    let obj = new AnimFx(ctx, this);
    this.fxs.push(obj);
    obj.init(fx, x, y, dx, dy);
    return obj;
  };

  this.fxi = (fxi, x, y) => {
    fxi.init(x, y);
    this.fxs.push(fxi);
  };

  this.remove = (obj) => {
    this.objects = this.objects.filter(_ => _ !== obj);
    this.fxs = this.fxs.filter(_ => _ !== obj);
  };

  this.f_collide = body => {
    return !!this.is_solid(...body.cbox);
  };

  this.update = dt => {
    this.bg.update(dt);
    this.camera.update(dt);

    for (let obj of this.objects) {
      obj.update(dt);
    }
    for (let obj of this.fxs) {
      obj.update(dt);
    }

    a_tile.update(dt);
  };


  let a_tile = new Anim8(ctx.g,
                          [4, 4, 0, 48],
                          0, 0, [ticks.second]);


  this.draw = () => {

    this.camera.attach(0.2, 0.2);
    this.bg.draw();
    this.camera.detach();
    
    this.camera.attach();

    for (let obj of this.objects) {
      obj.draw();
    }

    for (let fx of this.fxs) {
      fx.draw();
    }
    this.grid.draw(a_tile, g);
    
    this.camera.detach();
  };
}

export function PlayerSpawn(ctx, room) {
  let { g, a } = ctx;

  let a_xc = new Anim8(ctx.g,
                       [8, 8, 320, 32],
                       0, 0, [ticks.sixth,
                              ticks.sixth]);

  this.init = (x, y) => {
    this.x = x;
    this.y = y;

    let obj = new Jumper(ctx, room);
    obj.init(this.x, this.y,
             new PlayerThink(ctx, room, obj),
             new JumperDraw(ctx, room, obj));
    
    room.objects.push(obj);
    room.camera.follow(obj.ctarget);

    room.bg.follow(obj.ctarget);
  };

  this.update = dt => {
    a_xc.update(dt);
  };

  this.draw = () => {
    a_xc.draw(this.x + 80, this.y - 80);
  };
}


export function SwordSpawn(ctx, room) {

  let a_xc = new Anim8(ctx.g,
                       [8, 8, 320, 32],
                       2, 0, [ticks.sixth,
                              ticks.sixth]);

  
  this.is = 'swordspawn';
  
  let { g, a } = ctx;

  let a_sword_spawn = new Anim8(ctx.g,
                                [16, 16, 128, 48],
                                0, 0, [ticks.sixth,
                                       ticks.sixth,
                                       ticks.sixth,
                                       ticks.sixth], [
                                         1,
                                         -1,
                                         0,
                                         0], [
                                           -2,
                                           0,
                                           2,
                                           0
                                         ]);

  let used = -1;

  this.init = (x, y) => {
    this.body = new Body(x, y-25, 0, 0, 16, 16, room.f_collide);
  };

  this.req = () => {
    if (used < 0) {
      used = ticks.second;
    }
  };
  
  this.update = dt => {
    a_sword_spawn.update(dt);

    if (used > 0) {
      used = appr(used, 0, dt);
      if (used === 0) {
        room.get('player')[0].sword();
      }
    }

    a_xc.update(dt);
  };

  this.draw = () => {
    // this.body.draw(g, tile_colors[0]);

    if (used > 0) {
      let t = ((ticks.second - used) / ticks.second);
      if ((t * ticks.second) % (2 * ticks.lengths) < ticks.lengths) {
        a_sword_spawn.draw(this.body.x, this.body.y - t * 30);
      }
    } else if (used < 0) {
      a_sword_spawn.draw(this.body.x, this.body.y);
    } else {
      a_xc.draw(this.body.x, this.body.y - 30);
    }
  };
}

export function AnimFx(ctx, room) {
  

  let x, y,
      dx, dy;
  let anim_fx;
  
  this.init = (_anim_fx, _x, _y, _dx, _dy) => {
    x = _x;
    y = _y;
    dx = _dx;
    dy = _dy;
    anim_fx = _anim_fx;

    if (dx === -1) {
      x -= anim_fx.w;
    }
  };

  this.update = dt => {
    anim_fx.update(dt);
    if (anim_fx.ri === 1) {
      room.remove(this);
    }
  };

  this.draw = () => {
    anim_fx.draw(x, y, dx=== -1, dy===-1);
  };
  
}


export function Jumper(ctx, room) {

  let { g, a } = ctx;
  this.g = g;

  this.ctarget = [0, 0];
  
  const getctarget = () => {
    this.ctarget[0] = this.body.cbox[0] + this.body.cbox[2] * 0.5;
    this.ctarget[1] = this.body.cbox[1] + this.body.cbox[3] * 0.5;
  };

  this.init = (x, y, think, anim) => {

    this.room = room;
    
    this.anim = anim;
    
    this.think = think;
    this.is = this.think.is;
    
    this.body = new Body(x, y-25+4, 4, 4, 21 - 6, 25 -4, room.f_collide);

    this.actions = new Actions(this);

    this.facing = 1;
    this.grounded = false;

    this.move_x = 0;
    this.move_y = 0;

    this.slashing = 0;
    this.dslash = -1;
    
    getctarget();
  };

  this.sword = () => {
    this.dslash = 1;
  };

  this.walk = dx => this.move_x = dx;
  this.jump = dy => this.move_y = dy;

  this.slash = (dx, dy) => {
    if (this.dslash > 0 && this.slashing === 0) {
      this.sdir = [dx, dy];
      this.slashing = ticks.sixth + ticks.lengths;
      this.dslash-= 1;
    }
  };
  
  this.update = dt => {
    getctarget();

    if (this.slashing > 0) {
      this.slashing = appr(this.slashing, 0, dt);
      if (this.slashing === 0) {
        this.slashing = -ticks.sixth;
      }
    } else if (this.slashing < 0) {
      this.slashing = appr(this.slashing, 0, dt);
    }
    
    this.grounded = room.is_solid(...this.body.cbox, 0, 1);

    if (this.grounded) {
      if (this.dslash >= 0 && this.slashing === 0) {
        this.dslash = 1;
      }
    }


    this.think.update(dt);
    this.actions.update(dt);
    this.body.move(dt);
    this.anim.update(dt);

    let swordspan = room.collide_check('swordspawn', ...this.body.cbox, 0, 0);

    if (swordspan) {
      room.get('enemy').forEach(_ => _.live());
      swordspan.req();
    }

    let enemy = room.collide_check('enemy', ...this.body.cbox, this.facing * 15, 0);

    this.body.damping = appr(this.body.damping, 1, dt);
    if (enemy) {

      this.body.damping = 0.6;
      
      if (this.slashing > 0) {

        if (!_oneslash) {
          _oneslash = true;
          room.fx(slashFx(g),
                  this.body.cbox[0]+
                  this.body.cbox[2]*0.5,
                  this.body.cbox[1],
                  this.facing,
                  0
                 );

          room.fxi(new group(ctx, room, makeBlood, this.facing),
                   enemy.body.cbox[0],
                   enemy.body.cbox[1]);
        }
        
        if (enemy.damage()) {
        }
      } else {
        _oneslash = false;
        if (this.dslash > 0) {
          if (enemy.t_dying === -1) {

            this.body.damping = -1;
            
          }
        }
      }
    } else {
      _oneslash = false;
    }


    let right_off = this.body.cbox[0] +
        this.body.cbox[2] - room.width,
        left_off = 0 - this.body.cbox[0],
        down_off = this.body.cbox[1] - room.height;

    if (right_off > 0) {
      this.body.x -= right_off;
    } else if (left_off > 0) {
      this.body.x += left_off;
    }

    if (down_off > 0) {
      room.play.rst();
    }
    
    if (this.dead) {
      room.remove(this);
    }
  };

  let _oneslash = false;

  this.draw = () => {
    //this.body.draw(g, tile_colors[4]);
    this.anim.draw();
  };
}


export function Enemy(ctx, room) {

  this.is = 'enemy';
  
  let a_live = new Anim8(ctx.g,
                         [33, 19, 0, 77],
                         0, 0, [ticks.half,
                                ticks.half,
                                ticks.half]);

  let a_dead = new Anim8(ctx.g,
                         [33, 19, 0, 77],
                         3, 0, [ticks.second]);
  let a_current;
  
  let { g, a } = ctx;

  this.init = (x, y) => {
    this.body = new Body(x, y-19+4, 4, 4, 33 - 6, 19 -4, room.f_collide);

    a_current = a_dead;

    this.t_dying = -1;
  };

  this.live = () => {
    a_current = a_live;
  };
  
  this.damage = () => {
    if (this.t_dying < 0) {
      this.t_dying = ticks.half;
      this.body.dx = 16 / ticks.half;
      return true;
    }
    return false;
  };
  
  this.update = dt => {
    
    if (this.t_dying > 0) {
      this.t_dying = appr(this.t_dying, 0, dt);

      if (this.t_dying === 0) {
        a_current = a_dead;
      }
    }
    this.body.dx = appr(this.body.dx, 0, dt * (16 / ticks.half));
        
    this.body.move(dt);
    
    a_current.update(dt);
  };

  this.draw = () => {
    // this.body.draw(g, tile_colors[4]);
    a_current.draw(this.body.x, this.body.y);

    if (this.t_dying > 0) {
      if (((this.t_dying / ticks.half) % (ticks.sixth * 2)) < ticks.sixth) {
        g.color(colors.light);
        g.fr(...this.body.cbox);
      }
    }
  };
}
