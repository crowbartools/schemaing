// because ts-jest is dumb
declare const jest:     import('@jest/environment').Jest;
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import {
    default as validate,
    validateSchema,
    use
} from './index';

describe('Exports', () => {
    describe('validateSchema()', () => {
        it('Schemas: Any', () => {
            expect(validateSchema('any')).toBe(true);
            expect(validateSchema('unknown')).toBe(true);
            expect(validateSchema({ type: 'any' })).toBe(true);
            expect(validateSchema({ type: 'unknown' })).toBe(true);
        });
        it('Schemas: Array', () => {
            expect(validateSchema('array')).toBe(true);
            expect(validateSchema({type: 'array'})).toBe(true);
        });
        it('Schemas: Boolean', () => {
            expect(validateSchema('boolean')).toBe(true);
            expect(validateSchema('bool')).toBe(true);
            expect(validateSchema('true')).toBe(true);
            expect(validateSchema('false')).toBe(true);
            expect(validateSchema({type: 'boolean' })).toBe(true);
            expect(validateSchema({type: 'bool' })).toBe(true);
        });
        it('Schemas: Literal', () => {
            expect(validateSchema({type: 'literal'})).toBe(true);
        });
        it('Schemas: Null', () => {
            expect(validateSchema('null')).toBe(true);
            expect(validateSchema('nullish')).toBe(true);
            expect(validateSchema('null~')).toBe(true);
            expect(validateSchema({type: 'null'})).toBe(true);
        });
        it('Schemas: Number', () => {
            expect(validateSchema('number')).toBe(true);
            expect(validateSchema('number~')).toBe(true);
            expect(validateSchema('int')).toBe(true);
            expect(validateSchema('int~')).toBe(true);
            expect(validateSchema('uint')).toBe(true);
            expect(validateSchema('uint~')).toBe(true);
            expect(validateSchema({type: 'number'})).toBe(true);
        });
        it('Schemas: Object', () => {
            expect(validateSchema('object')).toBe(true);
            expect(validateSchema({ type: 'object', properties: {} })).toBe(true);
        });
        it('Schemas: Record', () => {
            expect(validateSchema('record')).toBe(true);
            expect(validateSchema({ type: 'record', keys: 'string', values: 'any' })).toBe(true);
        });
        it('Schemas: String', () => {
            expect(validateSchema('string')).toBe(true);
            expect(validateSchema('string!')).toBe(true);
            expect(validateSchema({type: 'string'})).toBe(true);
            expect(validateSchema({ type: 'text' })).toBe(true);
        });
        it('Schemas: Symbol', () => {
            expect(validateSchema('symbol')).toBe(true);
            expect(validateSchema({ type: 'symbol' })).toBe(true);
        });
        it('Schemas: Undefined', () => {
            expect(validateSchema('undefined')).toBe(true);
            expect(validateSchema('void')).toBe(true);
            expect(validateSchema({type: 'undefined'})).toBe(true);
            expect(validateSchema({type: 'void'})).toBe(true);
        });
        it('Invalid Schemas', () => {
            expect(validateSchema('invalid')).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
            expect(validateSchema(undefined)).toBe(false);
            expect(validateSchema(null)).toBe(false);
            expect(validateSchema({})).toBe(false);
        });
    });

    describe('validate()', () => {
        it('validates schema', async () => {
            // @ts-ignore
            expect(await validate('invalid', undefined)).toBe(false);
        });
        it('validates against schema', async () => {
            expect(await validate('undefined', undefined)).toBe(true);
        });
    });

    describe('use()', () => {
        it('throws an error for invalid schemas', async () => {
            expect(() => {
                // @ts-ignore
                use('invalid')
            }).toThrow();
        });
        it('returns a validator function', async () => {
            const fn = use('undefined');
            expect(typeof fn === 'function').toBe(true);
            const res = fn(undefined);
            expect(res instanceof Promise).toBe(true);
            expect(await res).toBe(true);
        });
    });
});