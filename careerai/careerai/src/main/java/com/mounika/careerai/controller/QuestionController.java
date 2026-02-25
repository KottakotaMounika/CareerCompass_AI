package com.mounika.careerai.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.mounika.careerai.model.Question;
import com.mounika.careerai.repository.QuestionRepository;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin
public class QuestionController {

    private final QuestionRepository questionRepository;

    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @PostMapping
    public Question createQuestion(@RequestBody Question question) {
        return questionRepository.save(question);
    }

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
}