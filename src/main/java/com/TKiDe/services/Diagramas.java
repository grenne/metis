package com.TKiDe.services;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.inject.Singleton;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.bson.types.ObjectId;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoException;

@Singleton
// @Lock(LockType.READ)
@Path("/diagrama")
public class Diagramas {

	@Path("/obter")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject ObterDiagrama(@QueryParam("id") String id) throws UnknownHostException, MongoException {
		ObjectId _id = new ObjectId(id);
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("diagrams");
		BasicDBObject searchQuery = new BasicDBObject("_id",_id);
		DBObject cursor = collection.findOne(searchQuery);
		JSONObject documento = new JSONObject();
		BasicDBObject obj = (BasicDBObject) cursor.get("documento");
		documento.put("documento", obj);
		mongo.close();
		return documento;
	};

	@Path("/atualizar")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response AtualizarDocumento(Diagram doc) throws MongoException, JsonParseException, JsonMappingException, IOException {
		ObjectId _id = new ObjectId(doc.documento.id.toString());
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("diagrams");
		Gson gson = new Gson();
		String jsonDocumento = gson.toJson(doc);
		Map<String,String> mapJson = new HashMap<String,String>();
		ObjectMapper mapper = new ObjectMapper();
		mapJson = mapper.readValue(jsonDocumento, HashMap.class);
		JSONObject documento = new JSONObject();
		documento.putAll(mapJson);
		BasicDBObject update = new BasicDBObject("$set", new BasicDBObject(documento));
		BasicDBObject searchQuery = new BasicDBObject("_id",_id);
		DBObject cursor = collection.findAndModify(searchQuery,
                null,
                null,
                false,
                update,
                true,
                false);
		mongo.close();
		return Response.status(200).entity(doc).build();
	};

	 
	@Path("/incluir")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String IncluirDocumento(Diagram doc)  {
		Mongo mongo;
		try {
			mongo = new Mongo();
			DB db = (DB) mongo.getDB("documento");
			DBCollection collection = db.getCollection("diagrams");
			Gson gson = new Gson();
			String jsonDocumento = gson.toJson(doc);
			Map<String,String> mapJson = new HashMap<String,String>();
			ObjectMapper mapper = new ObjectMapper();
			mapJson = mapper.readValue(jsonDocumento, HashMap.class);
			JSONObject documento = new JSONObject();
			documento.putAll(mapJson);
			DBObject insert = new BasicDBObject(documento);
			collection.insert(insert);
			//
			// 			atualiza o id interno até eu descobrir como não precisar dele
			//
			doc.documento.id = insert.get("_id").toString();
			ObjectId _id = new ObjectId(insert.get("_id").toString());
			jsonDocumento = gson.toJson(doc);
			mapJson = mapper.readValue(jsonDocumento, HashMap.class);
			documento.putAll(mapJson);
			BasicDBObject update = new BasicDBObject("$set", new BasicDBObject(documento));
			BasicDBObject searchQuery = new BasicDBObject("_id",_id);
			DBObject cursor = collection.findAndModify(searchQuery,
	                null,
	                null,
	                false,
	                update,
	                true,
	                false);
			mongo.close();
			return insert.get("_id").toString();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			System.out.println("UnknownHostException");
			e.printStackTrace();
		} catch (MongoException e) {
			// TODO Auto-generated catch block
			System.out.println("MongoException");
			e.printStackTrace();
		} catch (JsonParseException e) {
			// TODO Auto-generated catch block
			System.out.println("JsonParseException");
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			System.out.println("JsonMappingException");
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("IOException");
			e.printStackTrace();
		}
		return "fail";
		
	};

	
	@Path("/lista")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray ObterModelos(@QueryParam("tipoLista") String tipo) throws UnknownHostException, MongoException, ParseException, IOException {

		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");

		BasicDBObject setQuery = new BasicDBObject();
		setQuery.put("documento.tipo", tipo);
		DBCollection collection = db.getCollection("diagrams");
		DBCursor cursor = collection.find(setQuery);
		JSONArray documentos = new JSONArray();
		
		while (((Iterator<DBObject>) cursor).hasNext()) {
			JSONObject jsonObject; 
			JSONParser parser = new JSONParser(); 
			BasicDBObject obj = (BasicDBObject) ((Iterator<DBObject>) cursor).next();
			String documento = obj.getString("documento");
			jsonObject = (JSONObject) parser.parse(documento);
			JSONObject jsonDocumento = new JSONObject();
			jsonDocumento.put("_id", obj.getString("_id"));
			jsonDocumento.put("tipo", jsonObject.get("tipo"));
			jsonDocumento.put("label", jsonObject.get("label"));
			String diagrama = jsonObject.get("diagrama").toString();
			System.out.println("diagrama - " + " - " + diagrama);
			JSONObject jsonDiagrama;
			jsonDiagrama = (JSONObject) parser.parse(diagrama);
			List nodes = (List) jsonDiagrama.get("nodeDataArray");
			Iterator itr = nodes.iterator();
			itr = nodes.iterator();
		    while(itr.hasNext()) {
		    	Object element = itr.next();
		        JSONObject jsonNode;
		        jsonNode = (JSONObject) parser.parse(element.toString());
		        try {
		        	String principal = jsonNode.get("principal").toString();
		        	if (principal.equals("true")) {
		        		try {
		        			String idDocumento = jsonNode.get("id").toString();
		        			ObjectId _id = new ObjectId(idDocumento);
		        			DBCollection docCollection = db.getCollection("documentos");
		        			BasicDBObject searchQuery = new BasicDBObject("_id",_id);
		        			DBObject docCursor = docCollection.findOne(searchQuery);
		        			JSONObject docDocumento = new JSONObject();
		        			BasicDBObject docObj = (BasicDBObject) docCursor.get("documento");
		        			jsonDocumento.put("documento", docObj);
		        			System.out.println(principal + " - " + docObj);
				        }catch (Exception e) {
					 		
				        }
		        	 }
		         }catch (Exception e) {
		 		}
		      }
			documentos.add(jsonDocumento);
		};
		mongo.close();
		return documentos;
	};

	
};
