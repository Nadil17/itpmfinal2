package com.example.farmer.service;

import com.example.farmer.dto.OrdersDTO;
import com.example.farmer.model.Orders;
import com.example.farmer.repo.OrdersRepo;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrdersService {
    @Autowired
    private OrdersRepo ordersRepo;

    @Autowired
    private ModelMapper modelMapper;

    public OrdersDTO saveOrder(OrdersDTO ordersDTO) {
        ordersRepo.save(modelMapper.map(ordersDTO , Orders.class));
        return ordersDTO;
    }

    public List<OrdersDTO> getCartItems(Integer userId){
        List<Orders> orders = ordersRepo.findCartItemsById(userId);
        return orders.stream()
                .map(order -> modelMapper.map(order , OrdersDTO.class))
                .collect(Collectors.toList());

    }

    //If there are a existing record record it will be updated (upsert)
    public OrdersDTO confirmOrderById(OrdersDTO ordersDTO){
        ordersRepo.confirmOrders(ordersDTO.getOrderId());

        Orders confirmOrder = ordersRepo.findById(ordersDTO.getOrderId()).orElseThrow(() -> new RuntimeException("Order not found"));
        return modelMapper.map(confirmOrder , OrdersDTO.class);
    }


    public List<OrdersDTO> getConfirmOrders(){
        List<Orders> orders = ordersRepo.findComfirmOrders();
        return orders.stream()
                .map(order -> modelMapper.map(order , OrdersDTO.class))
                .collect(Collectors.toList());
    }

    //Update Order Status from seller side (Pending , Shippered ,Deilivered)
    public OrdersDTO updateOrderStatus(OrdersDTO ordersDTO){
        ordersRepo.updateOrderStatusById(ordersDTO.getOrderId(), ordersDTO.getStatus());
        // Fetch and return the updated order as a DTO
        Orders updatedOrder = ordersRepo.findById(ordersDTO.getOrderId()).orElseThrow(() -> new RuntimeException("Order not found"));
        return modelMapper.map(updatedOrder, OrdersDTO.class);
    }

    //Remove Item from cart
    public String removeItemFromCart(OrdersDTO ordersDTO){
        ordersRepo.delete(modelMapper.map(ordersDTO , Orders.class));
        return "Item Removed";
    }

    //Get orders data between two days to generate report
    public List<OrdersDTO> getDataBetweenTwoDays(LocalDateTime StartingDate , LocalDateTime EndingDate){
        List<Orders> orders = ordersRepo.getDataBetweenTwoDays(StartingDate , EndingDate);
        return orders.stream()
                .map(order -> modelMapper.map(order , OrdersDTO.class))
                .collect(Collectors.toList());
    }
}
