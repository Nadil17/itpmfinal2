package com.example.farmer.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/feedback-images/**")
                .addResourceLocations("file:uploads/feedback-images/")
                .setCachePeriod(3600)
                .resourceChain(true);
        registry.addResourceHandler("/products/**")
                .addResourceLocations("file:uploads/products/");
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
