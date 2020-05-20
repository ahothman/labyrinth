class HttpError {
  constructor(message, status) {
    this.message = message;
    this.status = status || 500;
  }
}

module.exports = {
  HttpError,
};
