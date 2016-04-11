/* Documento  */
$(document).ready(function() {   
    executaLogin(localStorage.urlServidor, localStorage.usuario, localStorage.senha);
	var url   = window.location.search.replace();
	var parametrosUrl = url.split("?")[1];
	var idModelo = parametrosUrl.split("&")[0];
	var modelo = parametrosUrl.split("&")[1];
	var key = parametrosUrl.split("&")[2];
	var idDiagrama = parametrosUrl.split("&")[3];
	var panel = parametrosUrl.split("&")[4];
	
	var text = "";
	var color = "white"
	

	$(function(){
		$.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter?id=" + idModelo,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            async:false,
            success: function(data) {
	            localStorage.setItem("dadosSaved", JSON.stringify(data));
        		montaCabecalho(data.documento.header, idModelo, "false", "");
        		// formata campos texto
        		$('input[type="text"]').textinput().trigger('create');
        		// formata campos select
        		$('.fieldcontain').fieldcontain().trigger('create');
				var panelLabelList = [];
				$('.titulo-habilidade').html(data.documento.modelo);
				if (data.documento.header[0].valor){
					text = data.documento.header[0].valor;
				};
				if (data.documento.header[1].valor){
					color = data.documento.header[1].valor;
				};
				$.each(data.documento.panel, function(i, panel){
					var panelId = panel.label.replace( /\s/g, '' ) + i;
					var panelLabel = panel.label;
					panelLabelList[i] = panel.label;
					inicioPanel(panelId, panelLabel, i, panel);
					$.each(panel.fields, function(z, item){
						montaCampos(i, panelId, z, item, "detalhes", idModelo, "false", "");
					});
					finalPanel(panelId, panelLabel, i, panel);
				});
			    iniciaSnapper();
			    iniciaAcoes(panelLabelList);        
				inicializaWindow();
            }
		});
	});
	
	// setar acao para botao submit
	$( ".submitButton" ).bind( "click", function(event, ui) {
		var dataSaved = localStorage.getItem("dadosSaved");
		var objJson = JSON.parse(dataSaved);
		if (objJson.documento.header[0].valor == "criaHabilidades"){
			criaHabllidades(key, idDiagrama, panel)
		}else{		
			if (objJson.documento.header[0].valor == "criaLink"){
				criaLinkHabllidades(key, idDiagrama, panel)
			}else{		
				if (objJson.documento.header[0].valor == "criaCarreiras"){
					criaCarreiras(key, idDiagrama, panel)
				}else{		
					if (objJson.documento.header[0].valor == "criaGrupos"){
						criaGrupos()
					}else{		
						if (objJson.documento.header[0].valor == "criaTudo"){
							criaGrupos();
							criaHabllidades(key, idDiagrama, panel);
							criaLinkHabllidades(key, idDiagrama, panel);
							criaCarreiras(key, idDiagrama, panel);
						}else{		
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
					    	   atualizaNode(data.responseText, key, idDiagrama, panel, objJson.documento.header[0].valor, objJson.documento.header[1].valor);
					    	   $(window.document.location).attr('href','metis.html');
					       	})
						}
					}
				}
			}
		};
	});	
});

