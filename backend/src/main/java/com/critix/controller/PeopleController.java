package com.critix.controller;

import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.critix.model.Person;
import com.critix.service.PersonService;

import info.movito.themoviedbapi.tools.TmdbException;

@RestController
@RequestMapping("/person")
public class PeopleController {
    @Autowired
    PersonService PersonService;

    @GetMapping("/{id}")
    public ResponseEntity<Person> singlePerson(@PathVariable Integer id)
            throws IOException, InterruptedException, TmdbException {
        return new ResponseEntity<Person>(PersonService.singlePerson(id), HttpStatus.OK);
    }
}
