package com.example.farmer.ImageAnalyze;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnthropicImageAnalysisService {

    private final WebClient webClient;

    @Value("${anthropic.api.key}")
    private String apiKey;

    public AnthropicImageAnalysisService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.anthropic.com/v1")
                .build();
    }

    // Initialize WebClient with apiKey after it's injected
    private WebClient getWebClient() {
        return webClient.mutate()
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .build();
    }

    public String analyzeImage(MultipartFile imageFile, String prompt) throws IOException {
        // Encode image to base64
        String base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());

        // Create content list with image and text
        List<Map<String, Object>> content = List.of(
                Map.of("type", "image",
                        "source", Map.of("type", "base64",
                                "media_type", imageFile.getContentType(),
                                "data", base64Image)),
                Map.of("type", "text",
                        "text", prompt)
        );

        // Create request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "claude-3-7-sonnet-20250219");
        requestBody.put("max_tokens", 1000);
        requestBody.put("messages", List.of(
                Map.of("role", "user",
                        "content", content)
        ));

        // Make API call
        Map<String, Object> response = getWebClient().post()
                .uri("/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        try {
            // Extract the content from the response
            if (response != null && response.containsKey("content")) {
                List<Map<String, Object>> contentList = (List<Map<String, Object>>) response.get("content");
                if (!contentList.isEmpty()) {
                    Map<String, Object> firstContent = contentList.get(0);
                    if (firstContent.containsKey("text")) {
                        return (String) firstContent.get("text");
                    }
                }
            }
            return "Failed to extract response text";

        } catch (Exception e) {
            // More detailed error handling
            System.err.println("Error parsing API response: " + e.getMessage());
            System.err.println("Response structure: " + response);
            return "Error processing the response: " + e.getMessage();
        }
    }
}