function criaGrupos() {
	
	var montagemGruposAreas = '[' +
	'{"key" : "Administração de empresas","text" :"Administração de empresas","color" :"aqua","isGroup" : "true"},'  +
//	'{"key" : "Ciências contábeis","text" :"Ciências contábeis","color" :"aqua","isGroup" : "true"},'  +
	'{"key" : "Direito","text" :"Direito","color" :"aqua","isGroup" : "true"},'  +
	'{"key" : "Economia","text" :"Economia","color" :"aqua","isGroup" : "true"},'  +
	'{"key" : "Matemática ","text" :"Matemática ","color" :"aqua","isGroup" : "true"},'  +
	'{"key" : "Tecnologia da informação","text" :"Tecnologia da informação","color" :"aqua","isGroup" : "true"},'  +
	'{"key" : "Psicologia","text" :"Psicologia","color" :"aqua","isGroup" : "true"},'  +
	'{"key" : "Academica","text" :"Academica","color" :"aqua","isGroup" : "true"},'  +
	'{"key" : "Filosofia","text" :"Filosofia","color" :"aqua","isGroup" : "true"},'  +
	//campos
	'{"key" : "Academia","text" :"Academia","color" :"aquamarine","group":"Academica","isGroup" : "true"},'  +
	'{"key" : "Administração geral","text" :"Administração geral","color" :"aquamarine","group":"Administração de empresas","isGroup" : "true"},'  +
	'{"key" : "Comercial","text" :"Comercial","color" :"aquamarine","group":"Administração de empresas","isGroup" : "true"},'  +
	'{"key" : "Empreendedorismo","text" :"Empreendedorismo","color" :"aquamarine","group":"Administração de empresas","isGroup" : "true"},'  +
	'{"key" : "Estratégia","text" :"Estratégia","color" :"aquamarine","group":"Administração de empresas","isGroup" : "true"},'  +
	'{"key" : "Finanças","text" :"Finanças","color" :"aquamarine","group":"Administração de empresas","isGroup" : "true"},'  +
	'{"key" : "Logística","text" :"Logística","color" :"aquamarine","group":"Administração de empresas","isGroup" : "true"},'  +
	'{"key" : "Marketing","text" :"Marketing","color" :"aquamarine","group":"Administração de empresas","isGroup" : "true"},'  +
	'{"key" : "Recursos humanos","text" :"Recursos humanos","color" :"aquamarine","group":"Administração de empresas","isGroup" : "true"},'  +
	'{"key" : "Contabilidade","text" :"Contabilidade","color" :"aquamarine","group":"Ciências contábeis","isGroup" : "true"},'  +
	'{"key" : "Direito Civil","text" :"Direito Civil","color" :"aquamarine","group":"Direito","isGroup" : "true"},'  +
	'{"key" : "Direito Comercial","text" :"Direito Comercial","color" :"aquamarine","group":"Direito","isGroup" : "true"},'  +
	'{"key" : "Direito constitucional","text" :"Direito constitucional","color" :"aquamarine","group":"Direito","isGroup" : "true"},'  +
	'{"key" : "Direito trabalhista","text" :"Direito trabalhista","color" :"aquamarine","group":"Direito","isGroup" : "true"},'  +
	'{"key" : "Direito tributário","text" :"Direito tributário","color" :"aquamarine","group":"Direito","isGroup" : "true"},'  +
	'{"key" : "Regulações setoriais","text" :"Regulações setoriais","color" :"aquamarine","group":"Direito","isGroup" : "true"},'  +
	'{"key" : "Análise economica","text" :"Análise economica","color" :"aquamarine","group":"Economia","isGroup" : "true"},'  +
	'{"key" : "Economia comportamental","text" :"Economia comportamental","color" :"aquamarine","group":"Economia","isGroup" : "true"},'  +
	'{"key" : "Ética","text" :"Ética","color" :"aquamarine","group":"Filosofia","isGroup" : "true"},'  +
	'{"key" : "Cálculo","text" :"Cálculo","color" :"aquamarine","group":"Matemática ","isGroup" : "true"},'  +
	'{"key" : "Estatística","text" :"Estatística","color" :"aquamarine","group":"Matemática ","isGroup" : "true"},'  +
	'{"key" : "Psicologia do trabalho","text" :"Psicologia do trabalho","color" :"aquamarine","group":"Psicologia","isGroup" : "true"},'  +
	'{"key" : "Psicologia Freudiana","text" :"Psicologia Freudiana","color" :"aquamarine","group":"Psicologia","isGroup" : "true"},'  +
	'{"key" : "Computação geral","text" :"Computação geral","color" :"aquamarine","group":"Tecnologia da informação","isGroup" : "true"},'  +
	'{"key" : "Infra estrutura tecnológica","text" :"Infra estrutura tecnológica","color" :"aquamarine","group":"Tecnologia da informação","isGroup" : "true"},'  +
	'{"key" : "Programação e Desenvolvimento ","text" :"Programação e Desenvolvimento ","color" :"aquamarine","group":"Tecnologia da informação","isGroup" : "true"},'  +
	'{"key" : "Sistemas e plataformas","text" :"Sistemas e plataformas","color" :"aquamarine","group":"Tecnologia da informação","isGroup" : "true"},'  +
	// categoria
	'{"key" : "Análises estratégicas","text" :"Análises estratégicas","color" :"greenyellow","group":"Estratégia","isGroup" : "true"},'  +
	'{"key" : "Bases de dados","text" :"Bases de dados","color" :"greenyellow","group":"Sistemas e plataformas","isGroup" : "true"},'  +
	'{"key" : "Contabilidade Bancária","text" :"Contabilidade Bancária","color" :"greenyellow","group":"Contabilidade","isGroup" : "true"},'  +
	'{"key" : "Contabilidade empresarial","text" :"Contabilidade empresarial","color" :"greenyellow","group":"Contabilidade","isGroup" : "true"},'  +
	'{"key" : "Contabilidade financeira","text" :"Contabilidade financeira","color" :"greenyellow","group":"Contabilidade","isGroup" : "true"},'  +
	'{"key" : "Contabilidade Pessoal","text" :"Contabilidade Pessoal","color" :"greenyellow","group":"Contabilidade","isGroup" : "true"},'  +
	'{"key" : "Contratos","text" :"Contratos","color" :"greenyellow","group":"Direito Comercial","isGroup" : "true"},'  +
	'{"key" : "Decisão estratégica","text" :"Decisão estratégica","color" :"greenyellow","group":"Estratégia","isGroup" : "true"},'  +
	'{"key" : "Definição de pessoas","text" :"Definição de pessoas","color" :"greenyellow","group":"Direito Civil","isGroup" : "true"},'  +
	'{"key" : "Direito falimentar","text" :"Direito falimentar","color" :"greenyellow","group":"Direito Comercial","isGroup" : "true"},'  +
	'{"key" : "Direito societário","text" :"Direito societário","color" :"greenyellow","group":"Direito Comercial","isGroup" : "true"},'  +
	'{"key" : "Ética aplicada","text" :"Ética aplicada","color" :"greenyellow","group":"Ética","isGroup" : "true"},'  +
	'{"key" : "Finanças comportamentais","text" :"Finanças comportamentais","color" :"greenyellow","group":"Economia comportamental","isGroup" : "true"},'  +
	'{"key" : "Finanças corporativas","text" :"Finanças corporativas","color" :"greenyellow","group":"Finanças","isGroup" : "true"},'  +
	'{"key" : "Finanças e controle","text" :"Finanças e controle","color" :"greenyellow","group":"Finanças","isGroup" : "true"},'  +
	'{"key" : "Gestão de instituição financeira","text" :"Gestão de instituição financeira","color" :"greenyellow","group":"Administração geral","isGroup" : "true"},'  +
	'{"key" : "Gestão de marketing","text" :"Gestão de marketing","color" :"greenyellow","group":"Marketing","isGroup" : "true"},'  +
	'{"key" : "Gestão de projetos","text" :"Gestão de projetos","color" :"greenyellow","group":"Administração geral","isGroup" : "true"},'  +
	'{"key" : "Gestão de recursos humanos","text" :"Gestão de recursos humanos","color" :"greenyellow","group":"Recursos humanos","isGroup" : "true"},'  +
	'{"key" : "Gestão hospitalar","text" :"Gestão hospitalar","color" :"greenyellow","group":"Administração geral","isGroup" : "true"},'  +
	'{"key" : "Governança corporativa","text" :"Governança corporativa","color" :"greenyellow","group":"Administração geral","isGroup" : "true"},'  +
	'{"key" : "Implementação de sistemas","text" :"Implementação de sistemas","color" :"greenyellow","group":"Infra estrutura tecnológica","isGroup" : "true"},'  +
	'{"key" : "Inovação","text" :"Inovação","color" :"greenyellow","group":"Empreendedorismo","isGroup" : "true"},'  +
	'{"key" : "Inteligência competitiva","text" :"Inteligência competitiva","color" :"greenyellow","group":"Marketing","isGroup" : "true"},'  +
	'{"key" : "Investimentos","text" :"Investimentos","color" :"greenyellow","group":"Finanças","isGroup" : "true"},'  +
	'{"key" : "Liderança corporativa","text" :"Liderança corporativa","color" :"greenyellow","group":"Recursos humanos","isGroup" : "true"},'  +
	'{"key" : "Linguagens de programação","text" :"Linguagens de programação","color" :"greenyellow","group":"Programação e Desenvolvimento ","isGroup" : "true"},'  +
	'{"key" : "Macro economia","text" :"Macro economia","color" :"greenyellow","group":"Análise economica","isGroup" : "true"},'  +
	'{"key" : "Matemática financeira","text" :"Matemática financeira","color" :"greenyellow","group":"Finanças","isGroup" : "true"},'  +
	'{"key" : "Micro economia","text" :"Micro economia","color" :"greenyellow","group":"Análise economica","isGroup" : "true"},'  +
	'{"key" : "Monografias","text" :"Monografias","color" :"greenyellow","group":"Academia","isGroup" : "true"},'  +
	'{"key" : "Negociações","text" :"Negociações","color" :"greenyellow","group":"Comercial","isGroup" : "true"},'  +
	'{"key" : "Novos negócios","text" :"Novos negócios","color" :"greenyellow","group":"Empreendedorismo","isGroup" : "true"},'  +
	'{"key" : "Operações","text" :"Operações","color" :"greenyellow","group":"Administração geral","isGroup" : "true"},'  +
	'{"key" : "Organização empresarial","text" :"Organização empresarial","color" :"greenyellow","group":"Recursos humanos","isGroup" : "true"},'  +
	'{"key" : "Propaganda","text" :"Propaganda","color" :"greenyellow","group":"Marketing","isGroup" : "true"},'  +
	'{"key" : "Psicologia comportamental","text" :"Psicologia comportamental","color" :"greenyellow","group":"Psicologia do trabalho","isGroup" : "true"},'  +
	'{"key" : "Publicidade","text" :"Publicidade","color" :"greenyellow","group":"Marketing","isGroup" : "true"},'  +
	'{"key" : "Regulação bancária","text" :"Regulação bancária","color" :"greenyellow","group":"Regulações setoriais","isGroup" : "true"},'  +
	'{"key" : "Relacionamento com clientes","text" :"Relacionamento com clientes","color" :"greenyellow","group":"Comercial","isGroup" : "true"},'  +
	'{"key" : "Sistemas de negociação","text" :"Sistemas de negociação","color" :"greenyellow","group":"Sistemas e plataformas","isGroup" : "true"},'  +
	'{"key" : "Soft Skills","text" :"Soft Skills","color" :"greenyellow","group":"Administração geral","isGroup" : "true"},'  +
	'{"key" : "Sustentabilidade","text" :"Sustentabilidade","color" :"greenyellow","group":"Administração geral","isGroup" : "true"},'  +
	'{"key" : "Teoria da administração","text" :"Teoria da administração","color" :"greenyellow","group":"Administração geral","isGroup" : "true"},'  +
	'{"key" : "Teoria do desenvolvimento econômico","text" :"Teoria do desenvolvimento econômico","color" :"greenyellow","group":"Análise economica","isGroup" : "true"},'  +
	'{"key" : "Teoria dos jogos","text" :"Teoria dos jogos","color" :"greenyellow","group":"Análise economica","isGroup" : "true"},'  +
	'{"key" : "Tomada de decisões","text" :"Tomada de decisões","color" :"greenyellow","group":"Administração geral","isGroup" : "true"},'  +
	'{"key" : "Trading","text" :"Trading","color" :"greenyellow","group":"Finanças","isGroup" : "true"},'  +
	'{"key" : "Tributação","text" :"Tributação","color" :"greenyellow","group":"Direito tributário","isGroup" : "true"},'  +
	'{"key" : "Utilização MS Office","text" :"Utilização MS Office","color" :"greenyellow","group":"Computação geral","isGroup" : "true"}'  +
	']';
	
	var gruposAreas = JSON.parse(montagemGruposAreas);

   	$.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/skill/obter?usuario=YggMap",
        contentType: "application/json; charset=utf-8",
        dataType: 'json'
	})
  	.done(function(dataSkill) {
		$.ajax({
	        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/obter?id=" + dataSkill.skill.skills[0].id,
	        contentType: "application/json; charset=utf-8",
	        dataType: 'json'
		})
		.done(function(dataDiagrama) {
			var i = 0;
	    	while (i < dataDiagrama.documento.diagrama.nodeDataArray.length) {
	    		if (typeof dataDiagrama.documento.diagrama.nodeDataArray[i].isGroup != 'undefined') {
	        		if (dataDiagrama.documento.diagrama.nodeDataArray[i].isGroup) {
	        			dataDiagrama.documento.diagrama.nodeDataArray.splice(i, 1);	
	        			i = i - 1;
	        		};
	    		};
	    		i++;
	    	};
	  		var w = 0;
	  		while (w < gruposAreas.length) {
	  			dataDiagrama.documento.diagrama.nodeDataArray.push	(gruposAreas[w]);
	  			w++;
	  		};
			$.ajax({
				type: "POST",
			       url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/atualizar",
			       contentType: "application/json; charset=utf-8",
			       dataType: 'json',
			       data : JSON.stringify(dataDiagrama)
			})
		  	.done(function( data ) {
				console.info("atualizar skil saiu por done");
		  	})
		    .fail(function(data) {
				console.info("atualizar skil saiu por fail");
		    })
		   	.always(function(data) {
				console.info("atualizar skil saiu por always");
		   	});
	  	})
	    .fail(function(data) {
			console.info("ler diagrama saiu por fail");
	    })
	   	.always(function(data) {
			console.info("ler diagrama saiu por always");
	   	});
  	})
    .fail(function(data) {
		console.info("ler skil saiu por fail");
    })
   	.always(function(data) {
		console.info("ler skil saiu por alwyays");
   	});
};


