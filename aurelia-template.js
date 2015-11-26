import {initialize as initializeBrowserPal} from 'aurelia-pal-browser';
import {Container} from 'aurelia-dependency-injection';
import {configure as configureBindingLanguage} from 'aurelia-templating-binding';
import {
  ViewCompiler,
  ViewResources,
  HtmlBehaviorResource,
  BehaviorInstruction,
  ViewSlot
} from 'aurelia-templating';


import {
    If,
    Repeat,
    OneTimeBindingBehavior,
    DebounceBindingBehavior,
    UpdateTriggerBindingBehavior
} from 'aurelia-templating-resources';

// import {ToggleBindingBehavior} from 'cstm/toggle-binding-behavior';


import {metadata} from 'aurelia-metadata';


// use the browser PAL implementation.
initializeBrowserPal();

// create the root container.
let container = new Container();

// register the standard binding language implementation.
configureBindingLanguage({ container });

// create the root view resources.
function createViewResources(container) {
  let resources = new ViewResources();

  // repeat
  let resource = metadata.get(metadata.resource, Repeat);
  resource.target = Repeat;
  resource.initialize(container, Repeat);
  resources.registerAttribute('repeat', resource, 'repeat');
  container.registerInstance(ViewResources, resources);

  // slice value converter
  resources.registerValueConverter('slice', { toView: array => array ? array.slice(0) : array });

  // toLength value converter
  resources.registerValueConverter('toLength', { toView: collection => collection ? (collection.length || collection.size || 0) : 0 });

    // no-op binding behavior
    resources.registerBindingBehavior('noopBehavior', { bind: () => {}, unbind: () => {} });

  // no-op binding behavior
  resources.registerBindingBehavior('debounce', new DebounceBindingBehavior());

  // no-op binding behavior
  resources.registerBindingBehavior('updateTrigger', new UpdateTriggerBindingBehavior());

  // oneTime binding behavior
  resources.registerBindingBehavior('oneTime', new OneTimeBindingBehavior());

  // oneTime binding behaviormodel - My
  // resources.registerBindingBehavior('toggle',  new ToggleBindingBehavior());
}
createViewResources(container);

// create the view compiler.
let viewCompiler = container.get(ViewCompiler);

// create the host element and view-slot for all the tests
let host = document.getElementById('my-element');
let viewSlot = new ViewSlot(host, true);

// creates a controller given a html template string and a viewmodel instance.
function createController(template, viewModel) {
  let childContainer = container.createChild();

  let viewFactory = viewCompiler.compile(template);

  let metadata = new HtmlBehaviorResource();
  function App() {
      // move it to predefined bindings
      this.toggle = function(obj, key, val) {
        console.info("setting", obj, "'s property ", key, " to ", val);
        obj[key] = val;
      }
      this.increment = function(obj, key, val) {
        console.info("setting", obj, "'s property ", key, " to ", val);
        obj[key] = val;
      }
      //---
  }
  metadata.initialize(childContainer, App);
  metadata.elementName = metadata.htmlName = 'app';

  let controller = metadata.create(childContainer, BehaviorInstruction.dynamic(host, viewModel, viewFactory));
  controller.automate();

  viewSlot.removeAll();
  viewSlot.add(controller.view);

  return controller;
}


let viewModel, controller;
var template = document.getElementById('my-template');
viewModel = window.myData;
/// this should be moved to binding behaviors
    Object.defineProperty(viewModel, 'toggle', {
        value: function(obj, key, val) {
            console.info("setting", obj, "'s property ", key, " to ", val);
            obj[key] = val;
        }
    });
    Object.defineProperty(viewModel, 'increment', {
        value: function(obj, key) {
            console.info("incrementing", obj, "'s property ", key);
            obj[key]++;
        }
    });
/// --

controller = createController(template, viewModel);
//
setTimeout(()=>{
  // controller.unbind();
  },3000);

//=======
//
// (function(){
//     var AureliaTemplatePrototype = Object.create( (HTMLTemplateElement || HTMLElement ).prototype);
//
//
//     AureliaTemplatePrototype.createdCallback = function(){
//         var model = null;
//         Object.defineProperty(this, "model",{
//             set: function(newValue){
//                 model = newValue;
//                 this.attachModel(newValue);
//             },
//             get: function(){
//              return model;
//             }
//         });
//     };
//     AureliaTemplatePrototype.attachedCallback = function () {
//       this.isAttached = true;
//
//
//
//       this.controller = createController(template, viewModel);
//       // this.loadTemplate_();
//     };
//     AureliaTemplatePrototype.detachedCallback = function(){
//         this.controller.unbind();
//
//       this.isAttached = false;
//       // this.clear();
//
//     };
//     scope.JuicyHTMLElement = document.registerElement('aurelia-template', {
//       prototype: AureliaTemplatePrototype,
//       extends: "template"
//     });
//
// }())
