module.exports = (src) => {
  let target = {};
  // using for/in on object also returns prototype properties
  for (let prop in src) {
    // .hasOwnProperty() filters out these prototype properties.
    if (src.hasOwnProperty(prop)) {
      target[prop] = src[prop]; //iteratively copies over values, not references
    }
  }
  return target;
};
