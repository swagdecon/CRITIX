package com.popflix.model;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "movies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Movie {
    @Id
    private ObjectId id;
    private String imdbId;
    private String title;
    private String releaseDate;
    private String trailerLink;
    private String poster;
    private String backdrop_path;
    private String original_language;
    private String original_title;
    private String overview;
    private Boolean adult;
    private Double popularity;
    private String poster_path;
    private Date release_date;
    private Boolean video;
    private Double vote_average; 
    private Integer vote_count;
    private List<Integer> genre_ids; 
    private List<String> backdrops;
    private List<String> genres;

    public Movie(String imdbId, String title, String releaseDate, String trailerLink, String poster, String backdrop_path, String original_language, String original_title, String overview, String poster_path, Boolean id, Boolean video, Integer vote_count, Boolean adult, Double popularity, Double vote_average, Date release_date, List<Integer> genre_ids, List<String> backdrops, List<String> genres) {
        
        // adult:false,
//    backdrop_path:/faXT8V80JRhnArTAeYXz0Eutpv9.jpg,
//    genre_ids:[
//       16,
//       28,
//       12,
//       35,
//       10751,
//       14
//    ],
//    id: 315162,
//    original_language:en,
//    original_title:Puss in Boots: The Last Wish,
//    overview:Puss in Boots discovers that his passion for adventure has taken its toll: He has burned through eight of his nine lives, leaving him with only one life left. Puss sets out on an epic journey to find the mythical Last Wish and restore his nine lives.,
//    popularity:5946.788,
//    poster_path:/kuf6dutpsT0vSVehic3EZIqkOBt.jpg,
//    release_date:2022-12-07,
//    title:Puss in Boots: The Last Wish,
//    video:false,
//    vote_average:8.6,
//    vote_count:2658
    }
}