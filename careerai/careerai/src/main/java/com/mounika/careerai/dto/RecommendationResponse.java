package com.mounika.careerai.dto;

import com.mounika.careerai.model.Career;
import java.util.Map;

public class RecommendationResponse {

    private Career primaryCareer;
    private Career secondaryCareer;
    private Map<String, Integer> scoreBreakdown;

    public Career getPrimaryCareer() {
        return primaryCareer;
    }

    public void setPrimaryCareer(Career primaryCareer) {
        this.primaryCareer = primaryCareer;
    }

    public Career getSecondaryCareer() {
        return secondaryCareer;
    }

    public void setSecondaryCareer(Career secondaryCareer) {
        this.secondaryCareer = secondaryCareer;
    }

    public Map<String, Integer> getScoreBreakdown() {
        return scoreBreakdown;
    }

    public void setScoreBreakdown(Map<String, Integer> scoreBreakdown) {
        this.scoreBreakdown = scoreBreakdown;
    }
}