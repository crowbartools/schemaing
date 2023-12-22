import { validateSchema as validateSchemaBase, SchemaBase } from '../_base';
import {
    default as validateAgainstSchema,
    validateSchema as validateGlobalSchema,
    SchemaDefinitions,
    SchemaAliases,
    Schema as Schemas
} from '../../index';
import undefinedOrBoolean from '../../common/undefined-or-boolean';

type PropertyBase = { optional?: boolean };
type PropertyMultiSchema = PropertyBase & { types: Schemas | Schemas[] }
type PropertySchema = PropertyBase & SchemaDefinitions;
type Properties = SchemaAliases | Schemas[] | PropertyMultiSchema | PropertySchema;

export interface Schema extends SchemaBase {
    type: 'object';
    properties: Record<string | symbol, Properties>;
    allowExtraProperties?: boolean;
    validate?: (value: unknown) => Promise<boolean>;
};

export const validateSchema = (schema?: any) : schema is Schema => {
    if (
        !validateSchemaBase<Schema>(schema, 'object') ||
        schema.properties == null ||
        !undefinedOrBoolean(schema, 'allowExtraProperties') ||
        (schema.validate !== undefined && typeof schema.validate !== 'function')
    ) {
        return false
    }

    const entries = [
        ...Object.getOwnPropertyNames(schema.properties),
        ...Object.getOwnPropertySymbols(schema.properties)
    ];
    for (const key of entries) {
        const constraint = schema.properties[key];

        // SchemaAlias
        if (typeof constraint === 'string') {
            if (!validateGlobalSchema(constraint)) {
                return false;
            }

        // Schema[]
        } else if (Array.isArray(constraint)) {
            if (constraint.length === 0) {
                return false;
            }
            for (const item of constraint) {
                if (!validateGlobalSchema(item)) {
                    return false;
                }
            }

        // .optional
        } else if (
            (<PropertyBase>constraint).optional !== undefined &&
            (<PropertyBase>constraint).optional !== true &&
            (<PropertyBase>constraint).optional !== false
        ) {
            return false;

        // PropertySchema
        } else if ((<PropertyMultiSchema>constraint).types === undefined) {
            if (!validateGlobalSchema(constraint)) {
                return false;
            }

        // PropertyMultiSchema
        } else {
            const types = (<PropertyMultiSchema>constraint).types;
            if (Array.isArray(types)) {
                if (types.length === 0) {
                    return false;
                }
                for (const item of types) {
                    if (!validateGlobalSchema(item)) {
                        return false;
                    }
                }
            } else if (!validateGlobalSchema(types)) {
                return false;
            }
        }
    }
    return true;
};

export default async (schema: any, value: unknown) : Promise<boolean> => {
    if (value == null || !validateSchema(schema)) {
        return false;
    }


    const keys = [
        ...Object.getOwnPropertyNames(schema.properties),
        ...Object.getOwnPropertySymbols(schema.properties)
    ];
    for (const key of keys) {
        const constraint = schema.properties[key];
        const propValue = (<any>value)[key];

        // SchemaAlias
        if (typeof constraint === 'string') {
            if (!(await validateAgainstSchema(constraint, propValue))) {
                return false;
            };

        // Schema[]
        } else if (Array.isArray(constraint)) {
            let isValid = false;
            for (const entry of constraint) {
                if (await validateAgainstSchema(entry, propValue)) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                return false;
            }

        // property is not optional
        } else if (constraint.optional !== true && !Object.hasOwn(<any>value, key)) {
            return false;

        // PropertySchema
        } else if ((<PropertyMultiSchema>constraint).types === undefined) {
            if (!(await validateAgainstSchema(<Schema>constraint, propValue))) {
                return false;
            }

        // PropertyMultiSchema.types = Schema[]
        } else if (Array.isArray((<PropertyMultiSchema>constraint).types)) {
            const types = <Schema[]>(<PropertyMultiSchema>constraint).types
            let isValid = false;
            for (const entry of types) {
                if (await validateAgainstSchema(entry, propValue)) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                return false;
            }

        // PropertyMultiSchema.types = Schema
        } else if (!(await validateAgainstSchema(<Schema>(<PropertyMultiSchema>constraint).types, propValue))) {
            return false;
        }
    }

    if (schema.allowExtraProperties !== true) {
        const valueKeys : Array<string | symbol> = [
            ...Object.getOwnPropertyNames(value),
            ...Object.getOwnPropertySymbols(value)
        ];
        for (const propKey of valueKeys) {
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