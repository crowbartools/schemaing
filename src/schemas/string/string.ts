import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';
import undefinedOrBoolean from '../../common/undefined-or-boolean';

export interface Schema extends SchemaBase {
    type: 'string';
    loose?: boolean;
    notEmpty?: boolean;
    match?: RegExp;
    is?: string;
    validate?: (value: unknown) => Promise<boolean>;
};

export const validateSchema = (schema?: any) : schema is Schema => (
    (
        validateSchemaBase<Schema>(schema, 'string') ||
        validateSchemaBase<Schema>(schema, 'text')
    ) &&
    undefinedOrBoolean(schema, 'loose') &&
    undefinedOrBoolean(schema, 'notEmpty') &&
    (schema.match === undefined || (schema.is === undefined && schema.match instanceof RegExp)) &&
    (schema.is === undefined || typeof schema.is === 'string' || <any>schema.is instanceof String) &&
    (schema.validate === undefined || typeof schema.validate === 'function')
);

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }
    if (schema.loose) {
        if (value == null) {
            value = '';
        } else if (typeof value === 'boolean') {
            value = '' + value;
        } else if (typeof value === 'number') {
            if (!Number.isFinite(value)) {
                return false;
            }
            value = '' + value;
        } else if (value instanceof String) {
            value = value.valueOf();
        }
    }
    if (typeof value !== 'string') {
        return false;
    }
    if (schema.notEmpty === true && value === '') {
        return false;
    }
    if (schema.is != null && value !== schema.is) {
        return false;
    }
    if (schema.match != null && !schema.match.test(value)) {
        return false;
    }
    if (schema.validate != null) {
        return await schema.validate(value);
    }
    return true;
};