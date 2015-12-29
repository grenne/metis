/**
 * 
 */
function incluiDiagrama(modelo, diagrama, novoSkill) {
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
		objJson.documento.usuarioAtual = localStorage.cpfUsuario;
		objJson.documento.tipo = "dados";
		objJson.documento.header[0].valor = modelo;
		objJson.documento.situacao = "ativo";
		objJson.documento.usuarios[0].codigo = localStorage.cpfUsuario;
		$.ajax({
			type: "POST",
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/incluir",
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            async:false,
            data : JSON.stringify(objJson)
		})
	  	.done(function( data ) {
		  console.log ("inclusão documento saiu por done");
        	})
        .fail(function(data) {
    	   console.log ("inclusão documento saiu por fail");
       	  })
       	.always(function(data) {
   			var idDocumento = data.responseText;
       		var new_diagrama = 
				'{"documento" :' + 
					'{' +
						'"id":"",' +
						'"tipo":"' + modelo + '",' +
						'"label":"' + diagrama + '",' +
						'"diagrama":' +
						'{' +
							'"nodeDataArray":[{"loc":"50 50","key":"1","text":"' + diagrama + '","color":"' + objJson.documento.header[1].valor + '","id":"' + idDocumento + '", "principal": "true" }]' +
						'}' +
						'}' +
				'}';
			objJson = JSON.parse(new_diagrama);
			$.ajax({
				type: "POST",
	            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/incluir",
	            contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            async:false,
	            data : JSON.stringify(objJson)
			})
			.done(function( data ) {
				console.log ("inclusão diagrama saiu por done");
			})
			.fail(function(data) {
				console.log ("inclusão diagrama saiu por fail");
			})
			.always(function(data) {
				if (novoSkill){
					criarSkill(diagrama, data.responseText);
				}else{
					incluiSkill (diagrama, data.responseText);
				};
			});
       	});
	});
};
		
function incluiSkill(nomeSkill, idDiagrama){
	var objJson = JSON.parse(localStorage.getItem("skills"));
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
		 console.log ("inclusão skill saiu por done - " + JSON.stringify(data));
	  })
     .fail(function(data) {
    	 console.log ("inclusão skill saiu por fail - " + JSON.stringify(data));
     })
     .always(function(data) {
    	 console.log ("inclusão skill saiu por always - " + JSON.stringify(data));
     });
};	

