const express = require('express')
const { update } = require('./userController')
const route = express.Router()


route.route('/')
.patch( update )

module.exports = {
    userRoute: route
}