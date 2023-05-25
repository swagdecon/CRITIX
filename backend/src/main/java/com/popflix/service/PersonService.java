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

    private final AllImdbPersonImages allPersonImages = new AllImdbPersonImages();

    public List<String> getAllImdbPersonImages(String imdbId) throws java.io.IOException, InterruptedException {
        List<String> response = allPersonImages.imdbPersonImageRequest(imdbId);
        return response;
    }

    public List<String> getAllImdbPersonJobs(String imdbId) throws java.io.IOException, InterruptedException {
        AllImdbPersonJobs allPersonJobs = new AllImdbPersonJobs();
        List<String> jobs = allPersonJobs.imdbPersonJobs(imdbId);
        jobs.remove("miscellaneous");
        jobs.remove("soundtrack");

        return jobs;
    }

    public Integer getAllPersonFilmAppearances(String imdbId) throws java.io.IOException, InterruptedException {
        PersonImdbJobInfo allPersonAppearances = new PersonImdbJobInfo();
        Integer numOfFilmsStarredIn = allPersonAppearances.personFilmAppearances(imdbId);
        return numOfFilmsStarredIn;
    }

    public Integer getAllPersonMoviesProduced(String imdbId) throws java.io.IOException, InterruptedException {
        PersonImdbJobInfo allPersonMoviesProduced = new PersonImdbJobInfo();
        Integer numOfFilmsProduced = allPersonMoviesProduced.personMoviesProduced(imdbId);
        return numOfFilmsProduced;
    }

    public Integer getAllPersoAwardNominations(String imdbId) throws java.io.IOException, InterruptedException {
        PersonImdbJobInfo allPersonAwardNominations = new PersonImdbJobInfo();
        Integer numOfNominatedAwards = allPersonAwardNominations.personAwardNominations(imdbId);
        return numOfNominatedAwards;

    }

    public Optional<Person> singlePerson(Integer id) throws java.io.IOException, InterruptedException {
        Person person = new Person();
        person.setId(id);

        PersonPeople personDb = tmdbApi.getPeople().getPersonInfo(person.getId());
        // Information from TMDB
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
        List<String> images = getAllImdbPersonImages(imdbId);
        List<String> personJobs = getAllImdbPersonJobs(imdbId);
        Integer personFilmAppearances = getAllPersonFilmAppearances(imdbId);
        Integer personFilmsProduced = getAllPersonMoviesProduced(imdbId);
        Integer personNominatedAwards = getAllPersoAwardNominations(imdbId);

        person.setImdbPersonImages(images);
        person.setImdbPersonJobs(personJobs);
        person.setImdbPersonFilmAppearances(personFilmAppearances);
        person.setImdbFilmsProduced(personFilmsProduced);
        person.setImdbAwardNominations(personNominatedAwards);

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
