import { getStore } from '../store';

test('example', () => {
    const store = getStore();
    console.log(store)
    expect(true).toBe(true);
})