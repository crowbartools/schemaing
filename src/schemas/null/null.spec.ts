// because ts-jest is dumb
declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { default as validateAgainstSchema, aliases, validateSchema } from './null';

describe('Schema: Null', () => {
    describe('validateSchema()', () => {
        it('validates .type', () => {
            expect(validateSchema({ type: 'null' })).toBe(true);
            expect(validateSchema()).toBe(false);
            expect(validateSchema({ type: 'invalid' })).toBe(false);
        });
        it('validates .loose', () => {
            expect(validateSchema({ type: 'null', loose: undefined })).toBe(true);
            expect(validateSchema({ type: 'null', loose: true })).toBe(true);
            expect(validateSchema({ type: 'null', loose: false })).toBe(true);
            expect(validateSchema({ type: 'null', loose: null })).toBe(false);
            expect(validateSchema({ type: 'null', loose: 0 })).toBe(false);
            expect(validateSchema({ type: 'null', loose: 1 })).toBe(false);
            expect(validateSchema({ type: 'null', loose: 'true'})).toBe(false);
        });
        it('validates .allowUndefined', () => {
            expect(validateSchema({ type: 'null', allowUndefined: undefined })).toBe(true);
            expect(validateSchema({ type: 'null', allowUndefined: true })).toBe(true);
            expect(validateSchema({ type: 'null', allowUndefined: false })).toBe(true);
            expect(validateSchema({ type: 'null', allowUndefined: null })).toBe(false);
            expect(validateSchema({ type: 'null', allowUndefined: 0 })).toBe(false);
            expect(validateSchema({ type: 'null', allowUndefined: 1 })).toBe(false);
            expect(validateSchema({ type: 'null', allowUndefined: 'true'})).toBe(false);
        });
        it('validates .allowZero', () => {
            expect(validateSchema({ type: 'null', allowZero: true })).toBe(true);
            expect(validateSchema({ type: 'null', allowZero: undefined })).toBe(true);
            expect(validateSchema({ type: 'null', allowZero: false })).toBe(true);
            expect(validateSchema({ type: 'null', allowZero: null })).toBe(false);
            expect(validateSchema({ type: 'null', allowZero: 0 })).toBe(false);
            expect(validateSchema({ type: 'null', allowZero: 1 })).toBe(false);
            expect(validateSchema({ type: 'null', allowZero: 'true'})).toBe(false);
        });
        it('validates .allowEmptyString', () => {
            expect(validateSchema({ type: 'null', allowEmptyString: undefined })).toBe(true);
            expect(validateSchema({ type: 'null', allowEmptyString: true })).toBe(true);
            expect(validateSchema({ type: 'null', allowEmptyString: false })).toBe(true);
            expect(validateSchema({ type: 'null', allowEmptyString: null })).toBe(false);
            expect(validateSchema({ type: 'null', allowEmptyString: 0 })).toBe(false);
            expect(validateSchema({ type: 'null', allowEmptyString: 1 })).toBe(false);
            expect(validateSchema({ type: 'null', allowEmptyString: 'true'})).toBe(false);
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
            expect(await validateAgainstSchema({ type: 'null' }, null)).toBe(true);
            expect(await validateAgainstSchema({ type: 'null' }, undefined)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null' }, false)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null' }, 0)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null' }, '')).toBe(false);
            expect(await validateAgainstSchema({ type: 'null' }, 'invalid')).toBe(false);

            expect(await validateAgainstSchema({ type: 'null', allowUndefined: true }, null)).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', allowUndefined: true }, undefined)).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', allowUndefined: true }, 0)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', allowUndefined: true }, '')).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', allowUndefined: true }, false)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', allowUndefined: true }, 'invalid')).toBe(false);

            expect(await validateAgainstSchema({ type: 'null', allowZero: true }, null)).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', allowZero: true }, undefined)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', allowZero: true }, 0)).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', allowZero: true }, '')).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', allowZero: true }, false)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', allowZero: true }, 'invalid')).toBe(false);

            expect(await validateAgainstSchema({ type: 'null', allowEmptyString: true }, null)).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', allowEmptyString: true }, undefined)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', allowEmptyString: true }, 0)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', allowEmptyString: true }, '')).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', allowEmptyString: true }, false)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', allowEmptyString: true }, 'invalid')).toBe(false);

            expect(await validateAgainstSchema({ type: 'null', loose: true }, null)).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', loose: true }, undefined)).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', loose: true }, 0)).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', loose: true }, '')).toBe(true);
            expect(await validateAgainstSchema({ type: 'null', loose: true }, false)).toBe(false);
            expect(await validateAgainstSchema({ type: 'null', loose: true }, 'invalid')).toBe(false);
        });
    });
});