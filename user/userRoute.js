import express from 'express'
import { update } from './userController.js'
export const userRoute = express.Router()

userRoute.route('/')
.patch( update )