function criarSkill(nomeSkill, idDiagrama){
	var new_skill = 
		'{' +
			  '"skill" : {' +
			    '"id" : "",' +
			    '"usuario" : "' + localStorage.cpfUsuario + '",' +
			    '"skills" : [{' +
			          '"tipo" : "pessoal",' +
			          '"label": "' + nomeSkill + '",' +
			          '"id": "' + idDiagrama + '"' +
			        '}]' +
			    '}' +
			 '}';
	objJson = JSON.parse(new_skill);
	$.ajax({
		type: "POST",
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/skill/incluir",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data : JSON.stringify(objJson)
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
	console.log ("para parar");
	
};	

function inicioPanel(panelId, panelLabel, i, panel, id, manutencao, inputDisabled) {
	var heightDetalhes = $(window).height() - 135 - $("#cabecalho-detalhes").height();
	var montaScroll = '';
	console.log ("height detalhes painel:" + heightDetalhes);
	var linha = ''; 
	linha = linha +
		'<!-- ' + panel.label + ' -->' +			
		'<div id="panel-' + panelId + '" ' + montaScroll + '" class="painel">' +
			'<h3 class="ui-bar ui-bar-d ui-corner-all">' + panel.label + '</h3>';
	linha = linha +
			'<div id="container-' + panelId + '" class=" ui-body ui-body-a ui-corner-all ">' +
				'<div id="table-' + panelId + '">';
	$("#paineis-popup").append(linha);
	
};


function finalPanel(panelId, panelLabel, i, panel, manutencao, inputDisabled) {
	$("#paineis-popup").append(
			'</div>' +
		'</div>' +
		'<!-- ' + panel.label + ' -->' +
	'</div>'
	);
};

function montaPanel(panelId, panelLabel, i, panel, id) {

	var widthDetalhes = $(window).width();
	var heightDetalhes = $(window).height() - 135 - $("#cabecalho-detalhes").height();
	var montaScroll = 'style="overflow: scroll; width: 200px; height:' + heightDetalhes + 'px;"';
	var linha = ''; 
	linha = linha +
		'<!-- ' + panelLabel + ' -->' +			
		'<div id="skill-' + panelId + '" data-role="content" class="dragme dragmeRecepcao">' +
			'<div id="sample">' +
				'<div id="myDiagram-' + panelId + '"	style=" width: ' + widthDetalhes + 'px; height: ' + heightDetalhes + 'px"></div>' +
			'</div>' +
		'</div>';
	$("#paineis").append(linha);
};

function montaCabecalho(header, id, manutencao, inputDisabled ) {

	var linha = ''; 
		linha = linha +
			'<!-- cabecalho -->' +			
			'<div id="table-cabecalho-popup" class="cabecalho  ui-body ui-body-a ui-corner-all ">';
	$("#cabecalho-detalhes-popup").append(linha);

	$.each(header, 
			function(i, header) {
		var labelId = header.label.replace( /\s/g, '' ) + 1 + "-" + i;
		montaCampos(i, "cabecalho-popup", 999, header, "cabecalho", id, manutencao, inputDisabled)
	});

	linha = '</div>' +
			'<!-- cabecalho -->';			
	$("#cabecalho-detalhes-popup").append(linha);
	
};

function montaCampos(i, panelId, z, item, origem, id, manutencao, inputDisabled) {
	var labelId = item.label.replace( /\s/g, '' ).replace(/[^a-zA-Z 0-9]/g, '') + z + "-" + i;
	var label = item.label;
	var labelRadioId = "";

	console.log ("campo : " + label);
	
	var tipoGrid = "ui-grid-a";

	if (manutencao == "true"){
		tipoGrid = "ui-grid-b"
	};

	var labelInputCSS = "labelInput";
	
	if (item.modelo != "input_radio" && item.modelo != "input_radio_inline" && item.modelo != "input_select"  ) {
		labelInputCSS = labelInputCSS + " labelInputAlign";
	};
	
	$("#table-" + panelId).append(
			'<div id="div-input-' + labelId +  '" class="' + tipoGrid + '">' +
				'<label for="' + labelId + '" class="' + labelInputCSS  + ' ui-block-a">' + label + '</label>'
	);

	if (item.modelo == 'input_texto') {
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
                		'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '" class="input-value " required ' + inputDisabled + ' data-inline="true" data-mini="true"/>' +
                	'</div>'	
		);
	}else if(item.modelo == 'input_textarea') {
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
						'<textarea type="text" name="' + labelId + '" id="' + labelId + '" value="" class="input-value" required ' + inputDisabled + 'data-autosize-on="true" data-inline="true" cols="50">' + item.valor + '</textarea>' +
					'</div>'	
		);
		autosize($("#" + labelId));
	}else if(item.modelo == 'input_decimal') {
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
						'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '" class="input-value input-number decimal" required ' + inputDisabled + ' data-inline="true"/>' +
					'</div>'	
		);
	}else if(item.modelo == 'input_data') {
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
						'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="__/__/____" class="input-value input-number data" required ' + inputDisabled + ' data-inline="true" data-role="date"/>' + 
					'</div>'	
		);
	}else if(item.modelo == 'input_cpf') {
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
						'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '" placeholder="___.___.___-__" class="input-value  input-number cpf" required ' + inputDisabled + ' data-inline="true"/>' +
					'</div>'	
		);
	}else if(item.modelo == 'input_cnpj') {
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
						'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="___.___.___.___/__" class="input-value  input-number cnpj" required ' + inputDisabled + ' data-inline="true"/>' +
					'</div>'	
		);
	}else if(item.modelo == 'input_celular') {
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
						'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="(___)_____.____" class="input-value  input-number celular" required ' + inputDisabled + ' data-inline="true"/>' +
					'</div>'	
		);
	}else if(item.modelo == 'input_telefone') {
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
						'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="(___)____.____" class="input-value input-number telefone" required ' + inputDisabled + ' data-inline="true"/>' +
					'</div>'	
		);
	}else if(item.modelo == 'input_placa') {
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
						'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="___-____" class="input-value input-number placa" required ' + inputDisabled + ' data-inline="true" data-mini="true"/>' +
					'</div>'	
					)
	}else if(item.modelo == 'input_upload_image') {
		$("#teste").append(
				'<label class="control-label">Grenne</label>' + 
				'<input id="input-1" type="file" class="file">'                
		);
		alert ("detalhes");
    }else if(item.modelo == 'input_checkbox') {
		var textChecked ="";
		if (item.valor != "") {
			textChecked = 'checked="checked"';
		};
		$("#div-input-" + labelId).append(
					'<div class="ui-block-b">' +
						'<input type="checkbox" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '" class="input-value " ' + textChecked + ' required ' + inputDisabled + ' data-inline="true"/>' +
					'</div>'	
		);
		$("#" + labelId).click(function() {
			$("#" + labelId).val("");
			if($(this).is(':checked')) {
				$("#" + labelId).val("checked");
			};
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			obj.documento.panel[i].fields[z].valor =  $("#" + labelId).val();
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
		});
	}else if(item.modelo == 'input_radio') {
		var itemChecked ="";
		$("#div-input-" + labelId).append(
				'<fieldset id="' + labelId + '" data-role="controlgroup" data-mini="true" class="controlgroup  ui-block-b">'
			);
		$.each(item.opcoes, function(w, item_radio){
			var labelRadioId = item_radio.label.replace( /\s/g, '' ) + z;
			var textChecked ="";
			$("#" + labelId).append(
						'<input type="radio" name="' + labelId + '" id="' + labelRadioId + '"  value="' + item_radio.label + '" class="input-value" ' + textChecked +  ' required ' + inputDisabled + ' data-inline="true"/>' + 
						'<label for="' + labelRadioId + '" class="input_text">' + item_radio.label + '</label>' 
			);
			$("#" + labelRadioId).checkboxradio().checkboxradio("refresh");
			if (item_radio.label == item.valor) {
				itemChecked = labelRadioId;
				$("#" + labelRadioId).attr("checked",true);
			};
			$("#" + labelRadioId).click(function() {
				obj = JSON.parse(localStorage.getItem("dadosSaved"));
				obj.documento.panel[i].fields[z].valor =  $("#" + labelRadioId).val();
		        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
			});
			$("#" + itemChecked).attr("checked", true).checkboxradio("refresh");
		});
		$("#div-input-" + labelId).append(
					'</fieldset>'
		);
	}else if(item.modelo == 'input_radio_inline') {
		var itemChecked ="";
		$("#div-input-" + labelId).append(
				'<fieldset id="' + labelId + '" data-role="controlgroup" data-mini="true" class="controlgroup  ui-block-b">'
			);
		$.each(item.opcoes, function(w, item_radio){
			var labelRadioId = item_radio.label.replace( /\s/g, '' ) + z;
			var textChecked ="";
			$("#" + labelId).append(
						'<input type="radio" name="' + labelId + '" id="' + labelRadioId + '"  value="' + item_radio.label + '" class="input-value" ' + textChecked +  ' required ' + inputDisabled + ' data-inline="true"/>' + 
						'<label for="' + labelRadioId + '" class="input_text">' + item_radio.label + '</label>' 
			);
			$("#" + labelRadioId).checkboxradio().checkboxradio("refresh");
			if (item_radio.label == item.valor) {
				itemChecked = labelRadioId;
				$("#" + labelRadioId).attr("checked",true);
			};
			$("#" + labelRadioId).click(function() {
				obj = JSON.parse(localStorage.getItem("dadosSaved"));
				if (z != 999){
					obj.documento.panel[i].fields[z].valor =  $("#" + labelRadioId).val();
				}else{
					obj.documento.header[i].valor =  $("#" + labelRadioId).val();
				};
		        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
			});
			$("#" + itemChecked).attr("checked", true).checkboxradio("refresh");
		});
		$("#div-input-" + labelId).append(
					'</fieldset>'
		);
	}else if(item.modelo == 'input_select') {
		$("#div-input-" + labelId).append(
						'<select name="' + labelId + '" id="select-' + labelId + '" data-mini="true" required ' + inputDisabled + ' data-inline="true" class="ui-block-b">'
			);
		$("#select-" + labelId).append(
    			'<option value="" class="input_text">Selecionar</option>' 
		);
		$.each(item.opcoes, function(w, item_select){
			var textSelected ="";
			if (item_select.label == item.valor) {
				textSelected = 'selected';
			};
			$("#select-" + labelId).append(
			        			'<option value="' + item_select.label + '" ' + textSelected + ' class="input_text">' + item_select.label + '</option>' 
			);
		});
		$("#select-" + labelId).click(function() {
			if($("#select-" + labelId).val() == "Selecionar"){
				$("#select-" + labelId).val("");
			};
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			if (z != 999){
				obj.documento.panel[i].fields[z].valor =  $("#select-" + labelId).val();
			}else{
				obj.documento.header[i].valor =  $("#select-" + labelId).val();
			};
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
		});

		$("#div-input-" + labelId).append(
						'</select>');

	};

	// salva conteudo
	if (origem == "detalhes"){
		$("#" + labelId).blur(function() {
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			console.log ("Cantes:" + obj.documento.panel[i].fields[z].valor);
			if (obj.documento.panel[i].fields[z].tipo != "input_texto") {
				obj.documento.panel[i].fields[z].valor =  $("#" + labelId).val().replace(/^\s+|\s+$/g,"");
			}else{
				obj.documento.panel[i].fields[z].valor =  $("#" + labelId).val();
			};
			console.log ("depois:" + obj.documento.panel[i].fields[z].valor);
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
		});
	}else{
		$("#" + labelId).blur(function() {
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			console.log ("CAB antes:" + obj.documento.header[i].valor);
			if (obj.documento.header[i].tipo != "input_texto") {
				obj.documento.header[i].valor =  $("#" + labelId).val().replace(/^\s+|\s+$/g,"");
			}else{
				obj.documento.header[i].valor =  $("#" + labelId).val();
			};
			console.log ("CAB depois:" + obj.documento.header[i].valor);
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
		});
	};

	if (manutencao == "true"){
		var linha =  
			'<div class="ui-block-c">' +
				'<a id="incluirButton-' + labelId + '" data-role="button" data-inline="true" data-theme="a" data-icon="plus" data-mini="true" class="line-button">Campo Novo</a>' +
				'<a id="excluirButton-' + labelId + '" data-role="button" data-inline="true" data-theme="a" data-icon="delete" data-mini="true" class="line-button">Excluir</a>' +
				'<a id="alterarButton-' + labelId + '" data-role="button" data-inline="true" data-theme="a" data-icon="gear" data-mini="true" class="line-button">Alterar</a>' +
			 '</div>';
		$("#div-input-" + labelId).append(linha);
	};
	

	$("#table-" + panelId).append(
		'</div>' +
		'<!--fecha linha');
	
	if (manutencao == "true"){
		$('#incluirButton-' + labelId).bind( "click", function(event, ui) {
	    	$( ".opcoes" ).each(function(i) {
	    		$('.opcoes').remove();
	    	});
	    	$( "#popupIncluiInput" ).popup( "open" );
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			var new_field = {'modelo' : '', 'label' : '','valor' : ''};
			if (origem == "detalhes"){
				obj.documento.panel[i].fields.splice(z+1, 0, new_field);
				z++;
			}else{
				obj.documento.header.splice(i+1, 0, new_field);
				i++;
			}
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));   
	        salvaConteudo(i, z, "nomeCampo", origem, id);
	    });
	    $('#excluirButton-' + labelId).bind( "click", function(event, ui) {
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			if (origem == "detalhes"){
				obj.documento.panel[i].fields.splice(z, 1);
			}else{
				obj.documento.header.splice(i, 1);
			};
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));   
			var objJson = JSON.parse(localStorage.getItem("dadosSaved"));
			objJson.documento.id = id;
			$.ajax({
				type: "POST",
	            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/atualizar",
	            contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : JSON.stringify(objJson),
	            success: function(data) {
	            	console.log ("terminou atualização id:" + id + " data:" + data);
	        		window.location.reload();
	            }
			});
	    });
	    var tipo = item.modelo;
	    $('#alterarButton-' + labelId).bind( "click", function(event, ui) {
	    	$("#nomeCampo").val(label);
	    	numeroCampo = 0;
	    	$( ".opcoes" ).each(function(i) {
	    		$('.opcoes').remove();
	    	});
	    	if (tipo == "input_radio" || tipo == "input_select" ){
	    		$.each(item.opcoes, function(w, item_select){
	       			incluirOpcoes(item_select.label);
	    		});
	        	$(".selectOptions").val(tipo).prop('selected', true);		  
	    	};
	    	$("#popupIncluiInput" ).popup( "open" );
	        salvaConteudo(i, z, "nomeCampo", origem, id);
	    });
	};
    
};

