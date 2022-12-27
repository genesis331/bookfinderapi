const express = require('express');
const libgen = require('libgen');
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   next();
});

app.get('/', (req, res) => {
    res.send('You\'re pinging bookfinderapi.');
});

app.get('/search', async (req, res) => {
    const data = await libgen.search({
        mirror: 'http://libgen.is',
        query: req.query.q,
        count: req.query.count ? req.query.count : 10,
        column: req.query.column ? req.query.column : 'title',
        page: req.query.page ? req.query.page : 1,
    })
    res.send(data);
});

app.get('/imgproxy', async (req, res) => {
    axios.get(req.query.url, {
        responseType: 'arraybuffer'
    })
    .then(response => {
        res.send(Buffer.from(response.data, 'base64'));
    })
    .catch(ex => {
        res.send(ex);
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});