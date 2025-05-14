const {hello, addition} = require("../src/index")

describe('Index.js', () => {
    test('Returns Hello World', () => {
        expect(hello()).toBe("Hello World!")
    })

    test('Returns 4 when adding 2+2', () => {
        expect(addition(2, 2)).toBe(4)
    })
})
    
