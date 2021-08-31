export default function Ending(play, ctx) {
  let { g, a } = ctx;
  
  this.draw = () => {
    g.color(colors.light);
    g.fr(0, 0, 320, 180);
  };
}
