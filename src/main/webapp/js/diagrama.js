/*
 * montagem do diagrama
 */


function init(diagrama, panelReceive, idReceive, diagramaDesc) {

	id = idReceive;
	panel = panelReceive;
	var $ = go.GraphObject.make;  // for conciseness in defining templates
	
    myDiagram[panel]  =
      $(go.Diagram, diagrama,  // create a Diagram for the DIV HTML element
        {
    	  // must be true to accept drops from the Palette
    	  allowDrop: true, 
          // position the graph in the middle of the diagram
          initialContentAlignment: go.Spot.Center,
    	  initialAutoScale: go.Diagram.Uniform,
          // allow double-click in background to create a new node
          "clickCreatingTool.archetypeNodeData": { text: "", color: "white" },
          // allow Ctrl-G to call groupSelection()
          "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, color: "blue" },
          // teste single click
          "click": singleClick,
          // enable undo & redo
          "undoManager.isEnabled": true,
          "ChangedSelection": onSelectionChanged,
          "ObjectDoubleClicked" : nodeDoubleClick,
          "PartCreated" : partCreated,
          "LinkDrawn" : save,
          "LinkRelinked" : save,
          "Modified" : save,
          "PartRotated" : save,
          "SelectionDeleted" : save,
          "SelectionGrouped" : save,
          "SelectionMoved" : selectionMove,
          "ObjectContextClicked": onTextEdited,
          "TextEdited": onTextEdited
        });
    
    // salvar variaveis
   myDiagram[panel].id = id;
   myDiagram[panel].panel = panel;
      
      // Define the appearance and behavior for Nodes:
    // First, define the shared context menu for all Nodes, Links, and Groups.
    // To simplify this code we define a function for creating a context menu button:
    function makeButton(text, action, visiblePredicate) {
      return $("ContextMenuButton",
               $(go.TextBlock, text),
               { click: action },
               // don't bother with binding GraphObject.visible if there's no predicate
               visiblePredicate ? new go.Binding("visible", "", visiblePredicate).ofObject() : {});
    };
    // a context menu is an Adornment with a bunch of buttons in them
    var partContextMenu =
      $(go.Adornment,"Vertical",
          makeButton("Propriedades",
                     function(e, obj) {  // OBJ is this Button
                       var contextmenu = obj.part;  // the Button is in the context menu Adornment
                       var part = contextmenu.adornedPart;  // the adornedPart is the Part that the context menu adorns
                       // now can do something with PART, or with its data, or with the Adornment (the context menu)
                       if (part instanceof go.Link) 
                    	   alert(linkInfo(part.data));
                       else 
                    	   if (part instanceof go.Group) alert(groupInfo(contextmenu));
                       else 
                    	   nodeDoubleClick(e, obj);
                     }),
          makeButton("Associar novo skill",
                             function(e, obj) {
        	  			nodeDoubleClick(e, obj); 
               		  }),
          makeButton("Cortar",
                     function(e, obj) {
        	  e.diagram.commandHandler.cutSelection(); 
        	  },
                     function(o) {
        		  return o.diagram.commandHandler.canCutSelection(); 
        		  }),
          makeButton("Copiar",
                     function(e, obj) {
        	  e.diagram.commandHandler.copySelection(); 
        	  },
                     function(o) {
        		  return o.diagram.commandHandler.canCopySelection();
        		  }),
          makeButton("Colar",
                     function(e, obj) {
        	  e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint);
        	  },
                     function(o) {
        		  return o.diagram.commandHandler.canPasteSelection(); 
        		  }),
          makeButton("Remover",
                     function(e, obj) {
        	  e.diagram.commandHandler.deleteSelection(); 
        	  },
                     function(o) {
        		  return o.diagram.commandHandler.canDeleteSelection(); 
        		  }),
          makeButton("Desfazer",
                     function(e, obj) {
        	  e.diagram.commandHandler.undo(); 
        	  },
                     function(o) {
        		  return o.diagram.commandHandler.canUndo(); 
        		  }),
          makeButton("Refazer",
                     function(e, obj) {
        	  e.diagram.commandHandler.redo(); 
        	  },
                     function(o) {
        		  return o.diagram.commandHandler.canRedo();
        		  }),
          makeButton("Transformar em Grupo",
                     function(e, obj) {
        	  e.diagram.commandHandler.groupSelection();
        	  },
                     function(o) {
        		  return o.diagram.commandHandler.canGroupSelection(); 
        		  }),
          makeButton("Desfazer Grupo",
                     function(e, obj) {
        	  e.diagram.commandHandler.ungroupSelection(); 
        	  },
                     function(o) {
        		  return o.diagram.commandHandler.canUngroupSelection(); 
        		  })
      );

    // These nodes have text surrounded by a rounded rectangle
    // whose fill color is bound to the node data.
    // The user can drag a node by dragging its TextBlock label.
    // Dragging from the Shape will start drawing a new link.
   myDiagram[panel].nodeTemplate =
    	
      $(go.Node, "Auto",
    		  // salvar a posicao alterada, automaticamente altera o json
    		  new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        { locationSpot: go.Spot.Center },
        $(go.Shape, "RoundedRectangle",
          {
            fill: "white", // the default fill, if there is no data-binding
            portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
            // allow all kinds of links from and to this port
            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
          },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          {
            font: "bold 14px sans-serif",
            stroke: '#333',
            margin: 6,  // make some extra space for the shape around the text
            isMultiline: false,  // don't allow newlines in text
            editable: false  // allow in-place editing by user
          },
          new go.Binding("text", "text").makeTwoWay()),  // the label shows the node data's text
        { // this tooltip Adornment is shared by all nodes
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "#FFFFCC" }),
              $(go.TextBlock, { margin: 4 },  // the tooltip shows the result of calling nodeInfo(data)
                new go.Binding("text", "", nodeInfo))
            ),
          // this context menu Adornment is shared by all nodes
          contextMenu: partContextMenu
        }
      );

    // The link shape and arrowhead have their stroke brush data bound to the "color" property
   myDiagram[panel].linkTemplate =
      $(go.Link,
        { relinkableFrom: true, relinkableTo: true },  // allow the user to relink existing links
        $(go.Shape,
          { strokeWidth: 2 },
          new go.Binding("stroke", "color")),
        $(go.Shape,
          { toArrow: "Standard", stroke: null },
          new go.Binding("fill", "color")),
        { // this tooltip Adornment is shared by all links
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "#FFFFCC" }),
              $(go.TextBlock, { margin: 4 },  // the tooltip shows the result of calling linkInfo(data)
                new go.Binding("text", "", linkInfo))
            ),
          // the same context menu Adornment is shared by all links
          contextMenu: partContextMenu
        }
      );

    // Groups consist of a title in the color given by the group node data
    // above a translucent gray rectangle surrounding the member parts
   myDiagram[panel].groupTemplate =
      $(go.Group, "Vertical",
        { selectionObjectName: "PANEL",  // selection handle goes around shape, not label
          ungroupable: true },  // enable Ctrl-Shift-G to ungroup a selected Group
        $(go.TextBlock,
          {
            font: "bold 19px sans-serif",
            isMultiline: false,  // don't allow newlines in text
            editable: false  // allow in-place editing by user
          },
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "color")),
        $(go.Panel, "Auto",
          { name: "PANEL" },
          $(go.Shape, "Rectangle",  // the rectangular shape around the members
            { fill: "rgba(128,128,128,0.2)", stroke: "gray", strokeWidth: 3 }),
          $(go.Placeholder, { padding: 10 })  // represents where the members are
        ),
        { // this tooltip Adornment is shared by all groups
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "#FFFFCC" }),
              $(go.TextBlock, { margin: 4 },
                // bind to tooltip, not to Group.data, to allow access to Group properties
                new go.Binding("text", "", groupInfo).ofObject())
            ),
          // the same context menu Adornment is shared by all groups
          contextMenu: partContextMenu
        }
      );
    // provide a tooltip for the background of the Diagram, when not over any Part
   myDiagram[panel].toolTip =
      $(go.Adornment, "Auto",
        $(go.Shape, { fill: "#FFFFCC" }),
        $(go.TextBlock, { margin: 4 },
          new go.Binding("text", "", diagramInfo))
      );
    // provide a context menu for the background of the Diagram, when not over any Part
   myDiagram[panel].contextMenu =
      $(go.Adornment, "Vertical",
          makeButton("Incluir novo skill",
                      function(e, obj) { partCreated(e, obj) }),
          makeButton("Incluir novo skill",
                      function(e, obj) { partCreated(e, obj) }),
          makeButton("Colar",
                     function(e, obj) { e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint); },
                     function(o) { return o.diagram.commandHandler.canPasteSelection(); }),
          makeButton("Desfazer",
                     function(e, obj) { e.diagram.commandHandler.undo(); },
                     function(o) { return o.diagram.commandHandler.canUndo(); }),
          makeButton("Refazer",
                     function(e, obj) { e.diagram.commandHandler.redo(); },
                     function(o) { return o.diagram.commandHandler.canRedo(); })
      );
    // Create the Diagram's Model:

   if (diagramaDesc){
   		myDiagram[panel].model = new go.GraphLinksModel(diagramaDesc.documento.diagrama.nodeDataArray, diagramaDesc.documento.diagrama.linkDataArray);
   }else{
	   jQuery.ajax({
	        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/obter_com_categoria?id=" + id,
	        contentType: "application/json; charset=utf-8",
	        dataType: 'json',
	        async: false,
	        success: function(data) {
	        	var i = 0;
	        	var j = 3;
	        	while (i < data.documento.diagrama.nodeDataArray.length) {
	        		if (data.documento.diagrama.nodeDataArray[i].text == "") {
	        			data.documento.diagrama.nodeDataArray.splice(i, 1);	
	        			i = i - 1;
	        		}else{
		        		if (typeof data.documento.diagrama.nodeDataArray[i].isGroup != 'undefined') {
			        		if (data.documento.diagrama.nodeDataArray[i].isGroup) {
			        			data.documento.diagrama.nodeDataArray.splice(i, 1);	
			        			i = i - 1;
			        		};
		        		}else{
			        		if (typeof data.categorias[i] != 'undefined' &&
			        			typeof data.categorias[i].panel[0] != 'undefined' &&
			        			typeof data.categorias[i].panel[0].fields[4].valor != 'undefined') {
			        			data.documento.diagrama.nodeDataArray[i].group = data.categorias[i].panel[0].fields[4].valor;
			        		};
		        		};
	        		};
	        		i++;
	        	};
	        	delete data["categorias"];
	        	localStorage.setItem("diagrama-" + panel, JSON.stringify(data));
	        	newNodeDataArray = criarGruposPadrao (data.documento.diagrama.nodeDataArray);
	        	myDiagram[panel].model = new go.GraphLinksModel(data.documento.diagrama.nodeDataArray, data.documento.diagrama.linkDataArray);
	        	}
	        }
	   );
   };
}


