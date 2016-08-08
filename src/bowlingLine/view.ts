import {button, div, hr, span} from '@cycle/dom';
import {enabler} from './enabler';

export function view(model$) {
  return model$.map(([display, scores, enabledUndo, enabledRedo, props]) =>
    div({key: props.id}, [
      vPlayerName(props),
      vFrames(display, scores),
      vRollButtons(display, scores),
      vActions(display, enabledUndo, enabledRedo),
      hr()
    ])
  );
}

function vPlayerName(props) {
  return div('.name', props.name);
}

function vFrames(display, scores) {
  return div('.frames.clearfix', [
    ...Array(10).fill(0).map((_, frame) =>
      div('.frame', {class: {tenth: frame === 9}}, [
        ...Array(frame === 9 ? 3 : 2).fill(0).map((_, roll) =>
          div('.rollDisplay', display[2 * frame + roll])
        ),
        div('.scoreDisplay', scores[frame] || '')
      ])
    )
  ]);
}

function vRollButtons(display, scores) {
  return span('.rollbuttons', [
    ...Array(11).fill(0).map((_, pins) =>
      button(
        '.rollButton',
        {props: {disabled: pins > enabler(display, scores)}},
        pins
      )
    )
  ]);
}

function vActions(display, enabledUndo, enabledRedo) {
  return span('.actions', [
    button('.newgame', 'New'),
    button('.undo', {props: {disabled: !enabledUndo}}, 'Undo'),
    button('.redo', {props: {disabled: !enabledRedo}}, 'Redo'),
    button('.delete', 'X')
  ]);
}
