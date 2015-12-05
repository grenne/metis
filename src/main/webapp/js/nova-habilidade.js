/* Documento  */
$(document).ready(function() {   
    executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);
	var url   = window.location.search.replace();
	var parametrosUrl = url.split("?")[1];
	var idModelo = parametrosUrl.split("&")[0];
	var modelo = parametrosUrl.split("&")[1];
	var key = parametrosUrl.split("&")[2];
	var idDiagrama = parametrosUrl.split("&")[3];
	var panel = parametrosUrl.split("&")[4];
	
	var text = "";
	var color = "white"
	

	$(function(){
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter?id=" + idModelo,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            async:false,
            success: function(data) {
	            localStorage.setItem("dadosSaved", JSON.stringify(data));
        		montaCabecalho(data.documento.header, idModelo, "false", "");
        		// formata campos texto
        		$('input[type="text"]').textinput().trigger('create');
        		// formata campos select
        		$('.fieldcontain').fieldcontain().trigger('create');
				var panelLabelList = [];
				$('.titulo-habilidade').html(data.documento.modelo);
				if (data.documento.header[0].valor){
					text = data.documento.header[0].valor;
				};
				if (data.documento.header[1].valor){
					color = data.documento.header[1].valor;
				};
				$.each(data.documento.panel, function(i, panel){
					var panelId = panel.label.replace( /\s/g, '' ) + i;
					var panelLabel = panel.label;
					panelLabelList[i] = panel.label;
					inicioPanel(panelId, panelLabel, i, panel);
					$.each(panel.fields, function(z, item){
						montaCampos(i, panelId, z, item, "detalhes", idModelo, "false", "");
					});
					finalPanel(panelId, panelLabel, i, panel);
				});
			    iniciaSnapper();
			    iniciaAcoes(panelLabelList);        
				inicializaWindow();
            }
		});
	});
	
	// setar acao para botao submit
	$( ".submitButton" ).bind( "click", function(event, ui) {
		var dataSaved = localStorage.getItem("dadosSaved");
		var objJson = JSON.parse(dataSaved);
		objJson.documento.usuarioAtual = localStorage.cpfUsuario;
		objJson.documento.tipo = "dados";
		objJson.documento.situacao = "pendente";
		objJson.documento.usuarios[0].codigo = localStorage.cpfUsuario;
		console.log (dataSaved);
		console.log (JSON.stringify(objJson));
		
		$.ajax({
			type: "POST",
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/incluir",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : JSON.stringify(objJson)
		})
	  	.done(function( data ) {
		  console.log ("inclusão diagrama saiu por done");
        	})
        .fail(function(data) {
    	   console.log ("inclusão diagrama saiu por fail");
       	  })
       	.always(function(data) {
    	   atualizaNode(data.responseText, key, idDiagrama, panel, objJson.documento.header[0].valor, objJson.documento.header[1].valor);
    	   $(window.document.location).attr('href','metis.html');
          });
	});	
});

