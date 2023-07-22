package com.popflix.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Movie {
    @Id
    private ObjectId mongoId;
    private Boolean adult;
    private String backdropPath;
    private List<Integer> genreIds;
    private List<String> genres;
    private Integer id;
    private String originalLanguage;
    private String originalTitle;
    private String overview;
    private Float popularity;
    private String posterPath;
    private String releaseDate;
    private String title;
    private List<String> video;
    private Integer voteAverage;
    private Integer voteCount;
    private String imdbId;
    private Long budget;
    private String tagline;
    private Long revenue;
    private Integer runtime;
    private List<Person> actors;
    private List<String> actorImagePaths;
    private List<String> reviews;
    private List<String> productionCompanies;
    private String movieStatus;
}