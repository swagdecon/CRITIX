import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.github.cdimascio.dotenv.Dotenv;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import static com.mongodb.client.model.Filters.eq;

import org.bson.Document;

import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Instant;
import java.util.Scanner;
import java.util.Timer;
import java.util.TimerTask;

public class APIFetchToMongoDB {

  // Instance Variables:
  private static String DB_NAME;
  private static String movieUrl;
  private static String mongoDbUrl;
  private static String collectionUpcomingMovies;

  public APIFetchToMongoDB() {
    Dotenv dotenv = Dotenv.load();
    
    String mongoDatabase = dotenv.get("MONGO_DATABASE");
    String mongoUser = dotenv.get("MONGO_USER");
    String mongoPassword = dotenv.get("MONGO_PASSWORD");
    String mongoCluster = dotenv.get("MONGO_CLUSTER");
    String upcomingMovies = dotenv.get("UPCOMING_MOVIES");
    String tmdbApiKey = dotenv.get("TMDB_API_KEY");

    DB_NAME = mongoDatabase;
    collectionUpcomingMovies = upcomingMovies;
    movieUrl = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + tmdbApiKey + "&language=en-US&page=1";
    mongoDbUrl = "mongodb+srv://" + mongoUser + ":" + mongoPassword + "@" + mongoCluster;

    System.out.println("Movie URL: " + movieUrl);
    System.out.println("MongoDB URL: " + mongoDbUrl);
  }

  public static void main(String[] args) {
    APIFetchToMongoDB apiFetchToMongoDB = new APIFetchToMongoDB();
    apiFetchToMongoDB.fetchAndSave();

    // Create a new TimerTask to call fetchAndSave method every 7 days
    TimerTask task = new TimerTask() {
      public void run() {
        apiFetchToMongoDB.fetchAndSave();
      }
    };

    // Create a new Timer object with the name "Timer"
    Timer timer = new Timer("Timer");

    // Get the current time
    Instant now = Instant.now();

    // Schedule the TimerTask to run every 7 days, starting from the now
    timer.scheduleAtFixedRate(task, java.util.Date.from(now), 1000L * 60L * 60L * 24L * 7L);
  }

  private void fetchAndSave() {
    try {
      URL url = new URL(movieUrl);
      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
      connection.setRequestMethod("GET");
      connection.setRequestProperty("Accept", "application/json");
  
      if (connection.getResponseCode() != 200) {
        throw new RuntimeException("Failed : HTTP error code : " + connection.getResponseCode());
      }
  
      Scanner scanner = new Scanner(connection.getInputStream()); // create a Scanner to read the input stream from the connection
      StringBuilder response = new StringBuilder(); // create a StringBuilder to store the response
      while (scanner.hasNextLine()) { // loop until all lines have been read
        response.append(scanner.nextLine()); // append each line to the response
      }
      scanner.close();
      connection.disconnect();
  
      ObjectMapper objectMapper = new ObjectMapper(); // create an instance of ObjectMapper
      JsonNode jsonNode = objectMapper.readTree(response.toString()); // parse the response string into a JsonNode object
      JsonNode resultsArray = jsonNode.get("results"); // get the "results" array from the JsonNode
  
      MongoClient mongoClient = MongoClients.create(mongoDbUrl); // create a MongoClient using the MONGO_DB_URI
      MongoDatabase database = mongoClient.getDatabase(DB_NAME); // get the database using DB_NAME
      MongoCollection<Document> collection = database.getCollection(collectionUpcomingMovies); // get the collection using COLLECTION_NAME
  
      for (JsonNode result : resultsArray) {
        String resultJson = objectMapper.writeValueAsString(result); // convert the JsonNode object to a string
        Document document = Document.parse(resultJson); // parse the string to a Document object
        
        // Check if the document already exists
        Document existingDocument = collection.find(eq("id", document.get("id"))).first();
        if (existingDocument == null) {
          // If the document does not exist, insert it
          collection.insertOne(document);
          System.out.println("Data saved to MongoDB: " + document);
        } else {
          // If the document already exists, log a message
          System.out.println("No new data fetched from the API, data already exists in MongoDB: " + document);
        }
      }      
    } catch (Exception error) {
      error.printStackTrace();
    }
  }
}
