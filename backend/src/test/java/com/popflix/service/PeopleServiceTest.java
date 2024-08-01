package com.popflix.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.popflix.model.Person;

import info.movito.themoviedbapi.tools.TmdbException;

class PeopleServiceTest {
    private PersonService personService;

    @BeforeEach
    void setup() throws IOException, InterruptedException {
        // Mock the service and its dependencies
        personService = mock(PersonService.class);
    }

    @Test
    void testSinglePerson() throws IOException, InterruptedException, TmdbException {
        Integer id = 12345;
        Person person = new Person();
        person.setId(id);
        Optional<Person> optionalPerson = Optional.of(person);
        // Mock the SinglePerson method and return the optional person created above
        when(personService.singlePerson(12345)).thenReturn(optionalPerson);
        Optional<Person> returnedPerson = personService.singlePerson(id);
        Assertions.assertEquals(returnedPerson.get().getId(), id);
    }

    @Test
    void testGetAllImdbPersonImages() throws IOException, InterruptedException {
        String imdbId = "tt12345";
        List<String> response = new ArrayList<>(Collections.singletonList("image1"));
        when(personService.getAllImdbPersonImages(imdbId)).thenReturn(response);
        List<String> returnedResponse = personService.getAllImdbPersonImages(imdbId);
        Assertions.assertEquals(returnedResponse.get(0), response.get(0));
    }

    @Test
    void testGetAllImdbPersonJobs() throws IOException, InterruptedException {
        String imdbId = "tt12345";
        List<String> response = new ArrayList<>(Collections.singletonList("actor"));
        when(personService.getAllImdbPersonJobs(imdbId)).thenReturn(response);
        List<String> returnedResponse = personService.getAllImdbPersonJobs(imdbId);
        Assertions.assertEquals(returnedResponse.get(0), response.get(0));
    }

    @Test
    void testGetAllPersonFilmAppearances() throws IOException, InterruptedException {
        String imdbId = "tt12345";
        Integer response = 10;
        when(personService.getAllPersonFilmAppearances(imdbId)).thenReturn(response);
        Integer returnedResponse = personService.getAllPersonFilmAppearances(imdbId);
        Assertions.assertEquals(returnedResponse, response);
    }

    @Test
    void testGetAllPersonMoviesProduced() throws IOException, InterruptedException {
        String imdbId = "tt12345";
        Integer response = 5;
        when(personService.getAllPersonMoviesProduced(imdbId)).thenReturn(response);
        Integer returnedResponse = personService.getAllPersonMoviesProduced(imdbId);
        Assertions.assertEquals(returnedResponse, response);
    }

    @Test
    void testGetAllPersoAwardNominations() throws IOException, InterruptedException {
        String imdbId = "tt12345";
        Integer response = 3;
        when(personService.getAllPersoAwardNominations(imdbId)).thenReturn(response);
        Integer returnedResponse = personService.getAllPersoAwardNominations(imdbId);
        Assertions.assertEquals(returnedResponse, response);
    }
}