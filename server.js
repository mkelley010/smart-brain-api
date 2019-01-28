const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host : 'postgresql-round-21898',
        user : 'postgres',
        password : '',
        database : 'smartbrain'
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
   res.send('testing');
});

// authenticate an existing user
app.post('/signin', (req, res) => {
    signin.handleSignin(req, res, db, bcrypt);
});

// register a new user
app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt);
});

// get a user profile by their id
app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, db);
});

// add to user rank
app.put('/image', (req, res) => {
    image.handleImage(req, res, db);
});

// api call for face url
app.post('/imageurl', (req, res) => {
    image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});