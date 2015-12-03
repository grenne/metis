/* Modelos Lista */

$(document).ready(function() {
    executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);
	var url   = window.location.search.replace();
	var parametrosUrl = url.split("?")[1];
	var idModelo = parametrosUrl.split("&")[0];
	var modelo = parametrosUrl.split("&")[1];
	var key = parametrosUrl.split("&")[2];
	var idDiagrama = parametrosUrl.split("&")[2];
	var diagrama = parametrosUrl.split("&")[2];
	$(function() {
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/lista?modelo=" + modelo,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
			success : function(data) {
				var dados = JSON.stringify(data);
				$.each(data, function(i, habilidades) {
					var obj = JSON.stringify(habilidades);
					var idDocumento = habilidades._id;
					montaLinha(i, habilidades, idDocumento, key, idDiagrama, diagrama);
				});
				inicializaWindow();
				$('ul').listview('refresh');
			}
		});
	});


});

function montaLinha(i, habilidades, idDocumento, key, idDiagrama, diagrama) {
	var text = "";
	var linha = 
        '<li class="ui-body">' +
	    	'<a id="item-' + i + '" href="#" rel="external" data-transition="flip">' +
	    	'<h2  class="ui-bar ui-bar-d ui-corner-all">'; 
	if (habilidades.documento.header != null){
		$.each(habilidades.documento.header, function(i, header) {
			if (i = 0){
				text = header.label;
			};
			linha = linha +
					'<p>' + header.label + ' : ' + header.valor + '</p>'
		});
	};
	linha = linha +	
					'</h2>';
					'<div class="ui-body">';
	if (habilidades.documento.panel != null){
		$.each(habilidades.documento.panel, function(i, panel) {
			if (panel.fields != null){
				$.each(panel.fields, function(i, fields) {
					linha = linha +
							'<p>' + fields.label + ' : ' + fields.valor + '</p>'
				});	
			};
		});	
	};
	linha = linha +	
					'</div>' +
					'</a>' +
					'</li>';
	$("#table-habilidades").append(linha);
    $('#item-' + i).bind( "click", function(event, ui) {
    	var objJson = JSON.parse(diagrama);
		$.each(objJson.nodeDataArray, function(i, node) {
			if (node.key == key){
				node.id = idDocumento;
				node.text = text;
			};
		});	    	
		$.ajax({
			type: "POST",
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/atualizar",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : JSON.stringify(objJson),
            success: function(data) {
            	console.log ("terminou atualização diagrama id:" + idDocumento + " data:" + data);
            }
		});
    	document.location.replace("metis.html");
    });
};