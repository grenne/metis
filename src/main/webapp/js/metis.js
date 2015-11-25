/* Funcion��rio Detalhes */
$(document).ready(function() {    
    // window.idFuncionario = $.parametroUrl("fun");
    iniciaSnapper();
    iniciaAcoes();  
    // carregaDetalhesDoFuncionario();
    document.onmousedown=selectmouse;
    document.onmouseup=new Function("isdrag=false");   
});


function montaCampos(i, item) {
	var labelId = item.label.replace( /\s/g, '' ) +  "-" + i;
	var label = item.label;
	var labelRadioId = "";
	inicioCampo(label, labelId);

	if (item.modelo == 'input_texto') {
		$("#td-textinput-" + labelId).append(
                	'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '" class="input-value" required/>'
		);
	}else if(item.modelo == 'input_inteiro') {
		$("#td-textinput-" + labelId).append(
					'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '" class="input-value input-number inteiro" required/>'
		);
	}else if(item.modelo == 'input_decimal') {
		$("#td-textinput-" + labelId).append(
					'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '" class="input-value input-number decimal" required/>'
		);
	}else if(item.modelo == 'input_data') {
		$("#td-textinput-" + labelId).append(
					'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="__/__/____" class="input-value input-number data" required/>'
		);
	}else if(item.modelo == 'input_cpf') {
		$("#td-textinput-" + labelId).append(
					'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '" placeholder="___.___.___-__" class="input-value input-number cpf" required/>'
		);
	}else if(item.modelo == 'input_cnpj') {
		$("#td-textinput-" + labelId).append(
					'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="___.___.___.___/__" class="input-value input-number cnpj" required/>'
		);
	}else if(item.modelo == 'input_celular') {
		$("#td-textinput-" + labelId).append(
					'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="(___)_____.____" class="input-value input-number celular" required/>'
		);
	}else if(item.modelo == 'input_telefone') {
		$("#td-textinput-" + labelId).append(
					'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="(___)____.____" class="input-value input-number telefone" required/>'
		);
	}else if(item.modelo == 'input_placa') {
		$("#td-textinput-" + labelId).append(
					'<input type="text" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '"  placeholder="___-____" class="input-value input-number placa" required/>'
		);
	}else if(item.modelo == 'input_checkbox') {
		var textChecked ="";
		if (item.valor != "") {
			textChecked = 'checked="checked"';
		};
		$("#td-textinput-" + labelId).append(
					'<input type="checkbox" name="' + labelId + '" id="' + labelId + '" value="' + item.valor + '" class="input-value" ' + textChecked + ' required/>'
		);
		$("#" + labelId).click(function() {
			$("#" + labelId).val("");
			if($(this).is(':checked')) {
				$("#" + labelId).val("checked");
			};
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			obj.documento.panel[0].fields[i].valor =  $("#" + labelId).val();
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
		});
	}else if(item.modelo == 'input_radio') {
		var itemChecked ="";
		$("#td-textinput-" + labelId).append(
				'<fieldset id="' + labelId + '" data-role="controlgroup" data-mini="true" class="controlgroup">'
			);
		$.each(item.opcoes, function(w, item_radio){
			var labelRadioId = item_radio.label.replace( /\s/g, '' ) + i;
			var textChecked ="";
			$("#" + labelId).append(
						'<input type="radio" name="' + labelId + '" id="' + labelRadioId + '"  value="' + item_radio.label + '" class="input-value" ' + textChecked +  ' required/>' + 
						'<label for="' + labelRadioId + '">' + item_radio.label + '</label>' 
			);
			$("#" + labelRadioId).checkboxradio().checkboxradio("refresh");
			if (item_radio.label == item.valor) {
				itemChecked = labelRadioId;
				$("#" + labelRadioId).attr("checked",true);
			};
			$("#" + labelRadioId).click(function() {
				obj = JSON.parse(localStorage.getItem("dadosSaved"));
				obj.documento.panel[0].fields[i].valor =  $("#" + labelRadioId).val();
		        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
			});
			$("#" + itemChecked).attr("checked", true).checkboxradio("refresh");
		});
		$("#td-textinput-" + labelId).append(
					'</fieldset>'
		);
	}else if(item.modelo == 'input_select') {
		$("#td-textinput-" + labelId).append(
						'<div id="' + labelId + '" data-role="fieldcontain" class="fieldcontain" >' +
							'<select name="' + labelId + '" id="select-' + labelId + '" data-mini="true" required>'
			);
		$("#select-" + labelId).append(
    			'<option value="">Selecionar</option>' 
		);
		$.each(item.opcoes, function(w, item_select){
			var textSelected ="";
			if (item_select.label == item.valor) {
				textSelected = 'selected';
			};
			$("#select-" + labelId).append(
			        			'<option value="' + item_select.label + '" ' + textSelected + '>' + item_select.label + '</option>' 
			);
		});
		$("#select-" + labelId).click(function() {
			if($("#select-" + labelId).val() == "Selecionar"){
				$("#select-" + labelId).val("");
			};
			obj = JSON.parse(localStorage.getItem("dadosSaved"));
			obj.documento.panel[0].fields[i].valor =  $("#select-" + labelId).val();
	        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
		});

//		$("#table-" + panelId).append(
//						'	</select>' +
//						'</div>'
//		);
		
	};
	// salva conteudo
	$("#" + labelId).blur(function() {
		obj = JSON.parse(localStorage.getItem("dadosSaved"));
		console.log ("antes:" + obj.documento.panel[0].fields[i].valor);
		if (obj.documento.panel[0].fields[i].tipo != "input_texto") {
			obj.documento.panel[0].fields[i].valor =  $("#" + labelId).val().replace(/^\s+|\s+$/g,"");
		}else{
			obj.documento.panel[0].fields[i].valor =  $("#" + labelId).val();
		};
		console.log ("depois:" + obj.documento.panel[0].fields[i].valor);
        localStorage.setItem("dadosSaved", JSON.stringify(obj));    
	});

	finalCampo(label, labelId);
};

