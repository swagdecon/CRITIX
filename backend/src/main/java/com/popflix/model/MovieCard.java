package com.popflix.model;

import java.util.List;
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
public class MovieCard {
    private List<Integer> genreIds;
    private List<String> genres;
    private Integer id;
    private String overview;
    private String posterUrl;
    private String releaseDate;
    private String title;
    private String trailer;
    private Integer voteAverage;
    private String tagline;
    private Integer runtime;
    private String movieStatus;
}