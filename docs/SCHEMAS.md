# Schemas

A schema is a definition that an input is to be validated against. Schemaing supports equivulants to all JSON types aswell as a few QoL aliases


## Any
The `any` Schema represents a value that can be anything

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'any'` | yes | |
| `validate` | [`Validate`]() | no | Validator function to call if the input passes internal |

### Examples
```js
{ type: 'any' }
{ type: 'any', validate: value => value != null }
```


## Literal
The `literal` Schema represents an exact value.

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'literal'` | yes | |
| `is` | `any` | yes | Input must exactly match the given value |

```js
{ type: 'literal', is: 'example' }
```


## Undefined
The `undefined` Schema represents a value being undefined

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'undefined'` | yes | |

### Examples
```js
{ type: 'undefined' }
```


## Null
The `null` Schema represents a value declared as null or seemingly empty

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'null'` | yes | |
| `allowUndefined` | `boolean` | no | treat `undefined` as null |
| `allowZero` | `boolean` | no | treat `0` as null |
| `allowEmptyString` | `boolean` | no | treat empty strings as null |
| `loose` | `boolean` | no | treat `undefined`, `0`, and empty strings as null |

### Examples
```js
{ type: 'null' }
{ type: 'null', allowUndefined: true }
{ type: 'null', allowZero: true }
{ type: 'null', allowUndefined: true, allowZero: true }
{ type: 'null', allowEmptyString: true }
{ type: 'null', loose: true }
```


## Boolean
The `boolean` Schema represents a true or false value

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'boolean'` | yes | |
| `is` | `boolean` | no | Input must be the specified value |

### Examples
```js
{ type: 'boolean' }
{ type: 'boolean', is: true }
{ type: 'boolean', is: false }
```


## Number
The `number` Schema represents numerical values

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'number'` | yes | |
| `loose` | `boolean` | no | Attempt to convert string input to numerical value |
| `integer` | `boolean` | no | input must be a whole number |
| `unsigned` | `boolean` | no | input must not be less than `0` |
| `range` | `Range` | no | The input must fall within the specified range |
| `is` | `number` | no | Input must be the specified value |
| `validate` | [`Validate`]() | no | Validator function to call if the input passes internal tests |


#### Range
| Property | Value | Required | Description |
|--|--|--|--|
| `min` | `number` | no | The input must be atleast the given value |
| `max` | `number` | no | The input must not exceed the given value |
| `over` | `number` | no | The input must be greater than the given value |
| `under` | `number` | no | The input must be less than the given value value |

\* `min` cannot be specified with `over`
\* `max` cannot be specified with `under`

### Examples
```js
{ type: 'number' }
{ type: 'number', loose: true }
{ type: 'number', integer: true }
{ type: 'number', unsigned: true }
{ type: 'number', unsigned: true, integer: true }
{ type: 'number', loose: true, unsigned: true, integer: true }
{ type: 'number', range: { min: 10 }}
{ type: 'number', range: { min: 10, max: 20 }}
{ type: 'number', range: { min: 10, under: 21 }}
{ type: 'number', validate: value => value < 100 }
```

## String
The `string` Schema represents text values

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'string'` | yes | |
| `loose` | `boolean` | no | Converts null, boolean and numerical values into strings |
| `notEmpty` | `boolean` | no | Input must not be empty |
| `match` | `RegExp` | no | Input must match the specified regexp |
| `is` | `string` | no | Input must be the given value |
| `validate` | [`Validate`]() | no | Validator function to call if the input passes internal | tests |

### Examples
```js
{ type: 'string' }
{ type: 'string', loose: true }
{ type: 'string', notEmpty: true }
{ type: 'string', match: /^[a-z]+$/ }
{ type: 'string', is: 'example' }
{ type: 'string', validate: value => value.toUpperCase() === 'EXAMPLE' }
```


## Symbol
The `symbol` Schema represents a Symbol value
| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'symbol'` | yes | |

### Examples
```js
{ type: 'symbol' }
```


## Array
todo

## Object
todo

## Record
todo


# Schema Aliases

Schema aliases represent preconfigured schemas and may be used inplace of a `Schema`

| Alias | Equivulant |
|--|--|
| `any` | `{ type: 'any' }` |
| `unknown` | `{ type: 'any' }` |
| `undefined` | `{ type: 'undefined' }` |
| `void` | `{ type: 'undefined' }` |
| `null` | `{ type: 'null' }` |
| `nullish` | `{ type: 'null', allowUndefined: true }` |
| `null~` | `{ type: 'null', loose: true }` |
| `boolean` | `{ type: 'boolean' }` |
| `bool` | `{ type: 'boolean' }` |
| `true` | `{ type: 'boolean', is: true }` |
| `false` | `{ type: 'boolean', is: false }` |
| `number` | `{ type: 'number' }` |
| `number~` | `{ type: 'number', loose: true }` |
| `int` | `{ type: 'number', integer: true }` |
| `int~` | `{ type: 'number', loose: true, integer: true }` |
| `uint` | `{ type: 'number', unsigned: true, integer: true }` |
| `uint~` | `{ type: 'number', loose: true, unsigned: true, integer: true }` |
| `string` | `{ type: 'string' }` |
| `string!` | `{ type: 'string', notEmpty: true }` |
| `symbol` | `{ type: 'symbol' }` |
| `array` | `{ type: 'array', as: 'any' }` |
| `object` | `{ type: 'object', allowExtraProperties: true, properties: {} }` |