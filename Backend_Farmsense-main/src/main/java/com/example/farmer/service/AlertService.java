package com.example.farmer.service;



import com.example.farmer.DT.StockAlertDTO;
import com.example.farmer.Twillio.SmsService;
import com.example.farmer.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    @Autowired
    private ProductService productService;

    private SmsService smsService;

    public AlertService(ProductService productService, SmsService smsService) {
        this.productService = productService;
        this.smsService = smsService;
    }

    // Run daily at midnight
    @Scheduled(cron = "0 31 13 * * ?")



    public void checkForAlerts() {
        // Processing can be done here for notifications or emails
        smsService.sendSms(getLowStockAlerts().toString(), getExpiryAlerts().toString());
        System.out.println(getLowStockAlerts());
        System.out.println(getExpiryAlerts());

    }

    public List<StockAlertDTO> getLowStockAlerts() {
        List<Product> lowStockProducts = productService.getLowStockProducts();

        return lowStockProducts.stream()
                .map(product -> new StockAlertDTO(
                        product.getId(),
                        product.getName(),
                        "LOW_STOCK",
                        "Product is below minimum stock level",
                        product.getStockQuantity(),
                        product.getMinimumStockLevel()
                ))
                .collect(Collectors.toList());
    }

    public List<StockAlertDTO> getExpiryAlerts() {
        // Products expiring in the next 30 days
        List<Product> expiringProducts = productService.getProductsNearExpiry(30);

        return expiringProducts.stream()
                .map(product -> {
                    long daysUntilExpiry = LocalDate.now().until(product.getExpiryDate()).getDays();
                    return new StockAlertDTO(
                            product.getId(),
                            product.getName(),
                            "EXPIRING_SOON",
                            "Product expires in " + daysUntilExpiry + " days",
                            null,
                            null
                    );
                })
                .collect(Collectors.toList());
    }

    public List<StockAlertDTO> getAllAlerts() {
        List<StockAlertDTO> allAlerts = new ArrayList<>();
        allAlerts.addAll(getLowStockAlerts());
        allAlerts.addAll(getExpiryAlerts());
        return allAlerts;
    }
}
