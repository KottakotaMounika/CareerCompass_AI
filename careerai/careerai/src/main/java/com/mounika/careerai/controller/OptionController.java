package com.mounika.careerai.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.mounika.careerai.model.Option;
import com.mounika.careerai.repository.OptionRepository;

@RestController
@RequestMapping("/api/options")
@CrossOrigin
public class OptionController {

    private final OptionRepository optionRepository;

    public OptionController(OptionRepository optionRepository) {
        this.optionRepository = optionRepository;
    }

    @PostMapping
    public Option createOption(@RequestBody Option option) {
        return optionRepository.save(option);
    }

    @GetMapping
    public List<Option> getAllOptions() {
        return optionRepository.findAll();
    }
}