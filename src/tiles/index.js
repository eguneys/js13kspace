export function solid(room, x, y, i) {
  room.solid(x, y, i);
}

export function jumper(room, x, y, i) {
  room.jumper(x, y);
}

export default [
  solid,
  solid,
  solid,
  solid,
  jumper
];
