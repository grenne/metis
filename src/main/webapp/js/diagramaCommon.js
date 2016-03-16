/**
 *  atualiza o diagrama segundo dados do documento
 */

function atualizaNode(idDocumento, key, idDiagrama, panel, text, color, atualizaNode) {
	
	var objJson = JSON.parse(localStorage.getItem("diagrama-" + panel));
	var objDiagrama = JSON.parse(localStorage.getItem("diagrama-" + idDiagrama));
	objJson.documento.diagrama.nodeDataArray = objDiagrama.nodeDataArray;
	objJson.documento.diagrama.linkDataArray = objDiagrama.linkDataArray;
	if (atualizaNode  ||
		typeof atualizaNode == 'undefined'){
		$.each(objJson.documento.diagrama.nodeDataArray, function(i, node) {
			if (node.key == key){
				node.id = idDocumento;
				node.text = text;
				node.color = color;
			};
		});	    	
	};
	$.ajax({
		type: "POST",
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/atualizar",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async : false,
        data : JSON.stringify(objJson),
        success: function(data) {
        	console.log ("terminou atualização diagrama id:" + idDocumento + " data:" + data);
 //   		localStorage.removeItem("diagrama-" + idDiagrama);
        }
	});
};

function atualizaGroup (id, idDiagramaOriginal, panel, key) {
    // Create the Diagram's Model:
	jQuery.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/obter/viadocprincipal?id=" + id,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
        success: function(dataNovo) {
        	jQuery.ajax({
                url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/obter?id=" + idDiagramaOriginal,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                async: false,
                success: function(dataOriginal) {
                	var keyGroup = 0;
                	var label = dataNovo.documento.label.replace( /\s/g, '' ) + "-";
//                	var nodeGroup = JSON.parse('{"key":"' + label + keyGroup + '","text":"' + dataNovo.documento.label + '","color":"blue","isGroup":"true"}');
    				$.each(dataOriginal.documento.diagrama.nodeDataArray, function(i, nodeOriginal, id, key) {
    					if (nodeOriginal.text == ""){
    						nodeOriginal.key = label + keyGroup;
    						nodeOriginal.text = dataNovo.documento.label;
    						nodeOriginal.color = "blue";
    						nodeOriginal.isGroup = "true"; 
    					};
    				});
    				$.each(dataNovo.documento.diagrama.nodeDataArray, function(i, nodeNovo, id) {
                    	var node = JSON.parse('{"key":"' + label + nodeNovo.key + '","text":"' + nodeNovo.text + '","color":"' + nodeNovo.color + '","group":"' + label + keyGroup + '","id":"' + nodeNovo.id + '"}');
                    	dataOriginal.documento.diagrama.nodeDataArray.push(node);
    				});
    				$.each(dataNovo.documento.diagrama.linkDataArray, function(i, linkNovo, id) {
                    	var link = JSON.parse('{"from":"' + label + linkNovo.from + '","to":"' +  label + linkNovo.to + '"}');
                    	dataOriginal.documento.diagrama.linkDataArray.push(link);
    				});                	
                	console.log ("badges" + JSON.stringify(dataNovo.documento.diagrama.nodeDataArray));
                	console.log ("original" + JSON.stringify(dataOriginal.documento.diagrama.nodeDataArray));
                	$.ajax({
                		type: "POST",
                	       url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/atualizar",
                	       contentType: "application/json; charset=utf-8",
                	       dataType: 'json',
                	       data : JSON.stringify(dataOriginal),
                	       success: function(data) {
                	       }
                	});
                }
        	});
        }
	});
	
};

function varreGrupo (nomeGrupo, excluirGrupo) {
	var objJsonOriginal = JSON.parse(localStorage.getItem("diagrama-0"));

	$.each(objJsonOriginal.documento.diagrama.nodeDataArray, function(w, nodeOriginal){
		if (typeof objJsonOriginal.documento.diagrama.nodeDataArray[w].isGroup != 'undefined') {
			if (objJsonOriginal.documento.diagrama.nodeDataArray[w].group == nomeGrupo){
				if (objJsonOriginal.documento.diagrama.nodeDataArray[w].isGroup){
					console.log ("trata grupo - grupo " + objJsonOriginal.documento.diagrama.nodeDataArray[w].group + 
							 		" - texto " + objJsonOriginal.documento.diagrama.nodeDataArray[w].text
								);
					varreGrupo (objJsonOriginal.documento.diagrama.nodeDataArray[w].text, excluirGrupo);
				};
			};
		}else{
			if (objJsonOriginal.documento.diagrama.nodeDataArray[w].group == nomeGrupo){
				var objJsonOriginal_1 = JSON.parse(localStorage.getItem("diagrama-0"));
				var objJsonCompara_1 = JSON.parse(localStorage.getItem("diagrama-1"));
	    		$.each(objJsonOriginal_1.documento.diagrama.nodeDataArray, function(y, nodeOriginal_1){
					if (nodeOriginal_1.group == nomeGrupo && objJsonOriginal.documento.diagrama.nodeDataArray[w].id == nodeOriginal_1.id){
		    			if (typeof nodeOriginal_1.id != 'undefined') {
		    				if (excluirGrupo){
		    					objJsonOriginal_1.documento.diagrama.nodeDataArray[y].color = "white";
		    					$.each(objJsonCompara_1.documento.diagrama.nodeDataArray, function(z, nodeCompara_1){
		    		    			if (typeof nodeCompara_1 != 'undefined' && typeof nodeCompara_1.id != 'undefined') {
			    						if (nodeCompara_1.id == nodeOriginal_1.id) {
			    							objJsonCompara_1.documento.diagrama.nodeDataArray.splice(z, 1);
			    	    					localStorage.setItem("diagrama-1", JSON.stringify(objJsonCompara_1));
			    						};
		    						};
		    					});
		    				}else{
		    					objJsonOriginal_1.documento.diagrama.nodeDataArray[y].color = localStorage.corComparacao;
		    					var new_node = '{"loc":"50 50","key":"' + nodeOriginal_1.text + '","text":"' + nodeOriginal_1.text + '","color":"' + nodeOriginal_1.color + '","id":"' + nodeOriginal_1.id + '"}';
		    					var objNode = JSON.parse(new_node);
		    					objJsonCompara_1.documento.diagrama.nodeDataArray.push(objNode);
		    					localStorage.setItem("diagrama-1", JSON.stringify(objJsonCompara_1));
		    				};
						};
					};
	    		});
	        	localStorage.setItem("diagrama-0", JSON.stringify(objJsonOriginal_1));
				atualizaComparacao();
			};
		};
	});

};
