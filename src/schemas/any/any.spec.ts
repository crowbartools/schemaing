// because ts-jest is dumb
declare const jest:     import('@jest/environment').Jest;
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, aliases, validateSchema } from './any';

describe('Schema: Any', () => {

    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({type: 'any'})).toBe(true);
            expect(validateSchema({type: 'unknown'})).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid'})).toBe(false);
        });
        it('validates .validate', () => {
            expect(validateSchema({ type: 'any', validate: undefined})).toBe(true);
            expect(validateSchema({ type: 'any', validate: ()=>{}})).toBe(true);
            expect(validateSchema({ type: 'any', validate: null})).toBe(false);
            expect(validateSchema({ type: 'any', validate: 'invalid'})).toBe(false);
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
        })
    });

    describe('validateAgainstSchema()', () => {
        it('false when schema is invalid', async () => {
            // @ts-ignore
            (expect(await validateAgainstSchema())).toBe(false);
            // @ts-ignore
            (expect(await validateAgainstSchema({type: 'object'}))).toBe(false);
            // @ts-ignore
            (expect(await validateAgainstSchema({type: 'any', validate: 'text'}))).toBe(false);
        });
        it('true when valid schema', async () => {
            expect(await validateAgainstSchema({type: 'any'}, undefined)).toBe(true);
            expect(await validateAgainstSchema({type: 'any'}, null)).toBe(true);
            expect(await validateAgainstSchema({type: 'any'}, true)).toBe(true);
            expect(await validateAgainstSchema({type: 'any'}, false)).toBe(true);
            expect(await validateAgainstSchema({type: 'any'}, 0)).toBe(true);
            expect(await validateAgainstSchema({type: 'any'}, 'text')).toBe(true);
            expect(await validateAgainstSchema({type: 'any'}, [])).toBe(true);
            expect(await validateAgainstSchema({type: 'any'}, {})).toBe(true);
        });
        it('calls validate()', async () => {
            const validate = jest.fn((value: unknown) => value === 'test');
            // @ts-ignore
            const result = await validateAgainstSchema({ type: 'any', validate: validate }, 'test');
            expect(result).toBe(true);
            expect(validate.mock.calls).toHaveLength(1);
            expect(validate.mock.results[0].value).toBe(true);
        });
    });
});