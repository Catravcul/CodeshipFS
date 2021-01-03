import 'dotenv/config.js'
import { join } from 'path'
import { unlink } from 'fs'
import { get, request } from 'https'
import fileupload from 'express-fileupload'
import express from 'express'
const route = express()

route.use((req, res, next) => {
    const origins = process.env.ALLOWED_URLS.split(',')
    const index = origins.indexOf(req.headers.origin)
    res.set({
        'Access-Control-Allow-Origin': origins[index],
        'Access-Control-Allow-Headers': process.env.ALLOWED_HEADERS,
        'Access-Control-Allow-Methods': process.env.ALLOWED_METHODS
    })
    if (req.method === 'OPTIONS') {
        res.status(200).json({})
    } else {
        next()
    }
})

route.use(express.static(join(process.cwd(), 'public')))
route.use(fileupload({
    limits: {fileSize: 6 * 1024 * 1024},
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

route.delete('/', (req, res) => {
    if (process.env.SECRET === req.header('x-access-token')) {
        unlink('./public' + req.headers.img_path, (err) => {
            if (err) {
                res.status(500).json({err})
            } else {
                res.status(200).json({msg: 'image erased'})
            }
        })
    } else {
        res.status(300).json({msg: 'access denied!'})
    }
})

route.use((req, res, next) => {
    const token = req.header('x-access-token')
    if (!token) res.status(300).json({msg: 'A token is required'})
    const options = {
        hostname: 'codeship-api.herokuapp.com',
        port: 443,
        path: '/token/img_path',
        method: 'GET',
        headers: {'x-access-token': token}
    }
    get(options, request => {
        let response = ''
        request.on('data', data => response += data)
        request.on('end', () => {
            req.img_path = JSON.parse(response).img_path
            next()
        })
        request.on('error', err => console.log(err))
    }).end()
})

route.put('/', (req, res) => {
    req.files.img.mv('public' + req.body.path)
    res.status(200).json({path: req.body.path, msg: 'The image is upload!'})
})

route.listen(process.env.PORT)