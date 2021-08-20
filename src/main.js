import './shared';
import './util';
import Input from './input';
import Graphics from './graphics';
import Assets from './assets';
import Play from './play';

export default function app(element) {

  Assets().then(assets => {
    let input = new Input();
    let graphics = new Graphics(element, assets.sprites);
    let play = new Play({
      a: assets,
      g: graphics,
      input
    });
    play.init();

    function step() {
      input.update(1/60);
      play.update(1/60);
      
      play.draw();
      requestAnimationFrame(step);
    }
    step();    
  });
}
