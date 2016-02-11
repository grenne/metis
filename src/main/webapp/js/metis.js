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
	localStorage.paineis = 0;
	localStorage.comparacao = "false";
	if (deviceMobile){
		localStorage.urlServidor = "52.27.128.28";
	};
	
	$(function(){
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/skill/obter?usuario=YggMap",
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

	$("#btn-nav-right").bind( "click", function(event, ui) {
		window.mySwipe.next();
	});
	$("#btn-nav-left").bind( "click", function(event, ui) {
		window.mySwipe.prev();
	});
	$("#listaCarreiras").bind( "click", function(event, ui) {
		montaListasSkill("Carreira");
	});
	$("#listaBadges").bind( "click", function(event, ui) {
		montaListasSkill("Badges");
	});
	$("#listaCursos").bind( "click", function(event, ui) {
		montaListasSkill("Cursos");
	});
	$("#listaPessoal").bind( "click", function(event, ui) {
		montaListasSkill("Cursos");
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
	$("#volta-modelos").bind( "click", function(event, ui) {
		localStorage.setItem("dialogOpen", "false");
    	$("#nodeNewObject").popup( "close" );
    	setTimeout('history.go()',200);
		window.location.reload(true);
	});
	$("#btn-exclui-painel").bind( "click", function(event, ui) {
		excluiSkill(localStorage.getItem("panel"));
		setTimeout('history.go()',200);
		window.location.reload(true);
	});
	$("#nodeNewObject" ).bind({
		popupafterclose: function(event, ui) {
			window.location.reload(true);
		}
	});
});
	
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
					montaLinhaSkill(i, skills, id);
				});
				inicializaWindow();
				$('ul').listview('refresh');
				$("#popupSkills").popup( "open" );
			}
		});
	});
};

function montaLinhaSkill(i, skills, id) {
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
		'</li>';	
	$("#tabela-listaSkills").append(linha);
	
	$("#item-" + i).bind( "click", function(event, ui) {
		$("#skill-yggmap0").remove();
		montaPanel("yggmap0", "YggMap");
		montaComparacao(id);
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
        	var objJsonComparar = data.documento.diagrama.nodeDataArray
        	$.each(objJsonComparar, function(j, nodeComparar){
        		$.each(objJsonOriginal.documento.diagrama.nodeDataArray, function(w, nodeOriginal){
        			if (nodeOriginal.id == nodeComparar.id) {
        				objJsonOriginal.documento.diagrama.nodeDataArray[w].color = "coral";		
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