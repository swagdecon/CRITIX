package com.popflix.config;

import org.springframework.stereotype.Service;
import io.github.cdimascio.dotenv.Dotenv;

@Service
public class EnvLoader {
    public String getEnv(String key, Dotenv dotenv) {
        // First, check if the variable is available as a system environment variable
        String value = System.getenv(key);

        // If not found in system env, check .env file
        if (value == null) {
            value = dotenv.get(key);
        }

        // If still not found, throw an error to prevent silent failures
        if (value == null) {
            throw new RuntimeException("Missing required environment variable: " + key);
        }

        return value;
    }
}
