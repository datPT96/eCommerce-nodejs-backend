'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    // const accessToken = await JWT.sign(payload, privateKey, {
    //   algorithm: 'RS256',
    //   expiresIn: '2 days'
    // })

    //lv 1,2
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days'
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days'
    })

    //
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify`)
      } else {
        console.log(`decode verify::`, decode)
      }
    })

    return {
      accessToken,
      refreshToken
    }
  } catch (error) {}
}

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1 - check userId missing??
   * 2 - get access token
   * 3 - verify token
   * 4 - check user in db
   * 5 - check keystore with this userID
   * 6 - OK all => return next
   */

  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid request')

  //2
  const keyStore = await findByUserId(userId)

  if (!keyStore) throw new NotFoundError('Not found key store')

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid request')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')

    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
})

const verifyJWT = async (token, keyScret) => {
  return await JWT.verify(token, keyScret)
}
module.exports = { createTokenPair, authentication, verifyJWT }
