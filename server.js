import { getConfig } from './config.js'
import { join } from 'path'
import { get } from 'https'
import { userRoute } from './user/userRoute.js'
import mongoose from 'mongoose'
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
        return next()
    }
})

route.use(express.static(join(process.cwd(), 'public')))

mongoose.connect(config.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
.then(() => console.log('connection successfull'))
.catch((err) => console.log(err.message))
    
route.use(fileupload({
    limits: {fileSize: 6 * 1024 * 1024},
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

route.use((req, res, next) => {
    const token = req.header('x-access-token')
    if (!token) res.status(300).json({msg: 'A token is required'})
    const options = {
        hostname: config.codeshipApi.hostname,
        port: 5000,
        path: '/token/data',
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
                const {id, username, status, message} = JSON.parse(response)
                if (status === 'fail') {
                    res.status(300).json({status, message})
                } else {
                    req.id = id
                    req.username = username
                    next()
                }
            })
            request.on('error', err => console.log(err))
        })
    }
})

route.use('/user', userRoute)

route.listen(config.port)