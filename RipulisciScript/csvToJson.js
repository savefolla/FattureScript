//var csv is the CSV file with headers


module.exports = function csvJSON(csv){

  csv = JSON.parse(csv);

  var lista = [];
  for(var i=0;i<csv.lista_documenti.length;i++){
    lista.push(csv.lista_documenti[i].id);
  }
  return lista;
}