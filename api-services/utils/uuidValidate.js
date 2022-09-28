/**
 * verify if value is UUID
 * @param {uuid} value
 * @returns {boolean} returns a Boolean value that indicates whether the string is in UUID format
 */
const uuidValidate = (value) => {
  let uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(value);
};

module.exports = uuidValidate;