function criaHabllidades(key, idDiagrama, panel){
	
	var doc_part_1 = '' +
					'{"documento":{"id":"","tipo":"dados","usuarioAtual":"03868171877","modelo":"Habilidades","situacao":"valido","usuarios":[{"codigo":"03868171877"}],';
	var doc_part_2 = 
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Abertura de empresas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Administração de fundos de investimentos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Administração de hospitais e clínicas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Alçadas de decisão"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise da concorrência"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise das contas públicas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise das políticas monetárias e fiscais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de cadeia de valor"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de custos e lucros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de demonstrativos financeiros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de End Game"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de índices financeiros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de valor agregado de projetos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise do ciclo de vida do produto"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise dos agregados de oferta e demanda"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise estrutural "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise fundamentaista"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise macro economica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise quantitativa"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise técnica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Aplicação do Behaviorismo aos negócios "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Apresentações"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Atração/ retenção de clientes"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Avaliação de empresas (precificação de ações)"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Avaliação de opções reais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Basiléia - Cálculos de liquidez e estabilidade de captação"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Basiléia - Cálculos de requerimento de capital "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Bloomberg"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Brainstorming"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"C+"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo da curva a termo de juros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de derivadas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de elasticidade de demanda"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de integrais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de juros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de tributos Estaduais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de tributos federais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de tributos Municipais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo do custo de capital"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Captação a mercado de dívida"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Captação a mercado via ações"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Coaching "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Comunicação"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Consolidação das Leis do trabalho"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Consolidação de resultados"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Construção de consultas em SQL"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Construção de estratégias competitivas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização bancária"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de custos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de IRPF"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de operações de leasing"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de receitas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de resultados"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de seguros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização fiscal"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contar estórias"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contratação de funcionários"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contratos bancários"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de estratégia competitiva"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de estratégias de hedge"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de estratégias de Recursos humanos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de negócio no modelo Lean Start-up"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de novos modelos de negócios"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de sociedades"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação e revisão de processos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Definição de mandatos e cargos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Definição de pessoa jurídica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Desenvolvimento de cronogramas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Desenvolvimento de novos produtos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Design thinking"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Determinação da estrutura de capital"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Determinação de níveis de eficiência"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Divulgação de informações a mercado"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Divulgação de informações regulatórias"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Emissão de novas ações"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Emissão de títulos de dívida"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estatística intermediária"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estrutura psicológica Freudiana"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estruturação de databases em SQL"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estruturação de fundos de investimentos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Ética nos negócios"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Expertise MS Excel"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Expertise MS Powerpoint"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Expertise MS Word"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Financiamento de novos negócios"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Formatação de trabalhos teóricos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Fusões e aquisições"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Fusões e aquisições"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gerência de projeto"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gerênciamento de riscos de projetos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão Contábil"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão da folha de pagamentos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão da sustentabilidade"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de ações"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de ativos imobiliários"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de caixa"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de canais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de comitês"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de comunicação mercadológica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de metas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de produtos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de propaganda e publicidade"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de relacionamento com clientes"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de remuneração e beneficios"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de renda fixa"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"História da administração"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Homebroker"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Influenciando pessoas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Inovação em produtos e serviços"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Inteligência competitiva"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Introdução ao pacote office"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Json"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Materiais institucionais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Modelagem behaviorista de preços "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Modelagem de jogos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Modelo de Solow"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Montagem de demonstrativos financeiros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação de ações"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação de commodities"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação de juros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação de moedas estrangeiras"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Operação de plataformas de negociação"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Organização de eventos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Organogramas funcionais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Otimização de portfolio"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Otimização logística"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Pesquisa mercadológica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Planejamento de projetos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Planejamento estratégico"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Planejamento operacional"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Precificação de derivativos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Precificação de produtos e serviços"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Precificação de títulos de renda fixa"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Principios constitucionais do direito"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Principios da estatística"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Princípios de contabilidade"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Processo falimentar"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Prospecção de mercado"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Psicologia da autoridade"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Psicologia da Liderança"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Reestruturação de passivos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Reestruturação societária"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Relacionamento com órgãos reguladores"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Relacionamento Público"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Relacionamentos profissionais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Relatórios gerenciais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Relatórios para investidores"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Remuneração"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Ruby on rails"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Segmentação de mercado"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Sistemas de informação de mercado"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Técnicas de liderança"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Teoria financeira"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Thomson "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Tomada de decisões Habilidade"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Trabalho e estresse"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Treinamento de recursos humanos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Utilização de fluxos de caixa"},;';

	var arrayDoc_part_2 = doc_part_2.split(";");	
	
	var doc_part_3 = ' ' +
					'{"modelo":"input_select","label":"Cor","valor":"LightYellow","opcoes":[{"label":"aqua"},{"label":"lightblue"},{"label":"lightgreen"},{"label":"azure"},{"label":"LightYellow"},{"label":"blanchedalmond"}]}],"panel":[{"modelo":"swipe","label":"Descrição","fields":[{"modelo":"input_textarea",';
	
	var doc_part_4 = 
		'"label":"Descrição","valor":"Condução do processo burocrático de abertura de uma nova pessoa jurídica"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Viabilizar o funcionamento de um fundo de investimento e gerar as informações necessárias"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Maximizar a eficiência de um hospital "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Estruturação e definição das alçadas de decisões corporativas"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Localizar a empresa estratégicamente frente a seus concorrentes e determinar seus pontos fortes e fracos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Estrat%C3%A9gia"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Determinação da saúde de uma instancia governamental a partir de suas contas"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
		'"label":"Descrição","valor":"Determinação de tendências economicas a partir do conjunto de regras que regem o funcionamento do governo"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
		'"label":"Descrição","valor":"Análise da cadeia de fornecedores e processos e identificação de vantagens e desvantagens competitivas"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Determinação do preço ótimo para maximização do resultado em funçao dos custos marginais de produção (teoria da firma)"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Teoria_da_firma"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
		'"label":"Descrição","valor":"Análise vertical/ horizontal de balanços, DREs e fluxos de caixa"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/An%C3%A1lise_financeira"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Identificar potenciais reações competitivas de uma decisão estratégica"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Criação de índices a partir de informações financeiras e interpretação de seus resultados"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/An%C3%A1lise_financeira"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Dimensionamento dos benefícios e resultados esperados de projetos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Identificar em qual ponto de vida está o produto"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Ciclo_de_vida_do_produto"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Análise da variação de preços em função do equilibrio de oferta e demanda"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Teoria_do_equil%C3%ADbrio_geral"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
		'"label":"Descrição","valor":"Construir o entendimento sobre uma indústria, quais seus riscos e distribuição de poderes"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Estrat%C3%A9gia"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Determinação do preço de uma ação a partir de informações financeiras e de mercado"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/An%C3%A1lise_fundamentalista"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Análise das tendências economicas de um país ou região a partir de dados economicos disponíveis"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Macroeconomia"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
		'"label":"Descrição","valor":"Determinação do preço de um ativo financeiro com base em análises estatisticas de componentes que o influenciam"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://en.wikipedia.org/wiki/Quantitative_analyst"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Determinação do preço de um ativo financeiro a partir do preço do ativo e seu comportamento histórico"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/An%C3%A1lise_t%C3%A9cnica"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Entendimento dos conceitos de behaviorismo aplicados ao trabalho"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Psicologia",;' +
		'"label":"Descrição","valor":"Condução de apresentações utilizando ferramentas de comunicação"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Criação de estratégias para expandir mercados e manter a base de clientes atuais"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Cálculo e análise do valor de uma empresa/ ativos/ projetos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Avalia%C3%A7%C3%A3o_de_empresas"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Cálculo do valor de opções reais"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Avalia%C3%A7%C3%A3o_de_op%C3%A7%C3%B5es_reais"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Cálculo dos índices de NSFR (Net Stable Funding Ratio) e LCR ( Liquidity Coverage Ratio)"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Basileia_III"},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Determinação do índice de basiléia de um banco, a partir do requerimento de capital por ativo ponderado por risco"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Basileia_III"},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Utilização da platafomra e terminais Bloomberg de informações e negociação"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Condução de sessões de criação de ideias e conceitos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Conhecimento básico de programação em C+"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Cálculo da taxa de juros justa para diferentes prazos e vencimentos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Curva_a_termo"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Cálculo de operações derivadas"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Matemática ",;' +
		'"label":"Descrição","valor":"Avaliação da sensibilidade da demanda à variação de preços"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Elasticidade_%28economia%29"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
		'"label":"Descrição","valor":"Cálculo de operações integrais"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Matemática ",;' +
		'"label":"Descrição","valor":"Cálculos de juros simples e juros compostos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Matem%C3%A1tica_financeira"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Determinação de base de cálculo e aliquotas de tributos estaduais"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Direito_tribut%C3%A1rio"},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Determinação de base de cálculo e aliquotas de tributos federais"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Direito_tribut%C3%A1rio"},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Determinação de base de cálculo e aliquotas de tributos municipais"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Direito_tribut%C3%A1rio"},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Determinação do custo de capital de uma empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Custo_do_capital"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Estruturação de operações de captação de recursos por meio de instrumentos de dívida, securitização e híbridos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_de_capitais"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Estruturação de operações de captação de recursos por meio de venda de ações"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_de_capitais"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Acompanhamento individual de colaboradores e apoio ao seu desenvolvimento"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Utilização de melhores práticas e técnicas em comunicações (oral e escrita)"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Utilização dos conceitos e principios das leis trabalhistas brasileiras em vigor na construção de relações de trabalho"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito ",;' +
		'"label":"Descrição","valor":"Consolidação gerencial de demonstrativos de resultados de diversas unidades de negócio em agrupamentos "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Programação de rotinas para consultas a dados em bases de dados SQL"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Definir estratégia geral ou especifica com base em dados de mercado e análises mercadológicas e estratégicas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Estrat%C3%A9gia"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Contabilização de empresas do setor bancário, com suas regras específicas por produto e empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Determinação e alocação dos custos de uma empresa de acordo com conceitos pré determinados"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Determinação do imposto de renda de pessoa física a ser pago ou restituído"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Cálculo e registro de operações de leasing, seus resultados e tributação"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Determinação e alocação das receitas de uma empresa de acordo com conceitos pré determinados"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Determinação do resultado de uma empresa a partir de receitas e custos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Cálculo e registro de operações de seguros"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Determinação das bases de cálculo e impostos a serem pagos por uma empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Utilização de técnicas de contagem de estórias em discursos e apresentações"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Condução de processo de seleção de pessoas, da descrição da vaga à contratação "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Desenvolvimento de contratos de serviços bancários em conforme com as leis"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Definição de jogadas para melhorar a posição competititva da empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Estrat%C3%A9gia_competitiva"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Montagem de estratégias de hedge com swaps, opções, alguel de ações e seguros"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Cobertura_%28finan%C3%A7as%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Desenvolvimento de estratégias de retenção, motivação e aumento de eficiência de funcionários"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Criação de novos negócios com foco na criação do produto em conjunto com clientes"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Lean_startup"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Desenvolvimento de modelos de negócios adaptados a novos produtos, clientes e mercados"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Modelo_de_neg%C3%B3cio"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Definição dos tipo de sociedade que podem se formar em uma Pessoa jurídica"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Determinar passos e atividades necessárias para o atingimento de um fim"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Processo"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Especificação de mandatos de cargos e funções"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Identificação dos requisitos de uma pessoa jurídica"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Criação de planos de metas e definição do tempo necessário ao cumprimento das atividades ligadas a um projeto"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Criação de soluções (produtos e serviços) para demandas identificadas"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Aplicação de conceitos de inovação e design para solução de problemas"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Otimização do valor de uma empresa a partir da composição de seu financiamento e políticas de dividendos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Custo_do_capital"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Ajustar processos e recursos para a entrega de um nível de eficiência planejado"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Conhecimento das normas de divulgação de informação e transparência para investidores de mercado (CVM/ Bolsas de valor)"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Conhecimento das normas de divulgação de informação de bancos para BACEN e outros órgãos reguladores"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Revisão do contrato social para emissão de novas ações"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Criação de contratos para a emissão de instrumentos de dívida corporativa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Testes de hipótese, significancia estatística, análise de resíduos e de variância"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Matemática ",;' +
		'"label":"Descrição","valor":"Entendimento dos conceitos de Ego, supergo, id. "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Psicologia",;' +
		'"label":"Descrição","valor":"Desenho e implementação de databases em SQL"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Criaçãode contratos e documentos para o registro e funcionamento de fundos de investimentos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Conhecimento de valores para condução profissional ética "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Filosofia",;' +
		'"label":"Descrição","valor":"Nível avançado de MS Excel - VBA, tabelas dinâmicas, fórmulas matriciais"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Nível avançado de Powerpoint - animações, links com arquivos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Nível avançado de MS Word - índices, links com arquivos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Captação de recursos para viabilizar empresas até que essas gerem caixa para suportar as operações"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Utilização das regras da ABNT para formatação de trabalhos academicos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Academica",;' +
		'"label":"Descrição","valor":"Estruturação jurídica de operação de compra e venda de empresas ou ativos corporativos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Estruturação de operações de compra ou venda de empresas ou ativos de empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Fus%C3%A3o_%28direito%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Gestão de todo o processo de um projeto, incluindo custos, qualidade, recursos humanos e comunicações"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Identificação de obstáculos e riscos de projetos e definição de ações de mitigação dos mesmos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Lançamento de notas fiscais, geração de demonstrativos, controle de contas a pagar/ receber"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Controle e cálculos de valores para pagamentos de salários e benefícios a funcionários"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Reduzir ao máximo os impactos ambientais e maximizar os sociais de uma operação"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Sustentabilidade"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Gestão de portfólio de ações, execução de operações de compra e venda "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/A%C3%A7%C3%A3o_%28finan%C3%A7as%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Gestão de carteira de ativos imobiliários, execução de compra e venda de ativos e títulos de dívida lastreados em imóveis"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Análise da disponibilidade de caixa, projeção de sua geração e necessidades de financiamento "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Cash_management"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Definição dos canais a serem empregados pela empresa para entregar seus produtos e serviços"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Distribui%C3%A7%C3%A3o_%28log%C3%ADstica%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Organização e condução de comitês e conselhos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Controle dos canais de comunicação e mensagens a serem enviadas aos clientes, fornecedores e mercado em geral"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Comunica%C3%A7%C3%A3o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Definição e acompanhamento de metas de cargos e funções"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Gestão mercadológica dos produtos, levando em consideração seus atributos, o mercado, canais e concorrentes"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Produto_%28marketing%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Desenvolvimento de campanhas de comunicação e propagandas institucionais ou de produtos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Propaganda"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Manutenção de relacionamento com clientes com objetivo de maximizar vendas e capacidade de atendimento"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Estudos de mercado sobre remuneração  e benefícios"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Gestão de carteira de renda fixa, execução de compra e venda de ativos "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Renda_fixa"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Entender a evolução do estudo da organização humana (Fordismo, toyotismo, maslow)"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Administra%C3%A7%C3%A3o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Utilização de plataformas de negociação de ações (homebrokers)"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Utilização de técnicas de influência em relacionamentos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Identificação de lacunas de mercados ou criação de novas soluções para problemas e transformação de oportunidades em produtos ou serviços "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Inova%C3%A7%C3%A3o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Coleta de dados sobre desempenho de produtos concorrentes em um mercado e análise das preferências dos consumidores"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Introdução às funcionalidades de MS Excel, powerpoint, Word e outlook"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Conhecimento básico de programação em Json"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Criação de materiais de divulgação institucional"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Determinação de preços de ativos com base em comportamentos de agentes de mercado"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Economia_comportamental"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
		'"label":"Descrição","valor":"Estruturação de situações conforme a teoria dos jogos e análise dos possíveis resultados"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Teoria_dos_jogos"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
		'"label":"Descrição","valor":"Avaliação da capacidade de crescimento de uma economia a partir dos componentes de capital, mão de obra e tecnologia"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Modelo_de_Solow"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
		'"label":"Descrição","valor":"Fechamento de demonstrativos financeiros de um período de atividade da empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Utilização de conceitos de negociação para maximização de resultados"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Negocia%C3%A7%C3%A3o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Compra e venda de ações para clientes ou empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_financeiro"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Compra e venda de commodities e futuros para clientes ou empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_financeiro"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Compra e venda de títulos de dívida e seus derivativos para clientes ou empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_financeiro"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Compra e venda de moedas estrangeiras e seus derivativos para clientes ou empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_financeiro"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Utilização de plataformas de negociação de ativos financeiros"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Organização de eventos "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Criação de mapas de cargos e funções"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Determinação do portfolio eficiente de mercado"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Teoria_moderna_do_portf%C3%B3lio"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Redução dos custos e aumento da qualidade na movimentação de mercadorias"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Coleta de dados sobre produtos e desejos dos consumidores e interpretação dos dados"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Desenvolvimento de planos de projetos, incluindo Escopos, objetivos, cronogramas, orçamentos e avaliação do esforço necessário."},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Desenvolvimento de objetivos de curto e médio prazo e identificação de ações necessárias a seu atingimento"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Planejamento_estrat%C3%A9gico"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Calcular a quantidade de recursos necessários a uma operação"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Planejamento_operacional"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Cálculo do preço de opções de compra e venda (black and scholes), taxa de aluguel de ações "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Derivativo"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Definição do preço com base na disponibilidade a pagar dos consumidores por atributos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Pre%C3%A7o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Cálculo do preço de títulos públicos e de dívida corporativa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Principios do direito brasileiro"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Conceitos de média, mediana, moda, cálculo de desvio padrão, distribuição normal"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Matemática ",;' +
		'"label":"Descrição","valor":"Conceito de ativo, passivo, contas T, demonstrativos contábeis"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
		'"label":"Descrição","valor":"Coordenação do processo falimentar, definição do tipo de pedido de falência "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Pesquisa e contato com novos clientes, fornacedores e parceiros"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Compreensão dos conceitos psicológicos da autoridade, consequências principais e suas aplicações"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Psicologia",;' +
		'"label":"Descrição","valor":"Compreensão dos conceitos psicológicos da Liderança e sua aplicação"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Psicologia",;' +
		'"label":"Descrição","valor":"Renegociação de dívidas para readequação dos fluxos de pagamentos à geração de caixa da empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Turnaround_%28administra%C3%A7%C3%A3o%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Mudança da composição acionária de uma empresa em estado falimentar, em conjunto com credores"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Turnaround_%28administra%C3%A7%C3%A3o%29"},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
		'"label":"Descrição","valor":"Atendimento a demandas e gestão de relacionamento com órgãos regulatórios"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Criação de estratégias de exposição de marca e de identidade corporativa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Entendimento das necessidades e utilização de comunicação efeitva para melhora do posicionamento pessoal profissional"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Criação de relatórios e demonstrativos gerenciais, de acordo com normas corporativas internas "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Produção de informações visando o atendimento a investidores "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Especificação de pacotes de remuneração para cargos e funções"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Conhecimento básico de programação em Ruby on Rails"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Criação de segmentos de clientes e definição de suas características"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Segmenta%C3%A7%C3%A3o_de_mercado"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Utilização de sistemas de informação (Factiva, etc.)"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Utilização de técnicas de liderança para motivação"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Risco vs. Retorno, Portfolio eficiente, CAPM, Eficiência de mercado"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Finan%C3%A7as"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Utilização da platafomra Thomson de informações"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
		'"label":"Descrição","valor":"Utilização de ferramentas e modelos psicológicos para melhora da capacidade de tomada de decisões"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Entendimento do impacto do trabalho e do estresse na psique humana"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Psicologia",;' +
		'"label":"Descrição","valor":"Identificação de necessidade e criação de programas de capacitação de funcionários"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Treinamento"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
		'"label":"Descrição","valor":"Construção e cálculos de fluxos de caixa, pagamentos, prazos, taxas, valor presente"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Matem%C3%A1tica_financeira"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;';

	var arrayDoc_part_4 = doc_part_4.split(";");
		
	var doc_part_5 = 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise econômica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise econômica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise econômica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise econômica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise econômica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Psicologia do trabalho",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Sistemas e plataformas",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Programação e Desenvolvimento ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Cálculo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise econômica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Cálculo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito tributário",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito tributário",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito tributário",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito trabalhista",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Sistemas e plataformas",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Civil",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Regulações setoriais",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estatística",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Psicologia Freudiana",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Infra estrutura tecnológica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Ética ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Computação geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Computação geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Computação geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Academia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Sistemas e plataformas",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Computação geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Programação e Desenvolvimento ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Economia comportamental",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise econômica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise econômica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Logística",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito constitucional",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estatística",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Psicologia do trabalho",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Psicologia do trabalho",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Programação e Desenvolvimento ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Sistemas e plataformas",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Sistemas e plataformas",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Psicologia do trabalho",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;';

	var arrayDoc_part_5 = doc_part_5.split(";");
	
	var doc_part_6 = 
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Novos negócios",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de instituição financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão hospitalar",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Governança corporativa",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Análises estratégicas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Macro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Macro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Inteligência competitiva",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Micro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Análises estratégicas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Análises estratégicas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Micro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Análises estratégicas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Macro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Psicologia comportamental",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Soft Skills",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade Bancária",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade Bancária",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Sistemas de negociação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Soft Skills",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Linguagens de programação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Cálculo",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Micro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Cálculo",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Matemática financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Tributação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Tributação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Tributação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças e controle",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Soft Skills",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito trabalhista",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças e controle",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Bases de dados",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Decisão estratégica",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade Pessoal",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Soft Skills",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contratos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Novos negócios",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Novos negócios",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Operações",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Organização empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Definição de pessoas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Inovação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Operações",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade Bancária",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Regulação bancária",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Estatística",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Psicologia Freudiana",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Implementação de sistemas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Ética aplicada",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Utilização MS Office",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Utilização MS Office",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Utilização MS Office",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Novos negócios",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Monografias",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Sustentabilidade",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Governança corporativa",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Organização empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Relacionamento com clientes",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Teoria da administração",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Sistemas de negociação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Soft Skills",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Inovação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Utilização MS Office",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Linguagens de programação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Propaganda",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças comportamentais",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Teoria dos jogos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Teoria do desenvolvimento econômico",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Negociações",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Publicidade",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Organização empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Logística",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Decisão estratégica",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Operações",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito constitucional",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Estatística",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito falimentar",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Relacionamento com clientes",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Psicologia comportamental",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Psicologia comportamental",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Governança corporativa",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Publicidade",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Soft Skills",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças e controle",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças e controle",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Organização empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Linguagens de programação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Sistemas de negociação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Liderança corporativa",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Sistemas de negociação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Tomada de decisões",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Psicologia comportamental",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Matemática financeira",;';

	var arrayDoc_part_6 = doc_part_6.split(";");

	var doc_part_7 = ' ' +
					'"opcoes":[{"label":"Finanças Corporativas"},{"label":"Trading"},{"label":"Investimentos"},{"label":"Gestão de Recursos Humanos"},{"label":"Gestão de Marketing"},{"label":"Inovação"},{"label":"Novos Negócios"},{"label":"Análise Estratégica"}]}]}]}}';
	

	var i = 0;

	while (i < arrayDoc_part_4.length) {
		var objJson = JSON.parse(doc_part_1 + arrayDoc_part_2[i]  + doc_part_3 + arrayDoc_part_4[i] + arrayDoc_part_5[i] + arrayDoc_part_6[i] + doc_part_7);
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
			$.ajax({
	            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter?id=" + data.responseText,
	            contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            async:false
			})
		  	.done(function( data ) {
		  		var objDiagrama = JSON.parse(localStorage.getItem("diagrama-0"));
		  		var node = JSON.parse(
	   					'{' +
			            '"key" : "' + data.documento.header[0].valor + '",' +
			            '"text" : "' + data.documento.header[0].valor + '",' +
			            '"color" : "LightYellow",' +
			            '"group" : "' + data.documento.panel[0].fields[4].valor + '",' +
			            '"id" : "' + data.documento.id + '"' +
	          			'}');
		   		objDiagrama.documento.diagrama.nodeDataArray.push(node);
		   		localStorage.setItem("diagrama-0", JSON.stringify(objDiagrama));
		   		atualizaNode(data.documento.id, key, idDiagrama, panel, data.documento.header[0].valor, data.documento.header[1].valor, true);
		  	})
		    .fail(function(data) {
		    	console.log ("obter documento saiu por fail");
		    })
		   	.always(function(data) {
		   		console.log ("obter documento saiu por always");
		   	});
	   	});
		i++;
	};
};

