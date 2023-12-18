import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';

import { default as validateAgainstSchema, Schema as Schemas } from '../../index';
import type { Schema as SchemaString } from '../string/string';
import type { Schema as SchemaSymbol } from '../symbol/symbol';


// Record
type RecordKeysSchema = 'symbol' | SchemaSymbol | 'string' | 'string!' | SchemaString;

export interface Schema extends SchemaBase {
    type: 'record';
    keys: RecordKeysSchema | RecordKeysSchema[];
    values: Schemas | Schemas[];
}

export const aliases = {
    'record': { type: 'record', keys: 'string!', values: 'any'}
}

export const validateSchema = (schema?: any) : schema is Schema => {
    if (
        !validateSchemaBase<Schema>(schema, 'record') ||
        schema.keys == null ||
        schema.values == null
    ) {
        return false;
    }

    // TODO: validate schema.keys
    // TODO: validate schema.values

    return true;
}
export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }

    if (value == null || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    const keysList = Array.isArray(schema.keys) ? schema.keys : [schema.keys];
    const valuesList = Array.isArray(schema.values) ? schema.values : [schema.values];

    for (const [propKey, propValue] of Object.entries(value)) {
        let isValid = false;

        // validate key
        for (const constraint of keysList) {
            if (await validateAgainstSchema(constraint, propKey)) {
                isValid = true;
                break;
            }
        }
        if (!isValid) {
            return false;
        }

        // validate propValue
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

    return true;
};