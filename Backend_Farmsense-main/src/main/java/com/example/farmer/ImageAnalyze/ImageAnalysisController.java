package com.example.farmer.ImageAnalyze;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin
@RequestMapping("/auth/image")
public class ImageAnalysisController {

    private final AnthropicImageAnalysisService analysisService;

    @Autowired
    public ImageAnalysisController(AnthropicImageAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/analyze")
    public String analyzeImage(
            @RequestParam("image") MultipartFile imageFile,
            @RequestParam(value = "prompt", defaultValue = "Identify the problem in affected crop and give solution for it") String prompt)
            throws IOException {

        return analysisService.analyzeImage(imageFile, prompt);
    }
}

