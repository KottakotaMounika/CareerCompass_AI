package com.mounika.careerai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class RecommendationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String careerName;

    private LocalDateTime createdAt;

    public RecommendationHistory() {}

    public RecommendationHistory(String username, String careerName) {
        this.username = username;
        this.careerName = careerName;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getCareerName() {
        return careerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setCareerName(String careerName) {
        this.careerName = careerName;
    }
}