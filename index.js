const express = require('express');
const libgen = require('libgen');
const fs = require('fs');
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

const mirror = 'http://libgen.is';
app.get('/search', async (req, res) => {
    const isbnCheck = (req.query.q).match(new RegExp('^[0-9]*$')) !== null;
    const data = await libgen.search({
        mirror: mirror,
        query: req.query.q,
        count: req.query.count ? req.query.count : 10,
        search_in: isbnCheck ? 'identifier' : 'title'
    })
    res.send(data);
});

app.get('/detail', async (req, res) => {
    const data = await libgen.search({
        mirror: mirror,
        query: req.query.q,
        count: 1,
        search_in: 'md5'
    })
    res.send(data);
});

const outputPath = "./output.jpg";
app.get('/imgproxy', async (req, res) => {
    axios.get(req.query.url, {
        responseType: 'arraybuffer'
    })
    .then(response => {
        const buffer = Buffer.from(response.data, 'base64');
        fs.writeFileSync(outputPath, buffer, { encoding: "base64" });
        res.type('image/jpeg');
        res.download(outputPath);
    })
    .catch(ex => {
        res.send(ex);
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});