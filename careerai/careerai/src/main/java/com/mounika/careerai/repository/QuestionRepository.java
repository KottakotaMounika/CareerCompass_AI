package com.mounika.careerai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mounika.careerai.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}