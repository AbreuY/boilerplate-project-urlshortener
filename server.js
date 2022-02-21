require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});


var shortenedUrls = []; // To store shortened urls for this exercise I use an array,
// but we can use a sql or NoSql database for this too. 
var count = 0; // Count url shotened
var regexTestUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/; // regex to check if a url contains http | https | www
// Your first API endpoint

app.post('/api/shorturl', (req, res) => {

    if (!regexTestUrl.test(req.body.url)) { // Check if a given url contains http, https or www
        res.json({
            error: "invalid url" // Return msg if it is a invalid url
        });
    } else {
        count += 1 // Increase value for each url added
        res.json({
            original_url: req.body.url, // Get posted url and assing to key original_url
            short_url: count // Assign count to key short_url
        });
      
        shortenedUrls.push({ // Push post data to array
            original_url: req.body.url,
            short_url: count
        })
    }
});

app.get('/api/shorturl/:url_id', (req, res, next) => {
    // Create a variable to store the result from applied method find over the array
    const matchUrl = shortenedUrls.find(url => url.short_url == req.params.url_id);
    if(matchUrl == undefined){ // If not url found, then show a error msg.
      res.json({error: "Url not found"});
    }
    res.redirect(matchUrl.original_url.replace("www.", "https://")); // Redirect the user to the desired url
    next();
});
app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});