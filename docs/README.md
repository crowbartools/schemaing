# Usage

## validate
```ts
/** Validates a value against a given schema
 *
 * @param schema The schema to validate the input against
 * @param input The value to validate against the schema
 * @returns A promise that resolves true if the value validates
 *          against the schema, false otherwise
 */
type validate = (schema: Schema, input: unknown) => Promise<boolean>;
```

## validateSchema
```ts
/** Validates a schema
 *
 * @param schema The schema to validate
 * @returns true if the input is a valid schema, false others
 */
type validateSchema = (schema: unknown) => boolean;
```

## use
```ts
/**Validates the input against the given schema
 *
 * @param input The input to validate
 * @returns true if the input is a valid schema, false others
 */
type Validator = (input: unknown) => Promise<boolean>;

/** Returns a validator function that will validate a given input
 *  against the specified schema
 *
 * @param schema The schema that the validator will validate inputs against
 * @return A validator function that will use the given schema for validation
 */
type use = (schema: Schema) => Validator
```