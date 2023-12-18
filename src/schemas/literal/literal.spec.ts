// because ts-jest is dumb
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, validateSchema } from './literal';

describe('Schema: Literal', () => {

    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({type: 'literal'})).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
    });

    describe('validateAgainstSchema()', () => {
        it('false when schema is invalid', async () => {
            // @ts-ignore
            expect(await validateAgainstSchema()).toBe(false);
            expect(await validateAgainstSchema({ type: 'invalid' }, 10)).toBe(false);
        });
        it('validates value against schema', async () => {
            // @ts-ignore
            expect(await validateAgainstSchema({type: 'literal'})).toBe(true);
            expect(await validateAgainstSchema({type: 'literal'}, undefined)).toBe(true);
            expect(await validateAgainstSchema({type: 'literal', is: undefined}, undefined)).toBe(true);
            expect(await validateAgainstSchema({type: 'literal', is: null}, null)).toBe(true);
            expect(await validateAgainstSchema({type: 'literal', is: true}, true)).toBe(true);
            expect(await validateAgainstSchema({type: 'literal', is: false}, false)).toBe(true);
            expect(await validateAgainstSchema({type: 'literal', is: 1}, 1)).toBe(true);
            expect(await validateAgainstSchema({type: 'literal', is: 'text'}, 'text')).toBe(true);
            expect(await validateAgainstSchema({type: 'literal'}, 1)).toBe(false);
            expect(await validateAgainstSchema({type: 'literal', is: undefined}, 1)).toBe(false);
            expect(await validateAgainstSchema({type: 'literal', is: null}, 1)).toBe(false);
            expect(await validateAgainstSchema({type: 'literal', is: true}, 1)).toBe(false);
            expect(await validateAgainstSchema({type: 'literal', is: false}, 1)).toBe(false);
            expect(await validateAgainstSchema({type: 'literal', is: 1}, 2)).toBe(false);
            expect(await validateAgainstSchema({type: 'literal', is: 'text'}, 1)).toBe(false);
        });
    });
});