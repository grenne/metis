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
		public Diagrama diagrama;


		public Documento() {

		}

		@JsonCreator
		public Documento(String id, Diagrama diagrama) {
			this.id = id;
			this.diagrama = diagrama;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getId() {
			return this.id;
		}

		@Override
		public String toString() {
			return new StringBuffer(" Id : ").append(this.id).append(" Diagrama : ").append(this.diagrama).toString();
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
                public String key;
                public String text;
                public String color;
                public String group;
                public String isGroup;
                public String id;
       

                public NodeDataArray() {

    			}

                @JsonCreator
                public NodeDataArray(String key, String text, String color, String group, String isGroup, String id){
                    this.key = key;
                    this.text = text;
                    this.color = color;
                    this.group = group;
                    this.isGroup = isGroup;
                    this.id = id;
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