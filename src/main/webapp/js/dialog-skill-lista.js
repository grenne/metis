/* Modelos Lista */

$(document).ready(function() {
    executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);
	var url   = window.location.search.replace();
	var tipoLista = url.split("?")[1];
	$(function() {
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/lista?tipoLista=" + tipoLista,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
			success : function(data) {
				var dados = JSON.stringify(data);
				console.log ("dados:" + dados);
				$.each(data, function(i, skills) {
					var obj = JSON.stringify(skills);
					var id = skills._id;
					console.log ("item:" + obj);
					montaLinha(i, skills, id);
				});
				inicializaWindow();
				$('ul').listview('refresh');
				$('a').listview('refresh');
			}
		});
	});


});

function montaLinha(i, skills, id, nextPage) {
	var labelId = skills.label.replace( /\s/g, '' ) + "-" + i;
	var linha = 
        '<li class="ui-body">' +
	    	'<a id="item-' + labelId + '"href="#" rel="external" data-transition="flip">' +
	    	'<h2>' + skills.label + '</h2>' +
	    	'<p><strong>' + skills.tipo + '</p></a>' + 			
		'</li>';
	$("#table-skills").append(linha);
    $('#item-' + labelId).bind( "click", function(event, ui) {
    	incluiSkill (skills.label, id);
    	document.location.replace("metis.html");
    });
};