package com.popflix.model;

import java.util.List;

import info.movito.themoviedbapi.model.MovieDb;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieResults {
    List<MovieDb> movieCardList;
    Integer totalPages;
}
