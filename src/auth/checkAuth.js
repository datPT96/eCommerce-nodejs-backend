'use strict'

const { findById } = require('../services/apiKey.service')

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.header[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden error'
      })
    }

    // check objKey
    const objKey = await findById(key)
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden error'
      })
    }

    req.objKey = objKey
    return next()
  } catch (error) {}
}

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }

    console.log(req.objKey.permissions)
    const validPermision = req.objKey.permissions.includes(permission)
    if (!validPermision) {
      return res.status(403).json({
        message: 'Permission denied'
      })
    }

    return next()
  }
}

module.exports = {
  apiKey,
  checkPermission
}
