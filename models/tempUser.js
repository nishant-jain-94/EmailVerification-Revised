var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  isConfirmed: Boolean,
  VERIFICATION_URL: String
});

module.exports = mongoose.model('tempUser',UserSchema,'tempUsers');
