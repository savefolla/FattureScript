var request = require("request");
var url = require('./url.js');
var api = require('./apiKey.js');
var csvToJson = require('./csvToJson.js');
var fs = require('fs');

var args = process.argv.slice(2);

var filename = args[0];

fs.readFile(filename, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  };

  var fatts = csvToJson(data);

  for(var i=0;i<fatts.length;i++){

    var postData = {};
    postData.api_uid = api.UID;
    postData.api_key = api.key;
    postData.id = fatts[i];

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
    });
  }
});
