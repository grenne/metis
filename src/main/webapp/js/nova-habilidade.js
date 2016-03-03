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
		if (objJson.documento.header[0].valor == "criagrupo"){
			criaHabllidadesEmGrupo(key, idDiagrama, panel)
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
	       	});
		};
	});	
});

function criaHabllidadesEmGrupo(key, idDiagrama, panel){
	
	var doc_part_1 = '' +
					'{"documento":{"id":"","tipo":"dados","usuarioAtual":"03868171877","modelo":"Habilidades","situacao":"valido","usuarios":[{"codigo":"03868171877"}],';
	var doc_part_2 = 
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de demonstrativos financeiros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de índices financeiros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de caixa"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Teoria financeira"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo do custo de capital"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Avaliação de empresas (precificação de ações)"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Avaliação de opções reais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Determinação da estrutura de capital"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Captação a mercado de dívida"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Captação a mercado via ações"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Fusões e aquisições"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Reestruturação de passivos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de juros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Utilização de fluxos de caixa"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de estratégias de hedge"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Precificação de derivativos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Precificação de títulos de renda fixa"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo da curva a termo de juros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Operação de plataformas de negociação"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação de ações"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação de commodities"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação de moedas estrangeiras"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação de juros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de ações"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de renda fixa"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de ativos imobiliários"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise fundamentaista"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise técnica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise quantitativa"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Otimização de portfolio"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contratação de funcionários"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Treinamento de recursos humanos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Coaching "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de estratégias de Recursos humanos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de remuneração e beneficios"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão da folha de pagamentos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise mercadológica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Inteligência competitiva"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Precificação de produtos e serviços"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Atração/ retenção de clientes"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de estratégia competitiva"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de produtos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de canais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de comunicação mercadológica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de propaganda e publicidade"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Segmentação de mercado"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de cadeia de valor"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Inovação em produtos e serviços"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de novos modelos de negócios"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Abertura de empresas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Financiamento de novos negócios"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de negócio no modelo Lean Start-up"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise estrutural "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise da concorrência"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise do ciclo de vida do produto"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de End Game"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Construção de estratégias competitivas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Planejamento estratégico"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de relacionamento com clientes"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Negociação "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"História da administração"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Tomada de decisões"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de projeto"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de valor agregado de projetos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Desenvolvimento de cronogramas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Planejamento de projetos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gerênciamento de riscos de projetos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão de projetos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Administração de fundos de investimentos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Administração de hospitais e clínicas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão da sustentabilidade"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Planejamento operacional"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação e revisão de processos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Determinação de níveis de eficiência"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"influenciando pessoas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Relacionamentos profissionais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Otimização logística"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Princípios de contabilidade"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Montagem de demonstrativos financeiros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Gestão Contábil"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de custos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de receitas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de resultados"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização fiscal"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de operações de leasing"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de seguros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização bancária"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contabilização de IRPF"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Basiléia - Cálculos de requerimento de capital "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Basiléia - Cálculos de liquidez e estabilidade de captação"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Principios constitucionais do direito"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Definição de pessoa jurídica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Consolidação das Leis do trabalho"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de tributos federais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de tributos Estaduais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de tributos Municipais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Criação de sociedades"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Reestruturação societária"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Fusões e aquisições"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Emissão de novas ações"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Emissão de titulos de dívida"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estruturação de fundos de investimentos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Processo falimentar"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Contratos bancários"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise macro economica"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise das contas públicas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise das políticas monetárias e fiscais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de elasticidade de demanda"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise dos agregados de oferta e demanda"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Análise de custos e lucros"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Modelo de Solow"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Modelagem de jogos"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Modelagem behaviorista de preços "},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de derivadas"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Cálculo de integrais"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Introdução ao pacote office"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Expertise MS Excel"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Expertise MS Powerpoint"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Expertise MS Word"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Principios da estatística"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estatística intermediária"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Estrutura psicológica Freudiana"},;' +
		'"header":[{"modelo":"input_texto","label":"Nome","valor":"Aplicação do Behaviorismo aos negócios "},;';

	var arrayDoc_part_2 = doc_part_2.split(";");	
	
	var doc_part_3 = ' ' +
					'{"modelo":"input_select","label":"Cor","valor":"aquamarine","opcoes":[{"label":"aqua"},{"label":"lightblue"},{"label":"lightgreen"},{"label":"azure"},{"label":"aquamarine"},{"label":"blanchedalmond"}]}],"panel":[{"modelo":"swipe","label":"Descrição","fields":[{"modelo":"input_textarea",';
	
	var doc_part_4 = 
	'"label":"Descrição","valor":"Análise vertical/ horizontal de balanços, DREs e fluxos de caixa"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/An%C3%A1lise_financeira"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Criação de índices a partir de informações financeiras e interpretação de seus resultados"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/An%C3%A1lise_financeira"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Análise da disponibilidade de caixa, projeção de sua geração e necessidades de financiamento "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Cash_management"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Risco vs. Retorno, Portfolio eficiente, CAPM, Eficiência de mercado"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Finan%C3%A7as"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Determinação do custo de capital de uma empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Custo_do_capital"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Cálculo e análise do valor de uma empresa/ ativos/ projetos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Avalia%C3%A7%C3%A3o_de_empresas"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Cálculo do valor de opções reais"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Avalia%C3%A7%C3%A3o_de_op%C3%A7%C3%B5es_reais"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Otimização do valor de uma empresa a partir da composição de seu financiamento e políticas de dividendos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Custo_do_capital"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Estruturação de operações de captação de recursos por meio de instrumentos de dívida, securitização e híbridos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_de_capitais"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Estruturação de operações de captação de recursos por meio de venda de ações"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_de_capitais"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Estruturação de operações de compra ou venda de empresas ou ativos de empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Fus%C3%A3o_%28direito%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Renegociação de dívidas para readequação dos fluxos de pagamentos à geração de caixa da empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Turnaround_%28administra%C3%A7%C3%A3o%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Cálculos de juros simples e juros compostos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Matem%C3%A1tica_financeira"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Construção e cálculos de fluxos de caixa, pagamentos, prazos, taxas, valor presente"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Matem%C3%A1tica_financeira"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Montagem de estratégias de hedge com swaps, opções, alguel de ações e seguros"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Cobertura_%28finan%C3%A7as%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Cálculo do preço de opções de compra e venda (black and scholes), taxa de aluguel de ações "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Derivativo"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Cálculo do preço de títulos públicos e de dívida corporativa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Cálculo da taxa de juros justa para diferentes prazos e vencimentos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Curva_a_termo"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Utilização de plataformas de negociação de ativos financeiros"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Compra e venda de ações para clientes ou empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_financeiro"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Compra e venda de commodities e futuros para clientes ou empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_financeiro"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Compra e venda de moedas estrangeiras e seus derivativos para clientes ou empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_financeiro"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Compra e venda de títulos de dívida e seus derivativos para clientes ou empresas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Mercado_financeiro"},{"modelo":"input_select","label":"Area","valor":"",;' +
	'"label":"Descrição","valor":"Gestão de portfólio de ações, execução de operações de compra e venda "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/A%C3%A7%C3%A3o_%28finan%C3%A7as%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Gestão de carteira de renda fixa, execução de compra e venda de ativos "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Renda_fixa"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Gestão de carteira de ativos imobiliários, execução de compra e venda de ativos e títulos de dívida lastreados em imóveis"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Determinação do preço de uma ação a partir de informações financeiras e de mercado"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/An%C3%A1lise_fundamentalista"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Determinação do preço de um ativo financeiro a partir do preço do ativo e seu comportamento histórico"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/An%C3%A1lise_t%C3%A9cnica"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Determinação do preço de um ativo financeiro com base em análises estatisticas de componentes que o influenciam"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://en.wikipedia.org/wiki/Quantitative_analyst"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Determinação do portfolio eficiente de mercado"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Teoria_moderna_do_portf%C3%B3lio"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Condução de processo de seleção de pessoas, da descrição da vaga à contratação "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Identificação de necessidade e criação de programas de capacitação de funcionários"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Treinamento"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Acompanhamento individual de colaboradores e apoio ao seu desenvolvimento"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Desenvolvimento de estratégias de retenção, motivação e aumento de eficiência de funcionários"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Estudos de mercado sobre remuneração  e benefícios"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Controle e cálculos de valores para pagamentos de salários e benefícios a funcionários"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Coleta de dados sobre produtos e desejos dos consumidores e interpretação dos dados"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Coleta de dados sobre desempenho de produtos concorrentes em um mercado e análise das preferências dos consumidores"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Definição do preço com base na disponibilidade a pagar dos consumidores por atributos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Pre%C3%A7o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Criação de estratégias para expandir mercados e manter a base de clientes atuais"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Definição de jogadas para melhorar a posição competititva da empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Estrat%C3%A9gia_competitiva"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Gestão mercadológica dos produtos, levando em consideração seus atributos, o mercado, canais e concorrentes"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Produto_%28marketing%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Definição dos canais a serem empregados pela empresa para entregar seus produtos e serviços"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Distribui%C3%A7%C3%A3o_%28log%C3%ADstica%29"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Controle dos canais de comunicação e mensagens a serem enviadas aos clientes, fornecedores e mercado em geral"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Comunica%C3%A7%C3%A3o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Desenvolvimento de campanhas de comunicação e propagandas institucionais ou de produtos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Propaganda"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Criação de segmentos de clientes e definição de suas características"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Segmenta%C3%A7%C3%A3o_de_mercado"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Análise da cadeia de fornecedores e processos e identificação de vantagens e desvantagens competitivas"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Identificação de lacunas de mercados ou criação de novas soluções para problemas e transformação de oportunidades em produtos ou serviços "},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Inova%C3%A7%C3%A3o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Desenvolvimento de modelos de negócios adaptados a novos produtos, clientes e mercados"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Modelo_de_neg%C3%B3cio"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Condução do processo burocrático de abertura de uma nova pessoa jurídica"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Captação de recursos para viabilizar empresas até que essas gerem caixa para suportar as operações"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Criação de novos negócios com foco na criação do produto em conjunto com clientes"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Lean_startup"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Construir o entendimento sobre uma indústria, quais seus riscos e distribuição de poderes"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Estrat%C3%A9gia"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Localizar a empresa estratégicamente frente a seus concorrentes e determinar seus pontos fortes e fracos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Estrat%C3%A9gia"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Identificar em qual ponto de vida está o produto"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Ciclo_de_vida_do_produto"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Identificar potenciais reações competitivas de uma decisão estratégica"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Definir estratégia geral ou especifica com base em dados de mercado e análises mercadológicas e estratégicas"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Estrat%C3%A9gia"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Desenvolvimento de objetivos de curto e médio prazo e identificação de ações necessárias a seu atingimento"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Planejamento_estrat%C3%A9gico"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Manutenção de relacionamento com clientes com objetivo de maximizar vendas e capacidade de atendimento"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Utilização de conceitos de negociação para obtenção do melhor resultado possível"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Negocia%C3%A7%C3%A3o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Entender a evolução do estudo da organização humana (Fordismo, toyotismo, maslow)"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Administra%C3%A7%C3%A3o"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Utilização de ferramentas e modelos psicológicos para melhora da capacidade de tomada de decisões"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Gerir recursos para a obtenção de um fim dentro dos prazos determinados e custos orçados"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Ger%C3%AAncia_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Dimensionamento dos benefícios e resultados esperados de projetos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Criação de planos de metas e definição do tempo necessário ao cumprimento das atividades ligadas a um projeto"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Desenvolvimento de planos de projetos, incluindo Escopos, objetivos, cronogramas, orçamentos e avaliação do esforço necessário."},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Identificação de obstáculos e riscos de projetos e definição de ações de mitigação dos mesmos"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Gestão de todo o processo de um projeto, incluindo custos, qualidade, recursos humanos e comunicações"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Gerência_de_projetos"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Viabilizar o funcionamento de um fundo de investimento e gerar as informações necessárias"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Maximizar a eficiência de um hospital "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Reduzir ao máximo os impactos ambientais e maximizar os sociais de uma operação"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Sustentabilidade"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Calcular a quantidade de recursos necessários a uma operação"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Planejamento_operacional"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Determinar passos e atividades necessárias para o atingimento de um fim"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Processo"},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Ajustar processos e recursos para a entrega de um nível de eficiência planejado"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":""},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Entendimento das necessidades e utilização de comunicação efeitva para melhora do posicionamento pessoal profissional"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Redução dos custos e aumento da qualidade na movimentação de mercadorias"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Administração de empresas",;' +
	'"label":"Descrição","valor":"Conceito de ativo, passivo, contas T, demonstrativos contábeis"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Fechamento de demonstrativos financeiros de um período de atividade da empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Lançamento de notas fiscais, geração de demonstrativos, controle de contas a pagar/ receber"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Determinação e alocação dos custos de uma empresa de acordo com conceitos pré determinados"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Determinação e alocação das receitas de uma empresa de acordo com conceitos pré determinados"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Determinação do resultado de uma empresa a partir de receitas e custos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Determinação das bases de cálculo e impostos a serem pagos por uma empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Cálculo e registro de operações de leasing, seus resultados e tributação"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Cálculo e registro de operações de seguros"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Contabilização de empresas do setor bancário, com suas regras específicas por produto e empresa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Determinação do imposto de renda de pessoa física a ser pago ou restituído"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Determinação do índice de basiléia de um banco, a partir do requerimento de capital por ativo ponderado por risco"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Basileia_III"},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Cálculo dos índices de NSFR (Net Stable Funding Ratio) e LCR ( Liquidity Coverage Ratio)"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Basileia_III"},{"modelo":"input_select","label":"Area","valor":"Ciências contábeis",;' +
	'"label":"Descrição","valor":"Principios do direito brasileiro"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Identificação dos requisitos de uma pessoa jurídica"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Utilização dos conceitos e principios das leis trabalhistas brasileiras em vigor na construção de relações de trabalho"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito ",;' +
	'"label":"Descrição","valor":"Determinação de base de cálculo e aliquotas de tributos federais"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Direito_tribut%C3%A1rio"},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Determinação de base de cálculo e aliquotas de tributos estaduais"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Direito_tribut%C3%A1rio"},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Determinação de base de cálculo e aliquotas de tributos municipais"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Direito_tribut%C3%A1rio"},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Definição dos tipo de sociedade que podem se formar em uma Pessoa jurídica"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Mudança da composição acionária de uma empresa em estado falimentar, em conjunto com credores"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Turnaround_%28administra%C3%A7%C3%A3o%29"},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Estruturação jurídica de operação de compra e venda de empresas ou ativos corporativos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Revisão do contrato social para emissão de novas ações"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Criação de contratos para a emissão de instrumentos de dívida corporativa"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Criaçãode contratos e documentos para o registro e funcionamento de fundos de investimentos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Coordenação do processo falimentar, definição do tipo de pedido de falência "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Desenvolvimento de contratos de serviços bancários em conforme com as leis"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Direito",;' +
	'"label":"Descrição","valor":"Análise das tendências economicas de um país ou região a partir de dados economicos disponíveis"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Macroeconomia"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
	'"label":"Descrição","valor":"Determinação da saúde de uma instancia governamental a partir de suas contas"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
	'"label":"Descrição","valor":"Determinação de tendências economicas a partir do conjunto de regras que regem o funcionamento do governo"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
	'"label":"Descrição","valor":"Avaliação da sensibilidade da demanda à variação de preços"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Elasticidade_%28economia%29"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
	'"label":"Descrição","valor":"Análise da variação de preços em função do equilibrio de oferta e demanda"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Teoria_do_equil%C3%ADbrio_geral"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
	'"label":"Descrição","valor":"Determinação do preço ótimo para maximização do resultado em funçao dos custos marginais de produção (teoria da firma)"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Teoria_da_firma"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
	'"label":"Descrição","valor":"Avaliação da capacidade de crescimento de uma economia a partir dos componentes de capital, mão de obra e tecnologia"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Modelo_de_Solow"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
	'"label":"Descrição","valor":"Estruturação de situações conforme a teoria dos jogos e análise dos possíveis resultados"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Teoria_dos_jogos"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
	'"label":"Descrição","valor":"Determinação de preços de ativos com base em comportamentos de agentes de mercado"},{"modelo":"input_texto","label":"Wikipédia","valor":"https://pt.wikipedia.org/wiki/Economia_comportamental"},{"modelo":"input_select","label":"Area","valor":"Economia",;' +
	'"label":"Descrição","valor":"Cálculo de operações derivadas"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Matemática ",;' +
	'"label":"Descrição","valor":"Cálculo de operações integrais"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Matemática ",;' +
	'"label":"Descrição","valor":"Introdução às funcionalidades de MS Excel, powerpoint, Word e outlook"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
	'"label":"Descrição","valor":"Nível avançado de MS Excel - VBA, tabelas dinâmicas, fórmulas matriciais"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
	'"label":"Descrição","valor":"Nível avançado de Powerpoint - animações, links com arquivos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
	'"label":"Descrição","valor":"Nível avançado de MS Word - índices, links com arquivos"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Tecnologia da informação",;' +
	'"label":"Descrição","valor":"Conceitos de média, mediana, moda, cálculo de desvio padrão, distribuição normal"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Estatística",;' +
	'"label":"Descrição","valor":"Testes de hipótese, significancia estatística, análise de resíduos e de variância"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Estatística",;' +
	'"label":"Descrição","valor":"Entendimento dos conceitos de Ego, supergo, id. "},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Psicologia",;' +
	'"label":"Descrição","valor":"Entendimento dos conceitos de behaviorismo aplicados ao trabalho"},{"modelo":"input_texto","label":"Wikipédia","valor":""},{"modelo":"input_select","label":"Area","valor":"Psicologia",;';

	var arrayDoc_part_4 = doc_part_4.split(";");
		
	var doc_part_5 = 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Finanças",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Recursos humanos",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Marketing",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Empreendedorismo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Estratégia",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral ",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Administração geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Logística",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Contabilidade",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito constitucional",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Civil",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito trabalhista",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito tributário",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito tributário",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito tributário",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Direito Comercial",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise economica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise economica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise economica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise economica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise economica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise economica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise economica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Análise economica",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Economia comportamental",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Cálculo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Cálculo",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Computação geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Computação geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Computação geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Computação geral",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Psicologia Freudiana",;' + 
		'"opcoes":[{"label":"Administração de empresas"},{"label":"Academica"},{"label":"Ciências Contábeis"},{"label":"Direito"},{"label":"Economia"},{"label":"Ética"}]},{"modelo":"input_select","label":"Campo","valor":"Psicologia do trabalho",;';

	var arrayDoc_part_5 = doc_part_5.split(";");
	
	var doc_part_6 = 
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças corporativas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Matemática financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Matemática financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Trading",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Investimentos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de recursos humanos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de marketing",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Inteligência competitiva",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Inovação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Novos negócios",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Novos negócios",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Novos negócios",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Novos negócios",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Análises estratégicas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Análises estratégicas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Análises estratégicas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Análises estratégicas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Decisão estratégica",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Decisão estratégica",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Relacionamento com clientes",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Negociação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Teoria da administração",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Tomada de decisões",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de projetos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão de instituição financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Gestão hospitalar",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Sustentabilidade",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Operações",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Operações",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Operações",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Soft Skills",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Soft Skills",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade empresarial",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade financeira",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade Pessoal",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade Bancária",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contabilidade Bancária",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Definição de pessoas",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Tributação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Tributação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Tributação",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito societário",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Direito falimentar",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Contratos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Macro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Macro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Macro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Micro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Micro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Micro economia",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Teoria do desenvolvimento econômico",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Teoria dos jogos",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Finanças comportamentais",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Utilização MS Office",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Utilização MS Office",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Utilização MS Office",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Utilização MS Office",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"",;' +
		'"opcoes":[{"label":"Finanças"},{"label":"Recursos Humanos"},{"label":"Marketing"},{"label":"Empreendimentos"},{"label":"EStratégia"},{"label":"Comercial"},{"label":"Administração Geral"}]},{"modelo":"input_select","label":"Categoria","valor":"Psicologia comportamental",;';

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
   		var objDiagrama = JSON.parse(localStorage.getItem("diagrama-" + idDiagrama));
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
	   		var node = JSON.parse(
	   			'{' +
			            '"key" : "' + objJson.documento.header[0].valor + '",' +
			            '"text" : "' + objJson.documento.header[0].valor + '",' +
			            '"color" : "aquamarine",' +
			            '"group" : "' + objJson.documento.panel[0].fields[4].valor + '",' +
			            '"id" : "' + data.responseText + '"' +
	          			'}');
	   		objDiagrama.nodeDataArray.push(node);
	   		localStorage.setItem("diagrama-" + idDiagrama, JSON.stringify(objDiagrama));
	   		atualizaNode(data.responseText, key, idDiagrama, panel, objJson.documento.header[0].valor, objJson.documento.header[1].valor);
	   	});
		i++;
	};

	
	
}
