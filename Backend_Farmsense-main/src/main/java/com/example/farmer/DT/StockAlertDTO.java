package com.example.farmer.DT;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockAlertDTO {

    private Long productId;
    private String productName;
    private String alertType; // LOW_STOCK, EXPIRING_SOON
    private String message;
    private Integer currentStock;
    private Integer minimumStockLevel;
}