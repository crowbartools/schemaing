// because ts-jest is dumb
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, validateSchema } from './symbol';

describe('Schema: Symbol', () => {

    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({type: 'symbol'})).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
    });

    describe('validateAgainstSchema()', () => {
        it('false when schema is invalid', async () => {
            // @ts-ignore
            expect(await validateAgainstSchema()).toBe(false);
            // @ts-ignore
            expect(await validateAgainstSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates value against schema', async () => {
            expect(await validateAgainstSchema({ type: 'symbol' }, Symbol('test'))).toBe(true);
            expect(await validateAgainstSchema({ type: 'symbol' }, 'test')).toBe(false);
            expect(await validateAgainstSchema({ type: 'symbol' }, 'symbol')).toBe(false);
        });
    });
});