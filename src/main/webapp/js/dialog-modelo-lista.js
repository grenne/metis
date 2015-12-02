/* Modelos Lista */


function montaLinhaModelos(i, modelos, id) {
	var linha = '' + 
				'<li class="ui-body linha-modelo">' +
					'<a id="item-' + i + '"href="dialog-habilidades-lista.html?' + id + '&' + modelos.modelo + '" rel="external" data-transition="flip">' +
					'<h2>' + modelos.modelo + '</h2>' +
					'</a></li>';
					
	$("#tabela-modelos").append(linha);
};