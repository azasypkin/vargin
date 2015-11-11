import { DOMAngularControlCompiler } from '../dom-angular-control-compiler';
import {
  ListControl,
  ListItemControl
} from '../../../../../core/controls/visual/list-control';
import { ICompiledCSSClass } from '../../../css-compiler';

export class ListItemControlCompiler extends DOMAngularControlCompiler<ListItemControl> {
  getMarkup(control: ListItemControl, cssClass: ICompiledCSSClass) {
    let datasourceId = control.parent.getProperty('datasource').getValue();
    return this.buildHTMLElement(
      'div',
      control.getChildren().length ? '{children}' : '',
      new Map<string, string>(<[string, string][]>[
        [
          '*ng-for',
          `#item of getDatasource('${datasourceId}').items; #i = index`
        ],
        ['id', control.id],
        ['class', cssClass.name],
        ...this.getEventHandlers(control)
      ])
    );
  }
}
