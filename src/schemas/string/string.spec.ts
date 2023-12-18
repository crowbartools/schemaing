// because ts-jest is dumb
declare const jest:     import('@jest/environment').Jest;
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, aliases, validateSchema } from './string';

describe('Schema: String', () => {

    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({ type: 'string' })).toBe(true);
            expect(validateSchema({ type: 'text' })).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates .loose', () => {
            expect(validateSchema({ type: 'string', loose: undefined })).toBe(true);
            expect(validateSchema({ type: 'string', loose: true })).toBe(true);
            expect(validateSchema({ type: 'string', loose: false })).toBe(true);
            expect(validateSchema({ type: 'string', loose: null })).toBe(false);
            expect(validateSchema({ type: 'string', loose: 0 })).toBe(false);
            expect(validateSchema({ type: 'string', loose: 1 })).toBe(false);
            expect(validateSchema({ type: 'string', loose: 'true'})).toBe(false);
        });
        it('validates .notEmpty', () => {
            expect(validateSchema({ type: 'string', notEmpty: undefined })).toBe(true);
            expect(validateSchema({ type: 'string', notEmpty: true })).toBe(true);
            expect(validateSchema({ type: 'string', notEmpty: false })).toBe(true);
            expect(validateSchema({ type: 'string', notEmpty: null })).toBe(false);
            expect(validateSchema({ type: 'string', notEmpty: 0 })).toBe(false);
            expect(validateSchema({ type: 'string', notEmpty: 1 })).toBe(false);
            expect(validateSchema({ type: 'string', notEmpty: 'true' })).toBe(false);
        });
        it('validates .match', () => {
            expect(validateSchema({ type: 'string', match: / /g })).toBe(true);
            expect(validateSchema({ type: 'string', match: 'text' })).toBe(false);
        });
        it('validates .is', () => {
            expect(validateSchema({ type: 'string', is: '' })).toBe(true);
            expect(validateSchema({ type: 'string', is: undefined })).toBe(true);
            expect(validateSchema({ type: 'string', is: null })).toBe(false);
            expect(validateSchema({ type: 'string', is: true })).toBe(false);
            expect(validateSchema({ type: 'string', is: false })).toBe(false);
            expect(validateSchema({ type: 'string', is: 1 })).toBe(false);
        });
        it('false when .is and .match are specified', () => {
            expect(validateSchema({type: 'string', is: '', match: / / })).toBe(false);
        });
        it('validates .validate', () => {
            expect(validateSchema({ type: 'string', validate: undefined })).toBe(true);
            expect(validateSchema({ type: 'string', validate: () => {} })).toBe(true);
            expect(validateSchema({ type: 'string', validate: null })).toBe(false);
            expect(validateSchema({ type: 'string', validate: 'invalid' })).toBe(false);
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
            expect(await validateAgainstSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates against schema', async () => {
            expect(await validateAgainstSchema({ type: 'string' }, 'text')).toBe(true);
            expect(await validateAgainstSchema({ type: 'string' }, undefined)).toBe(false);
            expect(await validateAgainstSchema({ type: 'string' }, null)).toBe(false);
            expect(await validateAgainstSchema({ type: 'string' }, true)).toBe(false);
            expect(await validateAgainstSchema({ type: 'string' }, false)).toBe(false);
            expect(await validateAgainstSchema({ type: 'string' }, 0)).toBe(false);
            expect(await validateAgainstSchema({ type: 'string' }, [])).toBe(false);
            expect(await validateAgainstSchema({ type: 'string' }, {})).toBe(false);

            expect(await validateAgainstSchema({ type: 'string', loose: true }, undefined)).toBe(true);
            expect(await validateAgainstSchema({ type: 'string', loose:  true }, null)).toBe(true);
            expect(await validateAgainstSchema({ type: 'string', loose:  true }, true)).toBe(true);
            expect(await validateAgainstSchema({ type: 'string', loose:  true }, false)).toBe(true);
            expect(await validateAgainstSchema({ type: 'string', loose:  true }, 0)).toBe(true);
            expect(await validateAgainstSchema({ type: 'string', loose:  true }, new String(''))).toBe(true);
            expect(await validateAgainstSchema({ type: 'string', loose:  true }, Infinity)).toBe(false);
            expect(await validateAgainstSchema({ type: 'string', loose:  true }, [])).toBe(false);
            expect(await validateAgainstSchema({ type: 'string', loose:  true }, {})).toBe(false);

            expect(await validateAgainstSchema({ type: 'string', notEmpty: true }, 'test')).toBe(true);
            expect(await validateAgainstSchema({ type: 'string', notEmpty: true }, '')).toBe(false);

            expect(await validateAgainstSchema({ type: 'string', is: 'test' }, 'test')).toBe(true);
            expect(await validateAgainstSchema({ type: 'string', is: 'test' }, '')).toBe(false);

            expect(await validateAgainstSchema({ type: 'string', match: /^test$/ }, 'test')).toBe(true);
            expect(await validateAgainstSchema({ type: 'string', match: /^test$/ }, '')).toBe(false);
        });
        it('calls .validate', async () => {
            const validate = jest.fn((value: unknown) => value === 'test');
            // @ts-ignore
            const result = await validateAgainstSchema({ type: 'string', validate: validate }, 'test');
            expect(result).toBe(true);
            expect(validate.mock.calls).toHaveLength(1);
            expect(validate.mock.results[0].value).toBe(true);
        });
    });
});