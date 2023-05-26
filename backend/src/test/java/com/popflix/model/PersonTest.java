package com.popflix.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

public class PersonTest {

    @Test
    public void testPerson() {
        // Create a Person object
        Person person = new Person();
        person.setId(1);
        person.setName("John Doe");
        person.setBirthday("1990-01-01");
        person.setPlaceOfBirth("New York");
        person.setBiography("Some biography");
        person.setKnownForDepartment("Acting");
        person.setGender(1);
        person.setProfilePath("/profile.jpg");
        person.setDeathday("2022-03-15");
        person.setPopularity(7.5f);
        person.setImdbId("nm1234567");
        person.setJob("Actor");

        List<String> imdbPersonImages = Arrays.asList("/image1.jpg", "/image2.jpg");
        person.setImdbPersonImages(imdbPersonImages);

        List<String> imdbPersonJobs = Arrays.asList("Actor", "Producer");
        person.setImdbPersonJobs(imdbPersonJobs);

        person.setImdbPersonFilmAppearances(50);
        person.setImdbFilmsProduced(10);
        person.setImdbAwardNominations(3);

        // Perform assertions
        assertEquals(1, person.getId());
        assertEquals("John Doe", person.getName());
        assertEquals("1990-01-01", person.getBirthday());
        assertEquals("New York", person.getPlaceOfBirth());
        assertEquals("Some biography", person.getBiography());
        assertEquals("Acting", person.getKnownForDepartment());
        assertEquals(1, person.getGender());
        assertEquals("/profile.jpg", person.getProfilePath());
        assertEquals("2022-03-15", person.getDeathday());
        assertEquals(7.5f, person.getPopularity());
        assertEquals("nm1234567", person.getImdbId());
        assertEquals("Actor", person.getJob());
        assertEquals(imdbPersonImages, person.getImdbPersonImages());
        assertEquals(imdbPersonJobs, person.getImdbPersonJobs());
        assertEquals(50, person.getImdbPersonFilmAppearances());
        assertEquals(10, person.getImdbFilmsProduced());
        assertEquals(3, person.getImdbAwardNominations());
    }
}
