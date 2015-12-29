/* Modelos Lista */

$(document).ready(function() {
    executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);
	var url   = window.location.search.replace();
	var nextPage = url.split("?")[1];
	$(function() {
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/modelos?tipoLista=todos",
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
					// formata campos botoes
					$('.line-button').button().trigger('create');
				});
				inicializaWindow();
				$('ul').listview('refresh');
				$('a').listview('refresh');
			}
		});
	});
	
    $('#incluirButton').bind( "click", function(event, ui) {
    	$( "#confirmaNovoModelo" ).unbind( "click");
    	$( "#confirmaNovoModelo" ).bind( "click", function(event, ui) {

    		var new_modelo = '{"documento" :' + 
    						'{' +
    						'"id": "",' +
    						'"tipo": "modelo",' +
    						'"usuarioAtual":"' + localStorage.cpfUsuario + '",' +
    						'"modelo": "' + $('#nomeModelo').val() + '",' +
    						'"situacao": "valido",' +
    						'"usuarios": [{"codigo": "' + localStorage.cpfUsuario + '"}],' +
    						'"header": [{"modelo" : "", "label" : "", "valor" : ""}],' +
    						'"panel": [{"modelo" : "swipe", "label" : "novo", "fields" : [{"modelo" : "", "label" : "", "valor" : ""}]}]' +
    						'}' +
    						'}';
    		objJson = JSON.parse(new_modelo);
    		$.ajax({
    			type: "POST",
                url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/incluir",
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data : JSON.stringify(objJson),
                success: function(data) {
                	$( "#popupIncluiModelo" ).popup( "close" );
                	setTimeout('history.go()', 300);
                	window.location.reload();
                }
    		});
    	
    	});	
    	$( "#popupIncluiModelo" ).popup( "open" );
    });
	
	// setar acao para botao submit


});

function montaLinha(i, modelos, id, nextPage) {
	var labelId = modelos.modelo.replace( /\s/g, '' ) + "-" + i;
	var linha = 
        '<li class="ui-body ui-body-b">' +
			'<fieldset class="ui-grid-b">' +
		    	'<a href="' + nextPage + '?id=' + id + '" rel="external" data-transition="flip" class="ui-block-a">' +
		    	'<h2>' + modelos.modelo + '</h2>';
	var situacao = "Disponível para uso de perfil";
	if (modelos.situacao == "inativo"){
		situacao = "Não disponivel para uso de perfil"
	};
	linha = linha +
		    	'<p>' + situacao + '</p></a>' + 			
				'<a id="alterarNomeButton-' + labelId + '-' + i + '" data-role="button" data-inline="true" data-theme="a" data-icon="gear" data-mini="true" class="ui-block-b line-button" style="float:right">Alterar Nome</a>' +
				'<a id="excluirButton-' + labelId + '-' + i + '" data-role="button" data-inline="true" data-theme="a" data-icon="delete" data-mini="true" class="ui-block-c line-button" style="float:right">Exclui</a>' +
            '</fieldset>' +
		'</li>';

	$("#table-modelos").append(linha);
    
    $('#excluirButton-' + labelId + '-' + i).bind( "click", function(event, ui) {
		var dataSaved = localStorage.getItem("dadosSaved");
		var objJson = JSON.parse(dataSaved);
		$.ajax({
			type: "POST",
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/excluir?id=" + id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : JSON.stringify(objJson)
		})
	  	.done(function( data ) {
		  console.log ("exclusão modelo saiu por done");
        	})
        .fail(function(data) {
    	   console.log ("exclusão modelo saiu por fail");
       	  })
       	.always(function(data) {
       		setTimeout('history.go()', 300);
       		window.location.reload(true);
          });
    });
    $('#alterarNomeButton-' + labelId + '-' + i).bind( "click", function(event, ui) {
    	$( "#confirmaNovoModelo" ).unbind( "click");
    	$( "#confirmaNovoModelo" ).bind( "click", function(event, ui) {
    		var objJson = JSON.parse(localStorage.getItem("dadosSaved"));
    		objJson.documento.modelo = $('#nomeModelo').val();
    		objJson.documento.situacao =  $("#select-situacao").val();
    		objJson.documento.id = id;
    		$.ajax({
    			type: "POST",
                url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/atualizar",
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data : JSON.stringify(objJson),
                success: function(data) {
                	$( "#popupIncluiModelo" ).popup( "close" );
                	setTimeout('history.go()', 300);
            		window.location.reload();
                }
    		});
    	});	
    	$( "#nomeModelo" ).val( modelos.modelo);
    	$(".selectOptions").val(modelos.situacao).prop('selected', true);		  
    	$( "#popupIncluiModelo" ).popup( "open" );
    });

};