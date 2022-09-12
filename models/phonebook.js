const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => console.log('connected to mongoDB'))
  .catch((error) => console.log('error connecting to mongoDB', error.message))

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: v => {
        if(/\d{2}-\d{7}/.test(v) || /\d{3}-\d{8}/.test(v)) {
          return true
        } else {return false}
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  date: Date,
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)
