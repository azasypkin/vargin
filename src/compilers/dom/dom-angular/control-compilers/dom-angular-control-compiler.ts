import { DOMStaticControlCompiler } from 'compilers/dom/dom-static/control-compilers/dom-static-control-compiler';
import { Control } from 'core/controls/control';

export class DOMAngularControlCompiler<TControl extends Control> extends DOMStaticControlCompiler<TControl> {

  getEventHandlers(control: Control): Array<[string, string]> {
    let eventHandlers: Array<[string, string]> = [];

    control.events.forEach((actions, eventKey) => {
      if (actions.getValue().length) {
        eventHandlers.push([
          `(${eventKey})`, `onControlAction(\'${control.id}\', \'${eventKey}\')`
        ]);
      }
    });

    return eventHandlers;
  }

  static getDynamicPropertyValue(
    control: Control, propertyName: string
  ) {
    return `{{getControl(\'${control.id}\').${propertyName}.getValue()}}`;
  }
}