function salvaConteudo(i, z, labelId, origem, id) {

	// salva conteudo
	if (origem == "detalhes"){
		$("#nomeCampo").unbind("blur");
		$("#nomeCampo").bind( "blur", function(event, ui) {
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			obj.documento.panel[i].fields[z].label =  $("#nomeCampo").val();
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));   
		});
		$("#select-tipos").unbind("change");
		$("#select-tipos").bind( "change", function(event, ui) {
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			obj.documento.panel[i].fields[z].modelo = $("#select-tipos").val()
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));   
	    	$( ".opcoes" ).each(function(i) {
	    		$('.opcoes').remove();
	    	});
	    	numeroCampo = 0;
	    	if ($("#select-tipos").val() == "input_radio" || $("#select-tipos").val() == "input_select" ){
	   			incluirOpcoes("");
	    	}; 
	    });
		$("#confirmaAlteracao").unbind("click");
		$("#confirmaAlteracao" ).bind( "click", function(event, ui) {
			var objJson = JSON.parse(localStorage.getItem("dadosSaved"));
			if (objJson.documento.panel[i].fields[z].modelo == "input_radio" || objJson.documento.panel[i].fields[z].modelo == "input_select" ){
				delete objJson.documento.panel[i].fields[z]['opcoes'];
	    		objJson.documento.panel[i].fields[z].opcoes=[];
		    	$( ".opcoes" ).each(function(w) {
		    		objJson.documento.panel[i].fields[z].opcoes.push({"label":$("#opcoes" + w).val()});
		    	});
			};
			objJson.documento.id = id;
			$.ajax({
				type: "POST",
	            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/atualizar",
	            contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : JSON.stringify(objJson),
	            success: function(data) {
	            	console.log ("terminou atualização id:" + id + " data:" + data);
	        		window.location.reload();
	            }
			});
		});	
	}else{
		$("#nomeCampo").unbind("blur");
		$("#nomeCampo").bind( "blur", function(event, ui) {
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			obj.documento.header[i].label =  $("#nomeCampo").val();
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));
		});
		$("#select-tipos").unbind("change");
		$("#select-tipos").bind( "change", function(event, ui) {
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			obj.documento.header[i].modelo =  $("#select-tipos").val()
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));
	    	$( ".opcoes" ).each(function(i) {
	    		$('.opcoes').remove();
	    	});
	    	numeroCampo = 0;
	    	if ($("#select-tipos").val() == "input_radio" || $("#select-tipos").val() == "input_select" ){
	    		console.log ("entrou monta opcao");
	   			incluirOpcoes("");
	    	}; 
	    });
		$("#confirmaAlteracao").unbind("click");
		$("#confirmaAlteracao" ).bind( "click", function(event, ui) {
			var objJson = JSON.parse(localStorage.getItem("dadosSaved"));
			if (objJson.documento.header[i].modelo == "input_radio" || objJson.documento.header[i].modelo == "input_select" ){
				delete objJson.documento.header[i]['opcoes'];
	    		objJson.documento.header[i].opcoes=[];
		    	$( ".opcoes" ).each(function(w) {
		    		objJson.documento.header[i].opcoes.push({"label":$("#opcoes" + w).val()});
		    	});
			};
			objJson.documento.id = id;
			$.ajax({
				type: "POST",
	            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/atualizar",
	            contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : JSON.stringify(objJson),
	            success: function(data) {
	            	console.log ("terminou atualização id:" + id + " data:" + data);
	        		window.location.reload();
	            }
			});
		});	
	};
	// setar acao para botao submit
	
};
