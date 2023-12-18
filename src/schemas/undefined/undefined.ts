import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';

export interface Schema extends SchemaBase {
    type: 'undefined' | 'void';
}

export const aliases = {
    'undefined': { type: 'undefined' },
    'void': { type: 'undefined' }
}

export const validateSchema = (schema?: any) : schema is Schema => (
    validateSchemaBase<Schema>(schema, 'undefined') ||
    validateSchemaBase<Schema>(schema, 'void')
);

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }
    return value === undefined;
};