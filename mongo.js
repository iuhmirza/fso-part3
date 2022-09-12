const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('Please provide the password as an argument:\n node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://iuhmirza:${password}@cluster0.vntefe9.mongodb.net/phonebook?retryWrites=true&w=majority`

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if(process.argv.length === 3) {
  mongoose
    .connect(url)
  Phonebook.find({}).then(result => {
    result.forEach(phonebook => console.log(phonebook))
  })
  mongoose.connection.close()
} else {
  mongoose
    .connect(url)
    .then(() => {
      console.log('connection successful')

      const phonebook = new Phonebook({
        name: process.argv[3],
        number: process.argv[4]
      })

      return phonebook.save()
    })
    .then((phonebook) => {
      console.log(`added ${phonebook.name} number ${phonebook.number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}