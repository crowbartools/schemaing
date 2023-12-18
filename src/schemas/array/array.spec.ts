// because ts-jest is dumb
declare const jest:     import('@jest/environment').Jest;
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import {
    default as validateAgainstSchema,
    validateSchema
} from './array';

describe('Schema: Array', () => {

    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({ type: 'array' })).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates .contentIgnoresAs', () => {
            expect(validateSchema({ type: 'array', contentIgnoresAs: undefined })).toBe(true);
            expect(validateSchema({ type: 'array', contentIgnoresAs: false })).toBe(true);
            expect(validateSchema({ type: 'array', contentIgnoresAs: true })).toBe(true);
            expect(validateSchema({ type: 'array', contentIgnoresAs: null })).toBe(false);
            expect(validateSchema({ type: 'array', contentIgnoresAs: 'invalid' })).toBe(false);
        });
        it('validates .notEmpty', () => {
            expect(validateSchema({ type: 'array', notEmpty: undefined })).toBe(true);
            expect(validateSchema({ type: 'array', notEmpty: false })).toBe(true);
            expect(validateSchema({ type: 'array', notEmpty: true })).toBe(true);
            expect(validateSchema({ type: 'array', notEmpty: null })).toBe(false);
            expect(validateSchema({ type: 'array', notEmpty: 'invalid' })).toBe(false);
        });
        it('validates .content', () => {
            expect(validateSchema({ type: 'array', content: ["string"] })).toBe(true);
            expect(validateSchema({ type: 'array', content: undefined })).toBe(true);
            expect(validateSchema({ type: 'array', content: null })).toBe(false);
            expect(validateSchema({ type: 'array', content: 'invalid' })).toBe(false);
            expect(validateSchema({ type: 'array', content: ['invalid'] })).toBe(false);
            expect(validateSchema({ type: 'array', content: [[]] })).toBe(false);
            expect(validateSchema({ type: 'array', content: [['invalid']] })).toBe(false);
        });
        it('validates .as', () => {
            expect(validateSchema({ type: 'array', as: "string" })).toBe(true);
            expect(validateSchema({ type: 'array', as: ["string"] })).toBe(true);
            expect(validateSchema({ type: 'array', as: ["string", "boolean"] })).toBe(true);
            expect(validateSchema({ type: 'array', as: undefined })).toBe(true);
            expect(validateSchema({ type: 'array', as: null })).toBe(false);
            expect(validateSchema({ type: 'array', as: 'invalid' })).toBe(false);
            expect(validateSchema({ type: 'array', as: ['invalid'] })).toBe(false);
        });
        it('validates .validate', () => {
            expect(validateSchema({ type: 'array', validate: undefined })).toBe(true);
            expect(validateSchema({ type: 'array', validate: () => {} })).toBe(true);
            expect(validateSchema({ type: 'array', validate: null })).toBe(false);
            expect(validateSchema({ type: 'array', validate: 'invalid' })).toBe(false);
        });
    });

    describe('validateAgainstSchema()', () => {
        it('false when schema is invalid', async () => {
            // @ts-ignore
            expect(await validateAgainstSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates against schema', async () => {
            expect(await validateAgainstSchema({ type: 'array' }, [])).toBe(true);
            expect(await validateAgainstSchema({ type: 'array', notEmpty: true }, ['item'])).toBe(true);
            expect(await validateAgainstSchema({ type: 'array', notEmpty: true }, [])).toBe(false);
            expect(await validateAgainstSchema({ type: 'array', content: [ 'string' ] }, ['item'])).toBe(true);
            expect(await validateAgainstSchema({ type: 'array', content: [ 'string' ] }, [false])).toBe(false);
            expect(await validateAgainstSchema({ type: 'array', content: [ 'string' ] }, [])).toBe(false);
            expect(await validateAgainstSchema({ type: 'array', content: [ [ 'string', 'boolean' ] ] }, [true])).toBe(true);
            expect(await validateAgainstSchema({ type: 'array', content: [ [ 'string', 'boolean' ] ] }, [10])).toBe(false);
            expect(await validateAgainstSchema({ type: 'array', as: 'string' }, [])).toBe(true);
            expect(await validateAgainstSchema({ type: 'array', as: 'string' }, ['item'])).toBe(true);
            expect(await validateAgainstSchema({ type: 'array', as: 'string' }, [null])).toBe(false);
            expect(await validateAgainstSchema({ type: 'array', as: [ 'string', 'boolean' ] }, ['item', true])).toBe(true);
            expect(await validateAgainstSchema({ type: 'array', as: [ 'string', 'boolean' ] }, [10])).toBe(false);
            expect(await validateAgainstSchema({ type: 'array', as: 'boolean', content: ['string'], contentIgnoresAs: true }, ['item', true])).toBe(true);
            expect(await validateAgainstSchema({ type: 'array', as: 'boolean', content: ['string'] }, ['item', true])).toBe(false);
            expect(await validateAgainstSchema({ type: 'array', content: [ 'string' ] }, ['item', 'item2'])).toBe(false);
        });
        it('calls .validate', async () => {
            const validate = jest.fn((value: unknown) => true);
            const result = await validateAgainstSchema({ type: 'array', validate: validate }, []);
            expect(result).toBe(true);
            expect(validate.mock.calls).toHaveLength(1);
            expect(validate.mock.results[0].value).toBe(true);
        });
    });
});