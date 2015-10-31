import {
  DOMAngularControlCompiler
} from 'compilers/dom/dom-angular/control-compilers/dom-angular-control-compiler';
import { TextInputControl } from 'core/controls/visual/text-input-control';
import { ICompiledCSSClass } from 'compilers/dom/css-compiler';

export class TextInputControlCompiler extends DOMAngularControlCompiler<TextInputControl> {
  getMarkup(control: TextInputControl, cssClass: ICompiledCSSClass) {
    return this.buildHTMLElement('input', '', new Map<string, string>(
      <[string, string][]>[
        ['id', control.id],
        ['class', cssClass.name],
        ['type', 'text'],
        ['placeholder', this.bindValue(control, 'placeholder')],
        ['value', this.bindValue(control, 'value')],
        ...this.getEventHandlers(control)
      ]
    ));
  }
}
