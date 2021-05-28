import Appointment from './model.js'


const getImages = (buffers, converter = getBase64) => {
    if (!buffers) return []
    if (buffers.lenth) 
        return buffers.slice(0, 5).map(buffer => converter(buffer))
    return [converter(buffers)]
}
const getBase64 = (buffer) => {
    return 'data:' + buffer.mimetype + ';base64,' + buffer.data.toString('base64')
}
export const insert = (req, res) => {
    const fail = (error) => {
        res.json({
            message: 'Sorry, something went wrong. try it again or contact directly by the social network, phone or email.',
            details: error.message
        })
    }
    const success = (images) => {
        res.status(201).json({
            message: "Appointment created succesfully!. you'll be getting news soon!",
            images
        })
    }
    try {
        let images = req.files ? getImages(req.files.images) : []
        const appointment = new Appointment({...req.body, images})
        appointment.save(function (error) {
            if (error) return fail(error)
            return success(images)
        })
    } catch (error) {
        fail(error)
    }
}