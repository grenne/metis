$(document).ready(function() {
	var urlInput$ = $('#urlTextInput');
	var cpfInput$ = $('#cpfTextInput');
	var senhaInput$ = $('#senhaPassInput');
	var nomeUsuario$ = $('#nomeUsuario');

	urlInput$.val(localStorage.urlServidor);
	cpfInput$.val(localStorage.cpfUsuario);
	senhaInput$.val(localStorage.senha);
	nomeUsuario$.val(localStorage.nomeUsuario);
	
	if (localStorage.device == "mobile"){
		alert ("IP:" + localStorage.urlServidor + " CPF:" + localStorage.cpfUsuario);
	}else{
		console.log ("IP:" + localStorage.urlServidor);
		console.log ("CPF:" + localStorage.cpfUsuario);
	};

	$(".cadastroUsuario").hide();
	$(".cadastroUsuario").prop('required',false);
	
	$('#cpfTextInput').mask('000.000.000-00', {
		reverse : true
	});

	$("#configForm").submit(function(e) {
		e.preventDefault();
		salvaConfiguracao(this);
	});
	
	$("#preencheBaseDemo").click(function () { 
		utilizarBaseDeDemonstracao();
	});

});

function utilizarBaseDeDemonstracao() {
	var urlInput$ = $('#urlTextInput');
	var cpfInput$ = $('#cpfTextInput');
	var senhaInput$ = $('#senhaPassInput');
	var nomeUsuario$ = $('#nomeUsuario');
	
	var urlDemo = "http://54.225.154.23:1080/populisII-web";
	var cpfDemo = "111.111.111-11";
	var senhaDemo = "teste";

	console.info("Preenchendo formulário com dados da base de demonstração");
	urlInput$.val(urlDemo);
	cpfInput$.val(cpfDemo);
	senhaInput$.val(senhaDemo);
}

function salvaConfiguracao(formulario) {
	var $configForm = $(formulario);

	if (!$configForm[0].checkValidity()) {
		$('#salva-configuracao').click();
	}

	var urlServidor = $('#urlTextInput').val();
	var cpfUsuario = $('#cpfTextInput').val();
	cpfUsuario = cpfUsuario.replace(new RegExp(/[^0-9]/g), '');
	var senha = $('#senhaPassInput').val();
	var nomeUsuario = $('#nomeUsuario').val();
	
	if (localStorage.usuErro == "true"){
		if (localStorage.cpfUsuarioValido != cpfUsuario) {
			incluiUsuario (cpfUsuario, senha, nomeUsuario);
		}else{
			atualizaUsuario (cpfUsuario, senha, nomeUsuario, localStorage.usuId);
		};
		localStorage.usuErro = "false";
	};

	executaLogin(urlServidor, cpfUsuario, senha, "true");
};

function executaLogin(urlServidor, cpfUsuario, senha, inicialLogin) {
	var metodoLogin = "/rest/usuario/login";

	cpfUsuario = cpfUsuario.replace(new RegExp(/[^0-9]/g), '');

	var urlFinal = urlServidor + metodoLogin + "?cpf=" + cpfUsuario + "&senha="
			+ senha;
	console.log ("executando login");
	var resultado = "";
	$('.msg-sucesso, .msg-erro').remove();
	$(function(){
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/login?usuario=" + cpfUsuario + "&senha=" + senha,
			contentType : "application/json; charset=utf-8",
			async: false,
			dataType : 'json'
		})
	  	.done(function( data ) {
       		if (localStorage.device == "mobile"){
       			alert("Login executado com sucesso!");		
       		}else{
       			console.log("Login executado com sucesso!");
       		};
			localStorage.urlServidor = urlServidor;
			localStorage.cpfUsuario = cpfUsuario;
			localStorage.cpfUsuarioValido = cpfUsuario;
			cpfUsuario = cpfUsuario.replace(new RegExp(/[^0-9]/g), '');
			localStorage.senha = senha;

			localStorage.nomeUsuario = data.usu.nome;
			localStorage.usuAdm = data.usu.administrador;
			localStorage.usuDistribuidor = data.usu.distribuidor;
			localStorage.usuId = data.usu.id;
			
			resultado = "true";
			localStorage.usuErro = "false";
			$(".cadastroUsuario").hide();
			$(".cadastroUsuario").prop('required',false);
			$('#configForm')
					.append(
							"<span class='msg-sucesso'>Configurações salvas com sucesso</span>");
	  	})
        .fail(function(data) {
			localStorage.urlServidor = urlServidor;
			localStorage.cpfUsuario = cpfUsuario;
			cpfUsuario = cpfUsuario.replace(new RegExp(/[^0-9]/g), '');
			localStorage.senha = senha;
			
       		if (localStorage.device == "mobile"){
       			alert("Não foi possível executar login.");		
       		}else{
    			console.log("Não foi possível executar login.");
       		};

			$('#configForm')
					.append(
							"<span class='msg-erro'>Usuario ou senha invalido, corrija seus dados para que seja incluido</span>");
			$(".cadastroUsuario").show();
			localStorage.usuErro = "true";
			$(".cadastroUsuario").prop('required',true);
			if (inicialLogin != "true"){
				document.location.replace("config.html");
			};
			resultado = "false";
			
        })
       	.always(function(data) {
       	});
   	});
	
	return resultado;
}

function incluiUsuario (cpfUsuario, senha, nomeUsuario) {
	var new_usuario = 
		'{' +
			  '"usu" : {' +
			    '"id" : "",' +
			    '"usuario" : "' + cpfUsuario + '",' +
			    '"nome" : "' + nomeUsuario + '",' +
			    '"senha" : "' + senha + '",' +
			    '"administrador" : "false",' +
			    '"distribuidor" : "false",' +
			    '"documento" : {' +
			      '"numero" : "' + cpfUsuario + '",' +
			      '"valor" : "CPF",' +
			      '"tipo" : [{' +
			          '"label" : "CPF",' +
			          '"mascara" : "xxx.xxx.xxx-xx"' +
			        '}, {' +
			          '"label" : "RG",' +
			          '"mascara" : "xxxxxxxxxx"' +
			        '}, {' +
			          '"label" : "Passaporte",' +
			          '"mascara" : "xxxxxxxxxx"' +
			        '}]' +
			    '}' +
			 '}' +
			'}';
	objJson = JSON.parse(new_usuario);
	$.ajax({
		type: "POST",
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/incluir/usuario",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data : JSON.stringify(objJson)
	})
	.done(function( data ) {
		console.log ("inclusão usuario saiu por done");
	})
	.fail(function(data) {
		console.log ("inclusão usuario saiu por fail");
	})
	.always(function(data) {
		incluiDiagrama("Pessoal", nomeUsuario, true)
		setTimeout('history.go()',200);
		document.location.replace("metis.html");
	});	
}
function atualizaUsuario (cpfUsuario, senha, nomeUsuario) {
	console.log ("atualiza usuario");
};

