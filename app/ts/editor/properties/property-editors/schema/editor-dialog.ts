/// <reference path="../../../../../../typings/tsd.d.ts" />
import { Component, Inject, NgFor, NgIf, View } from 'angular2/angular2';
import { IProperty, Property } from 'core/property';
import { Schema, SchemaFieldType } from 'core/data/schema';

@Component({
  selector: 'schema-property-editor-dialog'
})
@View({
  template: `
    <header class="schema-editor-dialog__header">Define Schema</header>
    <ul class="vargin-list">
      <li class="vargin-list__item" *ng-for="#field of schema.fields; #i = index">
        <input #fieldname
               type="text"
               placeholder="Define field name"
               [value]="field.name"
               (keyup)="onFieldNameChange(i, fieldname.value)" />
        <select #fieldtype
                [value]="field.type"
                (change)="onFieldTypeChange(i, fieldtype.value)" >
          <option value="0">String</option>
          <option value="1">Number</option>
          <option value="2">Date</option>
          <option value="3">Binary</option>
        </select>
        <button *ng-if="schema.fields.length > 1"
                class="vargin-list__remove-item"
                (click)="removeField(i)">
          &#x274c;
        </button>
      </li>
    </ul>
    <button class="schema-field__add" (click)="addField()">+ Add field</button>
  `,
  directives: [NgFor, NgIf]
})
export class SchemaPropertyEditorDialog {
  private schema: Schema;

  constructor(@Inject(Schema) schema: Schema) {
    this.schema = schema;

    if (!this.schema.fields.length) {
      this.addField();
    }
  }

  private removeField(index) {
    this.schema.fields.splice(index, 1);
  }

  private addField() {
    this.schema.fields.push({
      name: '',
      type: SchemaFieldType.STRING
    });
  }

  private onFieldTypeChange(index: number, type: string) {
    this.schema.fields[index].type = +type;
  }

  private onFieldNameChange(index: number, name: string) {
    this.schema.fields[index].name = name;
  }
}