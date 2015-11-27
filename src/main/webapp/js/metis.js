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
            }
		});
	});

	$( "#confirmaNovoPainel" ).bind( "click", function(event, ui) {

		var new_diagrama = 
			'{"documento" :' + 
				'{' +
					'"id":"",' +
					'"tipo":"' + $("#select-tipos-painel").val() + '",' +
					'"diagrama":' +
					'{' +
						'"nodeDataArray":[{"loc":"50 50","key":"1","text":"' + $("#nomePainel" ).val() + '","color":"lightblue","id":"121212"}]' +
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
	        	   window.location.reload(true);
	              });
	});
		
	function incluiSkill(nomeSkill, idDiagrama){
		var objJson = JSON.parse(localStorage.getItem("skills"));
		console.log ("skill - " + JSON.stringify(objJson));
		var new_skill = {'tipo' : 'pessoal', 'label' : nomeSkill,'id' : idDiagrama};
		objJson.skill.skills.push(new_skill);	
		$.ajax({
			type: "POST",
	        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/skill/atualizar",
	        contentType: "application/json; charset=utf-8",
	        dataType: 'json',
	        data : JSON.stringify(objJson),
		})
		 .done(function( data ) {
          	console.log ("inclusão skill saiu por done");
		  })
         .fail(function(data) {
      	   console.log ("inclusão skill saiu por fail");
         })
         .always(function(data) {
       	   console.log ("inclusão skill saiu por always");
         });
	};	

});