function nodeInfo(d) {  // Tooltip info for a node data object
    var str = "Node " + d.key + ": " + d.text + "\n";
    if (d.group)
      str += "member of " + d.group;
    else
      str += "top-level node";
    return str;
  };

  function singleClick(e, obj) {
  };
  
  // when a node is double-clicked, add a child to it
  function nodeDoubleClick(e, obj) {
	  if (localStorage.comparacao == "false"){
		  var node = e.diagram.selection.first();
		  localStorage.setItem("diagrama-" + e.diagram.id, e.diagram.model.toJson());
		  localStorage.setItem("panel", e.diagram.panel);
		  montaNodeDocumento(e, node.data.id, "8080/metis/rest/documento/atualizar", node.data.key, e.diagram.id, e.diagram.panel);
	//    var clicked = obj.part;
	//    if (clicked !== null) {
	//      var thisemp = clicked.data;
	//        myDiagram[panel].startTransaction("add employee");
	//        var nextkey = (myDiagram[panel].model.nodeDataArray.length + 1).toString();
	//        var newemp = { key: nextkey, name: "(new person)", title: "", parent: thisemp.key };
	//        myDiagram[panel].model.addNodeData(newemp);
	//        myDiagram[panel].commitTransaction("add employee");
	  }else{
		  var node = e.diagram.selection.first();
		  montaNodeDocumento(e, node.data.id, "8080/metis/rest/diagrama/atualizar", node.data.key, e.diagram.id, e.diagram.panel);		  
	  };
  };
  
  // when a node is double-clicked, add a child to it
  function partCreated(e, obj) {
	  var node = e.diagram.selection.first();
	  localStorage.setItem("diagrama-" + e.diagram.id, e.diagram.model.toJson());
	  var linha = 
			'<a id="nova_habilidade-' + localStorage.idModeloHabilidade + '" href="nova-habilidade.html?' + localStorage.idModeloHabilidade + '&' + localStorage.ModeloHabilidade + '&' + node.data.key + '&' + e.diagram.id + '&' + e.diagram.panel + '" rel="external" data-transition="flip">Nova Habilidade</a>';
	  $("#div-incluirHabilidaddeButton").append(linha);
	  document.location.replace('dialog-habilidades-lista.html?' + localStorage.idModeloHabilidade + '&' + localStorage.ModeloHabilidade + '&' + node.data.key + '&' + e.diagram.id + '&' + e.diagram.panel );	  
//	
//	localStorage.setItem("diagrama-" + e.diagram.id, e.diagram.model.toJson());
//	localStorage.setItem("panel", e.diagram.panel);
//  	montaModeloLista(node.data.key, e.diagram.id, e.diagram.panel); 
//  	jQuery("#nodeNewObject").popup( "open" );
//  	localStorage.setItem("dialogOpen", "true");
//  	save(e);
  };

  // when a node is double-clicked, add a child to it
  function selectionMove(e, obj) {
	var node = e.diagram.selection.first();
  	var p = node.location.copy();
  	node.location = p;
  	save(e);
  };

  function onSelectionChanged(e) {
      var node = e.diagram.selection.first();
      if (node instanceof go.Node) {
        updateProperties(node.data);
      } else {
        updateProperties(null);
      }
    }
  // Update the HTML elements for editing the properties of the currently selected node, if any
  function updateProperties(data) {
    if (data === null) {
      console.log ("click null");
    } else {
  	  console.log("key "  + data.key );
  	  console.log("text " + data.text );
  	  console.log("color " + data.color );
  	  console.log("id " + data.id );
    }
  }
