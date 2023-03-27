package com.popflix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class PopflixApplication {

	public static void main(String[] args) {
		SpringApplication.run(PopflixApplication.class, args);
	}

}