export const matchDeepRight = (left, right) =>
  right === undefined ||
  left === right ||
  (typeof right === 'object' && Array.isArray(right)
    ? Array.isArray(left) && right.reduce((match, rightValue) => match && left.find((leftValue) => matchDeepRight(leftValue, rightValue)) !== undefined, true)
    : typeof left === 'object' && Object.keys(right).reduce((match, key) => match && matchDeepRight(left[key], right[key]), true))
