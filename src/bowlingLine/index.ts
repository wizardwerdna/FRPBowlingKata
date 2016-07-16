import {intent} from './intent';
import {model} from './model';
import {view} from './view';

export function BowlingLine({DOM, props$}) {

  return {DOM:
    view(
      model(
        intent(DOM), props$
      )
    )
  };

}
