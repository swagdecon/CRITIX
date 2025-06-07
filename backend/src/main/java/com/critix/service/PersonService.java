package com.critix.service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import com.critix.config.EnvLoader;
import com.critix.model.Person;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.people.PersonDb;
import info.movito.themoviedbapi.model.people.credits.Cast;
import info.movito.themoviedbapi.model.people.credits.CombinedPersonCredits;
import info.movito.themoviedbapi.tools.TmdbException;
import io.github.cdimascio.dotenv.Dotenv;

@Service
public class PersonService {
    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    private EnvLoader envLoader = new EnvLoader();
    private String TMDB_ACCESS_TOKEN = envLoader.getEnv("TMDB_ACCESS_TOKEN", dotenv);
    private String TMDB_IMAGE_PREFIX = envLoader.getEnv("TMDB_IMAGE_PREFIX", dotenv);
    private final TmdbApi tmdbApi = new TmdbApi(TMDB_ACCESS_TOKEN);

    // WebClient for Wikipedia and Wikidata
    private final WebClient wikidataClient = WebClient.create("https://query.wikidata.org");
    private final WebClient wikipediaClient = WebClient.create("https://en.wikipedia.org/w/api.php");

    public Person singlePerson(Integer id) throws java.io.IOException, InterruptedException, TmdbException {
        Person person = new Person();
        person.setId(id);
        try {
            PersonDb personDb = tmdbApi.getPeople().getDetails(person.getId(), "en-US");
            CombinedPersonCredits castCredits = tmdbApi.getPeople().getCombinedCredits(person.getId(), "en-US");

            // Set TMDB data
            person.setName(personDb.getName());
            person.setBirthday(personDb.getBirthday());
            person.setDeathday(personDb.getDeathDay());
            person.setGender(personDb.getGender());
            person.setBiography(personDb.getBiography());
            person.setPopularity(personDb.getPopularity());
            person.setKnownForDepartment(personDb.getKnownForDepartment());
            person.setPlaceOfBirth(personDb.getPlaceOfBirth());
            person.setProfilePath(personDb.getProfilePath());
            person.setImdbId(personDb.getImdbId());
            getPersonBackdrop(castCredits.getCast(), person);
            String imdbId = personDb.getImdbId();
            String wikidataId = getWikidataEntity(imdbId);
            person.setWikidataId(wikidataId);
            enrichPersonFromWikidata(person);

        } catch (

        Exception e) {
            e.printStackTrace();
        }

        return person;
    }

    public void getPersonBackdrop(List<Cast> castList, Person person) {
        LocalDate latestDate = null;
        String latestBackdropPath = null;

        Pattern backdropPattern = Pattern.compile("backdropPath=([^,\\)]+)");
        Pattern datePattern = Pattern.compile("releaseDate=(\\d{4}-\\d{2}-\\d{2})");

        for (Cast cast : castList) {
            String castString = cast.toString();

            Matcher backdropMatcher = backdropPattern.matcher(castString);
            Matcher dateMatcher = datePattern.matcher(castString);

            if (backdropMatcher.find() && dateMatcher.find()) {
                String backdropPath = backdropMatcher.group(1);
                String releaseDateStr = dateMatcher.group(1);

                if (!"null".equals(backdropPath)) {
                    try {
                        LocalDate releaseDate = LocalDate.parse(releaseDateStr);
                        if (latestDate == null || releaseDate.isAfter(latestDate)) {
                            latestDate = releaseDate;
                            latestBackdropPath = backdropPath;
                        }
                    } catch (Exception e) {
                        System.out.println("Date parse error: " + e.getMessage());
                    }
                }
            }
        }

        if (latestBackdropPath != null) {
            person.setBackdropPath(TMDB_IMAGE_PREFIX + latestBackdropPath);
        }
    }

