import { Control } from 'core/controls/control';

export class ApplicationPage {
  private _id: string;
  private _name: string;
  private _root: Control;

  constructor(id, name, root) {
    this._id = id;
    this._name = name;
    this._root = root;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get root() {
    return this._root;
  }
}