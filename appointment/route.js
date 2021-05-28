import express from 'express'
import { insert } from './controller.js'

const route = express.Router()

route.route('/')
.put( insert )

export default route