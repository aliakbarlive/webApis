class Response {
  code = 200;
  status = true;
  message = '';
  data;
  errors;

  failed() {
    this.status = false;

    return this;
  }

  withMessage(message) {
    this.message = message;

    return this;
  }

  withCode(code) {
    this.code = code;

    return this;
  }

  withData(data) {
    this.data = data;

    return this;
  }

  withErrors(errors) {
    this.errors = errors;

    return this;
  }
}

module.exports = Response;
