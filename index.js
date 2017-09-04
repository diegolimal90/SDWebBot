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
	
	response.send("tudo funcionando uai!");
	console.log("tudo funcionando eita que eu to ficando bom hahahaha");
});

app.get("/webhook", function(req, res){
	if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'sdwebbot1290'){
		console.log("Webhook validado com sucesso!");
		res.status(200).send(req.query['hub.challenge']);		
	}else{
		console.log("Falha na validação do webhook.");
		res.sendStatus(403);
	}
});




app.listen(process.env.PORT || 3000, function(){
	console.log("Servidor Express funcionando na porta %d no modo %s", this.address().port, app.settings.env);
});