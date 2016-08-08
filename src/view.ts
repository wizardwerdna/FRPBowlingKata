import {a, div, h1, h3, img, input, label, span} from '@cycle/dom';

export function view(model$) {
  return model$.map(bowlingLines =>
    div('.container', [
      vTitle(),
      ...bowlingLines,
      vInput(),
      vFooter()
    ])
  );
}

function vTitle() {
  return div('#title', [
    h1([
      img({props: {src: 'Rx_Logo_S.png'}}),
      a(
        {props: {href: 'https://github.com/wizardwerdna/FRPBowlingKata'}},
        'FRP Bowling'
      ),
      img({props: {src: 'CycleJS_Logo.png'}}),
    ]),
    h3('The Classic Kata in RxJS and CycleJS')
  ]);
}

function vInput() {
  return div('#input', [
    label('.playerLabel', 'New Player:'),
    input('.name', {
      props: {type: 'text', autofocus: true},
      hook: {
        update: (oldvNode, {elm}) => elm.value = ''
      }
    })
  ]);
}

function vFooter() {
  return div('#footer', [
    a(
      '.footlink',
      {props: {href: 'https://github.com/wizardwerdna/FRPBowlingKata'}},
      'FRP Bowling'
    ),
    span(' built by '),
    a(
      '.footlinke',
      {props: {href: 'mailto:wizardwerdna@gmail.com'}},
      'Andrew C. Greenberg'
    )
  ]);
}
