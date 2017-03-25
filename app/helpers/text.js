import { format } from 'd3-format';

export { prettifyNumber };

function prettifyNumber(number) {
  // show "billion" instead of "giga"
  return number > 10 ? format('.2s')(number).replace('G', 'B') : (''+number).slice(0, 3);
}
