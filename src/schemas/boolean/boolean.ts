import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';

export interface Schema extends SchemaBase {
    type: 'boolean';
    is?: boolean;
};

export const aliases = {
    'boolean': { type: 'boolean' },
    'bool': { type: 'boolean' },
    'true': { type: 'boolean', is: true },
    'false': { type: 'boolean', is: false }
};

export const validateSchema = (schema?: any) : schema is Schema => (
    (
        validateSchemaBase<Schema>(schema, 'boolean') ||
        validateSchemaBase<Schema>(schema, 'bool')
    ) && (
        schema.is === undefined ||
        schema.is === true ||
        schema.is === false
    )
);

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }
    if (schema.is != null) {
        return value === schema.is;
    }
    return value === true || value === false;
};