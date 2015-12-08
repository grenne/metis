package com.TKiDe.services;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Iterator;
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
@Path("/documento")
public class Documentos {

	@Path("/login")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject login(@QueryParam("usuario") String usuario, @QueryParam("senha") String senha) throws UnknownHostException, MongoException {
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("usuarios");
		BasicDBObject setUsu = new BasicDBObject();
		setUsu.put("usu.usuario",usuario);
		setUsu.put("usu.senha",senha);
		DBObject cursor = collection.findOne(setUsu);
		JSONObject documento = new JSONObject();
		BasicDBObject obj = (BasicDBObject) cursor.get("usu");
		documento.put("usu", obj);
		mongo.close();
		return documento;
	};

	@Path("/lista")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray ObterLista( @QueryParam("modelo") String modelo ) throws UnknownHostException, MongoException, ParseException {

		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");

		BasicDBObject setQuery = new BasicDBObject();
		setQuery.put("documento.modelo", modelo);
		setQuery.put("documento.tipo", "dados");
		DBCollection collection = db.getCollection("documentos");
		DBCursor cursor = collection.find(setQuery);
		cursor.sort(new BasicDBObject("documento.header[0].valor", 1));
		JSONArray documentos = new JSONArray();
		
		while (((Iterator<DBObject>) cursor).hasNext()) {
			JSONObject jsonObject; 
			JSONParser parser = new JSONParser(); 
			BasicDBObject obj = (BasicDBObject) ((Iterator<DBObject>) cursor).next();
			String documento = obj.getString("documento");
			System.out.println(documento);
			jsonObject = (JSONObject) parser.parse(documento);
			String _id = obj.getString("_id");
			JSONObject jsonDocumento = new JSONObject();
			jsonDocumento.put("_id", _id);
			jsonDocumento.put("documento", jsonObject);
			documentos.add(jsonDocumento);
		};
		mongo.close();
		return documentos;
	};
	
	@Path("/modelos")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONArray ObterModelos(@QueryParam("tipoLista") String tipo) throws UnknownHostException, MongoException, ParseException {

		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");

		BasicDBObject setQuery = new BasicDBObject();
		setQuery.put("documento.tipo", "modelo");
		if(tipo.equals("validos")){
			setQuery.put("documento.situacao", "valido");	
		};
		DBCollection collection = db.getCollection("documentos");
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
			jsonDocumento.put("modelo", jsonObject.get("modelo"));
			jsonDocumento.put("tipo", jsonObject.get("tipo"));
			jsonDocumento.put("situacao", jsonObject.get("situacao"));
			documentos.add(jsonDocumento);
		};
		mongo.close();
		return documentos;
	};

	@Path("/obter")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject ObterDocumento(@QueryParam("id") String id) throws UnknownHostException, MongoException {
		ObjectId _id = new ObjectId(id);
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("documentos");
		BasicDBObject searchQuery = new BasicDBObject("_id",_id);
		DBObject cursor = collection.findOne(searchQuery);
		JSONObject documento = new JSONObject();
		BasicDBObject obj = (BasicDBObject) cursor.get("documento");
		documento.put("documento", obj);
		mongo.close();
		return documento;
	};

	@Path("/obter/modelo")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject ObterModeloDocumento(@QueryParam("modelo") String modelo) throws UnknownHostException, MongoException {
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("documentos");
		BasicDBObject setQuery = new BasicDBObject();
		setQuery.put("documento.modelo", modelo);
		setQuery.put("documento.tipo", "modelo");
		DBObject cursor = collection.findOne(setQuery);
		JSONObject documento = new JSONObject();
		BasicDBObject obj = (BasicDBObject) cursor.get("documento");
		documento.put("documento", obj);
		mongo.close();
		return documento;
	};

	@Path("/atualizar")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String AtualizarDocumento(Document doc) throws MongoException, JsonParseException, JsonMappingException, IOException {
		ObjectId _id = new ObjectId(doc.documento.id.toString());
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("documentos");
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
		return cursor.get("_id").toString();
	};

	@Path("/incluir")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String IncluirDocumento(Document doc) throws MongoException, JsonParseException, JsonMappingException, IOException {
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("documentos");
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

	};
	
	@Path("/excluir")	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response ExcluirDocumento(@QueryParam("id") String id) throws UnknownHostException, MongoException {
		ObjectId _id = new ObjectId(id);
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("documentos");
		BasicDBObject searchQuery = new BasicDBObject("_id",_id);
		collection.remove(searchQuery);
		mongo.close();
		return Response.status(200).entity(id).build();
	};
};
