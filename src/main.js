import './shared';
import Graphics from './graphics';
import Assets from './assets';
import Play from './play';

export default function app(element) {

  Assets().then(assets => {
    let graphics = new Graphics(element);
    let play = new Play({
      a: assets,
      g: graphics
    });
    play.init();

    function step() {
      play.update(1/60);
      play.draw();
      requestAnimationFrame(step);
    }
    step();    
  });
}