// This is called when the user has finished inline text-editing
function onTextEdited(e) {
//  	var tb = e.subject;
//  	if (tb === null || !tb.name) return;
//  	var node = tb.part;
//  	if (node instanceof go.Node) {
//    	updateProperties(node.data);
//  	}
//  	save(e);
  	var node = e.diagram.selection.first();
  	localStorage.setItem("diagrama-" + e.diagram.id, e.diagram.model.toJson());
  	localStorage.setItem("panel", e.diagram.panel);
  	montaNodeDocumento(e, node.data.id, "8080/metis/rest/documento/atualizar", node.data.key, e.diagram.id, e.diagram.panel);
}

// Define the appearance and behavior for Links:
function linkInfo(d) {  // Tooltip info for a link data object
  return "Link:\nfrom " + d.from + " to " + d.to;
}

// Define the appearance and behavior for Groups:
function groupInfo(adornment) {  // takes the tooltip or context menu, not a group node data object
  var g = adornment.adornedPart;  // get the Group that the tooltip adorns
  var mems = g.memberParts.count;
  var links = 0;
  g.memberParts.each(function(part) {
    if (part instanceof go.Link) links++;
  });
  return "Group " + g.data.key + ": " + g.data.text + "\n" + mems + " members including " + links + " links";
}

