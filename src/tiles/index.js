export function solid(room, x, y, i) {
  room.solid(x, y, i);
}

export function jumper(room, x, y, i) {
  room.jumper(x, y);
}

export function player(room, x, y) {
  room.player(x, y);
}

export default [
  solid,
  solid,
  solid,
  solid,
  jumper,
  solid,
  player
];
