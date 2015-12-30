/* Modelos Lista */

$(document).ready(function() {
    executaLogin(localStorage.urlServidor, localStorage.usuario, localStorage.senha);
	var url   = window.location.search.replace();
	var parametrosUrl = url.split("?")[1];
	var idModelo = parametrosUrl.split("&")[0];
	var modelo = parametrosUrl.split("&")[1];
	var key = parametrosUrl.split("&")[2];
	var idDiagrama = parametrosUrl.split("&")[3];
	var panel = parametrosUrl.split("&")[4];
	var linha = 
		'<a id="nova_habilidade-' + idModelo + '" href="nova-habilidade.html?' + idModelo + '&' + modelo + '&' + key + '&' + idDiagrama + '&' + panel + '" rel="external" data-transition="flip">Nova Habilidade</a>';
	$("#div-incluirHabilidaddeButton").append(linha);

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
					montaLinha(i, habilidades, idDocumento, key, idDiagrama, panel);
				});
				inicializaWindow();
				$('ul').listview('refresh');
			}
		});
	});
	$("#volta-habilidades").bind( "click", function(event, ui) {
    	document.location.replace("metis.html");
    });
});

function montaLinha(i, habilidades, idDocumento, key, idDiagrama, panel) {
	var text = "";
	var color = "white";
	var linha = 
        '<li class="ui-body">' +
	    	'<a id="item-' + i + '" href="#" rel="external" data-transition="flip">' +
	    	'<h2  class="ui-bar ui-bar-d ui-corner-all">'; 
	if (habilidades.documento.header != null){
		$.each(habilidades.documento.header, function(i, header) {
			if (i == 0){
				text = header.valor;
			}else{
				if (i == 1){
					color = header.valor;					
				};
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
    	if (habilidades.documento.modelo == "Badget"){
    		atualizaGroup(idDocumento, key, idDiagrama, panel, text, color);
    	}else{ 
    		atualizaNode(idDocumento, key, idDiagrama, panel, text, color);
    	};
    	document.location.replace("metis.html");
    });
};
