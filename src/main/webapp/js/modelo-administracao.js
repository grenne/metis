/* Documento Detalhes */
$(document).ready(function() {   
    executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);
	var tipoDevice = mobileDetect();
	var url   = window.location.search.replace();
	var parametrosDaUrl = url.split("?")[1];
	var id = parametrosDaUrl.split("=")[1];
//	$("#teste").append(
//			
//			'<label class="control-label">Grenne</label>' + 
//			'<input id="input-1" type="file" class="file">'                
//	);
//	alert ("ready");


	$(function(){
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/vistorias/rest/documento/obter?id=" + id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(data) {
	            localStorage.setItem("dadosSaved", JSON.stringify(data));
        		montaCabecalho(data.documento.header, id, "true");
        		// formata campos texto
        		$('input[type="text"]').textinput().trigger('create');
        		// formata campos select
        		$('.fieldcontain').fieldcontain().trigger('create');
				var panelLabelList = [];
				$.each(data.documento.panel, function(i, panel){
					var panelId = panel.label.replace( /\s/g, '' ) + i;
					var panelLabel = panel.label;
					panelLabelList[i] = panel.label;
					inicioPanel(panelId, panelLabel, i, panel, id, "true");
					$.each(panel.fields, function(z, item){
						montaCampos(i, panelId, z, item, "detalhes", id, "true");
					});
					finalPanel(panelId, panelLabel, i, panel, "true");
				});
//				$("#teste").append(
//						'<label class="control-label">Grenne</label>' + 
//						'<input id="input-1" type="file" class="file">'                
//				);
//				alert ("ajax");
			    iniciaSnapper();
			    iniciaAcoes(panelLabelList);        
				inicializaWindow();
            }
		});
		
		$("#cancelarAlteracao" ).bind( "click", function(event, ui) {
	    	$( "#popupIncluiInput" ).popup( "close" );
		});	
		$("#cancelaNovoPainel" ).bind( "click", function(event, ui) {
			window.location.reload();
		});	

	});	
});

function incluirOpcoes(opcao) {

	$("#table-campos").append(
			'<fieldset id="div-opcoes' + numeroCampo +   '" class="opcoes ui-grid-c">' +
				'<label for="textinput-opcoes' + numeroCampo +  '" class="labelInputAlign ui-block-a">Opção</label>' +
				'<div class="ui-block-b">' +
					'<input type="text" name="opcoes' + numeroCampo + '" id="opcoes' + numeroCampo + '" value="' + opcao +  '" class="input-value " required  data-inline="true"/>' +
				'</div>' +
				'<a id="incluirOpcao-' + numeroCampo +   '" data-role="button" data-inline="true" data-theme="a" data-icon="plus" data-mini="true" class="line-button ui-block-c" style="float:right">Nova</a>' +
				'<a id="excluirOpcao-' + numeroCampo +   '" data-role="button" data-inline="true" data-theme="a" data-icon="delete" data-mini="true" class="line-button ui-block-d" style="float:right">Exclui</a>' +
			'</fieldset>'					
		);
	var item = numeroCampo;
	$('#excluirOpcao-' + item).bind( "click", function(event, ui) {
		$('#div-opcoes' + item).remove();
    });
	$('#incluirOpcao-' + numeroCampo).bind( "click", function(event, ui) {
		incluirOpcoes("");
    });
	
	// formata campos texto
	$('input[type="text"]').textinput().trigger('create');
	// formata campos botoes
	$('.line-button').button().trigger('create');
	
	numeroCampo++;
	
	return numeroCampo;
}

