const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '6edf75e0d3e3416a94a01bee9578f647'
});

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to make API call'))
};

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'));
};

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};