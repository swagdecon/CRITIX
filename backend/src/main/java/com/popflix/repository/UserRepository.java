package com.popflix.repository;
import org.springframework.data.repository.CrudRepository;
import com.popflix.model.User;

public interface UserRepository extends CrudRepository<User, Long> {
 boolean existsByUsername(String username);
 User findByUsername(String username);
}