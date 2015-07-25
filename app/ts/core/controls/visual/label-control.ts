/// <reference path="../../../../../typings/tsd.d.ts" />
import BaseVisualControl from 'core/controls/visual/base-visual-control';
import { ControlProperty } from 'core/controls/control-property';
import {
    VisualControlMetadata
} from 'core/controls/visual/visual-control-metadata';
import { IProperty, Property } from 'core/property';
import { IAction } from 'core/actions/action';
import { StyleService } from 'services/style-service';
import { EventService } from 'services/event-service';

const SUPPORTED_PROPERTIES =  new Map<string, IProperty<string>>([
  ['text', new Property('Text', '[Text]')]
]);

const SUPPORTED_STYLES = new Map<string, IProperty<string>>([
  ['color', StyleService.getDescriptor('color')],
  [
    'background-color',
    new ControlProperty(
      StyleService.getDescriptor('background-color'), '#cccaaa'
    )
  ],
  ['text-decoration', StyleService.getDescriptor('text-decoration')],
]);

const SUPPORTED_EVENTS = new Map<string, IProperty<Array<IAction>>>([
  ['click', EventService.getDescriptor('click')],
  ['hover', EventService.getDescriptor('hover')]
]);

const METADATA = Object.freeze(new VisualControlMetadata(
  'label',
  'Label',
  'HTML Label',
  SUPPORTED_EVENTS,
  SUPPORTED_PROPERTIES,
  SUPPORTED_STYLES
));

export default class LabelControl extends BaseVisualControl {
  constructor(id, properties?, styles?, events?) {
    super(id, LabelControl.getMeta(), properties, styles, events);
  }

  get text() {
    return this._properties.get('text');
  }

  static getMeta() {
    return METADATA;
  }
}