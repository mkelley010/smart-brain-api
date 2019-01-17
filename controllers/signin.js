const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    // compare email to database email
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            // compare password in request body with database hash
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                // if password is correct respond with the user
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Incorrect credentials');
            }
        })
        .catch(err => res.status(400).json('Incorrect credentials'))
};

module.exports = {
    handleSignin: handleSignin
};