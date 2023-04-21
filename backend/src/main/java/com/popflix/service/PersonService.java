package com.popflix.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.popflix.model.Person;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.people.PersonPeople;

import com.popflix.service.imdbRequests.*;

@Service
public class PersonService {

    private final TmdbApi tmdbApi = new TmdbApi("d84f9365179dc98dc69ab22833381835");

    private final AllActorImages allActorImages = new AllActorImages();

    public List<String> getAllImdbActorImages(String imdbId) throws java.io.IOException, InterruptedException {
        List<String> response = allActorImages.imdbActorImageRequest(imdbId);
        return response;
    }

    public List<String> getAllImdbActorJobs(String imdbId) throws java.io.IOException, InterruptedException {
        AllActorJobs allActorJobs = new AllActorJobs();
        List<String> jobs = allActorJobs.imdbActorJobs(imdbId);
        return jobs;
    }

    public Optional<Person> singlePerson(Integer id) throws java.io.IOException, InterruptedException {
        Person person = new Person();
        person.setId(id);

        PersonPeople personDb = tmdbApi.getPeople().getPersonInfo(person.getId());

        person.setName(personDb.getName());
        person.setBirthday(personDb.getBirthday());
        person.setDeathday(personDb.getDeathday());
        person.setGender(personDb.getGender());
        person.setBiography(personDb.getBiography());
        person.setPopularity(personDb.getPopularity());
        person.setKnownForDepartment(personDb.getKnownForDepartment());
        person.setJob(personDb.getJob());
        person.setPlaceOfBirth(personDb.getBirthplace());
        person.setProfilePath(personDb.getProfilePath());
        person.setImdbId(personDb.getImdbId());

        // Get actor's images from IMDB
        String imdbId = person.getImdbId();
        List<String> images = getAllImdbActorImages(imdbId);
        List<String> actorJobs = getAllImdbActorJobs(imdbId);

        person.setActorImdbImages(images);
        person.setActorJobs(actorJobs);
        updateTmdbPersonDetails(person);
        return Optional.of(person);
    }

    // private ScheduledExecutorService executor;

    // @PostConstruct
    // public void init() {
    // executor = Executors.newScheduledThreadPool(1);
    // executor.scheduleAtFixedRate(this::updateTmdbPersonDetails, 0, 24,
    // TimeUnit.HOURS);
    // }

    // public void shutdown() {
    // executor.shutdown();
    // }

    public void updateTmdbPersonDetails(Person person) {
        PersonPeople personDb = tmdbApi.getPeople().getPersonInfo(person.getId());

        if (person.getBirthday() == null || person.getBirthday().isEmpty()) {
            person.setBirthday(personDb.getBirthday());
        }
        if (person.getKnownForDepartment() == null || person.getKnownForDepartment().isEmpty()) {
            person.setKnownForDepartment(personDb.getKnownForDepartment());
        }
        if (person.getDeathday() == null || person.getDeathday().isEmpty()) {
            person.setDeathday(personDb.getDeathday());
        }
        if (person.getGender() == null) {
            person.setGender(personDb.getGender());
        }
        if (person.getBiography() == null || person.getBiography().isEmpty()) {
            person.setBiography(personDb.getBiography());
        }

        if (person.getPopularity() == null) {
            float popularity = personDb.getPopularity();
            person.setPopularity(popularity);
        }

        if (person.getImdbId() == null || person.getImdbId().isEmpty()) {
            String imdbId = personDb.getImdbId();
            person.setImdbId(imdbId);
        }
    }
}
