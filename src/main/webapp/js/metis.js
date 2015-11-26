/* Documento Detalhes */
$(document).ready(function() {
    executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);

    // acertar o tamanha da tela
	console.log ("$(window).height:()" + $(window).height());
	console.log ("$(document).height():" + $(document).height()); 
	console.log ("$(window).width():" + $(window).width());
	console.log ("$(document).width():" + $(document).width());
	var tipoDevice = mobileDetect();
	alert('You are using a mobile device!:' + tipoDevice);
	var url   = window.location.search.replace();
	
	$(function(){
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/skills?usuario=" + localStorage.cpfUsuario,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(data) {
	            localStorage.setItem("skills", JSON.stringify(data));
        		montaCabecalho(data.documento.header, id, "false", "disabled");
				var heightCabecalho = $("#cabecalho-detalhes").height();
				var panelLabelList = [];
				$.each(data.usuario.skills, function(i, panel){
					var panelId = panel.skills.replace( /\s/g, '' ) + i;
					var panelLabel = panel.label;
					panelLabelList[i] = panel.label;
					montaPanel(panelId, panelLabel, i, panel);
				});
			    iniciaSnapper();
			    iniciaAcoes(panelLabelList);        
				inicializaWindow();
				$('a').listview('refresh');
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
            url: "http://" + localStorage.urlServidor + ":8080/vistorias/rest/documento/atualizar",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : JSON.stringify(objJson),
            success: function(data) {
            	console.log ("terminou atualização id:" + id + " data:" + data);
            }
		});
		$(window.document.location).attr('href','vistorias-lista.html');
	});	
});
