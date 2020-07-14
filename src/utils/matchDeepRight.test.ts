import { matchDeepRight } from './matchDeepRight'

describe('Empty right', () => {
  test('Should return true if right is undefined', () => {
    const left = {
      someData: true,
    }
    const right = undefined
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })

  test('Should return true if right is null', () => {
    const left = {
      someData: true,
    }
    const right = null
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })

  test('Should return true if left is an object and right is an empty object', () => {
    const left = {
      someData: true,
    }
    const right = {}
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })

  test('Should return true if left is an array and right is an empty array', () => {
    const left = [true]
    const right = []
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })
})

describe('Value match', () => {
  test('Should return true if left and right have the same value string', () => {
    const left = 'Hello world!'
    const right = 'Hello world!'
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })

  test('Should return true if left and right have the same value number', () => {
    const left = 0
    const right = 0
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })

  test('Should return true if left and right have the same value boolean', () => {
    const left = false
    const right = false
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })

  test('Should return true if left and right have the same "value" function', () => {
    const left = () => console.log()
    const right = () => console.log()
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })
})

describe('Value mismatch', () => {
  test('Should return false if left and right have a different value string', () => {
    const left = 'Hello world!'
    const right = 'NO!'
    const result = matchDeepRight(left, right)
    expect(result).toBe(false)
  })

  test('Should return false if left and right have a different value number', () => {
    const left = 123
    const right = 321
    const result = matchDeepRight(left, right)
    expect(result).toBe(false)
  })

  test('Should return false if left and right have a different value boolean', () => {
    const left = false
    const right = true
    const result = matchDeepRight(left, right)
    expect(result).toBe(false)
  })

  test('Should return false if left and right have a different "value" function', () => {
    const left = () => console.log()
    const right = () => console.warn()
    const result = matchDeepRight(left, right)
    expect(result).toBe(false)
  })
})

describe('Built in constructors', () => {
  test('Should return true on two RegExp objects with same value', () => {
    expect(matchDeepRight(new RegExp('Hello'), new RegExp('Hello'))).toBe(true)
  })

  test('Should return false on two RegExp objects with different value', () => {
    expect(matchDeepRight(new RegExp('Hello'), new RegExp('World'))).toBe(false)
  })

  test('Should return true on two String objects with same value', () => {
    expect(matchDeepRight(new String('Hello'), new String('Hello'))).toBe(true)
  })

  test('Should return false on two String objects with different value', () => {
    expect(matchDeepRight(new String('Hello'), new String('World'))).toBe(false)
  })

  test('Should return true on two Boolean objects with same value', () => {
    expect(matchDeepRight(new Boolean(true), new Boolean(true))).toBe(true)
  })

  test('Should return false on two Boolean objects with different value', () => {
    expect(matchDeepRight(new Boolean(false), new Boolean(true))).toBe(false)
  })

  test('Should return true on two Number objects with same value', () => {
    expect(matchDeepRight(new Number(42), new Number(42))).toBe(true)
  })

  test('Should return false on two Number objects with different value', () => {
    expect(matchDeepRight(new Number(42), new Number(69))).toBe(false)
  })

  test('Should return true on two Date objects with same value', () => {
    expect(matchDeepRight(new Date(2020, 7), new Date(2020, 7))).toBe(true)
  })

  test('Should return false on two Date objects with different value', () => {
    expect(matchDeepRight(new Date(2020, 7), new Date(793, 6, 8))).toBe(false)
  })

  test('Should return true if left and right contains all the weird constructed value objects with the same values', () => {
    const left = {
      regExp: new RegExp('left|right'),
      boolean: new Boolean(true),
      number: new Number(42),
      str: new String('hello!'),
      date: new Date(2020, 6),
    }

    const right = {
      regExp: new RegExp('left|right'),
      boolean: new Boolean(true),
      number: new Number(42),
      str: new String('hello!'),
      date: new Date(2020, 6),
    }
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })

  test('Should return false if left and right contains all the weird constructed value objects with different values', () => {
    const left = {
      regExp: new RegExp('left|right'),
      boolean: new Boolean(true),
      number: new Number(42),
      str: new String('hello!'),
      date: new Date(2020, 6),
    }

    const right = {
      regExp: new RegExp('right|left'),
      boolean: new Boolean(false),
      number: new Number(69),
      str: new String('world!'),
      date: new Date(1920, 7),
    }
    const result = matchDeepRight(left, right)
    expect(result).toBe(false)
  })
})

describe('Array values', () => {
  test('Should return true if left contains all objects in right, regardless of order', () => {
    const left = [1, 2, 3]
    const right = [2, 3]
    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })

  test('Should return false if left contains one or more, but not all in right, regardless of order', () => {
    const left = [1, 2, 3]
    const right = [3, 4]
    const result = matchDeepRight(left, right)
    expect(result).toBe(false)
  })

  test('Should return true on deep equality in array, regardless of order', () => {
    const left = [
      {
        deep: {
          number: 42,
        },
      },
      {
        deep: {
          str: 'hello!',
          arr: [1, 2, 3],
        },
      },
      {
        something: 'else',
      },
    ]

    const right = [
      {
        deep: {
          str: 'hello!',
          arr: [1, 2],
        },
      },
      {
        deep: {
          number: 42,
        },
      },
    ]

    const result = matchDeepRight(left, right)
    expect(result).toBe(true)
  })
})
