'use strict'

const { ReasonPhrases, HttpStatus } = require('../constants')

// const StatusCode = {
//   FORBIDDEN: 403,
//   CONFLICT: 409
// }

// const ReasonStatusCode = {
//   FORBIDDEN: 'Bad request error',
//   CONFLICT: 'Conflict error'
// }

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, statusCode = HttpStatus.FORBIDDEN) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, statusCode = HttpStatus.FORBIDDEN) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = HttpStatus.UNAUTHORIZED) {
    super(message, statusCode)
  }
}
class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = HttpStatus.NOT_FOUND) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError
}
