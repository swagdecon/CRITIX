package com.critix.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieResults {
    List<MovieCard> movieCardList;
    Integer totalPages;
}