function inicioCampo(label, labelId) {
	$("#table-campos").append(
			'<tr>' +
				'<td for="textinput-' + labelId + '" class="ui-input-text">' + label + '</td>' +
				'<td id="td-textinput-' + labelId + '">'
	);
};

function finalCampo(label, labelId) {
	$("#table-campos").append(
				'</td>' +
			'</tr>'					
	);
};

function inicializaWindow() {
	// formata campos texto
	 jQuery('input[type="text"]').textinput().trigger('create');
	// formata campos select
	 jQuery('.fieldcontain').fieldcontain().trigger('create');
	// formata mascaras
	 jQuery('.mesano').mask('00/0000');
	 jQuery('.data').mask('00/00/0000');
	 jQuery('.cpf').mask('000.000.000-00');
	 jQuery('.cnpj').mask('000.000.000.000/0000');
	 jQuery('.celular').mask('(000)00000.0000');
	 jQuery('.telefone').mask('(000)0000.0000');
	 jQuery('.inteiro').mask('000.000.000.000');
	 jQuery('.decimal').mask('000.000.000.000,00');
	 jQuery('.placa').mask('XXX-0000', {translation:  {'X': {pattern: /[A-Z]/}}});
};

/* Utilizada biblioteca Swipe.js: http://swipejs.com/ */
function iniciaAcoes() {
    var elem = document.getElementById('swipe-acoes');
    window.mySwipe = Swipe(elem, {
		startSlide: 0,
		// auto: 3000,
		// continuous: true,
		// disableScroll: true,
		// stopPropagation: true,
		callback: function(index, element) {
			if(index == 0) {
				$('.titulo-pagina').html('Seu Skill');
			} else if (index == 1) {
				$('.titulo-pagina').html('James Bond Skill');
			} else if (index == 2) {
				$('.titulo-pagina').html('Volkswagen Skill');
			} else if (index == 3) {
				$('.titulo-pagina').html('Planet Skill');
			}
		}
		// transitionEnd: function(index, element) {}
    });
    
    $(document).keydown(function(e){
        if (e.keyCode == 39) { 
           window.mySwipe.next();
           return false;
        } else if (e.keyCode == 37) { 
           window.mySwipe.prev();
           return false;
        }
    }); 
    
}

/* Utilizada biblioteca Snap.js: https://github.com/jakiestfu/Snap.js/ */
function iniciaSnapper() {
    var snapper = new Snap({
        element: document.getElementById('conteudo-geral'),
        dragger: document.getElementById('cabecalho-detalhes')
    });  
    
    snapper.on('animated', function() {
        var estado = snapper.state().state;

    });
    
    $('.snap-drawer').on('click', '.fecha-snapper', function () {
        snapper.close();
    });
}
