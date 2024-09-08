'use strict'

const AccessService = require('../services/access.service')
const { CREATED } = require('../core/success.response')

class AccessController {
  signUp = async (req, res, next) => {
    // console.log(`[P]::signUP::`, req.body)
    // return res.status(201).json(await AccessService.signUp(req.body))

    new CREATED({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }
}

module.exports = new AccessController()
