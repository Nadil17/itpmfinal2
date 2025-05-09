package com.example.farmer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private String type; // FERTILIZER, PESTICIDE, CHEMICAL, OTHER
    private BigDecimal price;
    private Integer stockQuantity;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private String manufacturer;
    private String applicationMethod;
    private String safetyInstructions;
    private Integer minimumStockLevel = 10;
    private Boolean active = true;
    private Boolean banned = false;
}

