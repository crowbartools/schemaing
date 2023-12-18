import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';

import {
    default as validateAgainstSchema,
    validateSchema as validateGlobalSchema,
    Schema as Schemas
} from '../../index';

import undefinedOrBoolean from '../../common/undefined-or-boolean';

export interface Schema extends SchemaBase {
    type: 'array';
    content?: Array<Schemas | Schemas[]>;
    contentIgnoresAs?: boolean;
    allowExtraItems?: boolean;
    as?: Schemas | Schemas[];
    notEmpty?: boolean;
    validate?: (value: unknown) => Promise<boolean>;
};

export const aliases = {
    'array': { type: 'array', as: 'any'}
};

export const validateSchema = (schema?: any) : schema is Schema => {
    if (
        !validateSchemaBase<Schema>(schema, 'array') ||
        (schema.content !== undefined && !Array.isArray(schema.content)) ||
        !undefinedOrBoolean(schema, 'contentIgnoreAs') ||
        !undefinedOrBoolean(schema, 'allowExtraItems') ||
        !undefinedOrBoolean(schema, 'notEmpty') ||
        (schema.validate !== undefined && typeof schema.validate !== 'function')
    ) {
        return false;
    }
    if (schema.content != null) {
        for (const constraint of schema.content) {
            if (Array.isArray(constraint)) {
                for (const sub of constraint) {
                    if (!validateGlobalSchema(sub)) {
                        return false;
                    }
                }
            } else if (!validateGlobalSchema(constraint)) {
                return false;
            }
        }
    }
    if (Array.isArray(schema.as)) {
        for (const constraint of schema.as) {
            if (!validateGlobalSchema(constraint)) {
                return false;
            }
        }
    } else if (schema.as !== undefined) {
        if (!validateGlobalSchema(schema.as)) {
            return false;
        }
    }
    return true;
};

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema) || !Array.isArray(value)) {
        return false;
    }
    if (schema.notEmpty && value.length === 0) {
        return false;
    }
    if (!schema.content && !schema.as) {
        return true;
    }
    let idx = 0;
    if (schema.content) {
        if (value.length < schema.content.length) {
            return false;
        }
        for (const contentConstraint of schema.content) {
            const entry = value[idx];
            let valid = false,
                constraints = contentConstraint;
            if (!Array.isArray(constraints)) {
                constraints = [constraints];
            }
            for (const constraint of constraints) {
                if (await validateAgainstSchema(constraint, entry)) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                return false;
            }
            idx += 1;
        }
        if (schema.allowExtraItems !== true && idx < value.length) {
            return false;
        }
        if (!schema.as) {
            return true;
        }
        if (schema.contentIgnoresAs !== true) {
            idx = 0;
        }
    }
    if (schema.as) {
        const entries = value.slice(idx);
        const asConstraint = Array.isArray(schema.as) ? schema.as : [schema.as];
        for (const entry of entries) {
            let valid = false;
            for (const constraint of asConstraint) {
                if (await validateAgainstSchema(constraint, entry)) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                return false;
            }
        }
    }
    if (schema.validate) {
        return await schema.validate(value);
    }
    return true;
};