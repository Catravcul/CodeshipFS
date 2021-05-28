import express from 'express'
import { insert, getStatus } from './controller.js'

const route = express.Router()

route.route('/')
.put( insert )

route.get('/status', getStatus )

export default route