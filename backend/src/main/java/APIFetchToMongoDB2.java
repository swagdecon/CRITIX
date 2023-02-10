import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import io.github.cdimascio.dotenv.Dotenv;

import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.core.MovieResultsPage;

import static com.mongodb.client.model.Filters.eq;
import org.bson.Document;

import java.util.Timer;
import java.util.TimerTask;

public class APIFetchToMongoDB2 {
  private static String DB_NAME;
  private static String mongoDbUrl;
  private static String collectionUpcomingMovies;
  private static String tmdbApiKey;
  private TmdbApi tmdbApi;

  public APIFetchToMongoDB2() {
    Dotenv dotenv = Dotenv.load();

    String mongoDatabase = dotenv.get("MONGO_DATABASE");
    String mongoUser = dotenv.get("MONGO_USER");
    String mongoPassword = dotenv.get("MONGO_PASSWORD");
    String mongoCluster = dotenv.get("MONGO_CLUSTER");
    String upcomingMovies = dotenv.get("UPCOMING_MOVIES");
    String tmdbApiKey = dotenv.get("TMDB_API_KEY");

    DB_NAME = mongoDatabase;
    collectionUpcomingMovies = upcomingMovies;
    mongoDbUrl = "mongodb+srv://" + mongoUser + ":" + mongoPassword + "@" + mongoCluster;

    System.out.println("MongoDB URL: " + mongoDbUrl);

    tmdbApi = new TmdbApi(tmdbApiKey);
  }

  public static void main(String[] args) {
    APIFetchToMongoDB2 apiFetchToMongoDB = new APIFetchToMongoDB2();
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
    long now = System.currentTimeMillis();

    // Schedule the TimerTask to run every 7 days, starting from the now
    timer.scheduleAtFixedRate(task, now, 1000 * 60 * 60 * 24 * 7);
  }

  private void fetchAndSave() {
    try {
      TmdbMovies tmdbMovies = tmdbApi.getMovies();
      MovieDb movie = tmdbMovies.getMovie(5353, "en");
      System.out.println(movie.getGenres());
      System.out.println(movie.getTagline());

      //Use the themoviedbapi library to retrieve the upcoming movies
      MovieResultsPage movies = tmdbMovies.getUpcoming("en-US", 1, "");

      // for (MovieDb movie: movies) {
      //   MongoClient mongoClient = MongoClients.create(mongoDbUrl);
      //   MongoDatabase database = mongoClient.getDatabase(DB_NAME);
      //   MongoCollection<Document> collection = database.getCollection(collectionUpcomingMovies);
      
      //   Document movieDocument = collection.find(eq("id", movie.getId())).first();

      //   if (movieDocument == null) {
      //     // Movie does not exist, save it to the database
      //     Document newMovie = new Document("id", movie.getId())
      //     .append("title", movie.getTitle())
      //     .append("overview", movie.getOverview())
      //     .append("posterPath", movie.getPosterPath())
      //     .append("adult", movie.isAdult())
      //     .append("backdrop_path", movie.getBackdropPath())
      //     // .append("genre_ids", movie.getGenres())
      //     .append("original_language", movie.getOriginalLanguage())
      //     .append("original_title", movie.getOriginalTitle())
      //     .append("popularity", movie.getPopularity())
      //     .append("release_date", movie.getReleaseDate())
      //     // .append("video", movie.getVideos())
      //     .append("vote_average", movie.getVoteAverage())
      //     .append("vote_count", movie.getVoteCount());
      //     collection.insertOne(newMovie);
      //     System.out.println("Data saved to MongoDB: " + newMovie);
      //   } else {
      //     // If the document already exists, log a message
      //     System.out.println("No new data fetched from the API, data already exists in MongoDB: " + movieDocument);
      //   }
      // }
    } catch (Exception error) {
      error.printStackTrace();
    }
  }
}