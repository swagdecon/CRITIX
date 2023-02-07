package com.popflix.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.popflix.model.Movie;
import com.popflix.repository.MovieRepository;

@Service
public class MovieService {
    @Autowired
    private Movie movie;
    private MovieRepository movieRepository;

    public List<Movie> allMovies() {
        System.out.println(movieRepository.findAll().toString());
        return movieRepository.findAll();
    }
    
}
