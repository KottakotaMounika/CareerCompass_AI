package com.mounika.careerai.dto;

import java.util.List;

public class RecommendationRequest {

    private String username;
    private List<Long> optionIds;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Long> getOptionIds() {
        return optionIds;
    }

    public void setOptionIds(List<Long> optionIds) {
        this.optionIds = optionIds;
    }
}