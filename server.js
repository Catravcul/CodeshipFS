import 'dotenv/config.js'
import { join } from 'path'
import fileupload from 'express-fileupload'
import express from 'express'
const route = express()

route.use(express.static(join(process.cwd(), 'public')))
route.use(fileupload({
    limits: {fileSize: 6 * 1024 * 1024},
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

route.put('/', (req, res) => {
    req.files.img.mv('public' + req.body.path)
    res.status(200).json({path: req.body.path, msg: 'The image is upload!'})
})

route.listen(process.env.PORT)