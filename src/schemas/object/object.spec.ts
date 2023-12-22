// because ts-jest is dumb
declare const jest:     import('@jest/environment').Jest;
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, validateSchema } from './object';

describe('Schema: Object', () => {
    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({ type: 'object', properties: {} })).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'object' })).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates .properties', () => {
            expect(validateSchema({ type: 'object', properties: undefined })).toBe(false);
            expect(validateSchema({ type: 'object', properties: null })).toBe(false);
            expect(validateSchema({ type: 'object', properties: { 'key': 'string' }})).toBe(true);
            expect(validateSchema({ type: 'object', properties: { 'key': ['boolean', 'string'] }})).toBe(true);
            expect(validateSchema({ type: 'object', properties: { 'key': { type: 'string' }}})).toBe(true);
            expect(validateSchema({ type: 'object', properties: { 'key': { type: 'invalid' }}})).toBe(false);

            expect(validateSchema({ type: 'object', properties: { 'key': 'invalid' }})).toBe(false);
            expect(validateSchema({ type: 'object', properties: { 'key': [] }})).toBe(false);
            expect(validateSchema({ type: 'object', properties: { 'key': ['invalid'] }})).toBe(false);

            expect(validateSchema({ type: 'object', properties: { 'key': { optional: undefined, type: 'string' }}})).toBe(true);
            expect(validateSchema({ type: 'object', properties: { 'key': { optional: false, type: 'string' }}})).toBe(true);
            expect(validateSchema({ type: 'object', properties: { 'key': { optional: true, type: 'string' }}})).toBe(true);
            expect(validateSchema({ type: 'object', properties: { 'key': { optional: 'invalid', type: 'string' }}})).toBe(false);

            expect(validateSchema({ type: 'object', properties: { 'key': { types: 'string' }}})).toBe(true);
            expect(validateSchema({ type: 'object', properties: { 'key': { types: ['string'] }}})).toBe(true);
            expect(validateSchema({ type: 'object', properties: { 'key': { types: 'invalid' }}})).toBe(false);
            expect(validateSchema({ type: 'object', properties: { 'key': { types: [] }}})).toBe(false);
            expect(validateSchema({ type: 'object', properties: { 'key': { types: ['invalid'] }}})).toBe(false);
        });
        it('validates .allowExtraProperties', () => {
            expect(validateSchema({ type: 'object', properties: {}, allowExtraProperties: undefined })).toBe(true);
            expect(validateSchema({ type: 'object', properties: {}, allowExtraProperties: true })).toBe(true);
            expect(validateSchema({ type: 'object', properties: {}, allowExtraProperties: false })).toBe(true);
            expect(validateSchema({ type: 'object', properties: {}, allowExtraProperties: null })).toBe(false);
            expect(validateSchema({ type: 'object', properties: {}, allowExtraProperties: 0 })).toBe(false);
            expect(validateSchema({ type: 'object', properties: {}, allowExtraProperties: 1 })).toBe(false);
            expect(validateSchema({ type: 'object', properties: {}, allowExtraProperties: 'true'})).toBe(false);
        });
        it('validates .validate', () => {
            expect(validateSchema({ type: 'object', properties: {}, validate: undefined })).toBe(true);
            expect(validateSchema({ type: 'object', properties: {}, validate: () => {} })).toBe(true);
            expect(validateSchema({ type: 'object', properties: {}, validate: null })).toBe(false);
            expect(validateSchema({ type: 'object', properties: {}, validate: 'invalid' })).toBe(false);
        });
    });
    describe('validateAgainstSchema()', () => {
        it('false when schema is invalid', async () => {
            // @ts-ignore
            expect(await validateAgainstSchema()).toBe(false);
            expect(await validateAgainstSchema({ type: 'invalid' }, {})).toBe(false);
        });
        it('validates against schema', async () => {
            expect(await validateAgainstSchema({ type: 'object', properties: { key: 'string' }}, { key: 'item' })).toBe(true);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: 'string' }}, { key: true })).toBe(false);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: ['string'] }}, { key: 'item' })).toBe(true);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: ['string', 'number'] }}, { key: true })).toBe(false);
            expect(await validateAgainstSchema({ type: 'object', properties: {}}, {})).toBe(true);
            expect(await validateAgainstSchema({ type: 'object', properties: {}}, undefined)).toBe(false);
            expect(await validateAgainstSchema({ type: 'object', properties: {}}, null)).toBe(false);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: { type: 'any'}}}, {})).toBe(false);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: { types: ['string', 'boolean'] }}}, { key: true })).toBe(true);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: { types: ['string', 'boolean'] }}}, { key: null })).toBe(false);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: { type: 'boolean' }}}, { key: 'item' })).toBe(false);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: { types: 'string' }}}, { key: false })).toBe(false);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: { type: 'any'} }, allowExtraProperties: false }, {key: 'value'})).toBe(true);
            expect(await validateAgainstSchema({ type: 'object', properties: { key: { type: 'any'} }, allowExtraProperties: false }, {key: 'value', key2: 'value'})).toBe(false);
        });
        it('calls .validate', async () => {
            const validate = jest.fn((value: unknown) => true);
            const result = await validateAgainstSchema({ type: 'object', properties: {}, validate: validate }, {});
            expect(result).toBe(true);
            expect(validate.mock.calls).toHaveLength(1);
            expect(validate.mock.results[0].value).toBe(true);
        });
    });
});