// Define the behavior for the Diagram background:
function diagramInfo(model) {  // Tooltip info for the diagram's model
  return "Model:\n" + model.nodeDataArray.length + " nodes, " + model.linkDataArray.length + " links";
}

// Update the data fields when the text is changed
function updateData(text, field, panel) {
  var node =myDiagram[panel].selection.first();
  // maxSelectionCount = 1, so there can only be one Part in this collection
  var data = node.data;
  if (node instanceof go.Node && data !== null) {
    var model =myDiagram[panel].model;
    model.startTransaction("modified " + field);
    if (field === "name") {
      model.setDataProperty(data, "name", text);
    } else if (field === "title") {
      model.setDataProperty(data, "title", text);
    } else if (field === "comments") {
      model.setDataProperty(data, "comments", text);
    }
    model.commitTransaction("modified " + field);
  }
}

// Save the diagram's model in DB
function save(e) {

	if (localStorage.comparacao == "false"){
		var objJson = JSON.parse(localStorage.getItem("diagrama-" + e.diagram.panel));
		var objDiagrama = JSON.parse(e.diagram.model.toJson());
		var i = 0;
		while (i < objJson.documento.diagrama.nodeDataArray.length) {
    		if (objJson.documento.diagrama.nodeDataArray[i].text == "") {
    			objJson.documento.diagrama.nodeDataArray.splice(i, 1);	
    			i = i - 1;
//    		}else{
//        		if (typeof objJson.documento.diagrama.nodeDataArray[i].isGroup != 'undefined') {
//	        		if (objJson.documento.diagrama.nodeDataArray[i].isGroup) {
//	        			objJson.documento.diagrama.nodeDataArray.splice(i, 1);	
//	        			i = i - 1;
//	        		};
//        		};
    		};
			i++;
		};
		objJson.documento.diagrama.nodeDataArray = objDiagrama.nodeDataArray;
		objJson.documento.diagrama.linkDataArray = objDiagrama.linkDataArray;
		$.ajax({
			type: "POST",
		       url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/atualizar",
		       contentType: "application/json; charset=utf-8",
		       dataType: 'json',
		       data : JSON.stringify(objJson),
		       success: function(data) {
		       }
		});
		myDiagram[panel].isModified = false;
	};
}

