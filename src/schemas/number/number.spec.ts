// because ts-jest is dumb
declare const jest:     import('@jest/environment').Jest;
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, validateSchema } from './number';

describe('Schema: Number', () => {
    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({ type: 'number' })).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates .loose', () => {
            expect(validateSchema({ type: 'number', loose: undefined })).toBe(true);
            expect(validateSchema({ type: 'number', loose: true })).toBe(true);
            expect(validateSchema({ type: 'number', loose: false })).toBe(true);
            expect(validateSchema({ type: 'number', loose: null })).toBe(false);
            expect(validateSchema({ type: 'number', loose: 0 })).toBe(false);
            expect(validateSchema({ type: 'number', loose: 1 })).toBe(false);
            expect(validateSchema({ type: 'number', loose: 'true'})).toBe(false);
        });
        it('validates .integer', () => {
            expect(validateSchema({ type: 'number', integer: undefined })).toBe(true);
            expect(validateSchema({ type: 'number', integer: true })).toBe(true);
            expect(validateSchema({ type: 'number', integer: false })).toBe(true);
            expect(validateSchema({ type: 'number', integer: null })).toBe(false);
            expect(validateSchema({ type: 'number', integer: 0 })).toBe(false);
            expect(validateSchema({ type: 'number', integer: 1 })).toBe(false);
            expect(validateSchema({ type: 'number', integer: 'true'})).toBe(false);
        });
        it('validates .unsigned', () => {
            expect(validateSchema({ type: 'number', unsigned: undefined })).toBe(true);
            expect(validateSchema({ type: 'number', unsigned: true })).toBe(true);
            expect(validateSchema({ type: 'number', unsigned: false })).toBe(true);
            expect(validateSchema({ type: 'number', unsigned: null })).toBe(false);
            expect(validateSchema({ type: 'number', unsigned: 0 })).toBe(false);
            expect(validateSchema({ type: 'number', unsigned: 1 })).toBe(false);
            expect(validateSchema({ type: 'number', unsigned: 'true'})).toBe(false);
        });
        it('validates .range', () => {
            expect(validateSchema({ type: 'number', range: undefined })).toBe(true);
            expect(validateSchema({ type: 'number', range: { min: 1 }})).toBe(true);
            expect(validateSchema({ type: 'number', range: { max: 1 }})).toBe(true);
            expect(validateSchema({ type: 'number', range: { min: 1, max: 1 }})).toBe(true);
            expect(validateSchema({ type: 'number', range: { over: 1 }})).toBe(true);
            expect(validateSchema({ type: 'number', range: { under: 1 }})).toBe(true);
            expect(validateSchema({ type: 'number', range: { over: 1, under: 1 }})).toBe(true);
            expect(validateSchema({ type: 'number', range: { min: Infinity }})).toBe(false);
            expect(validateSchema({ type: 'number', range: { max: Infinity }})).toBe(false);
            expect(validateSchema({ type: 'number', range: { over: Infinity }})).toBe(false);
            expect(validateSchema({ type: 'number', range: { under: Infinity }})).toBe(false);
            expect(validateSchema({ type: 'number', range: { min: 1, over: 0 }})).toBe(false);
            expect(validateSchema({ type: 'number', range: { max: 1, under: 2 }})).toBe(false);
        });
        it('validates .is', () => {
            expect(validateSchema({ type: 'number', is: 1 })).toBe(true);
            expect(validateSchema({ type: 'number', is: undefined })).toBe(true);
            expect(validateSchema({ type: 'number', is: null })).toBe(false);
            expect(validateSchema({ type: 'number', is: true })).toBe(false);
            expect(validateSchema({ type: 'number', is: false })).toBe(false);
            expect(validateSchema({ type: 'number', is: '1' })).toBe(false);
        });
        it('validates .validate', () => {
            expect(validateSchema({ type: 'number', validate: undefined})).toBe(true);
            expect(validateSchema({ type: 'number', validate: ()=>{} })).toBe(true);
            expect(validateSchema({ type: 'number', validate: null})).toBe(false);
            expect(validateSchema({ type: 'number', validate: 'invalid'})).toBe(false);
        });
    });

    describe('validateAgainstSchema()', () => {
        it('false when schema is invalid', async () => {
            // @ts-ignore
            expect(await validateAgainstSchema()).toBe(false);
            expect(await validateAgainstSchema({ type: 'invalid' }, 10)).toBe(false);
        });
        it('validates against schema', async () => {
            expect(await validateAgainstSchema({ type: 'number' }, 1)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number' }, undefined)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number' }, null)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number' }, false)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number' }, true)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number' }, '1')).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', loose: true }, '1')).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', loose: true }, 'abc')).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', loose: true }, new Number(10))).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', loose: true }, new String('10'))).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', integer: true }, 1)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', integer: true }, 1.0)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', integer: true }, 1.1)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', unsigned: true }, 0)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', unsigned: true }, 1)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', unsigned: true }, -1)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', is: 10 }, 10)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', is: 10 }, 9)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', range: { min: 10 }}, 11)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', range: { min: 10 }}, 10)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', range: { min: 10 }}, 9)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', range: { max: 10 }}, 9)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', range: { max: 10 }}, 10)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', range: { max: 10 }}, 11)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', range: { over: 10 }}, 11)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', range: { over: 10 }}, 10)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', range: { over: 10 }}, 9)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', range: { under: 10 }}, 9)).toBe(true);
            expect(await validateAgainstSchema({ type: 'number', range: { under: 10 }}, 10)).toBe(false);
            expect(await validateAgainstSchema({ type: 'number', range: { under: 10 }}, 11)).toBe(false);
        });
        it('calls .validate', async () => {
            const validate = jest.fn((value: unknown) => value === 10);
            // @ts-ignore
            const result = await validateAgainstSchema({ type: 'number', validate: validate }, 10);
            expect(result).toBe(true);
            expect(validate.mock.calls).toHaveLength(1);
            expect(validate.mock.results[0].value).toBe(true);
        });
    });
});