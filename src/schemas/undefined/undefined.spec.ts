// because ts-jest is dumb
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, validateSchema } from './undefined';

describe('Schema: Undefined', () => {

    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({type: 'undefined'})).toBe(true);
            expect(validateSchema({type: 'void'})).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
    });

    describe('validateAgainstSchema()', () => {
        it('false when schema is invalid', async () => {
            // @ts-ignore
            expect(await validateAgainstSchema()).toBe(false);
            expect(await validateAgainstSchema({ type: 'invalid' }, undefined)).toBe(false);
        });
        it('validates value against schema', async () => {
            // @ts-ignore
            expect(await validateAgainstSchema({ type: 'undefined' })).toBe(true);
            expect(await validateAgainstSchema({ type: 'undefined' }, undefined)).toBe(true);
            expect(await validateAgainstSchema({ type: 'undefined' }, null)).toBe(false);
            expect(await validateAgainstSchema({ type: 'undefined' }, 0)).toBe(false);
            expect(await validateAgainstSchema({ type: 'undefined' }, '')).toBe(false);
            expect(await validateAgainstSchema({ type: 'undefined' }, false)).toBe(false);
        });
    });
});