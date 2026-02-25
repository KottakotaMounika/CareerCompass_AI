package com.mounika.careerai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mounika.careerai.model.User;
import com.mounika.careerai.model.Question;
import com.mounika.careerai.model.Career;
import com.mounika.careerai.repository.UserRepository;
import com.mounika.careerai.repository.QuestionRepository;
import com.mounika.careerai.repository.RecommendationHistoryRepository;
import com.mounika.careerai.repository.CareerRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CareerRepository careerRepository;
    
    @Autowired
    private RecommendationHistoryRepository historyRepository;
    // =============================
    // 📊 DASHBOARD ANALYTICS
    // =============================

    @GetMapping("/users/count")
    public long getTotalUsers() {
        return userRepository.count();
    }

    @GetMapping("/questions/count")
    public long getTotalQuestions() {
        return questionRepository.count();
    }

    @GetMapping("/careers/count")
    public long getTotalCareers() {
        return careerRepository.count();
    }

    // =============================
    // 👥 USER MANAGEMENT
    // =============================

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "User deleted successfully!";
    }

    // =============================
    // ❓ QUESTION MANAGEMENT
    // =============================

    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @DeleteMapping("/questions/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        questionRepository.deleteById(id);
        return "Question deleted successfully!";
    }

    // =============================
    // 🎯 CAREER MANAGEMENT
    // =============================

    @GetMapping("/careers")
    public List<Career> getAllCareers() {
        return careerRepository.findAll();
    }

    @DeleteMapping("/careers/{id}")
    public String deleteCareer(@PathVariable Long id) {
        careerRepository.deleteById(id);
        return "Career deleted successfully!";
    }
    
    @GetMapping("/analytics/popular-career")
    public String getMostPopularCareer() {

        List<Object[]> results = historyRepository.countCareerPopularity();

        if (results.isEmpty()) {
            return "No Data";
        }

        Object[] top = results.get(0);

        return top[0] + " (" + top[1] + " times)";
    }
    @PostMapping("/careers")
    public Career addCareer(@RequestBody Career career) {
        return careerRepository.save(career);
    }
    @PostMapping("/questions")
    public Question addQuestion(@RequestBody Question question) {

        // Set question reference inside each option
        question.getOptions().forEach(option -> {
            option.setQuestion(question);
        });

        return questionRepository.save(question);
    }
}