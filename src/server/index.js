var path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');

require('./models/User');
require('./services/passport');

// const mockAPIResponse = require('./mockAPI.js')

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
});

const app = express();

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

app.use(express.static('dist'));

console.log(__dirname);

const PORT = process.env.PORT || 5000;

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

// designates what port the app will listen to for incoming requests
app.listen(PORT);

app.get('/test', function (req, res) {
    // res.send(mockAPIResponse)
})