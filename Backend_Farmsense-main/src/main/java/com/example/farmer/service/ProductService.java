package com.example.farmer.service;

import com.example.farmer.dto.OrdersDTO;
import com.example.farmer.dto.ProductDTO;
import com.example.farmer.model.Orders;
import com.example.farmer.model.Product;
import com.example.farmer.repository.ProductRepository;

import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    private final String uploadDir = "uploads/products/";

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!");
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    public List<Product> getLowStockProducts() {
        return productRepository.findAll().stream()
                .filter(product -> product.getStockQuantity() <= product.getMinimumStockLevel())
                .collect(Collectors.toList());
    }
    public List<Product> getProductsNearExpiry(int days) {
        LocalDate today = LocalDate.now();
        LocalDate thresholdDate = today.plusDays(days);

        return productRepository.findAll().stream()
                .filter(product -> product.getExpiryDate().isBefore(thresholdDate) && product.getExpiryDate().isAfter(today))
                .collect(Collectors.toList());
    }
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByUserId(Long userId) {
        return productRepository.findByUserId(userId);
    }

    public Product createProduct(Product product, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            try {
                Path filePath = Paths.get(uploadDir + fileName);
                Files.copy(image.getInputStream(), filePath);
                product.setImageUrl("/products/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store image file");
            }
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails, MultipartFile image) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setType(productDetails.getType());
            product.setPrice(productDetails.getPrice());
            product.setStockQuantity(productDetails.getStockQuantity());
            product.setManufacturingDate(productDetails.getManufacturingDate());
            product.setExpiryDate(productDetails.getExpiryDate());
            product.setManufacturer(productDetails.getManufacturer());
            product.setApplicationMethod(productDetails.getApplicationMethod());
            product.setSafetyInstructions(productDetails.getSafetyInstructions());
            product.setMinimumStockLevel(productDetails.getMinimumStockLevel());
            product.setActive(productDetails.getActive());
            product.setBanned(productDetails.getBanned());

            if (image != null && !image.isEmpty()) {
                if (product.getImageUrl() != null) {
                    try {
                        Files.deleteIfExists(Paths.get(uploadDir + product.getImageUrl().substring(product.getImageUrl().lastIndexOf("/") + 1)));
                    } catch (IOException e) {
                        // Log error but continue
                    }
                }

                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                try {
                    Path filePath = Paths.get(uploadDir + fileName);
                    Files.copy(image.getInputStream(), filePath);
                    product.setImageUrl("/products/" + fileName);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to store image file");
                }
            }
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public ProductDTO getCartItemsByUserId(Integer productId) {
        Product product = productRepository.findPriceByProductId(productId);
        return modelMapper.map(product,ProductDTO.class);

    }
}
