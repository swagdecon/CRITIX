package com.critix.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.critix.service.AIService;

@RestController
@RequestMapping("/ai")
public class AIController {

        @Autowired
        AIService aiService;

        @PostMapping("/suggestions")
        public List<String> getSuggestions(@RequestBody Map<String, String> review) {
                try {
                        String reviewText = review.get("review");
                        return aiService.getSuggestions(reviewText);
                } catch (Exception e) {
                        System.out.println(e);
                }
                return null;
        }

        @PostMapping("/semantics")
        public List<String> semanticAnalysis(@RequestBody Map<String, String> review) {
                try {
                        String reviewText = review.get("review");
                        return aiService.reviewSemanticAnalysis(reviewText);
                } catch (Exception e) {
                        System.out.println(e);
                }
                return null;
        }
}
