package com.TKiDe.services;

import org.codehaus.jackson.annotate.JsonCreator;

public class Diagram {

	public Documento documento;

	public Diagram() {

	}

	public Diagram(Documento documento) {
		this.documento = documento;
	}

	public void setDocumento( Documento documento) {
		this.documento = documento;
	}

	public Documento getDocumento() {
		return this.documento;
	}

	@Override
	public String toString() {
		return new StringBuffer(" Documento : ").append(this.documento).toString();
	}

	public static final class Documento {

		public String id;
		public String tipo;
		public String label;
		
		public Diagrama diagrama;


		public Documento() {

		}

		@JsonCreator
		public Documento(String id, String tipo, String label, Diagrama diagrama) {
			this.id = id;
			this.tipo = tipo;
			this.label = label;
			this.diagrama = diagrama;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getId() {
			return this.id;
		}

		public void setTipo(String tipo) {
			this.tipo = tipo;
		}

		public String getTipo() {
			return this.tipo;
		}

		@Override
		public String toString() {
			return new StringBuffer(" Id : ").append(this.id).append(" tipo : ").append(this.tipo).toString();
		}



		public static final class Diagrama {
			public NodeDataArray[] nodeDataArray;
			public LinkDataArray[] linkDataArray;

			public Diagrama() {

			}

			@JsonCreator
			public Diagrama(NodeDataArray[] nodeDataArray, LinkDataArray[] linkDataArray) {
				this.nodeDataArray = nodeDataArray;
				this.linkDataArray = linkDataArray;
			}

			public static final class NodeDataArray {
				public String loc;
                public String key;
                public String text;
                public String color;
                public String group;
                public String isGroup;
                public String id;
                public String principal;
       

                public NodeDataArray() {

    			}

                @JsonCreator
                public NodeDataArray(String loc, String key, String text, String color, String group, String isGroup, String id, String principal){
                    this.loc = loc;
                    this.key = key;
                    this.text = text;
                    this.color = color;
                    this.group = group;
                    this.isGroup = isGroup;
                    this.id = id;
                    this.principal = principal;
                }
            }

			public static final class LinkDataArray {
                public String from;
                public String to;
                public String color;
       

                public LinkDataArray() {

    			}

                @JsonCreator
                public LinkDataArray(String label){
                    this.from = from;
                    this.to = to;
                    this.color = color;
                }
            }
		}
	}
}