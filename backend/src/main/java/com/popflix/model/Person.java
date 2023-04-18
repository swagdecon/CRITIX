package com.popflix.model;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    private Integer id;
    private String name;
    private String birthday;
    private String placeOfBirth;
    private String biography;
    private String knownForDepartment;
    private Integer gender;
    private String profilePath;
    private String deathday;
    private Float popularity;
    private String imdbId;

}
