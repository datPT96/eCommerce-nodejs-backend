'use strict'

const { HttpStatus, ReasonPhrases } = require('../constants')

class SuccessRespones {
  constructor({ message, statusCode = HttpStatus.OK, reason = ReasonPhrases.OK, metadata = {} }) {
    this.message = !message ? reason : message
    this.status = statusCode
    this.metadata = metadata
  }

  send(res, headers = {}) {
    console.log(this.status)
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessRespones {
  constructor({ message, metadata }) {
    super({ message, metadata })
  }
}

class CREATED extends SuccessRespones {
  constructor({ message, statusCode = HttpStatus.CREATED, reason = ReasonPhrases.CREATED, metadata, options = {} }) {
    super({ message, statusCode, reason, metadata })
    this.options = options
  }
}

module.exports = {
  OK,
  CREATED
}
