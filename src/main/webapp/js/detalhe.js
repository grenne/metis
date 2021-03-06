/* Documento Detalhes */
$(function() {
    executaLogin(localStorage.urlServidor, localStorage.usuario, localStorage.senha);

    // acertar o tamanha da tela
	console.log ("$(window).height:()" + $(window).height());
	console.log ("$(document).height():" + $(document).height()); 
	console.log ("$(window).width():" + $(window).width());
	console.log ("$(document).width():" + $(document).width());
	var deviceMobile = mobileDetect();
	console.log('You are using a mobile device!:' + deviceMobile);
	var url   = window.location.search.replace();
	var parametrosDaUrl = url.split("?")[1];
	var id = localStorage.getItem("idDocumento");
	var tipoPagina = "manutencao";
	var urlBack = "index.html" 
	var inputDisabled = ""; 
	if (tipoPagina =="consulta"){
		inputDisabled = "disabled";;
	};

	var id = localStorage.getItem("idDocumento");

	// setar barra superior para voltar para pagina correta 
	montaBarHeader(urlBack);	
	
	$(function(){
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter?id=" + id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(data) {
	            localStorage.setItem("dadosSaved", JSON.stringify(data));
        		montaCabecalho(data.documento.header, id, "false", "disabled");
				var heightCabecalho = $("#cabecalho-detalhes").height();
				var panelLabelList = [];
				$.each(data.documento.panel, function(i, panel){
					var panelId = panel.label.replace( /\s/g, '' ) + i;
					var panelLabel = panel.label;
					panelLabelList[i] = panel.label;
					inicioPanel(panelId, panelLabel, i, panel);
					$.each(panel.fields, function(z, item){
						montaCampos(i, panelId, z, item, "detalhes", id, "false", inputDisabled);
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
		objJson.documento.id = id;
		objJson.documento.situacao = "realizadas";
		console.log (dataSaved);
		console.log (JSON.stringify(objJson));
		$.ajax({
			type: "POST",
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/atualizar",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : JSON.stringify(objJson),
            success: function(data) {
            	console.log ("terminou atualização id:" + id + " data:" + data);
            }
		});
		$(window.document.location).attr('href','metis.html');
	});	
});
