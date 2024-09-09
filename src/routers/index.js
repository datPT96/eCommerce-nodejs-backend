'use strict'

const express = require('express')
const { apiKey, checkPermission } = require('../auth/checkAuth')
const router = express.Router()

//check api key
router.use(apiKey)
// check permission
router.use(checkPermission('0000'))

router.use('/v1/api', require('./access'))
// router.get('', (req, res, next) => {
//   return res.status(200).json({
//     message: 'Welcome shopDev!'
//   })
// })

module.exports = router
