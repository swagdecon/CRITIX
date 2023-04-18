package com.popflix.controller;

import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.model.Person;
import com.popflix.service.PersonService;

@RestController
@RequestMapping("/person")
public class PeopleController {
    @Autowired
    private PersonService PersonService;

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Person>> getSinglePerson(@PathVariable Integer id) {
        return new ResponseEntity<Optional<Person>>(PersonService.singleTmdbPerson(id), HttpStatus.OK);
    }
}
