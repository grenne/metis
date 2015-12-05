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
