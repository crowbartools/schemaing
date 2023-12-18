import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';

import undefinedOrBoolean from '../../common/undefined-or-boolean';

export interface Schema extends SchemaBase {
    type: 'number';
    loose?: boolean;
    integer?: boolean;
    unsigned?: boolean;
    range?: { min?: number, max?: number, over?: number, under?: number };
    is?: number;
    validate?: (value: unknown) => Promise<boolean>;
};

export const aliases = {
    'number': { type: 'number' },
    'number~': { type: 'number', loose: true },
    'int': { type: 'number', integer: true },
    'int~': { type: 'number', integer: true, loose: true },
    'uint': { type: 'number', unsigned: true, integer: true },
    'uint~': { type: 'number', unsigned: true, integer: true, loose: true },
};

export const validateSchema = (schema?: any) : schema is Schema => {
    if (
        !validateSchemaBase<Schema>(schema, 'number') ||
        !undefinedOrBoolean(schema, 'loose') ||
        !undefinedOrBoolean(schema, 'integer') ||
        !undefinedOrBoolean(schema, 'unsigned') ||
        (schema.is !== undefined && typeof schema.is !== 'number') ||
        (schema.validate !== undefined && typeof schema.validate !== 'function')
    ) {
        return false;
    }
    if (schema.range != null) {
        if (schema.range.min != null && !Number.isFinite(schema.range.min)) {
            return false;
        }
        if (schema.range.max != null && !Number.isFinite(schema.range.max)) {
            return false;
        }
        if (schema.range.over != null && !Number.isFinite(schema.range.over)) {
            return false;
        }
        if (schema.range.under != null && !Number.isFinite(schema.range.under)) {
            return false;
        }
        if (schema.range.min != null && schema.range.over != null) {
            return false;
        }
        if (schema.range.max != null && schema.range.under != null) {
            return false
        }
    }

    return true;
}

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }
    if (schema.loose) {
        if (value instanceof Number) {
            value = value.valueOf();
        } else if (value instanceof String || typeof value === 'string') {
            value = Number(value + '');
        }
    }
    if (
        (!Number.isFinite(value)) ||
        (schema.integer && !Number.isInteger(value)) ||
        (schema.unsigned && <number>value < 0)
    ) {
        return false;
    }
    if (schema.is && schema.is !== value) {
        return false;
    }
    if (schema.range) {
        const { min, max, over, under } = schema.range;
        if (
            (min != null && <number>value < min) ||
            (max != null && <number>value > max) ||
            (over != null && <number>value <= over) ||
            (under != null && <number>value >= under)
        ) {
            return false;
        }
    }
    if (schema.validate) {
        return await schema.validate(value);
    }
    return true;
};