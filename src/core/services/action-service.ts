import { IOverrides } from '../overrides/overrides';

import { IAction } from '../actions/action';
import { AlertAction } from '../actions/alert-action';
import { BroadcastAction } from '../actions/broadcast-action';
import { ChangePropertyAction } from '../actions/change-property-action';
import { ChangeOverridesAction } from '../actions/change-overrides-action';
import { NavigateAction } from '../actions/navigate-action';

const ACTIONS = new Map<string, any>(<[string, any][]>[
  ['alert-action', AlertAction],
  ['broadcast-action', BroadcastAction],
  ['change-property-action', ChangePropertyAction],
  ['change-overrides-action', ChangeOverridesAction],
  ['navigate-action', NavigateAction]
]);

export class ActionService {
  static createByType<TAction extends IAction>(
    type: string, overrides?: IOverrides
  ): TAction {
    if (!ACTIONS.has(type)) {
      throw new Error('Not supported action type: ' + type);
    }

    let ActionClass = <{ new(overrides?: IOverrides): TAction; }>
      ACTIONS.get(type);

    return new ActionClass(overrides);
  }

  static clone<TAction extends IAction>(action: TAction): TAction {
    return ActionService.createByType<TAction>(
      action.meta.type, action.overrides.clone()
    );
  }
}
