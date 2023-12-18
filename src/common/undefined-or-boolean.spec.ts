declare const describe: import('@jest/types').Global.GlobalAdditions['describe'];
declare const it:       import('@jest/types').Global.GlobalAdditions['it'];
declare const expect:   import('@jest/expect').JestExpect;

import undefinedOrBoolean from './undefined-or-boolean';

describe('Common: undefinedOrBoolean', () => {
    it('validates', () => {
        expect(undefinedOrBoolean(undefined, 'key')).toBe(false);
        expect(undefinedOrBoolean(null, 'key')).toBe(false);
        expect(undefinedOrBoolean({}, 'key')).toBe(true);
        expect(undefinedOrBoolean({key: undefined}, 'key')).toBe(true);
        expect(undefinedOrBoolean({key: true}, 'key')).toBe(true);
        expect(undefinedOrBoolean({key: false}, 'key')).toBe(true);
        expect(undefinedOrBoolean({key: 'invalid'}, 'key')).toBe(false);
    });
});