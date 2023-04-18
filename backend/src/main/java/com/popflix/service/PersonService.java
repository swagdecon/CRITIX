package com.popflix.service;

import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.popflix.model.Person;

import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.people.PersonCast;
import info.movito.themoviedbapi.model.people.PersonPeople;
import info.movito.themoviedbapi.model.people.PersonType;
import jakarta.annotation.PostConstruct;

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

        PersonPeople personDb = tmdbApi.getPeople().getPerson(person.getId());

        person.setName(personDb.getName());
        person.setBirthday(personDb.getBirthday());
        person.setDeathday(personDb.getDeathday());
        person.setGender(personDb.getGender());
        person.setBiography(personDb.getBiography());
        person.setPopularity(personDb.getPopularity());
        person.setProfilePath(personDb.getProfilePath());
        updateTmdbPersonDetails(person);
        return Optional.of(person);
    }

    // ScheduledExecutorService is created in the init method and a task is
    // scheduled to run every 24 hours using scheduleAtFixedRate. The updateMovies
    // method will be called by the scheduled task.
    private ScheduledExecutorService executor;

    @PostConstruct
    public void init() {
        executor = Executors.newScheduledThreadPool(1);
        executor.scheduleAtFixedRate(this::updatePeople, 0, 24, TimeUnit.HOURS);
    }

    public void shutdown() {
        executor.shutdown();
    }

}
