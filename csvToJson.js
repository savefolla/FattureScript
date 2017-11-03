//var csv is the CSV file with headers

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

module.exports = function csvJSON(csv){

  csv = replaceAll(csv, "\"", '');
  csv = replaceAll(csv, "\'", '');
  csv = replaceAll(csv, "\r", ' ');
  csv = replaceAll(csv, "\n", '');

  var lines=csv.split(";");

  var result = [];

  var headers=lines[0].split("|");

  for(var i=1;i<lines.length-1;i++){

	  var obj = {};
	  var currentline=lines[i].split("|");

		obj[headers[0]] = currentline[0];	
    obj[headers[1]] = currentline[1];	
    obj[headers[2]] = currentline[2];	
    
    var imp = currentline[3].split(' ');
    var iva = currentline[5].split(" ");
    var imps = [];

    for(var j=0;j<imp.length;j++){
      var ob = {};
      ob.cod = iva[j];
      ob.tot = imp[j];
      imps.push(ob);
    }
    obj[headers[3]] = imps;

    obj[headers[4]] = currentline[4];	
    obj[headers[6]] = currentline[6];
    obj[headers[7]] = currentline[7];

	  result.push(obj);

  }
  
  //return result; //JavaScript object
  return JSON.stringify(result);
}
