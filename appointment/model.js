import mongoose from 'mongoose'
import validator from 'validator'
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
  date: {
    type: Date,
    default: getDefaultDate()
  }
});
const getDefaultDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date
}
const Appointment = mongoose.model('appointment', appointmentSchema);

export default Appointment