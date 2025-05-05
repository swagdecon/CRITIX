package com.critix.service;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.stefanbratanov.jvm.openai.ChatClient;
import io.github.stefanbratanov.jvm.openai.ChatCompletion;
import io.github.stefanbratanov.jvm.openai.ChatMessage;
import io.github.stefanbratanov.jvm.openai.CreateChatCompletionRequest;
import io.github.stefanbratanov.jvm.openai.OpenAI;
import io.github.stefanbratanov.jvm.openai.OpenAIModel;

import com.critix.config.EnvLoader;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class AIService {

    private EnvLoader envLoader = new EnvLoader();

    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    private String OPENAI_API_KEY = envLoader.getEnv("OPENAI_API_KEY", dotenv);

    private static final String REVIEW_INSTRUCTIONS = """
            You are a professional movie critic. You will provide constructive, clear, and helpful feedback on movie reviews, highlighting how they can be improved.
            You are tasked with reviewing this content, which is a user's submitted movie review.
            You should provide unambiguous feedback on how they can improve it, based on what makes a movie review EXCELLENT. Speak directly to the user.
            Always return the suggestions as a bullet point list, do not include any formalities, just the suggestions.
            Here is the review:
            """;

    public List<String> getSuggestions(String review) {
        OpenAI openAI = OpenAI.newBuilder(OPENAI_API_KEY).build();

        ChatClient chatClient = openAI.chatClient();
        CreateChatCompletionRequest createChatCompletionRequest = CreateChatCompletionRequest.newBuilder()
                .model(OpenAIModel.GPT_3_5_TURBO)
                .message(ChatMessage.userMessage(REVIEW_INSTRUCTIONS + review))
                .build();

        ChatCompletion response = chatClient.createChatCompletion(createChatCompletionRequest);
        String aiContent = response.choices().get(0).message().content();

        return Arrays.stream(aiContent.split("(?m)^[-•]\\s+"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}