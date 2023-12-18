# Schemas

A schema is a definition that an input is to be validated against. Schemaing supports equivulants to all JSON types aswell as a few QoL aliases


### Any
The `any` Schema represents a value that can be anything

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'any'` | yes | |
| `validate` | [`Validate`]() | no | Validator function to call if the input passes internal |

#### Examples
```js
{ type: 'any' }
{ type: 'any', validate: value => value != null }
```


### Literal
The `literal` Schema represents an exact value.

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'literal'` | yes | |
| `is` | `any` | yes | Input must exactly match the given value |

#### Examples
```js
{ type: 'literal', is: 'example' }
```


### Undefined
The `undefined` Schema represents a value being undefined

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'undefined'` | yes | |

#### Examples
```js
{ type: 'undefined' }
```


### Null
The `null` Schema represents a value declared as null or seemingly empty

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'null'` | yes | |
| `allowUndefined` | `boolean` | no | treat `undefined` as null |
| `allowZero` | `boolean` | no | treat `0` as null |
| `allowEmptyString` | `boolean` | no | treat empty strings as null |
| `loose` | `boolean` | no | treat `undefined`, `0`, and empty strings as null |

#### Examples
```js
{ type: 'null' }
{ type: 'null', allowUndefined: true }
{ type: 'null', allowZero: true }
{ type: 'null', allowUndefined: true, allowZero: true }
{ type: 'null', allowEmptyString: true }
{ type: 'null', loose: true }
```


### Boolean
The `boolean` Schema represents a true or false value

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'boolean'` | yes | |
| `is` | `boolean` | no | Input must be the specified value |

#### Examples
```js
{ type: 'boolean' }
{ type: 'boolean', is: true }
{ type: 'boolean', is: false }
```


### Number
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


#### Examples
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

### String
The `string` Schema represents text values

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'string'` | yes | |
| `loose` | `boolean` | no | Converts null, boolean and numerical values into strings |
| `notEmpty` | `boolean` | no | Input must not be empty |
| `match` | `RegExp` | no | Input must match the specified regexp |
| `is` | `string` | no | Input must be the given value |
| `validate` | [`Validate`]() | no | Validator function to call if the input passes internal | tests |

#### Examples
```js
{ type: 'string' }
{ type: 'string', loose: true }
{ type: 'string', notEmpty: true }
{ type: 'string', match: /^[a-z]+$/ }
{ type: 'string', is: 'example' }
{ type: 'string', validate: value => value.toUpperCase() === 'EXAMPLE' }
```


### Symbol
The `symbol` Schema represents a Symbol value
| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'symbol'` | yes | |

#### Examples
```js
{ type: 'symbol' }
```


### Array

The `array` Schema represents an order lists of values

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'array'` | yes | |
| `notEmpty` | `boolean` | yes | The input must not be empty |
| `as` | `Schema | Schema[]` | no | All items of the value must match the specified schema |
| `content` | `Array<Schema | Schema[]>` | no | Value's first items must match the specified items in order |
| `contentIgnoresAs` | `boolean` | no | Items constrainted by `content` will not be constrained by `as` |
| `validate` | [Validate]() | no | Validator function to call if the input passes internal |

\* If `content` is not specified then `as` MUST be specified.

#### Examples
```js
{ type: 'array', as: 'any' }
{ type: 'array' content: ['string'] }
{ type: 'array', as: ['string', 'number'] }
{ type: 'array', as: ['string', 'number'], content: ['string'] }
// TODO: More
```


### Object

The `object` Schema represents an unorder lists of known key-value items

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'object'` | yes | |
| `properties` | `Properties` | yes | Properties the value must contain |
| `allowExtraProperties` | `boolean` | no | Allows the value to contain properties not listed by `properties` |
| `validate` | [Validate]() | no | Validator function to call if the input passes internal tests |

#### Properties
`properties` is an object literal containing known keys and their respective schema

The schema of each property follows one of two formats

An Extension of each Schema:
| Property | Value | Required | Description |
|--|--|--|--|
| `...Schema`` | | | The Schema constraint of the property |
| `optional` | `boolean` | no | The property is optional |

A list of Schemas:
| Property | Value | Required | Description |
|--|--|--|--|
| `types` | `Schema[]` | yes | A list of schemas the property must match |
| `optional` | `boolean` | no | Indicates if the property is optional |


#### Examples
```js
{ type: 'object', properties: {{ 'key': { type: 'number', integer: true }}}}
{ type: 'object', properties: {{ 'key': { types: ['string', 'number'] }}}}
// TODO: more
```


### Record

The `record` Schema represents an unorder lists of unknown key-value items

| Property | Value | Required | Description |
|--|--|--|--|
| `type` | `'record'` | yes | |
| `keys` | `RecordKeys | RecordKeys[]` | yes | Schema to apply to the keys of the value |
| `values` | `Schema | Schema[]` | yes | Schema to apply to values associated with each key |
| `validate` | [`Validate`]() | no | Validator function to call if the input passes internal tests |

#### RecordKeys
A constrained list of schemas:

* `string` Schema
* `symbol` Schema
* `'string'` Alias
* `'string!'` Alias
* `'symbol'` Alias


#### Examples
```js
{ type: 'record', keys: 'string', values: 'any' }
// TODO: more
```

# Validate
The validate function is called after all internal tests for the respective schema are successful

```ts
/**
 * @param {unknown} value The value that was validated by the schema
 * @returns {Promise<boolean>} The function must resolve to a boolean value indicating if the value passed validation
 */
const validate = (value: unknown) => Promise<boolean>
```


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