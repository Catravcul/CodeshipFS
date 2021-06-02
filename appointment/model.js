import mongoose from 'mongoose'
import validator from 'validator'

const getDefaultDateMax = () => {
  const date = new Date()
  date.setDate(date.getDate() + 40)
  return date
}

const getDefaultDateMin = () => {
  const date = new Date()
  date.setDate(date.getDate() + 10)
  return date
}

const appointmentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Please provide a message, e.g., I would like a draw with yellow and purple colors only, of a panda please.']
  },
  images: {
    type: Object
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'The email is required to know you are real.'],
    validate: [validator.isEmail, 'Please make sure the email address is complete like: give@love.com.']
  },
  deliverDateMax: {
    type: Date,
    default: getDefaultDateMax(),
    validate: [function() {
      const deliverDateMax = new Date()
      deliverDateMax.setDate(deliverDateMax.getDate() + 19)
      return this.deliverDateMax < deliverDateMax ? false : true
    }, 'Max date most be at least 20 days from now.']
  },
  deliverDateMin: {
    type: Date,
    default: getDefaultDateMin(),
    validate: [function() {
      const deliverDateMin = new Date()
      deliverDateMin.setDate(deliverDateMin.getDate() + 9)
      return this.deliverDateMin < deliverDateMin ? false : true
    }, 'Min date most be at least 10 days from now.']
  }
});
const Appointment = mongoose.model('appointment', appointmentSchema);

export default Appointment