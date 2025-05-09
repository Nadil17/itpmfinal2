package com.example.farmer.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@CrossOrigin
public class CropController {

    @Value("${anthropic.api.key}")
    private String apiKey;

    @PostMapping("/crop-solution")
    public String getCropSolution(@RequestBody String csvData) {
        String[] parts = csvData.split(",");
        String cropType = parts[0];
        String soilCondition = parts[1];
        String pestProblem = parts[2];

        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");

        // Prepare request body
        Map<String, Object> messageContent = Map.of(
                "role", "user",
                "content", "Provide solution for: Crop: " + cropType +
                        ", Soil: " + soilCondition +
                        ", Pest: " + pestProblem
        );

        Map<String, Object> requestBody = Map.of(
                "model", "claude-3-7-sonnet-20250219",
                "max_tokens", 1000,
                "messages", new Object[]{messageContent}
        );

        // Make API call
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = new RestTemplate().exchange(
                "https://api.anthropic.com/v1/messages",
                HttpMethod.POST,
                request,
                Map.class
        );

        // Extract solution
        List<Map<String, Object>> content = (List<Map<String, Object>>) response.getBody().get("content");
        return (String) content.get(0).get("text");
    }
}