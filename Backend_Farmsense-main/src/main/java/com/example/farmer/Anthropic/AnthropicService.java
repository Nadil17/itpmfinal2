package com.example.farmer.Anthropic;

import com.example.farmer.model.FertilizerRequest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AnthropicService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Value("${anthropic.api.url:https://api.anthropic.com/v1/messages}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AnthropicService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String getFertilizerRecommendation(FertilizerRequest request) {
        try {
            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");

            // Create the request body
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", "claude-3-7-sonnet-20250219");
            requestBody.put("max_tokens", 1000);

            ArrayNode messagesArray = objectMapper.createArrayNode();
            ObjectNode messageObject = objectMapper.createObjectNode();
            messageObject.put("role", "user");

            String prompt = String.format("""
                Please provide a detailed fertilizer recommendation based on the following information:
                
                Crop type: %s
                Soil condition: %s
                Pest problem: %s
                
                Your recommendation should include:
                1. Specific fertilizer recommendations (NPK ratios, organic options, etc.)
                2. Application method and timing
                3. Any additional amendments needed for the soil condition
                4. Integrated pest management suggestions
                5. Sustainable farming considerations
                
                Format the response in an easy-to-read format.
                """,
                    request.getCropType(),
                    request.getSoilCondition(),
                    request.getPestProblem());

            messageObject.put("content", prompt);
            messagesArray.add(messageObject);
            requestBody.set("messages", messagesArray);

            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);

            // Make the API call
            String response = restTemplate.postForObject(apiUrl, entity, String.class);

            // Parse the response to extract the recommendation
            JsonNode responseNode = objectMapper.readTree(response);
            return responseNode.path("content").get(0).path("text").asText();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error getting fertilizer recommendation: " + e.getMessage();
        }
    }
}
