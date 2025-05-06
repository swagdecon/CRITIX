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

        private static final String REVIEW_SUGGESTION_PROMPT = """
                        You are a professional movie critic. You will provide constructive, clear, and helpful feedback on movie reviews, highlighting how they can be improved.
                        You are tasked with reviewing this content, which is a user's submitted movie review.
                        You should provide unambiguous feedback on how they can improve it, based on what makes a movie review EXCELLENT. Speak directly to the user.
                        ALWAYS return the suggestions as a bullet point list, using '•', do not include any formalities, just the suggestions.
                        Here is the review:
                        """;

        private static final String REVIEW_SEMANTIC_ANALYSIS_PROMPT = """
                        You are a professional movie critic and language analyst. Your job is to analyze the user's movie review and extract meaningful descriptors that capture the tone, sentiment, and key themes expressed in the review.

                        Your output should be a concise, unordered list of descriptive tags or short phrases (1–4 words each) that summarize the nature of the review. These tags should reflect:
                        • Emotional tone (e.g. "critical", "enthusiastic", "emotional")
                        • Specific content references (e.g. "strong acting", "bad cinematography", "predictable plot")
                        • Writing style (e.g. "well-structured", "vague", "detailed", "personal")

                        Avoid full sentences or explanations. Do not include formalities or introductions. Return only a bullet point list using the character '•' for each line.

                        Here is the review:
                        """;

        public List<String> getSuggestions(String review) {
                OpenAI openAI = OpenAI.newBuilder(OPENAI_API_KEY).build();

                ChatClient chatClient = openAI.chatClient();
                CreateChatCompletionRequest createChatCompletionRequest = CreateChatCompletionRequest.newBuilder()
                                .model(OpenAIModel.GPT_3_5_TURBO)
                                .message(ChatMessage.userMessage(REVIEW_SUGGESTION_PROMPT + review))
                                .build();

                ChatCompletion response = chatClient.createChatCompletion(createChatCompletionRequest);
                String aiContent = response.choices().get(0).message().content();

                return Arrays.stream(aiContent.split("(?m)^[-•]\\s+"))
                                .map(String::trim)
                                .filter(s -> !s.isEmpty())
                                .collect(Collectors.toList());
        }

        public List<String> reviewSemanticAnalysis(String review) {
                OpenAI openAI = OpenAI.newBuilder(OPENAI_API_KEY).build();

                ChatClient chatClient = openAI.chatClient();
                CreateChatCompletionRequest createChatCompletionRequest = CreateChatCompletionRequest.newBuilder()
                                .model(OpenAIModel.GPT_3_5_TURBO)
                                .message(ChatMessage.userMessage(REVIEW_SEMANTIC_ANALYSIS_PROMPT + review))
                                .build();

                ChatCompletion response = chatClient.createChatCompletion(createChatCompletionRequest);
                String aiContent = response.choices().get(0).message().content();

                return Arrays.stream(aiContent.split("(?m)^[-•]\\s+"))
                                .map(String::trim)
                                .filter(s -> !s.isEmpty())
                                .collect(Collectors.toList());
        }
}