'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  /**
   * 1- check this token used
   */
  static handleRefreshToken = async (refreshToken) => {
    // 1
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    // neu co
    if (foundToken) {
      // decode foundToken
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
      console.log({ userId, email })

      //xoa tat ca token trong key store
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happened!! Pls re-login')
    }

    // chua co
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Shop not registered!')

    //verify token
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
    // check userId
    console.log('[2]===', { userId, email })

    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered! 2')

    // create token pair
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
    // udpate tokens
    await holderToken.update({
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: {
        refreshTokenUsed: refreshToken //da duoc su dung lay token roi
      }
    })

    return {
      user: { userId, email },
      tokens
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)

    console.log(delKey)
    return delKey
  }

  static login = async ({ email, password, refreshToken = null }) => {
    /**
     * 1- check email in db
     * 2- matching password
     * 3- create AT vs RT and save
     * 4- generate tokens
     * 5- get data return login
     */

    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new BadRequestError('Shop not registered')
    }

    const matching = bcrypt.compare(password, foundShop.password)
    if (!matching) {
      throw new AuthFailureError('Authentication error')
    }

    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    const { _id: userId } = foundShop._id
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId
    })

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    // try {
    //step1: check email existed?
    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered!')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash
    })

    if (newShop) {
      // create privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem'
      //   }
      // })

      // const publicKeyString = await KeyTokenService.createKeyToken({
      //   userId: newShop._id,
      //   publicKey
      // })

      // if (!publicKeyString) {
      //   return {
      //     code: 'xxx',
      //     message: 'publicKey error'
      //   }
      // }

      //lv 1,2
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')

      // save collection key store
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      })

      if (!keyStore) {
        throw new BadRequestError('Keystore error')
      }
      //create token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
      // console.log('created token', tokens)

      return {
        code: 201,
        metadata: {
          shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
          tokens
        }
      }
    }

    return {
      code: 200,
      metadata: null
    }
    // } catch (error) {
    //   return {
    //     code: 'xxx',
    //     message: error,
    //     status: 'error'
    //   }
    // }
  }
}

module.exports = AccessService
