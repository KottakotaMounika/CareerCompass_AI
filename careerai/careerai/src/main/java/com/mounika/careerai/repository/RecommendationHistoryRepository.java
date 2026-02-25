package com.mounika.careerai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mounika.careerai.model.RecommendationHistory;

public interface RecommendationHistoryRepository 
        extends JpaRepository<RecommendationHistory, Long> {

    // Count recommendations grouped by career
    @Query("SELECT r.careerName, COUNT(r) FROM RecommendationHistory r GROUP BY r.careerName")
    List<Object[]> countCareerPopularity();

    // Total surveys taken
    long countByUsername(String username);
}