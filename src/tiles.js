export function solid(room, x, y, i) {
  room.solid(x, y, i);
}

export function jumper(room, x, y, i) {
  room.jumper(x, y);
}

export function player(room, x, y) {
  room.player(x, y);
}

export function sword(room, x, y) {
  room.sword(x, y);
}

export function enemy(room, x, y) {
  room.enemy(x, y);
}

export function love(room, x, y) {
  room.love(x, y);
}

export default [
  solid,
  solid,
  player,
  sword,
  enemy,
  love
];
