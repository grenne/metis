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
	//  inicializa cor com a cor do usuario
	//
	localStorage.corComparacao = "green";
	//
	// ** obter idModeloHabilidade
	//
	$.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter/modelo?modelo=Habilidades",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async:false
	})
	.done(function( data ) {
		console.log ("obter idHabilidade saiu por done");
		localStorage.idModeloHabilidade = data.documento.id;
		localStorage.ModeloHabilidade = "Habilidades";
	})
	.fail(function(data) {
		console.log ("obter idHabilidade saiu por fail");
	})
	.always(function(data) {
		console.log ("obter idHabilidade saiu por fail");
	});
	//
	// ** obter idDiagramaUsuario
	//
	$(function(){
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/skill/obter?usuario=" + localStorage.usuario,
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
		})
	  	.done(function( data ) {
			$.each(data.skill.skills, function(i, panel){
				localStorage.idDiagramaUsuario = panel.id;
			});			
	  	})
        .fail(function(data) {
			console.info("ler skil saiu por fail");
        })
       	.always(function(data) {

       	});
	});

	// ** monta paineis iniciais
	//
	skillInicial("YggMap", true);

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
		localStorage.corComparacao = "green";
		$('.titulo-pagina').html("YggMap");
		skillInicial("YggMap", false, false);
	});
	$("#listaCarreiras").bind( "click", function(event, ui) {
		localStorage.corComparacao = "coral";
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
		localStorage.corComparacao = "green"
		$('.titulo-pagina').html("YggMap");
		skillInicial("YggMap", true, true);
	});
	$("#volta-documento").bind( "click", function(event, ui) {
    	$("#popupDetalhes").popup( "close" );
	});
	$("#volta-inclui-painel").bind( "click", function(event, ui) {
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

function skillInicial(skillInicial, efetuaComparacao, comparaDiagramaUsuario) {
		
	$(".paineis").remove();
	localStorage.paineis = 0;
	localStorage.comparacao = "true";
	
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
				if(efetuaComparacao){
					montaComparacao(localStorage.idDiagramaUsuario, comparaDiagramaUsuario, "green");
				}else{
					init("myDiagram-" + panelId, i, id);
				};
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
};
	
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
					montaLinhaSkill(i, skills, skills._id, tipoLista, skills.label);
				});
				inicializaWindow();
				$('ul').listview('refresh');
				$("#popupSkills").popup( "open" );
			}
		});
	});
};

function montaLinhaSkill(i, skills, id, tipoLista, nomeDiagrama) {
	var labelId = skills.label.replace( /\s/g, '' ) + "-" + i;
	var linha = 
        '<li class="ui-body linhasSkill">' +
	    	'<a id="item-' + i + '"  data-transition="flip">' +
	    		'<h2  class="ui-bar ui-bar-d ui-corner-all">' + 
				'<p>' + nomeDiagrama + '</p>';
	linha = linha +	
				'</h2>' +
			'</a>' +
			'<a id="item-descricao' + i + '"  data-rel="popup" data-position-to="window" data-transition="pop">Descrição</a>' +
		'</li>';	
	$("#tabela-listaSkills").append(linha);
	
	$("#item-" + i).bind( "click", function(event, ui) {
		$("#skill-yggmap0").remove();
		montaPanel("yggmap0", "YggMap");
		montaComparacao(id, true, "coral", "green");
	});
	$("#item-descricao" + i).bind( "click", function(event, ui) {
		telaDescricao(idDocumento, tipoLista, nomeDiagrama, id);
	});
};

