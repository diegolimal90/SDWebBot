var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get("/", function(req, res){
	
	res.send("tudo funcionando uai!");
	console.log("tudo funcionando eita que eu to ficando bom hahahaha");
});