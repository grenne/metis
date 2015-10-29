/* Modelos Lista */

$(document).ready(function() {
	var url   = window.location.search.replace();
	var parametrosDaUrl = url.split("?")[1];
	var nextPage = parametrosDaUrl.split("=")[1];
	$(function() {
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/vistorias/rest/documento/modelos",
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
			success : function(data) {
				var dados = JSON.stringify(data);
				console.log ("dados:" + dados);
				$.each(data, function(i, modelos) {
					var obj = JSON.stringify(modelos);
					var id = modelos._id;
					console.log ("item:" + obj);
					montaLinha(i, modelos, id);
					var separador = '' + '<hr class="separador" />';
					$("#listaModelos").append(separador);
				});
				inicializaWindow();
			}
		});
	});
});

function montaLinha(i, modelos, id) {
	var linha = '' + '<div data-id="' 
			+ id 
			+ '">'
			+ '<a  href="' + nextPage + '?id=' 
			+ id
			+ '" rel="external" data-transition="flip" class="labelModelo">'
			+ modelos.modelo 
			+ '</a>'
			+ '</div>';
	$("#listaModelos").append(linha);
};