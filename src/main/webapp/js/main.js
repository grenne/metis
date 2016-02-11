var restPath = "/rest";
var loginPath = "/login";

$(document).on('pagebeforecreate', function () {
    colocaPainelEsquerda();
});

$(document).ready(function () {     
    carregaConfiguracao();
    
    escondeAcoesDoGestor();
});

function escondeAcoesDoGestor() {
    if(window.eGestor === 'false') {
        $('.acao-gestor').remove();
    }   
}

function carregaConfiguracao() {
    var configPag = "config.html";
    
    // configuração não está persistida no aparelho ou está incompleta, 
    // redireciona para página de configuração
//    if(localStorage.urlServidor == null 
//        || localStorage.idFun == null
//        || localStorage.idPes == null
//        || localStorage.eGestor == null) {
//    	
//        if(window.location.pathname.indexOf(configPag) == -1) {
//        	document.location.href = configPag;
//        }   
//        
//    } else {
//        window.urlServidor = localStorage.urlServidor;
//        window.idFunLogado = localStorage.idFun;
//        window.idPesLogada = localStorage.idPes;
//        window.eGestor = localStorage.eGestor;
//    }
}


function carregando(mostraOuEsconde, timeout) {
    var timeout = timeout ? timeout : 1;
    
    setTimeout(function(){
        $.mobile.loading(mostraOuEsconde);
    }, timeout); 
}

//function getParametroURL(sParam)
//{
//    var sPageURL = window.location.search.substring(1);
//    var sURLVariables = sPageURL.split('&');
//    for (var i = 0; i < sURLVariables.length; i++)
//    {
//        var sParameterName = sURLVariables[i].split('=');
//        if (sParameterName[0] == sParam)
//        {
//            return sParameterName[1];
//        }
//    }
//}

function colocaPainelEsquerda() {
    var painelEsquerdaHtml =  '' + 
        '<div ' +
            'data-role="panel"' +
            'data-position-fixed="true" ' +
            'data-display="push" ' +
            'data-theme="e" ' +
            'id="nav-panel">' +
            '<ul data-role="listview">' +
	            '<li data-role="list-divider" id="menu-correcao-iphone-5"></li>' +            
                '<li data-icon="delete"><a ' +
                    'href="#"' +
                    'data-rel="close">Fechar</a></li>' +
                '<li><a ' +
                    'href="index.html"' +
                    'rel="external"' +
                    'data-transition="flip">Página inicial</a></li>' +
                '<li><a ' +
                    'href="modelo-lista.html?modelo-administracao.html"' +
                    'rel="external"' +
                    'data-transition="flip">Modelos</a></li>' +
                '<li><a ' +
                	'id="listaPessoal"' +
                    'href="#popupSkills?Pessoal"' +
                    'rel="external"' +
                    'data-transition="flip">Seus skills</a></li>' +
                '<li><a ' +
                	'id="yggmap"' +
                    'href="metis.html"' +
                    'rel="external"' +
                    'data-transition="flip">YggMap</a></li>' +
                '<li><a ' +
                	'id="listaCarreiras"' +
                    'href="#popupSkills?Carreira"' +
                    'rel="external"' +
                    'data-transition="flip">Carreiras</a></li>' +
                '<li><a ' +
            		'id="listaBadges"' +
                	'href="#popupSkills?Badges"' +
                    'rel="external"' +
                    'data-transition="flip">Badges</a></li>' +
                 '<li><a ' +
                 	'id="listaCursos"' +
                	'href="#popupSkills?Cursos"' +
                    'rel="external"' +
                    'data-transition="flip">Cursos</a></li>' +
                '<li><a ' +
                    'href="config.html"' +
                    'rel="external"' +
                    'data-transition="flip">Configurações</a></li>' +
            '</ul>' +
        '</div>';
    
        $('div:jqmData(role="page")').append(painelEsquerdaHtml);
}


