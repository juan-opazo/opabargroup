const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    givenName: String,
    familyName: String,
    email: String
});

mongoose.model('users', userSchema);