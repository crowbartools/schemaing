import { SchemaBase, validateSchema as validateSchemaBase } from './schemas/_base';

import * as schemaAny from './schemas/any/any';
import * as schemaArray from './schemas/array/array';
import * as schemaBoolean from './schemas/boolean/boolean';
import * as schemaLiteral from './schemas/literal/literal';
import * as schemaNull from './schemas/null/null';
import * as schemaNumber from './schemas/number/number';
import * as schemaObject from './schemas/object/object';
import * as schemaRecord from './schemas/record/record';
import * as schemaString from './schemas/string/string';
import * as schemaSymbol from './schemas/symbol/symbol';
import * as schemaUndefined from './schemas/undefined/undefined';

const aliases = {
    'any': { type: 'any' },
    'unknown': { type: 'unknown' },
    'array': { type: 'array', as: 'any' },
    'boolean': { type: 'boolean' },
    'bool': { type: 'boolean' },
    'true': { type: 'boolean', is: true },
    'false': { type: 'boolean', is: false },
    'null': { type: 'null' },
    'nullish': { type: 'null', allowUndefined: true },
    'null~': { type: 'null', loose: true },
    'number': { type: 'number' },
    'number~': { type: 'number', loose: true },
    'int': { type: 'number', integer: true },
    'int~': { type: 'number', integer: true, loose: true },
    'uint': { type: 'number', unsigned: true, integer: true },
    'uint~': { type: 'number', unsigned: true, integer: true, loose: true },
    'object': { type: 'object', allowExtraProperties: true, properties: {} },
    'record': { type: 'record', keys: 'string!', values: 'any'},
    'string': { type: 'string' },
    'string!': { type: 'string', notEmpty: true },
    'symbol': { type: 'symbol' },
    'undefined': { type: 'undefined' },
    'void': { type: 'undefined' }
};

const schemaAliases : Map<string, SchemaBase> = new Map(Object.entries(aliases));


export type SchemaDefinitions = (
    schemaAny.Schema
    | schemaArray.Schema
    | schemaBoolean.Schema
    | schemaLiteral.Schema
    | schemaNull.Schema
    | schemaNumber.Schema
    | schemaObject.Schema
    | schemaRecord.Schema
    | schemaString.Schema
    | schemaSymbol.Schema
    | schemaUndefined.Schema
);

export type Schema = (
    SchemaDefinitions
    | keyof typeof aliases
);

export const validateSchema = (schema: unknown) : boolean => {
    if (typeof schema === 'string') {
        if (!schemaAliases.has(schema)) {
            return false;
        }
        schema = <any>schemaAliases.get(schema + '');
    }

    if (schema == null || typeof (<any>schema).type !== 'string') {
        return false;
    }

    return (
        schemaAny.validateSchema(<SchemaBase>schema) ||
        schemaArray.validateSchema(<SchemaBase>schema) ||
        schemaBoolean.validateSchema(<SchemaBase>schema) ||
        schemaLiteral.validateSchema(<SchemaBase>schema) ||
        schemaNull.validateSchema(<SchemaBase>schema) ||
        schemaNumber.validateSchema(<SchemaBase>schema) ||
        schemaObject.validateSchema(<SchemaBase>schema) ||
        schemaRecord.validateSchema(<SchemaBase>schema) ||
        schemaString.validateSchema(<SchemaBase>schema) ||
        schemaSymbol.validateSchema(<SchemaBase>schema) ||
        schemaUndefined.validateSchema(<SchemaBase>schema)
    );
}

const validate = async (schema: Schema, value: unknown) : Promise<boolean> => {

    if (typeof schema === 'string' || schema instanceof String) {
        if (!schemaAliases.has(<string>schema + '')) {
            return false;
        }
        schema = <any>schemaAliases.get(<string>schema + '');
    }

    return (
        await schemaAny.default(schema, value) ||
        await schemaArray.default(schema, value) ||
        await schemaBoolean.default(schema, value) ||
        await schemaLiteral.default(schema, value) ||
        await schemaNull.default(schema, value) ||
        await schemaNumber.default(schema, value) ||
        await schemaObject.default(schema, value) ||
        await schemaRecord.default(schema, value) ||
        await schemaString.default(schema, value) ||
        await schemaSymbol.default(schema, value) ||
        await schemaUndefined.default(schema, value)
    );
};

export const use = (schema: Schema) => {
    if (!validateSchema(schema)) {
        throw new Error('invalid schema');
    }
    return async (value: unknown) => {
        return await validate(schema, value)
    }
};

export default validate;