function criaLinkHabllidades(key, idDiagrama, panel){	
	var doc_link =
		'{"from" : "Algebra","to" : "Cálculo de juros"};' + 
		'{"from" : "Análise da concorrência","to" : "Criação de estratégia competitiva"};' + 
		'{"from" : "Análise da concorrência","to" : "Gestão de produtos"};' + 
		'{"from" : "Análise da concorrência","to" : "Gestão de canais"};' + 
		'{"from" : "Análise da concorrência","to" : "Gestão de canais"};' + 
		'{"from" : "Análise de demonstrativos financeiros","to" : "Análise de índices financeiros"};' + 
		'{"from" : "Análise de demonstrativos financeiros","to" : "Gestão de caixa"};' + 
		'{"from" : "Análise de demonstrativos financeiros","to" : "Avaliação de empresas (precificação de ações)"};' + 
		'{"from" : "Análise de valor agregado de projetos","to" : "Planejamento de projetos"};' + 
		'{"from" : "Análise fundamentalista","to" : "Negociação de ações"};' + 
		'{"from" : "Análise macro economica","to" : "Negociação de moedas estrangeiras"};' + 
		'{"from" : "Análise macro economica","to" : "Análise das contas públicas"};' + 
		'{"from" : "Análise macro economica","to" : "Análise das políticas monetárias e fiscais"};' + 
		'{"from" : "Análise mercadológica","to" : "Inteligência competitiva"};' + 
		'{"from" : "Análise mercadológica","to" : "Precificação de produtos e serviços"};' + 
		'{"from" : "Análise mercadológica","to" : "Criação de estratégia competitiva"};' + 
		'{"from" : "Análise mercadológica","to" : "Gestão de produtos"};' + 
		'{"from" : "Análise mercadológica","to" : "Gestão de canais"};' + 
		'{"from" : "Análise mercadológica","to" : "Gestão de comunicação mercadológica"};' + 
		'{"from" : "Análise mercadológica","to" : "Gestão de propaganda e publicidade"};' + 
		'{"from" : "Análise mercadológica","to" : "Segmentação de mercado"};' + 
		'{"from" : "Análise quantitativa","to" : "Negociação de ações"};' + 
		'{"from" : "Análises economicas","to" : "Construção de estratégias competitivas"};' + 
		'{"from" : "Análises economicas","to" : "Planejamento estratégico"};' + 
		'{"from" : "Análises estratégicas","to" : "Construção de estratégias competitivas"};' + 
		'{"from" : "Análises estratégicas","to" : "Planejamento estratégico"};' + 
		'{"from" : "Apresentações","to" : "Contar estórias"};' + 
		'{"from" : "Avaliação de empresas","to" : "Captação a mercado de dívida"};' + 
		'{"from" : "Avaliação de empresas","to" : "Captação a mercado via ações"};' + 
		'{"from" : "Avaliação de empresas","to" : "Fusões e aquisições"};' + 
		'{"from" : "Avaliação de empresas","to" : "Negociação de ações"};' + 
		'{"from" : "Avaliação de empresas","to" : "Gestão de ações"};' + 
		'{"from" : "Avaliação de empresas","to" : "Análise fundamentaista"};' + 
		'{"from" : "Avaliação de empresas","to" : "Análise quantitativa"};' + 
		'{"from" : "Avaliação de empresas","to" : "Modelagem behaviorista de preços"};' + 
		'{"from" : "Brainstorming","to" : "Design thinking"};' + 
		'{"from" : "Cálculo da curva a termo de juros","to" : "Precificação de títulos de renda fixa"};' + 
		'{"from" : "Cálculo da curva a termo de juros","to" : "Negociação de juros"};' + 
		'{"from" : "Cálculo de juros","to" : "Utilização de fluxos de caixa"};' + 
		'{"from" : "Cálculo de juros","to" : "Cálculo da curva a termo de juros"};' + 
		'{"from" : "Cálculo do custo de capital","to" : "Avaliação de empresas (precificação de ações)"};' + 
		'{"from" : "Coaching","to" : "Técnicas de liderança"};' + 
		'{"from" : "Comunicação","to" : "Gerência de projeto"};' + 
		'{"from" : "Comunicação","to" : "Apresentações"};' + 
		'{"from" : "Contabilização bancária","to" : "Basiléia - Cálculos de requerimento de capital "};' + 
		'{"from" : "Contabilização bancária","to" : "Basiléia - Cálculos de liquidez e estabilidade de captação"};' + 
		'{"from" : "Contabilização de custos","to" : "Contabilização de resultados"};' + 
		'{"from" : "Contabilização de custos","to" : "Contabilização fiscal"};' + 
		'{"from" : "Contabilização de receitas","to" : "Contabilização de operações de leasing"};' + 
		'{"from" : "Contabilização de receitas","to" : "Contabilização fiscal"};' + 
		'{"from" : "Contabilização de resultados","to" : "Contabilização bancária"};' + 
		'{"from" : "Contabilização fiscal","to" : "Contabilização bancária"};' + 
		'{"from" : "Criação de novos modelos de negócios","to" : "Criação de negócio no modelo Lean Start-up"};' + 
		'{"from" : "Criação de sociedades","to" : "Reestruturação societária"};' + 
		'{"from" : "Criação e revisão de processos","to" : "Determinação de níveis de eficiência"};' + 
		'{"from" : "Demonstrativos financeiros","to" : "Análise de demonstrativos financeiros"};' + 
		'{"from" : "Desconto de fluxo de caixa","to" : "Avaliação de opções reais"};' + 
		'{"from" : "Desenvolvimento de cronogramas","to" : "Planejamento de projetos"};' + 
		'{"from" : "Desenvolvimento de novos produtos","to" : "Gestão de produtos"};' + 
		'{"from" : "Determinação da estrutura de capital","to" : "Captação a mercado de dívida"};' + 
		'{"from" : "Determinação da estrutura de capital","to" : "Captação a mercado via ações"};' + 
		'{"from" : "Determinação da estrutura de capital","to" : "Fusões e aquisições"};' + 
		'{"from" : "Determinação da estrutura de capital","to" : "Reestruturação de passivos"};' + 
		'{"from" : "Gerênciamento de riscos de projetos","to" : "Gerência de projeto"};' + 
		'{"from" : "Gestão de caixa","to" : "Reestruturação de passivos"};' + 
		'{"from" : "Gestão de canais","to" : "Gestão de produtos"};' + 
		'{"from" : "Gestão de recursos humanos","to" : "Técnicas de liderança"};' + 
		'{"from" : "Gestão de remuneração e benefícios","to" : "Criação de estratégias de Recursos humanos"};' + 
		'{"from" : "Inovação em produtos e serviços","to" : "Criação de negócio no modelo Lean Start-up"};' + 
		'{"from" : "Introdução ao pacote office","to" : "Expertise MS Excel"};' + 
		'{"from" : "Introdução ao pacote office","to" : "Expertise MS Powerpoint"};' + 
		'{"from" : "Introdução ao pacote office","to" : "Expertise MS Word"};' + 
		'{"from" : "Matemática financeira","to" : "Avaliação de empresas (precificação de ações)"};' + 
		'{"from" : "Modelagem behaviorista de preços","to" : "Análise quantitativa"};' + 
		'{"from" : "Montagem de demonstrativos financeiros","to" : "Consolidação de resultados"};' + 
		'{"from" : "Montagem de demonstrativos financeiros","to" : "Relatórios gerenciais"};' + 
		'{"from" : "Negociação","to" : "Captação a mercado de dívida"};' + 
		'{"from" : "Negociação","to" : "Captação a mercado via ações"};' + 
		'{"from" : "Negociação","to" : "Fusões e aquisições"};' + 
		'{"from" : "Negociação","to" : "Reestruturação de passivos"};' + 
		'{"from" : "Negociação","to" : "Negociação de ações"};' + 
		'{"from" : "Negociação","to" : "Negociação de moedas estrangeiras"};' + 
		'{"from" : "Negociação","to" : "Negociação de juros"};' + 
		'{"from" : "Negociação","to" : "Contratação de funcionários"};' + 
		'{"from" : "Negociação","to" : "Gerência de projeto"};' + 
		'{"from" : "Negociação","to" : "Reestruturação societária"};' + 
		'{"from" : "Negociação, análise macro economica","to" : "Negociação de commodities"};' + 
		'{"from" : "Otimização de portfolio","to" : "Gestão de ações"};' + 
		'{"from" : "Pesquisa mercadológica","to" : "Desenvolvimento de novos produtos"};' + 
		'{"from" : "Planejamento de projetos","to" : "Gerência de projeto"};' + 
		'{"from" : "Planejamento operacional","to" : "Determinação de níveis de eficiência"};' + 
		'{"from" : "Precificação de derivativos","to" : "Avaliação de opções reais"};' + 
		'{"from" : "Precificação de derivativos","to" : "Criação de estratégias de hedge"};' + 
		'{"from" : "Precificação de derivativos","to" : "Negociação de moedas estrangeiras"};' + 
		'{"from" : "Precificação de derivativos","to" : "Negociação de juros"};' + 
		'{"from" : "Precificação de produtos e serviços","to" : "Gestão de produtos"};' + 
		'{"from" : "Precificação de títulos de renda fixa","to" : "Gestão de renda fixa"};' + 
		'{"from" : "Precificação de títulos de renda fixa","to" : "Análise fundamentaista"};' + 
		'{"from" : "Precificação de títulos de renda fixa","to" : "Modelagem behaviorista de preços"};' + 
		'{"from" : "Principios constitucionais do direito","to" : "Definição de pessoa jurídica"};' + 
		'{"from" : "Principios constitucionais do direito","to" : "Consolidação das Leis do trabalho"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Montagem de demonstrativos financeiros"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Gestão Contábil"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Contabilização de custos"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Contabilização de receitas"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Contabilização de operações de leasing"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Contabilização fiscal"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Contabilização de operações de leasing"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Contabilização de seguros"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Contabilização bancária"};' + 
		'{"from" : "Princípios de contabilidade","to" : "Contabilização de IRPF"};' + 
		'{"from" : "Prospecção de mercado","to" : "Organização de eventos"};' + 
		'{"from" : "Relatórios gerenciais","to" : "Relatórios para investidores"};' + 
		'{"from" : "Segmentação de mercado","to" : "Criação de estratégia competitiva"};' + 
		'{"from" : "Segmentação de mercado","to" : "Desenvolvimento de novos produtos"};' + 
		'{"from" : "Teoria financeira","to" : "Cálculo do custo de capital"};' + 
		'{"from" : "Teoria financeira","to" : "Determinação da estrutura de capital"};' + 
		'{"from" : "Teoria financeira","to" : "Precificação de derivativos"};' + 
		'{"from" : "Teoria financeira","to" : "Gestão de ações"};' + 
		'{"from" : "Teoria financeira","to" : "Análise técnica"};' + 
		'{"from" : "Teoria financeira, negociação","to" : "Financiamento de novos negócios"};' + 
		'{"from" : "Treinamento de recursos humanos","to" : "Criação de estratégias de Recursos humanos"};' + 
		'{"from" : "Utilização MS Office","to" : "Materiais institucionais"};'; 
	
	var arrayDoc_link = doc_link.split(";");
	
	var i = 0;
	while (i < arrayDoc_link.length) {
   		var objDiagrama = JSON.parse(localStorage.getItem("diagrama-" + idDiagrama));
   		var link = JSON.parse(arrayDoc_link[i]);
   		objDiagrama.documento.diagrama.linkDataArray.push(link);
   		localStorage.setItem("diagrama-" + idDiagrama, JSON.stringify(objDiagrama));
   		atualizaNode(1, key, idDiagrama, panel, "", "", false);
		i++;
	};
};

