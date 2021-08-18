import './shared';
import Graphics from './graphics';

export default function app(element) {

  let graphics = new Graphics(element);
  graphics.cls();
  graphics.color(colors.light);
  graphics.fr(0, 0, 320, 180);
}