function load() {
}

function montaNodeDocumento(e, id, acao, key, idDiagrama, panel){
	$('.cabecalho').remove();
	$('.painel').remove();
	
	$.ajax({
        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/obter?id=" + id,
        contentType: "application/json; charset=utf-8",
        dataType: 'json'
	})
  	.done(function(data) {
  	  console.log ("obter documento saiu por done");
      localStorage.setItem("dadosSaved", JSON.stringify(data));
      montaCabecalho(data.documento.header, id, "false", "");
      var heightCabecalho = $("#cabecalho-detalhes").height();
      var panelLabelList = [];
      $.each(data.documento.panel, function(i, panelDocumento){
    	  var panelId = panelDocumento.label.replace( /\s/g, '' ) + i;
    	  var panelLabel = panelDocumento.label;
    	  panelLabelList[i] = panelDocumento.label;
    	  inicioPanel(panelId, panelLabel, i, panelDocumento);
    	  var objJsonOriginal = JSON.parse(localStorage.getItem("diagrama-0"));
    	  $.each(objJsonOriginal.documento.diagrama.nodeDataArray, function(w, nodeOriginal){
    		  if (nodeOriginal.id == id) {
    			  if (objJsonOriginal.documento.diagrama.nodeDataArray[w].color == localStorage.corComparacao){
    				  $('.titulo-documento').html("Exclui de " + localStorage.labelComparacao);
    			  }else{
    				  $('.titulo-documento').html("Incluir em " + localStorage.labelComparacao);
    			  };
    		  };
    	  });
    	  $.each(panelDocumento.fields, function(z, item){
    		  montaCampos(i, panelId, z, item, "detalhes", id, "false", "");
    	  });
    	  finalPanel(panelId, panelLabel, i, panelDocumento);
    	  inicializaWindow();
    	  $("#popupDetalhes").popup( "open" );
      });
    })
	.fail(function(data) {
		console.log ("obter documento saiu por fail");
		incluirDocumento("Habilidades", "perdeu documento");
		data = JSON.parse(localStorage.getItem("dadosSaved"));
		id = data.documento.id;
	    montaCabecalho(data.documento.header, id, "false", "");
	    var heightCabecalho = $("#cabecalho-detalhes").height();
	    var panelLabelList = [];
	    $.each(data.documento.panel, function(i, panelDocumento){
	    	var panelId = panelDocumento.label.replace( /\s/g, '' ) + i;
	    	var panelLabel = panelDocumento.label;
	    	panelLabelList[i] = panelDocumento.label;
	    	inicioPanel(panelId, panelLabel, i, panelDocumento);
	    	var objJsonOriginal = JSON.parse(localStorage.getItem("diagrama-0"));
	    	$.each(objJsonOriginal.documento.diagrama.nodeDataArray, function(w, nodeOriginal){
	    		if (nodeOriginal.id == id) {
	    			if (objJsonOriginal.documento.diagrama.nodeDataArray[w].color == localStorage.corComparacao){
	    				$('.titulo-documento').html("Exclui de " + localStorage.labelComparacao);
	    			}else{
	    				$('.titulo-documento').html("Incluir em " + localStorage.labelComparacao);
	    			};
	    		};
	    	});
	    	$.each(panelDocumento.fields, function(z, item){
	    		montaCampos(i, panelId, z, item, "detalhes", id, "false", "");
	    	});
	    	finalPanel(panelId, panelLabel, i, panelDocumento);
	    	inicializaWindow();
	    	$("#popupDetalhes").popup( "open" );
	    });
	})
	.always(function(data) {
		console.log ("obter documento saiu por always");
	});

	// setar acao para botao submit
	$( ".submitButton" ).unbind( "click");
	$( ".submitButton" ).bind( "click", function(event, ui) {
		var dataSaved = localStorage.getItem("dadosSaved");
		var objJson = JSON.parse(dataSaved);
		objJson.documento.id = id;
		objJson.documento.usuarioAtual = localStorage.usuario;
		objJson.documento.tipo = "dados";
		objJson.documento.situacao = "ativo";
		objJson.documento.usuarios[0].codigo = localStorage.usuario;
		if (localStorage.comparacao == "false"){
			$.ajax({
				type: "POST",
	            url: "http://" + localStorage.urlServidor + ":" + acao,
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
	       		console.log ("inclusão diagrama saiu por always");
	       		if (acao.split("/")[4] == "incluir") {
	       			incluiSkill ($("#nomePainel" ).val(), data.responseText);
	       		};
	       		atualizaNode(id, key, idDiagrama, panel, objJson.documento.header[0].valor, objJson.documento.header[1].valor);
	       	});
			$("#popupDetalhes" ).popup( "close" );
			setTimeout('skillInicial("YggMap");',200);
		}else{
			console.log ("comparacao");
			$("#popupDetalhes" ).popup( "close" );
			$("#skill-yggmap0").remove();
			montaPanel("yggmap0", "YggMap");
			var objJsonOriginal = JSON.parse(localStorage.getItem("diagrama-0"));
			var objJsonCompara = JSON.parse(localStorage.getItem("diagrama-1"));
    		$.each(objJsonOriginal.documento.diagrama.nodeDataArray, function(w, nodeOriginal){
    			if (typeof nodeOriginal.id != 'undefined') {
	    			if (nodeOriginal.id == id) {
	    				if (objJsonOriginal.documento.diagrama.nodeDataArray[w].color == localStorage.corComparacao){
	    					objJsonOriginal.documento.diagrama.nodeDataArray[w].color = "white";
	    					$.each(objJsonCompara.documento.diagrama.nodeDataArray, function(z, nodeCompara){
	    		    			if (typeof nodeCompara.id != 'undefined') {
		    						if (nodeCompara.id == id) {
		    							objJsonCompara.documento.diagrama.nodeDataArray.splice(z, 1);
		    	    					localStorage.setItem("diagrama-1", JSON.stringify(objJsonCompara));
		    	    					atualizaComparacao();
		    						};
	    						};
	    					});
	    				}else{
	    					objJsonOriginal.documento.diagrama.nodeDataArray[w].color = localStorage.corComparacao;
	    					var new_node = '{"loc":"50 50","key":"1","text":"' + objJson.documento.header[0].valor + '","color":"' + objJson.documento.header[1].valor + '","id":"' + id + '"}';
	    					var objNode = JSON.parse(new_node);
	    					objJsonCompara.documento.diagrama.nodeDataArray.push(objNode);
	    					localStorage.setItem("diagrama-1", JSON.stringify(objJsonCompara));
	    					atualizaComparacao();
	    				};
	    			};
				};
    		});
        	localStorage.setItem("diagrama-0", JSON.stringify(objJsonOriginal));
			init("myDiagram-yggmap0", 0, 0, JSON.parse(localStorage.getItem("diagrama-0")) );
		};
	});	
};

