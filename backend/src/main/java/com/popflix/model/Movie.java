package com.popflix.model;

import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Movie {
    @Id
    private ObjectId mongoId;
    private Boolean adult;
    private String backdropUrl;
    private List<Integer> genreIds;
    private List<String> genres;
    private Integer id;
    private String originalLanguage;
    private String originalTitle;
    private String overview;
    private Map<String, Object> watchProviders;
    private Double popularity;
    private String posterUrl;
    private String releaseDate;
    private String title;
    private String trailer;
    private Boolean isSavedToWatchlist;
    private Boolean isSavedToFavouriteMoviesList;
    private Integer voteAverage;
    private Map<String, Object> providerResults;
    private Integer voteCount;
    private String imdbId;
    private Integer budget;
    private String tagline;
    private Long revenue;
    private Integer runtime;
    private List<Person> actors;
    private List<String> actorImagePaths;
    private List<String> reviews;
    private List<String> productionCompanies;
    private String movieStatus;
}