(function( $ ){
    $.fn.carregando = function(terminouCarregamento) {
        
        return this.each(function () {
            if(terminouCarregamento) {
                $(this).removeClass('div-carregando');
                $(this).find('.loader-div').remove();
            } else {
                $(this).append('<img src="css/images/ajax-loader.gif" class="loader-div"/>');
                $(this).addClass('div-carregando');
            }
        });
    };
    
    /**
     * Retorna data escrita por extenso. Ex.: domingo, 02 de fevereiro de 2014
     */
    $.formataDataPorExtenso = function(dataEmMils) {
    	if(!dataEmMils) {
    		return '';
    	}
    	
    	var options = {
    		    year: "numeric", month: "long", day: "2-digit", weekday: "long"
    		};
    	
    	var data = new Date(dataEmMils);
    	
    	return data.toLocaleDateString("pt-BR", options);
    } 
    
    /**
     * Retorna data formatada dd/MM/yyyy. Ex.: 02/04/2014
     */
    $.formataData = function(dataEmMils) {   
    	if(!dataEmMils) {
    		return '';
    	}
    	
    	var options = {
    		    year: "numeric", month: "2-digit", day: "2-digit"
    		};
    	
    	var data = new Date(dataEmMils);
    	
    	return data.toLocaleDateString("pt-BR", options);
    }    
    
    /**
     * Retorna horário formatado [hh]h[mm]. Ex.: 09h45
     */
    $.formataHora = function(dataEmMils) {    	
    	if(!dataEmMils) {
    		return '';
    	}
    	
    	var data = new Date(dataEmMils);
    	var horas = data.getHours().toString();
    	var minutos = data.getMinutes().toString();
    	
    	return (horas.length < 2 ? '0' : '') + horas + "h" + (minutos.length < 2 ? '0' : '') + minutos;
    }    
    
    $.basicAuth = function () {
        var decodedStr = localStorage.usuario + ':' + localStorage.senha;
        var encodedStr = btoa(decodedStr);
        return "Basic " + encodedStr;
    }
    
    $.ajaxPop = function (settings) {
        $.ajax({
            url: settings.url,
            beforeSend: function (xhr) {                
                if(settings.autenticacao) {
                    xhr.setRequestHeader ("Authorization", $.basicAuth());
                }
                if(settings.carregaDiv) {
                    settings.carregaDiv.carregando();
                } else if(settings.carregaGlobal) {
                    $('.ui-content').hide();
                    carregando("show");    
                }
            }
        }).done(function(data) {       
            settings.funcaoCallback(data);
            
            if(settings.carregaDiv) {
                settings.carregaDiv.carregando(true);
            } else if(settings.carregaGlobal) {
                carregando("hide", 200);    
            }
            
        }).error(function () {
            alert(settings.msgErro);
            carregando("hide", 200); 
        });        
    }
    
    $.parametroUrl = function(nome){
        var results = new RegExp('[\\?&]' + nome + '=([^&#]*)').exec(window.location.href);
        if (results==null){
           return null;
        } else {
           return results[1] || 0;
        }
    }
    
    /**
     * Transforma um elemento em um botão de selecionar/limpar todos os checkbox da tela.
     * 
     */
    $.fn.selecionaTodos = function() { 
    	var toggle$ = $(this);
    	
    	var textoSelecionar = "Selecionar todos";
    	var textoLimpar = "Limpar todos";
    	
    	toggle$.html(textoSelecionar).addClass('ui-btn-icon-left ui-icon-check');
    	
    	toggle$.click(function () {
    		if(toggle$.data('selecionado')) {
    			$(':checkbox:enabled:visible').removeProp('checked').checkboxradio('refresh');
    			
    			toggle$.data('selecionado', false).html(textoSelecionar).removeClass('ui-icon-delete').addClass('ui-icon-check');
    		} else {
    			$(':checkbox:enabled:visible').prop('checked', 'true').checkboxradio('refresh');
    			
    			toggle$.data('selecionado', true).html(textoLimpar).removeClass('ui-icon-check').addClass('ui-icon-delete');
    		}
    	});    	
    	
    }
    
})

function inicializaWindow() {	
	// formata campos texto
	$('input[type="text"]').textinput().trigger('create');
	// formata campos select
	$('.fieldcontain').fieldcontain().trigger('create');
	// formata campos botoes
	$('.line-button').button().trigger('create');
	$('select').select('refresh');
	$('.mesano').mask('00/0000');
	$('.data').mask('00/00/0000');
	$('.cpf').mask('000.000.000-00');
	$('.cnpj').mask('000.000.000.000/0000');
	$('.celular').mask('(000)00000.0000');
	$('.telefone').mask('(000)0000.0000');
	$('.inteiro').mask('000.000.000.000');
	$('.decimal').mask('000.000.000.000,00');
	$('.placa').mask('XXX-0000');
	$('.placa').mask('XXX-0000', {translation:  {'X': {pattern: /[A-Z]/}}});
};

/* Utilizada biblioteca Swipe.js: http://swipejs.com/ */
function iniciaAcoes(panelLabelList) {
    var elem = document.getElementById('swipe-acoes');
    window.mySwipe = Swipe(elem, {
      startSlide: 0,
      // auto: 3000,
      // continuous: true,
      // disableScroll: true,
      // stopPropagation: true,
      callback: function(index, element) {
            $('.titulo-pagina').html(panelLabelList[index]);
            localStorage.setItem("panel", index);
            if (index == 0){
            	$("#btn-exclui-painel").hide();
            }else{
            	$("#btn-exclui-painel").show();
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
};


function mobileDetect() {
	// device detection
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
			.test(navigator.userAgent)
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
					.test(navigator.userAgent.substr(0, 4))) {
		localStorage.device = "mobile";
		return true;
		
	} else {
		localStorage.device = "desktop";
		return false;
	};
};


( jQuery );