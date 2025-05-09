package com.example.farmer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdersDTO {
    private int orderId;
    private int userId;
    private int productId;
    private int quantity;
    private boolean onCart; //if product is still on the cart (yes)
    private String status; //(pending , shipped , delieverd)
    private LocalDateTime orderDateTime;
}
