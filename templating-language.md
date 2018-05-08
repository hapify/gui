
# Hapify templating language

Work in progress...

## Wrappers

### Operators

Open: `<<`
Close: `>>`

Usually used for binary operations. Should be escapable:
Ignore `\<<` (and maybe `\>>`) and replace it by `<<`

### Raw inputs

Open: `<<<`
Close: `>>>`

Also escapable

## Syntax

```
<<@ F se*so/lb f>>
<<@>>
```

Explanations:
- `F` is the variable
- `@` is the operation
- `se*so/lb` is the condition
- `f` is the assignment variable

### Variable naming

We use lower case for an object (ie a specific field or a model)
We use upper case for an array of object (ie a field list or a model list)

To refer to the root variable, we use `_`.
This will refer to the model in a single model template and to the models list in a multiple model template.

By default, in a case of a single model template:
- `F` refers to the fields list: `model.fields.list`
- `D` refers to the models list: `model.dependencies.list`
- `R` refers to the models list: `model.referencedIn`

### Loop operator

The loop operation (foreach) is `@`. It applies only to an array.

#### Usage with fields

Example:
```
<<@ F se*so/lb f>>
    .....
<<@>>
```

This is equivalent to
```javascript
for(let f of model.fields.list.filter((f) => f.searchable && f.sortable && !f.label)) {
    out += '.....';
}
```

or in short dot syntax:
```
{{~it.m.f.f((f) => f.searchable && f.sortable && !f.label))}}
    .....
{{~}}
```

##### Without conditions

Example:
```
<<@ F f>>
    .....
<<@>>
```

This will loop over all fields.

#### Usage with models

In a multiple models template, to loop over all models (root variable), the syntax will be:

```
<<@ _ m>>
    .....
<<@>>
```

`m` is the assigned variable

For instance, no conditions are allowed on models. To do so, use a conditional operator.

##### Sub-models

This will loop over dependencies

```
<<@ D m>>
    .....
<<@>>
```

## Conditional operator

This operator can be used over an object or an array of object.
If used over an array it will test the length of the array filtered by the condition.

Example:
```
<<? f se*so>>
    .....
<<?>>
```

Is equivalent to
```javascript
if (f.searchable && f.sortable) {
    out += '.....';
}
```

Example over an array:
```
<<? F se*so>>
    .....
<<?>>
```

Is equivalent to
```javascript
if (model.fields.list.filter((f) => f.searchable && f.sortable).length) {
    out += '.....';
}
```

## Names printing

`<<f A>>`

## Fields operators & filters

### Filter

## Examples

### Raw inputs

```
<<< const l = model.fields.length; >>>
```

```
<<<
function fieldName(f) {
    return f.names.underscore;
}
>>>
```

