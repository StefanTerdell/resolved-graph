export const equalsRight = (left, right) => Object
    .keys(right)
    .reduce((match, key) => 
        match && 
        left[key] !== undefined && typeof right[key] === 'object' 
            ? equalsRight(left[key], right[key]) 
            : left[key] === right[key], 
        true)