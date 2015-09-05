/// <reference path="../../../../typings/tsd.d.ts" />
import {
  Component,
  Inject,
  NgFor,
  View
} from 'angular2/angular2';
import { IAction } from 'core/actions/action';
import { IProperty, Property } from 'core/property';

import { ActionService } from 'services/action-service';

import { AlertAction } from 'core/actions/alert-action';
import { ChangePropertyAction } from 'core/actions/change-property-action';

@Component({
  selector: 'vargin-action-list'
})
@View({
  template: `
    <section>
      <ul class="vargin-action-list" #actioneditor>
        <li class="vargin-action-list__item"
            *ng-for="#action of property.getValue()">
          <span (click)="editAction(action)">{{ action.name }}</span>
          <button class="vargin-action-list__remove"
                  (click)="removeAction(action)">
            &#x274c;
          </button>
        </li>
        <li class="vargin-action-list__item">
          <select #newaction (change)="addNewAction(newaction)">
            <option value="default" selected="{{isDefaultSelected}}">
              (+ Choose new action)
            </option>
            <option value="alert-action">Alert</option>
            <option value="change-property-action">Change property</option>
          </select>
        </li>
      </ul>
    </section>
  `,
  directives: [NgFor]
})
export class ActionList {
  private property: IProperty<Array<IAction>>;
  private isDefaultSelected: boolean = true;

  constructor(@Inject(Property) property: IProperty<Array<IAction>>) {
    this.property = property;
  }

  addNewAction(newActionSelect: HTMLSelectElement) {
    switch (newActionSelect.value) {
      case 'alert-action':
        this.property.getValue().push(new AlertAction());
        break;
      case 'change-property-action':
        this.property.getValue().push(
          new ChangePropertyAction()
        );
        break;
      case 'default':
        return;
      default:
        throw new Error('Unsupported action ' + newActionSelect.value);
    }

    newActionSelect.value = 'default';
  }

  editAction(action: IAction) {
    ActionService.selectAction(action);
  }

  removeAction(action: IAction) {
    let propertyActions = this.property.getValue();
    propertyActions.splice(propertyActions.indexOf(action), 1);
  }
}
