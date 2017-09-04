'use strict';

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get("/", function(request, response){
	
	res.send("tudo funcionando uai!");
	console.log("tudo funcionando eita que eu to ficando bom hahahaha");
});


app.listen(process.env.PORT || 3000, function(){
	console.log("Servidor Express funcionando na porta %d no modo %s", this.address().port, app.settings.env);
});