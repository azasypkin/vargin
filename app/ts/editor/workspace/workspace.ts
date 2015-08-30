/// <reference path="../../../../typings/tsd.d.ts" />
import { Component, NgFor, NgIf, View } from 'angular2/angular2';
import ContainerComponent from 'editor/control-components/visual/container-component';
import { ApplicationService } from 'services/application-service';
import { Workspace, WorkspaceService } from 'services/workspace-service';
import {
  JSONApplicationCompiler
} from 'compilers/json/json-application-compiler';
import {
  DOMStaticApplicationCompiler
} from 'compilers/dom/dom-static/dom-static-application-compiler';
import {
  DOMAngularApplicationCompiler
} from 'compilers/dom/dom-angular/dom-angular-application-compiler';

@Component({
  selector: 'vargin-workspace'
})
@View({
  template: `
    <ul class="workspace-pager">
      <li class="workspace-pager__page{{activePageIndex === i ? ' workspace-pager__page_active' : ''}}"
          *ng-for="#page of workspace.application.pages; #i = index"
          (click)="activePageIndex = i">
        {{page.name}}
        <button class="workspace-pager__page__remove" title="Remove page"
                *ng-if="workspace.application.pages.length > 1"
                (click)="removePage(page.id)">&#x274c;</button>
      </li>
      <li class="workspace-pager__add-new">
        <button (click)="addPage()">+ Add page</button>
      </li>
    </ul>
    <section class="workspace-editor">
      <vargin-container [control]="getRoot()"></vargin-container>
    </section>
    <footer class="workspace-toolbar">
      <button (click)="startFromScratch()">Start from scratch</button>
      <button (click)="toJSON('a')">To JSON</button>
      <button (click)="toAngularApp()">To Angular App</button>
      <button (click)="toStaticHTML()">To Static HTML App</button>
    </footer>
  `,
  directives: [ContainerComponent, NgFor, NgIf]
})
class VarginWorkspace {
  private workspace: Workspace;
  private activePageIndex: number = 0;

  private jsonCompiler: JSONApplicationCompiler;
  private domStaticCompiler: DOMStaticApplicationCompiler;
  private domAngularCompiler: DOMAngularApplicationCompiler;

  constructor() {
    this.jsonCompiler = new JSONApplicationCompiler();
    this.domStaticCompiler = new DOMStaticApplicationCompiler();
    this.domAngularCompiler = new DOMAngularApplicationCompiler();

    WorkspaceService.create(ApplicationService.current).then(
      (workspace) => this.workspace = workspace
    );
  }

  addPage() {
    this.workspace.application.addPage();
  }

  removePage(pageId) {
    this.workspace.application.removePage(pageId);

    if (this.activePageIndex >= this.workspace.application.pages.length) {
      this.activePageIndex = this.workspace.application.pages.length - 1;
    }
  }

  getRoot() {
    return this.workspace.application.pages[this.activePageIndex].root;
  }

  toJSON() {
    window.open(
      'data:application/json,' + encodeURIComponent(
        this.jsonCompiler.compile(this.workspace.application)
      )
    );
  }

  toAngularApp() {
    var compiledApp = this.domAngularCompiler.compile(
      this.workspace.application
    );

    var jsonCompiledApplication = this.jsonCompiler.compile(
      this.workspace.application
    );

    var angularAppWindow = window.open(
      'ng-compiler/index.html?ts=' + Date.now()
    );

    angularAppWindow.addEventListener('load', function onAppWindowLoad() {
      angularAppWindow.removeEventListener('load', onAppWindowLoad);

      angularAppWindow.postMessage({
        compiledApp: compiledApp,
        jsonCompiledApplication: jsonCompiledApplication
      }, '*');
    });
  }

  toStaticHTML() {
    window.open(
      'data:text/html,' + encodeURIComponent(
        this.domStaticCompiler.compile(this.workspace.application)
      )
    );
  }

  startFromScratch() {
    this.activePageIndex = 0;

    ApplicationService.reset();

    WorkspaceService.create(ApplicationService.current).then(
      (workspace) => this.workspace = workspace
    );
  }
}

export default VarginWorkspace;