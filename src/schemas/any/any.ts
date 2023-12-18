import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';

// Any/Unknown
export interface Schema extends SchemaBase {
    type: 'any' | 'unknown';
    validate?: (value: unknown) => Promise<boolean>;
}

export const aliases = {
    'any': { type: 'any' },
    'unknown': { type: 'any' }
};

export const validateSchema = (schema?: any) : schema is Schema => (
    (
        validateSchemaBase<Schema>(schema, 'any') ||
        validateSchemaBase<Schema>(schema, 'unknown')
    ) &&
    (schema.validate === undefined || typeof schema.validate === 'function')
);

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }
    if (schema.validate) {
        return await schema.validate(value);
    }
    return true;
};