import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';
import undefinedOrBoolean from '../../common/undefined-or-boolean';

export interface Schema extends SchemaBase {
    type: 'null';
    loose?: boolean;
    allowUndefined?: boolean;
    allowZero?: boolean;
    allowEmptyString?: boolean;
};

export const validateSchema = (schema?: any) : schema is Schema => (
    validateSchemaBase<Schema>(schema, 'null') &&
    undefinedOrBoolean(schema, 'loose') &&
    undefinedOrBoolean(schema, 'allowUndefined') &&
    undefinedOrBoolean(schema, 'allowZero') &&
    undefinedOrBoolean(schema, 'allowEmptyString')
);

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (!validateSchema(schema)) {
        return false;
    }
    return true === (
        value === null || (
            (schema.loose || schema.allowUndefined) &&
            value == null
        ) || (
            (schema.loose || schema.allowZero) &&
            value === 0
        ) || (
            (schema.loose || schema.allowEmptyString) &&
            typeof value === 'string' &&
            (value + '') === ''
        )
    );
};