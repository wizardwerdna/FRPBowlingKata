import {hr, button, img, span, h1, h3, div} from '@cycle/dom';
import {enabler} from './enabler';
require('./styles.css');
require('./Rx_Logo_S.png');

export function view(model$) {
  return model$.map(([display, scores, pastLength, futureLength]) =>
    div('.container', [
      div('#title', [
        h1([
          img({props: {src: 'Rx_Logo_S.png'}}),
          span('FRP Bowling'),
          img({props: {src: 'CycleJS_Logo.png'}}),
        ]),
        h3('The Classic Kata in RxJS and CycleJS')
      ]),
      hr(),
      button('#newgame',
        {props: {disabled: display.length === 0}}, 'New Game'),
      button('#undo',
        {props: {disabled: pastLength <= 1}}, 'Undo'),
      button('#redo',
        {props: {disabled: futureLength === 0}}, 'Redo'),
      hr(),
      ...Array(11).fill(0).map((_, pins) =>
        button(
          '.rollButton',
          {props: {disabled: pins > enabler(display, scores)}},
          pins.toString())
        ),
      hr(),
      div('#frames.clearfix', [
        ...Array(10).fill(0).map((_, frame) =>
          div('.frame', {class: {tenth: frame === 9}}, [
            ...Array(frame === 9 ? 3 : 2).fill(0).map((_, roll) =>
              div('.rollDisplay', display[2 * frame + roll] || '')
            ),
            div('.scoreDisplay', scores[frame])
          ])
        ),
      ]),
      hr()
    ])
  );
};
