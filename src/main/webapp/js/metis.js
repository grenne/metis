/* Documento Detalhes */
$(document).ready(function() {
	localStorage.urlServidor = window.location.hostname;
	executaLogin(localStorage.urlServidor, localStorage.usuario, localStorage.senha);

    // acertar o tamanha da tela
	console.log ("$(window).height:()" + $(window).height());
	console.log ("$(document).height():" + $(document).height()); 
	console.log ("$(window).width():" + $(window).width());
	console.log ("$(document).width():" + $(document).width());
	var deviceMobile = mobileDetect();
	console.log('You are using a mobile device!:' + deviceMobile);
	if (deviceMobile){
		localStorage.urlServidor = "52.27.128.28";
	};
	
	//
	// ** monta paineis iniciais
	//
	skillInicial("YggMap");

	//
	//  ** inicializa campos da tela
	//
	$("#btn-nav-right").bind( "click", function(event, ui) {
		window.mySwipe.next();
	});
	$("#btn-nav-left").bind( "click", function(event, ui) {
		window.mySwipe.prev();
	});
	$("#telaInicial").bind( "click", function(event, ui) {
		skillInicial("YggMap");
	});
	$("#listaCarreiras").bind( "click", function(event, ui) {
		montaListasSkill("Carreira");
		localStorage.modelo = "Carreira";
	});
	$("#listaBadges").bind( "click", function(event, ui) {
		montaListasSkill("Badges");
		localStorage.modelo = "Badges";
	});
	$("#listaCursos").bind( "click", function(event, ui) {
		montaListasSkill("Cursos");
		localStorage.modelo = "Cursos";
	});
	$("#listaPessoal").bind( "click", function(event, ui) {
		montaListasSkill("Pessoal");
		localStorage.modelo = "Pessoal";
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
	$("#fecha-listaSkills").bind( "click", function(event, ui) {
    	$("#popupSkills").popup( "close" );
	});
	$("#inclui-skills").bind( "click", function(event, ui) {
		incluiDiagrama(localStorage.modelo, "novo", "sem informacao");
	});
	$("#volta-modelos").bind( "click", function(event, ui) {
		localStorage.setItem("dialogOpen", "false");
    	$("#nodeNewObject").popup( "close" );
    	skillInicial("YggMap");
	});
	$("#btn-exclui-painel").bind( "click", function(event, ui) {
		excluiSkill(localStorage.getItem("panel"));
		setTimeout('skillInicial("YggMap");',20);
	});
	$("#nodeNewObject" ).bind({
		popupafterclose: function(event, ui) {
			skillInicial("YggMap");
		}
	});
});

function skillInicial(skillInicial) {
		
	$(".paineis").remove();
	localStorage.paineis = 0;
	localStorage.comparacao = "false";
	localStorage.corComparacao = "";
	
	$(function(){
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/skill/obter?usuario=" + skillInicial,
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
		})
	  	.done(function( data ) {
            localStorage.setItem("skills", JSON.stringify(data));
			var heightCabecalho = $("#cabecalho-detalhes").height();
			var panelLabelList = [];
			myDiagram = [];
			$.each(data.skill.skills, function(i, panel){
				localStorage.paineis = parseInt(localStorage.paineis) + 1; 
				var panelId = panel.tipo.replace( /\s/g, '' ) + i;
				var panelLabel = panel.label;
				var id = panel.id;
				panelLabelList[i] = panel.label;
				montaPanel(panelId, panel.label);
			});			
			if (localStorage.paineis == "1"){
				$("#bar-footer").hide();
			}else{
				$("#bar-footer").show();
			}
			$("#btn-exclui-painel").hide();
		    iniciaSnapper();
		    iniciaAcoes(panelLabelList);        
			inicializaWindow();
			$.each(data.skill.skills, function(i, panel){
				var panelId = panel.tipo.replace( /\s/g, '' ) + i;

				var panelLabel = panel.label;
				var id = panel.id;
				if (i != 0 ){
					if (panelLabel.search(" x ") < 0) {
						montaComparacao(panelId, panelLabel, i, panel, id, panelLabelList);
					};
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
	
}
	
function montaListasSkill(tipoLista) {
	$(function() {
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/lista?tipoLista=" + tipoLista,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
			success : function(data) {
				var dados = JSON.stringify(data);
				$('.linhasSkill').remove();
				$.each(data, function(i, skills) {
					var obj = JSON.stringify(skills);
					var id = skills._id;
					var idDocumento = skills.documento.id;
					montaLinhaSkill(i, skills, id, idDocumento);
				});
				inicializaWindow();
				$('ul').listview('refresh');
				$("#popupSkills").popup( "open" );
			}
		});
	});
};

function montaLinhaSkill(i, skills, id, idDocumento) {
	var labelId = skills.label.replace( /\s/g, '' ) + "-" + i;
	var linha = 
        '<li class="ui-body linhasSkill">' +
	    	'<a id="item-' + i + '"  data-transition="flip">' +
	    		'<h2  class="ui-bar ui-bar-d ui-corner-all">'; 
	if (skills.documento.header != null){
		$.each(skills.documento.header, function(i, header) {
			if (i == 0){
				text = header.valor;
			}else{
				if (i == 1){
					color = header.valor;					
				};
			};
			if (header.label != "Cor"){
				linha = linha +
				'<p>' + header.valor + '</p>'
			};
		});
	};
	linha = linha +	
				'</h2>' +
			'</a>' +
			'<a id="item-descricao' + i + '"  data-rel="popup" data-position-to="window" data-transition="pop">Descrição</a>' +
		'</li>';	
	$("#tabela-listaSkills").append(linha);
	
	$("#item-" + i).bind( "click", function(event, ui) {
		$("#skill-yggmap0").remove();
		montaPanel("yggmap0", "YggMap");
		montaComparacao(id);
	});
	$("#item-descricao" + i).bind( "click", function(event, ui) {
		telaDescricao(idDocumento);
	});
};

function montaComparacao(id) {

	var objJsonOriginal = JSON.parse(localStorage.getItem("diagrama-0"));
	jQuery.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/obter?id=" + id,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
        success: function(data) {
        	if (localStorage.corComparacao == ""){
        		localStorage.corComparacao = "coral"
        	}else{
        		if (localStorage.corComparacao == "coral"){
        			localStorage.corComparacao = "green"	
        		}else{
        			localStorage.corComparacao = "yellow"
        		};
        	};
        	var objJsonComparar = data.documento.diagrama.nodeDataArray
        	$.each(objJsonComparar, function(j, nodeComparar){
        		$.each(objJsonOriginal.documento.diagrama.nodeDataArray, function(w, nodeOriginal){
        			if (nodeOriginal.id == nodeComparar.id) {
        				objJsonOriginal.documento.diagrama.nodeDataArray[w].color = localStorage.corComparacao;		
        			};
        		});
        	});		
        	localStorage.setItem("diagrama-0", JSON.stringify(objJsonOriginal));
        	localStorage.setItem("diagrama-1", JSON.stringify(data));
    		init("myDiagram-yggmap0", 0, 0, JSON.parse(localStorage.getItem("diagrama-0")) );
    		localStorage.comparacao = "true";
    		localStorage.labelComparacao = data.documento.label;
    		$('.titulo-pagina').html("YggMap (comparação com " + data.documento.label + ")");
    		$("#popupSkills").popup( "close" );
       }
	});	
	
};

function telaDescricao(id){
	$('.cabecalho').remove();
	$('.painel').remove();
	
	$.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter?id=" + id,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function(data) {
            localStorage.setItem("dadosSaved", JSON.stringify(data));
    		montaCabecalho(data.documento.header, id, "false", "");
			var heightCabecalho = $("#cabecalho-detalhes").height();
			var panelLabelList = [];
			$.each(data.documento.panel, function(i, panelDocumento){
				var panelId = panelDocumento.label.replace( /\s/g, '' ) + i;
				var panelLabel = panelDocumento.label;
				panelLabelList[i] = panelDocumento.label;
				inicioPanel(panelId, panelLabel, i, panelDocumento);
				var objJsonOriginal = JSON.parse(localStorage.getItem("diagrama-0"));
				$.each(panelDocumento.fields, function(z, item){
					montaCampos(i, panelId, z, item, "detalhes", id, "false", "");
				});
				finalPanel(panelId, panelLabel, i, panelDocumento);
			});
			inicializaWindow();
			$("#popupSkills").popup( "close" );
			setTimeout('$("#popupDetalhes").popup( "open" )',200);
        }
	});
	// setar acao para botao submit
	$( ".submitButton" ).unbind( "click");
	$( ".submitButton" ).bind( "click", function(event, ui) {
		var dataSaved = localStorage.getItem("dadosSaved");
		var objJson = JSON.parse(dataSaved);
		objJson.documento.id = id;
		objJson.documento.usuarioAtual = localStorage.usuario;
		objJson.documento.tipo = "dados";
		objJson.documento.situacao = "ativo";
		objJson.documento.usuarios[0].codigo = localStorage.usuario;
			$.ajax({
				type: "POST",
	            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/atualizar",
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
	          });
			$("#popupDetalhes" ).popup( "close" );
	});	
};

function incluiDiagramasssss(modelo){
	console.log("aqui");
	$.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter/modelo?modelo=" + modelo,
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
				telaDescricao(idDocumento)
			});
       	});
	});

} 
