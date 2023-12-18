import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';

export interface Schema extends SchemaBase {
    type: 'literal';
    is: unknown;
}

export const aliases = {};

export const validateSchema = (schema?: any) : schema is Schema => {
    return validateSchemaBase<Schema>(schema, 'literal');
}

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }
    return schema.is === value;
};