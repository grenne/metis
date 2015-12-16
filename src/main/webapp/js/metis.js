/* Documento Detalhes */
$(document).ready(function() {
	executaLogin(localStorage.urlServidor, localStorage.cpfUsuario, localStorage.senha);

    // acertar o tamanha da tela
	console.log ("$(window).height:()" + $(window).height());
	console.log ("$(document).height():" + $(document).height()); 
	console.log ("$(window).width():" + $(window).width());
	console.log ("$(document).width():" + $(document).width());
	var tipoDevice = mobileDetect();
	console.log('You are using a mobile device!:' + tipoDevice);
	var url   = window.location.search.replace();
	
	
	$(function(){
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/skill/obter?usuario=" + localStorage.cpfUsuario,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(data) {
	            localStorage.setItem("skills", JSON.stringify(data));
				var heightCabecalho = $("#cabecalho-detalhes").height();
				var panelLabelList = [];
				myDiagram = [];
				$.each(data.skill.skills, function(i, panel){
					var panelId = panel.tipo.replace( /\s/g, '' ) + i;
					var panelLabel = panel.label;
					var id = panel.id;
					panelLabelList[i] = panel.label;
					montaPanel(panelId, panelLabel, i, panel, id);
				});
			    iniciaSnapper();
			    iniciaAcoes(panelLabelList);        
				inicializaWindow();
				$.each(data.skill.skills, function(i, panel){
					var panelId = panel.tipo.replace( /\s/g, '' ) + i;
					var panelLabel = panel.label;
					var id = panel.id;
					panelLabelList[i] = panel.label;
					init("myDiagram-" + panelId, i, id )
				});
	        	var panel = localStorage.getItem("panel");
	        	var i = 0;
	        	while (i < panel) {
	        		window.mySwipe.next();
	        	    i++;
	        	};      	
            }
		});
	});

	$( "#confirmaNovoPainel" ).bind( "click", function(event, ui) {
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter/modelo?modelo=" + $("#select-tipos-painel" ).val(),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            async:false
		})
		.done(function( data ) {
			console.log ("inclusão diagrama saiu por done");
		})
		.fail(function(data) {
			console.log ("inclusão diagrama saiu por fail");
		})
		.always(function(data) {
            localStorage.setItem("dadosSaved", JSON.stringify(data));
    		var dataSaved = localStorage.getItem("dadosSaved");
    		var objJson = JSON.parse(dataSaved);
    		objJson.documento.usuarioAtual = localStorage.cpfUsuario;
    		objJson.documento.tipo = "dados";
    		objJson.documento.header[0].valor = $("#nomePainel" ).val();
    		objJson.documento.situacao = "ativo";
    		objJson.documento.usuarios[0].codigo = localStorage.cpfUsuario;
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
       			var idDocumento = data.responseText;
           		var new_diagrama = 
					'{"documento" :' + 
						'{' +
							'"id":"",' +
							'"tipo":"' + $("#select-tipos-painel").val() + '",' +
							'"label":"' + $("#nomePainel" ).val() + '",' +
							'"diagrama":' +
							'{' +
								'"nodeDataArray":[{"loc":"50 50","key":"1","text":"' + $("#nomePainel" ).val() + '","color":"' + objJson.documento.header[1].valor + '","id":"' + idDocumento + '", "principal": "true" }]' +
							'}' +
							'}' +
					'}';
				objJson = JSON.parse(new_diagrama);
				$.ajax({
					type: "POST",
		            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/incluir",
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
					incluiSkill ($("#nomePainel" ).val(), data.responseText);
					$("#popupIncluiPainel").popup( "close" );
					setTimeout('history.go()',200);
					window.location.reload(true);
				});
           	});
		});
	});
	$("#cancelaNovoPainel").bind( "click", function(event, ui) {
    	$("#popupIncluiPainel").popup( "close" );
	});
	$("#volta-documento").bind( "click", function(event, ui) {
    	$("#popupDetalhes").popup( "close" );
	});
	$("#volta-inlcui-painel").bind( "click", function(event, ui) {
    	$("#popupIncluiPainel").popup( "close" );
	});
	$("#volta-carreira").bind( "click", function(event, ui) {
    	$("#nodePropertiesCarreira").popup( "close" );
	});
	$("#volta-modelos").bind( "click", function(event, ui) {
		localStorage.setItem("dialogOpen", "false");
    	$("#nodeNewObject").popup( "close" );
    	setTimeout('history.go()',200);
		window.location.reload(true);
	});
	$("#nodeNewObject" ).bind({
		popupafterclose: function(event, ui) {
			window.location.reload(true);
		}
	});
});
