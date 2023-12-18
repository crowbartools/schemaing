// because ts-jest is dumb
declare const jest:     import('@jest/environment').Jest;
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, validateSchema } from './record';

describe('Schema: Record', () => {

    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({ type: 'record', keys: 'string', values: 'any' })).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates .keys', () => {
            expect(validateSchema({ type: 'record', keys: 'symbol', values: 'any' })).toBe(true);
            expect(validateSchema({ type: 'record', keys: 'string', values: 'any' })).toBe(true);
            expect(validateSchema({ type: 'record', keys: ['string', 'symbol'], values: 'any' })).toBe(true);
            expect(validateSchema({ type: 'record', keys: 'string!', values: 'any' })).toBe(true);
            expect(validateSchema({ type: 'record', keys: {type: 'string'}, values: 'any' })).toBe(true);
            expect(validateSchema({ type: 'record', keys: {type: 'symbol'}, values: 'any' })).toBe(true);
            expect(validateSchema({ type: 'record', keys: {type: 'invalid'}, values: 'any' })).toBe(false);
        });
        it('validates .values', () => {
            expect(validateSchema({ type: 'record', keys: 'string', values: ['any'] })).toBe(true);
            expect(validateSchema({ type: 'record', keys: 'string', values: 'invalid' })).toBe(false);
        });
    });

    describe('validateAgainstSchema()', () => {
        it('false when schema is invalid', async () => {
            // @ts-ignore
            expect(await validateAgainstSchema()).toBe(false);
            expect(await validateAgainstSchema({ type: 'invalid' }, {})).toBe(false);
        });
        it('validates against schema', async () => {
            expect(await validateAgainstSchema({type: 'record', keys: 'string', values: 'any' }, undefined)).toBe(false);
            expect(await validateAgainstSchema({type: 'record', keys: 'string', values: 'any' }, null)).toBe(false);
            expect(await validateAgainstSchema({type: 'record', keys: ['string'], values: 'any' }, {key: true, key2: true})).toBe(true);
            expect(await validateAgainstSchema({type: 'record', keys: 'string', values: ['any'] }, {})).toBe(true);
            expect(await validateAgainstSchema({type: 'record', keys: ['string!'], values: 'any' }, { '': true })).toBe(false);
            expect(await validateAgainstSchema({type: 'record', keys: 'string', values: 'boolean' }, { '': 10 })).toBe(false);

        });
        it('calls .validate', async () => {
            const validate = jest.fn((value: unknown) => true);
            const result = await validateAgainstSchema({ type: 'record', keys: 'string', values: 'string', validate: validate }, {});
            expect(result).toBe(true);
            expect(validate.mock.calls).toHaveLength(1);
            expect(validate.mock.results[0].value).toBe(true);
        });
    });
});