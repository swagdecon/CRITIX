package com.popflix.repository;
// import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.popflix.model.Watchlist;

public interface WatchlistRepository extends CrudRepository<Watchlist, Long> {

    Iterable<Watchlist> findByUserid(Long userid);

    Watchlist findByUseridAndMovieid(Long userid, Integer movieid);

    void deleteById(Long id);

    // @Query(value = "SELECT * FROM watchlist WHERE userid = ?1", nativeQuery = true)
    Iterable<Watchlist> findAllMoviesByUserid(Long userid, Integer movieid); // needs to check for watchlist by userid
}
