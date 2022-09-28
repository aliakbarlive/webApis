class ErrorResponse extends Error {
  constructor(message, statusCode, errors = undefined, logout = false) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.logout = logout;
  }
}

module.exports = ErrorResponse;
