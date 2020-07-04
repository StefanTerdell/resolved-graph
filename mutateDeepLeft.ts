export const mutateDeepLeft = (left, right) => Object.keys(right)
    .forEach(key => typeof right[key] === 'object' 
        ? mutateDeepLeft((left[key] !== undefined || (left[key] = {})) && left[key], right[key]) 
        : left[key] = right[key])