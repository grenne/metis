/* Modelos Lista */

$(document).ready(function() {
    executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);
    var url   = window.location.search.replace();
	var parametrosUrl = url.split("?")[1];
	var tipoLista = parametrosUrl.split("&")[0];    
	var tipoAcao = parametrosUrl.split("&")[1];
	var idDiagramaOriginal = parametrosUrl.split("&")[2];
	var panel = parametrosUrl.split("&")[3];
	var key = parametrosUrl.split("&")[4];
	$(function() {
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/lista?tipoLista=" + tipoLista,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
			success : function(data) {
				var dados = JSON.stringify(data);
				$.each(data, function(i, skills) {
					var obj = JSON.stringify(skills);
					var id = skills._id;
					montaLinha(i, skills, id, idDiagramaOriginal, panel, tipoAcao, key);
				});
				inicializaWindow();
				$('ul').listview('refresh');
			}
		});
	});
	$("#volta-skills").bind( "click", function(event, ui) {
    	document.location.replace("metis.html");
    });



});

function montaLinha(i, skills, id, idDiagramaOriginal, panel, tipoAcao, key) {
	var labelId = skills.label.replace( /\s/g, '' ) + "-" + i;
	var linha = 
        '<li class="ui-body">' +
	    	'<a id="item-' + i + '" href="#" rel="external" data-transition="flip">' +
	    	'<h2  class="ui-bar ui-bar-d ui-corner-all">'; 
	if (skills.documento.header != null){
		$.each(skills.documento.header, function(i, header) {
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
	if (skills.documento.panel != null){
		$.each(skills.documento.panel, function(i, panel) {
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
	$("#table-skills").append(linha);
    $('#item-' + i).bind( "click", function(event, ui) {
    	if (tipoAcao == "group") {
    		incluiGroup (skills.label, id, idDiagramaOriginal, panel, key);
    	}else{
    		incluiSkill (skills.label, id);
    	};
    	document.location.replace("metis.html");
    });
};