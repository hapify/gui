# CodeMyModel

## Model injected in the templates

### Single model

The following object is injected in a template for file generation.
Some keys have a shortened alias.

**Model object**

+ `id` (string): an unique id
+ `name` (string): The name of the model, as the user entered it.
+ `names` (object): All names computed from the `name` property.
  + `raw` (string): The name of the model, as the user entered it. Example `Online item`.
  + `hyphen` (string): The name with hyphens and lower case. Example `online-item`.
  + `underscore` (string): The name with underscores and lower case. Example `online_item`.
  + `oneWord` (string): The name joined and lower case. Example `onlineitem`.
  + `lowerCamel` (string): The name as lower camel case. Example `onlineItem`.
  + `upperCamel` (string): The name as upper camel case. Example `OnlineItem`.
  + `wordsLower` (string): The name as words in lower case. Example `online item`.
  + `wordsUpper` (string): The name as words with upper case on first letters. Example `Online Item`.
+ `fields` - alias `f` (object): An object containing all fields, grouped in different arrays.
  + `list` - alias `l` (array): An array containing all fields of the model.
  + `primary` - alias `p` (Field): The primary field of the model. `null` if no primary field is defined.
  + `unique` - alias `u` (array): An array containing all fields flagged as `unique`.
  + `label` - alias `lb` (array): An array containing all fields flagged as `label`.
  + `nullable` - alias `n` (array): An array containing all fields flagged as `nullable`.
  + `searchable` - alias `se` (array): An array containing all fields flagged as `searchable`.
  + `sortable` - alias `so` (array): An array containing all fields flagged as `sortable`.
  + `isPrivate` - alias `ip` (array): An array containing all fields flagged as `private`.
  + `internal` - alias `i` (array): An array containing all fields flagged as `internal`.
  + `filter` - alias `f` (Function): A function for filtering fields with a custom rule. Equivalent of `model.fields.list.filter`.
  + `references` - alias `r` - non-deep model only (array): An array containing all fields of type `entity`.
    + `filter` - alias `f` (function): A function for filtering the array.
  + `dependencies` - alias `d` - non-deep model only (object): An object containing dependencies (to other models) of this model. A model has a dependency if one of this field is of type `entity`.
    + `list` - alias `l` (array): An array containing all dependency models, but self. These models are added as "deep models".
    + `self` - alias `s` (boolean): A boolean indicating if this model has a self-dependency.
    + `filter` - alias `f` (function): A function to filter dependencies.
      + First argument (function - default `(f) => f`): The filtering function receiving a model object
      + Second argument (boolean - default `true`): A boolean indicating if we should filter the self dependency.
  + `referencedIn` - alias `ri` - non-deep model only (array): An array containing models that refer to this one. These models are added as "deep models".
    + `filter` - alias `f` (function): A function for filtering the array.
            
**Field object**

+ `name` (string): The name of the model, as the user entered it.
+ `names` (object): All names computed from the `name` property. As for the model object
+ `primary` (boolean): Indicates if the field is flagged as `primary`.
+ `unique` (boolean): Indicates if the field is flagged as `unique`.
+ `label` (boolean): Indicates if the field is flagged as `label`.
+ `nullable` (boolean): Indicates if the field is flagged as `nullable`.
+ `searchable` (boolean): Indicates if the field is flagged as `searchable`.
+ `sortable` (boolean): Indicates if the field is flagged as `sortable`.
+ `isPrivate` (boolean): Indicates if the field is flagged as `private`.
+ `internal` (boolean): Indicates if the field is flagged as `internal`.
+ `type` (string): The type of the string. Can be `string`, `number`, `boolean`, `datetime` or `entity`.
+ `reference` (string): The id of the target model if the field is of type `entity`. `null` otherwise

## Angular documetation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.9.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

