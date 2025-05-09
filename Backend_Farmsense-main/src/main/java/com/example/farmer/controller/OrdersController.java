package com.example.farmer.controller;

import com.example.farmer.dto.OrdersDTO;
import com.example.farmer.model.Orders;
import com.example.farmer.service.OrdersService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/orders")
public class OrdersController {
    private final OrdersService ordersService;

    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    //For test
    @GetMapping("/")
    public String getTest(){
        return "Backend is running";
    }

    @PostMapping("/addOrder")
    public OrdersDTO saveOrder(@RequestBody OrdersDTO ordersDTO) {
        return ordersService.saveOrder(ordersDTO);
    }

    //To get items on cart by user id
    @GetMapping("/getCartItems/{userId}")
    public List<OrdersDTO> getCartItemsByUserId(@PathVariable Integer userId){
        return ordersService.getCartItems(userId);
    }

    //Update On cart status by ID
    @PutMapping("/confirmOrderById")
    public OrdersDTO confirmOrderById(@RequestBody OrdersDTO ordersDTO){
        return ordersService.confirmOrderById(ordersDTO);
    }

    //Get Confirm Orders
    @GetMapping("/getConfirmOrders")
    public List<OrdersDTO> getConfirmOrders(){
        return ordersService.getConfirmOrders();
    }

    //Update Order Status from seller side (Pending , Shippered ,Deilivered)
    @PutMapping("/updateOrderStatus")
    public OrdersDTO updateOrderStatus(@RequestBody OrdersDTO ordersDTO){
        return ordersService.updateOrderStatus(ordersDTO);
    }

    //Remove Item from cart
    @DeleteMapping("/removeItem")
    public String removeItemFromCart(@RequestBody OrdersDTO ordersDTO){
        return ordersService.removeItemFromCart(ordersDTO);
    }

    //Get orders data between two days to generate report
    @GetMapping("getDataBetweenTwoDays/{StartingDate}/{EndingDate}")
    public List<OrdersDTO> getDataBetweenTwoDays(@PathVariable LocalDateTime StartingDate, @PathVariable LocalDateTime EndingDate){
        return ordersService.getDataBetweenTwoDays(StartingDate , EndingDate);
    }
}
