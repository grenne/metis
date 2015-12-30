/* Documento Detalhes */
$(document).ready(function() {
	executaLogin(localStorage.urlServidor, localStorage.usuario, localStorage.senha);

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
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/skill/obter?usuario=" + localStorage.usuario,
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
		})
	  	.done(function( data ) {
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
				if (i != 0 ){
					montaComparacao(panelId, panelLabel, i, panel, id, panelLabelList);
				};
				init("myDiagram-" + panelId, i, id )
			});
			$('ul').listview('refresh');
        	var panel = localStorage.getItem("panel");
        	var i = 0;
        	while (i < panel) {
        		window.mySwipe.next();
        	    i++;
        	};      	
	  	})
        .fail(function(data) {
			console.info("ler skil saiu por fail");
        })
       	.always(function(data) {

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
    		objJson.documento.usuarioAtual = localStorage.usuario;
    		objJson.documento.tipo = "dados";
    		objJson.documento.header[0].valor = $("#nomePainel" ).val();
    		objJson.documento.situacao = "ativo";
    		objJson.documento.usuarios[0].codigo = localStorage.usuario;
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
							'"idDocPrincipal":"' + idDocumento + '",' +
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
	function montaComparacao(panelId, panelLabel, i, panel, id, panelLabelList) {
		var linha = '' + 
					'<li class="ui-body linha-compara">';
		
		linha = linha +
				'<a id="itemCompara-' + i + '" data-transition="flip" data-close-btn-text="Cancel">';
		linha = linha +
				'<h2>' + panelLabel + '</h2>' +
				'</li>';
		$("#tabela-compara").append(linha);
		$( "#itemCompara-" + i ).bind( "click", function(event, ui) {
			var objJsonComparar = JSON.parse(localStorage.getItem("diagrama-" + i));
			var objJsonOriginal = JSON.parse(localStorage.getItem("diagrama-0"));
			$.each(objJsonOriginal.documento.diagrama.nodeDataArray, function(w, nodeOriginal){
				$.each(objJsonComparar.documento.diagrama.nodeDataArray, function(j, nodeComparar){
					objJsonComparar.documento.diagrama.nodeDataArray[j].color = "aqua";
					if (nodeOriginal.id == nodeComparar.id) {
						objJsonComparar.documento.diagrama.nodeDataArray[j].color = "azure";		
					};
				});
			});
			var n = $( ".swipe .dragme" ).length; 
//			var panelId = objJsonOriginal.documento.tipo.replace( /\s/g, '' ) + "-" + objJsonComparar.documento.tipo.replace( /\s/g, '' ) + n;
//			var panelLabel = objJsonComparar.documento.label + " x " + objJsonOriginal.documento.label;
//			panelLabelList[n] = objJsonComparar.documento.label + " x " + objJsonOriginal.documento.label;
//			montaPanel(panelId, panelLabel, n, panel, id);
//		    iniciaSnapper();
//		    iniciaAcoes(panelLabelList);        
//			init("myDiagram-" + panelId, n, id, objJsonComparar);
			$.ajax({
				type: "POST",
	            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/incluir",
	            contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : JSON.stringify(objJsonComparar)
			})
			.done(function( data ) {
				console.log ("inclusão diagrama saiu por done");
			})
			.fail(function(data) {
				console.log ("inclusão diagrama saiu por fail");
			})
			.always(function(data) {
				incluiSkill (objJsonComparar.documento.label + " x " + objJsonOriginal.documento.label, data.responseText);
				$("#popupSkillsCompara").popup( "close" );
				localStorage.setItem("panel", n);
				setTimeout('history.go()',200);
				window.location.reload(true);
			});
			
		});
	};
