/**
 *  atualiza o diagrama segundo dados do documento
 */

function atualizaNode(idDocumento, key, idDiagrama, panel, text, color) {
	
	var objJson = JSON.parse(localStorage.getItem("diagrama-" + panel));
	var objDiagrama = JSON.parse(localStorage.getItem("diagrama-" + idDiagrama));
	objJson.documento.diagrama.nodeDataArray = objDiagrama.nodeDataArray;
	
	objJson.documento.diagrama.linkDataArray = objDiagrama.linkDataArray;
	$.each(objJson.documento.diagrama.nodeDataArray, function(i, node) {
		if (node.key == key){
			node.id = idDocumento;
			node.text = text;
			node.color = color;
		};
	});	    	
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
