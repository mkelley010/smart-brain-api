const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
};

app.get('/', (req, res) => {
   res.send(database.users);
});

// authenticate an existing user
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
});

// register a new user
app.post('/register', (req, res) => {
    const { email, name } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    });
    // respond with the last user (i.e. the new one) in the array
    res.json(database.users[database.users.length - 1]);
});

// get a user profile by their id
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
       if (user.id === id) {
           found = true;
           return res.json(user);
       }
    });
    if (!found) {
        res.status(400).json('no such user');
    }
});

// add to user rank
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.status(400).json('no such user');
    }
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});

/*
/ --> res == this is working
/signin --> POST (because we're verifying user authentication), res == success/fail
/register --> POST (because we're adding users), res == new user
/profile/:userId --> GET (just wanna get the user info), res == user
/image --> PUT, res == updated user (their rank?)

 */