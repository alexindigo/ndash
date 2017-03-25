export { combine };

function combine(original) {

  let base;

  // collapse original
  if (Array.isArray(original)) {
    base = original[0];
    original = combine.apply(null, original);
  }

  const combined = Object.assign.apply(Object, [{}].concat(original, Array.prototype.slice.call(arguments, 1)));

  for (let key in combined) {
    if (combined[key] === undefined) {
      delete combined[key];
    }

    if (typeof combined[key] == 'function') {
      combined[key] = combined[key](original, base);
    }
  }

  return combined;
}
