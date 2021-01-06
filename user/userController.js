import { existsSync, unlink } from 'fs'
import User from './userModel.js'

export const update = async (req, res) => {
    try {
        if (req.files.img) {
            const user = await User.findById(req.id)
            if (existsSync('./public' + user.img_path)) {
              unlink('./public' + user.img_path, update)
            } else {
              update()
            }
        } else {
            res.status(400).json({
              err: 'img file could not be found in files'
            })
        }
    } catch (err) {
        res.status(400).json({
            err: err.message
        })
    }

    async function update() {
        const body = {img_path: '/img/user/' + req.username + getExt(req.files.img.mimetype)}
        const updated = await User.findByIdAndUpdate(req.id, body, {
            new: true,
            runValidators: true,
        })
        let mvErr
        req.files.img.mv('public' + body.img_path, err => mvErr = err)
        res.status(200).json({
        user: updated,
        err: mvErr
        })
        
    }
}
      
/**
 * return extention pending on mimetype
 * @param {string} req 
 */
function getExt(img_type) {
    switch (img_type) {
      case 'image/gif':
        return '.gif'
      case 'image/jpeg':
        return '.jpg'
      case 'image/png':
        return '.png'
        default :
        return '.null'
    }
  }