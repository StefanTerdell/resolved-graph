/**
 * Returns true if the left argument has the same type and value as the right argument or the right argument is null or undefined
 *
 * If the arguments are objects, returns true if the left object contains properties matching the type and value of all of the right objects properties
 *
 * If the arguments are arrays, returns true if the left array contains items matching the type and value of all of the items in the right array
 *
 * If any of the properties or items are objects or arrays, the function will run recursively through their propertierties or items
 */
export const matchDeepRight = (left, right): boolean =>
  //If right is null or undefined then we obviously dont really want to match anything. Return true.
  right == null ||
  //If left is null or undefined however, the opposite applies. Nothing to match to. Quick exit && return false
  (left != null &&
    //Compare by value if primitive, reference if object
    (left === right ||
      //Entering object territory
      (typeof right === 'object' &&
      //If the object is one of the weird built in constructors...
      (right instanceof Date ||
        right instanceof String ||
        right instanceof Number ||
        right instanceof Boolean ||
        right instanceof RegExp)
        ? //We can still compare by value if we are expressive enough
          left <= right && left >= right
        : //Array is still an object
        Array.isArray(right)
        ? // If left isnt an arry, exit early
          Array.isArray(left) &&
          //Go trough all the items on the right
          right.reduce(
            //If we have an item on the right that we cant find the equavelient on the left, its all false from there on so dont bother deepmatching
            (match, rightValue) => match && left.find((leftValue) => matchDeepRight(leftValue, rightValue)) !== undefined,
            //... but lets start optimistically! Also catches "the true" if right is an empty array.
            true,
          )
        : //Regular old object (hopefully) ... so lets deep check the properties
          typeof left === 'object' &&
          Object.keys(right).reduce((match, key) => match && matchDeepRight(left[key], right[key]), true)) ||
      // Neat way to check functions! Can be different instances and will still check out here.
      (typeof right === 'function' && left.toString() === right.toString())))