function montaModeloLista(key, idDiagrama, panel) {	
	$(function() {
		$.ajax({
			url : "http://" + localStorage.urlServidor + ":8080/metis/rest/documento/modelos?tipoLista=validos",
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
			success : function(data) {
				var dados = JSON.stringify(data);
				$(".linha-modelo").remove();
				$.each(data, function(i, modelos, id) {
					var obj = JSON.stringify(modelos);
					var idModelo = modelos._id;
					montaLinhaModelos(i, modelos, key, idDiagrama, idModelo, panel);
				});
				inicializaWindow();
				$('ul').listview('refresh');
			}
		});
	});
};

function montaLinhaModelos(i, modelos, key, idDiagrama, idModelo, panel) {
	var linha = '' + 
				'<li class="ui-body linha-modelo">';
	
	if (modelos.modelo == "badges"){
		linha = linha +
					'<a id="item-' + i + '"href="dialog-skill-lista.html?badges&group' + '&' + idDiagrama + '&' + panel + '&' + key + '&' +'" rel="external" data-transition="flip" data-close-btn-text="Cancel">'
	}else {
		linha = linha +
					'<a id="item-' + i + '"href="dialog-habilidades-lista.html?' + idModelo + '&' + modelos.modelo + '&' + key + '&' + idDiagrama + '&' + panel + '" rel="external" data-transition="flip" data-close-btn-text="Cancel">'
	};
	linha = linha +
			'<h2>' + modelos.modelo + '</h2>' +
			'</li>';
    $('#nova_habilidade-' + i).bind( "click", function(event, ui) {
    	montaNodeDocumento(idModelo, "8080/metis/rest/documento/incluir", key, idDiagrama, panel);
    });
					
	$("#tabela-modelos").append(linha);
};

function atualizaComparacao() {

	if (localStorage.comparacao == "true"){
		var objJson = JSON.parse(localStorage.getItem("diagrama-1"));
		$.ajax({
			type: "POST",
		       url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/atualizar",
		       contentType: "application/json; charset=utf-8",
		       dataType: 'json',
		       data : JSON.stringify(objJson),
		       success: function(data) {
		       }
		});
		myDiagram[panel].isModified = false;
	};
};

