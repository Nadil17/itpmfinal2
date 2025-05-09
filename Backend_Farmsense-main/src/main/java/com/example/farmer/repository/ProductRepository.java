package com.example.farmer.repository;
import com.example.farmer.model.Orders;
import com.example.farmer.model.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.awt.*;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUserId(Long userId);

    //get product price by product id -- Panduka
    @Query(value = "SELECT * FROM products WHERE id = ?1" , nativeQuery = true)
    Product findPriceByProductId(Integer productId);
}