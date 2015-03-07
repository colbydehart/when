var express = require('express'),
    app = express(),
    mongoose = require('mongoose');

app.get('/', function(req, res){
    res.sendFile(__dirname + "/public/index.html")
});

app.use(express.static('public'));

app.listen(8000, function(){ console.log("we runnin'");});

