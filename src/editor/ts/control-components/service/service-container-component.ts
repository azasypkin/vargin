/// <reference path="../../../../../typings/tsd.d.ts" />
import {
  Component,
  Inject,
  NgFor,
  NgStyle,
  OnChanges,
  Optional,
  Renderer,
  View,
  ViewContainerRef
} from 'angular2/angular2';

import { Control } from 'core/controls/control';
import { ContainerControl } from 'core/controls/visual/container-control';
import { DynamicComponent } from 'editor/ts/control-components/dynamic-component';
import { BaseComponent } from 'editor/ts/control-components/base-component';

@Component({
  selector: 'vargin-service-container',
  properties: ['control']
})
@View({
  template: `
    <div
      class="vargin-component"
      [class.vargin-component_drop-target]="dragEnterCounter > 0"
      [ng-style]="getControlStyles()"
      (dragleave)="onDragLeave($event)"
      (dragover)="onDragOver($event)"
      (dragenter)="onDragEnter($event)"
      (drop)="onDrop($event)">
      <vargin-dynamic *ng-for="#child of getChildren()"
                      [control]="child"
                      [ng-style]="getContainerStyles(child)"
                      attr.type="{{child.meta.type}}">
      </vargin-dynamic>
    </div>
  `,
  directives: [DynamicComponent, NgFor, NgStyle]
})
export class ServiceContainerComponent extends BaseComponent implements OnChanges  {
  control: ContainerControl;

  constructor(
    @Inject(Renderer) renderer: Renderer,
    @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
    @Optional() @Inject(Control) control: ContainerControl
  ) {
    super(renderer, viewContainer, control);
  }

  acceptDrop(typesToDrop: string[]) {
    return typesToDrop.indexOf('text/service') >= 0;
  }

  onChanges() {
    if (this.control) {
      this.setupStyles();
    }
  }

  private setupStyles() {
    this.control.styles.get('align-items').setValue('stretch');
    this.control.styles.get('display').setValue('flex');
    this.control.styles.get('min-height').setValue('0');
    this.control.styles.get('min-width').setValue('0');
  }
}