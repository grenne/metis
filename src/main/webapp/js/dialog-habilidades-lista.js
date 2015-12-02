/* Modelos Lista */

$(document).ready(function() {
    executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);
	var url   = window.location.search.replace();
	var parametrosUrl = url.split("?")[1];
	var id = parametrosUrl.split("&")[0];
	var modelo = parametrosUrl.split("&")[1];
	$(function() {
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/lista?modelo=" + modelo,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
			success : function(data) {
				var dados = JSON.stringify(data);
				$.each(data, function(i, habilidades) {
					var obj = JSON.stringify(habilidades);
					var id = habilidades._id;
					console.log ("item:" + obj);
					montaLinha(i, habilidades, id);
				});
				inicializaWindow();
				$('ul').listview('refresh');
			}
		});
	});


});

function montaLinha(i, habilidades, id) {
	var linha = 
        '<li class="ui-body">' +
	    	'<a id="item-' + i + '"href="#" rel="external" data-transition="flip">' +
	    	'<h2  class="ui-bar ui-bar-d ui-corner-all">'; 
	if (habilidades.documento.header != null){
		$.each(habilidades.documento.header, function(i, header) {
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
    	document.location.replace("metis.html");
    });
};