// deep clone objects
function deepClone(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    const clone = [];
    obj.forEach(value => {
      clone.push(deepClone(value));
    });
    return clone;
  } else {
    const clone = {};
    Object.keys(obj).forEach(key => {
      clone[key] = deepClone(obj[key])
    });
    return clone;
  }
}

exports.deepClone = deepClone;
