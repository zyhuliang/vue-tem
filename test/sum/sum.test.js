const sum = require('./sum');
describe('Component', () => {
    test('测试1+2的结果是3', () => {
        expect(sum(1, 2)).toBe(3);
    });
})

