package com.example.farmer.model;



public class RecommendationRequest {
    private String farmerId;
    private String cropType;
    private String soilCondition;
    private String pestProblems;

    // Getters and Setters
    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getCropType() {
        return cropType;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public String getSoilCondition() {
        return soilCondition;
    }

    public void setSoilCondition(String soilCondition) {
        this.soilCondition = soilCondition;
    }

    public String getPestProblems() {
        return pestProblems;
    }

    public void setPestProblems(String pestProblems) {
        this.pestProblems = pestProblems;
    }
}