function criaCarreiras(key, idDiagrama, panel){
	
	var doc_part_1 = '' +
					'{"documento":{"id":"","tipo":"dados","usuarioAtual":"03868171877","modelo":"Carreira","situacao":"valido","usuarios":[{"codigo":"03868171877"}],';
	var doc_part_2 = 
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estagiário - finanças"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Analista financeiro (jr. a sr.)"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Especialista financeiro"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Coordenador financeiro"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gerente financeiro"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Superintendente financeiro"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Diretor financeiro"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"CFO"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Analista IB"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Associate IB"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Vice presidente IB"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Director IB"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Managing Director IB"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Analista Private Equity"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Associate Private Equity"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Vice presidente Private Equity"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Diretor/ sócio Private Equity"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estagiário"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Analista"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Business analyst (sr.)"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Associate/Consultor (sr.)"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gerente (sr.)"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Project leader"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Engagement manager"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Principal"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estagiário - Marketing"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Analista de mercado"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gerente de produtos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gerente de marketing"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Diretor de marketing"},;';

	var arrayDoc_part_2 = doc_part_2.split(";");	
	
	var doc_part_3 = ' ' +
					'{"modelo":"input_select","label":"Cor","valor":"LightYellow","opcoes":[{"label":"aqua"},{"label":"lightblue"},{"label":"lightgreen"},{"label":"azure"},{"label":"LightYellow"},{"label":"blanchedalmond"}]}],"panel":[{"modelo":"swipe","label":"Descrição","fields":[{"modelo":"input_textarea",';
	
	var doc_part_4 = 
		'"label":"Descrição Rotina Básica","valor":"Coleta informações financeiras, manutenção de relatórios, extração de dados de bases, pesquisa de dados economicos"},{"modelo":"input_decimal","label":"Salário","valor":"0,8 - 1,8"},{"modelo":"input_decimal","label":"Salário Médio","valor":"1200"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Análise de informações financeiras, desenvolvimento de relatórios, extração de dados de bases "},{"modelo":"input_decimal","label":"Salário","valor":"2,6 - 9,8"},{"modelo":"input_decimal","label":"Salário Médio","valor":"4500"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Análise de informações financeiras, desenvolvimento de relatórios, extração de dados de bases, realização de apresentações "},{"modelo":"input_decimal","label":"Salário","valor":"5,0 - 11,8"},{"modelo":"input_decimal","label":"Salário Médio","valor":"7000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Análise de informações financeiras, desenvolvimento de relatórios, extração de dados de bases, apresentações para alta gestão, coordenação de equipe"},{"modelo":"input_decimal","label":"Salário","valor":"6,6 - 15,2"},{"modelo":"input_decimal","label":"Salário Médio","valor":"10000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Gestão de equipe, apresentações para alta gestão, responsabilidade pelos produtos desenvolvidos na área, Interação intra-empresa "},{"modelo":"input_decimal","label":"Salário","valor":"8,8 - 25,8"},{"modelo":"input_decimal","label":"Salário Médio","valor":"14000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Gestão de equipes de gerentes, apresentações para alta gestão, responsabilidade pelos produtos desenvolvidos em sua área, Interação intra-empresa e com alta gestão"},{"modelo":"input_decimal","label":"Salário","valor":"12,3 - 43,6"},{"modelo":"input_decimal","label":"Salário Médio","valor":"20000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Gestão de departamento, Interação com alta gestão, participação de comitês, responsabilidade pela produção das informações financeiras da empresa"},{"modelo":"input_decimal","label":"Salário","valor":"17,8 - 65,4"},{"modelo":"input_decimal","label":"Salário Médio","valor":"30000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Gestão de departamento, Interação com alta gestão, participação de comitês, responsabilidade pela produção das informações financeiras da empresa"},{"modelo":"input_decimal","label":"Salário","valor":"32,0 - 78,0"},{"modelo":"input_decimal","label":"Salário Médio","valor":"45000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Avaliação de empresas e negócios, desenvolvimento de materiais e pitches para clientes, pesquisa de informações de mercado"},{"modelo":"input_decimal","label":"Salário","valor":"7,0 - 12,0"},{"modelo":"input_decimal","label":"Salário Médio","valor":"9500"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Supervisão de analistas, apresentação para clientes, avaliação de empresas e negócios, revisão de materiais e pitches para clientes"},{"modelo":"input_decimal","label":"Salário","valor":"14,6 - 22,3"},{"modelo":"input_decimal","label":"Salário Médio","valor":"17000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Alocação de equipes, gestão de equipes, apresentação para clientes"},{"modelo":"input_decimal","label":"Salário","valor":"19,8 - 32,4"},{"modelo":"input_decimal","label":"Salário Médio","valor":"26200"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Gestão de equipes, apresentação para clientes, negociação de mandatos"},{"modelo":"input_decimal","label":"Salário","valor":"35,2 - 46,4"},{"modelo":"input_decimal","label":"Salário Médio","valor":"40000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Interação com clientes para negociação de mandatos, gestão da área"},{"modelo":"input_decimal","label":"Salário","valor":"44,4 - 62,8"},{"modelo":"input_decimal","label":"Salário Médio","valor":"55000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Análise de empresas e economica, análise de deals, pesquisa de mercado, acompanhamento de processos de due diligence"},{"modelo":"input_decimal","label":"Salário","valor":"7,0 - 12,0"},{"modelo":"input_decimal","label":"Salário Médio","valor":"9500"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Análise de empresas e deals, originação de deals, coordenação de processos de due diligence, gestão de empresas do portfolio"},{"modelo":"input_decimal","label":"Salário","valor":"14,6 - 22,3"},{"modelo":"input_decimal","label":"Salário Médio","valor":"17000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Originação de deals, supervisão de processos de due diligence, gestão de empresas do portfolio, estruturação de operações financeiras"},{"modelo":"input_decimal","label":"Salário","valor":"19,8 - 32,4"},{"modelo":"input_decimal","label":"Salário Médio","valor":"26200"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Relacionamento com investidores, estruturação e captação de novos fundos, originação de deals"},{"modelo":"input_decimal","label":"Salário","valor":"35,2 - 46,4"},{"modelo":"input_decimal","label":"Salário Médio","valor":"40000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Pesquisa de dados, montagem de apresentações, apoio aos consultores"},{"modelo":"input_decimal","label":"Salário","valor":"1,1 - 2,3"},{"modelo":"input_decimal","label":"Salário Médio","valor":"1600"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Análise de informações, entrevistas com cliente, montagem de material"},{"modelo":"input_decimal","label":"Salário","valor":"3,2 - 5,4"},{"modelo":"input_decimal","label":"Salário Médio","valor":"4300"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Análise de informações, entrevistas com cliente, montagem de material"},{"modelo":"input_decimal","label":"Salário","valor":"6,2 - 8,0"},{"modelo":"input_decimal","label":"Salário Médio","valor":"7100"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Análise de informações, entrevistas com cliente, desenvolvimento de soluções, revisão de material, apresentação de resultados"},{"modelo":"input_decimal","label":"Salário","valor":"7,0 - 19,2"},{"modelo":"input_decimal","label":"Salário Médio","valor":"13000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Coordenação de equipe, relacionamento com clientes, desenvolvimento de soluções, revisão de material, apresentação de resultados"},{"modelo":"input_decimal","label":"Salário","valor":"9,0 - 21,0"},{"modelo":"input_decimal","label":"Salário Médio","valor":"14400"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Coordenação de equipe, relacionamento com clientes, coordenação do desenvolvimento de soluções, revisão de material, apresentação de resultados"},{"modelo":"input_decimal","label":"Salário","valor":"16,5 - 24,0"},{"modelo":"input_decimal","label":"Salário Médio","valor":"19800"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Gestão de projetos, relacionamento com clientes, suporte em questões especificas, desenvolvimento de consultores mais juniores"},{"modelo":"input_decimal","label":"Salário","valor":"27,0 - 32,6"},{"modelo":"input_decimal","label":"Salário Médio","valor":"30000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Desenvolvimento de negócios, gestão do relacionamento com clientes, liderança junto a equipes em clientes, suporte em assuntos específicos"},{"modelo":"input_decimal","label":"Salário","valor":"27,0 - 32,6"},{"modelo":"input_decimal","label":"Salário Médio","valor":"30000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Coleta de informações de mercado"},{"modelo":"input_decimal","label":"Salário","valor":"1,0 - 1,8"},{"modelo":"input_decimal","label":"Salário Médio","valor":"1400"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Pesquisas de mercado, análises e interpretação de dados, "},{"modelo":"input_decimal","label":"Salário","valor":"2,9 - 5,1"},{"modelo":"input_decimal","label":"Salário Médio","valor":"4000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Definição das estratégias de marketing e de desenvolvimento de produtos, desenvolvimento de pesquisas e estudos mercadológicos"},{"modelo":"input_decimal","label":"Salário","valor":"3,5 - 7,2"},{"modelo":"input_decimal","label":"Salário Médio","valor":"5000"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Gestão de equipes e criação de estratégias corporativas  de marketing"},{"modelo":"input_decimal","label":"Salário","valor":"8,0 - 23,7"},{"modelo":"input_decimal","label":"Salário Médio","valor":"14400"},{"modelo":"input_select","label":"Função","valor":"",;' +
		'"label":"Descrição Rotina Básica","valor":"Gestão do departamento de marketing e responsável pelas metas de marketing da empresa"},{"modelo":"input_decimal","label":"Salário","valor":"21,0 - 33,0"},{"modelo":"input_decimal","label":"Salário Médio","valor":"27000"},{"modelo":"input_select","label":"Função","valor":"",;';
	

	var arrayDoc_part_4 = doc_part_4.split(";");
		
	var doc_part_5 = 
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};' +
		'"opcoes":[{"label":"Comercial"},{"label":"Consultoria"},{"label":"Finanças"},{"label":"Marketing"},{"label":"Produto"},{"label":"Ética"}]}]}]}};';
	
	var arrayDoc_part_5 = doc_part_5.split(";");
	
	var part_diagrama_2 = 
		'Estagiário - finanças,Teoria financeira;' +
		'Estagiário - finanças,Princípios de contabilidade;' +
		'Analista financeiro (jr. a sr.),Teoria financeira;' +
		'Analista financeiro (jr. a sr.),Análise de índices financeiros;' +
		'Analista financeiro (jr. a sr.),Análise de demonstrativos financeiros;' +
		'Especialista financeiro,Teoria financeira;' +
		'Especialista financeiro,Análise de índices financeiros;' +
		'Especialista financeiro,Análise de demonstrativos financeiros;' +
		'Coordenador financeiro,Teoria financeira;' +
		'Coordenador financeiro,Análise de índices financeiros;' +
		'Coordenador financeiro,Análise de demonstrativos financeiros;' +
		'Coordenador financeiro,Coaching;' +
		'Gerente financeiro,Contratação de funcionários;' +
		'Gerente financeiro,Coaching;' +
		'Gerente financeiro,Criação de estratégias de recursos humanos;' +
		'Gerente financeiro,Planejamento operacional;' +
		'Superintendente financeiro,Contratação de funcionários;' +
		'Superintendente financeiro,Coaching;' +
		'Superintendente financeiro,Criação de estratégias de recursos humanos;' +
		'Superintendente financeiro,Planejamento operacional;' +
		'Diretor financeiro,Contratação de funcionários;' +
		'Diretor financeiro,Coaching;' +
		'Diretor financeiro,Criação de estratégias de recursos humanos;' +
		'Diretor financeiro,Planejamento operacional;' +
		'Diretor financeiro,Contabilidade empresarial;' +
		'CFO,Contratação de funcionários;' +
		'CFO,Coaching;' +
		'CFO,Criação de estratégias de recursos humanos;' +
		'CFO,Planejamento operacional;' +
		'Analista IB,Análise estrutural;' +
		'Analista IB,Análise da concorrência;' +
		'Analista IB,Fusões e aquisições;' +
		'Analista IB,Emissão de títulos de dívida;' +
		'Analista IB,Emissão de novas ações;' +
		'Associate IB,Análise estrutural;' +
		'Associate IB,Análise da concorrência;' +
		'Associate IB,Fusões e aquisições;' +
		'Associate IB,Emissão de títulos de dívida;' +
		'Associate IB,Emissão de novas ações;' +
		'Associate IB,Negociação;' +
		'Associate IB,Coaching;' +
		'Vice presidente IB,Análise estrutural;' +
		'Vice presidente IB,Análise da concorrência;' +
		'Vice presidente IB,Fusões e aquisições;' +
		'Vice presidente IB,Emissão de títulos de dívida;' +
		'Vice presidente IB,Emissão de novas ações;' +
		'Vice presidente IB,Coaching;' +
		'Vice presidente IB,Contratação de funcionários;' +
		'Director IB,Criação de estratégias de recursos humanos;' +
		'Director IB,Fusões e aquisições;' +
		'Director IB,Emissão de títulos de dívida;' +
		'Director IB,Emissão de novas ações;' +
		'Director IB,Coaching;' +
		'Director IB,Contratação de funcionários;' +
		'Director IB,Planejamento operacional;' +
		'Director IB,Planejamento estratégico;' +
		'Managing Director IB,Criação de estratégias de recursos humanos;' +
		'Managing Director IB,Fusões e aquisições;' +
		'Managing Director IB,Emissão de títulos de dívida;' +
		'Managing Director IB,Emissão de novas ações;' +
		'Managing Director IB,Coaching;' +
		'Managing Director IB,Contratação de funcionários;' +
		'Managing Director IB,Planejamento operacional;' +
		'Managing Director IB,Planejamento estratégico;' +
		'Analista Private Equity,Análise estrutural;' +
		'Analista Private Equity,Análise da concorrência;' +
		'Analista Private Equity,Fusões e aquisições;' +
		'Associate Private Equity,Análise estrutural;' +
		'Associate Private Equity,Análise da concorrência;' +
		'Associate Private Equity,Fusões e aquisições;' +
		'Associate Private Equity,Negociação;' +
		'Associate Private Equity,Coaching;' +
		'Vice presidente Private Equity,Análise estrutural;' +
		'Vice presidente Private Equity,Análise da concorrência;' +
		'Vice presidente Private Equity,Fusões e aquisições;' +
		'Vice presidente Private Equity,Emissão de títulos de dívida;' +
		'Vice presidente Private Equity,Emissão de novas ações;' +
		'Vice presidente Private Equity,Coaching;' +
		'Vice presidente Private Equity,Contratação de funcionários;' +
		'Diretor/ sócio Private Equity,Análise estrutural;' +
		'Diretor/ sócio Private Equity,Análise da concorrência;' +
		'Diretor/ sócio Private Equity,Fusões e aquisições;' +
		'Diretor/ sócio Private Equity,Emissão de títulos de dívida;' +
		'Diretor/ sócio Private Equity,Emissão de novas ações;' +
		'Diretor/ sócio Private Equity,Coaching;' +
		'Diretor/ sócio Private Equity,Contratação de funcionários;' +
		'Diretor/ sócio Private Equity,Criação de estratégias de recursos humanos;' +
		'Diretor/ sócio Private Equity,Planejamento operacional;' +
		'Diretor/ sócio Private Equity,Planejamento estratégico;' +
		'Estagiário - Consultoria,Desconto de fluxo de caixa;' +
		'Estagiário - Consultoria,Análises estratégicas;' +
		'Estagiário - Consultoria,Análise mercadológica;' +
		'Analista - Consultoria,Desconto de fluxo de caixa;' +
		'Analista - Consultoria,Análise mercadológica;' +
		'Analista - Consultoria,Teoria financeira;' +
		'Analista - Consultoria,Análise de demonstrativos financeiros;' +
		'Analista - Consultoria,Análise de índices financeiros;' +
		'Business analyst (sr.),Desconto de fluxo de caixa;' +
		'Business analyst (sr.),Análise mercadológica;' +
		'Business analyst (sr.),Teoria financeira;' +
		'Business analyst (sr.),Análise de demonstrativos financeiros;' +
		'Business analyst (sr.),Análise de índices financeiros;' +
		'Associate/Consultor (sr.),Desconto de fluxo de caixa;' +
		'Associate/Consultor (sr.),Análise mercadológica;' +
		'Associate/Consultor (sr.),Teoria financeira;' +
		'Associate/Consultor (sr.),Análise de demonstrativos financeiros;' +
		'Associate/Consultor (sr.),Análise de índices financeiros;' +
		'Associate/Consultor (sr.),Coaching;' +
		'Gerente (sr.) - Consultoria,Desconto de fluxo de caixa;' +
		'Gerente (sr.) - Consultoria,Análise mercadológica;' +
		'Gerente (sr.) - Consultoria,Teoria financeira;' +
		'Gerente (sr.) - Consultoria,Análise de demonstrativos financeiros;' +
		'Gerente (sr.) - Consultoria,Análise de índices financeiros;' +
		'Gerente (sr.) - Consultoria,Coaching;' +
		'Project leader,Desconto de fluxo de caixa;' +
		'Project leader,Análise mercadológica;' +
		'Project leader,Teoria financeira;' +
		'Project leader,Análise de demonstrativos financeiros;' +
		'Project leader,Análise de índices financeiros;' +
		'Project leader,Coaching;' +
		'Project leader,Contratação de funcionários;' +
		'Engagement manager,Desconto de fluxo de caixa;' +
		'Engagement manager,Análise mercadológica;' +
		'Engagement manager,Teoria financeira;' +
		'Engagement manager,Análise de demonstrativos financeiros;' +
		'Engagement manager,Análise de índices financeiros;' +
		'Engagement manager,Coaching;' +
		'Engagement manager,Contratação de funcionários;' +
		'Principal,Desconto de fluxo de caixa;' +
		'Principal,Análise mercadológica;' +
		'Principal,Teoria financeira;' +
		'Principal,Análise de demonstrativos financeiros;' +
		'Principal,Análise de índices financeiros;' +
		'Principal,Coaching;' +
		'Principal,Contratação de funcionários;' +
		'Estagiário - Marketing,Análise mercadológica;' +
		'Analista de mercado,Análise mercadológica;' +
		'Analista de mercado,Segmentação de mercado;' +
		'Analista de mercado,Precificação de produtos e serviços;' +
		'Gerente de marketing,Coaching;' +
		'Gerente de marketing,Contratação de funcionários;' +
		'Gerente de marketing,Negociação;' +
		'Diretor de marketing,Coaching;' +
		'Diretor de marketing,Contratação de funcionários;' +
		'Diretor de marketing,Negociação;';
	
	var arrayDoc_part_diagrama_2 = part_diagrama_2.split(";");

	var part_diagrama_3 = 
		'Diretor financeiro,Trading;' +
		'Diretor financeiro,Análises estratégicas;' +
		'CFO,Matemática financeira;' +
		'CFO,Finanças corporativas;' +
		'CFO,Comercial;' +
		'CFO,Contabilidade empresarial;' +
		'CFO,Trading;' +
		'CFO,Análises estratégicas;' +
		'Analista IB,Matemática financeira;' +
		'Analista IB,Finanças corporativas;' +
		'Associate IB,Matemática financeira;' +
		'Associate IB,Finanças corporativas;' +
		'Vice presidente IB,Matemática financeira;' +
		'Vice presidente IB,Finanças corporativas;' +
		'Vice presidente IB,Comercial;' +
		'Director IB,Matemática financeira;' +
		'Director IB,Finanças corporativas;' +
		'Director IB,Análises estratégicas;' +
		'Director IB,Comercial;' +
		'Director IB,Contabilidade empresarial;' +
		'Managing Director IB,Matemática financeira;' +
		'Managing Director IB,Finanças corporativas;' +
		'Managing Director IB,Análises estratégicas;' +
		'Managing Director IB,Comercial;' +
		'Managing Director IB,Contabilidade empresarial;' +
		'Analista Private Equity,Matemática financeira;' +
		'Analista Private Equity,Finanças corporativas;' +
		'Analista Private Equity,Análises estratégicas;' +
		'Associate Private Equity,Matemática financeira;' +
		'Associate Private Equity,Finanças corporativas;' +
		'Associate Private Equity,Análises estratégicas;' +
		'Vice presidente Private Equity,Matemática financeira;' +
		'Vice presidente Private Equity,Finanças corporativas;' +
		'Vice presidente Private Equity,Comercial;' +
		'Vice presidente Private Equity,Análises estratégicas;' +
		'Diretor/ sócio Private Equity,Matemática financeira;' +
		'Diretor/ sócio Private Equity,Finanças corporativas;' +
		'Diretor/ sócio Private Equity,Comercial;' +
		'Diretor/ sócio Private Equity,Análises estratégicas;' +
		'Diretor/ sócio Private Equity,Contabilidade empresarial;' +
		'Estagiário - Consultoria,Análises estratégicas;' +
		'Analista - Consultoria,Análises estratégicas;' +
		'Business analyst (sr.),Análises estratégicas;' +
		'Associate/Consultor (sr.),Análises estratégicas;' +
		'Associate/Consultor (sr.),Estratégia;' +
		'Associate/Consultor (sr.),Comercial;' +
		'Associate/Consultor (sr.),Operações;' +
		'Gerente (sr.) - Consultoria,Análises estratégicas;' +
		'Gerente (sr.) - Consultoria,Estratégia;' +
		'Gerente (sr.) - Consultoria,Comercial;' +
		'Gerente (sr.) - Consultoria,Operações;' +
		'Project leader,Análises estratégicas;' +
		'Project leader,Estratégia;' +
		'Project leader,Comercial;' +
		'Project leader,Operações;' +
		'Engagement manager,Análises estratégicas;' +
		'Engagement manager,Estratégia;' +
		'Engagement manager,Comercial;' +
		'Engagement manager,Operações;' +
		'Principal,Análises estratégicas;' +
		'Principal,Estratégia;' +
		'Principal,Comercial;' +
		'Principal,Operações;' +
		'Gerente de produtos,Gestão de Marketing;' +
		'Gerente de produtos,Análises estratégicas;' +
		'Gerente de marketing,Gestão de Marketing;' +
		'Gerente de marketing,Análises estratégicas;' +
		'Gerente de marketing,Gestão de projetos;' +
		'Diretor de marketing,Gestão de Marketing;' +
		'Diretor de marketing,Análises estratégicas;' +
		'Diretor de marketing,Gestão de projetos;' +
		'Diretor de marketing,Operações;';
	
	var arrayDoc_part_diagrama_3 = part_diagrama_3.split(";");
	
	var i = 0;

	while (i < arrayDoc_part_diagrama_2.length) {
  		var valor = arrayDoc_part_diagrama_2[i].split(",")
		$.ajax({
	        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter/query?query=documento.header.valor&valor=" + valor[1],
	        contentType: "application/json; charset=utf-8",
	        dataType: 'json',
	        async:false
		})
	  	.done(function( data ) {
	  		arrayDoc_part_diagrama_2[i] = arrayDoc_part_diagrama_2[i] + "," + data.documento.id; 
		})
		.fail(function(data) {
			console.log ("obter documento nome saiu por fail");
		})
		.always(function(data) {
			console.log ("obter documento nome saiu por always");
		});
  		++i;
	};
	setTimeout('i=0',10000);
	i = 0;
	while (i < arrayDoc_part_2.length) {
		var objJson = JSON.parse(doc_part_1 + arrayDoc_part_2[i]  + doc_part_3 + arrayDoc_part_4[i] + arrayDoc_part_5[i]);
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
	  		console.log ("inclusão documento saiu por done");
	  	})
	    .fail(function(data) {
		   console.log ("inclusão documento saiu por fail");
	    })
	   	.always(function(data) {
			$.ajax({
	            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter?id=" + data.responseText,
	            contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            async:false
			})
		  	.done(function( data ) {
		  		var objDiagrama = JSON.parse ('{"documento":{"id":"","idDocPrincipal":"' + data.documento.id +'","tipo":"Carreira","label":"' + data.documento.header[0].valor + '","diagrama":{"nodeDataArray":[{"key":"' + data.documento.header[0].valor +'","text":"' + data.documento.header[0].valor +'","color":"LightYellow","principal":"true","id":"' + data.documento.id +'"}],"linkDataArray":[]}}}');	
		  		var valor = arrayDoc_part_diagrama_2[0].split(",")
		  		var j = 0;
		  		while (valor[0] != data.documento.header[0].valor &&
		  				j < arrayDoc_part_diagrama_2.length) {
		  			++j
		  			if (j < arrayDoc_part_diagrama_2.length) {
				  		valor = arrayDoc_part_diagrama_2[j].split(",")
				  		valor = arrayDoc_part_diagrama_2[j].split(",")
		  			};
		  		};
		  		var temNo = false;
		  		while (valor[0] == data.documento.header[0].valor &&
		  				j < arrayDoc_part_diagrama_2.length) {
			   		var node = JSON.parse(
		   					'{' +
				            '"key" : "' + valor [1] + '",' +
				            '"text" : "' + valor [1] + '",' +
				            '"color" : "LightYellow",' +
				            '"id" : "' + valor [2] + '"' +
		          			'}');
			   		objDiagrama.documento.diagrama.nodeDataArray.push(node);
			   		temNo = true;
		  			++j
			  		valor = arrayDoc_part_diagrama_2[j].split(",")
		  		};
		  		if (temNo){ 
					$.ajax({
						type: "POST",
			            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/incluir",
			            contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            async:false,
			            data : JSON.stringify(objDiagrama)
					})
					.done(function( data ) {
						console.log ("inclusão diagrama saiu por done");
					})
					.fail(function(data) {
						console.log ("inclusão diagrama saiu por fail");
					})
					.always(function(data) {
						console.log ("inclusão diagrama saiu por always");
					});
		  		};
		  	})
		    .fail(function(data) {
		    	console.log ("obter documento saiu por fail");
		    })
		   	.always(function(data) {
		   		console.log ("obter documento saiu por always");
	    	});
	   	});
		i++;
	};
};
