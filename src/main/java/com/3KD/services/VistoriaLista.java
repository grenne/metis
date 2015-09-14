package com.3KD.services;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class VistoriaLista {

	@SuppressWarnings("unchecked") 
	public static void main(String[] args) { //Cria um Objeto JSON JSONObject 
		jsonObject = new JSONObject(); FileWriter writeFile = null; //Armazena dados em um Objeto JSON 
		jsonObject.put("nome", "Allan"); 
		jsonObject.put("sobrenome", "Romanato"); 
		jsonObject.put("pais", "Brasil"); 
		jsonObject.put("estado", "SP"); 
		try{ 
			writeFile = new FileWriter("saida.json"); //Escreve no arquivo conteudo do Objeto JSON 
			writeFile.write(jsonObject.toJSONString()); 
			writeFile.close(); 
		} 
		catch(IOException e){ 
			e.printStackTrace(); 
		} //Imprimne na Tela o Objeto JSON para vizualiza��o 
		System.out.println(jsonObject); } 
		}
	};
};
