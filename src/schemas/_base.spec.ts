declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import { validateSchema } from './_base';

describe('Schema: Base', () => {
    it('validates schema as base', () => {
        // @ts-ignore
        expect(validateSchema()).toBe(false);
        // @ts-ignore
        expect(validateSchema(null)).toBe(false);

        expect(validateSchema({type: 'valid'}, 'valid')).toBe(true);
        expect(validateSchema({type: 'valid'}, 'invalid')).toBe(false);
    });
});