    public String getWikidataEntity(String imdbId) {
        try {
            String sparqlQuery = "SELECT ?person WHERE { ?person wdt:P345 \"" + imdbId + "\". }";

            String response = wikidataClient.post()
                    .uri(URI.create("https://query.wikidata.org/sparql"))
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromFormData("query", sparqlQuery)
                            .with("format", "json"))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode bindings = root.path("results").path("bindings");

            if (bindings.isArray() && bindings.size() > 0) {
                String wikidataUrl = bindings.get(0).path("person").path("value").asText();
                return wikidataUrl.substring(wikidataUrl.lastIndexOf("/") + 1); // Q-ID like Q1331
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void enrichPersonFromWikidata(Person person) {
        try {
            String wikidataId = person.getWikidataId();
            if (wikidataId == null)
                return;

            ObjectMapper mapper = new ObjectMapper();

            // --- Basic Info Query ---
            String basicInfoSparql = String.format(
                    """
                            SELECT ?occupationLabel ?awardLabel ?educationLabel ?notableWorkLabel WHERE {
                              OPTIONAL { wd:%s wdt:P106 ?occupation. }
                              OPTIONAL { wd:%s wdt:P166 ?award. }
                              OPTIONAL { wd:%s wdt:P69 ?education. }
                              OPTIONAL { wd:%s wdt:P800 ?notableWork. }
                              SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
                            }
                            """,
                    wikidataId, wikidataId, wikidataId, wikidataId);

            String basicInfoResponse = wikidataClient.post()
                    .uri(URI.create("https://query.wikidata.org/sparql"))
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromFormData("query", basicInfoSparql).with("format", "json"))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode basicRoot = mapper.readTree(basicInfoResponse);
            JsonNode basicBindings = basicRoot.path("results").path("bindings");

            List<String> occupations = new ArrayList<>();
            List<String> awards = new ArrayList<>();
            List<String> education = new ArrayList<>();
            List<String> notableWorks = new ArrayList<>();

            for (JsonNode binding : basicBindings) {
                if (binding.has("occupationLabel"))
                    occupations.add(binding.get("occupationLabel").get("value").asText());
                if (binding.has("awardLabel"))
                    awards.add(binding.get("awardLabel").get("value").asText());
                if (binding.has("educationLabel"))
                    education.add(binding.get("educationLabel").get("value").asText());
                if (binding.has("notableWorkLabel"))
                    notableWorks.add(binding.get("notableWorkLabel").get("value").asText());
            }

            person.setOccupations(new ArrayList<>(new HashSet<>(occupations)));
            person.setAwards(new ArrayList<>(new HashSet<>(awards)));
            person.setEducation(new ArrayList<>(new HashSet<>(education)));
            person.setNotableWorks(new ArrayList<>(new HashSet<>(notableWorks)));

            // --- Film Credits Query ---
            String filmCreditsSparql = String.format(
                    """
                            SELECT ?producedFilmLabel ?actedInFilmLabel WHERE {
                              OPTIONAL { ?producedFilm wdt:P162 wd:%s. }
                              OPTIONAL { ?actedInFilm wdt:P161 wd:%s. }
                              SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
                            }
                            """,
                    wikidataId, wikidataId);

            String filmCreditsResponse = wikidataClient.post()
                    .uri(URI.create("https://query.wikidata.org/sparql"))
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromFormData("query", filmCreditsSparql).with("format", "json"))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode filmCreditsRoot = mapper.readTree(filmCreditsResponse);
            JsonNode filmBindings = filmCreditsRoot.path("results").path("bindings");

            List<String> producedFilms = new ArrayList<>();
            List<String> actedInFilms = new ArrayList<>();

            for (JsonNode binding : filmBindings) {
                if (binding.has("producedFilmLabel"))
                    producedFilms.add(binding.get("producedFilmLabel").get("value").asText());
                if (binding.has("actedInFilmLabel"))
                    actedInFilms.add(binding.get("actedInFilmLabel").get("value").asText());
            }

            person.setProducedFilms(new ArrayList<>(new HashSet<>(producedFilms)));
            person.setFilmsActedIn(new ArrayList<>(new HashSet<>(actedInFilms)));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public JsonNode searchWikipedia(String query) {
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8.toString());
            String uri = String.format("?action=query&list=search&srsearch=%s&format=json", encodedQuery);

            String response = wikipediaClient.get()
                    .uri(uri)
                    .header("Accept", "application/json")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            return root.path("query").path("search");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void updateTmdbPersonDetails(Person person) throws TmdbException {
        PersonDb personDb = tmdbApi.getPeople().getDetails(person.getId(), "en-US");

        if (person.getBirthday() == null || person.getBirthday().isEmpty()) {
            person.setBirthday(personDb.getBirthday());
        }
        if (person.getKnownForDepartment() == null || person.getKnownForDepartment().isEmpty()) {
            person.setKnownForDepartment(personDb.getKnownForDepartment());
        }
        if (person.getDeathday() == null || person.getDeathday().isEmpty()) {
            person.setDeathday(personDb.getDeathDay());
        }
        if (person.getGender() == null) {
            person.setGender(personDb.getGender());
        }
        if (person.getBiography() == null || person.getBiography().isEmpty()) {
            person.setBiography(personDb.getBiography());
        }
        if (person.getPopularity() == null) {
            person.setPopularity(personDb.getPopularity());
        }
        if (person.getImdbId() == null || person.getImdbId().isEmpty()) {
            person.setImdbId(personDb.getImdbId());
        }
    }
}
