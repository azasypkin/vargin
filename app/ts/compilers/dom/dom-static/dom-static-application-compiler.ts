import { Application } from 'core/application';
import { ApplicationPage } from 'core/application-page';

import { Control } from 'core/controls/control';
import { ButtonControl } from 'core/controls/visual/button-control';
import { ContainerControl } from 'core/controls/visual/container-control';
import { DataSourceControl } from 'core/controls/service/datasource-control';
import { LabelControl } from 'core/controls/visual/label-control';
import { RangeControl } from 'core/controls/visual/range-control';

import { IApplicationCompiler } from 'compilers/application-compiler';
import { IControlCompiler } from 'compilers/control-compiler';

import {
  IDOMStaticCompiledControl,
  DOMStaticControlCompiler
} from 'compilers/dom/dom-static/control-compilers/dom-static-control-compiler';

import { ButtonControlCompiler } from 'compilers/dom/dom-static/control-compilers/visual/button-control-compiler';
import { ContainerControlCompiler } from 'compilers/dom/dom-static/control-compilers/visual/container-control-compiler';
import { LabelControlCompiler } from 'compilers/dom/dom-static/control-compilers/visual/label-control-compiler';
import { RangeControlCompiler } from 'compilers/dom/dom-static/control-compilers/visual/range-control-compiler';

const CONTROL_COMPILERS = new Map<Function, DOMStaticControlCompiler<Control>>([
  [ButtonControl, new ButtonControlCompiler()],
  [ContainerControl, new ContainerControlCompiler()],
  [LabelControl, new LabelControlCompiler()],
  [RangeControl, new RangeControlCompiler()]
]);

export class DOMStaticApplicationCompiler
       implements IApplicationCompiler<string> {
  compile(application: Application) {
    var compiledRoot = this.compileControl(application.pages[0].root);

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${application.name}</title>
          <style type="text/css">${compiledRoot.cssClass.text}</style>
        </head>
        <body>${compiledRoot.markup}</body>
      </html>
    `;
  }

  decompile(compiledApplication: string) {
    return null;
  }

  private compileControl(control: Control): IDOMStaticCompiledControl {
    var controlCompiler = <DOMStaticControlCompiler<Control>>
      CONTROL_COMPILERS.get(control.constructor);
    var compiledControl = controlCompiler.compile(control);

    if (control.children && control.children.length) {
      let childrenCssText = '';
      let childrenMarkup = '';

      for (let child of control.children) {
        let compiledChild = this.compileControl(child);

        childrenCssText += compiledChild.cssClass.text;
        childrenMarkup += compiledChild.markup;
      }

      compiledControl.cssClass.text += childrenCssText;
      compiledControl.markup = compiledControl.markup.replace(
        '{children}', childrenMarkup
      );
    }

    return compiledControl;
  }
}