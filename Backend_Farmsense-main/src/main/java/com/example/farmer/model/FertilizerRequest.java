package com.example.farmer.model;

import lombok.Data;

@Data
public class FertilizerRequest {
    private String cropType;
    private String soilCondition;
    private String pestProblem;

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

    public String getPestProblem() {
        return pestProblem;
    }

    public void setPestProblem(String pestProblem) {
        this.pestProblem = pestProblem;
    }
}
