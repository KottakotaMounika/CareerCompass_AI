package com.mounika.careerai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "options")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String optionText;

    private int score;

    // Many options -> One Question
    @ManyToOne
    @JoinColumn(name = "question_id")
    @JsonIgnore
    private Question question;

    // Many options -> One Career
    @ManyToOne
    @JoinColumn(name = "career_id")
    private Career career;

    public Option() {}

    public Option(Long id, String optionText, int score) {
        this.id = id;
        this.optionText = optionText;
        this.score = score;
    }

    public Long getId() { return id; }

    public String getOptionText() { return optionText; }

    public int getScore() { return score; }

    public void setId(Long id) { this.id = id; }

    public void setOptionText(String optionText) { this.optionText = optionText; }

    public void setScore(int score) { this.score = score; }

    public Question getQuestion() { return question; }

    public void setQuestion(Question question) { this.question = question; }

    public Career getCareer() { return career; }

    public void setCareer(Career career) { this.career = career; }
}