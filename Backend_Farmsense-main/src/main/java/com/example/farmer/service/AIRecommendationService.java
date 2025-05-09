package com.example.farmer.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIRecommendationService {

    // This is a simplified AI recommendation system
    // In a real application, you would integrate with an external AI service or use ML libraries

    private final Map<String, Map<String, String>> cropFertilizerDatabase = new HashMap<>();
    private final Map<String, Map<String, String>> pestControlDatabase = new HashMap<>();

    public AIRecommendationService() {
        initializeDatabases();
    }

    private void initializeDatabases() {
        // Crop to fertilizer recommendations based on soil condition
        Map<String, String> riceRecommendations = new HashMap<>();
        riceRecommendations.put("acidic", "Apply 150 kg/ha of NPK 14-14-14 and 50 kg/ha of lime");
        riceRecommendations.put("neutral", "Apply 100 kg/ha of NPK 14-14-14 and 50 kg/ha of urea");
        riceRecommendations.put("alkaline", "Apply 100 kg/ha of ammonium sulfate and 50 kg/ha of NPK 14-14-14");
        cropFertilizerDatabase.put("rice", riceRecommendations);

        Map<String, String> cornRecommendations = new HashMap<>();
        cornRecommendations.put("acidic", "Apply 200 kg/ha of NPK 15-15-15 and 75 kg/ha of lime");
        cornRecommendations.put("neutral", "Apply 150 kg/ha of NPK 15-15-15 and 75 kg/ha of urea");
        cornRecommendations.put("alkaline", "Apply 150 kg/ha of ammonium sulfate and 75 kg/ha of NPK 15-15-15");
        cropFertilizerDatabase.put("corn", cornRecommendations);

        Map<String, String> wheatRecommendations = new HashMap<>();
        wheatRecommendations.put("acidic", "Apply 180 kg/ha of NPK 20-20-20 and 60 kg/ha of lime");
        wheatRecommendations.put("neutral", "Apply 120 kg/ha of NPK 20-20-20 and 60 kg/ha of urea");
        wheatRecommendations.put("alkaline", "Apply 120 kg/ha of ammonium sulfate and 60 kg/ha of NPK 20-20-20");
        cropFertilizerDatabase.put("wheat", wheatRecommendations);

        // Pest control recommendations
        Map<String, String> ricePestControl = new HashMap<>();
        ricePestControl.put("stem borer", "Apply Chlorantraniliprole 0.4% GR @ 10 kg/ha");
        ricePestControl.put("leaf folder", "Spray Chlorantraniliprole 18.5% SC @ 150 ml/ha");
        ricePestControl.put("brown planthopper", "Spray Dinotefuran 20% SG @ 150-200 g/ha");
        pestControlDatabase.put("rice", ricePestControl);

        Map<String, String> cornPestControl = new HashMap<>();
        cornPestControl.put("fall armyworm", "Spray Emamectin benzoate 5% SG @ 220 g/ha");
        cornPestControl.put("corn borer", "Apply Spinosad 45% SC @ 125-160 ml/ha");
        cornPestControl.put("aphids", "Spray Imidacloprid 17.8% SL @ 100-125 ml/ha");
        pestControlDatabase.put("corn", cornPestControl);

        Map<String, String> wheatPestControl = new HashMap<>();
        wheatPestControl.put("aphids", "Spray Thiamethoxam 25% WG @ 50 g/ha");
        wheatPestControl.put("termites", "Apply Fipronil 0.3% GR @ 20-25 kg/ha");
        wheatPestControl.put("powdery mildew", "Spray Propiconazole 25% EC @ 500 ml/ha");
        pestControlDatabase.put("wheat", wheatPestControl);
    }

    public String getFertilizerRecommendation(String cropType, String soilCondition) {
        cropType = cropType.toLowerCase();
        soilCondition = soilCondition.toLowerCase();

        if (!cropFertilizerDatabase.containsKey(cropType)) {
            return "No specific recommendations available for " + cropType +
                    ". General recommendation: Apply balanced NPK fertilizer based on soil test results.";
        }

        Map<String, String> soilRecommendations = cropFertilizerDatabase.get(cropType);

        if (!soilRecommendations.containsKey(soilCondition)) {
            return "For " + cropType + ", apply balanced NPK fertilizer. " +
                    "Consider soil testing for precise recommendations.";
        }

        return soilRecommendations.get(soilCondition);
    }

    public String getChemicalRecommendation(String cropType, String pestProblem) {
        cropType = cropType.toLowerCase();
        pestProblem = pestProblem.toLowerCase();

        if (!pestControlDatabase.containsKey(cropType)) {
            return "No specific pest control recommendations available for " + cropType +
                    ". Consult with local agricultural extension for guidance.";
        }

        Map<String, String> pestRecommendations = pestControlDatabase.get(cropType);

        if (!pestRecommendations.containsKey(pestProblem)) {
            return "For unknown pests in " + cropType + ", consider integrated pest management approaches " +
                    "and consult with agricultural experts for proper identification and treatment.";
        }

        return pestRecommendations.get(pestProblem);
    }
}
