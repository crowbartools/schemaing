import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';
import { default as validateAgainstSchema, validateSchema as validateGlobalSchema, SchemaDefinitions, Schema as Schemas } from '../../index';
import undefinedOrBoolean from '../../common/undefined-or-boolean';

export interface Schema extends SchemaBase {
    type: 'object';
    properties: Record<string | symbol, { optional?: boolean } & (
        { types: Array<Schemas> }
        | SchemaDefinitions
    )>;
    allowExtraProperties?: boolean;
    validate?: (value: unknown) => Promise<boolean>;
};

export const aliases = {
    'object': { type: 'object', allowExtraProperties: true, properties: {} }
};

export const validateSchema = (schema?: any) : schema is Schema => {
    if (
        !validateSchemaBase<Schema>(schema, 'object') ||
        !undefinedOrBoolean(schema, 'allowExtraProperties') ||
        (schema.validate !== undefined && typeof schema.validate !== 'function') ||
        schema.properties == null
    ) {
        return false
    }
    for (const [key, constraint] of Object.entries(schema.properties)) {
        if (typeof key !== 'string' && typeof key !== 'symbol') {
            return false;
        }
        if ((<any>constraint).types) {
            const types = (<any>constraint).types;
            if (!Array.isArray(types) || types.length === 0) {
                return false;
            }
            for (const sub of types) {
                if (!validateGlobalSchema(sub)) {
                    return false;
                }
            }
        } else if (!validateGlobalSchema(constraint)) {
            return false;
        }
    }
    return true;
};

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }
    if (value == null || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    for (const [propKey, propSchema] of Object.entries(schema.properties)) {
        if ((<any>value)[propKey] === undefined) {
            if (propSchema.optional !== true) {
                return false;
            }
            continue;
        }
        if ((<any>propSchema).types != null) {
            let valid = false;
            for (const constraint of (<{ types: Schemas[] }>propSchema).types) {
                if (await validateAgainstSchema(constraint, (<any>value)[propKey])) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                return false;
            }
            continue;
        }
        if (!await validateAgainstSchema(<Schemas>propSchema, (<any>value)[propKey])) {
            return false;
        }
    }
    if (schema.allowExtraProperties !== true) {
        for (const propKey of Object.keys(value)) {
            if (schema.properties[propKey] === undefined) {
                return false;
            }
        }
    }
    if (schema.validate) {
        return await schema.validate(value);
    }
    return true;
};