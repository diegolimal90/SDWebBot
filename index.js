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

app.post("/webhook", function(req, res){
	var data = req.body;
	
	if(data.object === 'page'){
		
		data.entry.forEach(function(entry){
			var pageID = entry.id;
			var timeOfEvent = entry.timestamp;
			
			entry.messaging.forEach(function(event){
				if(event.message){
					receivedMessage(event);
				}else{
					console.log("Webhook recebeu um evento desconhecido: ", event);
				}
			});
		});
		// Caso tudo ocorra bem.
		//
		// Você deve enviar um 200, dentro de 20 segundos, para nos informar
		// você recebeu com sucesso o retorno de chamada. Caso contrário, o pedido
		// ficará fora do prazo e continuaremos tentando reenviar.
		res.sendStatus(200);
	}
});

function receivedMessage(event){
	//exibção da mensagem recebida no log
	console.log("Dados da Mensagem: ", event.message);
	
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;
	
	console.log("Mensagem recebida do usuario %d and page %d at %d com a mensagem: ", senderID, recipientID, timeOfMessage);
	console.log(JSON.stringify(message));
	
	var messageID = message.mid;
	var messageText = message.text;
	var messageAttachments = message.atachements;
	
	if(messageText){
		sendTextMessage(senderID, "Desculpe o transtorno\r\n \r\nMas nosso inbox esta passando por um reformulação para melhor atende-lo!");
	}else if(messageAttachments){
		sendTextMessage(senderID, "Mensagem com anexo recebida");
		console.log("Anexo recebido: ", messageAttachments);
	}
}


//Mensagem com estrutura de template generic
function sendGenericMessage(recipientId,titulo,sub,url,link) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: titulo,
                        subtitle: sub,
                        image_url: url,
                        buttons: [{
                            type: "web_url",
                            url: link,
                            title: "Acessar Site"
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText){
	var messageData = {
		recipient:{
			id: recipientId
		},
		message:{
			text: messageText
		}
	};
	
	callSendAPI(messageData);
}

function callSendAPI(messageData){
	request({
		uri:'https://graph.facebook.com/v2.6/me/messages',
		qs:{access_token:'EAAJUDsfFsmUBAFJY2nLqhefmhmZBaReKHle9QJhoZAUZCONZCxlTmhbTHoZCDcNUAgkQAPxtez3wAkJXaKYrib87RZCkCkqEkQJrtZC5ap5TRI5bBTZCnfwG0cxIiTLTChTPNju5j5JzgbwhaozvM8wgXNZAoyNjcCwoKpbODi6J1s3QewESVTmsL'},
		method: 'POST',
		json: messageData
	}, function (error, response, body){
		if(!error && response.statusCode == 200){
			var recipientId = body.recipient_id;
			var messageId = body.message_id;
			
			console.log("Sucesso no envio da mensagem com o id %s para o usuario %s", messageId, recipientId);
		
		}else{
			console.error("Não é possivel enviar sua mensagem!");
			console.error(response);
			console.error(error);
		}
	}
   );
}

app.listen(process.env.PORT || 3000, function(){
	console.log("Servidor Express funcionando na porta %d no modo %s", this.address().port, app.settings.env);
});