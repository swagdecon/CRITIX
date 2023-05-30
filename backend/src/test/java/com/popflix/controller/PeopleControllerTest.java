package com.popflix.controller;

import java.io.IOException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.popflix.model.Person;
import com.popflix.service.PersonService;

class PeopleControllerTest {

    @Test
    void testSinglePerson() throws IOException, InterruptedException {
        // Create a mock PersonService
        PersonService personService = mock(PersonService.class);
        Optional<Person> person = Optional.of(new Person()); // create a dummy Person object
        when(personService.singlePerson(1)).thenReturn(person);
        // Create a PeopleController instance and inject the mocked PersonService
        PeopleController peopleController = new PeopleController();

        peopleController.PersonService = personService;

        // Call the singlePerson method
        ResponseEntity<Optional<Person>> response = peopleController.singlePerson(1);

        // Assert the response
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(person, response.getBody());
    }
}
