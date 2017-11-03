var request = require("request");
var url = require('./url.js');
var api = require('./apiKey.js');
var csvToJson = require('./csvToJson.js');
var fs = require('fs');

var args = process.argv.slice(2);

var from = args[0];
var to = args[1];

// node script.js "data da" "data a" 

var postData = {
  "api_uid": api.UID,
  "api_key": api.key,
  "anno": 2017,
  "data_inizio": from,
  "data_fine": to,
  "cliente": "",
  "fornitore": "",
  "id_cliente": "",
  "id_fornitore": "",
  "saldato": "",
  "oggetto": "",
  "ogni_ddt": "",
  "PA": false,
  "PA_tipo_cliente": "",
  "pagina": 1
}

var options = {
  method: 'post',
  body: postData,
  json: true,
  url: url.fattureLista
};

request(options, function(err, res, body) {
    
  
  var fatts = body.lista_documenti;

  var handle = function(fatts, i) {
    if(i>=fatts.length){
      console.log("Ho finito con successo");
      return;
    }
    var postData = {};
    postData.api_uid = api.UID;
    postData.api_key = api.key;
    postData.id = fatts[i].id;

    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: url.fatture
    };

    request(options, function (err, res, body) {
      if (err) {
        console.error('error posting json: ', err)
        throw err;
      }
      var headers = res.headers;
      var statusCode = res.statusCode;
      console.log('headers: ', headers);
      console.log('statusCode: ', statusCode);
      console.log('body: ', body);
      setTimeout(function() {
        handle(fatts,i+1);
      }, 2000);
    });
  }
  handle(fatts,0);
});