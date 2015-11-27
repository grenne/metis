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
@Path("/skill")
public class Skills {

	@Path("/obter")	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public JSONObject ObterDiagrama(@QueryParam("usuario") String usuario) throws UnknownHostException, MongoException {
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("skills");
		BasicDBObject searchQuery = new BasicDBObject("skill.usuario",usuario);
		DBObject cursor = collection.findOne(searchQuery);
		JSONObject documento = new JSONObject();
		BasicDBObject obj = (BasicDBObject) cursor.get("skill");
		documento.put("skill", obj);
		mongo.close();
		return documento;
	};

	@Path("/atualizar")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response AtualizarDocumento(AssociaSkill doc) throws MongoException, JsonParseException, JsonMappingException, IOException {
		ObjectId _id = new ObjectId(doc.skill.id.toString());
		Mongo mongo = new Mongo();
		DB db = (DB) mongo.getDB("documento");
		DBCollection collection = db.getCollection("skills");
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
	
};
