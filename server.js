var express = require('express'),
    app = express(),
    mongoose = require('mongoose');

app.get('/', function(req, res){
    res.send("Hi");
});

app.listen(8000, function(){ console.log("we runnin'");});

