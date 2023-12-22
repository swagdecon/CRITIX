package com.popflix.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Id;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieCard {
    @Id
    private ObjectId mongoId;
    private List<Integer> genreIds;
    private List<String> genres;
    private List<Person> actors;
    private Integer movieId;
    private String overview;
    private String posterUrl;
    private String releaseDate;
    private String title;
    private String trailer;
    private Integer voteAverage;
    private String tagline;
    private Integer runtime;
    private String movieStatus;
    private Boolean isSavedToWatchlist;
}