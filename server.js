import 'dotenv/config.js'
import { join } from 'path'
import { get, request } from 'https'
import fileupload from 'express-fileupload'
import express from 'express'
const route = express()

route.use(express.static(join(process.cwd(), 'public')))
route.use(fileupload({
    limits: {fileSize: 6 * 1024 * 1024},
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

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