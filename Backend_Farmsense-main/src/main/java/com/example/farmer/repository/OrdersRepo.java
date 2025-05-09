package com.example.farmer.repo;

import com.example.farmer.model.Orders;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrdersRepo extends JpaRepository<Orders, Integer> {

    @Query(value = "SELECT * FROM orders WHERE user_Id = ?1" , nativeQuery = true)
    List<Orders> findCartItemsById(Integer userId);

    @Query(value = "SELECT * FROM orders WHERE on_cart = false" , nativeQuery = true)
    List<Orders> findComfirmOrders();

    //Confirm Orders by id
    @Modifying
    @Transactional
    @Query("UPDATE Orders o SET o.onCart = false , o.status = 'Pending' , o.orderDateTime = current_timestamp WHERE o.orderId = ?1")
    void confirmOrders(Integer orderId);

    //Update Order Status
    @Modifying
    @Transactional
    @Query("UPDATE Orders o SET o.status = ?2 WHERE o.orderId = ?1")
    void updateOrderStatusById(Integer orderId, String status);

    @Query(value = "SELECT * FROM orders o where o.order_date_time >= ?1 AND o.order_date_time <= ?2 AND on_cart = false" , nativeQuery = true)
    List<Orders> getDataBetweenTwoDays(LocalDateTime StartDateTime, LocalDateTime EndDateTime);
}
