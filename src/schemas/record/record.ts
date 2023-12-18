import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';
import { default as validateAgainstSchema, validateSchema as validateGlobalSchema, Schema as Schemas } from '../../index';
import { type Schema as SchemaString, validateSchema as validateSchemaString } from '../string/string';
import { type Schema as SchemaSymbol, validateSchema as validateSchemaSymbol } from '../symbol/symbol';

type RecordKeysSchema = 'symbol' | SchemaSymbol | 'string' | 'string!' | SchemaString;
export interface Schema extends SchemaBase {
    type: 'record';
    keys: RecordKeysSchema | RecordKeysSchema[];
    values: Schemas | Schemas[];
    validate?: (value: unknown) => Promise<boolean>;
};

export const validateSchema = (schema?: any) : schema is Schema => {
    if (
        !validateSchemaBase<Schema>(schema, 'record') ||
        schema.keys == null ||
        schema.values == null
    ) {
        return false;
    }
    const keys = Array.isArray(schema.keys) ? schema.keys : [schema.keys];
    for (const constraint of keys) {
        if (
            constraint !== 'symbol' &&
            constraint !== 'string' &&
            constraint !== 'string!' &&
            !validateSchemaString(constraint) &&
            !validateSchemaSymbol(constraint)
        ) {
            return false;
        }
    }
    const values = Array.isArray(schema.values) ? schema.values : [schema.values];
    for (const constraint of values) {
        if (!validateGlobalSchema(constraint)) {
            return false;
        }
    }
    return true;
};

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (
        !validateSchema(schema) ||
        value == null
    ) {
        return false;
    }
    const keysList = Array.isArray(schema.keys) ? schema.keys : [schema.keys];
    const valuesList = Array.isArray(schema.values) ? schema.values : [schema.values];
    for (const [propKey, propValue] of Object.entries(value)) {
        let isValid = false;
        for (const constraint of keysList) {
            if (await validateAgainstSchema(constraint, propKey)) {
                isValid = true;
                break;
            }
        }
        if (!isValid) {
            return false;
        }
        isValid = false;
        for (const constraint of valuesList) {
            if (await validateAgainstSchema(constraint, propValue)) {
                isValid = true;
                break;
            }
        }
        if (!isValid) {
            return false;
        }
    }
    if (schema.validate !== undefined) {
        return await schema.validate(value);
    }
    return true;
};