import { VisualControl } from 'core/controls/visual/visual-control';
import { VisualControlMetadata } from 'core/controls/visual/visual-control-metadata';

import { ControlService } from 'services/control-service';

import { IControlCompiler } from 'compilers/control-compiler';
import {
  IJSONAction,
  JSONActionCompiler
} from 'compilers/json/json-action-compiler';

export interface IJSONControl {
  type: string;
  id?: string;
  children?: IJSONControl[];
  parameters?: {
    properties?: Iterable<[string, string]>;
    events?: Iterable<[string, Array<IJSONAction>]>;
    styles?: Iterable<[string, string]>;
  };
}

export class JSONControlCompiler implements IControlCompiler<IJSONControl> {
  private _actionCompiler: JSONActionCompiler = new JSONActionCompiler();

  compile(control) {
    var parameters = {
      properties: [],
      events: [],
      styles: []
    };

    control.meta.supportedProperties.forEach((property, propertyKey) => {
      parameters.properties.push([propertyKey, control[propertyKey].getValue()]);
    });

    control.meta.supportedEvents.forEach((eventProperty, eventKey) => {
      parameters.events.push([
        eventKey,
        control.events.get(eventKey).getValue().map(
          (action) => this._actionCompiler.compile(action)
        )
      ]);
    });

    if (VisualControl.isVisualControl(control)) {
      let visualControl = <VisualControl>control;

      (<VisualControlMetadata>visualControl.meta).supportedStyles.forEach(
        (style, styleKey) => {
          parameters.styles.push(
            [styleKey, visualControl.styles.get(styleKey).getValue()]
          );
        }
      );
    }

    return {
      id: control.id,
      type: control.meta.type,
      children: control.getChildren().map((child) => this.compile(child)),
      parameters: parameters
    };
  }

  decompile(compiledControl: IJSONControl) {
    var parameters = {
      properties: null,
      styles: null,
      events: null
    };

    var controlParameters = compiledControl.parameters;
    if (controlParameters) {
      if (controlParameters.properties) {
        parameters.properties = new Map(controlParameters.properties);
      }

      if (controlParameters.styles) {
        parameters.styles = new Map(controlParameters.styles);
      }

      if (controlParameters.events) {
        parameters.events = new Map();
        var compiledEvents = new Map(controlParameters.events);

        compiledEvents.forEach((compiledActions, eventKey) => {
          parameters.events.set(
            eventKey,
            compiledActions.map(
              (compiledAction) => this._actionCompiler.decompile(compiledAction)
            )
          )
        })

      }
    }

    var control = ControlService.createByType(
      compiledControl.type, parameters, compiledControl.id
    );

    if (compiledControl.children && compiledControl.children.length) {
      compiledControl.children.forEach(
        (child) => control.addChild(this.decompile(child))
      );
    }

    return control;
  }
}