const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  symptoms: String,
  location: String
});

module.exports = mongoose.model('Patient', patientSchema);