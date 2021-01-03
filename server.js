import { getConfig } from './config.js'
import { join } from 'path'
import { unlink } from 'fs'
import { get } from 'https'
import fileupload from 'express-fileupload'
import express from 'express'
const route = express()
const config = getConfig()

route.use((req, res, next) => {
    const origins = config.allowedUrls
    const index = origins.indexOf(req.headers.origin)
    res.set({
        'Access-Control-Allow-Origin': origins[index],
        'Access-Control-Allow-Headers': config.allowedHeaders,
        'Access-Control-Allow-Methods': config.allowedMethods
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
    if (config.secret === req.header('x-access-token')) {
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
        hostname: config.codeshipApi.hostname,
        port: 5000,
        path: '/token/img_path',
        method: 'GET',
        headers: {'x-access-token': token}
    }
    if (config.mode !== 'PROD') {
        import('http').then(({get}) => getImgPath(get))
    } else {
        getImgPath(get)
    }

    function getImgPath(get) {
        get(options, request => {
            let response = ''
            request.on('data', data => response += data)
            request.on('end', () => {
                req.img_path = JSON.parse(response).img_path
                next()
            })
            request.on('error', err => console.log(err))
        })
    }
})

route.put('/', (req, res) => {
    req.files.img.mv('public' + req.body.path)
    res.status(200).json({path: req.body.path, msg: 'The image is upload!'})
})

route.listen(config.port)