package com.popflix.model;

import org.springframework.data.mongodb.core.mapping.Document;

import info.movito.themoviedbapi.model.people.Gender;

import java.util.List;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    @Id
    private Integer id;
    private String name;
    private String birthday;
    private String placeOfBirth;
    private String biography;
    private String knownForDepartment;
    private Gender gender;
    private String profilePath;
    private String deathday;
    private Double popularity;
    private String imdbId;
    private String job;
    private List<String> imdbPersonImages;
    private List<String> imdbPersonJobs;
    private Integer imdbPersonFilmAppearances;
    private Integer imdbFilmsProduced;
    private Integer imdbAwardNominations;

}
