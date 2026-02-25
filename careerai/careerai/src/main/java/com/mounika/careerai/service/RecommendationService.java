package com.mounika.careerai.service;

import com.mounika.careerai.model.Career;
import com.mounika.careerai.model.Option;
import com.mounika.careerai.model.RecommendationHistory;
import com.mounika.careerai.repository.OptionRepository;
import com.mounika.careerai.repository.RecommendationHistoryRepository;
import com.mounika.careerai.dto.RecommendationResponse;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationService {

    private final OptionRepository optionRepository;
    private final RecommendationHistoryRepository historyRepository;

    public RecommendationService(
            OptionRepository optionRepository,
            RecommendationHistoryRepository historyRepository) {
        this.optionRepository = optionRepository;
        this.historyRepository = historyRepository;
    }

    public RecommendationResponse recommend(String username, List<Long> optionIds) {

        Map<Career, Integer> careerScores = new HashMap<>();

        // Calculate scores
        for (Long optionId : optionIds) {
            Option option = optionRepository.findById(optionId).orElseThrow();
            Career career = option.getCareer();

            careerScores.put(
                career,
                careerScores.getOrDefault(career, 0) + option.getScore()
            );
        }

        // Sort careers by score
        List<Map.Entry<Career, Integer>> sortedCareers =
                careerScores.entrySet()
                        .stream()
                        .sorted((a, b) -> b.getValue() - a.getValue())
                        .toList();

        RecommendationResponse response = new RecommendationResponse();

        Career primaryCareer = null;

        if (!sortedCareers.isEmpty()) {
            primaryCareer = sortedCareers.get(0).getKey();
            response.setPrimaryCareer(primaryCareer);
        }

        if (sortedCareers.size() > 1) {
            response.setSecondaryCareer(sortedCareers.get(1).getKey());
        }

        // Score breakdown
        Map<String, Integer> breakdown = new HashMap<>();
        for (Map.Entry<Career, Integer> entry : sortedCareers) {
            breakdown.put(entry.getKey().getName(), entry.getValue());
        }

        response.setScoreBreakdown(breakdown);

        // ✅ SAVE RECOMMENDATION HISTORY
        if (primaryCareer != null) {
            RecommendationHistory history =
                    new RecommendationHistory(username, primaryCareer.getName());
            historyRepository.save(history);
        }

        return response;
    }
}