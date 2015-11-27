/*
 * montagem do diagrama
 */


function init(diagrama, panelReceive, idReceive) {

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
          // allow double-click in background to create a new node
          "clickCreatingTool.archetypeNodeData": { text: "", color: "orange" },
          // allow Ctrl-G to call groupSelection()
          "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, color: "blue" },
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
      $(go.Adornment, "Vertical",
          makeButton("Propriedades",
                     function(e, obj) {  // OBJ is this Button
                       var contextmenu = obj.part;  // the Button is in the context menu Adornment
                       var part = contextmenu.adornedPart;  // the adornedPart is the Part that the context menu adorns
                       // now can do something with PART, or with its data, or with the Adornment (the context menu)
                       if (part instanceof go.Link) alert(linkInfo(part.data));
                       else if (part instanceof go.Group) alert(groupInfo(contextmenu));
                       else alert(nodeInfo(part.data));
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
            editable: true  // allow in-place editing by user
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
            editable: true  // allow in-place editing by user
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
    var a =  [
              { key:1, text: "Alpha", color: "lightblue" },
              { key:2, text:  "Beta", color: "orange" },
              { key:3, text:  "Gamma", color: "lightgreen" },
              { key:4, text:  "Delta", color: "pink" }
            ];

    var b = [
              { from: 1, to: 2 },
              { from: 3, to: 2 },
              { from: 4, to: 2 }
            ];
//   myDiagram[panel].model = new go.GraphLinksModel(a, b);
    // Create the Diagram's Model:
//    jQuery(function(){
    	jQuery.ajax({
            url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/obter?id=" + id,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            async: false,
            success: function(data) {
            	localStorage.setItem("diagrama-" + panel, JSON.stringify(data));
            	myDiagram[panel].model = new go.GraphLinksModel(data.documento.diagrama.nodeDataArray, data.documento.diagrama.linkDataArray);
            }
		});
//	});
}


function nodeInfo(d) {  // Tooltip info for a node data object
    var str = "Node " + d.key + ": " + d.text + "\n";
    if (d.group)
      str += "member of " + d.group;
    else
      str += "top-level node";
    return str;
  };

  
  // when a node is double-clicked, add a child to it
  function nodeDoubleClick(e, obj) {
  	var node = e.diagram.selection.first();
  	jQuery("#key").val(node.data.key);
  	jQuery("#text").val(node.data.text);
  	jQuery("#color").val(node.data.color);
  	jQuery("#id").val(node.data.id);
  	jQuery( "#nodePropertiesCarreira" ).popup( "open" );
//      var clicked = obj.part;
//      if (clicked !== null) {
//        var thisemp = clicked.data;
//        myDiagram[panel].startTransaction("add employee");
//        var nextkey = (myDiagram[panel].model.nodeDataArray.length + 1).toString();
//        var newemp = { key: nextkey, name: "(new person)", title: "", parent: thisemp.key };
//        myDiagram[panel].model.addNodeData(newemp);
//        myDiagram[panel].commitTransaction("add employee");
  };
  
  // when a node is double-clicked, add a child to it
  function partCreated(e, obj) {
  	var node = e.diagram.selection.first();
  	jQuery("#key").val(node.data.key);
  	jQuery("#atualizaCarreira").hide();
  	jQuery("#table-campos").hide();
  	jQuery("#confirmaSolicitacao").show();
  	jQuery("#div-select-tipos").show();
  	jQuery("#nodeNewObject").popup( "open" );
  	jQuery("#nodeNewObject").popup("reposition", {positionTo: 'origin'});
  	save(e);
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
  	var tb = e.subject;
  	if (tb === null || !tb.name) return;
  	var node = tb.part;
  	if (node instanceof go.Node) {
    	updateProperties(node.data);
  	}
  	save(e);
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

	var objJson = JSON.parse(localStorage.getItem("diagrama-" + e.diagram.panel));
		var objDiagrama = JSON.parse(e.diagram.model.toJson());
		objJson.documento.diagrama.nodeDataArray = objDiagrama.nodeDataArray;
		objJson.documento.diagrama.linkDataArray = objDiagrama.linkDataArray;
		$.ajax({
			type: "POST",
	        url: "http://" + localStorage.urlServidor + ":8080/metis/rest/diagrama/atualizar?id=" + e.diagram.id,
	        contentType: "application/json; charset=utf-8",
	        dataType: 'json',
	        data : JSON.stringify(objJson),
	        success: function(data) {
	        	console.log ("terminou atualização id:" + e.diagram.id + " panel:" + e.diagram.panel + " data:" + JSON.stringify(data));
	        }
		});
	myDiagram[panel].isModified = false;
}

function load() {
}

