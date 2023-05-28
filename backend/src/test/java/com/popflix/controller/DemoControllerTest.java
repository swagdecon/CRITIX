package com.popflix.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DemoControllerTest {

    @Test
    public void testSayHello() {
        DemoController demoController = new DemoController();
        ResponseEntity<String> response = demoController.sayHello();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Hello from secured endpoint", response.getBody());
    }
}