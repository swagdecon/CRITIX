package com.popflix.repository;
import org.springframework.data.repository.CrudRepository;

import com.popflix.model.Authority;

public interface AuthoritiesRepository extends CrudRepository<Authority, Long> {
}
