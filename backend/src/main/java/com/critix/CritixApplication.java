package com.critix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CritixApplication {

	public static void main(String[] args) {
		SpringApplication.run(CritixApplication.class, args);
	}
}