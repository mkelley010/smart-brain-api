const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : '',
        database : 'smartbrain'
    }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
   res.send(database.users);
});

// authenticate an existing user
app.post('/signin', (req, res) => {
    // compare email to database email
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            // compare password in request body with database hash
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                // if password is correct respond with the user
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Incorrect credentials');
            }
        })
        .catch(err => res.status(400).json('Incorrect credentials'))
});

// register a new user
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    // insert login data into login table and insert user into user table - all as a transaction
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            // commit above changes to db, rollback if error
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('Unable to register'));
});

// get a user profile by their id
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    // find the user by id from the database and respond with the user
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not found');
            }
        })
        .catch(err => res.status(400).json('Error getting user'));
});

// add to user rank
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'));
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});