function montaComparacao(id, comparaDiagramaUsuario, colorComparacaoPrimaria, colocarComparacaoSecundaria) {

	var objJsonOriginal = JSON.parse(localStorage.getItem("diagrama-0"));
	var objJsonOriginalSalva = JSON.parse(localStorage.getItem("diagrama-0"));
	jQuery.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/obter?id=" + id,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
        success: function(data) {
        	var objJsonComparar = data.documento.diagrama.nodeDataArray
        	$.each(objJsonComparar, function(j, nodeComparar){
        		$.each(objJsonOriginal.documento.diagrama.nodeDataArray, function(w, nodeOriginal){
        			if (nodeOriginal.id == nodeComparar.id) {
        				if (colorComparacaoPrimaria){
        					objJsonOriginal.documento.diagrama.nodeDataArray[w].color = colorComparacaoPrimaria;	
        				}else{
        					objJsonOriginal.documento.diagrama.nodeDataArray[w].color = "coral";
        				}
        			};
        		});
        	});		
        	if (comparaDiagramaUsuario){
        		$('.titulo-pagina').html("YggMap (comparação com " + data.documento.label + ")");
	    		jQuery.ajax({
	    	        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/obter?id=" + localStorage.idDiagramaUsuario,
	    	        contentType: "application/json; charset=utf-8",
	    	        dataType: 'json',
	    	        async: false,
	    	        success: function(data) {
	    	        	var objJsonComparar = data.documento.diagrama.nodeDataArray
	    	        	$.each(objJsonComparar, function(j, nodeComparar){
	    	        		$.each(objJsonOriginal.documento.diagrama.nodeDataArray, function(w, nodeOriginal){
	    	        			if (nodeOriginal.id == nodeComparar.id) {
	    	        				if (objJsonOriginal.documento.diagrama.nodeDataArray[w].color == "coral"){
	    	        					objJsonOriginal.documento.diagrama.nodeDataArray[w].color = "lightgreen"
	    	        				}else{
	    	        					objJsonOriginal.documento.diagrama.nodeDataArray[w].color = "green"
	    	        				}
	    	        			};
	    	        		});
	    	        	});		
	    	        	localStorage.setItem("diagrama-0", JSON.stringify(objJsonOriginal));
	    	        	localStorage.setItem("diagrama-1", JSON.stringify(data));
	//    	        	$(".paineis").remove();       	
	    	    		init("myDiagram-yggmap0", 0, 0, JSON.parse(localStorage.getItem("diagrama-0")) );
	    	    		localStorage.comparacao = "true";
	    	    		localStorage.labelComparacao = data.documento.label;
	    	    		$("#popupSkills").popup( "close" );
	    	    		localStorage.setItem("diagrama-2", JSON.stringify(objJsonOriginal));
	    	    		localStorage.setItem("diagrama-0", JSON.stringify(objJsonOriginalSalva));
	    	       }
	    		})
        	}else{
	        	localStorage.setItem("diagrama-0", JSON.stringify(objJsonOriginal));
	        	localStorage.setItem("diagrama-1", JSON.stringify(data));
//    	        	$(".paineis").remove();       	
	    		init("myDiagram-yggmap0", 0, 0, JSON.parse(localStorage.getItem("diagrama-0")) );
	    		localStorage.comparacao = "true";
	    		localStorage.labelComparacao = data.documento.label;
	    		$('.titulo-pagina').html("YggMap (comparação com " + data.documento.label + ")");
	    		$("#popupSkills").popup( "close" );
	    		localStorage.setItem("diagrama-2", JSON.stringify(objJsonOriginal));
	    		localStorage.setItem("diagrama-0", JSON.stringify(objJsonOriginalSalva));
        	}
       }
	});	
	
};

function telaDescricao(id, modelo, nomeDiagrama, idDiagrama){
	
	$.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter?id=" + id,
        contentType: "application/json; charset=utf-8",
        dataType: 'json'
	})  	
	.done(function( data ) {
	  console.log ("obter documento saiu por done");
	  localStorage.setItem("dadosSaved", JSON.stringify(data));
	  montaDocumento (data);
	  $("#popupSkills").popup( "close" );
	  setTimeout('$("#popupDetalhes").popup( "open" )',200);
	})
	.fail(function(data) {
		console.log ("obter documento saiu por fail");
		incluirDocumento(modelo, nomeDiagrama);
		montaDocumento (JSON.parse(localStorage.getItem("dadosSaved")));
		$("#popupSkills").popup( "close" );
		setTimeout('$("#popupDetalhes").popup( "open" )',200);
	})
   	.always(function(data) {
   		console.log ("obter documento saiu por always");
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
	       		obterDiagrama (idDiagrama);
	       		atualizaDiagrama(data.responseText, idDiagrama, objJson.documento.header[0].valor, objJson.documento.header[1].valor);
	          });
			$("#popupDetalhes" ).popup( "close" );
	});	
};
function obterDiagrama (idDiagrama){

	jQuery.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/obter?id=" + idDiagrama,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
	})
  	.done(function( data ) {
	  console.log ("obter diagrama saiu por done");
	  localStorage.setItem("diagrama-" + idDiagrama, JSON.stringify(data));
  	})
    .fail(function(data) {
	   console.log ("obter diagrama saiu por fail");
    })
   	.always(function(data) {
 	   console.log ("obter diagrama saiu por always");
   	});
};
function montaDocumento (data){
	$('.cabecalho').remove();
	$('.painel').remove();
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
};

function atualizaDiagrama(idDocumento, idDiagrama, text, color) {
	
	var objJson = JSON.parse(localStorage.getItem("diagrama-" + idDiagrama));
	objJson.documento.label = text;
	objJson.documento.idDocPrincipal = idDocumento;
	$.ajax({
		type: "POST",
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/atualizar",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async : false,
        data : JSON.stringify(objJson),
        success: function(data) {
        	console.log ("terminou atualização diagrama id:" + idDocumento + " data:" + data);
    		localStorage.removeItem("diagrama-" + idDiagrama);
        }
	});
};
