'use strict'

const { findById } = require('../services/apiKey.service')

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({
        message: 'Api key not found!'
      })
    }

    // check objKey
    const objKey = await findById(key)
    if (!objKey) {
      return res.status(403).json({
        message: 'Api key forbidden error!'
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
        message: 'Permission denied:: not found'
      })
    }

    console.log(req.objKey.permissions)
    const validPermision = req.objKey.permissions.includes(permission)
    if (!validPermision) {
      return res.status(403).json({
        message: 'Permission denied:: valid permission'
      })
    }

    return next()
  }
}

//middleware handler error
const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = {
  apiKey,
  checkPermission,
  asyncHandler
}
