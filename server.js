import { getConfig } from './config.js'
import { join } from 'path'
import { get } from 'https'
import { userRoute } from './user/userRoute.js'
import cors from 'cors'
import mongoose from 'mongoose'
import fileupload from 'express-fileupload'
import express from 'express'
const route = express()
const config = getConfig()

route.use(cors({
    origin: config.allowedUrls,
    allowedHeaders: config.allowedHeaders,
    methods: config.allowedMethods
}))

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
    if (!token) {
        res.status(300).json({msg: 'A token is required'})
    } else {
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
    }

    function getImgPath(get) {
        try {
            get(options, request => {
                let response = ''
                request.on('data', data => response += data)
                request.on('end', () => {
                    const {id, username, err} = JSON.parse(response)
                    if (err) {
                        res.status(300).json({err})
                    } else {
                        req.id = id
                        req.username = username
                        next()
                    }
                })
                request.on('error', err => res.status(300).json({err}))
            }).on('error', err => res.status(300).json({err}))
        } catch (err) {
            res.status(300).json({err})
        }
    }
})

route.use('/user', userRoute)

route.use('*', (req, res) => res.status(300).json({err: 'route not found'}))
route.listen(config.port)