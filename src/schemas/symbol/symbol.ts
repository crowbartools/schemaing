import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';

export interface Schema extends SchemaBase {
    type: 'symbol';
}

export const validateSchema = (schema?: any) : schema is Schema => {
    return validateSchemaBase<Schema>(schema, 'symbol');
}

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }
    return typeof value === 'symbol';
};