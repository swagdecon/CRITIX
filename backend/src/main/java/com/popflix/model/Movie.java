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
    private ObjectId mongo_id;
    private Boolean adult;
    private String backdrop_path;
    private List<Integer> genre_ids;
    private List<String> genres;
    private Integer id;
    private String original_language;
    private String original_title;
    private String overview;
    private Double popularity;
    private String poster_path;
    private String release_date;
    private String title;
    private List<String> video;
    private Double vote_average;
    private Integer vote_count;
    private Long budget;
    private String tagline;
    private Long revenue;
    private Integer runtime;
    private List<String> actors;
    private List<String> actorImagePaths;
}