export class ControlProperty<T> {
  name: string;
  value: T;
  editorVisible: boolean;

  constructor(name: string, value?: T, editorVisible?: boolean) {
    this.name = name;
    this.value = value !== undefined ? value : null;
    this.editorVisible = typeof editorVisible !== 'undefined' ?
      editorVisible : true;
  }
}

export class PredefinedControlProperty extends ControlProperty<string> {
  options: Array<ControlProperty<string>>;

  constructor(
    name: string,
    options: Array<ControlProperty<string>>,
    value?: string,
    editorVisible?: boolean
  ) {
    super(name, value !== undefined ? value : options[0].value, editorVisible);

    this.options = options;
  }
}

export class TextControlProperty extends ControlProperty<string> {
  constructor(text?: string) {
    super('Text', text || '');
  }
}

export class TitleControlProperty extends ControlProperty<string> {
  constructor(text?: string) {
    super('Title', text || '');
  }
}