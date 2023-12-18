// because ts-jest is dumb
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, aliases, validateSchema } from './boolean';

describe('Schema: Boolean', () => {

    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({type: 'boolean' })).toBe(true);
            expect(validateSchema({type: 'bool' })).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates .is', () => {
            expect(validateSchema({ type: 'boolean', is: undefined })).toBe(true);
            expect(validateSchema({ type: 'boolean', is: true })).toBe(true);
            expect(validateSchema({ type: 'boolean', is: false })).toBe(true);
            expect(validateSchema({ type: 'boolean', is: 'invalid' })).toBe(false);
        });
    });

    describe('aliases', () => {
        it('has aliases object', () => {
            expect(aliases != null && typeof aliases === 'object').toBe(true);
        });
        it('entries are valid schema', () => {
            const check = () => {
                for (const [key, value] of Object.entries(aliases)) {
                    if (!validateSchema(value)) {
                        return false;
                    }
                }
                return true;
            }
            expect(check()).toBe(true);
        });
    });

    describe('validateAgainstSchema()', () => {
        it('false when schema is invalid', async () => {
            // @ts-ignore
            (expect(await validateAgainstSchema())).toBe(false);
            // @ts-ignore
            (expect(await validateAgainstSchema({type: 'object'}))).toBe(false);
            // @ts-ignore
            (expect(await validateAgainstSchema({type: 'boolean', is: 'text'}))).toBe(false);
        });
    });
    it('validates value against schema', async () => {
        expect(await validateAgainstSchema({type: 'boolean'}, true)).toBe(true);
        expect(await validateAgainstSchema({type: 'boolean'}, false)).toBe(true);

        expect(await validateAgainstSchema({type: 'boolean'}, 1)).toBe(false);
        expect(await validateAgainstSchema({type: 'boolean'}, 'true')).toBe(false);

        expect(await validateAgainstSchema({type: 'boolean'}, undefined)).toBe(false);
        expect(await validateAgainstSchema({type: 'boolean'}, null)).toBe(false);
        expect(await validateAgainstSchema({type: 'boolean'}, 0)).toBe(false);
        expect(await validateAgainstSchema({type: 'boolean'}, '')).toBe(false);
        expect(await validateAgainstSchema({type: 'boolean'}, 'false')).toBe(false);
    });
    it('validates value against \'is\'', async () => {
        // @ts-ignore
        expect(await validateAgainstSchema({type: 'boolean', is: true}, true)).toBe(true);
        // @ts-ignore
        expect(await validateAgainstSchema({type: 'boolean', is: false}, false)).toBe(true);
        // @ts-ignore
        expect(await validateAgainstSchema({type: 'boolean', is: true}, false)).toBe(false);
        // @ts-ignore
        expect(await validateAgainstSchema({type: 'boolean', is: false}, true)).toBe(false);
    });
});