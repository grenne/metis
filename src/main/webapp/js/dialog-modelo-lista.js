/* Modelos Lista */

$(document).ready(function() {
    executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);
	var url   = window.location.search.replace();
	var nextPage = url.split("?")[1];
	$(function() {
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/modelos?tipoLista=validos",
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
			success : function(data) {
				var dados = JSON.stringify(data);
				console.log ("dados:" + dados);
				$.each(data, function(i, modelos) {
					var obj = JSON.stringify(modelos);
					var id = modelos._id;
					console.log ("item:" + obj);
					montaLinha(i, modelos, id, nextPage);
				});
				inicializaWindow();
			}
		});
	});


});

function montaLinha(i, modelos, id, nextPage) {
	var linha = '' + 
				'<tr>' +
					'<td id="td-modelo-' + modelos.modelo + '">' +
						'<a  href="' + nextPage + '?id=' + id +	'" rel="external"  data-transition="flip" class="labelModelo" >' + modelos.modelo + '</a>' +
					'</td>' +
				'</tr>' +
				'<tr>' +
					'<td class="separador" />' +
				'</tr>'
	$("#table-modelos").append(linha);

};