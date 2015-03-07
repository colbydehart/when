var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    mongoose = require('mongoose');

app.get('/', function(req, res){
    res.sendFile(__dirname + "/public/index.html")
});

app.use(require('./config/routes'))

app.use(bodyParser.urlEncoded({extended: true});
app.use(bodyParser.json());
app.use(expressSession({
    secret: "FullyFullOn",
    saveUninitialized: true,
    resave: false
}));

app.use(express.static('public'));

app.listen(8000, function(){ console.log("we runnin'");});

