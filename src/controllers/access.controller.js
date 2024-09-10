'use strict'

const AccessService = require('../services/access.service')
const { CREATED, SuccessRespones } = require('../core/success.response')

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessRespones({
      message: 'Get tokens success!',
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessRespones({
      message: 'Logout success!',
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessRespones({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }
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
