var request = require("request");
var url = require('./url.js');
var api = require('./apiKey.js');
var csvToJson = require('./csvToJson.js');
var fs = require('fs');

var args = process.argv.slice(2);

var filename = args[0];

function getCodIva(x) {
  if(x === '22%' || x === '22%P'){
    return 0;
  }
  if(x === '10%'){
    return 3;
  }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

fs.readFile(filename, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  };

  var fatts = JSON.parse(csvToJson(data));

  for(var i=0;i<fatts.length;i++){

    var postData = {};
    postData.api_uid = api.UID;
    postData.api_key = api.key;
    postData.nome = fatts[i].Intestatario; // Nome o ragione sociale del cliente/fornitore
    postData.numero = fatts[i].N; // Numero (e serie) del documento
    postData.data = fatts[i].Data;
    postData.lista_articoli = [];
    for(var j=0;j<fatts[i].Imponibile.length;j++){
      var articolo = {};
      articolo.nome = "Articoli " + fatts[i].Imponibile[j].cod;
      articolo.quantita = 1;
      articolo.prezzo_netto = fatts[i].Imponibile[j].tot;
      articolo.cod_iva = getCodIva(fatts[i].Imponibile[j].cod);
      postData.lista_articoli.push(articolo);
    }
    postData.lista_pagamenti = [
      {
        "data_scadenza": fatts[i].Scad, // data scadenza
        "importo": fatts[i].Tot, // calcolare totale
        "metodo": "not",
      }
    ];

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
      sleep(1000);
      if(body.error_code === 2002){
        var y = body.error.split(" ");
        sleep(y[8]*1000);
        console.log("dormo " + y[8]*1000);
      }
		  var headers = res.headers;
		  var statusCode = res.statusCode;
		  console.log('headers: ', headers);
		  console.log('statusCode: ', statusCode);
		  console.log('body: ', body);
		});
  }
});
