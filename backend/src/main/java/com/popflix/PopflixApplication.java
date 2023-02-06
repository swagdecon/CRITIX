package com.popflix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories
@SpringBootApplication
public class PopflixApplication {

	public static void main(String[] args) {
		SpringApplication.run(PopflixApplication.class, args);
	}

}
