package com.popflix.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.popflix.model.Person;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.people.PersonPeople;

@Service
public class PersonService {

    @Autowired
    private MongoTemplate mongoTemplate;
    private final TmdbApi tmdbApi = new TmdbApi("d84f9365179dc98dc69ab22833381835");

    public Optional<Person> singlePerson(Integer id, String collectionName) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        return Optional.ofNullable(mongoTemplate.findOne(query, Person.class, collectionName));
    }

    public Optional<Person> singleTmdbPerson(Integer id) {
        Person person = new Person();
        person.setId(id);

        PersonPeople personDb = tmdbApi.getPeople().getPersonInfo(person.getId());

        person.setName(personDb.getName());
        person.setBirthday(personDb.getBirthday());
        person.setDeathday(personDb.getDeathday());
        person.setGender(personDb.getGender());
        person.setBiography(personDb.getBiography());
        person.setPopularity(personDb.getPopularity());
        person.setPlaceOfBirth(personDb.getBirthplace());
        person.setProfilePath(personDb.getProfilePath());
        person.setImdbId(personDb.getImdbId());
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

        if (person.getBirthday() == null) {
            person.setBirthday(personDb.getBirthday());
        }
        if (person.getKnownForDepartment() == null) {
            person.setKnownForDepartment(personDb.getKnownForDepartment());
        }
        if (person.getDeathday() == null) {
            person.setDeathday(personDb.getDeathday());
        }
        if (person.getGender() == null) {
            person.setGender(personDb.getGender());
        }
        if (person.getBiography() == null) {
            person.setBiography(personDb.getBiography());
        }

        if (person.getPopularity() == null) {
            float popularity = personDb.getPopularity();
            person.setPopularity(popularity);
        }

        if (person.getImdbId() == null) {
            String imdbId = personDb.getImdbId();
            person.setImdbId(imdbId);
        }
    }
}
