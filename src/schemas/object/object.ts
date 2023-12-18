import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';

import {
    default as validateAgainstSchema,
    SchemaDefinitions,
    Schema as Schemas
} from '../../index';

import undefinedOrBoolean from '../../common/undefined-or-boolean';

export interface Schema extends SchemaBase {
    type: 'object';
    properties: Record<string | symbol, { optional?: boolean } & (
        { types: Array<Schemas> }
        | SchemaDefinitions
    )>;
    allowExtraProperties?: boolean;
    validate?: (value: unknown) => Promise<boolean>;
}

export const aliases = {
    'object': { type: 'object', allowExtraProperties: true, properties: {} }
}

export const validateSchema = (schema?: any) : schema is Schema => {
    if (
        !validateSchemaBase<Schema>(schema, 'object') ||
        !undefinedOrBoolean(schema, 'allowExtraProperties') ||
        (schema.validate != null && typeof schema.validate !== 'function') ||
        schema.properties == null
    ) {
        return false
    }

    // TODO: validate property list

    return true;
}

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

        // property.types[]
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

        // property.type = ...
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