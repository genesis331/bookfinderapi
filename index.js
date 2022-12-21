const express = require('express');
const libgen = require('libgen');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('You\'re pinging bookfinderapi.');
});

app.get('/search', async (req, res) => {
    const data = await libgen.search({
        mirror: 'http://libgen.is',
        query: req.query.q,
    })
    res.send(data);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});